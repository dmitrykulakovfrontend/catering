'use client'

import { useMemo, useState } from 'react'
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
import { quoteSchema, type QuoteFormData } from '@/lib/validations'
import type {
  DishRow,
  DishCategoryWithDishes,
  ServiceTemplateRow,
  QuoteSectionDraft,
  QuoteServiceDraft,
} from '@/types/admin'

function describeQuoteIssue(
  path: ReadonlyArray<PropertyKey>,
  fallback: string,
  sections: QuoteSectionDraft[],
  services: QuoteServiceDraft[],
): string {
  const [root, idxKey, field, itemIdxKey, itemField] = path
  if (root === 'eventTitle') return 'Укажите название мероприятия'
  if (root === 'eventTime') return 'Укажите время мероприятия'
  if (root === 'managerName') return 'Укажите имя менеджера'
  if (root === 'slug') return 'Не удалось сгенерировать ссылку — заполните название и имя менеджера'
  if (root === 'persons') return 'Количество персон должно быть положительным'
  if (root === 'sections' && typeof idxKey === 'number') {
    const sectionLabel = sections[idxKey]?.title?.trim() || `#${idxKey + 1}`
    if (field === 'title') return `Укажите название раздела #${idxKey + 1}`
    if (field === 'items' && typeof itemIdxKey === 'number') {
      if (itemField === 'name') return `Раздел «${sectionLabel}»: укажите название блюда #${itemIdxKey + 1}`
      if (itemField === 'quantity') return `Раздел «${sectionLabel}»: количество блюда #${itemIdxKey + 1} должно быть положительным`
      if (itemField === 'pricePerUnit') return `Раздел «${sectionLabel}»: цена блюда #${itemIdxKey + 1} не может быть отрицательной`
    }
  }
  if (root === 'services' && typeof idxKey === 'number') {
    const serviceLabel = services[idxKey]?.name?.trim() || `#${idxKey + 1}`
    if (field === 'name') return `Укажите название услуги #${idxKey + 1}`
    if (field === 'price') return `Услуга «${serviceLabel}»: цена не может быть отрицательной`
    if (field === 'quantity') return `Услуга «${serviceLabel}»: количество должно быть положительным`
  }
  return fallback
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

  const [snapshot, setSnapshot] = useState({
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
    sections: (initial?.sections || []) as QuoteSectionDraft[],
    services: (initial?.services || []) as QuoteServiceDraft[],
  })

  const [form, setForm] = useState(snapshot.form)
  const [sections, setSections] = useState<QuoteSectionDraft[]>(snapshot.sections)
  const [services, setServices] = useState<QuoteServiceDraft[]>(snapshot.services)
  const [errors, setErrors] = useState<Record<string, string>>({})

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
    const snap = JSON.stringify(snapshot)
    return cur !== snap
  }, [form, sections, services, snapshot])

  function clearError(key: string) {
    setErrors((prev) => {
      if (!(key in prev)) return prev
      const next = { ...prev }
      delete next[key]
      return next
    })
  }

  function clearErrorsByPrefix(prefix: string) {
    setErrors((prev) => {
      let changed = false
      const next: Record<string, string> = {}
      for (const k of Object.keys(prev)) {
        if (k.startsWith(prefix)) {
          changed = true
          continue
        }
        next[k] = prev[k]
      }
      return changed ? next : prev
    })
  }

  function handleReset() {
    if (!isDirty) return
    if (!confirm('Отменить несохранённые изменения?')) return
    setForm(snapshot.form)
    setSections(JSON.parse(JSON.stringify(snapshot.sections)))
    setServices(JSON.parse(JSON.stringify(snapshot.services)))
    setErrors({})
    toast.success('Изменения отменены')
  }

  function handleFormChange(next: typeof form) {
    setForm(next)
    setErrors((prev) => {
      const META_KEYS = ['eventTitle', 'eventTime', 'persons', 'managerName', 'managerPhone', 'slug', 'notes', 'validUntil']
      let changed = false
      const out: Record<string, string> = {}
      for (const k of Object.keys(prev)) {
        if (META_KEYS.includes(k)) {
          changed = true
          continue
        }
        out[k] = prev[k]
      }
      return changed ? out : prev
    })
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
    clearErrorsByPrefix('sections.')
  }

  function updateSectionTitle(idx: number, title: string) {
    const updated = [...sections]
    updated[idx] = { ...updated[idx], title }
    setSections(updated)
    clearError(`sections.${idx}.title`)
  }

  function removeSection(idx: number) {
    setSections(sections.filter((_, i) => i !== idx))
    clearErrorsByPrefix('sections.')
  }

  function moveSection(idx: number, dir: -1 | 1) {
    const newIdx = idx + dir
    if (newIdx < 0 || newIdx >= sections.length) return
    const updated = [...sections]
    ;[updated[idx], updated[newIdx]] = [updated[newIdx], updated[idx]]
    setSections(updated)
    clearErrorsByPrefix('sections.')
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
    clearErrorsByPrefix(`sections.${sectionIdx}.items.`)
  }

  function updateItem(sectionIdx: number, itemIdx: number, field: string, value: string | number) {
    const updated = [...sections]
    const items = [...updated[sectionIdx].items]
    items[itemIdx] = { ...items[itemIdx], [field]: value }
    updated[sectionIdx] = { ...updated[sectionIdx], items }
    setSections(updated)
    clearError(`sections.${sectionIdx}.items.${itemIdx}.${field}`)
  }

  function removeItem(sectionIdx: number, itemIdx: number) {
    const updated = [...sections]
    updated[sectionIdx] = {
      ...updated[sectionIdx],
      items: updated[sectionIdx].items.filter((_, i) => i !== itemIdx),
    }
    setSections(updated)
    clearErrorsByPrefix(`sections.${sectionIdx}.items.`)
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
    clearErrorsByPrefix(`sections.${sectionIdx}.items.`)
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
    clearErrorsByPrefix('services.')
  }

  function updateService(idx: number, field: string, value: string | number | boolean) {
    const updated = [...services]
    updated[idx] = { ...updated[idx], [field]: value }
    setServices(updated)
    clearError(`services.${idx}.${field}`)
  }

  function removeService(idx: number) {
    setServices(services.filter((_, i) => i !== idx))
    clearErrorsByPrefix('services.')
  }

  async function handleSave() {
    // Auto-generate slug from event title + manager name if the user left it empty.
    // Reflect it back into form state so they see what was generated.
    const effectiveSlug =
      form.slug.trim() || generateSlug(form.eventTitle, form.managerName)
    if (effectiveSlug && effectiveSlug !== form.slug) {
      setForm((f) => ({ ...f, slug: effectiveSlug }))
    }

    const data: QuoteFormData = {
      ...form,
      slug: effectiveSlug,
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

    const result = quoteSchema.safeParse(data)
    if (!result.success) {
      const newErrors: Record<string, string> = {}
      for (const issue of result.error.issues) {
        const key = issue.path.join('.')
        if (!(key in newErrors)) newErrors[key] = issue.message
      }
      setErrors(newErrors)

      const sectionsWithErrors: number[] = []
      let hasMetaErrors = false
      let hasServiceErrors = false
      for (const k of Object.keys(newErrors)) {
        if (k.startsWith('sections.')) {
          const idx = parseInt(k.split('.')[1], 10)
          if (!Number.isNaN(idx) && !sectionsWithErrors.includes(idx)) sectionsWithErrors.push(idx)
        } else if (k.startsWith('services.')) {
          hasServiceErrors = true
        } else {
          hasMetaErrors = true
        }
      }
      if (hasMetaErrors) setCollapsedMeta(false)
      if (hasServiceErrors) setCollapsedServices(false)
      if (sectionsWithErrors.length > 0) {
        setCollapsedSections((prev) => prev.filter((i) => !sectionsWithErrors.includes(i)))
      }

      const first = result.error.issues[0]
      toast.error(describeQuoteIssue(first.path, first.message, sections, services))
      return
    }
    setErrors({})

    setSaving(true)
    try {
      const quote = await saveQuote(data, quoteId)
      setSnapshot({
        form: { ...form },
        sections: JSON.parse(JSON.stringify(sections)),
        services: JSON.parse(JSON.stringify(services)),
      })
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
        onChange={handleFormChange}
        collapsed={collapsedMeta}
        onToggleCollapsed={() => setCollapsedMeta((v) => !v)}
        onSlugBlur={updateSlug}
        errors={errors}
      />

      <SectionList
        sections={sections}
        persons={form.persons}
        sectionSubtotals={sectionSubtotals}
        sectionWeights={sectionWeights}
        collapsedIdx={collapsedSections}
        allCollapsed={allSectionsCollapsed}
        errors={errors}
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
        errors={errors}
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
