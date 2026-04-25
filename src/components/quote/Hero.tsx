import Image from "next/image";
import { Users, Phone } from "lucide-react";
import { formatPrice } from "@/lib/calculations";
import { formatPhone, phoneTelHref } from "@/lib/phone";
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
      <div className="relative min-h-[100svh] sm:h-screen overflow-hidden">
        <Image
          src="/background-old.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />

        {/* ── Mobile: editorial — image breathes, scrim only at bottom ── */}
        <div className="sm:hidden absolute inset-0 flex flex-col text-white">
          {/* Top: floating logo (no panel) */}
          <div className="flex items-start justify-between px-5 pt-6 animate-fade-up">
            <Image
              src="/logo-light.png"
              alt="Любимый Кейтеринг"
              width={867}
              height={729}
              className="h-12 w-auto drop-shadow-[0_2px_10px_rgba(0,0,0,0.55)]"
            />
          </div>

          <div className="flex-1" />

          {/* Bottom: gradient scrim + content */}
          <div className="relative">
            {/* Soft blur band where the type sits — mask fades it to nothing at the top */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 -top-16 bottom-0 backdrop-blur-[3px]"
              style={{
                WebkitMaskImage:
                  "linear-gradient(to bottom, transparent 0%, black 35%)",
                maskImage:
                  "linear-gradient(to bottom, transparent 0%, black 35%)",
              }}
            />
            {/* Color scrim */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 -top-40 bottom-0 bg-gradient-to-b from-transparent via-black/45 to-black/85"
            />

            <div className="relative px-5 pb-9 pt-8 space-y-5">
              {/* Title + persons */}
              <div className="animate-fade-up delay-1">
                <h1 className="font-serif text-[2rem] leading-[1.05] tracking-tight text-white">
                  {eventTitle}
                </h1>
                <span className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[12px] text-white/90">
                  <Users size={13} strokeWidth={2} />
                  {persons} персон
                </span>
              </div>

              {/* Price */}
              <div className="animate-fade-up delay-2 pt-1">
                <p className="text-[10px] font-medium tracking-[0.22em] uppercase text-amber-200/85 mb-1.5">
                  Сумма предложения
                </p>
                <p className="font-serif text-[2.75rem] leading-none tracking-tight text-white tabular-nums">
                  {formatPrice(grandTotal)}
                </p>
                {validUntil && (
                  <p className="text-[12px] text-white/65 mt-2.5">
                    Действительно до{" "}
                    <span className="text-white/90">{validUntil}</span>
                  </p>
                )}
              </div>

              {/* Hairline */}
              <div className="h-px bg-white/15 animate-fade-up delay-3" />

              {/* CTA */}
              <div className="animate-fade-up delay-3">
                <p className="font-serif text-base text-white/95 mb-1">
                  Заказать и обсудить детали
                </p>
                <p className="text-[12px] text-white/55 mb-3">
                  Менеджер · {manager.name}
                </p>
                {manager.phone && (
                  <a
                    href={phoneTelHref(manager.phone)}
                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-sm text-white hover:bg-white/15 transition-colors"
                  >
                    <Phone size={14} strokeWidth={2} />
                    {formatPhone(manager.phone)}
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── Desktop: refined glass card on the left ── */}
        <div className="hidden sm:flex absolute inset-0 items-center">
          <div aria-hidden className="absolute inset-0 bg-black/10" />

          <div className="relative z-10 m-6 lg:m-10 w-[420px] lg:w-[460px] animate-fade-up">
            <div className="rounded-2xl bg-neutral-950/55 backdrop-blur-md p-8 border border-white/[0.06]">
              {/* Logo + manager */}
              <div className="flex items-start justify-between mb-5">
                <Image
                  src="/logo-light.png"
                  alt="Любимый Кейтеринг"
                  width={867}
                  height={729}
                  className="h-16 w-auto"
                />
                <div className="text-right">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-white/55">
                    Менеджер
                  </p>
                  <p className="text-sm font-medium text-white mt-0.5">
                    {manager.name}
                  </p>
                </div>
              </div>

              <div className="border-t border-white/[0.08] mb-6" />

              <h1 className="font-serif text-3xl lg:text-[2.25rem] leading-[1.05] text-white tracking-tight mb-3 animate-fade-up delay-1">
                {eventTitle}
              </h1>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 border border-white/15 text-[12px] text-white/85 mb-7 animate-fade-up delay-1">
                <Users size={13} strokeWidth={2} />
                {persons} персон
              </span>

              <div className="animate-fade-up delay-2">
                <p className="text-[10px] font-medium tracking-[0.22em] uppercase text-amber-200/85 mb-2">
                  Сумма предложения
                </p>
                <p className="font-serif text-[3rem] lg:text-[3.5rem] leading-none text-white tracking-tight tabular-nums">
                  {formatPrice(grandTotal)}
                </p>
                {validUntil && (
                  <p className="text-[13px] text-white/55 mt-3">
                    Предложение действительно до{" "}
                    <span className="font-medium text-white/85">
                      {validUntil}
                    </span>
                  </p>
                )}
              </div>

              <div className="border-t border-white/[0.08] my-6 animate-fade-up delay-3" />

              <div className="animate-fade-up delay-3">
                <p className="font-serif text-lg text-white mb-3">
                  Заказать и обсудить детали
                </p>
                {manager.phone && (
                  <a
                    href={phoneTelHref(manager.phone)}
                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/10 border border-white/20 text-sm text-white hover:bg-white/15 transition-colors"
                  >
                    <Phone size={14} strokeWidth={2} />
                    {formatPhone(manager.phone)}
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
