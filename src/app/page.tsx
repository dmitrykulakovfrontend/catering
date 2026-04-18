import Image from "next/image";
import { getSiteSetting } from "@/lib/queries";

const DEFAULT_PHONE = "7(964)7611900";

const stats = [
  { value: "500+", label: "мероприятий" },
  { value: "10 лет", label: "на рынке" },
  { value: "600+", label: "блюд в каталоге" },
  { value: "50 000+", label: "довольных гостей" },
];

const features = [
  {
    title: "Авторское меню",
    description:
      "Сезонные продукты, современные тренды и классика — создаём гастрономические эмоции под формат вашего события.",
    icon: (
      <>
        <path d="M6 13.5V21h12v-7.5" />
        <path d="M9 13.5a3 3 0 1 1-3-3 4 4 0 0 1 3-6 4 4 0 0 1 6 0 4 4 0 0 1 3 6 3 3 0 1 1-3 3" />
      </>
    ),
  },
  {
    title: "Полный цикл",
    description:
      "Разработка концепции, логистика, декор, музыкальное сопровождение — берём на себя всё от идеи до реализации.",
    icon: (
      <>
        <path d="M3 9.5 12 4l9 5.5" />
        <path d="M5 10v9a1 1 0 0 0 1 1h3v-6h6v6h3a1 1 0 0 0 1-1v-9" />
      </>
    ),
  },
  {
    title: "Шоу-станции",
    description:
      "Шоколадные фонтаны, сырные борды, живой гриль — интерактивные станции, которые делают событие незабываемым.",
    icon: (
      <path d="M12 2a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7zm0 9a2 2 0 1 1 0-4 2 2 0 0 1 0 4z" />
    ),
  },
  {
    title: "Эко-подход",
    description:
      "Авторские коктейли под ваше событие, экологичные материалы и осознанный подход к каждой детали.",
    icon: (
      <>
        <rect x="4" y="3" width="16" height="18" rx="2" />
        <path d="M8 8h8M8 12h8M8 16h5" />
      </>
    ),
  },
];

const services = [
  {
    title: "Банкет",
    description: "Классический формат с рассадкой гостей и подачей блюд по меню. От 4 000 ₽/чел., от 20 персон.",
    image: "/images/service-banquet.jpg",
  },
  {
    title: "Фуршет",
    description: "Свободная рассадка — гости выбирают блюда с общих столов. От 2 000 ₽/чел., от 20 персон.",
    image: "/images/service-buffet.jpeg",
  },
  {
    title: "Кофе-брейк",
    description: "Горячие напитки, свежая выпечка и лёгкие закуски для конференций и деловых встреч. От 2 300 ₽/чел.",
    image: "/images/service-coffeebreak.webp",
  },
  {
    title: "Свадьбы",
    description: "Изысканное авторское меню и элегантная сервировка для самого важного дня. Полный цикл организации.",
    image: "/images/hero-carousel-1.webp",
  },
  {
    title: "Кенди-бар и шоу-станции",
    description: "Шоколадные фонтаны, сырные борды, живой гриль — интерактивные станции для особого впечатления.",
    image: "/images/hero-carousel-2.webp",
  },
  {
    title: "BBQ и выездной гриль",
    description: "Блюда на гриле прямо на вашей площадке — идеально для тимбилдингов и загородных мероприятий.",
    image: "/images/hero-carousel-3.webp",
  },
];

const team = [
  { name: "Людмила", role: "Директор по развитию", image: "/images/team-ludmila.webp" },
  { name: "Валерия", role: "Менеджер", image: "/images/team-valeria.webp" },
  { name: "Ольга", role: "Старший менеджер по продажам", image: "/images/team-olga.webp" },
  { name: "Дарья", role: "Менеджер по рекламе", image: "/images/team-daria.webp" },
];

const dishes = [
  { src: "/images/salat-cezar.png", name: "Салат Цезарь", tag: "Салаты" },
  { src: "/images/befstroganov.png", name: "Бефстроганов", tag: "Горячее" },
  { src: "/images/kanape-grecheskoe.png", name: "Канапе Греческое", tag: "Канапе" },
  { src: "/images/myasnoe-assorti.png", name: "Мясное ассорти", tag: "Холодные" },
  { src: "/images/svinaya-korejka.png", name: "Свиная корейка", tag: "Мясное" },
  { src: "/images/fruktovoe-assorti.png", name: "Фруктовое ассорти", tag: "Десерты" },
  { src: "/images/ovoshchi-na-grile.png", name: "Овощи на гриле", tag: "Гриль" },
  { src: "/images/tartaletka-s-utkoj.png", name: "Тарталетка с уткой", tag: "Закуски" },
];

