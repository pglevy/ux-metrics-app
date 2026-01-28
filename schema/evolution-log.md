# Schema Evolution Log

This log tracks changes to the API contract as prototypes evolve.

## Format

Each entry includes:
- **Date**: When the change was made
- **Trigger**: What prompted the change (prototype need, user feedback, etc.)
- **Change**: What was added/modified/removed
- **Rationale**: Why this change was needed
- **Impact**: Which artifacts were updated (concept model, types, mock API)

---

## Getting Started

When you make your first schema change, add an entry here following this template:

```markdown
## YYYY-MM-DD - [Brief Title]

**Trigger**: [What prompted this change]

**Change**:
- [Describe the schema changes]

**Rationale**: [Why this was needed]

**Impact**:
- [ ] api-contract.yaml updated
- [ ] concept-model updated
- [ ] types regenerated
- [ ] mock API updated
```

---

## Example

See [examples/ticketing-system/schema/evolution-log.md](../../examples/ticketing-system/schema/evolution-log.md) for a complete example of how to track schema evolution.

---

## 2026-01-27 - Initial Schema Definition for UX Metrics App

**Trigger**: Task 1.1 - Define OpenAPI schema for core entities

**Changes**:
- Added `Study` schema with id, name, productId, featureId, createdAt, updatedAt, archived fields
- Added `Session` schema with id, studyId, participantId, facilitatorId, observerIds, createdAt, completedAt, status fields
- Added `Person` schema with id, name, role, createdAt fields
- Added `AssessmentType` schema with id, name, type, questions fields
- Added `AssessmentResponse` schema with id, sessionId, assessmentTypeId, taskDescription, responses, calculatedMetrics, createdAt fields
- Added `Question` schema with id, text, responseType, validationRules fields
- Added `ValidationRule` schema for question validation
- Added `AggregatedMetrics` and `MetricsSummary` schemas for analytics
- Added `Report` schema for shareable reports
- Added `DataExport` schema for backup/restore functionality
- Added `Error` schema for error responses
- Defined CRUD endpoints for all entities:
  - `/studies` - List, Create
  - `/studies/{studyId}` - Get, Update
  - `/studies/{studyId}/archive` - Archive study
  - `/sessions` - List (with filters), Create
  - `/sessions/{sessionId}` - Get, Update
  - `/sessions/{sessionId}/complete` - Mark complete
  - `/people` - List (with role filter), Create
  - `/people/{personId}` - Get, Update, Delete
  - `/assessment-types` - List, Create
  - `/assessment-types/{assessmentTypeId}` - Get, Update
  - `/assessment-responses` - List (with filters), Create
  - `/assessment-responses/{responseId}` - Get
  - `/studies/{studyId}/metrics` - Get aggregated metrics
  - `/reports` - Generate report
  - `/data/export` - Export all data
  - `/data/import` - Import data
  - `/data/seed` - Load seed data
  - `/data/reset` - Reset and reload seed data

**Rationale**: Initial schema definition following schema-first approach to establish the API contract before implementation.

**Impact**:
- [x] api-contract.yaml updated
- [ ] concept-model updated (Task 1.3)
- [ ] types regenerated (Task 1.2)
- [ ] mock API updated (future task)


---

## 2026-01-27 - UX Metrics App Implementation Complete

**Trigger**: Task 17.3 - Document schema changes after full implementation

**Changes**:
- All schema entities implemented in TypeScript types (`api/types/index.ts`)
- All services implemented for CRUD operations
- All UI components built using Sailwind component library
- Seed data created with realistic demonstration data
- Backup/restore functionality implemented
- Analytics and reporting features complete

**Implementation Summary**:
- **Studies**: Full CRUD with archive functionality
- **Sessions**: Full CRUD with filtering by study, participant, facilitator, date range
- **People**: Full CRUD with role-based filtering (participant, facilitator, observer)
- **Assessment Types**: 5 pre-configured types (Task Success Rate, Time on Task, Task Efficiency, Error Rate, SEQ)
- **Assessment Responses**: Capture and calculate metrics for each assessment type
- **Analytics**: Aggregation with mean/median calculations, filtering, comparison
- **Reports**: Generate shareable reports with JSON export and commentary
- **Data Management**: LocalStorage persistence, backup/restore via JSON, seed data

**Rationale**: Final documentation of the complete implementation following schema-first approach.

**Impact**:
- [x] api-contract.yaml - Complete
- [x] concept-model - Updated with all entities and workflows
- [x] types - Generated and aligned with schema
- [x] UI prototype - Fully functional


---

## 2026-01-27 - Add scheduledAt to CreateSessionRequest

**Trigger**: Contract validation found prototype using `scheduledAt` parameter not defined in schema

**Changes**:
- Added `scheduledAt` optional field to `CreateSessionRequest` schema
- Field is date-time format, nullable
- Allows sessions to be scheduled for a specific date/time
- Fixed evolution log date typo (2025 → 2026)

**Rationale**: The `sessionService.ts` accepts a `scheduledAt` parameter to allow scheduling sessions in advance. This aligns the schema with the existing prototype implementation.

**Impact**:
- [x] api-contract.yaml updated
- [ ] concept-model updated (minor - session scheduling)
- [x] types regenerated
- [ ] mock API updated
