/**
 * Seed Data
 * 
 * Demonstration data for the UX Metrics application.
 * Includes studies, sessions, people, assessment types, and responses.
 * 
 * **Validates: Requirements 13.1-13.7**
 */

import type { 
  Study, 
  Session, 
  Person, 
  AssessmentType, 
  AssessmentResponse 
} from '../../../api/types';

// Helper to generate IDs
const generateId = (prefix: string, index: number) => `${prefix}-seed-${index}`;

// Timestamps for realistic data
const now = new Date();
const daysAgo = (days: number) => new Date(now.getTime() - days * 24 * 60 * 60 * 1000).toISOString();

// ============================================================================
// PEOPLE
// ============================================================================

export const seedPeople: Person[] = [
  {
    id: generateId('person', 1),
    name: 'Alice Johnson',
    role: 'participant',
    createdAt: daysAgo(30),
  },
  {
    id: generateId('person', 2),
    name: 'Bob Smith',
    role: 'participant',
    createdAt: daysAgo(30),
  },
  {
    id: generateId('person', 3),
    name: 'Carol Williams',
    role: 'participant',
    createdAt: daysAgo(28),
  },
  {
    id: generateId('person', 4),
    name: 'David Brown',
    role: 'participant',
    createdAt: daysAgo(25),
  },
  {
    id: generateId('person', 5),
    name: 'Emma Davis',
    role: 'facilitator',
    createdAt: daysAgo(30),
  },
  {
    id: generateId('person', 6),
    name: 'Frank Miller',
    role: 'facilitator',
    createdAt: daysAgo(30),
  },
  {
    id: generateId('person', 7),
    name: 'Grace Wilson',
    role: 'observer',
    createdAt: daysAgo(30),
  },
  {
    id: generateId('person', 8),
    name: 'Henry Taylor',
    role: 'observer',
    createdAt: daysAgo(28),
  },
];

// ============================================================================
// STUDIES
// ============================================================================

export const seedStudies: Study[] = [
  {
    id: generateId('study', 1),
    name: 'E-Commerce Checkout Flow',
    productId: 'shop-app',
    featureId: 'checkout-v2',
    archived: false,
    createdAt: daysAgo(25),
    updatedAt: daysAgo(5),
  },
  {
    id: generateId('study', 2),
    name: 'Mobile App Onboarding',
    productId: 'mobile-app',
    featureId: 'onboarding',
    archived: false,
    createdAt: daysAgo(20),
    updatedAt: daysAgo(3),
  },
  {
    id: generateId('study', 3),
    name: 'Dashboard Navigation (Archived)',
    productId: 'admin-portal',
    featureId: 'nav-redesign',
    archived: true,
    createdAt: daysAgo(60),
    updatedAt: daysAgo(45),
  },
];

// ============================================================================
// ASSESSMENT TYPES
// ============================================================================

export const seedAssessmentTypes: AssessmentType[] = [
  {
    id: 'task-success-rate',
    name: 'Task Success Rate',
    type: 'task_success_rate',
    questions: [
      {
        id: 'tsr-q1',
        text: 'Did the participant successfully complete the task?',
        responseType: 'boolean',
        validationRules: [{ type: 'required' }],
      },
    ],
  },
  {
    id: 'time-on-task',
    name: 'Time on Task',
    type: 'time_on_task',
    questions: [
      {
        id: 'tot-q1',
        text: 'Task duration (seconds)',
        responseType: 'number',
        validationRules: [{ type: 'required' }, { type: 'min', value: 0 }],
      },
    ],
  },
  {
    id: 'task-efficiency',
    name: 'Task Efficiency',
    type: 'task_efficiency',
    questions: [
      {
        id: 'te-q1',
        text: 'Optimal number of steps',
        responseType: 'number',
        validationRules: [{ type: 'required' }, { type: 'min', value: 1 }],
      },
      {
        id: 'te-q2',
        text: 'Actual number of steps taken',
        responseType: 'number',
        validationRules: [{ type: 'required' }, { type: 'min', value: 1 }],
      },
    ],
  },
  {
    id: 'error-rate',
    name: 'Error Rate',
    type: 'error_rate',
    questions: [
      {
        id: 'er-q1',
        text: 'Number of errors',
        responseType: 'number',
        validationRules: [{ type: 'required' }, { type: 'min', value: 0 }],
      },
      {
        id: 'er-q2',
        text: 'Number of opportunities for error',
        responseType: 'number',
        validationRules: [{ type: 'required' }, { type: 'min', value: 1 }],
      },
    ],
  },
  {
    id: 'seq',
    name: 'Single Ease Question (SEQ)',
    type: 'seq',
    questions: [
      {
        id: 'seq-q1',
        text: 'Overall, how easy or difficult was this task?',
        responseType: 'rating',
        validationRules: [{ type: 'required' }, { type: 'min', value: 1 }, { type: 'max', value: 7 }],
      },
    ],
  },
];

