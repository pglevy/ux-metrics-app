/**
 * Person Service
 * 
 * CRUD operations for managing people (participants, facilitators, observers).
 * 
 * **Validates: Requirements 2.5.1, 2.5.2, 2.5.3**
 * - 2.5.1: Create people with name and role
 * - 2.5.2: View list of all people
 * - 2.5.3: Edit person name and role
 */

import { Person, PersonRole, Session } from '../../../api/types';
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
 * Creates a new person with the given name and role.
 * Generates a unique ID and sets the creation timestamp.
 * 
 * @param name - The person's name
 * @param role - The person's role (participant, facilitator, or observer)
 * @returns The created Person object, or null if creation failed
 * 
 * **Validates: Requirements 2.5.1**
 * 
 * @example
 * const person = createPerson('John Doe', 'participant');
 * if (person) {
 *   console.log(`Created person with ID: ${person.id}`);
 * }
 */
export function createPerson(name: string, role: PersonRole): Person | null {
  const person: Person = {
    id: generateId('person'),
    name: name.trim(),
    role,
    createdAt: new Date().toISOString(),
  };

  const result = save<Person>(STORAGE_KEYS.PEOPLE, person);
  
  if (!result.success) {
    console.error('Failed to create person:', result.error);
    return null;
  }

  return person;
}

/**
 * Retrieves all people from storage.
 * 
 * @returns Array of all Person objects
 * 
 * **Validates: Requirements 2.5.2**
 * 
 * @example
 * const people = getAllPeople();
 * console.log(`Total people: ${people.length}`);
 */
export function getAllPeople(): Person[] {
  return getAll<Person>(STORAGE_KEYS.PEOPLE);
}

/**
 * Retrieves a single person by their ID.
 * 
 * @param id - The unique identifier of the person
 * @returns The Person object if found, undefined otherwise
 * 
 * @example
 * const person = getPersonById('person-123');
 * if (person) {
 *   console.log(`Found: ${person.name}`);
 * }
 */
export function getPersonById(id: string): Person | undefined {
  return getById<Person>(STORAGE_KEYS.PEOPLE, id);
}

/**
 * Retrieves all people with a specific role.
 * Useful for populating dropdown selectors in session forms.
 * 
 * @param role - The role to filter by (participant, facilitator, or observer)
 * @returns Array of Person objects with the specified role
 * 
 * **Validates: Requirements 2.5.2, 2.6** (filtering for dropdowns)
 * 
 * @example
 * const participants = getByRole('participant');
 * const facilitators = getByRole('facilitator');
 * const observers = getByRole('observer');
 */
export function getByRole(role: PersonRole): Person[] {
  const allPeople = getAllPeople();
  return allPeople.filter(person => person.role === role);
}

/**
 * Updates an existing person's details.
 * Only the provided fields will be updated; others remain unchanged.
 * 
 * @param id - The unique identifier of the person to update
 * @param updates - Partial Person object with fields to update
 * @returns StorageResult indicating success or failure
 * 
 * **Validates: Requirements 2.5.3**
 * 
 * @example
 * const result = updatePerson('person-123', { name: 'Jane Doe' });
 * if (result.success) {
 *   console.log('Person updated successfully');
 * } else {
 *   console.error(result.error);
 * }
 */
export function updatePerson(id: string, updates: Partial<Person>): StorageResult {
  const existingPerson = getPersonById(id);
  
  if (!existingPerson) {
    return {
      success: false,
      error: `Person with id "${id}" not found.`,
    };
  }

  // Merge updates with existing person, preserving id and createdAt
  const updatedPerson: Person = {
    ...existingPerson,
    ...updates,
    id: existingPerson.id, // Ensure ID cannot be changed
    createdAt: existingPerson.createdAt, // Ensure createdAt cannot be changed
  };

  // Trim name if it was updated
  if (updates.name !== undefined) {
    updatedPerson.name = updatedPerson.name.trim();
  }

  return update<Person>(STORAGE_KEYS.PEOPLE, id, updatedPerson);
}

/**
 * Deletes a person from storage.
 * Note: Callers should check for session references before calling this function.
 * 
 * @param id - The unique identifier of the person to delete
 * @returns StorageResult indicating success or failure
 * 
 * @example
 * const result = deletePerson('person-123');
 * if (result.success) {
 *   console.log('Person deleted successfully');
 * } else {
 *   console.error(result.error);
 * }
 */
export function deletePerson(id: string): StorageResult {
  return remove(STORAGE_KEYS.PEOPLE, id);
}

/**
 * Checks if a person is referenced by any session.
 * A person is considered referenced if they are a participant, facilitator,
 * or observer in any session.
 * 
 * @param id - The unique identifier of the person to check
 * @returns true if the person is referenced by any session, false otherwise
 * 
 * **Validates: Requirements 2.5.4** - Check for session references before deletion
 * 
 * @example
 * if (isPersonReferenced('person-123')) {
 *   console.log('Cannot delete: person is used in sessions');
 * }
 */
export function isPersonReferenced(id: string): boolean {
  const sessions = getAll<Session>(STORAGE_KEYS.SESSIONS);
  
  return sessions.some(session => 
    session.participantId === id ||
    session.facilitatorId === id ||
    (session.observerIds && session.observerIds.includes(id))
  );
}

/**
 * Safely deletes a person from storage after checking for session references.
 * Prevents deletion if the person is referenced by any session as a participant,
 * facilitator, or observer.
 * 
 * @param id - The unique identifier of the person to delete
 * @returns StorageResult indicating success or failure with appropriate error message
 * 
 * **Validates: Requirements 2.5.4** - Prevent deletion if person is referenced by any session
 * 
 * @example
 * const result = safeDeletePerson('person-123');
 * if (result.success) {
 *   console.log('Person deleted successfully');
 * } else {
 *   // result.error will contain message about session references
 *   console.error(result.error);
 * }
 */
export function safeDeletePerson(id: string): StorageResult {
  // First check if the person exists
  const person = getPersonById(id);
  if (!person) {
    return {
      success: false,
      error: `Person with id "${id}" not found.`,
    };
  }

  // Check if person is referenced by any session
  if (isPersonReferenced(id)) {
    return {
      success: false,
      error: `Cannot delete "${person.name}". This person is referenced by one or more sessions. Remove them from all sessions before deleting.`,
    };
  }

  // Safe to delete
  return remove(STORAGE_KEYS.PEOPLE, id);
}

/**
 * Gets people formatted for dropdown selection.
 * Returns an array of objects with id and display label.
 * 
 * @param role - Optional role to filter by
 * @returns Array of objects with id and label properties
 * 
 * @example
 * const options = getPeopleForDropdown('participant');
 * // Returns: [{ id: 'person-123', label: 'John Doe' }, ...]
 */
export function getPeopleForDropdown(role?: PersonRole): Array<{ id: string; label: string }> {
  const people = role ? getByRole(role) : getAllPeople();
  return people.map(person => ({
    id: person.id,
    label: person.name,
  }));
}
