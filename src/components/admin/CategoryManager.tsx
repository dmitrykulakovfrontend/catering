'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { createCategory } from '@/lib/actions'

export default function CategoryManager() {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [saving, setSaving] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    setSaving(true)
    try {
      await createCategory({ name: name.trim(), order: 99 })
      toast.success('Категория создана')
      setName('')
      setOpen(false)
    } catch {
      toast.error('Ошибка создания')
    } finally {
      setSaving(false)
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="rounded-lg border border-dashed border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 hover:border-wine-300 hover:text-wine-700"
      >
        + Добавить категорию
      </button>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <input
        type="text"
        autoFocus
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Название категории"
        className="rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-wine-500 focus:ring-1 focus:ring-wine-500/20 focus:outline-none"
      />
      <button
        type="submit"
        disabled={saving}
        className="rounded-lg bg-wine-700 px-4 py-2 text-sm font-medium text-white hover:bg-wine-600 disabled:opacity-60"
      >
        Создать
      </button>
      <button
        type="button"
        onClick={() => { setOpen(false); setName('') }}
        className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
      >
        Отмена
      </button>
    </form>
  )
}
