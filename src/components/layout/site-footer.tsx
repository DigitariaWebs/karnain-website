import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { InstagramIcon, MailIcon } from "@/components/ui/icons";
import { getDictionary } from "@/core/i18n";
import { emailLink, site } from "@/core/site";

export function SiteFooter() {
  const dict = getDictionary();
  const year = new Date().getFullYear();
  const linkClass =
    "text-foreground/65 hover:text-foreground inline-flex items-center gap-2 text-sm transition-colors";

  return (
    <footer className="mt-24 border-t">
      <Container className="grid gap-12 py-16 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
        <div className="space-y-4">
          <Image src="/logo.png" alt={site.name} width={420} height={101} className="h-7 w-auto" />
          <p className="text-muted-foreground max-w-xs text-sm">{dict.footer.tagline}</p>
        </div>

        <nav aria-label={dict.footer.maisonTitle} className="flex flex-col items-start gap-3">
          <p className="label-eyebrow text-muted-foreground">{dict.footer.maisonTitle}</p>
          {dict.nav.items.map((item) => (
            <Link key={item.href} href={item.href} className={linkClass}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex flex-col items-start gap-3">
          <p className="label-eyebrow text-muted-foreground">{dict.footer.serviceTitle}</p>
          <a href={emailLink(dict.contact.emailSubject)} className={linkClass}>
            <MailIcon className="size-4" />
            {dict.contact.emailCta}
          </a>
        </div>

        <div className="flex flex-col items-start gap-3">
          <p className="label-eyebrow text-muted-foreground">{dict.footer.followTitle}</p>
          <a href={site.instagramUrl} target="_blank" rel="noreferrer" className={linkClass}>
            <InstagramIcon className="size-4" />
            {dict.footer.instagram}
          </a>
        </div>
      </Container>

      <div className="border-t">
        <Container className="text-muted-foreground flex flex-col gap-2 py-6 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {site.name}. {dict.footer.rights}
          </p>
          <p>{dict.footer.legalNote}</p>
        </Container>
      </div>
    </footer>
  );
}
