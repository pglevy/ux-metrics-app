# Implementation Tasks: UX Metrics Capture and Review Application

## Task 1: Schema and Type Definitions
Define the API contract and generate TypeScript types following the schema-first approach.

- [x] 1.1 Define OpenAPI schema for core entities
  - Update `schema/api-contract.yaml` with Study, Session, Person, AssessmentType, AssessmentResponse schemas
  - Define all endpoints for CRUD operations
  - **Validates: Requirements 1.1, 2.1, 2.5.1, 3.1**

- [x] 1.2 Create TypeScript types from schema
  - Create `api/types/index.ts` with all entity interfaces
  - Include Study, Session, Person, AssessmentType, AssessmentResponse, Question types
  - **Validates: Requirements 1.1, 2.1, 2.5.1, 3.1**

- [x] 1.3 Update concept model documentation
  - Update `concept-model/domain-model.md` with UX metrics entities
  - Update `concept-model/behavior-model.md` with session workflows
  - Update `concept-model/entity-relationship-diagram.md`
  - **Validates: Schema-first approach**

## Task 2: Project Dependencies and Test Setup
Add required dependencies and configure testing infrastructure.

- [x] 2.1 Install additional dependencies
  - Add recharts for chart visualizations
  - Run in `ui/` directory
  - **Validates: Requirements 11.4**

- [ ]* 2.2 Install testing dependencies (optional)
  - Add fast-check for property-based testing
  - Add vitest for test runner
  - **Validates: Testing strategy**

- [ ]* 2.3 Configure vitest (optional)
  - Create `ui/vitest.config.ts`
  - Set up test directory structure
  - **Validates: Testing strategy**

## Task 3: Local Storage Service
Implement data persistence layer using local storage.

- [x] 3.1 Implement storage service
  - Create `ui/src/services/storage.ts` with generic CRUD operations
  - Implement save confirmation and error handling
  - **Validates: Requirements 12.1, 12.2, 12.3**

- [ ] 3.2 Implement data backup/restore
  - Create export function to download all data as JSON file
  - Create import function to restore from uploaded JSON file
  - **Validates: Requirements 12.4**

- [ ]* 3.3 Write property test for entity persistence round trip (Property 36) (optional)
  - Test that any entity created then retrieved returns all data preserved
  - **Validates: Requirements 12.1**

## Task 4: People Management
Implement the people management feature for participants, facilitators, and observers.

- [x] 4.1 Implement PersonService
  - Create `ui/src/services/personService.ts` with CRUD operations
  - Implement role filtering (participant, facilitator, observer)
  - **Validates: Requirements 2.5.1, 2.5.2, 2.5.3**

- [ ] 4.2 Create PeopleList page
  - Create `ui/src/pages/people.tsx` using Sailwind components (HeadingField, CardLayout, ButtonWidget)
  - Display name and role for each person
  - Include empty state message
  - **Validates: Requirements 2.5.2**

- [x] 4.3 Create PersonForm component
  - Use Sailwind TextField and DropdownField for name and role
  - Implement validation for required fields
  - **Validates: Requirements 2.5.1, 2.5.3**

- [x] 4.4 Implement person deletion with reference check
  - Prevent deletion if person is referenced by any session
  - Show appropriate error message
  - **Validates: Requirements 2.5.4**

## Task 5: Study Management
Implement study CRUD operations and UI using Sailwind components.

- [x] 5.1 Implement StudyService
  - Create `ui/src/services/studyService.ts` with create, read, update, archive operations
  - Generate unique IDs and timestamps
  - **Validates: Requirements 1.1, 1.2, 1.4, 1.5**

- [x] 5.2 Create StudyList page
  - Create `ui/src/pages/studies.tsx` using Sailwind CardLayout and HeadingField
  - Show study name, product, and archived status
  - Include empty state message using RichTextDisplayField
  - **Validates: Requirements 1.3**

- [x] 5.3 Create StudyForm component
  - Use Sailwind TextField for name, product identifier, optional feature identifier
  - Support both create and edit modes
  - **Validates: Requirements 1.1, 1.4**

