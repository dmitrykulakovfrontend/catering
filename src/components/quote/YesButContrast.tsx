import Image from "next/image";

type YesButContrastProps = {
  imageBefore?: string;
  imageAfter?: string;
};

export default function YesButContrast({
  imageBefore = "/images/contrast-no.jpg",
  imageAfter = "/images/contrast-yes.jpg",
}: YesButContrastProps) {
  return (
    <section
      aria-label="Почему с нами"
      className="relative bg-neutral-950 text-white"
    >
      <div className="lg:grid lg:grid-cols-[1fr_auto_1fr] lg:items-stretch">
        {/* ─────────────────────────  Panel I — ДА  ───────────────────────── */}
        <article className="relative isolate min-h-[40svh] lg:min-h-[68vh] flex items-center overflow-hidden">
          <Image
            src={imageBefore}
            alt=""
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/35 to-black/65"
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(0,0,0,0.55)_0%,_transparent_55%)]"
          />

          <div className="relative z-10 w-full px-6 sm:px-10 py-8 sm:py-0">
            <div className="max-w-[680px] mx-auto text-center scroll-reveal">
              <p className="font-serif italic font-light text-[5rem] sm:text-[10rem] lg:text-[9rem] xl:text-[11rem] leading-[0.85] tracking-[-0.02em] text-white drop-shadow-[0_8px_40px_rgba(0,0,0,0.7)]">
                да
              </p>
              <p className="mt-4 sm:mt-7 font-serif text-[1rem] sm:text-2xl lg:text-xl xl:text-[1.5rem] text-white/80 leading-snug tracking-tight">
                вы можете организовать банкет&nbsp;сами
              </p>
            </div>
          </div>
        </article>

        {/* ─────────────────────────  Divider — flips orientation at lg  ───────────────────────── */}
        <div
          className="
            relative bg-neutral-950
            flex items-center justify-center gap-3
            py-4 sm:py-7
            lg:flex-col lg:py-0 lg:px-3
          "
        >
          <span className="block h-px w-14 sm:w-28 bg-gradient-to-r from-transparent to-white/30 lg:h-16 lg:w-px lg:bg-gradient-to-b" />
          <span className="relative h-1.5 w-1.5 rotate-45 bg-royal-400/80" />
          <span className="block h-px w-14 sm:w-28 bg-gradient-to-l from-transparent to-white/30 lg:h-16 lg:w-px lg:bg-gradient-to-t" />
        </div>

        {/* ─────────────────────────  Panel II — НО  ───────────────────────── */}
        <article className="relative isolate min-h-[40svh] lg:min-h-[68vh] flex items-center overflow-hidden">
          <Image
            src={imageAfter}
            alt=""
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/30 to-black/70"
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(0,0,0,0.5)_0%,_transparent_60%)]"
          />

          <div className="relative z-10 w-full px-6 sm:px-10 py-8 sm:py-0">
            <div className="max-w-[680px] mx-auto text-center scroll-reveal">
              <p className="font-serif italic font-light text-[5rem] sm:text-[10rem] lg:text-[9rem] xl:text-[11rem] leading-[0.85] tracking-[-0.02em] text-white drop-shadow-[0_8px_40px_rgba(0,0,0,0.7)]">
                но
              </p>
              <p className="mt-4 sm:mt-7 font-serif text-[1rem] sm:text-2xl lg:text-xl xl:text-[1.5rem] text-white/85 leading-snug tracking-tight">
                с нами вы&nbsp;&mdash; гость на своём&nbsp;празднике
              </p>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
