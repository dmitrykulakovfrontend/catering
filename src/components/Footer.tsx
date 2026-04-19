import ContactCta from "./landing/ContactCta";
import SiteFooter from "./landing/SiteFooter";
import { formatPhone, phoneTelHref } from "@/lib/phone";

const DEFAULT_PHONE = "+7(964)7611900";

export default function Footer({
  phone: phoneProp,
  ctaClassName,
}: {
  phone?: string;
  ctaClassName?: string;
}) {
  const raw = phoneProp || DEFAULT_PHONE;
  const phone = formatPhone(raw);
  const phoneHref = phoneTelHref(raw);

  return (
    <>
      <ContactCta phone={phone} phoneHref={phoneHref} className={ctaClassName} />
      <SiteFooter />
    </>
  );
}
