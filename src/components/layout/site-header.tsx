import Link from "next/link";
import { Container } from "@/components/layout/container";
import { MobileNav } from "@/components/layout/mobile-nav";
import { InstagramIcon } from "@/components/ui/icons";
import { getDictionary } from "@/core/i18n";
import { site, whatsappLink } from "@/core/site";

export function SiteHeader() {
  const dict = getDictionary();
  const contactHref = whatsappLink(dict.contact.whatsappMessage);

  return (
    <header className="bg-background/85 sticky top-0 z-40 border-b backdrop-blur">
      <Container className="grid h-16 grid-cols-[1fr_auto_1fr] items-center md:h-20">
        <div className="flex items-center justify-start">
          <nav aria-label={site.name} className="hidden items-center gap-8 md:flex">
            {dict.nav.items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="label-eyebrow text-foreground/65 hover:text-foreground transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <MobileNav
            items={dict.nav.items}
            openLabel={dict.nav.openMenu}
            closeLabel={dict.nav.closeMenu}
            brand={site.name}
            contactLabel={dict.contact.whatsappCta}
            contactHref={contactHref}
            instagramUrl={site.instagramUrl}
            instagramLabel={dict.footer.instagram}
          />
        </div>

        <Link
          href="/"
          aria-label={dict.nav.brandHome}
          className="justify-self-center font-sans text-xl font-medium tracking-[0.3em] uppercase md:text-2xl"
        >
          {site.name}
        </Link>

        <div className="flex items-center justify-end gap-5">
          <a
            href={site.instagramUrl}
            aria-label={dict.footer.instagram}
            target="_blank"
            rel="noreferrer"
            className="text-foreground/65 hover:text-foreground transition-colors"
          >
            <InstagramIcon className="size-5" />
          </a>
        </div>
      </Container>
    </header>
  );
}
