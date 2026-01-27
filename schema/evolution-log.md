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
