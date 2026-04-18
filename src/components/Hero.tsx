import Image from "next/image";
import { formatPrice } from "@/lib/calculations";
import { ManagerInfo } from "@/types";

export default function Hero({
  eventTitle,
  persons,
  grandTotal,
  manager,
  validUntil,
}: {
  eventTitle: string;
  persons: number;
  grandTotal: number;
  manager: ManagerInfo;
  validUntil: string | null;
}) {
  return (
    <header className="relative">
      <div className="relative h-screen flex">
        <Image
          src="/background-old.webp"
          alt=""
          fill
          priority
          className="object-cover"
        />
        {/* Subtle vignette so the image isn't overly bright */}
        <div className="absolute inset-0 bg-black/10" />

        {/* Glass panel — vertically centered, left-aligned */}
        <div className="relative z-10 self-center m-4 sm:m-6 lg:m-8 w-full sm:w-[400px] lg:w-[440px] animate-fade-up">
          <div className="rounded-2xl bg-neutral-900/60 backdrop-blur-sm p-6 sm:p-8">
            {/* Brand + Manager row */}
            <div className="flex items-start justify-between mb-5">
              <img
                src="/logo-light.png"
                alt="Любимый Кейтеринг"
                className="h-14 sm:h-16 w-auto"
              />
              <div className="text-right hidden sm:block">
                <p className="text-[11px] text-white/50">Менеджер</p>
                <p className="text-sm font-semibold text-white">
                  {manager.name}
                </p>
              </div>
            </div>

            <div className="border-t border-white/[0.06] mb-6" />

            {/* Event title + persons */}
            <h1 className="font-sans text-2xl sm:text-3xl font-bold text-white leading-tight mb-2 animate-fade-up delay-1">
              {eventTitle}
            </h1>
            <p className="flex items-center gap-2 text-sm text-white/60 mb-6 animate-fade-up delay-1">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              {persons} персон
            </p>

            {/* Price block */}
            <div className="animate-fade-up delay-2">
              <p className="text-[11px] font-semibold tracking-widest text-white/50 uppercase mb-2">
                Сумма предложения
              </p>
              <p className="text-3xl sm:text-4xl font-bold text-white tabular-nums tracking-tight leading-none">
                {formatPrice(grandTotal)}
              </p>
              {validUntil && (
                <p className="text-[13px] text-white/50 mt-3">
                  Предложение действительно до{" "}
                  <span className="font-semibold text-white/80">
                    {validUntil}
                  </span>
                </p>
              )}
            </div>

            {/* Bottom CTA */}
            <div className="pt-6 animate-fade-up delay-3">
              <div className="border-t border-white/[0.06] mb-5" />
              <p className="font-sans text-base font-bold text-white mb-3">
                Заказать и обсудить детали
              </p>
              {manager.phone && (
                <a
                  href={`tel:${manager.phone.replace(/\s/g, "")}`}
                  className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  {manager.phone}
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
