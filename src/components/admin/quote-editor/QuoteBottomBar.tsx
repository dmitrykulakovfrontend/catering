'use client'

import { formatWeightMap, perPerson } from '@/lib/quote-math'

interface QuoteBottomBarProps {
  total: number
  menuSubtotal: number
  servicesSubtotal: number
  servicesCount: number
  persons: number
  totalWeight: Record<string, number>
  isDirty: boolean
  saving: boolean
  previewSlug?: string
  onReset: () => void
  onSave: () => void
}

export default function QuoteBottomBar({
  total,
  menuSubtotal,
  servicesSubtotal,
  servicesCount,
  persons,
  totalWeight,
  isDirty,
  saving,
  previewSlug,
  onReset,
  onSave,
}: QuoteBottomBarProps) {
  return (
    <div className="sticky bottom-0 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-neutral-200 bg-white px-6 py-4 shadow-lg">
      <div className="flex flex-wrap items-baseline gap-x-5 gap-y-1 text-sm">
        <div>
          <span className="text-neutral-500">Итого: </span>
          <span className="text-lg font-bold text-royal-500">
            {total.toLocaleString('ru-RU')} ₽
          </span>
        </div>
        {persons > 0 && (
          <div className="text-xs text-neutral-500">
            ≈ <span className="font-semibold text-neutral-700">{Math.round(total / persons).toLocaleString('ru-RU')} ₽</span> / чел.
          </div>
        )}
        <div className="text-xs text-neutral-500">
          Меню: <span className="font-semibold text-neutral-700">{menuSubtotal.toLocaleString('ru-RU')} ₽</span>
          {servicesCount > 0 && (
            <>
              {' · '}Услуги: <span className="font-semibold text-neutral-700">{servicesSubtotal.toLocaleString('ru-RU')} ₽</span>
            </>
          )}
        </div>
        {Object.keys(totalWeight).length > 0 && (
          <div className="text-xs text-neutral-500">
            Выход: <span className="font-semibold text-neutral-700">{formatWeightMap(totalWeight)}</span>
            {persons > 0 && (
              <>
                {' · ≈ '}
                <span className="font-semibold text-neutral-700">{formatWeightMap(perPerson(totalWeight, persons))}</span> / чел.
              </>
            )}
          </div>
        )}
      </div>
      <div className="flex items-center gap-3">
        {isDirty && (
          <span
            className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-700 ring-1 ring-amber-200"
            title="Есть несохранённые изменения"
          >
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-500" />
            Не сохранено
          </span>
        )}
        {isDirty && (
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-3.5 py-2 text-sm font-medium text-neutral-600 shadow-sm transition hover:border-red-300 hover:text-red-600"
            title="Отменить несохранённые изменения"
          >
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden>
              <path d="M2 6.5a4.5 4.5 0 1 0 1.3-3.2M2 2v3h3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Отменить
          </button>
        )}
        {previewSlug && (
          <a
            href={`/quote/${previewSlug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-700 shadow-sm transition hover:border-royal-300 hover:text-royal-700"
            title="Открыть предпросмотр в новой вкладке"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
              <path d="M8 2h4v4M11.5 2.5L6 8M6 3H3a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h7a1 1 0 0 0 1-1V8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Предпросмотр
          </a>
        )}
        <button
          onClick={onSave}
          disabled={saving}
          className="rounded-lg bg-royal-500 px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-royal-600 disabled:opacity-60"
        >
          {saving ? 'Сохранение...' : 'Сохранить'}
        </button>
      </div>
    </div>
  )
}
