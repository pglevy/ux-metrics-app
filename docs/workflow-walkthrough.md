# Workflow Walkthrough

This guide walks through a complete example of using the Schema-First approach to build a ticketing system prototype.

---

## The Problem We're Solving

**Traditional Prototype → API Translation:**
1. PM builds interactive prototype with mock data
2. Prototype evolves rapidly with nested UI components and sprawling code
3. Developers receive prototype and must "reverse engineer" the implied API contract
4. Schema/API gets documented after the fact
5. Misalignment between prototype and implementation

**Schema-First Approach:**
1. PM builds prototype with AI assistance
2. **As prototype evolves, API schema evolves automatically**
3. **Concept model stays synchronized automatically**
4. Developers receive clear API contract + living concept model
5. Prototype already uses real API shape (not just mock data patterns)

---

## Initial Setup: Starting with a Schema

### Step 1: Define Initial API Contract

We start with a minimal schema for our ticketing system:

```yaml
# schema/api-contract.yaml
paths:
  /tickets:
    get:
      summary: List tickets
  /tickets/{ticketId}:
    get:
      summary: Get ticket by ID

components:
  schemas:
    Ticket:
      type: object
      required: [id, title, description, status]
      properties:
        id:
          type: string
        title:
          type: string
        description:
          type: string
        status:
          type: string
          enum: [open, in_progress, closed]
```

### Step 2: Generate Types and Concept Model

From this schema, we generate:

**TypeScript Types** ([api/types/index.ts](../api/types/index.ts)):
```typescript
export type TicketStatus = 'open' | 'in_progress' | 'closed'

export interface Ticket {
  id: string
  title: string
  description: string
  status: TicketStatus
}
```

**Domain Model** ([concept-model/domain-model.md](../concept-model/domain-model.md)):
- Ticket entity with attributes
- Business rules (title required, status lifecycle)
- Domain vocabulary

**Behavior Model** ([concept-model/behavior-model.md](../concept-model/behavior-model.md)):
- List tickets workflow
- View ticket details workflow

### Step 3: Build Initial Prototype

Create a simple UI that uses the generated types:

```typescript
// templates/ui/src/pages/tickets.tsx
import type { Ticket, TicketStatus } from '../../../api/types'

export default function Tickets() {
  const [tickets, setTickets] = useState<Ticket[]>([])

  // UI uses the schema-defined types
  // Mock data matches the schema structure
}
```

**Key Point:** The prototype is already using types that match the API contract.

---

## Iteration 1: Adding Priority Field

### Scenario

PM wants to add a priority field to tickets so users can mark urgent items.

### Traditional Approach
1. Add priority dropdown to UI
2. Update mock data in component
3. Document that "we'll need a priority field" in notes
4. Developer later infers this from prototype code

### Schema-First Approach

#### PM Action: Update Prototype

```typescript
// PM adds priority dropdown to create ticket form
<SelectField
  label="Priority"
  name="priority"
  value={newTicket.priority}
  options={[
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'critical', label: 'Critical' },
  ]}
/>
```

#### AI Detects Need (Proactive)

When you commit or share this change, you can say:
> "I added a priority field to the create ticket form"

Or the AI proactively notices when reviewing code:
> "I see you're using a `priority` field in the form but it's not in the schema yet"

#### Run Schema Evolution Skill

```bash
# Option 1: Invoke the skill explicitly
/schema-evolution "Add priority field to tickets"

# Option 2: AI runs it automatically when detecting the gap
```

**Skill Output:**

```markdown
## Proposed Schema Change

**Trigger**: Prototype added priority field to ticket creation form

**Analysis**:
Current Ticket schema has no priority field. The form is trying to submit a priority value but the API contract doesn't define it.

**Proposed Change**:
```yaml
# In components/schemas/Ticket, add:
priority:
  type: string
  enum: [low, medium, high, critical]
  default: medium
```

**Impact**:
- [ ] Update schema/api-contract.yaml
- [ ] Log change in schema/evolution-log.md
- [ ] Regenerate TypeScript types
- [ ] Update concept-model (add priority to Ticket attributes)
```

#### PM Reviews and Approves

PM confirms: "Yes, add priority with those enum values"

#### AI Updates Artifacts

**schema/api-contract.yaml** - Priority field added to Ticket schema

**schema/evolution-log.md** - New entry:
```markdown
## 2026-01-11 - Add Priority Field

**Trigger**: Prototype needs priority field for ticket creation

**Change**:
- Added priority field to Ticket schema (enum: low, medium, high, critical)
- Added priority to CreateTicketRequest with default value of medium

**Rationale**: Users need to indicate urgency of tickets

**Impact**:
- ✅ api-contract.yaml updated
- ⏳ concept-model to be updated
- ⏳ types to be regenerated
```

#### Run Concept Sync Skill

```bash
/concept-sync "Update concept model for priority field"
```

**Skill Output:**

Updates domain-model.md to add priority attribute with description, business rules, and vocabulary entry.

#### Regenerate Types

Types are automatically regenerated (or manually triggered):

```typescript
export interface Ticket {
  id: string
  title: string
  description: string
  status: TicketStatus
  priority: 'low' | 'medium' | 'high' | 'critical'  // ← New!
}
```

#### Result

✅ **Schema updated** - Priority field is now part of the API contract
✅ **Concept model updated** - Priority is documented as domain concept
✅ **Types regenerated** - TypeScript knows about priority
✅ **Evolution logged** - Change is tracked with rationale

**Time to Production:** When developers start building, they have a clear API contract that already includes priority.

---

## Iteration 2: Adding Filtering

