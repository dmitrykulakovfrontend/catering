import { Phone, Mail } from "lucide-react";
import { FaTelegram } from "react-icons/fa6";

export default function ContactCta({
  phone,
  phoneHref,
  className = "bg-linear-to-b from-white to-cream-dark/40",
}: {
  phone: string;
  phoneHref: string;
  className?: string;
}) {
  return (
    <section id="contact" className={`py-20 sm:py-28 ${className}`}>
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-xs font-semibold tracking-[0.25em] uppercase text-royal-500 mb-3">
          Готовы обсудить ваше событие?
        </p>
        <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-neutral-900 leading-tight tracking-tight mb-5">
          Расскажите о мероприятии — пришлём смету в течение часа
        </h2>
        <p className="text-base text-neutral-500 leading-relaxed mb-10 max-w-xl mx-auto">
          Звоните или оставьте заявку — менеджер свяжется с вами и подготовит
          индивидуальное предложение под ваш бюджет.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
          <a
            href={phoneHref}
            className="card-surface inline-flex flex-col items-center gap-3 px-6 py-7"
          >
            <div className="h-12 w-12 rounded-full bg-royal-50 flex items-center justify-center">
              <Phone size={20} strokeWidth={2} className="text-royal-500" />
            </div>
            <span className="text-[15px] font-semibold text-royal-500 tabular-nums whitespace-nowrap">
              {phone}
            </span>
            <span className="text-[11px] text-neutral-400 uppercase tracking-wider">
              Звоните
            </span>
          </a>

          <a
            href="https://t.me/lovely_catering"
            target="_blank"
            rel="noopener noreferrer"
            className="card-surface inline-flex flex-col items-center gap-3 px-6 py-7"
          >
            <div className="h-12 w-12 rounded-full bg-royal-50 flex items-center justify-center">
              <FaTelegram size={22} className="text-royal-500" />
            </div>
            <span className="text-base font-semibold text-royal-500">
              Telegram
            </span>
            <span className="text-[11px] text-neutral-400 uppercase tracking-wider">
              @lovely_catering
            </span>
          </a>

          <a
            href="mailto:lovely-catering@bk.ru"
            className="card-surface inline-flex flex-col items-center gap-3 px-6 py-7"
          >
            <div className="h-12 w-12 rounded-full bg-royal-50 flex items-center justify-center">
              <Mail size={20} strokeWidth={2} className="text-royal-500" />
            </div>
            <span className="text-base font-semibold text-royal-500">
              E-mail
            </span>
            <span className="text-[11px] text-neutral-400 uppercase tracking-wider">
              lovely-catering@bk.ru
            </span>
          </a>
        </div>

        <p className="text-sm text-neutral-400 mt-8">
          г. Москва, пр-д Донелайтиса, 26 · Ежедневно с 9:00 до 22:00
        </p>
      </div>
    </section>
  );
}
