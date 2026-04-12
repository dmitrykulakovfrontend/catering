const statusConfig: Record<string, { label: string; className: string }> = {
  draft: {
    label: 'Черновик',
    className: 'bg-gray-100 text-gray-600',
  },
  sent: {
    label: 'Отправлено',
    className: 'bg-blue-50 text-blue-700',
  },
  confirmed: {
    label: 'Подтверждено',
    className: 'bg-emerald-50 text-emerald-700',
  },
  archived: {
    label: 'Архив',
    className: 'bg-amber-50 text-amber-700',
  },
}

export default function StatusBadge({ status }: { status: string }) {
  const config = statusConfig[status] || statusConfig.draft
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${config.className}`}
    >
      {config.label}
    </span>
  )
}
