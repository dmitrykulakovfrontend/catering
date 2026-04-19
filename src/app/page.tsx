import { getSiteSetting } from "@/lib/queries";
import LandingHero from "@/components/landing/LandingHero";
import Features from "@/components/landing/Features";
import Services from "@/components/landing/Services";
import Dishes from "@/components/landing/Dishes";
import Process from "@/components/landing/Process";
import Team from "@/components/landing/Team";
import Footer from "@/components/Footer";
import { formatPhone, phoneTelHref } from "@/lib/phone";

const DEFAULT_PHONE = "7(964)7611900";

export default async function Home() {
  const raw = (await getSiteSetting("phone")) || DEFAULT_PHONE;
  const phone = formatPhone(raw);
  const phoneHref = phoneTelHref(raw);

  return (
    <main>
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
