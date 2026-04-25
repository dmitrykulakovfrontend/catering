import ContactCta from "./landing/ContactCta";
import SiteFooter from "./landing/SiteFooter";
import { formatPhone, phoneTelHref, DEFAULT_PHONE_RAW } from "@/lib/phone";

export default function Footer({
  phone: phoneProp,
  ctaClassName,
}: {
  phone?: string;
  ctaClassName?: string;
}) {
  const raw = phoneProp || DEFAULT_PHONE_RAW;
  const phone = formatPhone(raw);
  const phoneHref = phoneTelHref(raw);

  return (
    <>
      <ContactCta phone={phone} phoneHref={phoneHref} className={ctaClassName} />
      <SiteFooter />
    </>
  );
}
