/**
 * Storage Service
 * 
 * Generic CRUD operations for browser localStorage persistence.
 * Provides type-safe operations with error handling and confirmation.
 * 
 * **Validates: Requirements 12.1, 12.2, 12.3**
 * - 12.1: All data persists in browser local storage
 * - 12.2: Data survives browser refresh
 * - 12.3: Save confirmation or error message displayed
 */

/**
 * Result type for storage operations that can succeed or fail.
 * Provides consistent error handling across all operations.
 */
export interface StorageResult<T = void> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Interface for entities that have an id field.
 * All entities stored must have a unique string identifier.
 */
interface HasId {
  id: string;
}

/**
 * Storage key constants for different entity types.
 * Use these constants when calling storage methods to ensure consistency.
 */
export const STORAGE_KEYS = {
  STUDIES: 'ux-metrics-studies',
  SESSIONS: 'ux-metrics-sessions',
  PEOPLE: 'ux-metrics-people',
  ASSESSMENT_TYPES: 'ux-metrics-assessment-types',
  ASSESSMENT_RESPONSES: 'ux-metrics-assessment-responses',
  REPORTS: 'ux-metrics-reports',
} as const;

/**
 * Retrieves all items of a given type from localStorage.
 * 
 * @param key - The localStorage key to retrieve from
 * @returns Array of items, or empty array if key doesn't exist or on error
 * 
 * @example
 * const studies = getAll<Study>(STORAGE_KEYS.STUDIES);
 */
export function getAll<T>(key: string): T[] {
  try {
    const data = localStorage.getItem(key);
    if (!data) {
      return [];
    }
    const parsed = JSON.parse(data);
    if (!Array.isArray(parsed)) {
      console.warn(`Storage key "${key}" contains non-array data, returning empty array`);
      return [];
    }
    return parsed as T[];
  } catch (error) {
    console.error(`Error reading from localStorage key "${key}":`, error);
    return [];
  }
}

/**
 * Retrieves a single item by its ID from localStorage.
 * 
 * @param key - The localStorage key to search in
 * @param id - The unique identifier of the item to find
 * @returns The item if found, undefined otherwise
 * 
 * @example
 * const study = getById<Study>(STORAGE_KEYS.STUDIES, 'study-123');
 */
export function getById<T extends HasId>(key: string, id: string): T | undefined {
  try {
    const items = getAll<T>(key);
    return items.find(item => item.id === id);
  } catch (error) {
    console.error(`Error finding item with id "${id}" in key "${key}":`, error);
    return undefined;
  }
}

/**
 * Saves a new item to localStorage.
 * Appends the item to the existing array for the given key.
 * 
 * @param key - The localStorage key to save to
 * @param item - The item to save (must have an id property)
 * @returns StorageResult indicating success or failure with error message
 * 
 * @example
 * const result = save<Study>(STORAGE_KEYS.STUDIES, newStudy);
 * if (!result.success) {
 *   showError(result.error);
 * }
 */
export function save<T extends HasId>(key: string, item: T): StorageResult {
  try {
    const items = getAll<T>(key);
    
    // Check for duplicate ID
    const existingIndex = items.findIndex(existing => existing.id === item.id);
    if (existingIndex !== -1) {
      return {
        success: false,
        error: `Item with id "${item.id}" already exists. Use update() to modify existing items.`,
      };
    }
    
    items.push(item);
    localStorage.setItem(key, JSON.stringify(items));
    
    return { success: true };
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    console.error(`Error saving item to key "${key}":`, error);
    return {
      success: false,
      error: `Failed to save: ${errorMessage}`,
    };
  }
}

/**
 * Updates an existing item in localStorage.
 * Replaces the item with matching ID with the new data.
 * 
 * @param key - The localStorage key containing the item
 * @param id - The unique identifier of the item to update
 * @param item - The updated item data
 * @returns StorageResult indicating success or failure with error message
 * 
 * @example
 * const result = update<Study>(STORAGE_KEYS.STUDIES, 'study-123', updatedStudy);
 * if (!result.success) {
 *   showError(result.error);
 * }
 */
export function update<T extends HasId>(key: string, id: string, item: T): StorageResult {
  try {
    const items = getAll<T>(key);
    const index = items.findIndex(existing => existing.id === id);
    
    if (index === -1) {
      return {
        success: false,
        error: `Item with id "${id}" not found.`,
      };
    }
    
    // Ensure the item's id matches the provided id
    const updatedItem = { ...item, id };
    items[index] = updatedItem;
    localStorage.setItem(key, JSON.stringify(items));
    
    return { success: true };
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    console.error(`Error updating item with id "${id}" in key "${key}":`, error);
    return {
      success: false,
      error: `Failed to update: ${errorMessage}`,
    };
  }
}

