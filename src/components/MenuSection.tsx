import { ReactNode } from 'react';

export default function MenuSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="py-12 sm:py-16">
      {/* Section heading with ornamental divider */}
      <div className="mb-10 sm:mb-12 flex flex-col items-center text-center">
        <div className="ornament-divider w-full max-w-md mb-6">
          <span className="ornament-diamond" />
        </div>

        <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-wine-700 tracking-tight">
          {title}
        </h2>

        <div className="mt-4 h-0.5 w-12 rounded-full bg-gradient-to-r from-gold-400 to-gold-600" />
      </div>

      {/* Items grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {children}
      </div>
    </section>
  );
}
