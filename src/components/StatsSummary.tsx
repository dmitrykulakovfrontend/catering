import { MenuStats } from '@/types';
import { formatPrice, formatWeight, formatVolume } from '@/lib/calculations';

export default function StatsSummary({
  stats,
  managerPhone,
}: {
  stats: MenuStats;
  managerPhone?: string;
}) {
  const statCards = [
    { label: 'Стоимость меню', value: formatPrice(stats.menuCost) },
    { label: 'На человека', value: formatPrice(stats.costPerPerson) },
    { label: 'Еды на человека', value: formatWeight(stats.foodPerPerson) },
    { label: 'Напитков на человека', value: formatVolume(stats.drinksPerPerson) },
    { label: 'Общий вес еды', value: formatWeight(stats.totalFoodWeight) },
    { label: 'Общий объем напитков', value: formatVolume(stats.totalDrinkVolume) },
  ];

  return (
    <section className="py-12 sm:py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        {/* Ornamental divider */}
        <div className="ornament-divider mb-5">
          <span className="ornament-diamond" />
        </div>

        {/* Title */}
        <div className="text-center mb-8 sm:mb-10">
          <h2 className="font-serif text-[28px] sm:text-4xl font-bold text-neutral-900 tracking-tight leading-none">
            Расчёт стоимости
          </h2>
          <div className="mx-auto mt-3 w-8 h-[2px] bg-royal-500 rounded-full" />
        </div>

        {/* Stat cards grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mb-4">
          {statCards.map((card) => (
            <div
              key={card.label}
              className="card-surface relative px-4 py-5 sm:px-5 sm:py-6 text-center overflow-hidden"
            >
              {/* Top accent line */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-royal-500/40 to-transparent" />
              <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.1em] text-neutral-400 mb-2">
                {card.label}
              </p>
              <p className="text-xl sm:text-2xl font-bold text-neutral-900 tabular-nums tracking-tight">
                {card.value}
              </p>
            </div>
          ))}
        </div>

        {/* Services cost card */}
        <div className="flex justify-center mb-8 sm:mb-10">
          <div className="card-surface relative px-10 sm:px-14 py-5 sm:py-6 text-center overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-royal-500/40 to-transparent" />
            <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.1em] text-neutral-400 mb-2">
              Стоимость услуг
            </p>
            <p className="text-xl sm:text-2xl font-bold text-neutral-900 tabular-nums tracking-tight">
              {formatPrice(stats.servicesCost)}
            </p>
          </div>
        </div>

        {/* Grand total banner */}
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-royal-800 via-royal-700 to-royal-600 px-6 py-10 sm:py-12 text-center">
          {/* Subtle pattern overlay */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
              backgroundSize: '24px 24px',
            }}
          />

          <div className="relative">
            {/* Top ornament */}
            <div className="flex items-center justify-center gap-3 mb-5">
              <div className="w-12 sm:w-16 h-px bg-white/25" />
              <span className="inline-block w-2 h-2 bg-white/60 rotate-45" />
              <div className="w-12 sm:w-16 h-px bg-white/25" />
            </div>

            <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.25em] text-royal-200/70 mb-3">
              Общая сумма
            </p>
            <p className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tabular-nums tracking-tight font-serif leading-none">
              {formatPrice(stats.grandTotal)}
            </p>

            {/* Bottom ornament */}
            <div className="flex items-center justify-center gap-3 mt-6">
              <div className="w-12 sm:w-16 h-px bg-white/25" />
              <span className="inline-block w-2 h-2 bg-white/60 rotate-45" />
              <div className="w-12 sm:w-16 h-px bg-white/25" />
            </div>
          </div>
        </div>

        {/* CTA */}
        {managerPhone && (
          <a
            href={`tel:${managerPhone.replace(/\s/g, '')}`}
            className="mt-6 block w-full max-w-sm mx-auto rounded-xl bg-royal-500 py-3.5 text-center text-[15px] font-semibold text-white hover:bg-royal-600 active:bg-royal-700 transition-colors"
          >
            Заказать
          </a>
        )}
      </div>
    </section>
  );
}
