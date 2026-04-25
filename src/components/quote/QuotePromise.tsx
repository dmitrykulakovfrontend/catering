export default function QuotePromise() {
  return (
    <section
      aria-label="Что мы берём на себя"
      className="relative bg-cream text-neutral-900 px-6 py-12 sm:py-16 lg:py-20"
    >
      <div className="relative max-w-3xl mx-auto text-center">
        <p className="scroll-reveal font-serif text-[1.5rem] sm:text-3xl lg:text-[2.25rem] leading-[1.2] tracking-tight">
          Берём всю организацию на&nbsp;себя&nbsp;&mdash;{" "}
          <span
            className="
              font-serif italic text-royal-700
              bg-[linear-gradient(transparent_78%,var(--color-royal-100)_78%,var(--color-royal-100)_98%,transparent_98%)]
              [box-decoration-break:clone]
              [-webkit-box-decoration-break:clone]
              px-0.5
            "
          >
            чтобы вы могли быть гостем.
          </span>
        </p>

        <div className="ornament-divider mt-6 mb-5">
          <span className="ornament-diamond" />
        </div>

        <p className="scroll-reveal text-sm sm:text-[15px] text-neutral-500 leading-relaxed max-w-xl mx-auto">
          Шеф, сервис, посуда, доставка и сборка&nbsp;&mdash; всё уже включено
          в&nbsp;смету.
        </p>

        <p className="scroll-reveal mt-7 text-[11px] tracking-[0.32em] uppercase text-neutral-400">
          что входит&nbsp;&mdash; ниже&nbsp;&darr;
        </p>
      </div>
    </section>
  );
}