// ============================================================================
// SESSIONS
// ============================================================================

export const seedSessions: Session[] = [
  // Study 1: E-Commerce Checkout Flow - 3 sessions
  {
    id: generateId('session', 1),
    studyId: generateId('study', 1),
    participantId: generateId('person', 1),
    facilitatorId: generateId('person', 5),
    observerIds: [generateId('person', 7)],
    status: 'completed',
    createdAt: daysAgo(20),
    completedAt: daysAgo(20),
  },
  {
    id: generateId('session', 2),
    studyId: generateId('study', 1),
    participantId: generateId('person', 2),
    facilitatorId: generateId('person', 5),
    observerIds: [generateId('person', 7), generateId('person', 8)],
    status: 'completed',
    createdAt: daysAgo(18),
    completedAt: daysAgo(18),
  },
  {
    id: generateId('session', 3),
    studyId: generateId('study', 1),
    participantId: generateId('person', 3),
    facilitatorId: generateId('person', 6),
    observerIds: [],
    status: 'in_progress',
    createdAt: daysAgo(5),
  },
  // Study 2: Mobile App Onboarding - 3 sessions
  {
    id: generateId('session', 4),
    studyId: generateId('study', 2),
    participantId: generateId('person', 1),
    facilitatorId: generateId('person', 6),
    observerIds: [generateId('person', 8)],
    status: 'completed',
    createdAt: daysAgo(15),
    completedAt: daysAgo(15),
  },
  {
    id: generateId('session', 5),
    studyId: generateId('study', 2),
    participantId: generateId('person', 4),
    facilitatorId: generateId('person', 5),
    observerIds: [],
    status: 'completed',
    createdAt: daysAgo(10),
    completedAt: daysAgo(10),
  },
  {
    id: generateId('session', 6),
    studyId: generateId('study', 2),
    participantId: generateId('person', 2),
    facilitatorId: generateId('person', 6),
    observerIds: [generateId('person', 7)],
    status: 'in_progress',
    createdAt: daysAgo(2),
  },
];

// ============================================================================
// ASSESSMENT RESPONSES
// ============================================================================

