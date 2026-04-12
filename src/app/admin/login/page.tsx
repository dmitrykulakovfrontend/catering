import { Suspense } from 'react'
import LoginForm from '@/components/admin/LoginForm'

export const metadata = {
  title: 'Вход — Любимый Кейтеринг',
}

export default function LoginPage() {
  return (
    <div className="w-full max-w-sm">
      <div className="mb-8 text-center">
        <h1 className="font-serif text-3xl font-bold text-white">
          Любимый
        </h1>
        <p className="mt-1 text-sm tracking-widest text-gold-300 uppercase">
          Кейтеринг
        </p>
      </div>

      <div className="rounded-2xl bg-white p-8 shadow-2xl">
        <h2 className="mb-6 text-center text-lg font-semibold text-gray-900">
          Вход в систему
        </h2>
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  )
}
