'use client'

interface ServiceTemplate {
  id: string
  name: string
  defaultPrice: number
  isPerPerson: boolean
}

interface ServicePickerProps {
  services: ServiceTemplate[]
  onSelect: (service: ServiceTemplate) => void
  onClose: () => void
}

export default function ServicePicker({ services, onSelect, onClose }: ServicePickerProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md rounded-xl bg-white shadow-2xl">
        <div className="border-b border-gray-200 px-6 py-4">
          <h3 className="text-lg font-semibold text-gray-900">Выберите услугу</h3>
        </div>

        <div className="max-h-96 overflow-y-auto px-6 py-4">
          {services.length === 0 ? (
            <p className="py-8 text-center text-sm text-gray-400">Нет шаблонов услуг</p>
          ) : (
            <div className="space-y-1">
              {services.map((svc) => (
                <button
                  key={svc.id}
                  onClick={() => { onSelect(svc); onClose() }}
                  className="flex w-full items-center justify-between rounded-lg px-3 py-3 text-left transition-colors hover:bg-gold-50"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">{svc.name}</p>
                    {svc.isPerPerson && (
                      <p className="text-xs text-blue-600">за персону</p>
                    )}
                  </div>
                  <span className="text-sm font-medium text-gray-600">
                    {svc.defaultPrice.toLocaleString('ru-RU')} ₽
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="border-t border-gray-200 px-6 py-3">
          <button
            onClick={onClose}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  )
}
