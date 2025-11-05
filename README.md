# Fastify + TypeBox + Bun Example

A minimal example project demonstrating how to build type-safe REST APIs with automatic OpenAPI/Swagger documentation using **Fastify**, **TypeBox**, and **Bun**.

## Features

- ✅ **Runtime validation** with TypeBox schemas
- ✅ **Type inference** without manual generics
- ✅ **Auto-generated OpenAPI spec** with proper schema references
- ✅ **Type-safe client SDK** generated from OpenAPI spec
- ✅ **Swagger UI** at `/docs`
- ✅ Fast development with Bun's watch mode

## Quick Start

Install dependencies:

```bash
bun install
```

Run the server in development mode:

```bash
bun run dev
```

The server will start at http://localhost:3000 with Swagger docs at http://localhost:3000/docs

## Project Structure

```
src/
├── app.ts          # Fastify app with TypeBox schemas and routes
├── server.ts       # Server entry point
├── client.ts       # Example client usage
├── app.test.ts     # Tests using Fastify's inject()
└── client-sdk/     # Auto-generated type-safe client SDK
```

## Key Concepts

### Schema-First Development

TypeBox schemas serve multiple purposes:
- Runtime validation
- TypeScript type inference
- OpenAPI documentation
- Client SDK generation

### Schema References

Use `Type.Ref()` to create reusable schema references in OpenAPI:

```typescript
// Define schema with $id
const ItemSchema = Type.Object({ ... }, { $id: "Item" });

// Register with Fastify
app.addSchema(ItemSchema);

// Reference in routes
response: {
  200: Type.Ref("Item")  // Creates $ref in OpenAPI spec
}
```

## Commands

```bash
bun run dev                # Run server with auto-reload
bun test                   # Run all tests
bun test src/app.test.ts   # Run specific test
bun run openapi-ts         # Generate client SDK (server must be running)
bun x tsc --noEmit         # Type check
```

## Why TypeBox + Fastify?

- **Better type inference** than Zod - no manual generics needed
- **Native JSON Schema** - perfect for OpenAPI
- **Built-in validation** - no extra middleware
- **Clean schema references** - proper `$ref` support

## Tech Stack

- [Bun](https://bun.com) - Fast JavaScript runtime
- [Fastify](https://fastify.dev) - Fast web framework
- [TypeBox](https://github.com/sinclairzx81/typebox) - JSON Schema type builder
- [@hey-api/openapi-ts](https://github.com/hey-api/openapi-ts) - OpenAPI client generator
