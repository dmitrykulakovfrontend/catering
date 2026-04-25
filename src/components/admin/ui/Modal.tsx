'use client'

import { useEffect, useRef } from 'react'

interface ModalProps {
  open: boolean
  onClose: () => void
  children: React.ReactNode
  panelClassName?: string
  backdropClassName?: string
  closeOnBackdrop?: boolean
  closeOnEscape?: boolean
  // Return true to suppress the default close (nested-escape pattern).
  onEscape?: () => boolean
  onBackdropClick?: () => boolean
  initialFocusRef?: React.RefObject<HTMLElement | null>
  lockScroll?: boolean
}

const DEFAULT_PANEL =
  'relative z-10 w-full max-w-md rounded-xl bg-white p-6 shadow-2xl'
const DEFAULT_BACKDROP = 'fixed inset-0 bg-black/40'

export default function Modal({
  open,
  onClose,
  children,
  panelClassName = DEFAULT_PANEL,
  backdropClassName = DEFAULT_BACKDROP,
  closeOnBackdrop = true,
  closeOnEscape = true,
  onEscape,
  onBackdropClick,
  initialFocusRef,
  lockScroll = true,
}: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open || !closeOnEscape) return
    function onKey(e: KeyboardEvent) {
      if (e.key !== 'Escape') return
      if (onEscape && onEscape()) return
      onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, closeOnEscape, onEscape, onClose])

  useEffect(() => {
    if (!open || !lockScroll) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [open, lockScroll])

  useEffect(() => {
    if (!open) return
    const target = initialFocusRef?.current ?? panelRef.current
    target?.focus()
  }, [open, initialFocusRef])

  if (!open) return null

  function handleBackdrop() {
    if (onBackdropClick && onBackdropClick()) return
    if (closeOnBackdrop) onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className={backdropClassName} onClick={handleBackdrop} />
      <div ref={panelRef} tabIndex={-1} className={panelClassName}>
        {children}
      </div>
    </div>
  )
}
