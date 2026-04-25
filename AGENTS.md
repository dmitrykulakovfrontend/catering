<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:project-conventions -->
# Project conventions for agents

## Next.js 16.2.3 — read docs before adding API-level code
Before touching layouts, route handlers, server actions, `revalidate`, images, metadata, OG images, or middleware/proxy, read the relevant guide in `node_modules/next/dist/docs/01-app/`. Do not rely on training data.

## File structure
- `src/app/` — routes. `src/app/admin/(dashboard)/` is the admin shell.
- `src/app/api/` — route handlers.
- `src/components/admin/` — admin client components (all `'use client'`).
- `src/components/admin/quote-editor/` — QuoteEditor subcomponents. State lives in `QuoteEditor.tsx`; children are controlled via callbacks.
- `src/components/admin/ui/` — shared admin primitives (Modal).
- `src/components/landing/` — public landing page sections.
- `src/components/quote/` — public quote-view components.
- `src/lib/actions.ts` — server actions (writes). Always `'use server'`, always `await requireSession()`, always Zod-parse input.
- `src/lib/queries.ts` — server-only reads. Use `cache()` for slug-keyed reads called multiple times per render.
- `src/lib/validations.ts` — Zod schemas. Form-data types are inferred via `z.infer<typeof schema>`. Do not re-declare them.
- `src/lib/quote-math.ts` — pure helpers for QuoteEditor totals/weights.
- `src/types/admin.ts` — admin-side DB/draft types. Prefer `Prisma.XGetPayload<...>` over hand-written interfaces.
- `src/types/index.ts` — public display types (MenuData, etc.).

## Styling
- Tailwind v4 only; theme in `src/app/globals.css`.
- Shared input classes in `src/lib/ui-classes.ts` — use `INPUT_BASE`, `INLINE_INPUT`, `SMALL_INPUT`, `PANEL_INPUT`, `INPUT_FOCUS_RING`. Do not inline the full `focus:border-royal-500 focus:ring-1 ...` string.

## Modals
- Always use `src/components/admin/ui/Modal.tsx`. Do not hand-roll backdrop/Escape/focus wiring. For nested-Escape (e.g. close inner panel before closing modal) pass `onEscape`/`onBackdropClick` returning `true` to suppress the default close.

## Phone
- `src/lib/phone.ts` exports `DEFAULT_PHONE_RAW`, `formatPhone`, `phoneTelHref`. Never hardcode the phone literal elsewhere.

## Server actions
- `await requireSession()` before any mutation.
- `schema.parse(data)` before any Prisma call.
- `revalidatePath(...)` every touched route after mutation.
- For multi-step writes, wrap in `prisma.$transaction`.

## Preferences
- Prefer plain arrays/objects over Map/Set.
- TypeScript `strict: true` — no `any`, no non-null assertions without a WHY comment.
- Russian locale for `toLocaleString` / `toLocaleDateString`.
<!-- END:project-conventions -->
