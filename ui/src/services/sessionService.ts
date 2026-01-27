/**
 * Session Service
 * 
 * CRUD operations for managing sessions within studies.
 * 
 * **Validates: Requirements 2.1, 2.3, 2.4, 2.5**
 * - 2.1: Create a session with participant and facilitator
 * - 2.3: Session has unique identifier and timestamps
 * - 2.4: View list of sessions within a study
 * - 2.5: Filter sessions by participant, facilitator, date range
 */

import { Session, SessionStatus } from '../../../api/types';
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
 * Filter options for querying sessions.
 */
export interface SessionFilters {
  studyId?: string;
  participantId?: string;
  facilitatorId?: string;
  dateFrom?: string;
  dateTo?: string;
  status?: SessionStatus;
}

/**
 * Creates a new session with the given study, participant, and facilitator.
 * Generates a unique ID and sets creation timestamp.
 * 
 * @param studyId - The study identifier (required)
 * @param participantId - The participant identifier (required)
 * @param facilitatorId - The facilitator identifier (required)
 * @param observerIds - Optional array of observer identifiers
 * @param scheduledAt - Optional scheduled date/time for the session
 * @returns The created Session object, or null if creation failed
 * 
 * **Validates: Requirements 2.1, 2.2, 2.3**
 * 
 * @example
 * const session = createSession('study-123', 'participant-456', 'facilitator-789');
 * if (session) {
 *   console.log(`Created session with ID: ${session.id}`);
 * }
 */
export function createSession(
  studyId: string,
  participantId: string,
  facilitatorId: string,
  observerIds?: string[],
  scheduledAt?: string
): Session | null {
  // Validate required fields
  if (!studyId || !studyId.trim()) {
    console.error('createSession: studyId is required');
    return null;
  }
  if (!participantId || !participantId.trim()) {
    console.error('createSession: participantId is required');
    return null;
  }
  if (!facilitatorId || !facilitatorId.trim()) {
    console.error('createSession: facilitatorId is required');
    return null;
  }

  const now = new Date().toISOString();
  
  const session: Session = {
    id: generateId('session'),
    studyId: studyId.trim(),
    participantId: participantId.trim(),
    facilitatorId: facilitatorId.trim(),
    observerIds: observerIds?.map(id => id.trim()).filter(id => id) || [],
    createdAt: scheduledAt || now,
    completedAt: null,
    status: 'in_progress',
  };

  const result = save<Session>(STORAGE_KEYS.SESSIONS, session);
  
  if (!result.success) {
    console.error('Failed to create session:', result.error);
    return null;
  }

  return session;
}

/**
 * Retrieves all sessions from storage.
 * 
 * @returns Array of all Session objects
 * 
 * @example
 * const sessions = getAllSessions();
 * console.log(`Total sessions: ${sessions.length}`);
 */
export function getAllSessions(): Session[] {
  return getAll<Session>(STORAGE_KEYS.SESSIONS);
}

/**
 * Retrieves a single session by its ID.
 * 
 * @param id - The unique identifier of the session
 * @returns The Session object if found, undefined otherwise
 * 
 * @example
 * const session = getSessionById('session-123');
 * if (session) {
 *   console.log(`Found session for study: ${session.studyId}`);
 * }
 */
export function getSessionById(id: string): Session | undefined {
  return getById<Session>(STORAGE_KEYS.SESSIONS, id);
}

/**
 * Retrieves all sessions for a specific study.
 * 
 * @param studyId - The study identifier to filter by
 * @returns Array of Session objects belonging to the study
 * 
 * **Validates: Requirements 2.4**
 * 
 * @example
 * const studySessions = getSessionsByStudy('study-123');
 * console.log(`Sessions in study: ${studySessions.length}`);
 */
export function getSessionsByStudy(studyId: string): Session[] {
  const allSessions = getAllSessions();
  return allSessions.filter(session => session.studyId === studyId);
}

/**
 * Filters sessions based on multiple criteria.
 * All provided filters are applied with AND logic.
 * 
 * @param filters - Object containing filter criteria
 * @returns Array of Session objects matching all filters
 * 
 * **Validates: Requirements 2.5**
 * 
 * @example
 * const filtered = filterSessions({
 *   studyId: 'study-123',
 *   participantId: 'participant-456',
 *   dateFrom: '2024-01-01',
 *   dateTo: '2024-12-31'
 * });
 */
export function filterSessions(filters: SessionFilters): Session[] {
  let sessions = getAllSessions();

  // Filter by study
  if (filters.studyId) {
    sessions = sessions.filter(s => s.studyId === filters.studyId);
  }

  // Filter by participant
  if (filters.participantId) {
    sessions = sessions.filter(s => s.participantId === filters.participantId);
  }

  // Filter by facilitator
  if (filters.facilitatorId) {
    sessions = sessions.filter(s => s.facilitatorId === filters.facilitatorId);
  }

  // Filter by status
  if (filters.status) {
    sessions = sessions.filter(s => s.status === filters.status);
  }

  // Filter by date range (using createdAt)
  if (filters.dateFrom) {
    const fromDate = new Date(filters.dateFrom);
    sessions = sessions.filter(s => new Date(s.createdAt) >= fromDate);
  }

  if (filters.dateTo) {
    const toDate = new Date(filters.dateTo);
    // Set to end of day for inclusive filtering
    toDate.setHours(23, 59, 59, 999);
    sessions = sessions.filter(s => new Date(s.createdAt) <= toDate);
  }

  return sessions;
}

