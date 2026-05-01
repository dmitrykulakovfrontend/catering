'use client'

import SectionCard from './SectionCard'
import type { QuoteSectionDraft } from '@/types/admin'

interface SectionListProps {
  sections: QuoteSectionDraft[]
  persons: number
  sectionSubtotals: number[]
  sectionWeights: Record<string, number>[]
  collapsedIdx: number[]
  allCollapsed: boolean
  errors: Record<string, string>
  onToggleSection: (idx: number) => void
  onCollapseAll: () => void
  onExpandAll: () => void
  onAddSection: (type: 'banquet' | 'welcome') => void
  onUpdateTitle: (idx: number, title: string) => void
  onRemoveSection: (idx: number) => void
  onMoveSection: (idx: number, dir: -1 | 1) => void
  onOpenDishPicker: (sectionIdx: number) => void
  onUpdateItem: (sIdx: number, iIdx: number, field: string, value: string | number) => void
  onRemoveItem: (sIdx: number, iIdx: number) => void
  onMoveItem: (sIdx: number, iIdx: number, dir: -1 | 1) => void
}

export default function SectionList({
  sections,
  persons,
  sectionSubtotals,
  sectionWeights,
  collapsedIdx,
  allCollapsed,
  errors,
  onToggleSection,
  onCollapseAll,
  onExpandAll,
  onAddSection,
  onUpdateTitle,
  onRemoveSection,
  onMoveSection,
  onOpenDishPicker,
  onUpdateItem,
  onRemoveItem,
  onMoveItem,
}: SectionListProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <h2 className="font-semibold text-neutral-900">Разделы меню</h2>
          {sections.length > 0 && (
            <button
              type="button"
              onClick={allCollapsed ? onExpandAll : onCollapseAll}
              className="rounded-md border border-neutral-200 bg-white px-2.5 py-1 text-[11px] font-medium text-neutral-600 hover:border-royal-300 hover:text-royal-700"
            >
              {allCollapsed ? 'Развернуть всё' : 'Свернуть всё'}
            </button>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onAddSection('banquet')}
            className="rounded-lg border border-neutral-200 px-3 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-50"
          >
            Добавить раздел банкета
          </button>
          <button
            onClick={() => onAddSection('welcome')}
            className="rounded-lg border border-neutral-200 px-3 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-50"
          >
            Добавить раздел Welcome
          </button>
        </div>
      </div>

      {sections.length === 0 && (
        <div className="rounded-xl border border-dashed border-neutral-200 bg-white py-12 text-center">
          <p className="text-sm text-neutral-400">Добавьте первый раздел</p>
        </div>
      )}

      {sections.map((section, sIdx) => (
        <SectionCard
          key={sIdx}
          section={section}
          index={sIdx}
          isFirst={sIdx === 0}
          isLast={sIdx === sections.length - 1}
          collapsed={collapsedIdx.includes(sIdx)}
          subtotal={sectionSubtotals[sIdx]}
          weights={sectionWeights[sIdx]}
          persons={persons}
          errors={errors}
          onToggleCollapsed={() => onToggleSection(sIdx)}
          onUpdateTitle={(t) => onUpdateTitle(sIdx, t)}
          onRemove={() => onRemoveSection(sIdx)}
          onMove={(dir) => onMoveSection(sIdx, dir)}
          onOpenDishPicker={() => onOpenDishPicker(sIdx)}
          onUpdateItem={(iIdx, field, value) => onUpdateItem(sIdx, iIdx, field, value)}
          onRemoveItem={(iIdx) => onRemoveItem(sIdx, iIdx)}
          onMoveItem={(iIdx, dir) => onMoveItem(sIdx, iIdx, dir)}
        />
      ))}
    </div>
  )
}
