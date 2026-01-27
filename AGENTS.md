# Schema-First Development - Agent Reference

This document provides guidance for AI agents working with the Schema-First prototyping approach.

## Core Principle

**Keep the API contract and concept model synchronized with the prototype as it evolves.**

As the user builds their prototype, proactively detect when schema or documentation updates are needed and propose changes.

---

## Project Structure

```
skills-first-starter/
├── schema/                    # API contract (OpenAPI 3.1)
│   ├── api-contract.yaml      # Main schema definition
│   └── evolution-log.md       # Change history
├── concept-model/             # Domain documentation
│   ├── domain-model.md        # Entities, relationships, business rules
│   ├── behavior-model.md      # Workflows, state transitions
│   └── entity-relationship-diagram.md  # Visual ERD
├── api/                       # Generated artifacts
│   ├── types/                 # TypeScript types from schema
│   └── mock-server/           # Mock API for prototyping
├── ui/                        # Prototype UI (React + Sailwind)
├── .claude/skills/            # Contract-maintenance skills
│   ├── schema-evolution.md    # Detects schema needs
│   ├── concept-sync.md        # Keeps docs synchronized
│   └── contract-validator.md  # Validates consistency
└── examples/                  # Working examples
    └── ticketing-system/      # Complete ticketing example
```

