# Behavior Model

This document describes the key interactions, workflows, and behavioral patterns in your system.

**Replace this placeholder content with your workflows.**

---

## Instructions

As you build your prototype, document how users interact with your system:

### Primary Workflows

For each main workflow, document:
- **Actor**: Who performs this action
- **Steps**: What happens step-by-step
- **Business Logic**: Rules, validations, calculations
- **Error Cases**: What can go wrong and how it's handled

### State Transitions

If your entities have states, document:
- Allowed transitions (what can move to what)
- Transition rules (when/why transitions happen)
- Automatic vs manual transitions

### Business Rules & Invariants

Document constraints that are always true or rules that govern behavior.

---

## Example

See [examples/ticketing-system/concept-model/behavior-model.md](../../examples/ticketing-system/concept-model/behavior-model.md) for a complete example of workflow documentation.

---

## Template

Use this template for each workflow:

```markdown
### [Workflow Name]

**Actor**: [Who performs this]

**Steps:**
1. [Step 1]
2. [Step 2]
3. [Step 3]

**Business Logic:**
- [Rule or validation]
- [Calculation or transformation]

**Error Cases:**
- [Error scenario] → [How it's handled]
```
