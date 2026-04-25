'use client'

import Link from 'next/link'
import { toast } from 'sonner'
import { deleteQuote } from '@/lib/actions'
import { useMemo, useState } from 'react'
import DeleteConfirmDialog from './DeleteConfirmDialog'
import type { QuoteSummary } from '@/types/admin'
import { INPUT_FOCUS_RING } from '@/lib/ui-classes'

export default function QuoteList({ quotes }: { quotes: QuoteSummary[] }) {
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState<'updated' | 'title' | 'manager' | 'persons'>('updated')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase()
    let list = quotes
    if (q) {
      list = list.filter(
        (x) =>
          x.eventTitle.toLowerCase().includes(q) ||
          x.managerName.toLowerCase().includes(q) ||
          x.slug.toLowerCase().includes(q),
      )
    }
    const sorted = [...list].sort((a, b) => {
      let cmp = 0
      if (sortKey === 'updated') cmp = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
      else if (sortKey === 'title') cmp = a.eventTitle.localeCompare(b.eventTitle, 'ru')
      else if (sortKey === 'manager') cmp = a.managerName.localeCompare(b.managerName, 'ru')
      else if (sortKey === 'persons') cmp = a.persons - b.persons
      return sortDir === 'asc' ? cmp : -cmp
    })
    return sorted
  }, [quotes, search, sortKey, sortDir])

  function toggleSort(key: typeof sortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir(key === 'title' || key === 'manager' ? 'asc' : 'desc')
    }
  }

  function arrow(key: typeof sortKey) {
    if (sortKey !== key) return <span className="text-neutral-300">↕</span>
    return <span className="text-royal-500">{sortDir === 'asc' ? '↑' : '↓'}</span>
  }

  function copyLink(slug: string) {
    const url = `${window.location.origin}/quote/${slug}`
    navigator.clipboard.writeText(url)
    toast.success('Ссылка скопирована')
  }

  async function handleDelete() {
    if (!deleteId) return
    try {
      await deleteQuote(deleteId)
      toast.success('Банкет удалён')
    } catch {
      toast.error('Ошибка при удалении')
    }
    setDeleteId(null)
  }

  if (quotes.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-neutral-200 bg-white py-16 text-center">
        <p className="text-sm text-neutral-500">Нет банкетов</p>
        <Link
          href="/admin/quotes/new"
          className="mt-3 inline-block rounded-lg bg-royal-500 px-4 py-2 text-sm font-medium text-white hover:bg-royal-600"
        >
          Создать первый банкет
        </Link>
      </div>
    )
  }

  return (
    <>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="relative min-w-48 flex-1">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">⌕</span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Поиск по названию, менеджеру или ссылке…"
            className={`w-full rounded-lg border border-neutral-200 bg-white pl-9 pr-9 py-2 text-sm shadow-sm ${INPUT_FOCUS_RING}`}
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-xs text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700"
            >
              ✕
            </button>
          )}
        </div>
        <span className="text-xs text-neutral-500">
          {visible.length} из {quotes.length}
        </span>
      </div>

      <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-neutral-100 bg-neutral-50">
            <tr>
              <th className="px-6 py-3 font-medium text-neutral-500">
                <button onClick={() => toggleSort('title')} className="inline-flex items-center gap-1 hover:text-neutral-900">
                  Название {arrow('title')}
                </button>
              </th>
              <th className="px-6 py-3 font-medium text-neutral-500">
                <button onClick={() => toggleSort('manager')} className="inline-flex items-center gap-1 hover:text-neutral-900">
                  Менеджер {arrow('manager')}
                </button>
              </th>
              <th className="px-6 py-3 font-medium text-neutral-500">
                <button onClick={() => toggleSort('persons')} className="inline-flex items-center gap-1 hover:text-neutral-900">
                  Персон {arrow('persons')}
                </button>
              </th>
              <th className="px-6 py-3 font-medium text-neutral-500">
                <button onClick={() => toggleSort('updated')} className="inline-flex items-center gap-1 hover:text-neutral-900">
                  Дата {arrow('updated')}
                </button>
              </th>
              <th className="px-6 py-3 font-medium text-neutral-500"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {visible.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-sm text-neutral-400">
                  Ничего не найдено
                </td>
              </tr>
            )}
            {visible.map((q) => (
              <tr key={q.id} className="hover:bg-royal-50/40 transition-colors">
                <td className="px-6 py-4">
                  <Link
                    href={`/admin/quotes/${q.id}/edit`}
                    className="font-medium text-neutral-900 hover:text-royal-500"
                  >
                    {q.eventTitle}
                  </Link>
                </td>
                <td className="px-6 py-4 text-neutral-600">{q.managerName}</td>
                <td className="px-6 py-4 text-neutral-600">{q.persons}</td>
                <td className="px-6 py-4 text-neutral-500">
                  {new Date(q.updatedAt).toLocaleDateString('ru-RU')}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => copyLink(q.slug)}
                      className="rounded-md px-2.5 py-1.5 text-xs font-medium text-royal-500 hover:bg-royal-50"
                      title="Скопировать ссылку"
                    >
                      Ссылка
                    </button>
                    <Link
                      href={`/admin/quotes/${q.id}/edit`}
                      className="rounded-md px-2.5 py-1.5 text-xs font-medium text-neutral-600 hover:bg-neutral-100"
                    >
                      Изменить
                    </Link>
                    <button
                      onClick={() => setDeleteId(q.id)}
                      className="rounded-md px-2.5 py-1.5 text-xs font-medium text-red-500 hover:bg-red-50"
                    >
                      Удалить
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <DeleteConfirmDialog
        open={!!deleteId}
        title="Удалить банкет?"
        message="Банкет и все связанные данные будут удалены. Публичная ссылка перестанет работать."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </>
  )
}
