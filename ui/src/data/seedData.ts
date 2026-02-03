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
    name: 'Dashboard Navigation',
    productId: 'admin-portal',
    featureId: 'nav-redesign',
    archived: true,
    createdAt: daysAgo(60),
    updatedAt: daysAgo(45),
  },
  {
    id: generateId('study', 4),
    name: 'Search Results Usability',
    productId: 'shop-app',
    featureId: 'search-experience',
    archived: false,
    createdAt: daysAgo(15),
    updatedAt: daysAgo(2),
  },
  {
    id: generateId('study', 5),
    name: 'Account Settings Redesign',
    productId: 'mobile-app',
    featureId: 'settings-v3',
    archived: false,
    createdAt: daysAgo(12),
    updatedAt: daysAgo(1),
  },
  {
    id: generateId('study', 6),
    name: 'Payment Methods Interface',
    productId: 'shop-app',
    featureId: 'payment-management',
    archived: false,
    createdAt: daysAgo(8),
    updatedAt: daysAgo(1),
  },
  {
    id: generateId('study', 7),
    name: 'User Profile Creation',
    productId: 'admin-portal',
    featureId: 'user-onboarding',
    archived: true,
    createdAt: daysAgo(90),
    updatedAt: daysAgo(75),
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
  // Study 1: E-Commerce Checkout Flow - 8 sessions for better chart visualization
  {
    id: generateId('session', 1),
    studyId: generateId('study', 1),
    participantId: generateId('person', 1),
    facilitatorId: generateId('person', 5),
    observerIds: [generateId('person', 7)],
    status: 'completed',
    createdAt: daysAgo(24),
    completedAt: daysAgo(24),
  },
  {
    id: generateId('session', 2),
    studyId: generateId('study', 1),
    participantId: generateId('person', 2),
    facilitatorId: generateId('person', 5),
    observerIds: [generateId('person', 7), generateId('person', 8)],
    status: 'completed',
    createdAt: daysAgo(21),
    completedAt: daysAgo(21),
  },
  {
    id: generateId('session', 3),
    studyId: generateId('study', 1),
    participantId: generateId('person', 3),
    facilitatorId: generateId('person', 6),
    observerIds: [],
    status: 'completed',
    createdAt: daysAgo(18),
    completedAt: daysAgo(18),
  },
  {
    id: generateId('session', 31),
    studyId: generateId('study', 1),
    participantId: generateId('person', 4),
    facilitatorId: generateId('person', 5),
    observerIds: [generateId('person', 7)],
    status: 'completed',
    createdAt: daysAgo(15),
    completedAt: daysAgo(15),
  },
  {
    id: generateId('session', 32),
    studyId: generateId('study', 1),
    participantId: generateId('person', 1),
    facilitatorId: generateId('person', 6),
    observerIds: [],
    status: 'completed',
    createdAt: daysAgo(12),
    completedAt: daysAgo(12),
  },
  {
    id: generateId('session', 33),
    studyId: generateId('study', 1),
    participantId: generateId('person', 2),
    facilitatorId: generateId('person', 5),
    observerIds: [generateId('person', 8)],
    status: 'completed',
    createdAt: daysAgo(9),
    completedAt: daysAgo(9),
  },
  {
    id: generateId('session', 34),
    studyId: generateId('study', 1),
    participantId: generateId('person', 3),
    facilitatorId: generateId('person', 6),
    observerIds: [],
    status: 'completed',
    createdAt: daysAgo(6),
    completedAt: daysAgo(6),
  },
  {
    id: generateId('session', 35),
    studyId: generateId('study', 1),
    participantId: generateId('person', 4),
    facilitatorId: generateId('person', 5),
    observerIds: [generateId('person', 7)],
    status: 'completed',
    createdAt: daysAgo(3),
    completedAt: daysAgo(3),
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
  // Study 1: E-Commerce Checkout Flow - Multiple tasks with varying success rates
  // Session 1 - Day 24
  {
    id: generateId('response', 101),
    sessionId: generateId('session', 1),
    assessmentTypeId: 'task-success-rate',
    taskDescription: 'Add item to cart',
    responses: { 'tsr-q1': true },
    calculatedMetrics: { successRate: 100 },
    createdAt: daysAgo(24),
  },
  {
    id: generateId('response', 102),
    sessionId: generateId('session', 1),
    assessmentTypeId: 'time-on-task',
    taskDescription: 'Add item to cart',
    responses: { 'tot-q1': 35 },
    calculatedMetrics: { durationSeconds: 35 },
    createdAt: daysAgo(24),
  },
  {
    id: generateId('response', 103),
    sessionId: generateId('session', 1),
    assessmentTypeId: 'task-success-rate',
    taskDescription: 'Apply coupon code',
    responses: { 'tsr-q1': false },
    calculatedMetrics: { successRate: 0 },
    createdAt: daysAgo(24),
  },
  {
    id: generateId('response', 104),
    sessionId: generateId('session', 1),
    assessmentTypeId: 'time-on-task',
    taskDescription: 'Apply coupon code',
    responses: { 'tot-q1': 95 },
    calculatedMetrics: { durationSeconds: 95 },
    createdAt: daysAgo(24),
  },
  {
    id: generateId('response', 105),
    sessionId: generateId('session', 1),
    assessmentTypeId: 'task-success-rate',
    taskDescription: 'Complete checkout with saved payment',
    responses: { 'tsr-q1': true },
    calculatedMetrics: { successRate: 100 },
    createdAt: daysAgo(24),
  },
  {
    id: generateId('response', 106),
    sessionId: generateId('session', 1),
    assessmentTypeId: 'time-on-task',
    taskDescription: 'Complete checkout with saved payment',
    responses: { 'tot-q1': 145 },
    calculatedMetrics: { durationSeconds: 145 },
    createdAt: daysAgo(24),
  },

  // Session 2 - Day 21
  {
    id: generateId('response', 201),
    sessionId: generateId('session', 2),
    assessmentTypeId: 'task-success-rate',
    taskDescription: 'Add item to cart',
    responses: { 'tsr-q1': true },
    calculatedMetrics: { successRate: 100 },
    createdAt: daysAgo(21),
  },
  {
    id: generateId('response', 202),
    sessionId: generateId('session', 2),
    assessmentTypeId: 'time-on-task',
    taskDescription: 'Add item to cart',
    responses: { 'tot-q1': 28 },
    calculatedMetrics: { durationSeconds: 28 },
    createdAt: daysAgo(21),
  },
  {
    id: generateId('response', 203),
    sessionId: generateId('session', 2),
    assessmentTypeId: 'task-success-rate',
    taskDescription: 'Complete checkout with new payment',
    responses: { 'tsr-q1': false },
    calculatedMetrics: { successRate: 0 },
    createdAt: daysAgo(21),
  },
  {
    id: generateId('response', 204),
    sessionId: generateId('session', 2),
    assessmentTypeId: 'time-on-task',
    taskDescription: 'Complete checkout with new payment',
    responses: { 'tot-q1': 280 },
    calculatedMetrics: { durationSeconds: 280 },
    createdAt: daysAgo(21),
  },
  {
    id: generateId('response', 205),
    sessionId: generateId('session', 2),
    assessmentTypeId: 'task-success-rate',
    taskDescription: 'Update shipping address',
    responses: { 'tsr-q1': true },
    calculatedMetrics: { successRate: 100 },
    createdAt: daysAgo(21),
  },
  {
    id: generateId('response', 206),
    sessionId: generateId('session', 2),
    assessmentTypeId: 'time-on-task',
    taskDescription: 'Update shipping address',
    responses: { 'tot-q1': 75 },
    calculatedMetrics: { durationSeconds: 75 },
    createdAt: daysAgo(21),
  },

  // Session 3 - Day 18
  {
    id: generateId('response', 301),
    sessionId: generateId('session', 3),
    assessmentTypeId: 'task-success-rate',
    taskDescription: 'Add item to cart',
    responses: { 'tsr-q1': true },
    calculatedMetrics: { successRate: 100 },
    createdAt: daysAgo(18),
  },
  {
    id: generateId('response', 302),
    sessionId: generateId('session', 3),
    assessmentTypeId: 'time-on-task',
    taskDescription: 'Add item to cart',
    responses: { 'tot-q1': 22 },
    calculatedMetrics: { durationSeconds: 22 },
    createdAt: daysAgo(18),
  },
  {
    id: generateId('response', 303),
    sessionId: generateId('session', 3),
    assessmentTypeId: 'task-success-rate',
    taskDescription: 'Apply coupon code',
    responses: { 'tsr-q1': true },
    calculatedMetrics: { successRate: 100 },
    createdAt: daysAgo(18),
  },
  {
    id: generateId('response', 304),
    sessionId: generateId('session', 3),
    assessmentTypeId: 'time-on-task',
    taskDescription: 'Apply coupon code',
    responses: { 'tot-q1': 68 },
    calculatedMetrics: { durationSeconds: 68 },
    createdAt: daysAgo(18),
  },
  {
    id: generateId('response', 305),
    sessionId: generateId('session', 3),
    assessmentTypeId: 'task-success-rate',
    taskDescription: 'Complete checkout with saved payment',
    responses: { 'tsr-q1': true },
    calculatedMetrics: { successRate: 100 },
    createdAt: daysAgo(18),
  },
  {
    id: generateId('response', 306),
    sessionId: generateId('session', 3),
    assessmentTypeId: 'time-on-task',
    taskDescription: 'Complete checkout with saved payment',
    responses: { 'tot-q1': 120 },
    calculatedMetrics: { durationSeconds: 120 },
    createdAt: daysAgo(18),
  },

  // Session 31 - Day 15
  {
    id: generateId('response', 401),
    sessionId: generateId('session', 31),
    assessmentTypeId: 'task-success-rate',
    taskDescription: 'Apply coupon code',
    responses: { 'tsr-q1': true },
    calculatedMetrics: { successRate: 100 },
    createdAt: daysAgo(15),
  },
  {
    id: generateId('response', 402),
    sessionId: generateId('session', 31),
    assessmentTypeId: 'time-on-task',
    taskDescription: 'Apply coupon code',
    responses: { 'tot-q1': 52 },
    calculatedMetrics: { durationSeconds: 52 },
    createdAt: daysAgo(15),
  },
  {
    id: generateId('response', 403),
    sessionId: generateId('session', 31),
    assessmentTypeId: 'task-success-rate',
    taskDescription: 'Complete checkout with new payment',
    responses: { 'tsr-q1': true },
    calculatedMetrics: { successRate: 100 },
    createdAt: daysAgo(15),
  },
  {
    id: generateId('response', 404),
    sessionId: generateId('session', 31),
    assessmentTypeId: 'time-on-task',
    taskDescription: 'Complete checkout with new payment',
    responses: { 'tot-q1': 195 },
    calculatedMetrics: { durationSeconds: 195 },
    createdAt: daysAgo(15),
  },
  {
    id: generateId('response', 405),
    sessionId: generateId('session', 31),
    assessmentTypeId: 'task-success-rate',
    taskDescription: 'Update shipping address',
    responses: { 'tsr-q1': false },
    calculatedMetrics: { successRate: 0 },
    createdAt: daysAgo(15),
  },
  {
    id: generateId('response', 406),
    sessionId: generateId('session', 31),
    assessmentTypeId: 'time-on-task',
    taskDescription: 'Update shipping address',
    responses: { 'tot-q1': 125 },
    calculatedMetrics: { durationSeconds: 125 },
    createdAt: daysAgo(15),
  },

  // Session 32 - Day 12
  {
    id: generateId('response', 501),
    sessionId: generateId('session', 32),
    assessmentTypeId: 'task-success-rate',
    taskDescription: 'Add item to cart',
    responses: { 'tsr-q1': true },
    calculatedMetrics: { successRate: 100 },
    createdAt: daysAgo(12),
  },
  {
    id: generateId('response', 502),
    sessionId: generateId('session', 32),
    assessmentTypeId: 'time-on-task',
    taskDescription: 'Add item to cart',
    responses: { 'tot-q1': 18 },
    calculatedMetrics: { durationSeconds: 18 },
    createdAt: daysAgo(12),
  },
  {
    id: generateId('response', 503),
    sessionId: generateId('session', 32),
    assessmentTypeId: 'task-success-rate',
    taskDescription: 'Complete checkout with saved payment',
    responses: { 'tsr-q1': true },
    calculatedMetrics: { successRate: 100 },
    createdAt: daysAgo(12),
  },
  {
    id: generateId('response', 504),
    sessionId: generateId('session', 32),
    assessmentTypeId: 'time-on-task',
    taskDescription: 'Complete checkout with saved payment',
    responses: { 'tot-q1': 95 },
    calculatedMetrics: { durationSeconds: 95 },
    createdAt: daysAgo(12),
  },

  // Session 33 - Day 9
  {
    id: generateId('response', 601),
    sessionId: generateId('session', 33),
    assessmentTypeId: 'task-success-rate',
    taskDescription: 'Apply coupon code',
    responses: { 'tsr-q1': true },
    calculatedMetrics: { successRate: 100 },
    createdAt: daysAgo(9),
  },
  {
    id: generateId('response', 602),
    sessionId: generateId('session', 33),
    assessmentTypeId: 'time-on-task',
    taskDescription: 'Apply coupon code',
    responses: { 'tot-q1': 45 },
    calculatedMetrics: { durationSeconds: 45 },
    createdAt: daysAgo(9),
  },
  {
    id: generateId('response', 603),
    sessionId: generateId('session', 33),
    assessmentTypeId: 'task-success-rate',
    taskDescription: 'Complete checkout with new payment',
    responses: { 'tsr-q1': true },
    calculatedMetrics: { successRate: 100 },
    createdAt: daysAgo(9),
  },
  {
    id: generateId('response', 604),
    sessionId: generateId('session', 33),
    assessmentTypeId: 'time-on-task',
    taskDescription: 'Complete checkout with new payment',
    responses: { 'tot-q1': 175 },
    calculatedMetrics: { durationSeconds: 175 },
    createdAt: daysAgo(9),
  },
  {
    id: generateId('response', 605),
    sessionId: generateId('session', 33),
    assessmentTypeId: 'task-success-rate',
    taskDescription: 'Update shipping address',
    responses: { 'tsr-q1': true },
    calculatedMetrics: { successRate: 100 },
    createdAt: daysAgo(9),
  },
  {
    id: generateId('response', 606),
    sessionId: generateId('session', 33),
    assessmentTypeId: 'time-on-task',
    taskDescription: 'Update shipping address',
    responses: { 'tot-q1': 62 },
    calculatedMetrics: { durationSeconds: 62 },
    createdAt: daysAgo(9),
  },

  // Session 34 - Day 6
  {
    id: generateId('response', 701),
    sessionId: generateId('session', 34),
    assessmentTypeId: 'task-success-rate',
    taskDescription: 'Add item to cart',
    responses: { 'tsr-q1': true },
    calculatedMetrics: { successRate: 100 },
    createdAt: daysAgo(6),
  },
  {
    id: generateId('response', 702),
    sessionId: generateId('session', 34),
    assessmentTypeId: 'time-on-task',
    taskDescription: 'Add item to cart',
    responses: { 'tot-q1': 15 },
    calculatedMetrics: { durationSeconds: 15 },
    createdAt: daysAgo(6),
  },
  {
    id: generateId('response', 703),
    sessionId: generateId('session', 34),
    assessmentTypeId: 'task-success-rate',
    taskDescription: 'Complete checkout with saved payment',
    responses: { 'tsr-q1': true },
    calculatedMetrics: { successRate: 100 },
    createdAt: daysAgo(6),
  },
  {
    id: generateId('response', 704),
    sessionId: generateId('session', 34),
    assessmentTypeId: 'time-on-task',
    taskDescription: 'Complete checkout with saved payment',
    responses: { 'tot-q1': 88 },
    calculatedMetrics: { durationSeconds: 88 },
    createdAt: daysAgo(6),
  },

  // Session 35 - Day 3
  {
    id: generateId('response', 801),
    sessionId: generateId('session', 35),
    assessmentTypeId: 'task-success-rate',
    taskDescription: 'Apply coupon code',
    responses: { 'tsr-q1': false },
    calculatedMetrics: { successRate: 0 },
    createdAt: daysAgo(3),
  },
  {
    id: generateId('response', 802),
    sessionId: generateId('session', 35),
    assessmentTypeId: 'time-on-task',
    taskDescription: 'Apply coupon code',
    responses: { 'tot-q1': 110 },
    calculatedMetrics: { durationSeconds: 110 },
    createdAt: daysAgo(3),
  },
  {
    id: generateId('response', 803),
    sessionId: generateId('session', 35),
    assessmentTypeId: 'task-success-rate',
    taskDescription: 'Complete checkout with new payment',
    responses: { 'tsr-q1': true },
    calculatedMetrics: { successRate: 100 },
    createdAt: daysAgo(3),
  },
  {
    id: generateId('response', 804),
    sessionId: generateId('session', 35),
    assessmentTypeId: 'time-on-task',
    taskDescription: 'Complete checkout with new payment',
    responses: { 'tot-q1': 165 },
    calculatedMetrics: { durationSeconds: 165 },
    createdAt: daysAgo(3),
  },
  {
    id: generateId('response', 805),
    sessionId: generateId('session', 35),
    assessmentTypeId: 'task-success-rate',
    taskDescription: 'Update shipping address',
    responses: { 'tsr-q1': true },
    calculatedMetrics: { successRate: 100 },
    createdAt: daysAgo(3),
  },
  {
    id: generateId('response', 806),
    sessionId: generateId('session', 35),
    assessmentTypeId: 'time-on-task',
    taskDescription: 'Update shipping address',
    responses: { 'tot-q1': 55 },
    calculatedMetrics: { durationSeconds: 55 },
    createdAt: daysAgo(3),
  },

  // Add Task Efficiency, Error Rate, and SEQ data for Study 1 sessions
  // Session 1 - Additional metrics
  {
    id: generateId('response', 107),
    sessionId: generateId('session', 1),
    assessmentTypeId: 'task-efficiency',
    taskDescription: 'Complete checkout with saved payment',
    responses: { 'te-q1': 4, 'te-q2': 5 },
    calculatedMetrics: { efficiency: 80 },
    createdAt: daysAgo(24),
  },
  {
    id: generateId('response', 108),
    sessionId: generateId('session', 1),
    assessmentTypeId: 'error-rate',
    taskDescription: 'Complete checkout with saved payment',
    responses: { 'er-q1': 1, 'er-q2': 8 },
    calculatedMetrics: { errorRate: 12.5 },
    createdAt: daysAgo(24),
  },
  {
    id: generateId('response', 109),
    sessionId: generateId('session', 1),
    assessmentTypeId: 'seq',
    taskDescription: 'Complete checkout with saved payment',
    responses: { 'seq-q1': 6 },
    calculatedMetrics: { seqRating: 6 },
    createdAt: daysAgo(24),
  },

  // Session 2 - Additional metrics
  {
    id: generateId('response', 207),
    sessionId: generateId('session', 2),
    assessmentTypeId: 'task-efficiency',
    taskDescription: 'Complete checkout with new payment',
    responses: { 'te-q1': 6, 'te-q2': 10 },
    calculatedMetrics: { efficiency: 60 },
    createdAt: daysAgo(21),
  },
  {
    id: generateId('response', 208),
    sessionId: generateId('session', 2),
    assessmentTypeId: 'error-rate',
    taskDescription: 'Complete checkout with new payment',
    responses: { 'er-q1': 3, 'er-q2': 10 },
    calculatedMetrics: { errorRate: 30 },
    createdAt: daysAgo(21),
  },
  {
    id: generateId('response', 209),
    sessionId: generateId('session', 2),
    assessmentTypeId: 'seq',
    taskDescription: 'Complete checkout with new payment',
    responses: { 'seq-q1': 4 },
    calculatedMetrics: { seqRating: 4 },
    createdAt: daysAgo(21),
  },

  // Session 3 - Additional metrics
  {
    id: generateId('response', 307),
    sessionId: generateId('session', 3),
    assessmentTypeId: 'task-efficiency',
    taskDescription: 'Complete checkout with saved payment',
    responses: { 'te-q1': 4, 'te-q2': 4 },
    calculatedMetrics: { efficiency: 100 },
    createdAt: daysAgo(18),
  },
  {
    id: generateId('response', 308),
    sessionId: generateId('session', 3),
    assessmentTypeId: 'error-rate',
    taskDescription: 'Complete checkout with saved payment',
    responses: { 'er-q1': 0, 'er-q2': 8 },
    calculatedMetrics: { errorRate: 0 },
    createdAt: daysAgo(18),
  },
  {
    id: generateId('response', 309),
    sessionId: generateId('session', 3),
    assessmentTypeId: 'seq',
    taskDescription: 'Complete checkout with saved payment',
    responses: { 'seq-q1': 7 },
    calculatedMetrics: { seqRating: 7 },
    createdAt: daysAgo(18),
  },

  // Session 31 - Additional metrics
  {
    id: generateId('response', 407),
    sessionId: generateId('session', 31),
    assessmentTypeId: 'task-efficiency',
    taskDescription: 'Complete checkout with new payment',
    responses: { 'te-q1': 6, 'te-q2': 7 },
    calculatedMetrics: { efficiency: 85.71 },
    createdAt: daysAgo(15),
  },
  {
    id: generateId('response', 408),
    sessionId: generateId('session', 31),
    assessmentTypeId: 'error-rate',
    taskDescription: 'Complete checkout with new payment',
    responses: { 'er-q1': 1, 'er-q2': 10 },
    calculatedMetrics: { errorRate: 10 },
    createdAt: daysAgo(15),
  },
  {
    id: generateId('response', 409),
    sessionId: generateId('session', 31),
    assessmentTypeId: 'seq',
    taskDescription: 'Complete checkout with new payment',
    responses: { 'seq-q1': 6 },
    calculatedMetrics: { seqRating: 6 },
    createdAt: daysAgo(15),
  },

  // Session 32 - Additional metrics
  {
    id: generateId('response', 505),
    sessionId: generateId('session', 32),
    assessmentTypeId: 'task-efficiency',
    taskDescription: 'Complete checkout with saved payment',
    responses: { 'te-q1': 4, 'te-q2': 4 },
    calculatedMetrics: { efficiency: 100 },
    createdAt: daysAgo(12),
  },
  {
    id: generateId('response', 506),
    sessionId: generateId('session', 32),
    assessmentTypeId: 'error-rate',
    taskDescription: 'Complete checkout with saved payment',
    responses: { 'er-q1': 0, 'er-q2': 8 },
    calculatedMetrics: { errorRate: 0 },
    createdAt: daysAgo(12),
  },
  {
    id: generateId('response', 507),
    sessionId: generateId('session', 32),
    assessmentTypeId: 'seq',
    taskDescription: 'Complete checkout with saved payment',
    responses: { 'seq-q1': 7 },
    calculatedMetrics: { seqRating: 7 },
    createdAt: daysAgo(12),
  },

  // Session 33 - Additional metrics
  {
    id: generateId('response', 607),
    sessionId: generateId('session', 33),
    assessmentTypeId: 'task-efficiency',
    taskDescription: 'Complete checkout with new payment',
    responses: { 'te-q1': 6, 'te-q2': 6 },
    calculatedMetrics: { efficiency: 100 },
    createdAt: daysAgo(9),
  },
  {
    id: generateId('response', 608),
    sessionId: generateId('session', 33),
    assessmentTypeId: 'error-rate',
    taskDescription: 'Complete checkout with new payment',
    responses: { 'er-q1': 0, 'er-q2': 10 },
    calculatedMetrics: { errorRate: 0 },
    createdAt: daysAgo(9),
  },
  {
    id: generateId('response', 609),
    sessionId: generateId('session', 33),
    assessmentTypeId: 'seq',
    taskDescription: 'Complete checkout with new payment',
    responses: { 'seq-q1': 7 },
    calculatedMetrics: { seqRating: 7 },
    createdAt: daysAgo(9),
  },

  // Session 34 - Additional metrics
  {
    id: generateId('response', 705),
    sessionId: generateId('session', 34),
    assessmentTypeId: 'task-efficiency',
    taskDescription: 'Complete checkout with saved payment',
    responses: { 'te-q1': 4, 'te-q2': 4 },
    calculatedMetrics: { efficiency: 100 },
    createdAt: daysAgo(6),
  },
  {
    id: generateId('response', 706),
    sessionId: generateId('session', 34),
    assessmentTypeId: 'error-rate',
    taskDescription: 'Complete checkout with saved payment',
    responses: { 'er-q1': 0, 'er-q2': 8 },
    calculatedMetrics: { errorRate: 0 },
    createdAt: daysAgo(6),
  },
  {
    id: generateId('response', 707),
    sessionId: generateId('session', 34),
    assessmentTypeId: 'seq',
    taskDescription: 'Complete checkout with saved payment',
    responses: { 'seq-q1': 7 },
    calculatedMetrics: { seqRating: 7 },
    createdAt: daysAgo(6),
  },

  // Session 35 - Additional metrics
  {
    id: generateId('response', 807),
    sessionId: generateId('session', 35),
    assessmentTypeId: 'task-efficiency',
    taskDescription: 'Complete checkout with new payment',
    responses: { 'te-q1': 6, 'te-q2': 8 },
    calculatedMetrics: { efficiency: 75 },
    createdAt: daysAgo(3),
  },
  {
    id: generateId('response', 808),
    sessionId: generateId('session', 35),
    assessmentTypeId: 'error-rate',
    taskDescription: 'Complete checkout with new payment',
    responses: { 'er-q1': 2, 'er-q2': 10 },
    calculatedMetrics: { errorRate: 20 },
    createdAt: daysAgo(3),
  },
  {
    id: generateId('response', 809),
    sessionId: generateId('session', 35),
    assessmentTypeId: 'seq',
    taskDescription: 'Complete checkout with new payment',
    responses: { 'seq-q1': 5 },
    calculatedMetrics: { seqRating: 5 },
    createdAt: daysAgo(3),
  },

  // Original Study 2 responses continue below...
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
