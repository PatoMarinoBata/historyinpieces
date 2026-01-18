# Copilot Instructions for historical-collectibles

## Big Picture
- Next.js 16 App Router app with a backoffice powered by `@premieroctet/next-admin` on `/admin` and credentials auth via NextAuth.
- Data layer: PostgreSQL (Neon) accessed with Prisma 7.2; datasource URL is defined in `prisma/prisma.config.ts`, **not** in `schema.prisma` or the PrismaClient constructor.
- Auth: `next-auth` credentials provider backed by Prisma `User` model; role-based guard expects `role === "ADMIN"`.
- Styling: Tailwind CSS v3 (config in `tailwind.config.js`, globals in `src/app/globals.css`).

## Files & Flow
- Admin page: `src/app/admin/[[...nextadmin]]/page.tsx` uses `auth()` for session, redirects to `/auth/signin` when missing, checks role, then calls `getNextAdminProps` and renders `<NextAdmin />`.
- Admin API handler: `src/app/api/admin/[[...nextadmin]]/route.ts` uses `createHandler` with `prisma` and `options`.
- Auth route: `src/app/api/auth/[...nextauth]/route.ts` defines credentials provider, session/jwt callbacks, and exports `{ GET, POST, auth }` (App Router pattern).
- Prisma client: `src/lib/prisma.ts` exports a singleton `new PrismaClient()` with no options; do **not** add `datasourceUrl/adapter` here (causes constructor errors with Prisma 7).
- Prisma config: `prisma/prisma.config.ts` sets `datasource.url = process.env.DATABASE_URL`; schema is in `prisma/schema.prisma` (no `url` field inside schema).
- Seeding: `prisma/seed.ts` upserts admin user (`admin@example.com` / password `admin`). Script is wired via `"prisma": { "seed": "tsx prisma/seed.ts" }`.
- Options for Next-Admin: `src/options.ts`.
- Auth secret env: `.env` must contain `AUTH_SECRET`.

## Commands
- Dev server: `npm run dev`.
- Generate Prisma client: `npx prisma generate` (honors `prisma/prisma.config.ts`).
- Push schema: `npx prisma db push` (uses DATABASE_URL from config file).
- Seed: `npx prisma db seed` (or `npm run prisma db seed` depending on your npm version) – creates the admin user.
- Inspect DB: `npx prisma studio` (opens browser UI).

## Gotchas
- Prisma 7 constructor errors occur if you pass `datasourceUrl`, `adapter`, or `accelerateUrl` in `PrismaClient()`; keep the constructor empty and rely on `prisma.config.ts`.
- Ensure `.env` has `DATABASE_URL` (pooled Neon URL) and `AUTH_SECRET`; restart `npm run dev` after changing env.
- If you change the admin password in `prisma/seed.ts`, re-run `npx prisma db seed`.
- Admin gate: unauthenticated users get redirected to `/auth/signin`; non-admin roles see “Acceso denegado — Solo administradores”.

## Patterns to follow
- Use `auth()` from the NextAuth route in server components/API to get the session (App Router pattern).
- Keep Prisma as a singleton via `globalThis` to avoid hot-reload connection churn.
- For admin data, always use `getNextAdminProps` / `createHandler` with `prisma` and shared `options`.
- Content paths for Tailwind are in `tailwind.config.js`; keep components under `src/app/**` covered.

## Quick References
- Prisma client singleton: `src/lib/prisma.ts`
- Prisma schema/config: `prisma/schema.prisma`, `prisma/prisma.config.ts`
- Auth route: `src/app/api/auth/[...nextauth]/route.ts`
- Admin page/API: `src/app/admin/[[...nextadmin]]/page.tsx`, `src/app/api/admin/[[...nextadmin]]/route.ts`
- Seed script: `prisma/seed.ts`
- Env sample: `.env` (DATABASE_URL, AUTH_SECRET)

If any section is unclear or incomplete, tell me which part to refine (e.g., Prisma setup, auth flow, or admin wiring).
