import Image from "next/image";
import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="bg-neutral-900 text-white/55 py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <Link href="/" className="block">
              <Image
                src="/logo-light.png"
                alt="Любимый Кейтеринг"
                width={867}
                height={729}
                className="h-24 w-auto"
              />
            </Link>
          </div>
          <div className="flex items-center gap-5 text-xs">
            <a
              href="https://t.me/lovely_catering"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              Telegram
            </a>
            <a
              href="https://vk.com/lovelycatering"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              VK
            </a>
            <a
              href="mailto:lovely-catering@bk.ru"
              className="hover:text-white transition-colors"
            >
              lovely-catering@bk.ru
            </a>
          </div>
        </div>
        <div className="mt-6 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <p>г. Москва, пр-д Донелайтиса, 26</p>
          <p>
            © {new Date().getFullYear()} LoVely Catering. Все права защищены.
          </p>
        </div>
      </div>
    </footer>
  );
}
