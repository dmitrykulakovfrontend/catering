'use client'

import { useState } from 'react'
import { toast } from 'sonner'

interface ImageUploadProps {
  value: string
  onChange: (url: string) => void
}

export default function ImageUpload({ value, onChange }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 4 * 1024 * 1024) {
      toast.error('Файл слишком большой. Максимум 4 МБ.')
      return
    }

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      if (!res.ok) throw new Error('Upload failed')
      const data = await res.json()
      onChange(data.url)
      toast.success('Фото загружено')
    } catch {
      toast.error('Ошибка загрузки')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-2">
      {value && (
        <div className="relative h-20 w-20 overflow-hidden rounded-lg border border-gray-200">
          <img src={value} alt="" className="h-full w-full object-cover" />
        </div>
      )}
      <div className="flex items-center gap-2">
        <label className="cursor-pointer rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50">
          {uploading ? 'Загрузка...' : 'Загрузить фото'}
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading}
            className="hidden"
          />
        </label>
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="URL изображения"
        className="block w-full rounded-lg border border-gray-300 px-3 py-1.5 text-xs shadow-sm focus:border-wine-500 focus:ring-1 focus:ring-wine-500/20 focus:outline-none"
      />
    </div>
  )
}
