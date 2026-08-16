import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion";
import { buttonVariants } from "@/components/ui/button";
import { InstagramIcon, MailIcon, PhoneIcon } from "@/components/ui/icons";
import { getDictionary } from "@/core/i18n";
import { emailLink, site, telLink } from "@/core/site";
import {
  FragranceGrid,
  getCollection,
  getFeaturedFragrances,
  getFragrances,
} from "@/features/catalog";
import { HeroCarousel } from "@/features/hero-carousel";
import { cn } from "@/lib/utils";

const ctaPrimary = cn(buttonVariants({ size: "lg" }), "label-eyebrow h-12 gap-2 px-8");
const ctaSecondary = cn(
  buttonVariants({ variant: "outline", size: "lg" }),
  "label-eyebrow h-12 gap-2 px-8",
);
const heading = "font-serif text-4xl font-light md:text-5xl";
const heroPrimary =
  "label-eyebrow bg-background text-foreground hover:bg-background/90 inline-flex h-12 items-center justify-center gap-2 rounded-md px-8 transition-colors";

export default async function HomePage() {
  const dict = getDictionary();
  const [featured, all, collection] = await Promise.all([
    getFeaturedFragrances(4),
    getFragrances(),
    getCollection("karnain-addicte"),
  ]);

  // The hero owns which bottles it can show (it has 3D for five of them); the catalog owns the
  // words. Composing the two here is what keeps the slices independent.
  const heroItems = all.map((fragrance) => ({
    slug: fragrance.slug,
    name: fragrance.name,
    mood: fragrance.mood,
    href: `/parfums/${fragrance.slug}`,
  }));

  return (
    <>
      <HeroCarousel items={heroItems} labels={dict.heroCarousel} />

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
            <Link
              href="/maison"
              className={cn(buttonVariants({ variant: "outline" }), "label-eyebrow mt-2 gap-2")}
            >
              {dict.story.cta}
            </Link>
          </Reveal>
        </Container>
      </section>

      <section className="relative overflow-hidden border-t">
        <div className="absolute inset-0">
          <Image src="/images/campaign.png" alt="" fill sizes="100vw" className="object-cover" />
          <div className="bg-foreground/45 absolute inset-0" />
        </div>
        <Container className="relative flex min-h-[58vh] flex-col items-center justify-center gap-5 py-24 text-center">
          <Reveal className="flex flex-col items-center gap-5">
            <p className="label-eyebrow text-background/80">{dict.campaign.eyebrow}</p>
            <h2 className="text-background max-w-2xl font-serif text-4xl font-light text-balance md:text-5xl">
              {dict.campaign.title}
            </h2>
            <Link href="/collection" className={heroPrimary}>
              {dict.campaign.cta}
            </Link>
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
              <a href={emailLink(dict.contact.emailSubject)} className={ctaPrimary}>
                <MailIcon className="size-4" />
                {dict.contact.emailCta}
              </a>
              <a href={telLink()} className={ctaSecondary}>
                <PhoneIcon className="size-4" />
                {dict.contact.phoneCta}
              </a>
            </div>
          </Reveal>
        </Container>
      </section>

      <section className="border-t py-20 md:py-28">
        <Container>
          <Reveal className="flex flex-col items-center gap-2 text-center">
            <p className="label-eyebrow text-muted-foreground">{dict.instagram.eyebrow}</p>
            <a
              href={site.instagramUrl}
              target="_blank"
              rel="noreferrer"
              className="font-serif text-3xl transition-opacity hover:opacity-70 md:text-4xl"
            >
              {dict.instagram.handle}
            </a>
          </Reveal>
          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[1, 2, 3, 4].map((n) => (
              <a
                key={n}
                href={site.instagramUrl}
                target="_blank"
                rel="noreferrer"
                aria-label={dict.instagram.cta}
                className="group focus-visible:ring-ring relative aspect-square overflow-hidden rounded-md border outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
              >
                <Image
                  src={`/images/ig-${n}.png`}
                  alt=""
                  fill
                  sizes="(min-width: 640px) 25vw, 50vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </a>
            ))}
          </div>
          <div className="mt-8 flex justify-center">
            <a
              href={site.instagramUrl}
              target="_blank"
              rel="noreferrer"
              className={cn(buttonVariants({ variant: "outline" }), "label-eyebrow gap-2")}
            >
              <InstagramIcon className="size-4" />
              {dict.instagram.cta}
            </a>
          </div>
        </Container>
      </section>
    </>
  );
}
