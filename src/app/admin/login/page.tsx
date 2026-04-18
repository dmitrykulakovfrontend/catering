import { Suspense } from 'react'
import LoginForm from '@/components/admin/LoginForm'

export const metadata = {
  title: 'Вход — Любимый Кейтеринг',
}

export default function LoginPage() {
  return (
    <div className="w-full max-w-sm">
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center gap-2.5 mb-3">
          <div className="h-10 w-10 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center text-white text-lg font-bold leading-none">
            Л
          </div>
        </div>
        <h1 className="font-sans text-3xl font-bold text-white">
          Любимый
        </h1>
        <p className="mt-1 text-sm tracking-widest text-royal-200 uppercase">
          Кейтеринг
        </p>
      </div>

      <div className="rounded-2xl bg-white p-8 shadow-2xl">
        <h2 className="mb-6 text-center text-lg font-semibold text-neutral-900">
          Вход в систему
        </h2>
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  )
}
