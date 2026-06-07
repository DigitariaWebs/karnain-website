import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion";
import { buttonVariants } from "@/components/ui/button";
import { MailIcon, PhoneIcon } from "@/components/ui/icons";
import { getDictionary } from "@/core/i18n";
import { emailLink, telLink } from "@/core/site";
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
const heroPrimary =
  "label-eyebrow bg-background text-foreground hover:bg-background/90 inline-flex h-12 items-center justify-center gap-2 rounded-md px-8 transition-colors";
const heroSecondary =
  "label-eyebrow border-background/50 text-background hover:bg-background/10 inline-flex h-12 items-center justify-center gap-2 rounded-md border px-8 transition-colors";

export default async function HomePage() {
  const dict = getDictionary();
  const [featured, all, collection] = await Promise.all([
    getFeaturedFragrances(4),
    getFragrances(),
    getCollection("karnain-addicte"),
  ]);

  return (
    <>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/collection.png"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="bg-foreground/50 absolute inset-0" />
          <div className="from-background absolute inset-0 bg-linear-to-t to-transparent" />
        </div>
        <Container className="relative flex min-h-[82vh] flex-col items-center justify-center gap-6 py-24 text-center">
          <Reveal className="flex flex-col items-center gap-6">
            <p className="label-eyebrow text-background/80">{dict.hero.eyebrow}</p>
            <h1 className="text-background max-w-3xl font-serif text-5xl leading-[1.05] font-light text-balance md:text-7xl">
              {dict.hero.statement}
            </h1>
            <p className="text-background/85 max-w-xl text-base md:text-lg">{dict.hero.lede}</p>
            <div className="mt-2 flex flex-col items-center gap-3 sm:flex-row">
              <Link href="#collection" className={heroPrimary}>
                {dict.hero.primaryCta}
              </Link>
              <Link href="#contact" className={heroSecondary}>
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
    </>
  );
}
