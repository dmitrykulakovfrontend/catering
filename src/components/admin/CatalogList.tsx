'use client'

import Image from 'next/image'
import { useEffect, useMemo, useRef, useState } from 'react'
import { toast } from 'sonner'
import { deleteCategory, deleteDish, reorderCategories } from '@/lib/actions'
import DishForm from './DishForm'
import DeleteConfirmDialog from './DeleteConfirmDialog'

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
  order: number
  dishes: Dish[]
}

const STORAGE_KEY = 'admin:catalog:collapsed'

export default function CatalogList({ categories }: { categories: Category[] }) {
  const [editingDish, setEditingDish] = useState<Dish | null>(null)
  const [addingToCategoryId, setAddingToCategoryId] = useState<string | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<{ type: 'dish' | 'category'; id: string; name: string } | null>(null)
  const [search, setSearch] = useState('')
  const [collapsed, setCollapsed] = useState<string[]>([])
  const searchRef = useRef<HTMLInputElement>(null)

  const catList = categories.map((c) => ({ id: c.id, name: c.name }))

  // Load persisted collapsed state
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) setCollapsed(JSON.parse(raw))
    } catch {}
  }, [])

  // Persist collapsed state
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(collapsed))
    } catch {}
  }, [collapsed])

  // Global "/" focuses search
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault()
        searchRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const q = search.trim().toLowerCase()
  const filtered = useMemo(() => {
    if (!q) return categories.map((c) => ({ ...c, matched: c.dishes }))
    return categories.map((c) => ({
      ...c,
      matched: c.dishes.filter((d) => d.name.toLowerCase().includes(q) || d.description.toLowerCase().includes(q)),
    }))
  }, [categories, q])

  const totalMatches = q ? filtered.reduce((s, c) => s + c.matched.length, 0) : null

  function isCollapsed(id: string) {
    // while searching, auto-expand matched categories
    if (q) return false
    return collapsed.includes(id)
  }

  function toggleCat(id: string) {
    setCollapsed((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  function collapseAll() {
    setCollapsed(categories.map((c) => c.id))
  }

  function expandAll() {
    setCollapsed([])
  }

  function jumpTo(id: string) {
    if (collapsed.includes(id)) {
      setCollapsed((prev) => prev.filter((x) => x !== id))
    }
    requestAnimationFrame(() => {
      document.getElementById(`cat-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }

  async function handleDelete() {
    if (!deleteTarget) return
    try {
      if (deleteTarget.type === 'dish') {
        await deleteDish(deleteTarget.id)
        toast.success('Блюдо удалено')
      } else {
        await deleteCategory(deleteTarget.id)
        toast.success('Категория удалена')
      }
    } catch {
      toast.error('Ошибка удаления')
    }
    setDeleteTarget(null)
  }

  async function moveCategory(idx: number, dir: -1 | 1) {
    const newIdx = idx + dir
    if (newIdx < 0 || newIdx >= categories.length) return
    const ids = categories.map((c) => c.id)
    ;[ids[idx], ids[newIdx]] = [ids[newIdx], ids[idx]]
    await reorderCategories(ids)
    toast.success('Порядок обновлён')
  }

  const allCollapsed = collapsed.length === categories.length && categories.length > 0

  return (
    <>
      {/* Sticky toolbar: search + quick-jump chips + collapse control */}
      <div className="sticky top-0 z-20 -mx-8 mb-5 border-b border-neutral-200 bg-neutral-50/90 px-8 py-3 backdrop-blur supports-backdrop-filter:bg-neutral-50/70">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-48">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">⌕</span>
            <input
              ref={searchRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Поиск по блюдам…  (нажмите / чтобы сфокусировать)"
              className="w-full rounded-lg border border-neutral-200 bg-white pl-9 pr-9 py-2 text-sm shadow-sm focus:border-royal-500 focus:ring-1 focus:ring-royal-500/20 focus:outline-none"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-xs text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700"
                title="Очистить"
              >
                ✕
              </button>
            )}
          </div>
          <button
            onClick={allCollapsed ? expandAll : collapseAll}
            className="rounded-lg border border-neutral-200 bg-white px-3 py-2 text-xs font-medium text-neutral-700 hover:border-royal-300 hover:text-royal-700"
          >
            {allCollapsed ? 'Развернуть всё' : 'Свернуть всё'}
          </button>
          {totalMatches !== null && (
            <span className="text-xs text-neutral-500">
              Найдено: <span className="font-medium text-neutral-900">{totalMatches}</span>
            </span>
          )}
        </div>

        {categories.length > 0 && (
          <div className="mt-3 flex gap-1.5 overflow-x-auto pb-1">
            {filtered.map((cat) => {
              const count = q ? cat.matched.length : cat.dishes.length
              const dim = q && cat.matched.length === 0
              return (
                <button
                  key={cat.id}
                  onClick={() => jumpTo(cat.id)}
                  className={`group flex items-center gap-1.5 shrink-0 rounded-full border px-2.5 py-1 text-xs transition-colors ${
                    dim
                      ? 'border-neutral-200 bg-white text-neutral-300'
                      : 'border-neutral-200 bg-white text-neutral-700 hover:border-royal-400 hover:bg-royal-50 hover:text-royal-700'
                  }`}
                  title={cat.name}
                >
                  <span className="max-w-32 truncate">{cat.name}</span>
                  <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${
                    dim ? 'bg-neutral-100 text-neutral-400' : 'bg-neutral-100 text-neutral-600 group-hover:bg-royal-100 group-hover:text-royal-700'
                  }`}>
                    {count}
                  </span>
                </button>
              )
            })}
          </div>
        )}
      </div>

      <div className="space-y-4">
        {filtered.map((cat, catIdx) => {
          const dishesToShow = q ? cat.matched : cat.dishes
          const fold = isCollapsed(cat.id)
          const hiddenBySearch = q && cat.matched.length === 0
          if (hiddenBySearch) return null
          return (
            <div
              id={`cat-${cat.id}`}
              key={cat.id}
              className="scroll-mt-32 rounded-xl border border-neutral-200 bg-white shadow-sm overflow-hidden"
            >
              <div className="flex items-center gap-2 border-b border-neutral-100 bg-neutral-50 px-4 py-3 sm:px-6">
                <button
                  onClick={() => toggleCat(cat.id)}
                  className="flex flex-1 items-center gap-2 text-left"
                  aria-expanded={!fold}
                >
                  <span
                    className={`inline-flex h-6 w-6 items-center justify-center rounded-md text-xs text-neutral-500 transition-transform ${
                      fold ? '' : 'rotate-90'
                    }`}
                  >
                    ▶
                  </span>
                  <h3 className="font-semibold text-neutral-900">{cat.name}</h3>
                  <span className="rounded-full bg-white px-2 py-0.5 text-[11px] font-semibold text-neutral-600 ring-1 ring-neutral-200">
                    {q ? `${cat.matched.length}/${cat.dishes.length}` : cat.dishes.length}
                  </span>
                </button>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => moveCategory(catIdx, -1)}
                    disabled={catIdx === 0}
                    className="rounded p-1 text-neutral-400 hover:bg-neutral-200 hover:text-neutral-600 disabled:opacity-30"
                    title="Вверх"
                  >
                    ↑
                  </button>
                  <button
                    onClick={() => moveCategory(catIdx, 1)}
                    disabled={catIdx === categories.length - 1}
                    className="rounded p-1 text-neutral-400 hover:bg-neutral-200 hover:text-neutral-600 disabled:opacity-30"
                    title="Вниз"
                  >
                    ↓
                  </button>
                  <button
                    onClick={() => setAddingToCategoryId(cat.id)}
                    className="rounded-md bg-royal-500 px-3 py-1 text-xs font-medium text-white hover:bg-royal-600"
                  >
                    + Блюдо
                  </button>
                  <button
                    onClick={() => setDeleteTarget({ type: 'category', id: cat.id, name: cat.name })}
                    className="rounded-md px-2 py-1 text-xs font-medium text-red-500 hover:bg-red-50"
                  >
                    Удалить
                  </button>
                </div>
              </div>

              {!fold && (
                dishesToShow.length === 0 ? (
                  <div className="px-6 py-8 text-center text-sm text-neutral-400">
                    {q ? 'Совпадений нет' : 'Нет блюд в этой категории'}
                  </div>
                ) : (
                  <div className="divide-y divide-neutral-50">
                    {dishesToShow.map((dish) => (
                      <div
                        key={dish.id}
                        className="flex items-center gap-4 px-4 py-3 transition-colors hover:bg-royal-50/30 sm:px-6"
                      >
                        {dish.image ? (
                          <div className="relative h-10 w-10 shrink-0">
                            <Image
                              src={dish.image}
                              alt={dish.name}
                              fill
                              sizes="40px"
                              className="rounded-lg object-cover"
                            />
                          </div>
                        ) : (
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-100 text-neutral-400 text-xs">
                            ◇
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-neutral-900 truncate">
                            {q ? highlight(dish.name, q) : dish.name}
                          </p>
                          <p className="text-xs text-neutral-500">
                            {dish.weight} {dish.weightUnit} · {dish.defaultPrice} ₽
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => setEditingDish(dish)}
                            className="rounded-md px-2.5 py-1 text-xs font-medium text-neutral-600 hover:bg-neutral-100"
                          >
                            Изменить
                          </button>
                          <button
                            onClick={() => setDeleteTarget({ type: 'dish', id: dish.id, name: dish.name })}
                            className="rounded-md px-2.5 py-1 text-xs font-medium text-red-500 hover:bg-red-50"
                          >
                            Удалить
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              )}
            </div>
          )
        })}
      </div>

      {editingDish && (
        <DishForm
          dish={editingDish}
          categories={catList}
          onClose={() => setEditingDish(null)}
        />
      )}

      {addingToCategoryId && (
        <DishForm
          dish={{ name: '', description: '', weight: 0, weightUnit: 'г', defaultPrice: 0, image: '', categoryId: addingToCategoryId }}
          categories={catList}
          onClose={() => setAddingToCategoryId(null)}
        />
      )}

      <DeleteConfirmDialog
        open={!!deleteTarget}
        title={deleteTarget?.type === 'category' ? 'Удалить категорию?' : 'Удалить блюдо?'}
        message={
          deleteTarget?.type === 'category'
            ? `Категория «${deleteTarget?.name}» и все её блюда будут удалены.`
            : `Блюдо «${deleteTarget?.name}» будет удалено из каталога. Существующие банкеты не пострадают.`
        }
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </>
  )
}

function highlight(text: string, q: string) {
  const idx = text.toLowerCase().indexOf(q)
  if (idx === -1) return text
  return (
    <>
      {text.slice(0, idx)}
      <mark className="rounded bg-yellow-100 px-0.5 text-neutral-900">{text.slice(idx, idx + q.length)}</mark>
      {text.slice(idx + q.length)}
    </>
  )
}
