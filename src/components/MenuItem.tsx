import { formatPrice } from '@/lib/calculations';
import { MenuItem as MenuItemType } from '@/types';

export default function MenuItem({ item }: { item: MenuItemType }) {
  const lineTotal = item.pricePerUnit * item.quantity;

  return (
    <div className="card-hover group flex gap-3 sm:gap-4 rounded-xl bg-white p-3 shadow-[0_1px_12px_-3px_rgba(0,0,0,0.06)]">
      {/* Thumbnail — show full image, no cropping */}
      <div className="relative h-20 w-24 sm:h-22 sm:w-28 flex-shrink-0 overflow-hidden rounded-lg bg-cream-dark">
        <img
          src={item.image}
          alt={item.name}
          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />
        {/* Weight badge */}
        <div className="absolute bottom-1.5 left-1.5 rounded-full bg-white/90 backdrop-blur-sm px-2 py-0.5 text-[10px] font-medium text-wine-600 shadow-sm">
          {item.weight} {item.weightUnit}
        </div>
      </div>

      {/* Content — flows right */}
      <div className="flex flex-1 flex-col min-w-0">
        <h3 className="font-serif text-sm sm:text-base font-semibold text-wine-700 leading-snug">
          {item.name}
        </h3>

        {item.description && (
          <p className="mt-1 text-xs leading-relaxed text-neutral-400 line-clamp-2">
            {item.description}
          </p>
        )}

        <div className="mt-auto" />

        {/* Price row */}
        <div className="mt-2 flex items-end justify-between border-t border-cream-dark pt-2">
          <span className="text-xs text-neutral-400">
            {formatPrice(item.pricePerUnit)}
            <span className="mx-0.5">×</span>
            {item.quantity} шт
          </span>
          <span className="text-sm sm:text-base font-semibold text-gold-700 tabular-nums">
            {formatPrice(lineTotal)}
          </span>
        </div>
      </div>
    </div>
  );
}
