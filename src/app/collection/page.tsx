import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { getDictionary } from "@/core/i18n";
import { FragranceGrid, getFamilies, getFragrances } from "@/features/catalog";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: getDictionary().collectionPage.title,
};

type SearchParams = { famille?: string };

const chip = "label-eyebrow rounded-full border px-4 py-2 transition-colors";
const chipActive = "border-foreground bg-foreground text-background";
const chipIdle = "text-foreground/70 hover:text-foreground";

export default async function CollectionPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { famille } = await searchParams;
  const dict = getDictionary();
  const t = dict.collectionPage;
  const [all, families] = await Promise.all([getFragrances(), getFamilies()]);

  const active = famille && families.includes(famille) ? famille : null;
  const fragrances = active ? all.filter((fragrance) => fragrance.family === active) : all;

  return (
    <Container className="py-16 md:py-24">
      <header className="max-w-xl">
        <p className="label-eyebrow text-muted-foreground">{t.eyebrow}</p>
        <h1 className="mt-3 font-serif text-4xl font-light md:text-5xl">{t.title}</h1>
        <p className="text-muted-foreground mt-4">{t.intro}</p>
      </header>

      <div className="mt-10 flex flex-wrap gap-3" role="group" aria-label={t.filterLabel}>
        <Link
          href="/collection"
          aria-current={active === null}
          className={cn(chip, active === null ? chipActive : chipIdle)}
        >
          {t.filterAll}
        </Link>
        {families.map((family) => (
          <Link
            key={family}
            href={`/collection?famille=${encodeURIComponent(family)}`}
            aria-current={active === family}
            className={cn(chip, active === family ? chipActive : chipIdle)}
          >
            {family}
          </Link>
        ))}
      </div>

      <FragranceGrid
        fragrances={fragrances}
        comingSoonLabel={dict.collection.imageComingSoon}
        className="mt-12"
      />
    </Container>
  );
}
