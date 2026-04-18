import { MenuItem as MenuItemType } from '@/types';
import { formatPrice } from '@/lib/calculations';

export default function WelcomeSection({ items }: { items: MenuItemType[] }) {
  if (items.length === 0) return null;

  const food = items.filter((i) => i.weightUnit !== 'мл');
  const drinks = items.filter((i) => i.weightUnit === 'мл');

  return (
    <section className="mb-16 sm:mb-20">
      {/* Ornamental divider */}
      <div className="ornament-divider mb-5">
        <span className="ornament-diamond" />
      </div>

      {/* Title */}
      <div className="text-center mb-8 sm:mb-10">
        <h2 className="font-serif text-[28px] sm:text-4xl font-bold text-neutral-900 tracking-tight leading-none">
          Welcome зона
        </h2>
        <div className="mx-auto mt-3 w-8 h-[2px] bg-royal-500 rounded-full" />
      </div>

      {/* Food — 3-column grid */}
      {food.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {food.map((item) => {
            const total = item.pricePerUnit * item.quantity;
            return (
              <div key={item.id} className="card-surface flex gap-3 p-3.5 sm:p-4">
                <div className="relative flex-shrink-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-[80px] w-[80px] sm:h-[88px] sm:w-[88px] rounded-lg object-cover bg-neutral-100"
                  />
                  <span className="absolute bottom-1.5 left-1.5 bg-royal-600/90 backdrop-blur-sm text-white text-[10px] font-semibold px-1.5 py-[3px] rounded-md leading-none">
                    {item.weight}&nbsp;{item.weightUnit}
                  </span>
                </div>
                <div className="flex-1 min-w-0 flex flex-col">
                  <h3
                    className="font-bold text-neutral-900 text-sm leading-snug line-clamp-2"
                    title={item.name}
                  >
                    {item.name}
                  </h3>
                  {item.description && (
                    <p
                      className="text-xs text-neutral-400 mt-0.5 leading-relaxed line-clamp-2"
                      title={item.description}
                    >
                      {item.description}
                    </p>
                  )}
                  <div className="mt-auto pt-1.5 flex items-baseline justify-between gap-2">
                    <span className="text-xs text-neutral-400 tabular-nums">
                      {formatPrice(item.pricePerUnit)} &times; {item.quantity}&nbsp;шт
                    </span>
                    <span className="text-base font-bold text-neutral-900 tabular-nums">
                      {formatPrice(total)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Drinks — compact rounded cards, 2-column */}
      {drinks.length > 0 && (
        <div className="mt-10">
          <h3 className="text-center font-serif text-xl sm:text-2xl font-bold text-neutral-900 mb-6">
            Напитки
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 max-w-3xl mx-auto">
            {drinks.map((item) => {
              const total = item.pricePerUnit * item.quantity;
              return (
                <div key={item.id} className="flex items-center gap-3 rounded-full bg-white border border-neutral-100 shadow-[0_1px_3px_rgba(0,0,0,0.03)] pl-1.5 pr-5 py-1.5">
                  <div className="relative flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-16 w-16 rounded-full object-cover bg-neutral-100"
                    />
                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-royal-600/90 backdrop-blur-sm text-white text-[9px] font-semibold px-1.5 py-[2px] rounded-full leading-none whitespace-nowrap">
                      {item.weight}&nbsp;{item.weightUnit}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4
                      className="font-bold text-neutral-900 text-sm leading-snug"
                      title={item.name}
                    >
                      {item.name}
                    </h4>
                    <div className="flex items-baseline justify-between gap-2 mt-0.5">
                      <span className="text-xs text-neutral-400 tabular-nums">
                        {formatPrice(item.pricePerUnit)} &times; {item.quantity}&nbsp;шт
                      </span>
                      <span className="text-base font-bold text-neutral-900 tabular-nums">
                        {formatPrice(total)}
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
