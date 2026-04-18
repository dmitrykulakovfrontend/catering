import Image from "next/image";

const PHONE = "+7 (916) 123-45-67";
const PHONE_HREF = `tel:${PHONE.replace(/[^\d+]/g, "")}`;

const stats = [
  { value: "2000+", label: "мероприятий" },
  { value: "12 лет", label: "на рынке" },
  { value: "150+", label: "блюд в меню" },
  { value: "98%", label: "возвращаются" },
];

const features = [
  {
    title: "Свежие продукты",
    description:
      "Закупаем у проверенных поставщиков утром в день мероприятия — никаких заготовок «на завтра».",
    icon: (
      <path d="M12 2a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7zm0 9a2 2 0 1 1 0-4 2 2 0 0 1 0 4z" />
    ),
  },
  {
    title: "Шеф-повар",
    description:
      "Авторская кухня, разработанная под формат события — от лёгкого фуршета до банкета на 500 гостей.",
    icon: (
      <>
        <path d="M6 13.5V21h12v-7.5" />
        <path d="M9 13.5a3 3 0 1 1-3-3 4 4 0 0 1 3-6 4 4 0 0 1 6 0 4 4 0 0 1 3 6 3 3 0 1 1-3 3" />
      </>
    ),
  },
  {
    title: "Сервис под ключ",
    description:
      "Посуда, мебель, флористика, официанты, бармены — берём на себя все организационные хлопоты.",
    icon: (
      <>
        <path d="M3 9.5 12 4l9 5.5" />
        <path d="M5 10v9a1 1 0 0 0 1 1h3v-6h6v6h3a1 1 0 0 0 1-1v-9" />
      </>
    ),
  },
  {
    title: "Прозрачная смета",
    description:
      "Фиксируем цену в индивидуальной онлайн-смете — без скрытых платежей и доплат на месте.",
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
    title: "Свадьбы",
    description: "Изысканное меню и элегантная подача для главного дня.",
    image: "/images/svinaya-korejka.png",
  },
  {
    title: "Корпоративы",
    description: "Банкеты, фуршеты и тимбилдинги для команд от 20 до 500 человек.",
    image: "/images/teplyj-salat-s-rostbifom.png",
  },
  {
    title: "Фуршеты",
    description: "Канапе, тарталетки и закуски для презентаций и деловых приёмов.",
    image: "/images/kanape-grecheskoe.png",
  },
  {
    title: "Кофе-брейки",
    description: "Свежая выпечка, фрукты и напитки для конференций и встреч.",
    image: "/images/fruktovoe-assorti.png",
  },
  {
    title: "Частные приёмы",
    description: "Камерные ужины и юбилеи с персональным меню и обслуживанием.",
    image: "/images/tartaletka-s-utkoj.png",
  },
  {
    title: "Выездные мангалы",
    description: "Шашлыки и блюда на гриле прямо на вашей площадке.",
    image: "/images/ovoshchi-na-grile.png",
  },
];

const dishes = [
  { src: "/images/salat-cezar.png", name: "Салат Цезарь", tag: "Салаты" },
  { src: "/images/befstroganov.png", name: "Бефстроганов", tag: "Горячее" },
  { src: "/images/brusketa-kapreze.png", name: "Брускетта Капрезе", tag: "Закуски" },
  { src: "/images/myasnoe-assorti.png", name: "Мясное ассорти", tag: "Холодные" },
  { src: "/images/limonad-mohito.png", name: "Лимонад Мохито", tag: "Напитки" },
  { src: "/images/plato-italyanskih-kolbas.png", name: "Плато итальянских колбас", tag: "Холодные" },
  { src: "/images/zhulyen.png", name: "Жульен", tag: "Горячее" },
  { src: "/images/ruletiki-iz-baklazhan.png", name: "Рулетики из баклажан", tag: "Закуски" },
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

export default function Home() {
  return (
    <main>
      {/* ─── HERO ─── */}
      <section className="relative min-h-screen flex flex-col">
        <Image
          src="/background.webp"
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
                Кейтеринг в Москве · с 2012 года
              </p>
              <h1 className="animate-fade-up delay-1 font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.05] tracking-tight mb-6">
                Кухня, которую <br className="hidden sm:block" /> запомнят гости
              </h1>
              <p className="animate-fade-up delay-2 text-base sm:text-lg text-white/75 leading-relaxed mb-9 max-w-xl">
                Авторское меню, безупречная подача и сервис под ключ для свадеб,
                корпоративов и частных приёмов от 10 до 1000 персон.
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
              Более 150 блюд в актуальном меню
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
                className="group relative overflow-hidden rounded-2xl bg-neutral-100 aspect-square"
              >
                <img
                  src={d.src}
                  alt={d.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-linear-to-t from-neutral-900/85 via-neutral-900/20 to-transparent" />
                <figcaption className="absolute inset-x-0 bottom-0 p-4">
                  <p className="text-[10px] font-semibold tracking-widest uppercase text-royal-200 mb-1">
                    {d.tag}
                  </p>
                  <p className="text-sm sm:text-base font-semibold text-white leading-tight">
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

          <a
            href={PHONE_HREF}
            className="card-surface inline-flex flex-col items-center gap-3 px-12 py-7 mx-auto"
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
            <span className="text-lg font-semibold text-royal-500 tabular-nums">
              {PHONE}
            </span>
            <span className="text-xs text-neutral-400 uppercase tracking-wider">
              Ежедневно с 9:00 до 22:00
            </span>
          </a>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="bg-neutral-900 text-white/55 py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src="/logo-light.png"
              alt="Любимый Кейтеринг"
              className="h-8 w-auto"
            />
          </div>
          <p className="text-xs">
            © {new Date().getFullYear()} Любимый Кейтеринг. Все права защищены.
          </p>
        </div>
      </footer>
    </main>
  );
}
