'use client'

import { INPUT_BASE } from '@/lib/ui-classes'

export interface QuoteMetaFormValue {
  eventTitle: string
  eventTime: string
  persons: number
  managerName: string
  managerPhone: string
  notes: string
  validUntil: string | null
  slug: string
}

interface QuoteMetaFormProps {
  value: QuoteMetaFormValue
  onChange: (next: QuoteMetaFormValue) => void
  collapsed: boolean
  onToggleCollapsed: () => void
  onSlugBlur: () => void
}

export default function QuoteMetaForm({
  value,
  onChange,
  collapsed,
  onToggleCollapsed,
  onSlugBlur,
}: QuoteMetaFormProps) {
  function patch(part: Partial<QuoteMetaFormValue>) {
    onChange({ ...value, ...part })
  }

  return (
    <div className="rounded-xl border border-neutral-200 bg-white shadow-sm overflow-hidden">
      <button
        type="button"
        onClick={onToggleCollapsed}
        className="flex w-full items-center gap-2 border-b border-neutral-100 bg-neutral-50 px-6 py-3 text-left"
        aria-expanded={!collapsed}
      >
        <span className={`inline-flex h-6 w-6 items-center justify-center text-xs text-neutral-500 transition-transform ${collapsed ? '' : 'rotate-90'}`}>▶</span>
        <h2 className="font-semibold text-neutral-900">Информация о банкете</h2>
        {collapsed && (
          <span className="ml-2 truncate text-xs text-neutral-500">
            {value.eventTitle || 'Без названия'}
            {value.managerName && ` · ${value.managerName}`}
            {` · ${value.persons} чел.`}
          </span>
        )}
      </button>
      {!collapsed && (
        <div className="grid grid-cols-2 gap-4 p-6">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-neutral-700">Название мероприятия</label>
            <input
              type="text"
              required
              value={value.eventTitle}
              onChange={(e) => patch({ eventTitle: e.target.value })}
              onBlur={onSlugBlur}
              placeholder="Банкет на 30 персон"
              className={INPUT_BASE}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700">Время</label>
            <input
              type="text"
              value={value.eventTime}
              onChange={(e) => patch({ eventTime: e.target.value })}
              placeholder="c 11:00 до 22:30"
              className={INPUT_BASE}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700">Количество персон</label>
            <input
              type="number"
              min={1}
              value={value.persons}
              onChange={(e) => patch({ persons: parseInt(e.target.value) || 1 })}
              className={INPUT_BASE}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700">Имя менеджера</label>
            <input
              type="text"
              required
              value={value.managerName}
              onChange={(e) => patch({ managerName: e.target.value })}
              onBlur={onSlugBlur}
              className={INPUT_BASE}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700">Телефон менеджера</label>
            <input
              type="text"
              value={value.managerPhone}
              onChange={(e) => patch({ managerPhone: e.target.value })}
              placeholder="+7..."
              className={INPUT_BASE}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700">Действительно до</label>
            <input
              type="date"
              value={value.validUntil || ''}
              onChange={(e) => patch({ validUntil: e.target.value || null })}
              className={INPUT_BASE}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700">Ссылка (URL)</label>
            <input
              type="text"
              required
              value={value.slug}
              onChange={(e) => patch({ slug: e.target.value })}
              className={`${INPUT_BASE} font-mono`}
            />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-neutral-700">Заметки</label>
            <textarea
              value={value.notes}
              onChange={(e) => patch({ notes: e.target.value })}
              rows={2}
              className={INPUT_BASE}
            />
          </div>
        </div>
      )}
    </div>
  )
}
