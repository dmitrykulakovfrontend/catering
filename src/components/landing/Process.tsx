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

export default function Process() {
  return (
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
  );
}
