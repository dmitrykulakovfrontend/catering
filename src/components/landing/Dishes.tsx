import Image from "next/image";

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

export default function Dishes() {
  return (
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
                <Image
                  src={d.src}
                  alt={d.name}
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
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
  );
}
