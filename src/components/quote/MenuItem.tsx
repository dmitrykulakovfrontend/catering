import Image from 'next/image';
import { formatPrice } from '@/lib/calculations';
import { MenuItem as MenuItemType } from '@/types';

export default function MenuItem({ item }: { item: MenuItemType }) {
  const total = item.pricePerUnit * item.quantity;

  return (
    <div className="card-surface flex gap-4 p-3.5 sm:p-4">
      {/* Image with weight badge */}
      <div className="relative flex-shrink-0 h-[88px] w-[88px] sm:h-[100px] sm:w-[100px]">
        <Image
          src={item.image}
          alt={item.name}
          fill
          sizes="100px"
          className="rounded-lg object-cover bg-neutral-100"
        />
        <span className="absolute bottom-1.5 left-1.5 bg-royal-600/90 backdrop-blur-sm text-white text-[10px] font-semibold px-2 py-[3px] rounded-md leading-none">
          {item.weight}&nbsp;{item.weightUnit}
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 flex flex-col">
        <h3
          className="font-bold text-neutral-900 text-sm sm:text-[15px] leading-snug"
          title={item.name}
        >
          {item.name}
        </h3>
        {item.description && (
          <p
            className="text-xs sm:text-[13px] text-neutral-400 mt-0.5 leading-relaxed line-clamp-2"
            title={item.description}
          >
            {item.description}
          </p>
        )}

        {/* Price row */}
        <div className="mt-auto pt-1.5 flex items-baseline justify-between gap-3">
          <span className="text-xs text-neutral-400 tabular-nums">
            {formatPrice(item.pricePerUnit)} &times; {item.quantity}&nbsp;шт
          </span>
          <span className="text-base sm:text-lg font-bold text-neutral-900 tabular-nums">
            {formatPrice(total)}
          </span>
        </div>
      </div>
    </div>
  );
}
