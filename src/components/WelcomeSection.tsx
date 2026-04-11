import { MenuItem as MenuItemType } from '@/types';
import { formatPrice } from '@/lib/calculations';

export default function WelcomeSection({ items }: { items: MenuItemType[] }) {
  const foodItems = items.filter((i) => i.weightUnit === 'г');
  const drinkItems = items.filter((i) => i.weightUnit === 'мл');

  return (
    <section className="py-12 sm:py-16">
      {/* Section heading */}
      <div className="mb-10 sm:mb-12 flex flex-col items-center text-center">
        <div className="ornament-divider w-full max-w-md mb-6">
          <span className="ornament-diamond" />
        </div>

        <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-wine-700 tracking-tight">
          Welcome зона
        </h2>

        <p className="mt-3 text-sm text-neutral-400 max-w-md">
          Встреча гостей с изысканными закусками и освежающими напитками
        </p>

        <div className="mt-4 h-0.5 w-12 rounded-full bg-gradient-to-r from-gold-400 to-gold-600" />
      </div>

      {/* Food items — compact horizontal cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {foodItems.map((item) => {
          const lineTotal = item.pricePerUnit * item.quantity;
          return (
            <div
              key={item.id}
              className="card-hover group flex gap-4 rounded-xl bg-white p-4 shadow-[0_2px_16px_-4px_rgba(0,0,0,0.06)]"
            >
              <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-cream-dark">
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute bottom-1 left-1 rounded-full bg-white/90 backdrop-blur-sm px-2 py-0.5 text-[10px] font-medium text-wine-600 shadow-sm">
                  {item.weight} {item.weightUnit}
                </div>
              </div>

              <div className="flex flex-1 flex-col min-w-0">
                <h3 className="font-serif text-sm font-semibold text-wine-700 leading-snug truncate">
                  {item.name}
                </h3>
                {item.description && (
                  <p className="mt-1 text-xs text-neutral-400 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                )}
                <div className="mt-auto pt-2 border-t border-cream-dark text-xs">
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-neutral-400">
                      {formatPrice(item.pricePerUnit)}
                      <span className="mx-0.5">×</span>
                      {item.quantity} шт</span>
                    <span className="font-semibold text-gold-700 tabular-nums">
                      {formatPrice(lineTotal)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Drinks — distinctive styling */}
      {drinkItems.length > 0 && (
        <div className="mt-10">
          <h3 className="mb-5 text-center font-serif text-lg font-semibold text-wine-600">
            Напитки
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
            {drinkItems.map((item) => {
              const lineTotal = item.pricePerUnit * item.quantity;
              return (
                <div
                  key={item.id}
                  className="card-hover group flex items-center gap-4 rounded-xl bg-gradient-to-br from-gold-50 to-white border border-gold-200/50 p-4"
                >
                  <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-full bg-gold-100/50 border-2 border-gold-200/40">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 rounded-full bg-white/90 backdrop-blur-sm px-1.5 py-0.5 text-[9px] font-medium text-wine-600 shadow-sm whitespace-nowrap">
                      {item.weight} {item.weightUnit}
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col min-w-0">
                    <h4 className="font-serif text-sm font-semibold text-wine-700">
                      {item.name}
                    </h4>
                    <div className="mt-1 flex items-center justify-between text-xs">
                      <span className="text-gold-600/70">
                        {formatPrice(item.pricePerUnit)}
                        <span className="mx-0.5">×</span>
                        {item.quantity} шт</span>
                      <span className="font-semibold text-gold-700 tabular-nums">
                        {formatPrice(lineTotal)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}
