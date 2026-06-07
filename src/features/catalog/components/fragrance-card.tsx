import Link from "next/link";
import { formatEur } from "@/lib/format";
import type { Fragrance } from "../types";

type FragranceCardProps = {
  fragrance: Fragrance;
  comingSoonLabel: string;
};

/**
 * Fragrance card, linked to its product page. Imagery is an intentional tonal placeholder
 * (the brand’s initial in faint serif) until the asset zip arrives — swap the panel for
 * `next/image` then.
 */
export function FragranceCard({ fragrance, comingSoonLabel }: FragranceCardProps) {
  return (
    <Link
      href={`/parfums/${fragrance.slug}`}
      aria-label={fragrance.name}
      className="group focus-visible:ring-ring block rounded-md outline-none focus-visible:ring-2 focus-visible:ring-offset-4"
    >
      <article>
        <div className="from-secondary to-card group-hover:border-foreground/25 relative flex aspect-[3/4] items-center justify-center overflow-hidden rounded-md border bg-linear-to-b transition-colors">
          <span
            aria-hidden
            className="text-foreground/10 group-hover:text-foreground/20 font-serif text-7xl font-light transition-colors"
          >
            {fragrance.name.charAt(0)}
          </span>
          <span className="label-eyebrow text-muted-foreground/60 absolute bottom-3">
            {comingSoonLabel}
          </span>
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
