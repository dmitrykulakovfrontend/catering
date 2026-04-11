import { ServiceItem } from '@/types';
import { formatPrice } from '@/lib/calculations';

export default function ServicesTable({
  services,
  persons,
}: {
  services: ServiceItem[];
  persons: number;
}) {
  let subtotal = 0;
  for (const s of services) {
    subtotal += s.isPerPerson ? s.price * persons : s.price * s.quantity;
  }

  return (
    <section className="py-12 sm:py-16">
      {/* Section heading */}
      <div className="mb-10 sm:mb-12 flex flex-col items-center text-center">
        <div className="ornament-divider w-full max-w-md mb-6">
          <span className="ornament-diamond" />
        </div>

        <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-wine-700 tracking-tight">
          Услуги
        </h2>

        <div className="mt-4 h-0.5 w-12 rounded-full bg-gradient-to-r from-gold-400 to-gold-600" />
      </div>

      {/* Services list */}
      <div className="mx-auto max-w-2xl rounded-2xl bg-white shadow-[0_2px_24px_-6px_rgba(0,0,0,0.06)] overflow-hidden">
        <div className="divide-y divide-cream-dark">
          {services.map((service) => {
            const total = service.isPerPerson
              ? service.price * persons
              : service.price * service.quantity;

            return (
              <div
                key={service.id}
                className="flex items-center justify-between px-6 py-4 sm:px-8 sm:py-5 transition-colors hover:bg-gold-50/40"
              >
                <div className="flex flex-col min-w-0 pr-4">
                  <span className="text-sm font-medium text-neutral-700">
                    {service.name}
                  </span>
                  {service.isPerPerson && (
                    <span className="mt-0.5 text-xs text-gold-600/70">
                      {formatPrice(service.price)} × {persons} персон
                    </span>
                  )}
                </div>

                <span className="flex-shrink-0 text-sm font-semibold text-gold-700 tabular-nums">
                  {formatPrice(total)}
                </span>
              </div>
            );
          })}
        </div>

        {/* Subtotal */}
        <div className="border-t-2 border-gold-200/60 bg-gold-50/50 px-6 py-5 sm:px-8 flex items-center justify-between">
          <span className="font-serif text-base font-semibold text-wine-700">
            Итого за услуги
          </span>
          <span className="font-serif text-lg font-bold text-gold-700 tabular-nums">
            {formatPrice(subtotal)}
          </span>
        </div>
      </div>
    </section>
  );
}
