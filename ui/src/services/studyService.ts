/**
 * Study Service
 * 
 * CRUD operations for managing studies.
 * 
 * **Validates: Requirements 1.1, 1.2, 1.4, 1.5**
 * - 1.1: Create a study with name and product identifier
 * - 1.2: Optionally associate study with a feature identifier
 * - 1.4: Edit study name, product identifier, and feature identifier
 * - 1.5: Archive a study (soft delete)
 */

import { Study } from '../../../api/types';
import {
  STORAGE_KEYS,
  getAll,
  getById,
  save,
  update,
  remove,
  generateId,
  StorageResult
} from './storage';

/**
 * Creates a new study with the given name, product identifier, and optional feature identifier.
 * Generates a unique ID and sets creation/update timestamps.
 * 
 * @param name - The study name
 * @param productId - The product identifier
 * @param featureId - Optional feature identifier
 * @returns The created Study object, or null if creation failed
 * 
 * **Validates: Requirements 1.1, 1.2**
 * 
 * @example
 * const study = createStudy('Checkout Flow Study', 'ecommerce-app', 'checkout');
 * if (study) {
 *   console.log(`Created study with ID: ${study.id}`);
 * }
 */
export function createStudy(
  name: string, 
  productId: string, 
  featureId?: string
): Study | null {
  const now = new Date().toISOString();
  
  const study: Study = {
    id: generateId('study'),
    name: name.trim(),
    productId: productId.trim(),
    featureId: featureId?.trim() || null,
    createdAt: now,
    updatedAt: now,
    archived: false,
  };

  const result = save<Study>(STORAGE_KEYS.STUDIES, study);
  
  if (!result.success) {
    console.error('Failed to create study:', result.error);
    return null;
  }

  return study;
}

/**
 * Retrieves all studies from storage.
 * 
 * @returns Array of all Study objects
 * 
 * **Validates: Requirements 1.3** (view list of all studies)
 * 
 * @example
 * const studies = getAllStudies();
 * console.log(`Total studies: ${studies.length}`);
 */
export function getAllStudies(): Study[] {
  return getAll<Study>(STORAGE_KEYS.STUDIES);
}

/**
 * Retrieves a single study by its ID.
 * 
 * @param id - The unique identifier of the study
 * @returns The Study object if found, undefined otherwise
 * 
 * @example
 * const study = getStudyById('study-123');
 * if (study) {
 *   console.log(`Found: ${study.name}`);
 * }
 */
export function getStudyById(id: string): Study | undefined {
  return getById<Study>(STORAGE_KEYS.STUDIES, id);
}

/**
 * Retrieves all active (non-archived) studies.
 * Useful for displaying only current studies in the UI.
 * 
 * @returns Array of Study objects that are not archived
 * 
 * @example
 * const activeStudies = getActiveStudies();
 * console.log(`Active studies: ${activeStudies.length}`);
 */
export function getActiveStudies(): Study[] {
  const allStudies = getAllStudies();
  return allStudies.filter(study => !study.archived);
}

/**
 * Retrieves all archived studies.
 * Useful for displaying archived studies separately in the UI.
 * 
 * @returns Array of Study objects that are archived
 * 
 * @example
 * const archivedStudies = getArchivedStudies();
 * console.log(`Archived studies: ${archivedStudies.length}`);
 */
export function getArchivedStudies(): Study[] {
  const allStudies = getAllStudies();
  return allStudies.filter(study => study.archived);
}

/**
 * Updates an existing study's details.
 * Only the provided fields will be updated; others remain unchanged.
 * Automatically updates the updatedAt timestamp.
 * 
 * @param id - The unique identifier of the study to update
 * @param updates - Partial Study object with fields to update
 * @returns StorageResult indicating success or failure
 * 
 * **Validates: Requirements 1.4**
 * 
 * @example
 * const result = updateStudy('study-123', { name: 'Updated Study Name' });
 * if (result.success) {
 *   console.log('Study updated successfully');
 * } else {
 *   console.error(result.error);
 * }
 */
export function updateStudy(id: string, updates: Partial<Study>): StorageResult {
  const existingStudy = getStudyById(id);
  
  if (!existingStudy) {
    return {
      success: false,
      error: `Study with id "${id}" not found.`,
    };
  }

  // Merge updates with existing study, preserving id and createdAt
  const updatedStudy: Study = {
    ...existingStudy,
    ...updates,
    id: existingStudy.id, // Ensure ID cannot be changed
    createdAt: existingStudy.createdAt, // Ensure createdAt cannot be changed
    updatedAt: new Date().toISOString(), // Always update the timestamp
  };

  // Trim string fields if they were updated
  if (updates.name !== undefined) {
    updatedStudy.name = updatedStudy.name.trim();
  }
  if (updates.productId !== undefined) {
    updatedStudy.productId = updatedStudy.productId.trim();
  }
  if (updates.featureId !== undefined && updates.featureId !== null) {
    updatedStudy.featureId = updates.featureId.trim() || null;
  }

  return update<Study>(STORAGE_KEYS.STUDIES, id, updatedStudy);
}

/**
 * Archives a study (soft delete).
 * Sets the archived flag to true and updates the timestamp.
 * The study data is preserved but marked as inactive.
 * 
 * @param id - The unique identifier of the study to archive
 * @returns StorageResult indicating success or failure
 * 
 * **Validates: Requirements 1.5**
 * 
 * @example
 * const result = archiveStudy('study-123');
 * if (result.success) {
 *   console.log('Study archived successfully');
 * } else {
 *   console.error(result.error);
 * }
 */
export function archiveStudy(id: string): StorageResult {
  return updateStudy(id, { archived: true });
}

/**
 * Unarchives a study, making it active again.
 * Sets the archived flag to false and updates the timestamp.
 * 
 * @param id - The unique identifier of the study to unarchive
 * @returns StorageResult indicating success or failure
 * 
 * @example
 * const result = unarchiveStudy('study-123');
 * if (result.success) {
 *   console.log('Study unarchived successfully');
 * } else {
 *   console.error(result.error);
 * }
 */
export function unarchiveStudy(id: string): StorageResult {
  return updateStudy(id, { archived: false });
}

/**
 * Gets studies formatted for dropdown selection.
 * Returns an array of objects with id and display label.
 *
 * @param includeArchived - Whether to include archived studies (default: false)
 * @returns Array of objects with id and label properties
 *
 * @example
 * const options = getStudiesForDropdown();
 * // Returns: [{ id: 'study-123', label: 'Checkout Flow Study' }, ...]
 */
export function getStudiesForDropdown(
  includeArchived: boolean = false
): Array<{ id: string; label: string }> {
  const studies = includeArchived ? getAllStudies() : getActiveStudies();
  return studies.map(study => ({
    id: study.id,
    label: study.name,
  }));
}

/**
 * Permanently deletes a study from storage.
 * WARNING: This is a hard delete and cannot be undone.
 * Consider using archiveStudy() for soft deletion instead.
 *
 * @param id - The unique identifier of the study to delete
 * @returns StorageResult indicating success or failure
 *
 * @example
 * const result = deleteStudy('study-123');
 * if (result.success) {
 *   console.log('Study deleted permanently');
 * } else {
 *   console.error(result.error);
 * }
 */
export function deleteStudy(id: string): StorageResult {
  const existingStudy = getStudyById(id);

  if (!existingStudy) {
    return {
      success: false,
      error: `Study with id "${id}" not found.`,
    };
  }

  return remove(STORAGE_KEYS.STUDIES, id);
}
