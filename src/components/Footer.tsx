export default function Footer({ managerPhone }: { managerPhone?: string }) {
  return (
    <>
      <footer className="py-14 sm:py-20">
        <div className="mx-auto max-w-lg px-4 text-center">
          <h3 className="font-serif text-xl sm:text-2xl font-bold text-neutral-900 mb-2">
            Остались вопросы?
          </h3>
          <p className="text-sm text-neutral-400 mb-8">
            Свяжитесь с нами и мы ответим на любые вопросы
          </p>

          {managerPhone && (
            <a
              href={`tel:${managerPhone.replace(/\s/g, '')}`}
              className="card-surface inline-flex flex-col items-center gap-3 px-10 py-6"
            >
              <div className="h-11 w-11 rounded-full bg-royal-50 flex items-center justify-center">
                <svg
                  width="18"
                  height="18"
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
              <span className="text-[15px] font-medium text-royal-500 tabular-nums">
                {managerPhone}
              </span>
            </a>
          )}
        </div>
      </footer>

      <div className="h-12" />
    </>
  );
}
