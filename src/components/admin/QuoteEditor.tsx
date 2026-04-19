'use client'

import Image from 'next/image'
import { useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { saveQuote } from '@/lib/actions'
import { generateSlug } from '@/lib/utils'
import DishPicker from './DishPicker'
import ServicePicker from './ServicePicker'
import type { QuoteFormData } from '@/lib/validations'

interface CatalogDish {
  id: string
  name: string
  description: string
  weight: number
  weightUnit: string
  defaultPrice: number
  image: string
  categoryId: string
}

interface CatalogCategory {
  id: string
  name: string
  dishes: CatalogDish[]
}

interface CatalogService {
  id: string
  name: string
  defaultPrice: number
  isPerPerson: boolean
}

interface QuoteItem {
  dishId: string | null
  name: string
  description: string
  weight: number
  weightUnit: string
  quantity: number
  pricePerUnit: number
  image: string
  order: number
}

interface QuoteSection {
  id?: string
  title: string
  type: 'banquet' | 'welcome'
  order: number
  items: QuoteItem[]
}

interface QuoteService {
  serviceTemplateId: string | null
  name: string
  price: number
  quantity: number
  isPerPerson: boolean
  order: number
}

interface QuoteEditorProps {
  quoteId?: string
  initial?: {
    eventTitle: string
    eventTime: string
    persons: number
    managerName: string
    managerPhone: string
    notes: string
    validUntil: string | null
    slug: string
    sections: QuoteSection[]
    services: QuoteService[]
  }
  categories: CatalogCategory[]
  serviceTemplates: CatalogService[]
}

export default function QuoteEditor({
  quoteId,
  initial,
  categories,
  serviceTemplates,
}: QuoteEditorProps) {
  const router = useRouter()

  const initialSnapshot = useRef({
    form: {
      eventTitle: initial?.eventTitle || '',
      eventTime: initial?.eventTime || '',
      persons: initial?.persons || 30,
      managerName: initial?.managerName || '',
      managerPhone: initial?.managerPhone || '',
      notes: initial?.notes || '',
      validUntil: initial?.validUntil || null,
      slug: initial?.slug || '',
    },
    sections: initial?.sections || [],
    services: initial?.services || [],
  })

  const [form, setForm] = useState(initialSnapshot.current.form)
  const [sections, setSections] = useState<QuoteSection[]>(initialSnapshot.current.sections)
  const [services, setServices] = useState<QuoteService[]>(initialSnapshot.current.services)

  const [dishPickerSection, setDishPickerSection] = useState<number | null>(null)
  const [showServicePicker, setShowServicePicker] = useState(false)
  const [saving, setSaving] = useState(false)
  const [collapsedSections, setCollapsedSections] = useState<number[]>([])
  const [collapsedMeta, setCollapsedMeta] = useState(!!quoteId)
  const [collapsedServices, setCollapsedServices] = useState(false)

  function isSectionCollapsed(idx: number) {
    return collapsedSections.includes(idx)
  }

  function toggleSection(idx: number) {
    setCollapsedSections((prev) => (prev.includes(idx) ? prev.filter((x) => x !== idx) : [...prev, idx]))
  }

  function collapseAllSections() {
    setCollapsedSections(sections.map((_, i) => i))
  }

  function expandAllSections() {
    setCollapsedSections([])
  }

  const sectionSubtotals = useMemo(
    () => sections.map((s) => s.items.reduce((sum, it) => sum + it.pricePerUnit * it.quantity, 0)),
    [sections],
  )
  const sectionWeights = useMemo(
    () => sections.map((s) => aggregateWeights(s.items)),
    [sections],
  )
  const totalWeight = useMemo(() => {
    const acc: Record<string, number> = {}
    for (const w of sectionWeights) {
      for (const [k, v] of Object.entries(w)) acc[k] = (acc[k] || 0) + v
    }
    return acc
  }, [sectionWeights])
  const servicesSubtotal = services.reduce(
    (sum, svc) => sum + (svc.isPerPerson ? svc.price * form.persons : svc.price * svc.quantity),
    0,
  )
  const allSectionsCollapsed = sections.length > 0 && collapsedSections.length === sections.length

  const isDirty = useMemo(() => {
    const cur = JSON.stringify({ form, sections, services })
    const snap = JSON.stringify(initialSnapshot.current)
    return cur !== snap
  }, [form, sections, services])

  function handleReset() {
    if (!isDirty) return
    if (!confirm('Отменить несохранённые изменения?')) return
    setForm(initialSnapshot.current.form)
    setSections(JSON.parse(JSON.stringify(initialSnapshot.current.sections)))
    setServices(JSON.parse(JSON.stringify(initialSnapshot.current.services)))
    toast.success('Изменения отменены')
  }

  // Auto-generate slug when title/name changes (only for new quotes)
  function updateSlug() {
    if (!quoteId && form.eventTitle && form.managerName) {
      setForm((f) => ({ ...f, slug: generateSlug(f.eventTitle, f.managerName) }))
    }
  }

  // ─── Section management ────────────────────────────────────

  function addSection(type: 'banquet' | 'welcome') {
    setSections([
      ...sections,
      {
        title: type === 'welcome' ? 'Welcome зона' : '',
        type,
        order: sections.length,
        items: [],
      },
    ])
  }

  function updateSectionTitle(idx: number, title: string) {
    const updated = [...sections]
    updated[idx] = { ...updated[idx], title }
    setSections(updated)
  }

  function removeSection(idx: number) {
    setSections(sections.filter((_, i) => i !== idx))
  }

  function moveSection(idx: number, dir: -1 | 1) {
    const newIdx = idx + dir
    if (newIdx < 0 || newIdx >= sections.length) return
    const updated = [...sections]
    ;[updated[idx], updated[newIdx]] = [updated[newIdx], updated[idx]]
    setSections(updated)
  }

  // ─── Item management ───────────────────────────────────────

  function addDishToSection(sectionIdx: number, dish: CatalogDish) {
    const updated = [...sections]
    updated[sectionIdx] = {
      ...updated[sectionIdx],
      items: [
        ...updated[sectionIdx].items,
        {
          dishId: dish.id,
          name: dish.name,
          description: dish.description,
          weight: dish.weight,
          weightUnit: dish.weightUnit,
          quantity: 1,
          pricePerUnit: dish.defaultPrice,
          image: dish.image,
          order: updated[sectionIdx].items.length,
        },
      ],
    }
    setSections(updated)
  }

  function updateItem(sectionIdx: number, itemIdx: number, field: string, value: string | number) {
    const updated = [...sections]
    const items = [...updated[sectionIdx].items]
    items[itemIdx] = { ...items[itemIdx], [field]: value }
    updated[sectionIdx] = { ...updated[sectionIdx], items }
    setSections(updated)
  }

  function removeItem(sectionIdx: number, itemIdx: number) {
    const updated = [...sections]
    updated[sectionIdx] = {
      ...updated[sectionIdx],
      items: updated[sectionIdx].items.filter((_, i) => i !== itemIdx),
    }
    setSections(updated)
  }

  function moveItem(sectionIdx: number, itemIdx: number, dir: -1 | 1) {
    const newIdx = itemIdx + dir
    const items = sections[sectionIdx].items
    if (newIdx < 0 || newIdx >= items.length) return
    const updated = [...sections]
    const newItems = [...items]
    ;[newItems[itemIdx], newItems[newIdx]] = [newItems[newIdx], newItems[itemIdx]]
    updated[sectionIdx] = { ...updated[sectionIdx], items: newItems }
    setSections(updated)
  }

  // ─── Service management ────────────────────────────────────

  function addService(template: CatalogService) {
    setServices([
      ...services,
      {
        serviceTemplateId: template.id,
        name: template.name,
        price: template.defaultPrice,
        quantity: 1,
        isPerPerson: template.isPerPerson,
        order: services.length,
      },
    ])
  }

  function updateService(idx: number, field: string, value: string | number | boolean) {
    const updated = [...services]
    updated[idx] = { ...updated[idx], [field]: value }
    setServices(updated)
  }

  function removeService(idx: number) {
    setServices(services.filter((_, i) => i !== idx))
  }

  // ─── Cost preview ──────────────────────────────────────────

  function calculateTotal(): number {
    let total = 0
    for (const section of sections) {
      for (const item of section.items) {
        total += item.pricePerUnit * item.quantity
      }
    }
    for (const svc of services) {
      total += svc.isPerPerson ? svc.price * form.persons : svc.price * svc.quantity
    }
    return total
  }

  // ─── Save ──────────────────────────────────────────────────

  async function handleSave() {
    if (!form.eventTitle || !form.managerName || !form.slug) {
      toast.error('Заполните обязательные поля')
      return
    }
    setSaving(true)
    try {
      const data: QuoteFormData = {
        ...form,
        sections: sections.map((s, si) => ({
          ...s,
          id: s.id,
          type: s.type as 'banquet' | 'welcome',
          order: si,
          items: s.items.map((item, ii) => ({
            ...item,
            order: ii,
          })),
        })),
        services: services.map((svc, i) => ({
          ...svc,
          order: i,
        })),
      }

      const quote = await saveQuote(data, quoteId)
      initialSnapshot.current = {
        form: { ...form },
        sections: JSON.parse(JSON.stringify(sections)),
        services: JSON.parse(JSON.stringify(services)),
      }
      toast.success('Банкет сохранён')

      if (!quoteId) {
        router.push(`/admin/quotes/${quote.id}/edit`)
      }
      router.refresh()
    } catch (err) {
      toast.error('Ошибка сохранения: ' + (err instanceof Error ? err.message : 'Неизвестная ошибка'))
    } finally {
      setSaving(false)
    }
  }

  const inputClass = "mt-1 block w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm shadow-sm focus:border-royal-500 focus:ring-1 focus:ring-royal-500/20 focus:outline-none"
  const inlineInputClass = "flex-1 min-w-0 rounded border border-transparent px-2 py-1 text-sm hover:border-neutral-200 focus:border-royal-500 focus:ring-1 focus:ring-royal-500/20 focus:outline-none"
  const smallInputClass = "rounded-md border border-neutral-200 bg-white px-2 py-1 text-center text-xs tabular-nums transition hover:border-neutral-300 focus:border-royal-500 focus:ring-1 focus:ring-royal-500/20 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"

  return (
    <div className="space-y-8">
      {/* ─── Header fields ──────────────────────────── */}
      <div className="rounded-xl border border-neutral-200 bg-white shadow-sm overflow-hidden">
        <button
          type="button"
          onClick={() => setCollapsedMeta((v) => !v)}
          className="flex w-full items-center gap-2 border-b border-neutral-100 bg-neutral-50 px-6 py-3 text-left"
          aria-expanded={!collapsedMeta}
        >
          <span className={`inline-flex h-6 w-6 items-center justify-center text-xs text-neutral-500 transition-transform ${collapsedMeta ? '' : 'rotate-90'}`}>▶</span>
          <h2 className="font-semibold text-neutral-900">Информация о банкете</h2>
          {collapsedMeta && (
            <span className="ml-2 truncate text-xs text-neutral-500">
              {form.eventTitle || 'Без названия'}
              {form.managerName && ` · ${form.managerName}`}
              {` · ${form.persons} чел.`}
            </span>
          )}
        </button>
        {!collapsedMeta && (
        <div className="grid grid-cols-2 gap-4 p-6">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-neutral-700">Название мероприятия</label>
            <input
              type="text"
              required
              value={form.eventTitle}
              onChange={(e) => setForm({ ...form, eventTitle: e.target.value })}
              onBlur={updateSlug}
              placeholder="Банкет на 30 персон"
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700">Время</label>
            <input
              type="text"
              value={form.eventTime}
              onChange={(e) => setForm({ ...form, eventTime: e.target.value })}
              placeholder="c 11:00 до 22:30"
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700">Количество персон</label>
            <input
              type="number"
              min={1}
              value={form.persons}
              onChange={(e) => setForm({ ...form, persons: parseInt(e.target.value) || 1 })}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700">Имя менеджера</label>
            <input
              type="text"
              required
              value={form.managerName}
              onChange={(e) => setForm({ ...form, managerName: e.target.value })}
              onBlur={updateSlug}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700">Телефон менеджера</label>
            <input
              type="text"
              value={form.managerPhone}
              onChange={(e) => setForm({ ...form, managerPhone: e.target.value })}
              placeholder="+7..."
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700">Действительно до</label>
            <input
              type="date"
              value={form.validUntil || ''}
              onChange={(e) => setForm({ ...form, validUntil: e.target.value || null })}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700">Ссылка (URL)</label>
            <input
              type="text"
              required
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
              className={`${inputClass} font-mono`}
            />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-neutral-700">Заметки</label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              rows={2}
              className={inputClass}
            />
          </div>
        </div>
        )}
      </div>

      {/* ─── Sections ──────────────────────────────── */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <h2 className="font-semibold text-neutral-900">Разделы меню</h2>
            {sections.length > 0 && (
              <button
                type="button"
                onClick={allSectionsCollapsed ? expandAllSections : collapseAllSections}
                className="rounded-md border border-neutral-200 bg-white px-2.5 py-1 text-[11px] font-medium text-neutral-600 hover:border-royal-300 hover:text-royal-700"
              >
                {allSectionsCollapsed ? 'Развернуть всё' : 'Свернуть всё'}
              </button>
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => addSection('banquet')}
              className="rounded-lg border border-neutral-200 px-3 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-50"
            >
              + Раздел банкета
            </button>
            <button
              onClick={() => addSection('welcome')}
              className="rounded-lg border border-neutral-200 px-3 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-50"
            >
              + Welcome зона
            </button>
          </div>
        </div>

        {sections.length === 0 && (
          <div className="rounded-xl border border-dashed border-neutral-200 bg-white py-12 text-center">
            <p className="text-sm text-neutral-400">Добавьте первый раздел</p>
          </div>
        )}

        {sections.map((section, sIdx) => {
          const fold = isSectionCollapsed(sIdx)
          const sub = sectionSubtotals[sIdx]
          return (
          <div key={sIdx} className="rounded-xl border border-neutral-200 bg-white shadow-sm overflow-hidden">
            <div className="flex flex-wrap items-center gap-2 border-b border-neutral-100 bg-neutral-50 px-5 py-3">
              <button
                type="button"
                onClick={() => toggleSection(sIdx)}
                className="inline-flex h-6 w-6 items-center justify-center rounded text-xs text-neutral-500 hover:bg-neutral-200"
                aria-expanded={!fold}
                title={fold ? 'Развернуть' : 'Свернуть'}
              >
                <span className={`transition-transform ${fold ? '' : 'rotate-90'}`}>▶</span>
              </button>
              <div className="flex gap-1">
                <button onClick={() => moveSection(sIdx, -1)} disabled={sIdx === 0} className="rounded px-1 text-neutral-400 hover:text-neutral-600 disabled:opacity-30">↑</button>
                <button onClick={() => moveSection(sIdx, 1)} disabled={sIdx === sections.length - 1} className="rounded px-1 text-neutral-400 hover:text-neutral-600 disabled:opacity-30">↓</button>
              </div>
              <input
                type="text"
                value={section.title}
                onChange={(e) => updateSectionTitle(sIdx, e.target.value)}
                placeholder="Название раздела"
                className="flex-1 min-w-32 rounded-md border border-neutral-200 bg-white px-2 py-1 text-sm font-medium focus:border-royal-500 focus:ring-1 focus:ring-royal-500/20 focus:outline-none"
              />
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                section.type === 'welcome' ? 'bg-amber-50 text-amber-700 ring-1 ring-amber-200' : 'bg-royal-50 text-royal-700 ring-1 ring-royal-200'
              }`}>
                {section.type === 'welcome' ? 'welcome' : 'банкет'}
              </span>
              <span className="rounded-full bg-white px-2 py-0.5 text-[11px] font-semibold text-neutral-600 ring-1 ring-neutral-200">
                {section.items.length} {pluralItems(section.items.length)}
              </span>
              {Object.keys(sectionWeights[sIdx]).length > 0 && (
                <span className="rounded-full bg-white px-2 py-0.5 text-[11px] font-medium text-neutral-500 ring-1 ring-neutral-200">
                  {formatWeightMap(sectionWeights[sIdx])}
                  {form.persons > 0 && (
                    <span className="text-neutral-400">
                      {' '}· {formatWeightMap(perPerson(sectionWeights[sIdx], form.persons))}/чел
                    </span>
                  )}
                </span>
              )}
              <span className="text-xs font-semibold text-neutral-700">
                {sub.toLocaleString('ru-RU')} ₽
              </span>
              <button
                onClick={() => setDishPickerSection(sIdx)}
                className="rounded-md bg-royal-500 px-3 py-1 text-xs font-medium text-white hover:bg-royal-600"
              >
                + Блюдо
              </button>
              <button
                onClick={() => removeSection(sIdx)}
                className="rounded-md px-2 py-1 text-xs text-red-500 hover:bg-red-50"
              >
                Удалить
              </button>
            </div>

            {!fold && (section.items.length === 0 ? (
              <div className="px-5 py-6 text-center text-sm text-neutral-400">
                Нет блюд. Нажмите «Добавить блюдо».
              </div>
            ) : (
              <div className="divide-y divide-neutral-50">
                {section.items.map((item, iIdx) => (
                  <div key={iIdx} className="flex items-center gap-3 px-5 py-3">
                    <div className="flex flex-col gap-0.5">
                      <button onClick={() => moveItem(sIdx, iIdx, -1)} disabled={iIdx === 0} className="text-[10px] text-neutral-400 hover:text-neutral-600 disabled:opacity-30">▲</button>
                      <button onClick={() => moveItem(sIdx, iIdx, 1)} disabled={iIdx === section.items.length - 1} className="text-[10px] text-neutral-400 hover:text-neutral-600 disabled:opacity-30">▼</button>
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
                      onChange={(e) => updateItem(sIdx, iIdx, 'name', e.target.value)}
                      className={inlineInputClass}
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
                          onChange={(e) => updateItem(sIdx, iIdx, 'weight', parseFloat(e.target.value) || 0)}
                          className="w-12 bg-transparent px-1.5 py-1 text-right text-xs tabular-nums focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                        <select
                          value={item.weightUnit || 'г'}
                          onChange={(e) => updateItem(sIdx, iIdx, 'weightUnit', e.target.value)}
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
                        onChange={(e) => updateItem(sIdx, iIdx, 'quantity', parseInt(e.target.value) || 1)}
                        className={`w-14 ${smallInputClass}`}
                        title="Кол-во"
                      />
                      <span className="text-xs text-neutral-400">×</span>
                      <input
                        type="number"
                        min={0}
                        step="any"
                        value={item.pricePerUnit}
                        onChange={(e) => updateItem(sIdx, iIdx, 'pricePerUnit', parseFloat(e.target.value) || 0)}
                        className={`w-20 text-right ${smallInputClass}`}
                        title="Цена за ед."
                      />
                      <span className="w-20 text-right text-xs font-medium text-neutral-700">
                        {(item.quantity * item.pricePerUnit).toLocaleString('ru-RU')} ₽
                      </span>
                    </div>
                    <button
                      onClick={() => removeItem(sIdx, iIdx)}
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
        })}
      </div>

      {/* ─── Services ──────────────────────────────── */}
      <div className="rounded-xl border border-neutral-200 bg-white shadow-sm overflow-hidden">
        <div className="flex flex-wrap items-center gap-2 border-b border-neutral-100 bg-neutral-50 px-5 py-3">
          <button
            type="button"
            onClick={() => setCollapsedServices((v) => !v)}
            className="inline-flex h-6 w-6 items-center justify-center rounded text-xs text-neutral-500 hover:bg-neutral-200"
            aria-expanded={!collapsedServices}
          >
            <span className={`transition-transform ${collapsedServices ? '' : 'rotate-90'}`}>▶</span>
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
              onClick={() => setShowServicePicker(true)}
              className="rounded-md bg-royal-500 px-3 py-1 text-xs font-medium text-white hover:bg-royal-600"
            >
              + Услугу
            </button>
          </div>
        </div>

        {!collapsedServices && (services.length === 0 ? (
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
                  onChange={(e) => updateService(idx, 'name', e.target.value)}
                  className={inlineInputClass}
                />
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={1}
                    value={svc.quantity}
                    onChange={(e) => updateService(idx, 'quantity', parseInt(e.target.value) || 1)}
                    className={`w-14 ${smallInputClass}`}
                  />
                  <span className="text-xs text-neutral-400">×</span>
                  <input
                    type="number"
                    min={0}
                    step="any"
                    value={svc.price}
                    onChange={(e) => updateService(idx, 'price', parseFloat(e.target.value) || 0)}
                    className={`w-24 text-right ${smallInputClass}`}
                  />
                  <label className="flex items-center gap-1 text-xs text-neutral-500">
                    <input
                      type="checkbox"
                      checked={svc.isPerPerson}
                      onChange={(e) => updateService(idx, 'isPerPerson', e.target.checked)}
                      className="h-3 w-3 rounded border-neutral-200"
                    />
                    /чел
                  </label>
                  <span className="w-24 text-right text-xs font-medium text-neutral-700">
                    {(svc.isPerPerson ? svc.price * form.persons : svc.price * svc.quantity).toLocaleString('ru-RU')} ₽
                  </span>
                </div>
                <button
                  onClick={() => removeService(idx)}
                  className="rounded p-1 text-xs text-red-400 hover:bg-red-50 hover:text-red-600"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* ─── Bottom bar ────────────────────────────── */}
      <div className="sticky bottom-0 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-neutral-200 bg-white px-6 py-4 shadow-lg">
        <div className="flex flex-wrap items-baseline gap-x-5 gap-y-1 text-sm">
          <div>
            <span className="text-neutral-500">Итого: </span>
            <span className="text-lg font-bold text-royal-500">
              {calculateTotal().toLocaleString('ru-RU')} ₽
            </span>
          </div>
          {form.persons > 0 && (
            <div className="text-xs text-neutral-500">
              ≈ <span className="font-semibold text-neutral-700">{Math.round(calculateTotal() / form.persons).toLocaleString('ru-RU')} ₽</span> / чел.
            </div>
          )}
          <div className="text-xs text-neutral-500">
            Меню: <span className="font-semibold text-neutral-700">{sectionSubtotals.reduce((a, b) => a + b, 0).toLocaleString('ru-RU')} ₽</span>
            {services.length > 0 && (
              <>
                {' · '}Услуги: <span className="font-semibold text-neutral-700">{servicesSubtotal.toLocaleString('ru-RU')} ₽</span>
              </>
            )}
          </div>
          {Object.keys(totalWeight).length > 0 && (
            <div className="text-xs text-neutral-500">
              Выход: <span className="font-semibold text-neutral-700">{formatWeightMap(totalWeight)}</span>
              {form.persons > 0 && (
                <>
                  {' · ≈ '}
                  <span className="font-semibold text-neutral-700">{formatWeightMap(perPerson(totalWeight, form.persons))}</span> / чел.
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
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-3.5 py-2 text-sm font-medium text-neutral-600 shadow-sm transition hover:border-red-300 hover:text-red-600"
              title="Отменить несохранённые изменения"
            >
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden>
                <path d="M2 6.5a4.5 4.5 0 1 0 1.3-3.2M2 2v3h3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Отменить
            </button>
          )}
          {quoteId && initial?.slug && (
            <a
              href={`/quote/${initial.slug}`}
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
            onClick={handleSave}
            disabled={saving}
            className="rounded-lg bg-royal-500 px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-royal-600 disabled:opacity-60"
          >
            {saving ? 'Сохранение...' : 'Сохранить'}
          </button>
        </div>
      </div>

      {/* ─── Pickers ───────────────────────────────── */}
      {dishPickerSection !== null && (
        <DishPicker
          categories={categories}
          onSelect={(dish) => addDishToSection(dishPickerSection, dish)}
          onClose={() => setDishPickerSection(null)}
        />
      )}

      {showServicePicker && (
        <ServicePicker
          services={serviceTemplates}
          onSelect={addService}
          onClose={() => setShowServicePicker(false)}
        />
      )}
    </div>
  )
}

function pluralItems(n: number) {
  const mod10 = n % 10
  const mod100 = n % 100
  if (mod10 === 1 && mod100 !== 11) return 'блюдо'
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return 'блюда'
  return 'блюд'
}

function aggregateWeights(items: { weight: number; weightUnit: string; quantity: number }[]) {
  const sums: Record<string, number> = {}
  for (const it of items) {
    if (!it.weight || it.weight <= 0) continue
    const total = it.weight * it.quantity
    let unit = it.weightUnit || 'г'
    let val = total
    if (unit === 'кг') { unit = 'г'; val = total * 1000 }
    if (unit === 'л') { unit = 'мл'; val = total * 1000 }
    sums[unit] = (sums[unit] || 0) + val
  }
  return sums
}

function perPerson(sums: Record<string, number>, persons: number) {
  if (persons <= 0) return sums
  const out: Record<string, number> = {}
  for (const [k, v] of Object.entries(sums)) out[k] = v / persons
  return out
}

function formatWeightMap(sums: Record<string, number>): string {
  const order = ['г', 'мл', 'шт']
  const parts: string[] = []
  for (const unit of order) {
    const v = sums[unit]
    if (!v) continue
    if (unit === 'г' && v >= 1000) {
      parts.push(`${(v / 1000).toLocaleString('ru-RU', { maximumFractionDigits: 2 })} кг`)
    } else if (unit === 'мл' && v >= 1000) {
      parts.push(`${(v / 1000).toLocaleString('ru-RU', { maximumFractionDigits: 2 })} л`)
    } else if (unit === 'шт') {
      parts.push(`${Math.round(v).toLocaleString('ru-RU')} шт`)
    } else {
      parts.push(`${Math.round(v).toLocaleString('ru-RU')} ${unit}`)
    }
  }
  for (const [k, v] of Object.entries(sums)) {
    if (order.includes(k) || !v) continue
    parts.push(`${Math.round(v).toLocaleString('ru-RU')} ${k}`)
  }
  return parts.join(' · ')
}
