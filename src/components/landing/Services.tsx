import Image from "next/image";

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

export default function Services() {
  return (
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
                <Image
                  src={s.image}
                  alt={s.title}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
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
  );
}
