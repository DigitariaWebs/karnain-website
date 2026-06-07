import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion";
import { buttonVariants } from "@/components/ui/button";
import { MailIcon, WhatsAppIcon } from "@/components/ui/icons";
import { getDictionary } from "@/core/i18n";
import { emailLink, whatsappLink } from "@/core/site";
import {
  FragranceGrid,
  getCollection,
  getFeaturedFragrances,
  getFragrances,
} from "@/features/catalog";
import { cn } from "@/lib/utils";

const ctaPrimary = cn(buttonVariants({ size: "lg" }), "label-eyebrow h-12 gap-2 px-8");
const ctaSecondary = cn(
  buttonVariants({ variant: "outline", size: "lg" }),
  "label-eyebrow h-12 gap-2 px-8",
);
const heading = "font-serif text-4xl font-light md:text-5xl";

export default async function HomePage() {
  const dict = getDictionary();
  const [featured, all, collection] = await Promise.all([
    getFeaturedFragrances(4),
    getFragrances(),
    getCollection("karnain-addicte"),
  ]);
  const contactHref = whatsappLink(dict.contact.whatsappMessage);

  return (
    <>
      <section className="from-secondary/60 to-background relative overflow-hidden bg-linear-to-b">
        <Container className="flex min-h-[78vh] flex-col items-center justify-center gap-6 py-24 text-center">
          <Reveal className="flex flex-col items-center gap-6">
            <p className="label-eyebrow text-muted-foreground">{dict.hero.eyebrow}</p>
            <h1 className="max-w-3xl font-serif text-5xl leading-[1.05] font-light text-balance md:text-7xl">
              {dict.hero.statement}
            </h1>
            <p className="text-muted-foreground max-w-xl text-base md:text-lg">{dict.hero.lede}</p>
            <div className="mt-2 flex flex-col items-center gap-3 sm:flex-row">
              <Link href="#collection" className={ctaPrimary}>
                {dict.hero.primaryCta}
              </Link>
              <Link href="#contact" className={ctaSecondary}>
                {dict.hero.secondaryCta}
              </Link>
            </div>
          </Reveal>
        </Container>
      </section>

      <section className="py-20 md:py-28">
        <Container>
          <Reveal className="mb-12 max-w-xl">
            <p className="label-eyebrow text-muted-foreground">{dict.signatures.eyebrow}</p>
            <h2 className={cn("mt-3", heading)}>{dict.signatures.title}</h2>
            <p className="text-muted-foreground mt-4">{dict.signatures.intro}</p>
          </Reveal>
          <Reveal>
            <FragranceGrid
              fragrances={featured}
              comingSoonLabel={dict.collection.imageComingSoon}
            />
          </Reveal>
        </Container>
      </section>

      <section id="collection" className="scroll-mt-24 border-t py-20 md:py-28">
        <Container>
          <Reveal className="mb-12 max-w-xl">
            <p className="label-eyebrow text-muted-foreground">{dict.collection.eyebrow}</p>
            <h2 className={cn("mt-3", heading)}>{collection?.name ?? dict.collection.title}</h2>
            <p className="text-muted-foreground mt-4">
              {collection?.description ?? dict.collection.intro}
            </p>
          </Reveal>
          <Reveal>
            <FragranceGrid fragrances={all} comingSoonLabel={dict.collection.imageComingSoon} />
          </Reveal>
        </Container>
      </section>

      <section id="histoire" className="bg-secondary/40 scroll-mt-24 border-t py-20 md:py-28">
        <Container className="grid gap-10 md:grid-cols-2 md:items-center">
          <Reveal>
            <p className="label-eyebrow text-muted-foreground">{dict.story.eyebrow}</p>
            <h2 className={cn("mt-3", heading)}>{dict.story.title}</h2>
          </Reveal>
          <Reveal className="text-muted-foreground space-y-4 text-base leading-relaxed">
            <p>{dict.story.body1}</p>
            <p>{dict.story.body2}</p>
          </Reveal>
        </Container>
      </section>

      <section id="contact" className="scroll-mt-24 border-t py-20 md:py-28">
        <Container className="flex flex-col items-center gap-6 text-center">
          <Reveal className="flex flex-col items-center gap-5">
            <p className="label-eyebrow text-muted-foreground">{dict.contact.eyebrow}</p>
            <h2 className={cn("max-w-2xl", heading)}>{dict.contact.title}</h2>
            <p className="text-muted-foreground max-w-xl">{dict.contact.body}</p>
            <div className="mt-2 flex flex-col items-center gap-3 sm:flex-row">
              <a href={contactHref} target="_blank" rel="noreferrer" className={ctaPrimary}>
                <WhatsAppIcon className="size-4" />
                {dict.contact.whatsappCta}
              </a>
              <a href={emailLink(dict.contact.emailSubject)} className={ctaSecondary}>
                <MailIcon className="size-4" />
                {dict.contact.emailCta}
              </a>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
