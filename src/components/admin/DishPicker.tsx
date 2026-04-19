'use client'

import Image from 'next/image'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { createCategory, createDish } from '@/lib/actions'
import ImageUpload from './ImageUpload'

interface Dish {
  id: string
  name: string
  description: string
  weight: number
  weightUnit: string
  defaultPrice: number
  image: string
  categoryId: string
}

interface Category {
  id: string
  name: string
  dishes: Dish[]
}

interface DishPickerProps {
  categories: Category[]
  onSelect: (dish: Dish) => void
  onClose: () => void
}

type CreateMode = null | 'category' | 'dish'

const WEIGHT_UNITS = ['г', 'мл', 'шт', 'кг']

export default function DishPicker({ categories, onSelect, onClose }: DishPickerProps) {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [activeCat, setActiveCat] = useState<string | null>(null)
  const [createMode, setCreateMode] = useState<CreateMode>(null)
  const [saving, setSaving] = useState(false)
  const [flashId, setFlashId] = useState<string | null>(null)
  const [localCats, setLocalCats] = useState<Category[]>(categories)

  const [catDraft, setCatDraft] = useState('')
  const [dishDraft, setDishDraft] = useState({
    name: '',
    description: '',
    weight: 0,
    weightUnit: 'г',
    defaultPrice: 0,
    image: '',
    categoryId: categories[0]?.id || '',
  })

  const searchRef = useRef<HTMLInputElement>(null)
  const catInputRef = useRef<HTMLInputElement>(null)
  const dishNameRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setLocalCats(categories)
  }, [categories])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        if (createMode) setCreateMode(null)
        else onClose()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [createMode, onClose])

  useEffect(() => {
    if (createMode === 'category') catInputRef.current?.focus()
    if (createMode === 'dish') dishNameRef.current?.focus()
    if (!createMode) searchRef.current?.focus()
  }, [createMode])

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    return localCats
      .filter((c) => !activeCat || c.id === activeCat)
      .map((cat) => ({
        ...cat,
        dishes: cat.dishes.filter((d) => !q || d.name.toLowerCase().includes(q)),
      }))
      .filter((c) => c.dishes.length > 0)
  }, [localCats, search, activeCat])

  const totalDishes = localCats.reduce((n, c) => n + c.dishes.length, 0)

  function openDishCreate() {
    setDishDraft((d) => ({
      ...d,
      categoryId: activeCat || d.categoryId || localCats[0]?.id || '',
    }))
    setCreateMode('dish')
  }

  async function submitCategory(e: React.FormEvent) {
    e.preventDefault()
    const name = catDraft.trim()
    if (!name) return
    setSaving(true)
    try {
      const newCat = await createCategory({ name, order: localCats.length })
      const merged: Category = { id: newCat.id, name: newCat.name, dishes: [] }
      setLocalCats((cs) => [...cs, merged])
      setCatDraft('')
      setCreateMode(null)
      setActiveCat(newCat.id)
      setFlashId(newCat.id)
      setDishDraft((d) => ({ ...d, categoryId: newCat.id }))
      toast.success('Категория создана')
      router.refresh()
      setTimeout(() => setFlashId(null), 1200)
    } catch {
      toast.error('Ошибка создания категории')
    } finally {
      setSaving(false)
    }
  }

  async function submitDish(e: React.FormEvent) {
    e.preventDefault()
    if (!dishDraft.name.trim() || !dishDraft.categoryId) {
      toast.error('Название и категория обязательны')
      return
    }
    if (dishDraft.weight <= 0) {
      toast.error('Вес должен быть больше 0')
      return
    }
    setSaving(true)
    try {
      const created = await createDish(dishDraft)
      const merged: Dish = {
        id: created.id,
        name: created.name,
        description: created.description,
        weight: created.weight,
        weightUnit: created.weightUnit,
        defaultPrice: created.defaultPrice,
        image: created.image,
        categoryId: created.categoryId,
      }
      setLocalCats((cs) =>
        cs.map((c) => (c.id === merged.categoryId ? { ...c, dishes: [...c.dishes, merged] } : c)),
      )
      toast.success('Блюдо добавлено в каталог')
      router.refresh()
      onSelect(merged)
      onClose()
    } catch {
      toast.error('Ошибка создания блюда')
    } finally {
      setSaving(false)
    }
  }

  const panelInput =
    'w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm shadow-sm transition focus:border-royal-500 focus:ring-2 focus:ring-royal-500/15 focus:outline-none'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-neutral-950/50 backdrop-blur-sm"
        onClick={() => (createMode ? setCreateMode(null) : onClose())}
      />

      <div className="relative z-10 flex max-h-[88vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-[0_30px_80px_-20px_rgba(15,31,102,0.35)] ring-1 ring-neutral-200/60">
        {/* Header */}
        <div className="relative border-b border-neutral-100 bg-linear-to-b from-cream to-white px-6 pt-5 pb-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[10px] font-semibold tracking-[0.18em] text-royal-500 uppercase">
                Каталог
              </p>
              <h3 className="mt-0.5 text-xl font-semibold tracking-tight text-neutral-900">
                Выберите блюдо
              </h3>
              <p className="mt-0.5 text-xs text-neutral-500">
                {totalDishes} {pluralDishes(totalDishes)} · {localCats.length}{' '}
                {pluralCats(localCats.length)}
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
                ref={searchRef}
                autoFocus
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Поиск по названию..."
                className={`${panelInput} pl-9`}
              />
            </div>
            <button
              onClick={openDishCreate}
              className="group flex items-center gap-1.5 rounded-lg bg-royal-500 px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-royal-600"
            >
              <span className="text-base leading-none transition-transform group-hover:rotate-90">+</span>
              Новое блюдо
            </button>
          </div>

          {/* Category chips */}
          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            <Chip active={activeCat === null} onClick={() => setActiveCat(null)}>
              Все
            </Chip>
            {localCats.map((c) => (
              <Chip
                key={c.id}
                active={activeCat === c.id}
                flash={flashId === c.id}
                onClick={() => setActiveCat(c.id)}
              >
                {c.name}
                <span className="ml-1.5 text-[10px] text-neutral-400">{c.dishes.length}</span>
              </Chip>
            ))}
            <button
              onClick={() => setCreateMode('category')}
              className="inline-flex items-center gap-1 rounded-full border border-dashed border-neutral-300 px-2.5 py-1 text-[11px] font-medium text-neutral-500 transition hover:border-royal-400 hover:bg-royal-50/60 hover:text-royal-600"
            >
              <span className="text-sm leading-none">+</span>
              Категория
            </button>
          </div>
        </div>

        {/* Inline create panel */}
        {createMode === 'category' && (
          <form
            onSubmit={submitCategory}
            className="relative shrink-0 border-b border-royal-100 bg-royal-50/40 px-6 py-4 animate-in"
          >
            <div className="absolute top-0 bottom-0 left-0 w-0.5 bg-royal-500" />
            <label className="block text-[11px] font-semibold tracking-wide text-royal-700 uppercase">
              Новая категория
            </label>
            <div className="mt-2 flex gap-2">
              <input
                ref={catInputRef}
                type="text"
                required
                value={catDraft}
                onChange={(e) => setCatDraft(e.target.value)}
                placeholder="Например, Холодные закуски"
                className={panelInput}
              />
              <button
                type="button"
                onClick={() => setCreateMode(null)}
                className="rounded-lg border border-neutral-200 bg-white px-3 py-2 text-xs font-medium text-neutral-600 hover:bg-neutral-50"
              >
                Отмена
              </button>
              <button
                type="submit"
                disabled={saving || !catDraft.trim()}
                className="rounded-lg bg-royal-500 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-royal-600 disabled:opacity-50"
              >
                {saving ? '...' : 'Создать'}
              </button>
            </div>
          </form>
        )}

        {createMode === 'dish' && (
          <form
            onSubmit={submitDish}
            className="relative max-h-[60vh] shrink-0 overflow-y-auto border-b border-royal-100 bg-royal-50/40 px-6 py-4 animate-in"
          >
            <div className="absolute top-0 bottom-0 left-0 w-0.5 bg-royal-500" />
            <div className="flex items-center justify-between">
              <label className="block text-[11px] font-semibold tracking-wide text-royal-700 uppercase">
                Новое блюдо
              </label>
              <button
                type="button"
                onClick={() => setCreateMode(null)}
                className="text-[11px] font-medium text-neutral-500 hover:text-neutral-800"
              >
                Отмена
              </button>
            </div>

            <div className="mt-2.5 grid grid-cols-6 gap-2.5">
              <div className="col-span-6">
                <input
                  ref={dishNameRef}
                  type="text"
                  required
                  value={dishDraft.name}
                  onChange={(e) => setDishDraft({ ...dishDraft, name: e.target.value })}
                  placeholder="Название"
                  className={panelInput}
                />
              </div>
              <div className="col-span-6">
                <textarea
                  value={dishDraft.description}
                  onChange={(e) => setDishDraft({ ...dishDraft, description: e.target.value })}
                  placeholder="Описание (необязательно)"
                  rows={2}
                  className={`${panelInput} resize-none`}
                />
              </div>
              <div className="col-span-2">
                <input
                  type="number"
                  required
                  min={0}
                  step="any"
                  value={dishDraft.weight || ''}
                  onChange={(e) => setDishDraft({ ...dishDraft, weight: parseFloat(e.target.value) || 0 })}
                  placeholder="Вес"
                  className={panelInput}
                />
              </div>
              <div className="col-span-1">
                <select
                  value={dishDraft.weightUnit}
                  onChange={(e) => setDishDraft({ ...dishDraft, weightUnit: e.target.value })}
                  className={panelInput}
                >
                  {WEIGHT_UNITS.map((u) => (
                    <option key={u} value={u}>{u}</option>
                  ))}
                </select>
              </div>
              <div className="col-span-3">
                <div className="relative">
                  <input
                    type="number"
                    required
                    min={0}
                    step="any"
                    value={dishDraft.defaultPrice || ''}
                    onChange={(e) => setDishDraft({ ...dishDraft, defaultPrice: parseFloat(e.target.value) || 0 })}
                    placeholder="Цена"
                    className={`${panelInput} pr-7`}
                  />
                  <span className="absolute top-1/2 right-3 -translate-y-1/2 text-xs text-neutral-400">₽</span>
                </div>
              </div>
              <div className="col-span-6">
                <select
                  required
                  value={dishDraft.categoryId}
                  onChange={(e) => setDishDraft({ ...dishDraft, categoryId: e.target.value })}
                  className={panelInput}
                >
                  <option value="" disabled>Категория</option>
                  {localCats.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div className="col-span-6">
                <ImageUpload
                  value={dishDraft.image}
                  onChange={(url) => setDishDraft({ ...dishDraft, image: url })}
                />
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
                <span className="text-xl">◇</span>
              </div>
              <p className="text-sm text-neutral-500">
                {totalDishes === 0 ? 'Каталог пуст' : 'Ничего не найдено'}
              </p>
              {createMode !== 'dish' && (
                <button
                  onClick={openDishCreate}
                  className="mt-3 rounded-lg border border-royal-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-royal-600 transition hover:border-royal-400 hover:bg-royal-50"
                >
                  + Создать блюдо
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-5">
              {filtered.map((cat) => (
                <div key={cat.id}>
                  <h4 className="mb-2 flex items-center gap-2 text-[10px] font-semibold tracking-[0.16em] text-neutral-400 uppercase">
                    <span className="h-px flex-1 bg-neutral-100" />
                    <span>{cat.name}</span>
                    <span className="text-neutral-300">·</span>
                    <span className="text-neutral-400">{cat.dishes.length}</span>
                    <span className="h-px flex-1 bg-neutral-100" />
                  </h4>
                  <div className="space-y-1">
                    {cat.dishes.map((dish) => (
                      <button
                        key={dish.id}
                        onClick={() => { onSelect(dish); onClose() }}
                        className={`group flex w-full items-center gap-3 rounded-lg border border-transparent px-3 py-2 text-left transition hover:border-royal-200 hover:bg-royal-50/60 ${
                          flashId === dish.id ? 'ring-2 ring-royal-300 ring-offset-2' : ''
                        }`}
                      >
                        {dish.image ? (
                          <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-md ring-1 ring-neutral-200">
                            <Image src={dish.image} alt="" fill sizes="40px" className="object-cover" />
                          </div>
                        ) : (
                          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-md bg-neutral-100 text-xs text-neutral-400">
                            ◇
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-neutral-900">{dish.name}</p>
                          <p className="text-xs text-neutral-500">
                            {dish.weight} {dish.weightUnit} · {dish.defaultPrice.toLocaleString('ru-RU')} ₽
                          </p>
                        </div>
                        <span className="shrink-0 text-xs font-medium text-neutral-300 opacity-0 transition group-hover:translate-x-0 group-hover:opacity-100 -translate-x-1">
                          выбрать →
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
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
    </div>
  )
}

function Chip({
  active,
  flash,
  onClick,
  children,
}: {
  active: boolean
  flash?: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-2.5 py-1 text-[11px] font-medium transition ${
        active
          ? 'bg-royal-500 text-white shadow-sm'
          : 'border border-neutral-200 bg-white text-neutral-600 hover:border-royal-300 hover:text-royal-700'
      } ${flash ? 'ring-2 ring-royal-300 ring-offset-1' : ''}`}
    >
      {children}
    </button>
  )
}

function pluralDishes(n: number) {
  const m10 = n % 10
  const m100 = n % 100
  if (m10 === 1 && m100 !== 11) return 'блюдо'
  if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return 'блюда'
  return 'блюд'
}
function pluralCats(n: number) {
  const m10 = n % 10
  const m100 = n % 100
  if (m10 === 1 && m100 !== 11) return 'категория'
  if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return 'категории'
  return 'категорий'
}
