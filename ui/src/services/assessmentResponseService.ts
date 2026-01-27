/**
 * Assessment Response Service
 * 
 * CRUD operations for managing assessment responses within sessions.
 * Handles creation, retrieval, and validation of assessment responses.
 * 
 * **Validates: Requirements 4.4, 5.4, 6.4, 7.4, 8.3, 9.1, 9.2**
 * - 4.4: Store task description and success criteria with each assessment
 * - 5.4: Store task description with each time measurement
 * - 6.4: Store task description and optimal path definition
 * - 7.4: Store error descriptions with each recorded error
 * - 8.3: Store rating with associated task description
 * - 9.1: Allow multiple assessments to be administered in a session
 * - 9.2: Associate all assessment responses with session identifier
 */

import type { 
  AssessmentResponse, 
  CreateAssessmentResponseRequest,
  ListAssessmentResponsesParams,
} from '../../../api/types';
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
 * Creates a new assessment response.
 * Generates a unique ID and sets creation timestamp.
 * 
 * @param data - The assessment response data
 * @returns The created AssessmentResponse object, or null if creation failed
 * 
 * **Validates: Requirements 9.1, 9.2, 9.4**
 * 
 * @example
 * const response = createAssessmentResponse({
 *   sessionId: 'session-123',
 *   assessmentTypeId: 'assessment-type-456',
 *   taskDescription: 'Complete checkout process',
 *   responses: { successful: true }
 * });
 */
export function createAssessmentResponse(
  data: CreateAssessmentResponseRequest
): AssessmentResponse | null {
  // Validate required fields
  if (!data.sessionId || !data.sessionId.trim()) {
    console.error('createAssessmentResponse: sessionId is required');
    return null;
  }
  if (!data.assessmentTypeId || !data.assessmentTypeId.trim()) {
    console.error('createAssessmentResponse: assessmentTypeId is required');
    return null;
  }
  if (!data.taskDescription || !data.taskDescription.trim()) {
    console.error('createAssessmentResponse: taskDescription is required');
    return null;
  }

  const now = new Date().toISOString();
  
  const assessmentResponse: AssessmentResponse = {
    id: generateId('assessment-response'),
    sessionId: data.sessionId.trim(),
    assessmentTypeId: data.assessmentTypeId.trim(),
    taskDescription: data.taskDescription.trim(),
    responses: data.responses || {},
    calculatedMetrics: {},
    createdAt: now,
  };

  const result = save<AssessmentResponse>(STORAGE_KEYS.ASSESSMENT_RESPONSES, assessmentResponse);
  
  if (!result.success) {
    console.error('Failed to create assessment response:', result.error);
    return null;
  }

  return assessmentResponse;
}

/**
 * Retrieves all assessment responses from storage.
 * 
 * @returns Array of all AssessmentResponse objects
 * 
 * @example
 * const responses = getAllAssessmentResponses();
 * console.log(`Total responses: ${responses.length}`);
 */
export function getAllAssessmentResponses(): AssessmentResponse[] {
  return getAll<AssessmentResponse>(STORAGE_KEYS.ASSESSMENT_RESPONSES);
}

/**
 * Retrieves a single assessment response by its ID.
 * 
 * @param id - The unique identifier of the assessment response
 * @returns The AssessmentResponse object if found, undefined otherwise
 * 
 * @example
 * const response = getAssessmentResponseById('assessment-response-123');
 */
export function getAssessmentResponseById(id: string): AssessmentResponse | undefined {
  return getById<AssessmentResponse>(STORAGE_KEYS.ASSESSMENT_RESPONSES, id);
}

/**
 * Retrieves all assessment responses for a specific session.
 * 
 * @param sessionId - The session identifier to filter by
 * @returns Array of AssessmentResponse objects belonging to the session
 * 
 * **Validates: Requirements 9.1, 9.2**
 * 
 * @example
 * const sessionResponses = getAssessmentResponsesBySession('session-123');
 */
export function getAssessmentResponsesBySession(sessionId: string): AssessmentResponse[] {
  const allResponses = getAllAssessmentResponses();
  return allResponses.filter(response => response.sessionId === sessionId);
}

/**
 * Retrieves all assessment responses for a specific assessment type.
 * 
 * @param assessmentTypeId - The assessment type identifier to filter by
 * @returns Array of AssessmentResponse objects for the assessment type
 * 
 * @example
 * const typeResponses = getAssessmentResponsesByType('assessment-type-123');
 */
export function getAssessmentResponsesByType(assessmentTypeId: string): AssessmentResponse[] {
  const allResponses = getAllAssessmentResponses();
  return allResponses.filter(response => response.assessmentTypeId === assessmentTypeId);
}

/**
 * Filters assessment responses based on multiple criteria.
 * 
 * @param params - Object containing filter criteria
 * @returns Array of AssessmentResponse objects matching all filters
 * 
 * @example
 * const filtered = filterAssessmentResponses({
 *   sessionId: 'session-123',
 *   assessmentTypeId: 'assessment-type-456'
 * });
 */
