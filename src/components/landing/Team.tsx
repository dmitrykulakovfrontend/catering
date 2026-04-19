import Image from "next/image";

const team = [
  { name: "Людмила", role: "Директор по развитию", image: "/images/team-ludmila.webp" },
  { name: "Валерия", role: "Менеджер", image: "/images/team-valeria.webp" },
  { name: "Ольга", role: "Старший менеджер по продажам", image: "/images/team-olga.webp" },
  { name: "Дарья", role: "Менеджер по рекламе", image: "/images/team-daria.webp" },
];

export default function Team() {
  return (
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
                <Image
                  src={t.image}
                  alt={t.name}
                  fill
                  sizes="(min-width: 640px) 25vw, 50vw"
                  className="object-cover"
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
  );
}
