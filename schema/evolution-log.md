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

## 2025-01-27 - Initial Schema Definition for UX Metrics App

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
