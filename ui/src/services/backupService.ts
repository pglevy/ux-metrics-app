/**
 * Backup Service
 * 
 * Provides data backup and restore functionality via JSON file export/import.
 * 
 * **Validates: Requirements 12.4**
 * - 12.4: Manual export/import (download JSON file, upload to restore)
 */

import { 
  DataExport, 
  Study, 
  Session, 
  Person, 
  AssessmentType, 
  AssessmentResponse 
} from '../../../api/types';
import { STORAGE_KEYS, getAll, clearAll, saveAll, StorageResult } from './storage';

/**
 * Current version of the backup format.
 * Used for future compatibility checks during import.
 */
const BACKUP_VERSION = '1.0.0';

/**
 * Result type for import operations.
 */
export interface ImportResult extends StorageResult {
  /** Number of entities imported by type */
  counts?: {
    studies: number;
    sessions: number;
    people: number;
    assessmentTypes: number;
    assessmentResponses: number;
  };
}

/**
 * Gathers all data from localStorage and creates a DataExport object.
 * 
 * @returns DataExport object containing all application data with metadata
 */
export function gatherAllData(): DataExport {
  const studies = getAll<Study>(STORAGE_KEYS.STUDIES);
  const sessions = getAll<Session>(STORAGE_KEYS.SESSIONS);
  const people = getAll<Person>(STORAGE_KEYS.PEOPLE);
  const assessmentTypes = getAll<AssessmentType>(STORAGE_KEYS.ASSESSMENT_TYPES);
  const assessmentResponses = getAll<AssessmentResponse>(STORAGE_KEYS.ASSESSMENT_RESPONSES);

  return {
    exportedAt: new Date().toISOString(),
    version: BACKUP_VERSION,
    studies,
    sessions,
    people,
    assessmentTypes,
    assessmentResponses,
  };
}

/**
 * Exports all application data as a downloadable JSON file.
 * Creates a blob from the data and triggers a browser download.
 * 
 * @returns StorageResult indicating success or failure
 * 
 * @example
 * const result = exportAllData();
 * if (result.success) {
 *   showMessage('Data exported successfully');
 * } else {
 *   showError(result.error);
 * }
 */
export function exportAllData(): StorageResult {
  try {
    const data = gatherAllData();
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    
    // Create download link
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    
    // Generate filename with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    link.download = `ux-metrics-backup-${timestamp}.json`;
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('Error exporting data:', error);
    return {
      success: false,
      error: `Failed to export data: ${errorMessage}`,
    };
  }
}

/**
 * Validates the structure of imported data.
 * Checks that the data has the expected format and required fields.
 * 
 * @param data - The parsed JSON data to validate
 * @returns Object with isValid flag and optional error message
 */
function validateImportData(data: unknown): { isValid: boolean; error?: string } {
  if (!data || typeof data !== 'object') {
    return { isValid: false, error: 'Invalid data format: expected an object' };
  }

  const exportData = data as Record<string, unknown>;

  // Check for required metadata fields
  if (typeof exportData.exportedAt !== 'string') {
    return { isValid: false, error: 'Invalid data format: missing or invalid exportedAt timestamp' };
  }

  if (typeof exportData.version !== 'string') {
    return { isValid: false, error: 'Invalid data format: missing or invalid version' };
  }

  // Validate arrays if present
  const arrayFields = ['studies', 'sessions', 'people', 'assessmentTypes', 'assessmentResponses'];
  for (const field of arrayFields) {
    if (exportData[field] !== undefined && !Array.isArray(exportData[field])) {
      return { isValid: false, error: `Invalid data format: ${field} must be an array` };
    }
  }

  // Validate that entities have required id fields
  const validateEntities = (entities: unknown[], fieldName: string): { isValid: boolean; error?: string } => {
    for (let i = 0; i < entities.length; i++) {
      const entity = entities[i] as Record<string, unknown>;
      if (!entity || typeof entity !== 'object') {
        return { isValid: false, error: `Invalid ${fieldName}[${i}]: expected an object` };
      }
      if (typeof entity.id !== 'string' || entity.id.trim() === '') {
        return { isValid: false, error: `Invalid ${fieldName}[${i}]: missing or invalid id` };
      }
    }
    return { isValid: true };
  };

  // Validate each entity array
  if (exportData.studies) {
    const result = validateEntities(exportData.studies as unknown[], 'studies');
    if (!result.isValid) return result;
  }

  if (exportData.sessions) {
    const result = validateEntities(exportData.sessions as unknown[], 'sessions');
    if (!result.isValid) return result;
  }

  if (exportData.people) {
    const result = validateEntities(exportData.people as unknown[], 'people');
    if (!result.isValid) return result;
  }

  if (exportData.assessmentTypes) {
    const result = validateEntities(exportData.assessmentTypes as unknown[], 'assessmentTypes');
    if (!result.isValid) return result;
  }

  if (exportData.assessmentResponses) {
    const result = validateEntities(exportData.assessmentResponses as unknown[], 'assessmentResponses');
    if (!result.isValid) return result;
  }

  return { isValid: true };
}

