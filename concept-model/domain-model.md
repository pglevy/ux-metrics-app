# Domain Model

This document describes the core entities, relationships, and business rules of your system.

**Replace this placeholder content with your domain.**

---

## Instructions

As you build your prototype and evolve your schema, document your domain concepts here:

### Core Entities

For each main entity in your system, document:
- **Name**: What it's called
- **Purpose**: What it represents
- **Attributes**: Key properties and their meanings
- **Lifecycle**: States it goes through (if applicable)
- **Business Rules**: Constraints, defaults, validation rules

### Relationships

Document how entities relate to each other:
- One-to-many (e.g., User → Orders)
- Many-to-many (e.g., Products ↔ Categories)
- Dependencies and references

### Domain Vocabulary

Define key terms used across the system to maintain consistency.

---

## Example

See [examples/ticketing-system/concept-model/domain-model.md](../../examples/ticketing-system/concept-model/domain-model.md) for a complete example of a domain model.

---

## Template

Use this template for each entity:

```markdown
### [Entity Name]

**Purpose**: [What this entity represents]

**Attributes:**
- **[Attribute 1]**: [Description and meaning]
- **[Attribute 2]**: [Description and meaning]

**Lifecycle States** (if applicable):
1. [State 1]: [Description]
2. [State 2]: [Description]

**Business Rules:**
- [Rule 1]
- [Rule 2]
```
