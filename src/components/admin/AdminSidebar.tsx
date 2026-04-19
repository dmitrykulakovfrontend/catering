'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'

const navItems = [
  { href: '/admin', label: 'Панель управления', icon: '◆' },
  { href: '/admin/catalog', label: 'Каталог блюд', icon: '◈' },
  { href: '/admin/catalog/services', label: 'Услуги', icon: '◇' },
  { href: '/admin/settings', label: 'Настройки', icon: '⚙' },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-neutral-200 bg-white">
      <div className="border-b border-neutral-200 px-3 py-2 flex justify-center">
        <Link href="/admin" className="block">
          <Image
            src="/logo.png"
            alt="Любимый Кейтеринг"
            width={867}
            height={729}
            className="h-24 w-auto"
          />
        </Link>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => {
          const isActive =
            item.href === '/admin'
              ? pathname === '/admin'
              : pathname.startsWith(item.href) &&
                !navItems.some(
                  (other) =>
                    other.href !== item.href &&
                    other.href.startsWith(item.href) &&
                    pathname.startsWith(other.href)
                )
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                isActive
                  ? 'bg-royal-500 text-white shadow-sm'
                  : 'text-neutral-600 hover:bg-royal-50 hover:text-royal-700'
              }`}
            >
              <span className={`text-xs ${isActive ? 'text-royal-200' : 'text-royal-500'}`}>
                {item.icon}
              </span>
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-neutral-200 px-3 py-4">
        <button
          onClick={() => signOut({ callbackUrl: '/admin/login' })}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-neutral-500 transition-all hover:bg-red-50 hover:text-red-600"
        >
          <span className="text-xs">✕</span>
          Выйти
        </button>
      </div>
    </aside>
  )
}
