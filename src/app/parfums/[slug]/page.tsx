import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/layout/container";
import { ArrowRightIcon } from "@/components/ui/icons";
import { getDictionary } from "@/core/i18n";
import { emailLink } from "@/core/site";
import { AddToBagButton } from "@/features/cart";
import {
  FragranceGallery,
  FragranceGrid,
  type GalleryImage,
  ScentNotes,
  getCollection,
  getFragrance,
  getFragrances,
} from "@/features/catalog";
import { formatEur } from "@/lib/format";

type Params = { slug: string };

export async function generateStaticParams() {
  const fragrances = await getFragrances();
  return fragrances.map((fragrance) => ({ slug: fragrance.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const fragrance = await getFragrance(slug);
  if (!fragrance) return {};
  return { title: fragrance.name, description: fragrance.description };
}

export default async function FragrancePage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const fragrance = await getFragrance(slug);
  if (!fragrance) notFound();

  const dict = getDictionary();
  const t = dict.product;
  const [collection, all] = await Promise.all([
    getCollection(fragrance.collectionSlug),
    getFragrances(),
  ]);
  const others = all.filter((item) => item.slug !== fragrance.slug).slice(0, 4);
  const images: GalleryImage[] = fragrance.images.length
    ? fragrance.images.map((src, index) => ({
        src,
        alt: `${fragrance.name} — visuel ${index + 1}`,
      }))
    : [1, 2, 3, 4].map((n) => ({ alt: `${fragrance.name} — visuel ${n}` }));

  return (
    <Container className="py-12 md:py-16">
      <Link
        href="/collection"
        className="label-eyebrow text-muted-foreground hover:text-foreground inline-flex items-center gap-2 transition-colors"
      >
        <ArrowRightIcon className="size-4 rotate-180" />
        {t.backToCollection}
      </Link>

      <div className="mt-8 grid gap-10 md:grid-cols-2 md:gap-16">
        <FragranceGallery images={images} comingSoonLabel={dict.collection.imageComingSoon} />

        <div className="flex flex-col gap-6">
          <div className="space-y-3">
            {collection ? (
              <p className="label-eyebrow text-muted-foreground">{collection.name}</p>
            ) : null}
            <h1 className="font-serif text-4xl font-light md:text-5xl">{fragrance.name}</h1>
            <p className="text-muted-foreground text-lg">{fragrance.mood}</p>
          </div>

          <p className="text-xl">{formatEur(fragrance.priceEur)}</p>
          <p className="text-muted-foreground max-w-prose leading-relaxed">
            {fragrance.description}
          </p>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <AddToBagButton
              item={{ slug: fragrance.slug, name: fragrance.name, priceEur: fragrance.priceEur }}
            />
            <span className="text-muted-foreground text-sm">
              {t.adviceLabel}{" "}
              <a
                href={emailLink(t.emailSubject.replace("{fragrance}", fragrance.name))}
                className="text-foreground underline underline-offset-4"
              >
                {t.emailCta}
              </a>
            </span>
          </div>

          <div className="mt-2">
            <ScentNotes notes={fragrance.notes} />
          </div>
        </div>
      </div>

      <section className="mt-24 border-t pt-16">
        <h2 className="label-eyebrow text-muted-foreground mb-10">{t.alsoTitle}</h2>
        <FragranceGrid fragrances={others} comingSoonLabel={dict.collection.imageComingSoon} />
      </section>
    </Container>
  );
}
