# Ticketing System Example

This is a complete working example demonstrating the Schema-First approach for building a support ticket management system.

## What This Example Shows

- **Complete API contract** in OpenAPI 3.1 format
- **Domain model** documenting the Ticket entity, attributes, and business rules
- **Behavior model** documenting ticket workflows and state transitions
- **Generated TypeScript types** from the schema
- **Mock API implementation** matching the contract
- **Working React UI** using the generated types

## Running the Example

### 1. Install Dependencies

```bash
# Install UI dependencies
cd ui
npm install
```

### 2. Start the UI

```bash
npm run dev
```

Visit [http://localhost:5173](http://localhost:5173) to see the ticketing interface.

## Exploring the Example

### Schema Evolution

The schema started simple and evolved as the prototype needed new features:

**Initial schema** (Day 1):
- Basic Ticket entity with id, title, description, status
- Simple CRUD endpoints

**Evolution** (documented in [schema/evolution-log.md](./schema/evolution-log.md)):
- Added assignee field for ownership
- Added filtering by status
- Added filtering by assignee

### Try Making a Change

**Add a priority field:**

1. **Update the prototype** - Edit [ui/src/pages/tickets.tsx](./ui/src/pages/tickets.tsx) and add a priority dropdown
2. **Run schema-evolution** - In Claude Code: `/schema-evolution "Add priority field to tickets"`
3. **Review the proposal** - AI will show the exact YAML changes needed
4. **Approve and update** - Schema, types, and docs are updated
5. **Run concept-sync** - Document the priority field in concept model
6. **Validate** - Run contract-validator to ensure consistency

## Project Structure

```
ticketing-system/
├── schema/
│   ├── api-contract.yaml          # OpenAPI schema for tickets API
│   └── evolution-log.md           # History of schema changes
├── concept-model/
│   ├── domain-model.md            # Ticket entity, business rules
│   └── behavior-model.md          # Workflows, state transitions
├── api/
│   ├── types/index.ts             # Generated TypeScript types
│   └── mock-server/tickets.ts     # Mock API implementation
└── ui/
    └── src/
        ├── pages/tickets.tsx      # Main tickets interface
        └── ...                    # React + Vite setup
```

## Key Artifacts

### API Contract
[schema/api-contract.yaml](./schema/api-contract.yaml) - Defines:
- `/tickets` - List/create tickets
- `/tickets/{id}` - Get/update specific ticket
- Ticket schema with validation rules
- Request/response formats

### Concept Model
[concept-model/domain-model.md](./concept-model/domain-model.md) - Explains:
- Ticket entity and attributes
- Ticket lifecycle states
- Business rules and invariants
- Domain vocabulary

[concept-model/behavior-model.md](./concept-model/behavior-model.md) - Documents:
- Ticket creation flow
- List/browse flow
- Update flow
- State transitions

### Generated Types
[api/types/index.ts](./api/types/index.ts) - TypeScript interfaces matching the schema

### Mock API
[api/mock-server/tickets.ts](./api/mock-server/tickets.ts) - In-memory API implementation for prototyping

## Learning from This Example

### 1. Schema-First Workflow

Notice how the prototype code in [ui/src/pages/tickets.tsx](./ui/src/pages/tickets.tsx):
- Imports types from `api/types` (generated from schema)
- Uses those types throughout the component
- Ensures type safety matches the API contract

### 2. Evolution Tracking

Check [schema/evolution-log.md](./schema/evolution-log.md) to see:
- What changes were made and when
- Why each change was needed (trigger + rationale)
- What artifacts were impacted

### 3. Concept Documentation

The concept model docs show how to:
- Explain domain concepts in non-technical language
- Document business rules clearly
- Track workflows and state transitions
- Maintain vocabulary consistency

## Next Steps

After exploring this example:

1. **Go back to the top-level template**
2. **Start your own project** with clean placeholders
3. **Use the three skills** (schema-evolution, concept-sync, contract-validator)
4. **Build your prototype** while keeping the contract aligned

See the main [README](../../README.md) for template usage instructions.
