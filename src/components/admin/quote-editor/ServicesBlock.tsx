'use client'

import { INLINE_INPUT, SMALL_INPUT } from '@/lib/ui-classes'
import type { QuoteServiceDraft } from '@/types/admin'

interface ServicesBlockProps {
  services: QuoteServiceDraft[]
  persons: number
  servicesSubtotal: number
  collapsed: boolean
  onToggleCollapsed: () => void
  onUpdate: (idx: number, field: string, value: string | number | boolean) => void
  onRemove: (idx: number) => void
  onOpenPicker: () => void
}

export default function ServicesBlock({
  services,
  persons,
  servicesSubtotal,
  collapsed,
  onToggleCollapsed,
  onUpdate,
  onRemove,
  onOpenPicker,
}: ServicesBlockProps) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white shadow-sm overflow-hidden">
      <div className="flex flex-wrap items-center gap-2 border-b border-neutral-100 bg-neutral-50 px-5 py-3">
        <button
          type="button"
          onClick={onToggleCollapsed}
          className="inline-flex h-6 w-6 items-center justify-center rounded text-xs text-neutral-500 hover:bg-neutral-200"
          aria-expanded={!collapsed}
        >
          <span className={`transition-transform ${collapsed ? '' : 'rotate-90'}`}>▶</span>
        </button>
        <h2 className="font-semibold text-neutral-900">Услуги</h2>
        <span className="rounded-full bg-white px-2 py-0.5 text-[11px] font-semibold text-neutral-600 ring-1 ring-neutral-200">
          {services.length}
        </span>
        <span className="text-xs font-semibold text-neutral-700">
          {servicesSubtotal.toLocaleString('ru-RU')} ₽
        </span>
        <div className="ml-auto">
          <button
            onClick={onOpenPicker}
            className="rounded-md bg-royal-500 px-3 py-1 text-xs font-medium text-white hover:bg-royal-600"
          >
            + Услугу
          </button>
        </div>
      </div>

      {!collapsed && (services.length === 0 ? (
        <div className="px-5 py-6 text-center text-sm text-neutral-400">
          Нет услуг. Нажмите «Добавить услугу».
        </div>
      ) : (
        <div className="divide-y divide-neutral-50">
          {services.map((svc, idx) => (
            <div key={idx} className="flex items-center gap-3 px-5 py-3">
              <input
                type="text"
                value={svc.name}
                onChange={(e) => onUpdate(idx, 'name', e.target.value)}
                className={INLINE_INPUT}
              />
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={1}
                  value={svc.quantity}
                  onChange={(e) => onUpdate(idx, 'quantity', parseInt(e.target.value) || 1)}
                  className={`w-14 ${SMALL_INPUT}`}
                />
                <span className="text-xs text-neutral-400">×</span>
                <input
                  type="number"
                  min={0}
                  step="any"
                  value={svc.price}
                  onChange={(e) => onUpdate(idx, 'price', parseFloat(e.target.value) || 0)}
                  className={`w-24 text-right ${SMALL_INPUT}`}
                />
                <label className="flex items-center gap-1 text-xs text-neutral-500">
                  <input
                    type="checkbox"
                    checked={svc.isPerPerson}
                    onChange={(e) => onUpdate(idx, 'isPerPerson', e.target.checked)}
                    className="h-3 w-3 rounded border-neutral-200"
                  />
                  /чел
                </label>
                <span className="w-24 text-right text-xs font-medium text-neutral-700">
                  {(svc.isPerPerson ? svc.price * persons : svc.price * svc.quantity).toLocaleString('ru-RU')} ₽
                </span>
              </div>
              <button
                onClick={() => onRemove(idx)}
                className="rounded p-1 text-xs text-red-400 hover:bg-red-50 hover:text-red-600"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
