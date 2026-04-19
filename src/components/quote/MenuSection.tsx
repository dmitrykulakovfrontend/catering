import { ReactNode } from 'react';

export default function MenuSection({
  title,
  children,
}: {
  title: string;
  categoryTotal?: number;
  children: ReactNode;
}) {
  return (
    <section className="mb-16 sm:mb-20">
      {/* Ornamental divider */}
      <div className="ornament-divider mb-5">
        <span className="ornament-diamond" />
      </div>

      {/* Category title */}
      <div className="text-center mb-8 sm:mb-10">
        <h2 className="font-serif text-[28px] sm:text-4xl font-bold text-neutral-900 tracking-tight leading-none">
          {title}
        </h2>
        <div className="mx-auto mt-3 w-8 h-[2px] bg-royal-500 rounded-full" />
      </div>

      {/* 2-column card grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
        {children}
      </div>
    </section>
  );
}
