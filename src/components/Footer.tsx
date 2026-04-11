export default function Footer() {
  return (
    <footer className="relative bg-wine-700 text-white overflow-hidden">
      {/* Subtle pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0L60 30L30 60L0 30Z' fill='none' stroke='%23C9A84C' stroke-width='0.5'/%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative z-10 flex flex-col items-center px-6 py-16 sm:py-20">
        {/* Ornament */}
        <div className="flex items-center gap-3 mb-6">
          <div className="h-px w-8 bg-gradient-to-r from-transparent to-gold-500/40" />
          <svg width="12" height="12" viewBox="0 0 16 16" className="text-gold-500/60" fill="currentColor">
            <path d="M8 0l2.5 5.5L16 8l-5.5 2.5L8 16l-2.5-5.5L0 8l5.5-2.5z" />
          </svg>
          <div className="h-px w-8 bg-gradient-to-l from-transparent to-gold-500/40" />
        </div>

        <h3 className="font-serif text-2xl sm:text-3xl font-bold text-gold-200 tracking-tight">
          Любимый Кейтеринг
        </h3>

        <p className="mt-4 text-sm text-gold-300/50 max-w-md text-center leading-relaxed">
          Создаём незабываемые гастрономические впечатления для ваших особенных событий
        </p>

        <div className="mt-8 h-px w-16 bg-gradient-to-r from-transparent via-gold-500/30 to-transparent" />

        <p className="mt-6 text-xs text-gold-300/30">
          © {new Date().getFullYear()} Любимый Кейтеринг
        </p>
      </div>
    </footer>
  );
}
