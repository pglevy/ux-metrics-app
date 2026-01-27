# Mock API Server

This folder contains mock API implementations for prototyping.

## Purpose

While building your prototype, you need an API to call. Mock servers:
- Implement the API contract from your schema
- Provide realistic responses for testing
- Enable frontend development before backend is ready
- Can be replaced with real API without changing UI code

## How It Works

1. Define endpoints in [schema/api-contract.yaml](../../schema/api-contract.yaml)
2. Create mock implementations that follow the contract
3. Run mock server locally
4. Prototype UI calls the mock API
5. When real API is ready, swap the base URL

## Example

See [examples/ticketing-system/api/mock-server/](../../examples/ticketing-system/api/mock-server/) for a complete mock API implementation.

## Tools

You can create mocks using:
- Simple TypeScript/Node.js functions (like the example)
- Mock servers like `json-server`, `msw`, `mirage.js`
- OpenAPI mock generators like `prism`

Choose based on your needs and complexity.
