# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Fastify API project using TypeBox for runtime type validation and OpenAPI schema generation. The project uses Bun as the runtime and includes auto-generated type-safe client SDKs.

## Development Commands

### Running the Server
```bash
bun run dev                    # Run server in watch mode
bun run src/server.ts          # Run server once
```

The server starts on port 3000. Swagger documentation is available at http://localhost:3000/docs

### Testing
```bash
bun test                       # Run all tests
bun test src/app.test.ts       # Run a specific test file
```

Tests use Bun's built-in test runner and Fastify's `inject()` method for request simulation.

### Client SDK Generation
```bash
bun run openapi-ts             # Generate client SDK from OpenAPI spec
```

This fetches the OpenAPI spec from the running server (http://localhost:3000/docs/json) and generates a type-safe client SDK in `src/client-sdk/`. The server must be running for this command to work.

## Architecture

### Core Components

**src/app.ts**: Main Fastify application instance with:
- TypeBox schema definitions and validation
- Swagger/OpenAPI plugin registration
- Route definitions with typed handlers
- Base response schemas for error handling (400, 401, 500)

**src/server.ts**: Server entry point that starts the Fastify app on port 3000

**src/client.ts**: Example client usage demonstrating the auto-generated SDK

**src/client-sdk/**: Auto-generated type-safe client SDK (regenerated via `openapi-ts` command)

### Schema-First Pattern

This codebase follows a schema-first approach:
1. Define TypeBox schemas with `Type.Object()` including `$id` for reusability
2. Register schemas in Swagger's `components.schemas`
3. Use schemas in route definitions for params, body, and response validation
4. Generate client SDK from the resulting OpenAPI spec

TypeBox schemas serve dual purpose:
- Runtime validation via Fastify
- OpenAPI documentation generation
- TypeScript type inference via `Static<typeof Schema>`

### Route Registration

Routes are registered as Fastify plugins using `app.register(routes)`. Use `instance.withTypeProvider<TypeBoxTypeProvider>()` to enable TypeBox type inference in route handlers.