/**
 * Imports data from a JSON file, replacing all existing data.
 * Reads the file, validates its structure, clears existing data, and restores from backup.
 * 
 * @param file - The File object from a file input element
 * @returns Promise<ImportResult> indicating success or failure with counts
 * 
 * @example
 * const fileInput = document.getElementById('import-file') as HTMLInputElement;
 * const file = fileInput.files?.[0];
 * if (file) {
 *   const result = await importData(file);
 *   if (result.success) {
 *     showMessage(`Imported ${result.counts?.studies} studies`);
 *   } else {
 *     showError(result.error);
 *   }
 * }
 */
export async function importData(file: File): Promise<ImportResult> {
  try {
    // Validate file type
    if (!file.name.endsWith('.json') && file.type !== 'application/json') {
      return {
        success: false,
        error: 'Invalid file type: please select a JSON file',
      };
    }

    // Read file content
    const text = await file.text();
    
    // Parse JSON
    let data: unknown;
    try {
      data = JSON.parse(text);
    } catch {
      return {
        success: false,
        error: 'Invalid JSON: the file contains malformed JSON data',
      };
    }

    // Validate data structure
    const validation = validateImportData(data);
    if (!validation.isValid) {
      return {
        success: false,
        error: validation.error,
      };
    }

    const exportData = data as DataExport;

    // Clear existing data
    const clearResult = clearAll();
    if (!clearResult.success) {
      return {
        success: false,
        error: `Failed to clear existing data: ${clearResult.error}`,
      };
    }

    // Restore data from backup
    const studies = exportData.studies || [];
    const sessions = exportData.sessions || [];
    const people = exportData.people || [];
    const assessmentTypes = exportData.assessmentTypes || [];
    const assessmentResponses = exportData.assessmentResponses || [];

    // Save all data
    const saveResults = [
      saveAll<Study>(STORAGE_KEYS.STUDIES, studies),
      saveAll<Session>(STORAGE_KEYS.SESSIONS, sessions),
      saveAll<Person>(STORAGE_KEYS.PEOPLE, people),
      saveAll<AssessmentType>(STORAGE_KEYS.ASSESSMENT_TYPES, assessmentTypes),
      saveAll<AssessmentResponse>(STORAGE_KEYS.ASSESSMENT_RESPONSES, assessmentResponses),
    ];

    // Check for any save failures
    const failedSave = saveResults.find(result => !result.success);
    if (failedSave) {
      return {
        success: false,
        error: `Failed to restore data: ${failedSave.error}`,
      };
    }

    return {
      success: true,
      counts: {
        studies: studies.length,
        sessions: sessions.length,
        people: people.length,
        assessmentTypes: assessmentTypes.length,
        assessmentResponses: assessmentResponses.length,
      },
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('Error importing data:', error);
    return {
      success: false,
      error: `Failed to import data: ${errorMessage}`,
    };
  }
}
