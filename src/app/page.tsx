import type { Metadata } from "next";
import { getSiteSetting } from "@/lib/queries";
import { SITE_URL } from "@/lib/siteUrl";
import LandingHero from "@/components/landing/LandingHero";
import Features from "@/components/landing/Features";
import Services from "@/components/landing/Services";
import Dishes from "@/components/landing/Dishes";
import Process from "@/components/landing/Process";
import Team from "@/components/landing/Team";
import Footer from "@/components/Footer";
import { formatPhone, phoneTelHref } from "@/lib/phone";

const DEFAULT_PHONE = "7(964)7611900";

export const metadata: Metadata = {
  title: "Любимый Кейтеринг — Кейтеринг в Москве",
  description:
    "Кейтеринг в Москве от 20 персон. Банкеты, фуршеты, корпоративы, свадьбы. 500+ мероприятий, 600+ блюд в каталоге, 10 лет опыта. Получите расчёт за 1 день.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Любимый Кейтеринг — Кейтеринг в Москве",
    description:
      "Банкеты, фуршеты, корпоративы, свадьбы. Авторское меню, европейский сервис, 10 лет опыта.",
    url: "/",
    type: "website",
  },
};

export default async function Home() {
  const raw = (await getSiteSetting("phone")) || DEFAULT_PHONE;
  const phone = formatPhone(raw);
  const phoneHref = phoneTelHref(raw);

  const telephoneE164 = `+${raw.replace(/\D/g, "")}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CateringService",
    name: "Любимый Кейтеринг",
    description:
      "Кейтеринг в Москве: банкеты, фуршеты, корпоративы, свадьбы. Авторское меню и сервис под ключ.",
    url: SITE_URL,
    image: `${SITE_URL}/logo.png`,
    logo: `${SITE_URL}/logo.png`,
    telephone: telephoneE164,
    priceRange: "₽₽",
    servesCuisine: ["European", "Russian"],
    areaServed: { "@type": "City", name: "Москва" },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Москва",
      addressCountry: "RU",
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        opens: "09:00",
        closes: "21:00",
      },
    ],
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <LandingHero phone={phone} phoneHref={phoneHref} />
      <Features />
      <Services />
      <Dishes />
      <Process />
      <Team />
      <Footer phone={raw} />
    </main>
  );
}
