# Domain Model

This document describes the core entities, relationships, and business rules of the system. It evolves alongside the API schema but focuses on conceptual understanding rather than technical implementation.

---

## Core Entities

### Ticket
A work item that needs to be tracked and completed.

**Attributes:**
- **Identity**: Unique identifier (UUID)
- **Content**: Title and description of the work
- **Workflow**: Current status in the lifecycle
- **Ownership**: Who (if anyone) is responsible
- **Timeline**: When it was created and last modified

**Lifecycle States:**
1. **Open**: Newly created, awaiting assignment or work
2. **In Progress**: Actively being worked on
3. **Closed**: Completed or resolved

**Business Rules:**
- Title is required and must be descriptive (1-200 characters)
- Description provides full context
- Status starts as "open" when created
- Assignee is optional (tickets can be unassigned)
- Timestamps are automatically managed

---

## Relationships

Currently a single entity system. Future relationships may include:
- Ticket → User (assignee relationship)
- Ticket → Comment (conversation thread)
- Ticket → Ticket (dependencies, subtasks)

---

## Domain Vocabulary

| Term | Definition | Notes |
|------|------------|-------|
| Ticket | A trackable unit of work | Primary entity |
| Status | Current state in the workflow | Enum: open, in_progress, closed |
| Assignee | Person responsible for the ticket | Optional, identified by name/ID |
| Title | Brief summary of the ticket | Required, max 200 chars |
| Description | Full details of the work needed | Required, no length limit |

---

## Visual Representations

- [Entity Relationship Diagram](./entity-relationship-diagram.md) - Visual model of entities and relationships
- [Behavior Model](./behavior-model.md) - Detailed interaction patterns and workflows

## Key Behaviors

(See [behavior-model.md](./behavior-model.md) for detailed interaction patterns)

**Core Operations:**
- Create a new ticket
- View all tickets (with optional filtering)
- View a specific ticket
- Update ticket properties (assignment, status, content)

---

## Evolution Notes

**2026-01-11**: Initial domain model created
- Single entity (Ticket) with basic lifecycle
- Minimal relationship complexity
- Focused on essential work tracking

**Future Considerations:**
- May need priority/severity levels
- May need categorization/tagging
- May need user/team entities for assignment
- May need audit trail/history
