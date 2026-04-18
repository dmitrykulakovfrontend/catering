'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { deleteServiceTemplate } from '@/lib/actions'
import ServiceForm from './ServiceForm'
import DeleteConfirmDialog from './DeleteConfirmDialog'

interface ServiceTemplate {
  id: string
  name: string
  defaultPrice: number
  isPerPerson: boolean
  order: number
}

export default function ServicesList({ services }: { services: ServiceTemplate[] }) {
  const [editing, setEditing] = useState<ServiceTemplate | null>(null)
  const [adding, setAdding] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  async function handleDelete() {
    if (!deleteId) return
    try {
      await deleteServiceTemplate(deleteId)
      toast.success('Услуга удалена')
    } catch {
      toast.error('Ошибка удаления')
    }
    setDeleteId(null)
  }

  return (
    <>
      <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm">
        {services.length === 0 ? (
          <div className="px-6 py-16 text-center text-sm text-neutral-400">
            Нет шаблонов услуг
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-neutral-100 bg-neutral-50">
              <tr>
                <th className="px-6 py-3 font-medium text-neutral-500">Название</th>
                <th className="px-6 py-3 font-medium text-neutral-500">Цена</th>
                <th className="px-6 py-3 font-medium text-neutral-500">Тип</th>
                <th className="px-6 py-3 font-medium text-neutral-500"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {services.map((svc) => (
                <tr key={svc.id} className="hover:bg-royal-50/40 transition-colors">
                  <td className="px-6 py-4 font-medium text-neutral-900">{svc.name}</td>
                  <td className="px-6 py-4 text-neutral-600">
                    {svc.defaultPrice.toLocaleString('ru-RU')} ₽
                  </td>
                  <td className="px-6 py-4">
                    {svc.isPerPerson ? (
                      <span className="inline-flex items-center rounded-full bg-royal-50 px-2 py-0.5 text-xs font-medium text-royal-700">
                        за персону
                      </span>
                    ) : (
                      <span className="text-xs text-neutral-400">фикс.</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 justify-end">
                      <button
                        onClick={() => setEditing(svc)}
                        className="rounded-md px-2.5 py-1 text-xs font-medium text-neutral-600 hover:bg-neutral-100"
                      >
                        Изменить
                      </button>
                      <button
                        onClick={() => setDeleteId(svc.id)}
                        className="rounded-md px-2.5 py-1 text-xs font-medium text-red-500 hover:bg-red-50"
                      >
                        Удалить
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {adding && (
        <ServiceForm onClose={() => setAdding(false)} />
      )}

      {editing && (
        <ServiceForm service={editing} onClose={() => setEditing(null)} />
      )}

      <DeleteConfirmDialog
        open={!!deleteId}
        title="Удалить услугу?"
        message="Шаблон услуги будет удалён. Существующие банкеты не пострадают."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </>
  )
}
