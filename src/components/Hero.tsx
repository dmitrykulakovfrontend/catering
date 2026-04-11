import { formatPrice } from '@/lib/calculations';
import { ClientInfo } from '@/types';

export default function Hero({
  eventTitle,
  eventTime,
  persons,
  grandTotal,
  client,
}: {
  eventTitle: string;
  eventTime: string;
  persons: number;
  grandTotal: number;
  client: ClientInfo;
}) {
  const initials = client.name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2);

  return (
    <header className="relative overflow-hidden bg-wine-700 text-white">
      {/* Layered background: radial gold glow */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background:
              'radial-gradient(ellipse 80% 50% at 50% 30%, rgba(201,168,76,0.4) 0%, transparent 70%)',
          }}
        />
        {/* Diamond lattice pattern */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0L60 30L30 60L0 30Z' fill='none' stroke='%23C9A84C' stroke-width='0.5'/%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <div className="relative z-10 flex flex-col items-center px-5 pt-12 pb-14 sm:px-8 sm:pt-16 sm:pb-20 md:pt-20 md:pb-24">
        {/* Top ornament */}
        <div className="animate-fade-up mb-6 flex items-center gap-3">
          <div className="h-px w-10 sm:w-14 bg-gradient-to-r from-transparent to-gold-500/50" />
          <svg width="14" height="14" viewBox="0 0 16 16" className="text-gold-500/80" fill="currentColor">
            <path d="M8 0l2.5 5.5L16 8l-5.5 2.5L8 16l-2.5-5.5L0 8l5.5-2.5z" />
          </svg>
          <div className="h-px w-10 sm:w-14 bg-gradient-to-l from-transparent to-gold-500/50" />
        </div>

        {/* Tagline */}
        <p className="animate-fade-up delay-1 mb-3 text-[10px] sm:text-xs font-medium tracking-[0.3em] uppercase text-gold-300/60">
          Кейтеринг для ваших событий
        </p>

        {/* Brand name */}
        <h1 className="animate-fade-up delay-1 text-shimmer font-serif text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-center leading-[1.1]">
          Любимый
          <span className="block mt-0.5">Кейтеринг</span>
        </h1>

        {/* Gold ornamental divider */}
        <div className="animate-fade-up delay-2 mt-7 mb-8 sm:mt-8 sm:mb-10 flex items-center gap-3">
          <div className="h-px w-12 sm:w-20 bg-gradient-to-r from-transparent to-gold-500/40" />
          <div className="flex gap-1.5">
            <div className="h-1 w-1 rotate-45 bg-gold-500/50" />
            <div className="h-1.5 w-1.5 rotate-45 bg-gold-400/80" />
            <div className="h-1 w-1 rotate-45 bg-gold-500/50" />
          </div>
          <div className="h-px w-12 sm:w-20 bg-gradient-to-l from-transparent to-gold-500/40" />
        </div>

        {/* Event info card — frosted glass panel */}
        <div className="animate-fade-up delay-3 w-full max-w-sm sm:max-w-md">
          <div
            className="relative rounded-2xl border border-gold-500/15 p-6 sm:p-8 text-center overflow-hidden"
            style={{
              background:
                'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(201,168,76,0.04) 50%, rgba(255,255,255,0.03) 100%)',
              backdropFilter: 'blur(12px)',
            }}
          >
            {/* Corner accents */}
            <div className="absolute top-2.5 left-2.5 h-4 w-4 border-t border-l border-gold-500/20 rounded-tl-sm" />
            <div className="absolute top-2.5 right-2.5 h-4 w-4 border-t border-r border-gold-500/20 rounded-tr-sm" />
            <div className="absolute bottom-2.5 left-2.5 h-4 w-4 border-b border-l border-gold-500/20 rounded-bl-sm" />
            <div className="absolute bottom-2.5 right-2.5 h-4 w-4 border-b border-r border-gold-500/20 rounded-br-sm" />

            {/* Client info row */}
            <div className="flex items-center gap-3 justify-center mb-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold-500/20 border border-gold-500/30 text-sm font-semibold text-gold-300 flex-shrink-0">
                {initials}
              </div>
              <div className="text-left min-w-0">
                <p className="text-sm font-medium text-gold-100 truncate">
                  {client.name}
                </p>
                <p className="text-xs text-gold-300/50">
                  {client.phone}
                </p>
              </div>
            </div>

            {/* Thin separator */}
            <div className="mx-auto mb-5 h-px w-full bg-gradient-to-r from-transparent via-gold-500/15 to-transparent" />

            {/* Event title */}
            <h2 className="font-serif text-xl sm:text-2xl font-semibold text-gold-100 leading-snug">
              {eventTitle}
            </h2>

            {/* Persons & time row */}
            <div className="mt-3 flex flex-wrap items-center justify-center gap-x-5 gap-y-1.5 text-sm text-gold-300/60">
              <span className="flex items-center gap-1.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gold-400/50">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
                {persons} персон
              </span>
              <span className="text-gold-500/20">·</span>
              <span className="flex items-center gap-1.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gold-400/50">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v6l4 2" />
                </svg>
                {eventTime}
              </span>
            </div>

            {/* Thin gold line separator */}
            <div className="mx-auto my-5 sm:my-6 h-px w-16 bg-gradient-to-r from-transparent via-gold-500/30 to-transparent" />

            {/* Grand total */}
            <p className="text-[10px] sm:text-xs font-medium tracking-[0.2em] uppercase text-gold-400/50 mb-2">
              Общая сумма
            </p>
            <p className="font-serif text-3xl sm:text-4xl font-bold text-gold-100 tabular-nums tracking-tight">
              {formatPrice(grandTotal)}
            </p>
          </div>

          {/* Created date below the card */}
          <p className="mt-4 text-center text-[10px] sm:text-xs text-gold-300/30">
            Создано {client.createdAt}
          </p>
        </div>
      </div>

      {/* Bottom decorative border */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-500/20 to-transparent" />
    </header>
  );
}