const steps = [
  {
    n: "01",
    title: "Заявка",
    description: "Расскажите о формате, дате, числе гостей и бюджете.",
  },
  {
    n: "02",
    title: "Индивидуальное меню",
    description: "Готовим персональное предложение в течение часа.",
  },
  {
    n: "03",
    title: "Согласование",
    description: "Корректируем блюда и услуги, фиксируем стоимость.",
  },
  {
    n: "04",
    title: "Праздник",
    description: "Привозим, сервируем, обслуживаем — вы только наслаждаетесь.",
  },
];

export default async function Home() {
  const PHONE = (await getSiteSetting("phone")) || DEFAULT_PHONE;
  const PHONE_HREF = `tel:${PHONE.replace(/[^\d+]/g, "")}`;

  return (
    <main>
      {/* ─── HERO ─── */}
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

        {/* Top bar */}
        <header className="relative z-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between">
            <img
              src="/logo-light.png"
              alt="Любимый Кейтеринг"
              className="h-10 sm:h-12 w-auto"
            />
            <a
              href={PHONE_HREF}
              className="hidden sm:inline-flex items-center gap-2 text-sm font-medium text-white/85 hover:text-white transition-colors tabular-nums"
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
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              {PHONE}
            </a>
          </div>
        </header>

        {/* Hero content */}
        <div className="relative z-10 flex-1 flex items-center">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full py-16 sm:py-20">
            <div className="max-w-2xl">
              <p className="animate-fade-up text-xs sm:text-sm font-semibold tracking-[0.25em] uppercase text-royal-200 mb-5">
                Кейтеринг в Москве · 10 лет опыта
              </p>
              <h1 className="animate-fade-up delay-1 font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.05] tracking-tight mb-6">
                Любимый кейтеринг <br className="hidden sm:block" /> для вас и вашей компании
              </h1>
              <p className="animate-fade-up delay-2 text-base sm:text-lg text-white/75 leading-relaxed mb-9 max-w-xl">
                Европейское качество, авторское меню и сервис под ключ — превращаем
                мероприятия в незабываемые гастрономические впечатления. Свадьбы,
                банкеты, фуршеты и корпоративы от 20 персон.
              </p>
              <div className="animate-fade-up delay-3 flex flex-wrap gap-3">
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 rounded-xl bg-royal-500 px-7 py-3.5 text-base font-semibold text-white hover:bg-royal-600 transition-colors shadow-lg shadow-royal-500/30"
                >
                  Получить расчёт
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14M13 5l7 7-7 7" />
                  </svg>
                </a>
                <a
                  href={PHONE_HREF}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/25 bg-white/5 backdrop-blur-sm px-7 py-3.5 text-base font-semibold text-white hover:bg-white/15 transition-colors"
                >
                  Позвонить
                </a>
              </div>
            </div>

            {/* Stats strip */}
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

      {/* ─── WHY US ─── */}
      <section className="py-20 sm:py-28 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-14">
            <p className="text-xs font-semibold tracking-[0.25em] uppercase text-royal-500 mb-3">
              Почему выбирают нас
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-neutral-900 leading-tight tracking-tight">
              Внимание к каждой детали — от закупки до уборки
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((f) => (
              <div key={f.title} className="card-surface p-7">
                <div className="h-12 w-12 rounded-xl bg-royal-50 flex items-center justify-center mb-5 text-royal-500">
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    {f.icon}
                  </svg>
                </div>
                <h3 className="font-serif text-lg font-bold text-neutral-900 mb-2">
                  {f.title}
                </h3>
                <p className="text-sm text-neutral-500 leading-relaxed">
                  {f.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SERVICES ─── */}
      <section className="py-20 sm:py-28 bg-cream-dark/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-14">
            <div className="max-w-xl">
              <p className="text-xs font-semibold tracking-[0.25em] uppercase text-royal-500 mb-3">
                Что мы организуем
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-neutral-900 leading-tight tracking-tight">
                Любой формат, любой масштаб
              </h2>
            </div>
            <p className="text-sm text-neutral-500 max-w-sm sm:text-right leading-relaxed">
              Подбираем меню и формат подачи под цели события — от камерного ужина
              до многотысячного открытия.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.map((s) => (
              <article
                key={s.title}
                className="group relative overflow-hidden rounded-2xl bg-white border border-neutral-200/70 hover:shadow-lg transition-shadow"
              >
                <div className="relative h-56 overflow-hidden bg-neutral-100">
                  <img
                    src={s.image}
                    alt={s.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-neutral-900/40 to-transparent" />
                </div>
                <div className="p-6">
                  <h3 className="font-serif text-xl font-bold text-neutral-900 mb-2">
                    {s.title}
                  </h3>
                  <p className="text-sm text-neutral-500 leading-relaxed">
                    {s.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ─── DISHES GALLERY ─── */}
      <section className="py-20 sm:py-28 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-14">
            <p className="text-xs font-semibold tracking-[0.25em] uppercase text-royal-500 mb-3">
              Наша кухня
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-neutral-900 leading-tight tracking-tight">
              Более 600 блюд в каталоге
            </h2>
            <p className="text-base text-neutral-500 leading-relaxed mt-5">
              Классика и авторские позиции, сезонные специалитеты и постные опции —
              собираем меню под ваш вкус и формат события.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
            {dishes.map((d) => (
              <figure
                key={d.src}
                className="group overflow-hidden rounded-2xl bg-neutral-100"
              >
                <div className="relative aspect-[206/80] overflow-hidden">
                  <img
                    src={d.src}
                    alt={d.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <figcaption className="px-4 py-3">
                  <p className="text-[10px] font-semibold tracking-widest uppercase text-royal-500 mb-0.5">
                    {d.tag}
                  </p>
                  <p className="text-sm font-semibold text-neutral-900 leading-tight">
                    {d.name}
                  </p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PROCESS ─── */}
      <section className="py-20 sm:py-28 bg-neutral-900 text-white relative overflow-hidden">
        <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-royal-500/20 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-royal-700/20 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-14">
            <p className="text-xs font-semibold tracking-[0.25em] uppercase text-royal-300 mb-3">
              Как мы работаем
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight tracking-tight">
              От заявки до праздника — четыре шага
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/10 rounded-2xl overflow-hidden">
            {steps.map((s) => (
              <div
                key={s.n}
                className="bg-neutral-900 p-7 sm:p-8 hover:bg-neutral-900/60 transition-colors"
              >
                <p className="font-serif text-5xl font-bold text-royal-400/60 tabular-nums mb-5 leading-none">
                  {s.n}
                </p>
                <h3 className="font-serif text-xl font-bold text-white mb-2">
                  {s.title}
                </h3>
                <p className="text-sm text-white/55 leading-relaxed">
                  {s.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TEAM ─── */}
      <section className="py-20 sm:py-28 bg-cream-dark/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-14">
            <p className="text-xs font-semibold tracking-[0.25em] uppercase text-royal-500 mb-3">
              Наша команда
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-neutral-900 leading-tight tracking-tight">
              Люди, которые создают ваш праздник
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
            {team.map((t) => (
              <div key={t.name} className="text-center">
                <div className="relative overflow-hidden rounded-2xl bg-neutral-100 aspect-[3/4] mb-4">
                  <img
                    src={t.image}
                    alt={t.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <h3 className="font-serif text-lg font-bold text-neutral-900">
                  {t.name}
                </h3>
                <p className="text-sm text-neutral-500 mt-1">{t.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA / CONTACT ─── */}
      <section
        id="contact"
        className="py-20 sm:py-28 bg-linear-to-b from-white to-cream-dark/40"
      >
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

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
            {/* Phone */}
            <a
              href={PHONE_HREF}
              className="card-surface inline-flex flex-col items-center gap-3 px-6 py-7"
            >
              <div className="h-12 w-12 rounded-full bg-royal-50 flex items-center justify-center">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-royal-500"
                >
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              </div>
              <span className="text-base font-semibold text-royal-500 tabular-nums">
                {PHONE}
              </span>
              <span className="text-[11px] text-neutral-400 uppercase tracking-wider">
                Звоните
              </span>
            </a>

            {/* Telegram */}
            <a
              href="https://t.me/lovely_catering"
              target="_blank"
              rel="noopener noreferrer"
              className="card-surface inline-flex flex-col items-center gap-3 px-6 py-7"
            >
              <div className="h-12 w-12 rounded-full bg-royal-50 flex items-center justify-center">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="text-royal-500"
                >
                  <path d="M11.944 0A12 12 0 1 0 24 12.056A12.01 12.01 0 0 0 11.944 0Zm5.573 7.26l-1.97 9.269c-.145.658-.537.818-1.084.508l-3-2.211-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.334-.373-.121l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.538-.196 1.006.128.832.954Z" />
                </svg>
              </div>
              <span className="text-base font-semibold text-royal-500">
                Telegram
              </span>
              <span className="text-[11px] text-neutral-400 uppercase tracking-wider">
                @lovely_catering
              </span>
            </a>

            {/* Email */}
            <a
              href="mailto:lovely-catering@bk.ru"
              className="card-surface inline-flex flex-col items-center gap-3 px-6 py-7"
            >
              <div className="h-12 w-12 rounded-full bg-royal-50 flex items-center justify-center">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-royal-500"
                >
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
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

      {/* ─── FOOTER ─── */}
      <footer className="bg-neutral-900 text-white/55 py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <img
                src="/logo-light.png"
                alt="Любимый Кейтеринг"
                className="h-8 w-auto"
              />
            </div>
            <div className="flex items-center gap-5 text-xs">
              <a href="https://t.me/lovely_catering" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Telegram</a>
              <a href="https://vk.com/lovelycatering" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">VK</a>
              <a href="mailto:lovely-catering@bk.ru" className="hover:text-white transition-colors">lovely-catering@bk.ru</a>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <p>г. Москва, пр-д Донелайтиса, 26</p>
            <p>© {new Date().getFullYear()} LoVely Catering. Все права защищены.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
