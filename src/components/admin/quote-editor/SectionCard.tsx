'use client'

import { INPUT_FOCUS_RING } from '@/lib/ui-classes'
import { pluralItems, formatWeightMap, perPerson } from '@/lib/quote-math'
import SectionItemRow from './SectionItemRow'
import type { QuoteSectionDraft } from '@/types/admin'

interface SectionCardProps {
  section: QuoteSectionDraft
  index: number
  isFirst: boolean
  isLast: boolean
  collapsed: boolean
  subtotal: number
  weights: Record<string, number>
  persons: number
  onToggleCollapsed: () => void
  onUpdateTitle: (title: string) => void
  onRemove: () => void
  onMove: (dir: -1 | 1) => void
  onOpenDishPicker: () => void
  onUpdateItem: (itemIdx: number, field: string, value: string | number) => void
  onRemoveItem: (itemIdx: number) => void
  onMoveItem: (itemIdx: number, dir: -1 | 1) => void
}

export default function SectionCard({
  section,
  isFirst,
  isLast,
  collapsed,
  subtotal,
  weights,
  persons,
  onToggleCollapsed,
  onUpdateTitle,
  onRemove,
  onMove,
  onOpenDishPicker,
  onUpdateItem,
  onRemoveItem,
  onMoveItem,
}: SectionCardProps) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white shadow-sm overflow-hidden">
      <div className="flex flex-wrap items-center gap-2 border-b border-neutral-100 bg-neutral-50 px-5 py-3">
        <button
          type="button"
          onClick={onToggleCollapsed}
          className="inline-flex h-6 w-6 items-center justify-center rounded text-xs text-neutral-500 hover:bg-neutral-200"
          aria-expanded={!collapsed}
          title={collapsed ? 'Развернуть' : 'Свернуть'}
        >
          <span className={`transition-transform ${collapsed ? '' : 'rotate-90'}`}>▶</span>
        </button>
        <div className="flex gap-1">
          <button onClick={() => onMove(-1)} disabled={isFirst} className="rounded px-1 text-neutral-400 hover:text-neutral-600 disabled:opacity-30">↑</button>
          <button onClick={() => onMove(1)} disabled={isLast} className="rounded px-1 text-neutral-400 hover:text-neutral-600 disabled:opacity-30">↓</button>
        </div>
        <input
          type="text"
          value={section.title}
          onChange={(e) => onUpdateTitle(e.target.value)}
          placeholder="Название раздела"
          className={`flex-1 min-w-32 rounded-md border border-neutral-200 bg-white px-2 py-1 text-sm font-medium ${INPUT_FOCUS_RING}`}
        />
        <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
          section.type === 'welcome' ? 'bg-amber-50 text-amber-700 ring-1 ring-amber-200' : 'bg-royal-50 text-royal-700 ring-1 ring-royal-200'
        }`}>
          {section.type === 'welcome' ? 'welcome' : 'банкет'}
        </span>
        <span className="rounded-full bg-white px-2 py-0.5 text-[11px] font-semibold text-neutral-600 ring-1 ring-neutral-200">
          {section.items.length} {pluralItems(section.items.length)}
        </span>
        {Object.keys(weights).length > 0 && (
          <span className="rounded-full bg-white px-2 py-0.5 text-[11px] font-medium text-neutral-500 ring-1 ring-neutral-200">
            {formatWeightMap(weights)}
            {persons > 0 && (
              <span className="text-neutral-400">
                {' '}· {formatWeightMap(perPerson(weights, persons))}/чел
              </span>
            )}
          </span>
        )}
        <span className="text-xs font-semibold text-neutral-700">
          {subtotal.toLocaleString('ru-RU')} ₽
        </span>
        <button
          onClick={onOpenDishPicker}
          className="rounded-md bg-royal-500 px-3 py-1 text-xs font-medium text-white hover:bg-royal-600"
        >
          + Блюдо
        </button>
        <button
          onClick={onRemove}
          className="rounded-md px-2 py-1 text-xs text-red-500 hover:bg-red-50"
        >
          Удалить
        </button>
      </div>

      {!collapsed && (section.items.length === 0 ? (
        <div className="px-5 py-6 text-center text-sm text-neutral-400">
          Нет блюд. Нажмите «Добавить блюдо».
        </div>
      ) : (
        <div className="divide-y divide-neutral-50">
          {section.items.map((item, iIdx) => (
            <SectionItemRow
              key={iIdx}
              item={item}
              isFirst={iIdx === 0}
              isLast={iIdx === section.items.length - 1}
              onUpdate={(field, value) => onUpdateItem(iIdx, field, value)}
              onRemove={() => onRemoveItem(iIdx)}
              onMove={(dir) => onMoveItem(iIdx, dir)}
            />
          ))}
        </div>
      ))}
    </div>
  )
}
