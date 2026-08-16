import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion";
import { buttonVariants } from "@/components/ui/button";
import { getDictionary } from "@/core/i18n";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: getDictionary().maison.title,
  description: getDictionary().maison.lede,
};

export default function MaisonPage() {
  const t = getDictionary().maison;

  return (
    <>
      <Container className="py-16 md:py-24">
        <Reveal className="max-w-2xl">
          <p className="label-eyebrow text-muted-foreground">{t.eyebrow}</p>
          <h1 className="mt-3 font-serif text-4xl leading-[1.1] font-light text-balance md:text-5xl">
            {t.title}
          </h1>
          <p className="text-muted-foreground mt-6 text-lg leading-relaxed">{t.lede}</p>
        </Reveal>
      </Container>

      <Container className="pb-8">
        {t.chapters.map((chapter) => (
          <Reveal
            key={chapter.title}
            className="grid gap-6 border-t py-14 md:grid-cols-[1fr_2fr] md:gap-16 md:py-20"
          >
            <h2 className="font-serif text-2xl font-light md:text-3xl">{chapter.title}</h2>
            <div className="text-muted-foreground space-y-4 text-base leading-relaxed">
              <p>{chapter.body1}</p>
              <p>{chapter.body2}</p>
            </div>
          </Reveal>
        ))}
      </Container>

      <section className="bg-secondary/40 border-t">
        <Container className="py-20 md:py-28">
          <Reveal>
            <blockquote className="mx-auto max-w-3xl text-center font-serif text-2xl leading-snug font-light text-balance md:text-4xl">
              {t.quote}
            </blockquote>
          </Reveal>
        </Container>
      </section>

      <section className="border-t">
        <Container className="flex flex-col items-center gap-5 py-20 text-center md:py-28">
          <Reveal className="flex flex-col items-center gap-5">
            <h2 className="max-w-2xl font-serif text-3xl font-light text-balance md:text-4xl">
              {t.closingTitle}
            </h2>
            <p className="text-muted-foreground max-w-xl">{t.closingBody}</p>
            <Link
              href="/collection"
              className={cn(buttonVariants({ size: "lg" }), "label-eyebrow mt-2 h-12 px-8")}
            >
              {t.closingCta}
            </Link>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
