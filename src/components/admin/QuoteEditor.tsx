'use client'

import { useState } from 'react'
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
    clientName: string
    clientPhone: string
    notes: string
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

  const [form, setForm] = useState({
    eventTitle: initial?.eventTitle || '',
    eventTime: initial?.eventTime || '',
    persons: initial?.persons || 30,
    clientName: initial?.clientName || '',
    clientPhone: initial?.clientPhone || '',
    notes: initial?.notes || '',
    slug: initial?.slug || '',
  })

  const [sections, setSections] = useState<QuoteSection[]>(
    initial?.sections || []
  )
  const [services, setServices] = useState<QuoteService[]>(
    initial?.services || []
  )

  const [dishPickerSection, setDishPickerSection] = useState<number | null>(null)
  const [showServicePicker, setShowServicePicker] = useState(false)
  const [saving, setSaving] = useState(false)

  // Auto-generate slug when title/name changes (only for new quotes)
  function updateSlug() {
    if (!quoteId && form.eventTitle && form.clientName) {
      setForm((f) => ({ ...f, slug: generateSlug(f.eventTitle, f.clientName) }))
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
    if (!form.eventTitle || !form.clientName || !form.slug) {
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

  return (
    <div className="space-y-8">
      {/* ─── Header fields ──────────────────────────── */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-5 font-semibold text-gray-900">Информация о банкете</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Название мероприятия</label>
            <input
              type="text"
              required
              value={form.eventTitle}
              onChange={(e) => setForm({ ...form, eventTitle: e.target.value })}
              onBlur={updateSlug}
              placeholder="Банкет на 30 персон"
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-wine-500 focus:ring-1 focus:ring-wine-500/20 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Время</label>
            <input
              type="text"
              value={form.eventTime}
              onChange={(e) => setForm({ ...form, eventTime: e.target.value })}
              placeholder="c 11:00 до 22:30"
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-wine-500 focus:ring-1 focus:ring-wine-500/20 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Количество персон</label>
            <input
              type="number"
              min={1}
              value={form.persons}
              onChange={(e) => setForm({ ...form, persons: parseInt(e.target.value) || 1 })}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-wine-500 focus:ring-1 focus:ring-wine-500/20 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Имя клиента</label>
            <input
              type="text"
              required
              value={form.clientName}
              onChange={(e) => setForm({ ...form, clientName: e.target.value })}
              onBlur={updateSlug}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-wine-500 focus:ring-1 focus:ring-wine-500/20 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Телефон клиента</label>
            <input
              type="text"
              value={form.clientPhone}
              onChange={(e) => setForm({ ...form, clientPhone: e.target.value })}
              placeholder="+7..."
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-wine-500 focus:ring-1 focus:ring-wine-500/20 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Ссылка (URL)</label>
            <input
              type="text"
              required
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm font-mono shadow-sm focus:border-wine-500 focus:ring-1 focus:ring-wine-500/20 focus:outline-none"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Заметки</label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              rows={2}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-wine-500 focus:ring-1 focus:ring-wine-500/20 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* ─── Sections ──────────────────────────────── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">Разделы меню</h2>
          <div className="flex gap-2">
            <button
              onClick={() => addSection('banquet')}
              className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
            >
              + Раздел банкета
            </button>
            <button
              onClick={() => addSection('welcome')}
              className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
            >
              + Welcome зона
            </button>
          </div>
        </div>

        {sections.length === 0 && (
          <div className="rounded-xl border border-dashed border-gray-300 bg-white py-12 text-center">
            <p className="text-sm text-gray-400">Добавьте первый раздел</p>
          </div>
        )}

        {sections.map((section, sIdx) => (
          <div key={sIdx} className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
            <div className="flex items-center gap-3 border-b border-gray-100 bg-gray-50/60 px-5 py-3">
              <div className="flex gap-1">
                <button onClick={() => moveSection(sIdx, -1)} disabled={sIdx === 0} className="rounded px-1 text-gray-400 hover:text-gray-600 disabled:opacity-30">↑</button>
                <button onClick={() => moveSection(sIdx, 1)} disabled={sIdx === sections.length - 1} className="rounded px-1 text-gray-400 hover:text-gray-600 disabled:opacity-30">↓</button>
              </div>
              <input
                type="text"
                value={section.title}
                onChange={(e) => updateSectionTitle(sIdx, e.target.value)}
                placeholder="Название раздела"
                className="flex-1 rounded-md border border-gray-300 px-2 py-1 text-sm font-medium focus:border-wine-500 focus:ring-1 focus:ring-wine-500/20 focus:outline-none"
              />
              <span className="text-xs text-gray-400">
                {section.type === 'welcome' ? 'welcome' : 'банкет'}
              </span>
              <button
                onClick={() => setDishPickerSection(sIdx)}
                className="rounded-md bg-wine-700 px-3 py-1 text-xs font-medium text-white hover:bg-wine-600"
              >
                Добавить блюдо
              </button>
              <button
                onClick={() => removeSection(sIdx)}
                className="rounded-md px-2 py-1 text-xs text-red-500 hover:bg-red-50"
              >
                Удалить
              </button>
            </div>

            {section.items.length === 0 ? (
              <div className="px-5 py-6 text-center text-sm text-gray-400">
                Нет блюд. Нажмите «Добавить блюдо».
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {section.items.map((item, iIdx) => (
                  <div key={iIdx} className="flex items-center gap-3 px-5 py-3">
                    <div className="flex flex-col gap-0.5">
                      <button onClick={() => moveItem(sIdx, iIdx, -1)} disabled={iIdx === 0} className="text-[10px] text-gray-400 hover:text-gray-600 disabled:opacity-30">▲</button>
                      <button onClick={() => moveItem(sIdx, iIdx, 1)} disabled={iIdx === section.items.length - 1} className="text-[10px] text-gray-400 hover:text-gray-600 disabled:opacity-30">▼</button>
                    </div>
                    {item.image ? (
                      <img src={item.image} alt="" className="h-8 w-8 rounded object-cover" />
                    ) : (
                      <div className="flex h-8 w-8 items-center justify-center rounded bg-gray-100 text-[10px] text-gray-400">◇</div>
                    )}
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => updateItem(sIdx, iIdx, 'name', e.target.value)}
                      className="flex-1 min-w-0 rounded border border-transparent px-2 py-1 text-sm hover:border-gray-300 focus:border-wine-500 focus:ring-1 focus:ring-wine-500/20 focus:outline-none"
                    />
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        min={1}
                        value={item.quantity}
                        onChange={(e) => updateItem(sIdx, iIdx, 'quantity', parseInt(e.target.value) || 1)}
                        className="w-14 rounded border border-gray-300 px-2 py-1 text-center text-xs focus:border-wine-500 focus:ring-1 focus:ring-wine-500/20 focus:outline-none"
                        title="Кол-во"
                      />
                      <span className="text-xs text-gray-400">×</span>
                      <input
                        type="number"
                        min={0}
                        step="any"
                        value={item.pricePerUnit}
                        onChange={(e) => updateItem(sIdx, iIdx, 'pricePerUnit', parseFloat(e.target.value) || 0)}
                        className="w-20 rounded border border-gray-300 px-2 py-1 text-right text-xs focus:border-wine-500 focus:ring-1 focus:ring-wine-500/20 focus:outline-none"
                        title="Цена за ед."
                      />
                      <span className="w-20 text-right text-xs font-medium text-gray-700">
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
            )}
          </div>
        ))}
      </div>

      {/* ─── Services ──────────────────────────────── */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50/60 px-5 py-3">
          <h2 className="font-semibold text-gray-900">Услуги</h2>
          <button
            onClick={() => setShowServicePicker(true)}
            className="rounded-md bg-wine-700 px-3 py-1 text-xs font-medium text-white hover:bg-wine-600"
          >
            Добавить услугу
          </button>
        </div>

        {services.length === 0 ? (
          <div className="px-5 py-6 text-center text-sm text-gray-400">
            Нет услуг. Нажмите «Добавить услугу».
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {services.map((svc, idx) => (
              <div key={idx} className="flex items-center gap-3 px-5 py-3">
                <input
                  type="text"
                  value={svc.name}
                  onChange={(e) => updateService(idx, 'name', e.target.value)}
                  className="flex-1 min-w-0 rounded border border-transparent px-2 py-1 text-sm hover:border-gray-300 focus:border-wine-500 focus:ring-1 focus:ring-wine-500/20 focus:outline-none"
                />
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={1}
                    value={svc.quantity}
                    onChange={(e) => updateService(idx, 'quantity', parseInt(e.target.value) || 1)}
                    className="w-14 rounded border border-gray-300 px-2 py-1 text-center text-xs focus:border-wine-500 focus:ring-1 focus:ring-wine-500/20 focus:outline-none"
                  />
                  <span className="text-xs text-gray-400">×</span>
                  <input
                    type="number"
                    min={0}
                    step="any"
                    value={svc.price}
                    onChange={(e) => updateService(idx, 'price', parseFloat(e.target.value) || 0)}
                    className="w-24 rounded border border-gray-300 px-2 py-1 text-right text-xs focus:border-wine-500 focus:ring-1 focus:ring-wine-500/20 focus:outline-none"
                  />
                  <label className="flex items-center gap-1 text-xs text-gray-500">
                    <input
                      type="checkbox"
                      checked={svc.isPerPerson}
                      onChange={(e) => updateService(idx, 'isPerPerson', e.target.checked)}
                      className="h-3 w-3 rounded border-gray-300"
                    />
                    /чел
                  </label>
                  <span className="w-24 text-right text-xs font-medium text-gray-700">
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
        )}
      </div>

      {/* ─── Bottom bar ────────────────────────────── */}
      <div className="sticky bottom-0 flex items-center justify-between rounded-xl border border-gray-200 bg-white px-6 py-4 shadow-lg">
        <div className="text-sm">
          <span className="text-gray-500">Итого: </span>
          <span className="text-lg font-bold text-wine-700">
            {calculateTotal().toLocaleString('ru-RU')} ₽
          </span>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className="rounded-lg bg-wine-700 px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-wine-600 disabled:opacity-60"
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
