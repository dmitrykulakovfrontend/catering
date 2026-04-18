import { MenuStats } from "@/types";
import { formatPrice, formatWeight, formatVolume } from "@/lib/calculations";

export default function StatsSummary({
  stats,
  managerPhone,
}: {
  stats: MenuStats;
  managerPhone?: string;
}) {
  const statCards = [
    { label: "Стоимость меню", value: formatPrice(stats.menuCost) },
    { label: "На человека", value: formatPrice(stats.costPerPerson) },
    { label: "Еды на человека", value: formatWeight(stats.foodPerPerson) },
    {
      label: "Напитков на человека",
      value: formatVolume(stats.drinksPerPerson),
    },
    { label: "Общий вес еды", value: formatWeight(stats.totalFoodWeight) },
    {
      label: "Общий объем напитков",
      value: formatVolume(stats.totalDrinkVolume),
    },
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

        {/* Grand total banner — warm espresso with champagne accents */}
        <div
          className="relative rounded-2xl overflow-hidden px-6 py-10 sm:py-12 text-center bg-[#25201c] shadow-[0_24px_60px_-24px_rgba(37,32,28,0.45)]"
        >
          {/* Radial warm highlight — light catching on polished surface */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(130% 95% at 18% 8%, #7a6253 0%, #463830 42%, #25201c 100%)",
            }}
          />
          {/* Soft champagne dot texture */}
          <div
            className="absolute inset-0 opacity-[0.06] mix-blend-overlay"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, #f4e9d6 1px, transparent 0)`,
              backgroundSize: "22px 22px",
            }}
          />
          {/* Hairline top highlight + inset ring */}
          <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-[#d4b896]/50 to-transparent" />
          <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-[#d4b896]/10 pointer-events-none" />

          <div className="relative">
            {/* Top ornament */}
            <div className="flex items-center justify-center gap-3 mb-5">
              <div className="w-12 sm:w-16 h-px bg-[#d4b896]/35" />
              <span className="inline-block w-2 h-2 bg-[#d4b896]/75 rotate-45" />
              <div className="w-12 sm:w-16 h-px bg-[#d4b896]/35" />
            </div>

            <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.3em] text-[#d4b896] mb-3">
              Общая сумма
            </p>
            <p className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#faf4e8] tabular-nums tracking-tight font-serif leading-none">
              {formatPrice(stats.grandTotal)}
            </p>

            {/* Bottom ornament */}
            <div className="flex items-center justify-center gap-3 mt-6">
              <div className="w-12 sm:w-16 h-px bg-[#d4b896]/35" />
              <span className="inline-block w-2 h-2 bg-[#d4b896]/75 rotate-45" />
              <div className="w-12 sm:w-16 h-px bg-[#d4b896]/35" />
            </div>
          </div>
        </div>

        {/* CTA — espresso button, champagne hairlines, restaurant-grade weight */}
        {managerPhone && (
          <a
            href={`tel:${managerPhone.replace(/\s/g, "")}`}
            className="mt-6 group relative flex w-full max-w-sm mx-auto items-center justify-center rounded-xl bg-[#25201c] py-3.5 text-[13px] font-semibold tracking-[0.2em] uppercase text-[#faf4e8] shadow-[0_12px_30px_-12px_rgba(37,32,28,0.5)] ring-1 ring-[#d4b896]/15 hover:bg-[#362d26] active:bg-[#1b1714] transition-colors"
          >
            <span className="inline-flex items-center gap-3">
              <span className="w-5 h-px bg-[#d4b896]/60 transition-all group-hover:w-8" />
              Заказать
              <span className="w-5 h-px bg-[#d4b896]/60 transition-all group-hover:w-8" />
            </span>
          </a>
        )}
      </div>
    </section>
  );
}
