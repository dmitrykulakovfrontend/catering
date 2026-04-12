'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'

const navItems = [
  { href: '/admin', label: 'Панель управления', icon: '◆' },
  { href: '/admin/catalog', label: 'Каталог блюд', icon: '◈' },
  { href: '/admin/catalog/services', label: 'Услуги', icon: '◇' },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-gold-200/60 bg-white">
      <div className="border-b border-gold-200/60 px-6 py-5">
        <Link href="/admin" className="block">
          <h1 className="font-serif text-xl font-bold text-wine-700">
            Любимый
          </h1>
          <p className="text-xs tracking-widest text-gold-600 uppercase">
            Кейтеринг
          </p>
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
                  ? 'bg-wine-700 text-white shadow-sm'
                  : 'text-gray-600 hover:bg-gold-50 hover:text-wine-700'
              }`}
            >
              <span className={`text-xs ${isActive ? 'text-gold-300' : 'text-gold-500'}`}>
                {item.icon}
              </span>
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-gold-200/60 px-3 py-4">
        <button
          onClick={() => signOut({ callbackUrl: '/admin/login' })}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-500 transition-all hover:bg-red-50 hover:text-red-600"
        >
          <span className="text-xs">✕</span>
          Выйти
        </button>
      </div>
    </aside>
  )
}
