'use client'

import { useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { saveQuote } from '@/lib/actions'
import { generateSlug } from '@/lib/utils'
import { aggregateWeights } from '@/lib/quote-math'
import DishPicker from './DishPicker'
import ServicePicker from './ServicePicker'
import QuoteMetaForm from './quote-editor/QuoteMetaForm'
import SectionList from './quote-editor/SectionList'
import ServicesBlock from './quote-editor/ServicesBlock'
import QuoteBottomBar from './quote-editor/QuoteBottomBar'
import type { QuoteFormData } from '@/lib/validations'
import type {
  DishRow,
  DishCategoryWithDishes,
  ServiceTemplateRow,
  QuoteSectionDraft,
  QuoteServiceDraft,
} from '@/types/admin'

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
    sections: QuoteSectionDraft[]
    services: QuoteServiceDraft[]
  }
  categories: DishCategoryWithDishes[]
  serviceTemplates: ServiceTemplateRow[]
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
  const [sections, setSections] = useState<QuoteSectionDraft[]>(initialSnapshot.current.sections)
  const [services, setServices] = useState<QuoteServiceDraft[]>(initialSnapshot.current.services)

  const [dishPickerSection, setDishPickerSection] = useState<number | null>(null)
  const [showServicePicker, setShowServicePicker] = useState(false)
  const [saving, setSaving] = useState(false)
  const [collapsedSections, setCollapsedSections] = useState<number[]>([])
  const [collapsedMeta, setCollapsedMeta] = useState(!!quoteId)
  const [collapsedServices, setCollapsedServices] = useState(false)

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
  const menuSubtotal = sectionSubtotals.reduce((a, b) => a + b, 0)
  const servicesSubtotal = services.reduce(
    (sum, svc) => sum + (svc.isPerPerson ? svc.price * form.persons : svc.price * svc.quantity),
    0,
  )
  const total = menuSubtotal + servicesSubtotal
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

  function updateSlug() {
    if (!quoteId && form.eventTitle && form.managerName) {
      setForm((f) => ({ ...f, slug: generateSlug(f.eventTitle, f.managerName) }))
    }
  }

  function toggleSection(idx: number) {
    setCollapsedSections((prev) => (prev.includes(idx) ? prev.filter((x) => x !== idx) : [...prev, idx]))
  }

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

  function addDishToSection(sectionIdx: number, dish: DishRow) {
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

  function addService(template: ServiceTemplateRow) {
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

  return (
    <div className="space-y-8">
      <QuoteMetaForm
        value={form}
        onChange={setForm}
        collapsed={collapsedMeta}
        onToggleCollapsed={() => setCollapsedMeta((v) => !v)}
        onSlugBlur={updateSlug}
      />

      <SectionList
        sections={sections}
        persons={form.persons}
        sectionSubtotals={sectionSubtotals}
        sectionWeights={sectionWeights}
        collapsedIdx={collapsedSections}
        allCollapsed={allSectionsCollapsed}
        onToggleSection={toggleSection}
        onCollapseAll={() => setCollapsedSections(sections.map((_, i) => i))}
        onExpandAll={() => setCollapsedSections([])}
        onAddSection={addSection}
        onUpdateTitle={updateSectionTitle}
        onRemoveSection={removeSection}
        onMoveSection={moveSection}
        onOpenDishPicker={setDishPickerSection}
        onUpdateItem={updateItem}
        onRemoveItem={removeItem}
        onMoveItem={moveItem}
      />

      <ServicesBlock
        services={services}
        persons={form.persons}
        servicesSubtotal={servicesSubtotal}
        collapsed={collapsedServices}
        onToggleCollapsed={() => setCollapsedServices((v) => !v)}
        onUpdate={updateService}
        onRemove={removeService}
        onOpenPicker={() => setShowServicePicker(true)}
      />

      <QuoteBottomBar
        total={total}
        menuSubtotal={menuSubtotal}
        servicesSubtotal={servicesSubtotal}
        servicesCount={services.length}
        persons={form.persons}
        totalWeight={totalWeight}
        isDirty={isDirty}
        saving={saving}
        previewSlug={quoteId && initial?.slug ? initial.slug : undefined}
        onReset={handleReset}
        onSave={handleSave}
      />

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