- [x] 5.4 Implement study archive functionality
  - Add archive ButtonWidget to study detail view
  - Update archived flag without deleting data
  - **Validates: Requirements 1.5**

- [ ]* 5.5 Write property tests for Study CRUD (Properties 1, 2, 3) (optional)
  - Test round trip preservation
  - Test update preservation
  - Test archive flag setting
  - **Validates: Requirements 1.1, 1.2, 1.4, 1.5**

## Task 6: Session Management
Implement session creation, listing, and filtering.

- [x] 6.1 Implement SessionService
  - Create `ui/src/services/sessionService.ts` with CRUD operations
  - Implement filtering by study, participant, facilitator, date range
  - **Validates: Requirements 2.1, 2.3, 2.4, 2.5**

- [x] 6.2 Create SessionList component
  - Display sessions within a study using Sailwind CardLayout
  - Show participant, facilitator, status, and date
  - Include empty state message
  - **Validates: Requirements 2.4**

- [x] 6.3 Create SessionForm component
  - Use Sailwind DropdownField for participant and facilitator selection from people list
  - Multi-select for observers
  - **Validates: Requirements 2.1, 2.2, 2.6**

- [x] 6.4 Implement session filtering
  - Add Sailwind DropdownField filter controls for participant, facilitator
  - Add date range inputs
  - **Validates: Requirements 2.5**

- [x] 6.5 Implement session completion
  - Add complete ButtonWidget to mark session as completed
  - Set completedAt timestamp
  - **Validates: Requirements 9.5**

- [ ]* 6.6 Write property tests for Session (Properties 4, 5, 6, 7, 8, 9) (optional)
  - Test required field validation
  - Test optional observers
  - Test unique ID generation
  - Test timestamp generation
  - Test filtering by study and attributes
  - **Validates: Requirements 2.1, 2.2, 2.3, 2.4, 2.5**

## Task 7: Assessment Type Configuration
Implement the five assessment types with their question definitions.

- [x] 7.1 Implement AssessmentTypeService
  - Create `ui/src/services/assessmentTypeService.ts`
  - Pre-configure the five assessment types with appropriate questions
  - **Validates: Requirements 3.1, 3.2, 3.3**

- [x] 7.2 Create AssessmentTypeList component
  - Display available assessment types using Sailwind CardLayout
  - Show type name and question count
  - **Validates: Requirements 3.5**

- [x] 7.3 Create AssessmentTypeForm component
  - Use Sailwind TextField for editing question text
  - Allow editing validation rules
  - **Validates: Requirements 3.4, 3.5**

- [ ]* 7.4 Write property tests for Assessment Types (Properties 10, 11, 13) (optional)
  - Test required field validation
  - Test reusability across sessions
  - Test update preservation
  - **Validates: Requirements 3.2, 3.3, 3.5**

## Task 8: Assessment Response Service and Calculations
Implement the core assessment response handling and metric calculations.

- [x] 8.1 Implement AssessmentResponseService
  - Create `ui/src/services/assessmentResponseService.ts`
  - Handle creation and retrieval of assessment responses
  - **Validates: Requirements 4.4, 5.4, 6.4, 7.4, 8.3, 9.1, 9.2**

- [x] 8.2 Implement calculation functions
  - Create `ui/src/utils/calculations.ts`
  - Implement calculateSuccessRate, calculateDuration, calculateEfficiency, calculateErrorRate
  - Implement formatDuration for human-readable output (Xm Ys format)
  - **Validates: Requirements 4.2, 5.2, 6.2, 7.2**

- [ ]* 8.3 Write property tests for calculations (Properties 14, 16, 19, 21) (optional)
  - Test task success rate calculation
  - Test time on task duration calculation
  - Test task efficiency calculation
  - Test error rate calculation
  - **Validates: Requirements 4.2, 5.2, 6.2, 7.2**

- [ ]* 8.4 Write property test for duration formatting (Property 18) (optional)
  - Test human-readable format "Xm Ys"
  - **Validates: Requirements 5.5**

## Task 9: Assessment Forms UI
Create the UI forms for each assessment type using Sailwind components.

