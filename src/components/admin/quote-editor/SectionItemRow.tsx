'use client'

import Image from 'next/image'
import { INLINE_INPUT, SMALL_INPUT } from '@/lib/ui-classes'
import type { QuoteItemDraft } from '@/types/admin'

interface SectionItemRowProps {
  item: QuoteItemDraft
  isFirst: boolean
  isLast: boolean
  onUpdate: (field: string, value: string | number) => void
  onRemove: () => void
  onMove: (dir: -1 | 1) => void
}

export default function SectionItemRow({
  item,
  isFirst,
  isLast,
  onUpdate,
  onRemove,
  onMove,
}: SectionItemRowProps) {
  return (
    <div className="flex items-center gap-3 px-5 py-3">
      <div className="flex flex-col gap-0.5">
        <button onClick={() => onMove(-1)} disabled={isFirst} className="text-[10px] text-neutral-400 hover:text-neutral-600 disabled:opacity-30">▲</button>
        <button onClick={() => onMove(1)} disabled={isLast} className="text-[10px] text-neutral-400 hover:text-neutral-600 disabled:opacity-30">▼</button>
      </div>
      {item.image ? (
        <div className="relative h-8 w-8 shrink-0">
          <Image src={item.image} alt="" fill sizes="32px" className="rounded object-cover" />
        </div>
      ) : (
        <div className="flex h-8 w-8 items-center justify-center rounded bg-neutral-100 text-[10px] text-neutral-400">◇</div>
      )}
      <input
        type="text"
        value={item.name}
        onChange={(e) => onUpdate('name', e.target.value)}
        className={INLINE_INPUT}
      />
      <div className="flex items-center gap-1">
        <div
          className="flex items-center overflow-hidden rounded-md border border-neutral-200 bg-white transition focus-within:border-royal-500 focus-within:ring-1 focus-within:ring-royal-500/20 hover:border-neutral-300"
          title="Вес за порцию"
        >
          <input
            type="number"
            min={0}
            step="any"
            value={item.weight}
            onChange={(e) => onUpdate('weight', parseFloat(e.target.value) || 0)}
            className="w-12 bg-transparent px-1.5 py-1 text-right text-xs tabular-nums focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
          <select
            value={item.weightUnit || 'г'}
            onChange={(e) => onUpdate('weightUnit', e.target.value)}
            className="cursor-pointer appearance-none border-l border-neutral-200 bg-neutral-50 py-1 pr-1 pl-1.5 text-[11px] font-medium text-neutral-500 focus:bg-white focus:outline-none"
          >
            <option value="г">г</option>
            <option value="мл">мл</option>
            <option value="шт">шт</option>
            <option value="кг">кг</option>
          </select>
        </div>
        <input
          type="number"
          min={1}
          value={item.quantity}
          onChange={(e) => onUpdate('quantity', parseInt(e.target.value) || 1)}
          className={`w-14 ${SMALL_INPUT}`}
          title="Кол-во"
        />
        <span className="text-xs text-neutral-400">×</span>
        <input
          type="number"
          min={0}
          step="any"
          value={item.pricePerUnit}
          onChange={(e) => onUpdate('pricePerUnit', parseFloat(e.target.value) || 0)}
          className={`w-20 text-right ${SMALL_INPUT}`}
          title="Цена за ед."
        />
        <span className="w-20 text-right text-xs font-medium text-neutral-700">
          {(item.quantity * item.pricePerUnit).toLocaleString('ru-RU')} ₽
        </span>
      </div>
      <button
        onClick={onRemove}
        className="rounded p-1 text-xs text-red-400 hover:bg-red-50 hover:text-red-600"
      >
        ✕
      </button>
    </div>
  )
}
