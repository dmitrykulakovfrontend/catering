import Link from 'next/link'
import { getAllQuotes } from '@/lib/queries'
import QuoteList from '@/components/admin/QuoteList'

export default async function AdminDashboard() {
  const quotes = await getAllQuotes()

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-gray-900">
            Панель управления
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {quotes.length}{' '}
            {quotes.length === 1
              ? 'банкет'
              : quotes.length < 5
                ? 'банкета'
                : 'банкетов'}
          </p>
        </div>
        <Link
          href="/admin/quotes/new"
          className="rounded-lg bg-wine-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-wine-600"
        >
          Новый банкет
        </Link>
      </div>

      <QuoteList quotes={quotes} />
    </div>
  )
}
