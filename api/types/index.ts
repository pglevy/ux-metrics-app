/**
 * API Types
 *
 * Generated from schema/api-contract.yaml
 *
 * These types represent the contract between the UI prototype and the API.
 * They should be regenerated whenever the schema changes.
 */

// ============================================
// Enums
// ============================================

export type SessionStatus = 'in_progress' | 'completed';

export type PersonRole = 'participant' | 'facilitator' | 'observer';

export type AssessmentTypeEnum = 'task_success_rate' | 'time_on_task' | 'task_efficiency' | 'error_rate' | 'seq';

export type ResponseType = 'boolean' | 'number' | 'text' | 'rating';

export type ValidationRuleType = 'min' | 'max' | 'minLength' | 'maxLength' | 'pattern' | 'required';

// ============================================
// Study Types
// ============================================

export interface Study {
  id: string;
  name: string;
  productId: string;
  featureId?: string | null;
  createdAt: string;
  updatedAt: string;
  archived: boolean;
}

export interface CreateStudyRequest {
  name: string;
  productId: string;
  featureId?: string | null;
}

export interface UpdateStudyRequest {
  name?: string;
  productId?: string;
  featureId?: string | null;
}

export interface ListStudiesParams {
  archived?: boolean;
}

// ============================================
// Session Types
// ============================================

export interface Session {
  id: string;
  studyId: string;
  participantId: string;
  facilitatorId: string;
  observerIds: string[];
  createdAt: string;
  completedAt?: string | null;
  status: SessionStatus;
}

export interface CreateSessionRequest {
  studyId: string;
  participantId: string;
  facilitatorId: string;
  observerIds?: string[];
  scheduledAt?: string | null;
}

export interface UpdateSessionRequest {
  participantId?: string;
  facilitatorId?: string;
  observerIds?: string[];
}

export interface ListSessionsParams {
  studyId?: string;
  participantId?: string;
  facilitatorId?: string;
  startDate?: string;
  endDate?: string;
  status?: SessionStatus;
}

// ============================================
// Person Types
// ============================================

export interface Person {
  id: string;
  name: string;
  role: PersonRole;
  createdAt: string;
}

export interface CreatePersonRequest {
  name: string;
  role: PersonRole;
}

export interface UpdatePersonRequest {
  name?: string;
  role?: PersonRole;
}

export interface ListPeopleParams {
  role?: PersonRole;
}

// ============================================
// Assessment Type Types
// ============================================

export interface ValidationRule {
  type: ValidationRuleType;
  value?: number | string;
}

export interface Question {
  id: string;
  text: string;
  responseType: ResponseType;
  validationRules?: ValidationRule[] | null;
}

export interface AssessmentType {
  id: string;
  name: string;
  type: AssessmentTypeEnum;
  questions: Question[];
}

export interface CreateQuestionRequest {
  text: string;
  responseType: ResponseType;
  validationRules?: ValidationRule[] | null;
}

export interface CreateAssessmentTypeRequest {
  name: string;
  type: AssessmentTypeEnum;
  questions: CreateQuestionRequest[];
}

export interface UpdateAssessmentTypeRequest {
  name?: string;
  questions?: Question[];
}

export interface ListAssessmentTypesParams {
  type?: AssessmentTypeEnum;
}

// ============================================
// Assessment Response Types
// ============================================

export interface AssessmentResponse {
  id: string;
  sessionId: string;
  assessmentTypeId: string;
  taskDescription: string;
  responses: Record<string, unknown>;
  calculatedMetrics: Record<string, number>;
  createdAt: string;
}

export interface CreateAssessmentResponseRequest {
  sessionId: string;
  assessmentTypeId: string;
  taskDescription: string;
  responses: Record<string, unknown>;
}

export interface ListAssessmentResponsesParams {
  sessionId?: string;
  assessmentTypeId?: string;
}

// ============================================
// Analytics Types
// ============================================

export interface MetricAggregate {
  mean: number | null;
  count: number;
}

export interface TimeMetricAggregate {
  median: number | null;
  mean: number | null;
  count: number;
}

export interface MetricsSummary {
  taskSuccessRate?: MetricAggregate;
  timeOnTask?: TimeMetricAggregate;
  taskEfficiency?: MetricAggregate;
  errorRate?: MetricAggregate;
  seq?: MetricAggregate;
}

export interface DateRange {
  start: string;
  end: string;
}

export interface AggregatedMetrics {
  studyId: string;
  sessionCount: number;
  participantCount: number;
  dateRange: DateRange;
  metrics: MetricsSummary;
}

export interface GetStudyMetricsParams {
  startDate?: string;
  endDate?: string;
  participantId?: string;
  taskDescription?: string;
}

// ============================================
// Report Types
// ============================================

export interface Report {
  id: string;
  studyId: string;
  studyName?: string;
  generatedAt: string;
  metrics: MetricsSummary;
  sessionCount: number;
  participantCount: number;
  commentary?: string | null;
}

export interface GenerateReportRequest {
  studyId: string;
  commentary?: string | null;
}

// ============================================
// Data Management Types
// ============================================

export interface DataExport {
  exportedAt: string;
  version: string;
  studies?: Study[];
  sessions?: Session[];
  people?: Person[];
  assessmentTypes?: AssessmentType[];
  assessmentResponses?: AssessmentResponse[];
}

// ============================================
// Error Types
// ============================================

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown> | null;
}
