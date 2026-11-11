# ARRE — Codex environment setup

This document prepares the existing GitHub repository for use in Codex; it does **not** create a Codex cloud environment or connect credentials automatically.

## Repository
- GitHub: https://github.com/WIMSinc/ARRE
- Default branch: `main`
- Proposed Codex preparation changes: `codex/environment-setup`

## Stack confirmed from repository
- Node.js 20 (from `.replit`); npm with `package-lock.json`
- React 18, TypeScript, Vite, Tailwind CSS, Radix UI
- Three.js and A-Frame for immersive/3D interfaces
- Express server
- Drizzle ORM with Neon/PostgreSQL

## Connecting Codex
1. Open Codex in ChatGPT or the Codex app and connect/authorize the GitHub account that can access `WIMSinc/ARRE`.
2. Choose `WIMSinc/ARRE` as the repository and select `main` (after this setup PR is merged) or `codex/environment-setup` to preview the instructions before merging.
3. For a Codex cloud environment, use Node.js 20 and run `npm ci` in the setup step.
4. Provide `DATABASE_URL` as a protected secret only when a task requires the database. Use a dedicated disposable/dev PostgreSQL or Neon database. Avoid sharing the production connection string with agents.
5. Run validation commands `npm run check` and `npm run build`. Use `npm run dev` for app preview on port 5000 once the DB is configured.
6. Create and review pull requests for generated changes rather than editing the default branch directly.

## Known portability notes
- Replit's `.replit` configuration references Node 20, PostgreSQL 16, port 5000, and Replit deployment. These settings do not automatically provision services in Codex.
- `server/db.ts` requires `DATABASE_URL` at module load, so a missing database secret can prevent server startup even if frontend-only work is intended.
- The existing `npm run db:push` changes database schema; do not use it on production or shared staging without authorization.
- No automated test script is declared in the current `package.json`; use typecheck/build for baseline checks, and introduce targeted tests in a separate change.

## Suggested first Codex task
> Audit the ARRE repository without modifying application behavior. Run `npm ci`, `npm run check`, and `npm run build`. Identify any typecheck/build issues, missing environment variables, security risks, and the current degree of implementation of 3D/AR, CRM, MLS, and collaboration features. Produce a prioritized remediation plan. Do not connect to or modify production services.

## Security reminder
The repository is currently **public**. Audit committed code for API keys, secrets, private documents, and sensitive sample data; do not add proprietary assets without reviewing repository visibility.