/**
 * Updates an existing session's details.
 * Only the provided fields will be updated; others remain unchanged.
 * 
 * @param id - The unique identifier of the session to update
 * @param updates - Partial Session object with fields to update
 * @returns StorageResult indicating success or failure
 * 
 * @example
 * const result = updateSession('session-123', { 
 *   observerIds: ['observer-1', 'observer-2'] 
 * });
 * if (result.success) {
 *   console.log('Session updated successfully');
 * }
 */
export function updateSession(id: string, updates: Partial<Session>): StorageResult {
  const existingSession = getSessionById(id);
  
  if (!existingSession) {
    return {
      success: false,
      error: `Session with id "${id}" not found.`,
    };
  }

  // Merge updates with existing session, preserving id and createdAt
  const updatedSession: Session = {
    ...existingSession,
    ...updates,
    id: existingSession.id, // Ensure ID cannot be changed
    createdAt: existingSession.createdAt, // Ensure createdAt cannot be changed
  };

  // Trim string fields if they were updated
  if (updates.studyId !== undefined) {
    updatedSession.studyId = updatedSession.studyId.trim();
  }
  if (updates.participantId !== undefined) {
    updatedSession.participantId = updatedSession.participantId.trim();
  }
  if (updates.facilitatorId !== undefined) {
    updatedSession.facilitatorId = updatedSession.facilitatorId.trim();
  }
  if (updates.observerIds !== undefined) {
    updatedSession.observerIds = updates.observerIds.map(id => id.trim()).filter(id => id);
  }

  return update<Session>(STORAGE_KEYS.SESSIONS, id, updatedSession);
}

/**
 * Marks a session as completed.
 * Sets the status to 'completed' and records the completion timestamp.
 * 
 * @param id - The unique identifier of the session to complete
 * @returns StorageResult indicating success or failure
 * 
 * **Validates: Requirements 9.5**
 * 
 * @example
 * const result = completeSession('session-123');
 * if (result.success) {
 *   console.log('Session marked as completed');
 * }
 */
export function completeSession(id: string): StorageResult {
  const existingSession = getSessionById(id);
  
  if (!existingSession) {
    return {
      success: false,
      error: `Session with id "${id}" not found.`,
    };
  }

  if (existingSession.status === 'completed') {
    return {
      success: false,
      error: 'Session is already completed.',
    };
  }

  return updateSession(id, {
    status: 'completed',
    completedAt: new Date().toISOString(),
  });
}

/**
 * Deletes a session from storage.
 * 
 * @param id - The unique identifier of the session to delete
 * @returns StorageResult indicating success or failure
 * 
 * @example
 * const result = deleteSession('session-123');
 * if (result.success) {
 *   console.log('Session deleted successfully');
 * }
 */
export function deleteSession(id: string): StorageResult {
  return remove(STORAGE_KEYS.SESSIONS, id);
}

/**
 * Gets sessions formatted for display with participant and facilitator info.
 * Useful for list views that need to show session details.
 * 
 * @param studyId - Optional study ID to filter by
 * @returns Array of Session objects sorted by creation date (newest first)
 * 
 * @example
 * const sessions = getSessionsForDisplay('study-123');
 */
export function getSessionsForDisplay(studyId?: string): Session[] {
  const sessions = studyId ? getSessionsByStudy(studyId) : getAllSessions();
  
  // Sort by creation date, newest first
  return sessions.sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

/**
 * Gets the count of sessions for a specific study.
 * 
 * @param studyId - The study identifier
 * @returns Number of sessions in the study
 * 
 * @example
 * const count = getSessionCountByStudy('study-123');
 * console.log(`Study has ${count} sessions`);
 */
export function getSessionCountByStudy(studyId: string): number {
  return getSessionsByStudy(studyId).length;
}

/**
 * Gets sessions by status.
 * 
 * @param status - The session status to filter by
 * @returns Array of Session objects with the specified status
 * 
 * @example
 * const inProgress = getSessionsByStatus('in_progress');
 * const completed = getSessionsByStatus('completed');
 */
export function getSessionsByStatus(status: SessionStatus): Session[] {
  const allSessions = getAllSessions();
  return allSessions.filter(session => session.status === status);
}

/**
 * Gets unique participant IDs from sessions in a study.
 * Useful for calculating participant count in analytics.
 * 
 * @param studyId - The study identifier
 * @returns Array of unique participant IDs
 * 
 * @example
 * const participants = getUniqueParticipantsByStudy('study-123');
 * console.log(`Unique participants: ${participants.length}`);
 */
export function getUniqueParticipantsByStudy(studyId: string): string[] {
  const sessions = getSessionsByStudy(studyId);
  const participantIds = sessions.map(s => s.participantId);
  return [...new Set(participantIds)];
}
