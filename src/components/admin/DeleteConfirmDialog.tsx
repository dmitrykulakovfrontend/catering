'use client'

interface DeleteConfirmDialogProps {
  open: boolean
  title?: string
  message?: string
  onConfirm: () => void
  onCancel: () => void
}

export default function DeleteConfirmDialog({
  open,
  title = 'Подтвердите удаление',
  message = 'Вы уверены, что хотите удалить? Это действие нельзя отменить.',
  onConfirm,
  onCancel,
}: DeleteConfirmDialogProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/40" onClick={onCancel} />
      <div className="relative z-10 w-full max-w-md rounded-xl bg-white p-6 shadow-2xl">
        <h3 className="text-lg font-semibold text-neutral-900">{title}</h3>
        <p className="mt-2 text-sm text-neutral-600">{message}</p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="rounded-lg border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
          >
            Отмена
          </button>
          <button
            onClick={onConfirm}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
          >
            Удалить
          </button>
        </div>
      </div>
    </div>
  )
}
