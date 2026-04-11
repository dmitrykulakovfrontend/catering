import { ReactNode } from 'react';

export default function MenuSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="py-8 sm:py-10">
      {/* Section heading with ornamental divider */}
      <div className="mb-5 sm:mb-6 flex flex-col items-center text-center">
        <div className="ornament-divider w-full max-w-sm mb-4">
          <span className="ornament-diamond" />
        </div>

        <h2 className="font-serif text-xl sm:text-2xl font-bold text-wine-700 tracking-tight">
          {title}
        </h2>

        <div className="mt-2.5 h-0.5 w-10 rounded-full bg-gradient-to-r from-gold-400 to-gold-600" />
      </div>

      {/* Items — 1 col mobile, 2 col desktop for horizontal cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
        {children}
      </div>
    </section>
  );
}
