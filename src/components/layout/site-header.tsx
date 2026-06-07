import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { MobileNav } from "@/components/layout/mobile-nav";
import { InstagramIcon } from "@/components/ui/icons";
import { getDictionary } from "@/core/i18n";
import { emailLink, site } from "@/core/site";

type SiteHeaderProps = {
  /** The bag control (a cart-feature element) is injected by `app` to respect layer boundaries. */
  bag?: React.ReactNode;
};

export function SiteHeader({ bag }: SiteHeaderProps) {
  const dict = getDictionary();
  const contactHref = emailLink(dict.contact.emailSubject);

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
            contactLabel={dict.contact.emailCta}
            contactHref={contactHref}
            instagramUrl={site.instagramUrl}
            instagramLabel={dict.footer.instagram}
          />
        </div>

        <Link href="/" aria-label={dict.nav.brandHome} className="justify-self-center">
          <Image
            src="/logo.png"
            alt=""
            width={420}
            height={101}
            priority
            className="h-6 w-auto md:h-7"
          />
        </Link>

        <div className="flex items-center justify-end gap-4">
          <a
            href={site.instagramUrl}
            aria-label={dict.footer.instagram}
            target="_blank"
            rel="noreferrer"
            className="text-foreground/65 hover:text-foreground hidden transition-colors sm:inline"
          >
            <InstagramIcon className="size-5" />
          </a>
          {bag}
        </div>
      </Container>
    </header>
  );
}