export function filterAssessmentResponses(
  params: ListAssessmentResponsesParams
): AssessmentResponse[] {
  let responses = getAllAssessmentResponses();

  if (params.sessionId) {
    responses = responses.filter(r => r.sessionId === params.sessionId);
  }

  if (params.assessmentTypeId) {
    responses = responses.filter(r => r.assessmentTypeId === params.assessmentTypeId);
  }

  return responses;
}

/**
 * Updates an existing assessment response.
 * Only the provided fields will be updated; others remain unchanged.
 * 
 * @param id - The unique identifier of the assessment response to update
 * @param updates - Partial AssessmentResponse object with fields to update
 * @returns StorageResult indicating success or failure
 * 
 * @example
 * const result = updateAssessmentResponse('assessment-response-123', { 
 *   calculatedMetrics: { successRate: 85 }
 * });
 */
export function updateAssessmentResponse(
  id: string, 
  updates: Partial<Omit<AssessmentResponse, 'id' | 'createdAt'>>
): StorageResult {
  const existingResponse = getAssessmentResponseById(id);
  
  if (!existingResponse) {
    return {
      success: false,
      error: `Assessment response with id "${id}" not found.`,
    };
  }

  // Merge updates with existing response, preserving id and createdAt
  const updatedResponse: AssessmentResponse = {
    ...existingResponse,
    ...updates,
    id: existingResponse.id, // Ensure ID cannot be changed
    createdAt: existingResponse.createdAt, // Ensure createdAt cannot be changed
  };

  return update<AssessmentResponse>(STORAGE_KEYS.ASSESSMENT_RESPONSES, id, updatedResponse);
}

/**
 * Deletes an assessment response from storage.
 * 
 * @param id - The unique identifier of the assessment response to delete
 * @returns StorageResult indicating success or failure
 * 
 * @example
 * const result = deleteAssessmentResponse('assessment-response-123');
 */
export function deleteAssessmentResponse(id: string): StorageResult {
  return remove(STORAGE_KEYS.ASSESSMENT_RESPONSES, id);
}

/**
 * Checks if an SEQ rating already exists for a specific task in a session.
 * Used to prevent duplicate SEQ ratings per task per session.
 * 
 * @param sessionId - The session identifier
 * @param taskDescription - The task description to check
 * @param assessmentTypeId - The SEQ assessment type ID
 * @returns true if a rating already exists, false otherwise
 * 
 * **Validates: Requirements 8.5**
 * 
 * @example
 * const exists = hasSEQRatingForTask('session-123', 'Complete checkout', 'seq-type-id');
 * if (exists) {
 *   console.log('SEQ rating already exists for this task');
 * }
 */
export function hasSEQRatingForTask(
  sessionId: string, 
  taskDescription: string,
  assessmentTypeId: string
): boolean {
  const responses = getAssessmentResponsesBySession(sessionId);
  return responses.some(
    r => r.assessmentTypeId === assessmentTypeId && 
         r.taskDescription.toLowerCase() === taskDescription.toLowerCase()
  );
}

/**
 * Gets assessment responses for display, sorted by creation date.
 * 
 * @param sessionId - Optional session ID to filter by
 * @returns Array of AssessmentResponse objects sorted by creation date (newest first)
 * 
 * @example
 * const responses = getAssessmentResponsesForDisplay('session-123');
 */
export function getAssessmentResponsesForDisplay(sessionId?: string): AssessmentResponse[] {
  const responses = sessionId 
    ? getAssessmentResponsesBySession(sessionId) 
    : getAllAssessmentResponses();
  
  // Sort by creation date, newest first
  return responses.sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

/**
 * Gets the count of assessment responses for a specific session.
 * 
 * @param sessionId - The session identifier
 * @returns Number of assessment responses in the session
 * 
 * @example
 * const count = getAssessmentResponseCountBySession('session-123');
 */
export function getAssessmentResponseCountBySession(sessionId: string): number {
  return getAssessmentResponsesBySession(sessionId).length;
}

/**
 * Creates an assessment response with calculated metrics.
 * This is a convenience function that creates the response and updates it with metrics.
 * 
 * @param data - The assessment response data
 * @param calculatedMetrics - The calculated metrics to include
 * @returns The created AssessmentResponse object with metrics, or null if creation failed
 * 
 * @example
 * const response = createAssessmentResponseWithMetrics(
 *   { sessionId: 'session-123', assessmentTypeId: 'type-456', taskDescription: 'Task', responses: {} },
 *   { successRate: 85 }
 * );
 */
export function createAssessmentResponseWithMetrics(
  data: CreateAssessmentResponseRequest,
  calculatedMetrics: Record<string, number>
): AssessmentResponse | null {
  const response = createAssessmentResponse(data);
  
  if (!response) {
    return null;
  }

  const updateResult = updateAssessmentResponse(response.id, { calculatedMetrics });
  
  if (!updateResult.success) {
    console.error('Failed to update assessment response with metrics:', updateResult.error);
    // Return the response without metrics rather than failing completely
    return response;
  }

  return {
    ...response,
    calculatedMetrics,
  };
}
