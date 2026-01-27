---
name: "contract-validator"
displayName: "Contract Validator"
description: "Ensure consistency across all product artifacts including API schema, concept model, prototypes, and generated code. Validates cross-artifact consistency and identifies discrepancies before they become problems."
keywords: ["validation", "consistency", "contract", "schema", "prototype", "documentation"]
author: "Philip Levy"
---

# Contract Validator Power

**Ensure consistency across all product artifacts: API schema, concept model, prototypes, and generated code.**

## Overview

As prototypes evolve rapidly, it's easy for artifacts to drift out of sync. This power validates consistency and catches discrepancies before they become problems, ensuring your API contract, documentation, and code stay aligned.

## What This Power Does

- **Validates cross-artifact consistency** between schema, docs, and code
- **Identifies discrepancies** in naming, definitions, and references
- **Checks completeness** of documentation and evolution tracking
- **Reports findings** by severity (critical, warning, suggestion)
- **Provides actionable fixes** for each issue found

## When to Use

Use this power when:
- Before session wrap-up or major milestones
- After significant schema or concept model changes
- Periodically during active development
- When you suspect inconsistencies
- Before handing off to development teams

## How It Works

1. **Input**: Request validation (full contract or specific scope)
2. **Analysis**: Reads all artifacts and checks cross-references
3. **Validation**: Runs consistency checks across multiple dimensions
4. **Report**: Structured findings with severity levels and fixes
5. **Action Items**: Priority-ordered list of what needs attention

## Example Usage

```
"Validate contract consistency"
"Check if prototype matches schema"
"Full validation before handoff"
```

## Output Format

The power returns a structured validation report:
- **Validated Artifacts**: What was checked
- **Critical Issues**: Breaks contract or causes runtime errors
- **Warnings**: Incomplete documentation or minor inconsistencies
- **Suggestions**: Opportunities for improvement
- **What's Working Well**: Positive observations
- **Action Items**: Priority-ordered fixes
- **Summary**: Overall assessment

## Validation Dimensions

### Schema ↔ Domain Model
- Every schema entity documented in domain model
- Entity properties appear in attributes lists
- Enums documented in vocabulary or business rules
- Required fields documented in business rules

### Schema ↔ Behavior Model
- Every schema endpoint documented in behavior model
- Query parameters explained in filtering/sorting sections
- Request/response bodies explained in workflow steps
- State transitions documented with diagrams and rules

### Schema ↔ Prototype
- Prototype API calls match schema endpoints
- Request bodies match schema definitions
- Expected responses match schema definitions
- Query parameters match schema parameters

### Schema ↔ Generated Types
- TypeScript types match schema definitions
- Type names match schema component names
- Required vs optional fields match
- Enums match schema enum values

### Naming Consistency
- Same concepts use same terms across artifacts
- Consistent capitalization and singular/plural
- Field names follow conventions
- Workflow names match operations

### Evolution Tracking
- Recent changes logged in evolution-log.md
- Concept updates referenced in evolution notes
- Impact checklists completed

## Severity Levels

- **🔴 Critical**: Breaks contract, causes runtime errors, or major inconsistencies
- **⚠️ Warning**: Incomplete documentation, minor inconsistencies, or missing references
- **💡 Suggestion**: Opportunities for improvement, best practices, or enhancements

## Related Powers

- **schema-evolution**: Fixes schema gaps identified by validation
- **concept-sync**: Updates documentation gaps identified by validation

## Project Context

This power works with the Schema-First development approach where:
- `schema/api-contract.yaml` - API contract
- `concept-model/domain-model.md` - Domain concepts
- `concept-model/behavior-model.md` - Workflows
- `schema/evolution-log.md` - Change history
- `ui/` - React prototype
- `api/types/` - Generated TypeScript types
