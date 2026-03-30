# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
yarn test                  # Run all tests (includes coverage)
yarn test --testPathPattern src/async  # Run tests in a specific directory
npx jest path/to/file.test.ts --no-coverage  # Run a single test file
yarn build                 # Build with tsdown (outputs ESM + CJS + types to dist/)
yarn lint                  # ESLint
yarn types:check           # TypeScript type checking (tsc --noEmit)
yarn format:fix            # Prettier
```

## Architecture

This is a TypeScript utility library (`@friendsoftheweb/utils`) published with dual ESM/CJS output via `tsdown`.

**Two public entry points:**
- `src/index.ts` — general utilities (safe for browser and Node)
- `src/node/index.ts` — Node-only utilities (encryption, environment variables)

**Module categories under `src/`:**
- `async/` — concurrency primitives (`Semaphore`, `limitConcurrency`, `forEachConcurrent`, `delay`)
- `csv/` — CSV serialization and streaming
- `formatting/` — value, duration, file size, date formatters
- `http/` — HTTP header utilities
- `language/` — slugify, transliterate
- `time/` — date/time helpers (uses `date-fns` + `@date-fns/tz`)
- `transformation/` — parsing and data transformation utilities
- `types/` — shared TypeScript types
- `validation/` — `assert`, presence checks
- `node/encryption/` — encrypt/decrypt values
- `node/environment/` — typed `process.env` accessors

Each category has an `index.ts` that re-exports everything in that module. Tests live in `__tests__/` subdirectories alongside the source files.

**Key tooling notes:**
- `lodash-es` is transformed by Jest (not excluded from `transformIgnorePatterns`)
- ESLint enforces sorted imports via `eslint-plugin-perfectionist`
- Husky + lint-staged run checks on pre-commit
