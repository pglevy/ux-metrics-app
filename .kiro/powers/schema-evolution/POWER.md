---
name: "schema-evolution"
displayName: "Schema Evolution"
description: "Keep your API contract synchronized with UI prototype changes. Proactively detects schema needs from prototype code and proposes OpenAPI contract updates to maintain alignment."
keywords: ["schema", "api", "openapi", "evolution", "prototype", "contract"]
author: "Philip Levy"
---

# Schema Evolution Power

**Keep your API contract synchronized with UI prototype changes.**

## Overview

As UI prototypes evolve, they often need new data or API capabilities. This power proactively detects these needs and proposes schema updates to keep your OpenAPI contract aligned with your prototype.

## What This Power Does

- **Detects schema needs** from prototype code changes or explicit requests
- **Analyzes current schema** to identify gaps and required changes
- **Proposes minimal updates** following OpenAPI 3.1 best practices
- **Documents evolution** in the schema evolution log
- **Validates changes** to ensure they support prototype requirements

## When to Use

Use this power when:
- Adding form fields that don't exist in the schema
- Implementing filtering/sorting not supported by the API
- Creating new UI pages that imply new endpoints
- Prototype code makes API calls that aren't defined in the schema
- You explicitly need new data or capabilities

## How It Works

1. **Input**: Provide prototype code changes, explicit requests, or describe what the prototype needs
2. **Analysis**: Reviews `schema/api-contract.yaml` to identify what needs to change
3. **Proposal**: Shows exact YAML changes needed with clear rationale
4. **Documentation**: Updates `schema/evolution-log.md` with change history
5. **Validation**: Explains how to verify the change works

## Example Usage

```
"Add priority field to tickets"
"Prototype needs to filter tickets by assignee"
"New comment entity for ticket discussions"
```

## Output Format

The power returns:
- **Trigger**: What prompted the change
- **Analysis**: Current schema state and why it needs updating
- **Proposed Change**: Exact YAML to add/modify
- **Impact**: Checklist of affected artifacts
- **Validation**: How to verify the change works

## Schema Design Principles

- Start simple (add fields as optional when unsure)
- Use standard types (string, number, boolean, array, object)
- Use enums for bounded values (status, priority, categories)
- Add validation at boundaries (minLength, maxLength, pattern)
- Consider queries (if UI filters/sorts by it, make it a top-level field)

## Related Powers

- **concept-sync**: Updates domain and behavior documentation after schema changes
- **contract-validator**: Validates consistency across all contract artifacts

## Project Context

This power works with the Schema-First development approach where:
- `schema/api-contract.yaml` - Main OpenAPI contract
- `schema/evolution-log.md` - Change history
- `concept-model/` - Domain and behavior documentation
- `ui/` - React prototype using the contract
