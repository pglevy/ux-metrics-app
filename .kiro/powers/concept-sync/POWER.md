---
name: "concept-sync"
displayName: "Concept Sync"
description: "Keep your concept model documentation synchronized with your evolving API schema and prototypes. Syncs domain and behavior models with schema changes to maintain consistency between technical implementation and business concepts."
keywords: ["concept", "documentation", "schema", "sync", "domain", "behavior", "model"]
author: "Philip Levy"
---

# Concept Sync Power

**Keep your concept model documentation synchronized with your evolving API schema and prototypes.**

## Overview

The concept model explains WHAT your system does and WHY, while the schema defines HOW it's implemented. As prototypes evolve and schemas change, the concept model must stay synchronized. This power keeps your domain and behavior documentation accurate and up-to-date.

## What This Power Does

- **Syncs domain model** with schema entities, attributes, and relationships
- **Updates behavior model** with workflows, state transitions, and business logic
- **Maintains consistency** between technical implementation and business concepts
- **Tracks evolution** of domain understanding over time
- **Uses clear language** focused on business perspective, not technical details

## When to Use

Use this power when:
- Schema changes are applied (new fields, endpoints, or entities)
- New workflows or behaviors are discovered during prototyping
- Business rules change or are clarified
- Concept model and schema are out of sync

## How It Works

1. **Input**: Provide schema changes, prototype insights, or explicit documentation requests
2. **Analysis**: Determines impact on domain model and/or behavior model
3. **Updates**: Proposes exact markdown changes to concept documentation
4. **Validation**: Ensures terminology is consistent across all docs
5. **Evolution**: Tracks when and why changes were made

## Example Usage

```
"Document the priority field added to tickets"
"Update docs for bulk status update workflow"
"Sync concept model after schema changes"
```

## Output Format

The power returns:
- **Trigger**: What changed in schema or prototype
- **Analysis**: What aspect of concept model needs updating
- **Proposed Changes**: Exact markdown for domain-model.md and/or behavior-model.md
- **Validation**: Checklist ensuring consistency
- **Summary**: Brief explanation of updates

## Documentation Style

Good concept documentation:
- Explains WHAT and WHY, not HOW
- Uses domain language (not technical jargon)
- Focuses on user/business perspective
- Includes examples and diagrams where helpful

## What Gets Updated

### Domain Model (`concept-model/domain-model.md`)
- Entity definitions and attributes
- Relationships between entities
- Business rules and constraints
- Domain vocabulary

### Behavior Model (`concept-model/behavior-model.md`)
- Workflows and interaction patterns
- State transitions and rules
- Business logic and validation
- Use cases and scenarios

## Related Powers

- **schema-evolution**: Proposes schema changes that may require concept updates
- **contract-validator**: Validates consistency between schema and concept docs

## Project Context

This power works with the Schema-First development approach where:
- `schema/api-contract.yaml` - Technical API contract
- `concept-model/domain-model.md` - Business entities and rules
- `concept-model/behavior-model.md` - Workflows and interactions
- `concept-model/entity-relationship-diagram.md` - Visual ERD
