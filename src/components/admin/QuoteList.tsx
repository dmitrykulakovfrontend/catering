'use client'

import Link from 'next/link'
import { toast } from 'sonner'
import { deleteQuote } from '@/lib/actions'
import { useState } from 'react'
import DeleteConfirmDialog from './DeleteConfirmDialog'

interface QuoteSummary {
  id: string
  slug: string
  eventTitle: string
  managerName: string
  persons: number
  updatedAt: Date
}

export default function QuoteList({ quotes }: { quotes: QuoteSummary[] }) {
  const [deleteId, setDeleteId] = useState<string | null>(null)

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
      <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-neutral-100 bg-neutral-50">
            <tr>
              <th className="px-6 py-3 font-medium text-neutral-500">Название</th>
              <th className="px-6 py-3 font-medium text-neutral-500">Менеджер</th>
              <th className="px-6 py-3 font-medium text-neutral-500">Персон</th>
              <th className="px-6 py-3 font-medium text-neutral-500">Дата</th>
              <th className="px-6 py-3 font-medium text-neutral-500"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {quotes.map((q) => (
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