- [x] 9.1 Create TaskSuccessRateForm component
  - Use Sailwind RadioButtonField or CheckboxField for success/failure
  - Display calculated success rate
  - **Validates: Requirements 4.1, 4.3, 4.5**

- [x] 9.2 Create TimeOnTaskForm component
  - Use Sailwind ButtonWidget for start/stop timer
  - Use TextField for manual duration entry
  - Display duration in minutes and seconds
  - **Validates: Requirements 5.1, 5.3, 5.5**

- [x] 9.3 Create TaskEfficiencyForm component
  - Use Sailwind TextField for optimal steps and actual steps
  - Display calculated efficiency percentage
  - **Validates: Requirements 6.1, 6.5**

- [x] 9.4 Create ErrorRateForm component
  - Use Sailwind TextField for error count
  - Use DropdownField for error type categorization
  - Display calculated error rate and breakdown
  - **Validates: Requirements 7.1, 7.3, 7.5**

- [x] 9.5 Create SEQForm component
  - Use Sailwind RadioButtonField for 1-7 rating scale
  - Validate rating range
  - Prevent duplicate ratings for same task/session
  - **Validates: Requirements 8.1, 8.2, 8.4, 8.5**

- [ ]* 9.6 Write property tests for SEQ (Properties 23, 24) (optional)
  - Test rating validation (1-7 range)
  - Test uniqueness per task per session
  - **Validates: Requirements 8.2, 8.5**

## Task 10: Session Detail and Assessment Administration
Create the session detail view for administering assessments.

- [x] 10.1 Create SessionDetail page
  - Create `ui/src/pages/session-detail.tsx`
  - Display session info using Sailwind HeadingField and CardLayout
  - List completed assessments
  - **Validates: Requirements 9.1**

- [x] 10.2 Create AssessmentSelector component
  - Use Sailwind DropdownField or ButtonArrayLayout for assessment type selection
  - **Validates: Requirements 9.1, 9.3**

- [x] 10.3 Implement incremental assessment saving
  - Save each assessment immediately after completion
  - **Validates: Requirements 9.4**

- [ ]* 10.4 Write property tests for session assessments (Properties 15, 25, 26) (optional)
  - Test multiple assessments per session
  - Test order independence
  - Test incremental persistence
  - **Validates: Requirements 9.1, 9.3, 9.4**

## Task 11: Data Aggregation and Analytics
Implement metric aggregation and analysis features.

- [x] 11.1 Implement AnalyticsService
  - Create `ui/src/services/analyticsService.ts`
  - Calculate median for time on task
  - Calculate mean for success rate, efficiency, error rate, SEQ
  - **Validates: Requirements 10.1, 10.2**

- [x] 11.2 Implement aggregation filtering
  - Filter by date range, participant, task
  - **Validates: Requirements 10.3**

- [x] 11.3 Implement metrics comparison
  - Compare metrics between studies or time periods
  - **Validates: Requirements 10.4**

- [ ]* 11.4 Write property tests for aggregation (Properties 28, 29, 30, 31, 32) (optional)
  - Test median calculation
  - Test mean calculations
  - Test filtering accuracy
  - Test comparison calculations
  - Test incremental updates
  - **Validates: Requirements 10.1, 10.2, 10.3, 10.4, 10.5**

## Task 12: Metrics Dashboard and Visualizations
Create the dashboard with Recharts visualizations.

- [ ] 12.1 Create MetricsDashboard page
  - Create `ui/src/pages/metrics.tsx`
  - Display aggregated metrics for a study using Sailwind CardLayout
  - Include empty state message
  - **Validates: Requirements 10.1, 10.2**

- [ ] 12.2 Create metric chart components
  - Bar chart for success rate comparison using Recharts
  - Line chart for time on task trends using Recharts
  - **Validates: Requirements 11.4**

- [ ] 12.3 Add filter controls to dashboard
  - Use Sailwind DropdownField for participant and task filters
  - Add date range inputs
  - **Validates: Requirements 10.3**

## Task 13: Report Generation
Implement shareable report generation with JSON export.

- [ ] 13.1 Implement ReportService
  - Create `ui/src/services/reportService.ts`
  - Generate report with aggregated metrics, participant count, session count
  - **Validates: Requirements 11.1, 11.2**

