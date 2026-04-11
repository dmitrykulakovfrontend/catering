import { MenuStats } from '@/types';
import { formatPrice, formatWeight, formatVolume } from '@/lib/calculations';

const stats = (s: MenuStats) => [
  { label: 'Стоимость меню', value: formatPrice(s.menuCost), accent: false },
  { label: 'Стоимость на человека', value: formatPrice(s.costPerPerson), accent: false },
  { label: 'Еды на человека', value: formatWeight(s.foodPerPerson), accent: false },
  { label: 'Напитков на человека', value: formatVolume(s.drinksPerPerson), accent: false },
  { label: 'Общий вес еды', value: formatWeight(s.totalFoodWeight), accent: false },
  { label: 'Общий объем напитков', value: formatVolume(s.totalDrinkVolume), accent: false },
  { label: 'Стоимость услуг', value: formatPrice(s.servicesCost), accent: false },
  { label: 'Общая сумма', value: formatPrice(s.grandTotal), accent: true },
];

export default function StatsSummary({ stats: s }: { stats: MenuStats }) {
  const items = stats(s);
  const regularItems = items.filter((i) => !i.accent);
  const totalItem = items.find((i) => i.accent)!;

  return (
    <section className="py-12 sm:py-16">
      {/* Section heading */}
      <div className="mb-10 sm:mb-12 flex flex-col items-center text-center">
        <div className="ornament-divider w-full max-w-md mb-6">
          <span className="ornament-diamond" />
        </div>

        <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-wine-700 tracking-tight">
          Расчёт стоимости
        </h2>

        <div className="mt-4 h-0.5 w-12 rounded-full bg-gradient-to-r from-gold-400 to-gold-600" />
      </div>

      <div className="mx-auto max-w-4xl">
        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5">
          {regularItems.map((item) => (
            <div
              key={item.label}
              className="rounded-xl bg-white p-5 sm:p-6 shadow-[0_2px_16px_-4px_rgba(0,0,0,0.05)] border border-cream-dark/80 text-center"
            >
              <p className="text-xs font-medium text-neutral-400 uppercase tracking-wider leading-snug mb-3">
                {item.label}
              </p>
              <p className="font-serif text-xl sm:text-2xl font-bold text-wine-700 tabular-nums">
                {item.value}
              </p>
            </div>
          ))}
        </div>

        {/* Grand total — hero card */}
        <div className="mt-6 sm:mt-8 relative overflow-hidden rounded-2xl bg-gradient-to-br from-wine-700 via-wine-600 to-wine-700 p-8 sm:p-10 text-center shadow-[0_8px_40px_-8px_rgba(90,37,44,0.35)]">
          {/* Decorative gold glow */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              background:
                'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(201,168,76,0.4) 0%, transparent 70%)',
            }}
          />

          {/* Diamond ornaments */}
          <div className="relative z-10 flex flex-col items-center">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-10 bg-gradient-to-r from-transparent to-gold-400/50" />
              <div className="h-2 w-2 rotate-45 bg-gold-400/70" />
              <div className="h-px w-10 bg-gradient-to-l from-transparent to-gold-400/50" />
            </div>

            <p className="text-sm font-medium text-gold-200/70 uppercase tracking-widest mb-3">
              {totalItem.label}
            </p>

            <p className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold text-white tabular-nums tracking-tight">
              {totalItem.value}
            </p>

            <div className="flex items-center gap-3 mt-5">
              <div className="h-px w-10 bg-gradient-to-r from-transparent to-gold-400/50" />
              <div className="h-2 w-2 rotate-45 bg-gold-400/70" />
              <div className="h-px w-10 bg-gradient-to-l from-transparent to-gold-400/50" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
