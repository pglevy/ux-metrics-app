# Behavior Model

This document describes the key interactions, workflows, and behavioral patterns in the system.

---

## Primary Workflows

### 1. Ticket Creation Flow

**Actor**: Any user

**Steps:**
1. User provides title and description
2. (Optional) User assigns the ticket immediately
3. System creates ticket with status="open"
4. System generates unique ID and timestamps
5. System returns the created ticket

**Business Logic:**
- Title and description are required
- Status defaults to "open"
- Assignee is optional
- createdAt and updatedAt are set to current time

**Validation:**
- Title must be 1-200 characters
- Description cannot be empty

---

### 2. Ticket List/Browse Flow

**Actor**: Any user

**Steps:**
1. User requests ticket list (optionally filtered)
2. System retrieves matching tickets
3. System returns ticket array

**Filtering Options:**
- By status (open, in_progress, closed)
- By assignee (name/ID)

**Future Considerations:**
- Pagination for large ticket counts
- Sorting options (by date, priority, etc.)
- Search by title/description

---

### 3. Ticket Detail View Flow

**Actor**: Any user

**Steps:**
1. User requests specific ticket by ID
2. System retrieves ticket
3. System returns ticket details

**Error Cases:**
- Ticket not found → 404 response

---

### 4. Ticket Update Flow

**Actor**: Any user (future: may require authorization)

**Steps:**
1. User submits changes to one or more fields
2. System validates changes
3. System updates ticket
4. System updates `updatedAt` timestamp
5. System returns updated ticket

**Updateable Fields:**
- title
- description
- status
- assignee

**Business Logic:**
- Only provided fields are updated (partial update)
- updatedAt is automatically set
- Status transitions are unrestricted (future: may add transition rules)

**Future Considerations:**
- Status transition rules (e.g., can't go from closed → open)
- Authorization (who can update what)
- Notification on assignment changes
- History/audit trail

---

## State Transitions

### Ticket Status

```
     ┌──────┐
     │ open │
     └───┬──┘
         │
         v
  ┌──────────────┐
  │ in_progress  │
  └──────┬───────┘
         │
         v
     ┌────────┐
     │ closed │
     └────────┘
```

**Current Rules:**
- Any status can transition to any other status
- Status transitions are user-initiated (no automatic transitions)

**Future Rules May Include:**
- open → in_progress (requires assignee)
- in_progress → closed (requires completion criteria)
- Prevent closed → open (require "reopen" action)

---

## Business Rules & Invariants

### Invariants (Always True)
- Every ticket has a unique ID
- Every ticket has a title and description
- Every ticket has a status from the defined enum
- createdAt ≤ updatedAt

### Current Business Rules
- Assignee is optional (tickets can exist without assignment)
- Status starts as "open"
- Any field can be updated at any time

### Future Business Rules Under Consideration
- Priority field (high, medium, low)
- Auto-assignment based on team/category
- SLA tracking based on creation time
- Required fields for certain status transitions

---

## Evolution Notes

**2026-01-11**: Initial behavior model
- Simple CRUD operations
- No access control
- No status transition restrictions
- No automatic behaviors (assignments, notifications, etc.)

As prototypes evolve, this document will capture emerging interaction patterns and business logic.
