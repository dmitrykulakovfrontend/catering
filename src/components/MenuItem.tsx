import { formatPrice } from '@/lib/calculations';
import { MenuItem as MenuItemType } from '@/types';

export default function MenuItem({ item }: { item: MenuItemType }) {
  const lineTotal = item.pricePerUnit * item.quantity;

  return (
    <div className="card-hover group relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-[0_2px_20px_-4px_rgba(0,0,0,0.06)]">
      {/* Image */}
      <div className="relative aspect-[16/10] overflow-hidden bg-cream-dark">
        <img
          src={item.image}
          alt={item.name}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        {/* Subtle gradient overlay at bottom for text readability */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/20 to-transparent" />

        {/* Weight badge */}
        <div className="absolute bottom-3 left-3 rounded-full bg-white/90 backdrop-blur-sm px-3 py-1 text-xs font-medium text-wine-600 shadow-sm">
          {item.weight} {item.weightUnit}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <h3 className="font-serif text-lg font-semibold text-wine-700 leading-snug">
          {item.name}
        </h3>

        {item.description && (
          <p className="mt-2 text-sm leading-relaxed text-neutral-500 line-clamp-3">
            {item.description}
          </p>
        )}

        {/* Spacer */}
        <div className="mt-auto" />

        {/* Price row */}
        <div className="mt-4 flex items-end justify-between border-t border-cream-dark pt-4">
          <div className="text-xs text-neutral-400">
            <span>{formatPrice(item.pricePerUnit)}</span>
            <span className="mx-1">×</span>
            <span>{item.quantity} шт</span>
          </div>
          <div className="text-base font-semibold text-gold-700 tabular-nums">
            {formatPrice(lineTotal)}
          </div>
        </div>
      </div>
    </div>
  );
}
