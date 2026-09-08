import Image from "next/image";
import Link from "next/link";
import { getDictionary } from "@/core/i18n";
import { formatEur } from "@/lib/format";
import type { Fragrance } from "../types";

type FragranceCardProps = {
  fragrance: Fragrance;
  comingSoonLabel: string;
};

/** Fragrance card, linked to its product page. Falls back to a tonal placeholder when a
 * fragrance has no imagery yet. */
export function FragranceCard({ fragrance, comingSoonLabel }: FragranceCardProps) {
  const image = fragrance.images[0];
  const badges = getDictionary().badges;
  const badge = fragrance.isBestSeller ? badges.bestSeller : fragrance.isNew ? badges.new : null;
  return (
    <Link
      href={`/parfums/${fragrance.slug}`}
      aria-label={fragrance.name}
      className="group focus-visible:ring-ring block rounded-md outline-none focus-visible:ring-2 focus-visible:ring-offset-4"
    >
      <article>
        <div className="group-hover:border-foreground/25 relative aspect-[3/4] overflow-hidden rounded-md border transition-colors">
          {badge ? (
            <span className="label-eyebrow bg-background/90 text-foreground absolute top-3 left-3 z-10 rounded-full px-2.5 py-1 text-[10px] backdrop-blur">
              {badge}
            </span>
          ) : null}
          {image ? (
            <Image
              src={image}
              alt={fragrance.name}
              fill
              sizes="(min-width: 1024px) 25vw, 50vw"
              className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
            />
          ) : (
            <div className="from-secondary to-card flex h-full items-center justify-center bg-linear-to-b">
              <span aria-hidden className="text-foreground/10 font-serif text-7xl font-light">
                {fragrance.name.charAt(0)}
              </span>
              <span className="label-eyebrow text-muted-foreground/60 absolute bottom-3">
                {comingSoonLabel}
              </span>
            </div>
          )}
        </div>
        <div className="mt-4 space-y-1">
          <h3 className="group-hover:text-foreground/70 font-serif text-xl transition-colors">
            {fragrance.name}
          </h3>
          <p className="text-muted-foreground text-sm">{fragrance.mood}</p>
          <p className="text-sm">{formatEur(fragrance.priceEur)}</p>
        </div>
      </article>
    </Link>
  );
}
