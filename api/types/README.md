# Generated Types

This folder will contain TypeScript types generated from your OpenAPI schema.

## How It Works

1. Define your schema in [schema/api-contract.yaml](../../schema/api-contract.yaml)
2. Generate types from the schema (manually or via tooling)
3. Import these types in your UI prototype for type safety

## Example

See [examples/ticketing-system/api/types/](../../examples/ticketing-system/api/types/) for a complete example of generated types.

## Generating Types

You can use tools like:
- `openapi-typescript` - Generate TypeScript from OpenAPI schemas
- Custom scripts via schema-evolution skill
- Manual type definitions that match your schema

The goal is to ensure your prototype uses the same types that the API will implement.
