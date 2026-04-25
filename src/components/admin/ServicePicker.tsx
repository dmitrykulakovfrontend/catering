'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { createServiceTemplate } from '@/lib/actions'
import type { ServiceTemplateRow } from '@/types/admin'
import { PANEL_INPUT } from '@/lib/ui-classes'
import Modal from './ui/Modal'

interface ServicePickerProps {
  services: ServiceTemplateRow[]
  onSelect: (service: ServiceTemplateRow) => void
  onClose: () => void
}

export default function ServicePicker({ services, onSelect, onClose }: ServicePickerProps) {
  const router = useRouter()
  const [localServices, setLocalServices] = useState<ServiceTemplateRow[]>(services)
  const [search, setSearch] = useState('')
  const [creating, setCreating] = useState(false)
  const [saving, setSaving] = useState(false)
  const [draft, setDraft] = useState({ name: '', defaultPrice: 0, isPerPerson: false })

  const nameRef = useRef<HTMLInputElement>(null)

  // Mirror props into local state so we can optimistically insert new
  // services before the server revalidates. When the server data arrives,
  // its ids are a superset of ours — safe to replace.
  useEffect(() => {
    setLocalServices(services)
  }, [services])

  useEffect(() => {
    if (creating) nameRef.current?.focus()
  }, [creating])

  const q = search.toLowerCase().trim()
  const filtered = q
    ? localServices.filter((s) => s.name.toLowerCase().includes(q))
    : localServices

  async function submitService(e: React.FormEvent) {
    e.preventDefault()
    if (!draft.name.trim()) {
      toast.error('Укажите название')
      return
    }
    setSaving(true)
    try {
      const created = await createServiceTemplate({
        name: draft.name.trim(),
        defaultPrice: draft.defaultPrice,
        isPerPerson: draft.isPerPerson,
        order: localServices.length,
      })
      setLocalServices((s) => [...s, created])
      toast.success('Услуга создана')
      router.refresh()
      onSelect(created)
      onClose()
    } catch {
      toast.error('Ошибка создания услуги')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal
      open
      onClose={onClose}
      backdropClassName="fixed inset-0 bg-neutral-950/50 backdrop-blur-sm"
      panelClassName="relative z-10 flex max-h-[85vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white shadow-[0_30px_80px_-20px_rgba(15,31,102,0.35)] ring-1 ring-neutral-200/60"
      onEscape={() => {
        if (creating) { setCreating(false); return true }
        return false
      }}
      onBackdropClick={() => {
        if (creating) { setCreating(false); return true }
        return false
      }}
    >
        {/* Header */}
        <div className="border-b border-neutral-100 bg-linear-to-b from-cream to-white px-6 pt-5 pb-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[10px] font-semibold tracking-[0.18em] text-royal-500 uppercase">
                Шаблоны
              </p>
              <h3 className="mt-0.5 text-xl font-semibold tracking-tight text-neutral-900">
                Выберите услугу
              </h3>
              <p className="mt-0.5 text-xs text-neutral-500">
                {localServices.length} {pluralServices(localServices.length)}
              </p>
            </div>
            <button
              onClick={onClose}
              className="rounded-md p-1.5 text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-700"
              aria-label="Закрыть"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          <div className="mt-4 flex gap-2">
            <div className="relative flex-1">
              <svg
                className="absolute top-1/2 left-3 -translate-y-1/2 text-neutral-400"
                width="14" height="14" viewBox="0 0 14 14" fill="none"
              >
                <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.3" />
                <path d="M9.5 9.5L12 12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
              </svg>
              <input
                autoFocus
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Поиск..."
                className={`${PANEL_INPUT} pl-9`}
              />
            </div>
            <button
              onClick={() => setCreating(true)}
              className="group flex items-center gap-1.5 rounded-lg bg-royal-500 px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-royal-600"
            >
              <span className="text-base leading-none transition-transform group-hover:rotate-90">+</span>
              Новая услуга
            </button>
          </div>
        </div>

        {/* Inline create */}
        {creating && (
          <form
            onSubmit={submitService}
            className="relative shrink-0 border-b border-royal-100 bg-royal-50/40 px-6 py-4 animate-in"
          >
            <div className="absolute top-0 bottom-0 left-0 w-0.5 bg-royal-500" />
            <div className="flex items-center justify-between">
              <label className="block text-[11px] font-semibold tracking-wide text-royal-700 uppercase">
                Новая услуга
              </label>
              <button
                type="button"
                onClick={() => setCreating(false)}
                className="text-[11px] font-medium text-neutral-500 hover:text-neutral-800"
              >
                Отмена
              </button>
            </div>

            <div className="mt-2.5 space-y-2.5">
              <input
                ref={nameRef}
                type="text"
                required
                value={draft.name}
                onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                placeholder="Название (например, Обслуживание официантом)"
                className={PANEL_INPUT}
              />
              <div className="grid grid-cols-5 gap-2.5">
                <div className="col-span-3 relative">
                  <input
                    type="number"
                    required
                    min={0}
                    step="any"
                    value={draft.defaultPrice || ''}
                    onChange={(e) => setDraft({ ...draft, defaultPrice: parseFloat(e.target.value) || 0 })}
                    placeholder="Цена"
                    className={`${PANEL_INPUT} pr-7`}
                  />
                  <span className="absolute top-1/2 right-3 -translate-y-1/2 text-xs text-neutral-400">₽</span>
                </div>
                <label
                  className={`col-span-2 flex cursor-pointer items-center justify-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium transition ${
                    draft.isPerPerson
                      ? 'border-royal-500 bg-royal-50 text-royal-700'
                      : 'border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={draft.isPerPerson}
                    onChange={(e) => setDraft({ ...draft, isPerPerson: e.target.checked })}
                    className="sr-only"
                  />
                  <span
                    className={`flex h-3.5 w-3.5 items-center justify-center rounded-sm border ${
                      draft.isPerPerson ? 'border-royal-500 bg-royal-500' : 'border-neutral-300 bg-white'
                    }`}
                  >
                    {draft.isPerPerson && (
                      <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                        <path d="M1.5 4.5L3.5 6.5L7.5 2.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </span>
                  Цена за персону
                </label>
              </div>
            </div>

            <div className="mt-3 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-royal-500 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-royal-600 disabled:opacity-50"
              >
                {saving ? 'Создание...' : 'Создать и выбрать'}
              </button>
            </div>
          </form>
        )}

        {/* List */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-14 text-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100 text-neutral-400">
                <span className="text-xl">✦</span>
              </div>
              <p className="text-sm text-neutral-500">
                {localServices.length === 0 ? 'Нет шаблонов услуг' : 'Ничего не найдено'}
              </p>
              {!creating && (
                <button
                  onClick={() => setCreating(true)}
                  className="mt-3 rounded-lg border border-royal-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-royal-600 transition hover:border-royal-400 hover:bg-royal-50"
                >
                  + Создать услугу
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-1">
              {filtered.map((svc) => (
                <button
                  key={svc.id}
                  onClick={() => { onSelect(svc); onClose() }}
                  className="group flex w-full items-center justify-between rounded-lg border border-transparent px-3 py-3 text-left transition hover:border-royal-200 hover:bg-royal-50/60"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-neutral-900">{svc.name}</p>
                    {svc.isPerPerson && (
                      <p className="mt-0.5 inline-flex items-center gap-1 text-[10px] font-semibold tracking-wide text-royal-500 uppercase">
                        <span className="h-1 w-1 rounded-full bg-royal-500" />
                        За персону
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-neutral-800">
                      {svc.defaultPrice.toLocaleString('ru-RU')} ₽
                    </span>
                    <span className="text-xs font-medium text-neutral-300 opacity-0 transition group-hover:translate-x-0 group-hover:opacity-100 -translate-x-1">
                      →
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-neutral-100 bg-neutral-50/60 px-6 py-3">
          <span className="text-[11px] text-neutral-500">
            <kbd className="rounded border border-neutral-200 bg-white px-1 font-mono text-[10px]">Esc</kbd>{' '}
            закрыть
          </span>
          <button
            onClick={onClose}
            className="rounded-lg border border-neutral-200 bg-white px-3.5 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-50"
          >
            Закрыть
          </button>
        </div>

      <style jsx>{`
        .animate-in {
          animation: slideDown 180ms cubic-bezier(0.22, 0.61, 0.36, 1);
        }
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </Modal>
  )
}

function pluralServices(n: number) {
  const m10 = n % 10
  const m100 = n % 100
  if (m10 === 1 && m100 !== 11) return 'услуга'
  if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return 'услуги'
  return 'услуг'
}