export const seedAssessmentResponses: AssessmentResponse[] = [
  // Session 1 (Alice - Checkout) - All assessment types
  {
    id: generateId('response', 1),
    sessionId: generateId('session', 1),
    assessmentTypeId: 'task-success-rate',
    taskDescription: 'Complete checkout with saved payment',
    responses: { 'tsr-q1': true },
    calculatedMetrics: { successRate: 100 },
    createdAt: daysAgo(20),
  },
  {
    id: generateId('response', 2),
    sessionId: generateId('session', 1),
    assessmentTypeId: 'time-on-task',
    taskDescription: 'Complete checkout with saved payment',
    responses: { 'tot-q1': 145 },
    calculatedMetrics: { durationSeconds: 145 },
    createdAt: daysAgo(20),
  },
  {
    id: generateId('response', 3),
    sessionId: generateId('session', 1),
    assessmentTypeId: 'task-efficiency',
    taskDescription: 'Complete checkout with saved payment',
    responses: { 'te-q1': 4, 'te-q2': 5 },
    calculatedMetrics: { efficiency: 80 },
    createdAt: daysAgo(20),
  },
  {
    id: generateId('response', 4),
    sessionId: generateId('session', 1),
    assessmentTypeId: 'error-rate',
    taskDescription: 'Complete checkout with saved payment',
    responses: { 'er-q1': 1, 'er-q2': 8 },
    calculatedMetrics: { errorRate: 12.5 },
    createdAt: daysAgo(20),
  },
  {
    id: generateId('response', 5),
    sessionId: generateId('session', 1),
    assessmentTypeId: 'seq',
    taskDescription: 'Complete checkout with saved payment',
    responses: { 'seq-q1': 6 },
    calculatedMetrics: { seqRating: 6 },
    createdAt: daysAgo(20),
  },
  // Session 2 (Bob - Checkout) - All assessment types
  {
    id: generateId('response', 6),
    sessionId: generateId('session', 2),
    assessmentTypeId: 'task-success-rate',
    taskDescription: 'Complete checkout with new payment',
    responses: { 'tsr-q1': true },
    calculatedMetrics: { successRate: 100 },
    createdAt: daysAgo(18),
  },
  {
    id: generateId('response', 7),
    sessionId: generateId('session', 2),
    assessmentTypeId: 'time-on-task',
    taskDescription: 'Complete checkout with new payment',
    responses: { 'tot-q1': 210 },
    calculatedMetrics: { durationSeconds: 210 },
    createdAt: daysAgo(18),
  },
  {
    id: generateId('response', 8),
    sessionId: generateId('session', 2),
    assessmentTypeId: 'task-efficiency',
    taskDescription: 'Complete checkout with new payment',
    responses: { 'te-q1': 6, 'te-q2': 9 },
    calculatedMetrics: { efficiency: 66.67 },
    createdAt: daysAgo(18),
  },
  {
    id: generateId('response', 9),
    sessionId: generateId('session', 2),
    assessmentTypeId: 'error-rate',
    taskDescription: 'Complete checkout with new payment',
    responses: { 'er-q1': 2, 'er-q2': 10 },
    calculatedMetrics: { errorRate: 20 },
    createdAt: daysAgo(18),
  },
  {
    id: generateId('response', 10),
    sessionId: generateId('session', 2),
    assessmentTypeId: 'seq',
    taskDescription: 'Complete checkout with new payment',
    responses: { 'seq-q1': 5 },
    calculatedMetrics: { seqRating: 5 },
    createdAt: daysAgo(18),
  },
  // Session 4 (Alice - Onboarding) - All assessment types
  {
    id: generateId('response', 11),
    sessionId: generateId('session', 4),
    assessmentTypeId: 'task-success-rate',
    taskDescription: 'Complete account setup',
    responses: { 'tsr-q1': true },
    calculatedMetrics: { successRate: 100 },
    createdAt: daysAgo(15),
  },
  {
    id: generateId('response', 12),
    sessionId: generateId('session', 4),
    assessmentTypeId: 'time-on-task',
    taskDescription: 'Complete account setup',
    responses: { 'tot-q1': 180 },
    calculatedMetrics: { durationSeconds: 180 },
    createdAt: daysAgo(15),
  },
  {
    id: generateId('response', 13),
    sessionId: generateId('session', 4),
    assessmentTypeId: 'task-efficiency',
    taskDescription: 'Complete account setup',
    responses: { 'te-q1': 5, 'te-q2': 6 },
    calculatedMetrics: { efficiency: 83.33 },
    createdAt: daysAgo(15),
  },
  {
    id: generateId('response', 14),
    sessionId: generateId('session', 4),
    assessmentTypeId: 'error-rate',
    taskDescription: 'Complete account setup',
    responses: { 'er-q1': 0, 'er-q2': 6 },
    calculatedMetrics: { errorRate: 0 },
    createdAt: daysAgo(15),
  },
  {
    id: generateId('response', 15),
    sessionId: generateId('session', 4),
    assessmentTypeId: 'seq',
    taskDescription: 'Complete account setup',
    responses: { 'seq-q1': 7 },
    calculatedMetrics: { seqRating: 7 },
    createdAt: daysAgo(15),
  },
  // Session 5 (David - Onboarding) - All assessment types
  {
    id: generateId('response', 16),
    sessionId: generateId('session', 5),
    assessmentTypeId: 'task-success-rate',
    taskDescription: 'Complete account setup',
    responses: { 'tsr-q1': false },
    calculatedMetrics: { successRate: 0 },
    createdAt: daysAgo(10),
  },
  {
    id: generateId('response', 17),
    sessionId: generateId('session', 5),
    assessmentTypeId: 'time-on-task',
    taskDescription: 'Complete account setup',
    responses: { 'tot-q1': 320 },
    calculatedMetrics: { durationSeconds: 320 },
    createdAt: daysAgo(10),
  },
  {
    id: generateId('response', 18),
    sessionId: generateId('session', 5),
    assessmentTypeId: 'task-efficiency',
    taskDescription: 'Complete account setup',
    responses: { 'te-q1': 5, 'te-q2': 12 },
    calculatedMetrics: { efficiency: 41.67 },
    createdAt: daysAgo(10),
  },
  {
    id: generateId('response', 19),
    sessionId: generateId('session', 5),
    assessmentTypeId: 'error-rate',
    taskDescription: 'Complete account setup',
    responses: { 'er-q1': 4, 'er-q2': 6 },
    calculatedMetrics: { errorRate: 66.67 },
    createdAt: daysAgo(10),
  },
  {
    id: generateId('response', 20),
    sessionId: generateId('session', 5),
    assessmentTypeId: 'seq',
    taskDescription: 'Complete account setup',
    responses: { 'seq-q1': 2 },
    calculatedMetrics: { seqRating: 2 },
    createdAt: daysAgo(10),
  },
];

