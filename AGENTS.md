# ARRE — Codex repository instructions

## Project
ARRE (Augmented Reality Real Estate) is a full-stack TypeScript application for commercial real estate visualization, property/project management, and immersive 3D/AR experiences. This repository contains a React/Vite client, Express API, shared database schema, and Drizzle migrations. Keep existing functionality intact and make narrowly scoped changes.

## Layout
- `client/src/pages/`: application routes and feature pages
- `client/src/components/`: application-specific and shared UI components
- `client/src/components/ui/`: Radix-based UI primitives
- `client/src/context/`: React context providers
- `server/`: Express server, endpoints, database access, dev hosting
- `shared/schema.ts`: Drizzle schema and related types
- `migrations/`: database migrations
- `replit.md` and `.replit`: legacy Replit-specific documentation/configuration

## Runtime & commands
- Prefer Node.js 20 and npm; use the committed `package-lock.json`.
- Install: `npm ci`
- Typecheck: `npm run check`
- Build: `npm run build`
- Start development server: `npm run dev` (port 5000).
- Production: `npm run start` after build.
- Schema sync: `npm run db:push` **only** against an explicitly approved development/test database; this changes schema state.

## Database and secrets
- `DATABASE_URL` is required for the database module and Drizzle configuration. Use a dedicated development Neon/PostgreSQL database for Codex execution; never connect an unreviewed agent run to production data.
- Never commit `.env`, access tokens, credentials, customer/property data exports, or other secrets.
- Inspect `server/routes.ts`, `server/storage.ts`, and `shared/schema.ts` before modifying persistence or APIs.
- External service integrations may require additional secrets; identify them in code before attempting to exercise the corresponding feature.

## Working rules
1. Start by reading `package.json`, this file, and relevant modules.
2. Create focused edits; avoid wholesale rewrites or upgrades unless asked.
3. Verify changes with `npm run check` and `npm run build` when dependencies/environment permit. Report failures instead of claiming success.
4. Test UI and API changes appropriately, with explicit attention to 3D rendering and browser compatibility.
5. Do not assume that a component's name means an integration is live; verify functional paths and backend wiring.
6. Do not modify existing Replit deployment settings by default.
7. Changes to authentication, billing, MLS integrations, model uploads, and customer data require extra security review.
8. Use feature branches and pull requests; do not push unreviewed changes to `main`.
