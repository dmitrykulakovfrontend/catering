import Image from "next/image";
import { Phone, ArrowRight } from "lucide-react";
import Link from "next/link";

const stats = [
  { value: "500+", label: "мероприятий" },
  { value: "10 лет", label: "на рынке" },
  { value: "600+", label: "блюд в каталоге" },
  { value: "50 000+", label: "довольных гостей" },
];

export default function LandingHero({
  phone,
  phoneHref,
}: {
  phone: string;
  phoneHref: string;
}) {
  return (
    <section className="relative min-h-screen flex flex-col">
      <Image
        src="/background.jpeg"
        alt=""
        fill
        priority
        className="object-cover"
      />
      <div className="absolute inset-0 bg-linear-to-r from-neutral-900/85 via-neutral-900/55 to-neutral-900/15" />
      <div className="absolute inset-0 bg-linear-to-t from-neutral-900/60 to-transparent" />

      <header className="relative z-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between">
          <Link href="/" className="block">
            <Image
              src="/logo-light.png"
              alt="Любимый Кейтеринг"
              width={867}
              height={729}
              className="h-24 w-auto"
            />
          </Link>
          <a
            href={phoneHref}
            className="hidden sm:inline-flex items-center gap-2 text-sm font-medium text-white/85 hover:text-white transition-colors tabular-nums"
          >
            <Phone size={16} strokeWidth={2} />
            {phone}
          </a>
        </div>
      </header>

      <div className="relative z-10 flex-1 flex items-center">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full py-16 sm:py-20">
          <div className="max-w-2xl">
            <p className="animate-fade-up text-xs sm:text-sm font-semibold tracking-[0.25em] uppercase text-royal-200 mb-5">
              Кейтеринг в Москве · 10 лет опыта
            </p>
            <h1 className="animate-fade-up delay-1 font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.05] tracking-tight mb-6">
              Любимый кейтеринг <br className="hidden sm:block" /> для вас и
              вашей компании
            </h1>
            <p className="animate-fade-up delay-2 text-base sm:text-lg text-white/75 leading-relaxed mb-9 max-w-xl">
              Европейское качество, авторское меню и сервис под ключ —
              превращаем мероприятия в незабываемые гастрономические
              впечатления. Свадьбы, банкеты, фуршеты и корпоративы от 20 персон.
            </p>
            <div className="animate-fade-up delay-3 flex flex-wrap gap-3">
              <a
                href="#contact"
                className="inline-flex items-center gap-2 rounded-xl bg-royal-500 px-7 py-3.5 text-base font-semibold text-white hover:bg-royal-600 transition-colors shadow-lg shadow-royal-500/30"
              >
                Получить расчёт
                <ArrowRight size={16} strokeWidth={2.5} />
              </a>
              <a
                href={phoneHref}
                className="inline-flex items-center gap-2 rounded-xl border border-white/25 bg-white/5 backdrop-blur-sm px-7 py-3.5 text-base font-semibold text-white hover:bg-white/15 transition-colors"
              >
                Позвонить
              </a>
            </div>
          </div>

          <div className="animate-fade-up delay-5 mt-14 sm:mt-20 grid grid-cols-2 sm:grid-cols-4 gap-px bg-white/10 max-w-3xl rounded-2xl overflow-hidden backdrop-blur-sm">
            {stats.map((s) => (
              <div
                key={s.label}
                className="bg-neutral-900/40 px-5 py-5 text-center"
              >
                <p className="font-serif text-2xl sm:text-3xl font-bold text-white tabular-nums leading-none">
                  {s.value}
                </p>
                <p className="text-[11px] sm:text-xs text-white/55 mt-2 uppercase tracking-wider">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
