import { ServiceItem } from '@/types';
import { formatPrice } from '@/lib/calculations';

export default function ServicesTable({
  services,
  persons,
}: {
  services: ServiceItem[];
  persons: number;
}) {
  if (services.length === 0) return null;

  let subtotal = 0;
  for (const s of services) {
    subtotal += s.isPerPerson ? s.price * persons : s.price * s.quantity;
  }

  return (
    <section className="mb-16 sm:mb-20">
      {/* Ornamental divider */}
      <div className="ornament-divider mb-5">
        <span className="ornament-diamond" />
      </div>

      {/* Title */}
      <div className="text-center mb-8 sm:mb-10">
        <h2 className="font-serif text-[28px] sm:text-4xl font-bold text-neutral-900 tracking-tight leading-none">
          Услуги
        </h2>
        <div className="mx-auto mt-3 w-8 h-[2px] bg-royal-500 rounded-full" />
      </div>

      {/* Service card */}
      <div className="mx-auto max-w-2xl card-surface overflow-hidden">
        {/* Rows */}
        <div className="divide-y divide-neutral-100">
          {services.map((service) => {
            const total = service.isPerPerson
              ? service.price * persons
              : service.price * service.quantity;

            return (
              <div
                key={service.id}
                className="flex items-center justify-between px-5 sm:px-7 py-4 sm:py-5"
              >
                <div className="min-w-0 pr-4">
                  <p className="font-medium text-neutral-900 text-sm sm:text-[15px]">
                    {service.name}
                  </p>
                  {service.isPerPerson && (
                    <p className="text-xs text-neutral-400 mt-0.5 tabular-nums">
                      {formatPrice(service.price)} &times; {persons}&nbsp;персон
                    </p>
                  )}
                </div>
                <span className="text-base sm:text-lg font-bold text-neutral-900 tabular-nums whitespace-nowrap">
                  {formatPrice(total)}
                </span>
              </div>
            );
          })}
        </div>

        {/* Total strip */}
        <div className="bg-royal-50/60 border-t border-royal-100/50 flex items-center justify-between px-5 sm:px-7 py-4 sm:py-5">
          <span className="font-semibold text-neutral-900 text-sm sm:text-[15px]">
            Итого за услуги
          </span>
          <span className="text-lg sm:text-xl font-bold text-neutral-900 tabular-nums tracking-tight">
            {formatPrice(subtotal)}
          </span>
        </div>
      </div>
    </section>
  );
}
