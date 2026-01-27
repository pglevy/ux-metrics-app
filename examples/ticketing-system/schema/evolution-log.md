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

## 2026-01-11 - Initial Schema

**Trigger**: Starting ticketing app prototype

**Change**: Created initial schema with basic ticket CRUD operations
- Endpoints: GET /tickets, POST /tickets, GET /tickets/{id}, PATCH /tickets/{id}
- Core entity: Ticket with id, title, description, status, assignee, timestamps
- Status enum: open, in_progress, closed

**Rationale**: Minimal viable schema to support basic ticket management prototype

**Impact**:
- ✅ Created api-contract.yaml
- ⏳ Concept model to be created
- ⏳ Types to be generated
- ⏳ Mock API to be generated

---

## Template for Future Entries

**Date**: YYYY-MM-DD

**Trigger**: [What prompted this change]

**Change**:
- [Describe the schema changes]

**Rationale**: [Why this was needed]

**Impact**:
- [ ] api-contract.yaml updated
- [ ] concept-model updated
- [ ] types regenerated
- [ ] mock API regenerated