// ============================================================================
// SEED DATA LOADING
// ============================================================================

import { STORAGE_KEYS, getAll, saveAll, clearAll } from '../services/storage';

/**
 * Checks if the application has any existing data.
 */
export function hasExistingData(): boolean {
  const studies = getAll<Study>(STORAGE_KEYS.STUDIES);
  const people = getAll<Person>(STORAGE_KEYS.PEOPLE);
  return studies.length > 0 || people.length > 0;
}

/**
 * Loads seed data into localStorage.
 * Only loads if storage is empty.
 * 
 * @returns true if seed data was loaded, false if data already exists
 */
export function loadSeedDataIfEmpty(): boolean {
  if (hasExistingData()) {
    console.log('Seed data: Existing data found, skipping seed load');
    return false;
  }
  
  return loadSeedData();
}

/**
 * Forces loading of seed data, replacing any existing data.
 * 
 * @returns true if successful
 */
export function loadSeedData(): boolean {
  try {
    // Save all seed data
    saveAll<Person>(STORAGE_KEYS.PEOPLE, seedPeople);
    saveAll<Study>(STORAGE_KEYS.STUDIES, seedStudies);
    saveAll<Session>(STORAGE_KEYS.SESSIONS, seedSessions);
    saveAll<AssessmentType>(STORAGE_KEYS.ASSESSMENT_TYPES, seedAssessmentTypes);
    saveAll<AssessmentResponse>(STORAGE_KEYS.ASSESSMENT_RESPONSES, seedAssessmentResponses);
    
    console.log('Seed data: Loaded successfully');
    return true;
  } catch (error) {
    console.error('Seed data: Failed to load', error);
    return false;
  }
}

/**
 * Resets all data and reloads seed data.
 * 
 * @returns true if successful
 */
export function resetToSeedData(): boolean {
  try {
    // Clear all existing data
    clearAll();
    
    // Load seed data
    return loadSeedData();
  } catch (error) {
    console.error('Seed data: Failed to reset', error);
    return false;
  }
}