- [ ] 13.2 Create ReportGenerator page
  - Create `ui/src/pages/report.tsx`
  - Display report preview with Recharts visualizations
  - Use Sailwind CardLayout for report sections
  - **Validates: Requirements 11.1, 11.4**

- [ ] 13.3 Implement JSON export
  - Add ButtonWidget to download report as JSON file
  - **Validates: Requirements 11.3**

- [ ] 13.4 Add commentary feature
  - Use Sailwind TextField (multiline) for adding notes
  - Include notes in JSON export
  - **Validates: Requirements 11.5**

- [ ]* 13.5 Write property tests for reports (Properties 33, 34, 35) (optional)
  - Test report completeness
  - Test JSON export validity
  - Test commentary inclusion
  - **Validates: Requirements 11.1, 11.2, 11.3, 11.5**

## Task 14: Seed Data
Create demonstration seed data.

- [ ] 14.1 Create seed data file
  - Create `ui/src/data/seedData.ts`
  - Include 2+ studies with different products
  - Include 5+ sessions across studies
  - Include all 5 assessment types with responses
  - Include realistic people (participants, facilitators, observers)
  - Include varied metrics for aggregation demo
  - **Validates: Requirements 13.1, 13.2, 13.3, 13.4, 13.5**

- [ ] 14.2 Implement seed data loading
  - Load seed data on app initialization if storage is empty
  - **Validates: Requirements 13.6**

- [ ] 14.3 Implement seed data reset
  - Add ButtonWidget to clear all data and reload seed data
  - **Validates: Requirements 13.7**

- [ ]* 14.4 Write unit tests for seed data (optional)
  - Verify seed data meets all requirements
  - Test load and reset functionality
  - **Validates: Requirements 13.1-13.7**

## Task 15: Navigation and App Shell
Set up the main application navigation and routing.

- [ ] 15.1 Update App.tsx with routing
  - Add routes for all pages (studies, sessions, people, metrics, reports)
  - Use existing react-router-dom setup
  - **Validates: Requirements 1.3, 2.4**

- [ ] 15.2 Create Home page with navigation
  - Update `ui/src/pages/home.tsx` with links to main sections
  - Use Sailwind CardLayout and ButtonWidget for navigation cards
  - **Validates: Requirements 1.3**

- [ ] 15.3 Create Settings page
  - Create `ui/src/pages/settings.tsx`
  - Include data backup/restore controls using Sailwind ButtonWidget
  - Include seed data reset button
  - **Validates: Requirements 12.4, 13.7**

## Task 16: Error Handling and Edge Cases
Implement comprehensive error handling.

- [ ] 16.1 Implement validation error handling
  - Display clear error messages for invalid input
  - Highlight invalid fields
  - **Validates: Requirements 12.3**

- [ ] 16.2 Implement division by zero handling
  - Return 0 or null for rates with zero denominator
  - **Validates: Requirements 4.2, 6.2, 7.2**

- [ ]* 16.3 Write property test for persistence failure handling (Property 37) (optional)
  - Test error return and data retention
  - **Validates: Requirements 12.3**

- [ ]* 16.4 Write property test for backup/recovery (Property 38) (optional)
  - Test export, clear, import cycle
  - **Validates: Requirements 12.4**

## Task 17: Final Integration and Polish
Complete integration testing and UI polish.

- [ ]* 17.1 Run all property tests and fix failures (optional)
  - Ensure all 38 properties pass
  - **Validates: All correctness properties**

- [ ] 17.2 Verify empty state messages
  - Check all list views show appropriate empty states using Sailwind RichTextDisplayField
  - **Validates: Clarification - empty states**

- [ ] 17.3 Update schema evolution log
  - Document all schema changes in `schema/evolution-log.md`
  - **Validates: Schema-first approach**

- [ ] 17.4 Build validation
  - Run `npm run build` in `ui/` directory and fix any TypeScript errors
  - **Validates: All requirements**

- [ ] 17.5 Manual integration testing
  - Test complete workflow: create study → add people → create session → administer assessments → view metrics → generate report
  - **Validates: All requirements**
