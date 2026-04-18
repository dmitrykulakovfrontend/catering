'use client'

import { useState, useTransition } from 'react'
import { updateSiteSettings } from '@/lib/actions'

const SETTINGS_FIELDS = [
  {
    key: 'phone',
    label: 'Телефон (главная страница)',
    placeholder: '7(964)7611900',
    description: 'Номер телефона, который отображается на главной странице сайта',
  },
]

export default function SiteSettingsForm({
  settings,
}: {
  settings: Record<string, string>
}) {
  const [values, setValues] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {}
    for (const field of SETTINGS_FIELDS) {
      initial[field.key] = settings[field.key] ?? ''
    }
    return initial
  })
  const [isPending, startTransition] = useTransition()
  const [saved, setSaved] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaved(false)

    const entries = Object.entries(values).map(([key, value]) => ({
      key,
      value: value.trim(),
    }))

    startTransition(async () => {
      await updateSiteSettings(entries)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    })
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-lg space-y-6">
      {SETTINGS_FIELDS.map((field) => (
        <div key={field.key}>
          <label
            htmlFor={field.key}
            className="block text-sm font-medium text-neutral-700 mb-1"
          >
            {field.label}
          </label>
          <input
            id={field.key}
            type="text"
            value={values[field.key]}
            onChange={(e) =>
              setValues((prev) => ({ ...prev, [field.key]: e.target.value }))
            }
            placeholder={field.placeholder}
            className="block w-full rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-sm text-neutral-900 shadow-sm transition-colors focus:border-royal-500 focus:outline-none focus:ring-1 focus:ring-royal-500"
          />
          {field.description && (
            <p className="mt-1 text-xs text-neutral-400">{field.description}</p>
          )}
        </div>
      ))}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-lg bg-royal-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-royal-600 disabled:opacity-50"
        >
          {isPending ? 'Сохранение...' : 'Сохранить'}
        </button>

        {saved && (
          <span className="text-sm font-medium text-emerald-600">
            Сохранено
          </span>
        )}
      </div>
    </form>
  )
}
