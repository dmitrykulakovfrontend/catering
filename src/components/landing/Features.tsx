import { ChefHat, Boxes, Flame, Leaf, type LucideIcon } from "lucide-react";

const features: { title: string; description: string; Icon: LucideIcon }[] = [
  {
    title: "Авторское меню",
    description:
      "Сезонные продукты, современные тренды и классика — создаём гастрономические эмоции под формат вашего события.",
    Icon: ChefHat,
  },
  {
    title: "Полный цикл",
    description:
      "Разработка концепции, логистика, декор, музыкальное сопровождение — берём на себя всё от идеи до реализации.",
    Icon: Boxes,
  },
  {
    title: "Шоу-станции",
    description:
      "Шоколадные фонтаны, сырные борды, живой гриль — интерактивные станции, которые делают событие незабываемым.",
    Icon: Flame,
  },
  {
    title: "Эко-подход",
    description:
      "Авторские коктейли под ваше событие, экологичные материалы и осознанный подход к каждой детали.",
    Icon: Leaf,
  },
];

export default function Features() {
  return (
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
          {features.map(({ title, description, Icon }) => (
            <div key={title} className="card-surface p-7">
              <div className="h-12 w-12 rounded-xl bg-royal-50 flex items-center justify-center mb-5 text-royal-500">
                <Icon size={22} strokeWidth={1.8} />
              </div>
              <h3 className="font-serif text-lg font-bold text-neutral-900 mb-2">
                {title}
              </h3>
              <p className="text-sm text-neutral-500 leading-relaxed">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
