// Shared Tailwind class strings for admin forms/inputs.
// Two focus styles intentionally diverge: INPUT_* (ring-1, /20) vs PANEL_INPUT (ring-2, /15).

export const INPUT_FOCUS_RING =
  'focus:border-royal-500 focus:ring-1 focus:ring-royal-500/20 focus:outline-none'

export const INPUT_BASE =
  `mt-1 block w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm shadow-sm ${INPUT_FOCUS_RING}`

export const INLINE_INPUT =
  `flex-1 min-w-0 rounded border border-transparent px-2 py-1 text-sm hover:border-neutral-200 ${INPUT_FOCUS_RING}`

export const SMALL_INPUT =
  `rounded-md border border-neutral-200 bg-white px-2 py-1 text-center text-xs tabular-nums transition hover:border-neutral-300 ${INPUT_FOCUS_RING} [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`

export const PANEL_INPUT =
  'w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm shadow-sm transition focus:border-royal-500 focus:ring-2 focus:ring-royal-500/15 focus:outline-none'

// ─── Error variants ─────────────────────────────────────────
// Used when a field fails client-side validation. Each one is a complete
// string (not a delta on the base) to avoid Tailwind class-ordering issues
// between border-red-* and border-neutral-* / focus:border-royal-*.

export const INPUT_ERROR_FOCUS_RING =
  'focus:border-red-500 focus:ring-1 focus:ring-red-500/30 focus:outline-none'

export const INPUT_BASE_ERROR =
  `mt-1 block w-full rounded-lg border border-red-400 bg-red-50/40 px-3 py-2 text-sm shadow-sm ${INPUT_ERROR_FOCUS_RING}`

export const INLINE_INPUT_ERROR =
  `flex-1 min-w-0 rounded border border-red-400 bg-red-50/40 px-2 py-1 text-sm hover:border-red-500 ${INPUT_ERROR_FOCUS_RING}`

export const SMALL_INPUT_ERROR =
  `rounded-md border border-red-400 bg-red-50/40 px-2 py-1 text-center text-xs tabular-nums transition hover:border-red-500 ${INPUT_ERROR_FOCUS_RING} [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`