### Scenario

PM builds a filter dropdown to show only high-priority tickets.

### PM Action: Add Filter UI

```typescript
// Prototype tries to call API with filter parameter
const filtered = await api.get('/tickets?priority=high')
```

### AI Detects Mismatch

> "The schema defines GET /tickets but doesn't support a `priority` query parameter yet"

### Run Schema Evolution Skill

**Skill Output:**

```markdown
## Proposed Schema Change

**Trigger**: Prototype attempting to filter tickets by priority

**Analysis**:
Current GET /tickets endpoint supports filtering by status and assignee, but not priority.

**Proposed Change**:
```yaml
# In paths/tickets/get/parameters, add:
- name: priority
  in: query
  schema:
    type: string
    enum: [low, medium, high, critical]
```

**Impact**:
- [ ] Update schema/api-contract.yaml
- [ ] Log change in schema/evolution-log.md
- [ ] Update mock API to support priority filtering
```

### Artifacts Updated

- ✅ Schema updated with priority query parameter
- ✅ Evolution log updated
- ✅ Mock API updated to filter by priority
- ✅ Behavior model updated to document filtering capability

---

## Iteration 3: Validating Consistency

### Scenario

After several iterations, PM wants to ensure everything is in sync before handing off to dev team.

### Run Contract Validator Skill

```bash
/contract-validator "Full contract validation"
```

**Skill Output:**

```markdown
# Contract Validation Report

**Date**: 2026-01-11
**Scope**: Full contract validation

## ✅ Validated Artifacts

- [x] schema/api-contract.yaml
- [x] concept-model/domain-model.md
- [x] concept-model/behavior-model.md
- [x] Prototype code (templates/ui/src/pages/tickets.tsx)
- [x] Generated types (api/types/index.ts)

## 🔴 Critical Issues

**0 critical issues found.**

## ⚠️ Warnings

**0 warnings found.**

## ✨ What's Working Well

- All schema entities are documented in domain model
- All endpoints are documented in behavior model
- Prototype uses schema-defined types throughout
- Evolution log is complete and up-to-date
- Strong alignment between schema, concept docs, and prototype

## Summary

Contract is fully consistent! Schema, domain model, behavior model, and prototype are all aligned. Ready for development team handoff.
```

---

## What Gets Handed to Developers

Instead of:
- ❌ Videos of prototype behavior
- ❌ Sprawling prototype code to reverse engineer
- ❌ Scattered notes about intended API

Developers receive:
- ✅ **Complete OpenAPI schema** ([schema/api-contract.yaml](../schema/api-contract.yaml))
- ✅ **Domain model** explaining entities, relationships, business rules
- ✅ **Behavior model** explaining workflows and state transitions
- ✅ **Evolution log** showing how requirements emerged and why
- ✅ **Working prototype** that already uses the real API shape
- ✅ **Generated types** ready to use

---

## Key Benefits

### For Product Teams

**Faster Iteration:**
- Build prototypes without worrying about documentation
- AI keeps schema and docs synchronized automatically
- Validate consistency at any time

**Better Communication:**
- Schema is always up-to-date with latest prototype
- Concept model explains the "why" not just the "what"
- Evolution log captures decision rationale

### For Development Teams

**Clear Contract:**
- OpenAPI schema defines exact API requirements
- No guesswork about data types, validation rules, or endpoints
- Types are pre-generated and match schema

**Living Documentation:**
- Domain model explains business concepts
- Behavior model documents workflows
- Evolution log provides context for decisions

**Shorter Prototype → API Path:**
- API contract is already defined
- Developers implement, not translate
- Fewer back-and-forth clarifications

---

## Skills Reference

### When to Use Each Skill

| Skill | When to Use | Output |
|-------|-------------|--------|
| **schema-evolution** | Prototype adds new feature, field, or endpoint | Updated schema + evolution log entry |
| **concept-sync** | Schema changed, need to update domain/behavior docs | Updated concept model docs |
| **contract-validator** | Want to check consistency across artifacts | Validation report with issues and recommendations |

### Typical Workflow

```
Prototype Change
    ↓
schema-evolution detects need
    ↓
Propose schema change → PM approves
    ↓
Update schema/api-contract.yaml
    ↓
concept-sync updates domain/behavior model
    ↓
Regenerate types
    ↓
contract-validator confirms consistency
    ↓
Continue prototyping
```

---

## Advanced Scenarios

### Breaking Changes

**Scenario:** Need to rename `assignee` to `owner`

**Approach:**
1. schema-evolution proposes the change
2. Mark as breaking change in evolution log
3. Create migration notes for existing data
4. Update all artifacts consistently

### Complex Workflows

**Scenario:** Adding bulk operations (update multiple tickets at once)

**Approach:**
1. Prototype the bulk UI
2. schema-evolution adds new endpoint (POST /tickets/bulk-update)
3. concept-sync documents the bulk workflow in behavior model
4. contract-validator ensures consistency

### Multiple Related Entities

**Scenario:** Adding Comments entity (related to Tickets)

**Approach:**
1. Prototype comment UI
2. schema-evolution creates Comment schema and relationship
3. concept-sync updates domain model with new entity and relationship
4. behavior model documents comment workflow

---

## Next Steps

1. **Try the example**: Load the tickets prototype and explore
2. **Make a change**: Add a new field or feature
3. **Run the skills**: See how schema-evolution and concept-sync keep things aligned
4. **Validate**: Run contract-validator to check consistency
5. **Iterate**: Continue prototyping with confidence

The goal is **shorter time from prototype to production API** by maintaining the contract layer as you build.