**Key Distinction:**
- **Top-level folders** = User's project (clean templates)
- **examples/** = Working examples to learn from

---

## Contract-Maintenance Skills

### schema-evolution

**Purpose:** Detect when the prototype needs schema updates and propose changes.

**When to Invoke:**
- User adds form fields that don't exist in schema
- User implements filtering/sorting not supported by API
- User creates new UI pages implying new endpoints
- User mentions needing new data or capabilities

**How It Works:**
1. Reviews current `schema/api-contract.yaml`
2. Analyzes prototype code or user request
3. Proposes minimal OpenAPI changes
4. Updates `schema/evolution-log.md`

### concept-sync

**Purpose:** Keep domain and behavior documentation synchronized with schema changes.

**When to Invoke:**
- After schema changes are applied
- User adds new workflows or entities
- Business rules change or are clarified

**What It Updates:**
- `concept-model/domain-model.md` - Entity definitions
- `concept-model/behavior-model.md` - Workflow documentation
- `concept-model/entity-relationship-diagram.md` - Visual ERD

### contract-validator

**Purpose:** Check consistency across all contract artifacts.

**When to Invoke:**
- Before session wrap-up
- After major changes
- When user requests validation
- Periodically during development

**What It Checks:**
- Schema defines all entities in domain model
- Workflows match API endpoints
- Types are up-to-date with schema
- No orphaned or missing definitions

---

## Proactive Behavior

### Detecting Schema Needs

Watch for these patterns in prototype code:

| Prototype Pattern | Likely Schema Need |
|-------------------|-------------------|
| New form field | Add property to request/response |
| Filter dropdown | Add query parameter |
| Sort controls | Add sort query parameter |
| New entity page | New schema + CRUD endpoints |
| Status badges | Add enum field |
| Related data display | Add relationship/reference |

### When to Propose Changes

**DO propose schema changes when:**
- Prototype clearly needs data not in schema
- User explicitly mentions new requirements
- API calls would fail without the change

**DON'T propose changes for:**
- UI-only features (styling, client-side state)
- Derived/computed data from existing fields
- Experimental features not yet stabilized

### Communication Style

- Be concise - show the change, explain why
- Use code blocks for exact YAML/TypeScript
- Reference specific files and line numbers
- Track changes: "Schema is now aligned with prototype"

---

## Working with OpenAPI Schema

### Schema Location

Main contract: `schema/api-contract.yaml`

### Common Schema Patterns

**Adding a new field:**
```yaml
# In components/schemas/EntityName:
newField:
  type: string
  description: "Field description"
  # optional: enum, default, minLength, maxLength, pattern
```

**Adding a query parameter:**
```yaml
# In paths/endpoint/get/parameters:
- name: filter
  in: query
  schema:
    type: string
    enum: [option1, option2]
```

**Adding a new endpoint:**
```yaml
# In paths:
/new-resource:
  get:
    summary: List resources
    responses:
      '200':
        description: Success
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/ResourceList'
```

### Evolution Log Format

After schema changes, document in `schema/evolution-log.md`:

```markdown
## YYYY-MM-DD - Brief Title

**Trigger:** What prompted this change

**Changes:**
- Added `fieldName` to Entity schema
- Added query parameter `filter` to GET /entities

**Rationale:** Why this was needed

**Impact:**
- [x] api-contract.yaml updated
- [ ] Types regenerated
- [ ] Concept model updated (if needed)
```

---

## UI Development Reference

The prototype UI uses React with the Sailwind component library.

### UI Location

- **Template UI:** `ui/` (clean starter)
- **Example UI:** `examples/ticketing-system/ui/`

### Running the UI

```bash
cd ui && npm install && npm run dev
# Visit http://localhost:5173
```

### Sailwind Components

Import from `@pglevy/sailwind`:

```tsx
import { HeadingField, CardLayout, TextField, ButtonWidget } from '@pglevy/sailwind'
```

**Key Components:**
- **Form:** `TextField`, `DropdownField`, `CheckboxField`, `RadioButtonField`
- **Display:** `HeadingField`, `RichTextDisplayField`, `CardLayout`, `TagField`
- **Interactive:** `ButtonWidget`, `ButtonArrayLayout`, `TabsField`, `DialogField`

### SAIL Parameter Values

Always use UPPERCASE for SAIL parameters:

```tsx
// Correct
<TextField size="STANDARD" labelPosition="ABOVE" />

// Wrong
<TextField size="standard" labelPosition="above" />
```

### Build Validation

Before declaring UI work complete, verify the build:

```bash
cd ui && npm run build
```

Fix all TypeScript errors before proceeding.

---

## Typical Development Session

```
1. User requests feature → Agent builds UI
2. Agent detects schema need → Proposes update
3. User approves → Agent applies changes
4. Agent syncs concept model → Docs updated
5. Agent validates → Consistency confirmed
6. Continue building...
```

### Skill Invocation Examples

```bash
# Detect and propose schema changes
/schema-evolution "User added priority field to ticket form"

# Sync documentation after schema change
/concept-sync "Priority field added to tickets"

# Validate contract consistency
/contract-validator "Full validation before handoff"
```

---

## Optional Spec Analysis Tools

Two additional steering files provide deeper specification analysis when working with formal spec workflows (e.g., Spec Kit):

### #spec-clarify (Manual Inclusion)

**Purpose:** Interactive clarification workflow to reduce ambiguity in specifications before planning.

**When to Use:**
- After creating initial spec, before technical planning
- When spec has vague requirements or missing decisions
- To ensure all stakeholders align on scope and behavior

**How It Works:**
1. Scans spec for ambiguities across 10+ categories (functional scope, data model, UX flow, non-functional requirements, edge cases, etc.)
2. Asks up to 5 targeted clarification questions (multiple choice or short answer)
3. Provides recommended answers based on best practices
4. Integrates answers directly into spec with a `## Clarifications` section
5. Updates relevant spec sections to resolve ambiguities

**Invoke with:** `#spec-clarify` in your message when you have a spec that needs clarification

**Example Flow:**
```
User: "I have a spec for a ticketing system. #spec-clarify"
Agent: Analyzes spec, asks targeted questions like:
  - "How should concurrent ticket edits be handled?"
  - "What's the expected ticket volume per day?"
  - Updates spec with clarified requirements
```

### #spec-analyze (Manual Inclusion)

**Purpose:** Cross-artifact consistency analysis after tasks are generated.

**When to Use:**
- After spec, plan, and tasks are all created
- Before starting implementation
- To catch inconsistencies, gaps, or duplications

**What It Checks:**
- **Duplication:** Near-duplicate requirements
- **Ambiguity:** Vague adjectives, unresolved placeholders
- **Underspecification:** Missing measurable outcomes
- **Coverage Gaps:** Requirements without tasks, tasks without requirements
- **Inconsistency:** Terminology drift, conflicting requirements
- **Constitution Alignment:** Violations of project principles (if `/memory/constitution.md` exists)

**Output:** Read-only analysis report with severity ratings (CRITICAL/HIGH/MEDIUM/LOW) and remediation suggestions

**Invoke with:** `#spec-analyze` in your message after all spec artifacts exist

**Example Flow:**
```
User: "Validate my spec artifacts. #spec-analyze"
Agent: Produces analysis report showing:
  - 2 CRITICAL issues (requirements with no task coverage)
  - 3 HIGH issues (ambiguous performance requirements)
  - Coverage: 85% (17/20 requirements have tasks)
  - Suggests specific fixes
```

### Integration with Spec Workflow

These tools fit between standard spec phases:

```
1. Create Spec (spec.md)
2. [OPTIONAL] Clarify Spec (#spec-clarify) ← Reduces ambiguity
3. Create Plan (plan.md)
4. Generate Tasks (tasks.md)
5. [OPTIONAL] Analyze Artifacts (#spec-analyze) ← Validates consistency
6. Implement
```

**Note:** These are manual-inclusion steering files. They only activate when you explicitly reference them with `#spec-clarify` or `#spec-analyze` in your message.

---

## Success Criteria

A well-maintained contract includes:

- **Schema:** Complete OpenAPI definition for all prototype capabilities
- **Domain Model:** All entities documented with attributes and rules
- **Behavior Model:** All workflows documented with steps and logic
- **ERD:** Visual representation of entity relationships
- **Evolution Log:** History of why changes were made
- **Working Types:** TypeScript types match schema
- **Consistent Docs:** Everything references the same concepts

**The goal:** When developers receive this prototype, they have a complete specification to build from.

---

## Resources

- **Sailwind Repo:** https://github.com/pglevy/sailwind
- **OpenAPI Spec:** https://spec.openapis.org/oas/v3.1.0
- **Mermaid Diagrams:** https://mermaid.js.org/
