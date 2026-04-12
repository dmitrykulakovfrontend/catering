'use client'

import { useState } from 'react'
import ServiceForm from './ServiceForm'

export default function AddServiceButton() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="rounded-lg bg-wine-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-wine-600"
      >
        Добавить услугу
      </button>
      {open && <ServiceForm onClose={() => setOpen(false)} />}
    </>
  )
}