/**
 * Deletes an item from localStorage by its ID.
 * 
 * @param key - The localStorage key containing the item
 * @param id - The unique identifier of the item to delete
 * @returns StorageResult indicating success or failure with error message
 * 
 * @example
 * const result = remove(STORAGE_KEYS.STUDIES, 'study-123');
 * if (!result.success) {
 *   showError(result.error);
 * }
 */
export function remove(key: string, id: string): StorageResult {
  try {
    const items = getAll<HasId>(key);
    const index = items.findIndex(item => item.id === id);
    
    if (index === -1) {
      return {
        success: false,
        error: `Item with id "${id}" not found.`,
      };
    }
    
    items.splice(index, 1);
    localStorage.setItem(key, JSON.stringify(items));
    
    return { success: true };
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    console.error(`Error deleting item with id "${id}" from key "${key}":`, error);
    return {
      success: false,
      error: `Failed to delete: ${errorMessage}`,
    };
  }
}

/**
 * Saves multiple items to localStorage, replacing all existing items for the key.
 * Useful for bulk operations or restoring from backup.
 * 
 * @param key - The localStorage key to save to
 * @param items - Array of items to save
 * @returns StorageResult indicating success or failure with error message
 * 
 * @example
 * const result = saveAll<Study>(STORAGE_KEYS.STUDIES, studies);
 */
export function saveAll<T>(key: string, items: T[]): StorageResult {
  try {
    localStorage.setItem(key, JSON.stringify(items));
    return { success: true };
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    console.error(`Error saving items to key "${key}":`, error);
    return {
      success: false,
      error: `Failed to save: ${errorMessage}`,
    };
  }
}

/**
 * Clears all items for a given key.
 * 
 * @param key - The localStorage key to clear
 * @returns StorageResult indicating success or failure
 * 
 * @example
 * const result = clear(STORAGE_KEYS.STUDIES);
 */
export function clear(key: string): StorageResult {
  try {
    localStorage.removeItem(key);
    return { success: true };
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    console.error(`Error clearing key "${key}":`, error);
    return {
      success: false,
      error: `Failed to clear: ${errorMessage}`,
    };
  }
}

/**
 * Clears all application data from localStorage.
 * Uses the predefined STORAGE_KEYS to ensure only app data is cleared.
 * 
 * @returns StorageResult indicating success or failure
 * 
 * @example
 * const result = clearAll();
 * if (result.success) {
 *   showMessage('All data cleared');
 * }
 */
export function clearAll(): StorageResult {
  try {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
    return { success: true };
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    console.error('Error clearing all storage:', error);
    return {
      success: false,
      error: `Failed to clear all data: ${errorMessage}`,
    };
  }
}

/**
 * Checks if localStorage is available and working.
 * Useful for detecting private browsing mode or storage quota issues.
 * 
 * @returns true if localStorage is available, false otherwise
 * 
 * @example
 * if (!isStorageAvailable()) {
 *   showWarning('Local storage is not available. Data will not persist.');
 * }
 */
export function isStorageAvailable(): boolean {
  try {
    const testKey = '__storage_test__';
    localStorage.setItem(testKey, 'test');
    localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

/**
 * Gets the approximate storage usage for the application.
 * 
 * @returns Object with used bytes and formatted string
 * 
 * @example
 * const usage = getStorageUsage();
 * console.log(`Storage used: ${usage.formatted}`);
 */
export function getStorageUsage(): { bytes: number; formatted: string } {
  let totalBytes = 0;
  
  Object.values(STORAGE_KEYS).forEach(key => {
    const data = localStorage.getItem(key);
    if (data) {
      // Approximate size in bytes (2 bytes per character for UTF-16)
      totalBytes += data.length * 2;
    }
  });
  
  return {
    bytes: totalBytes,
    formatted: formatBytes(totalBytes),
  };
}

/**
 * Generates a unique ID for new entities.
 * Uses a combination of timestamp and random string for uniqueness.
 * 
 * @param prefix - Optional prefix for the ID (e.g., 'study', 'session')
 * @returns A unique string identifier
 * 
 * @example
 * const id = generateId('study'); // 'study-1706123456789-abc123'
 */
export function generateId(prefix?: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return prefix ? `${prefix}-${timestamp}-${random}` : `${timestamp}-${random}`;
}

/**
 * Helper function to extract error message from unknown error type.
 */
function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    // Handle quota exceeded error specifically
    if (error.name === 'QuotaExceededError') {
      return 'Storage quota exceeded. Please export and clear some data.';
    }
    return error.message;
  }
  return 'An unknown error occurred';
}

/**
 * Helper function to format bytes into human-readable string.
 */
function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}
