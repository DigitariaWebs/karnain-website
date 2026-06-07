import { formatEur } from "@/lib/format";
import type { Fragrance } from "../types";

type FragranceCardProps = {
  fragrance: Fragrance;
  comingSoonLabel: string;
};

/**
 * Presentational fragrance card. Imagery is an intentional tonal placeholder (the brand’s
 * initial in faint serif) until the asset zip arrives — swap the panel for `next/image`
 * then. Display-only in v1; becomes a link when the product page ships (spec 2).
 */
export function FragranceCard({ fragrance, comingSoonLabel }: FragranceCardProps) {
  return (
    <article className="group">
      <div className="from-secondary to-card relative flex aspect-[3/4] items-center justify-center overflow-hidden rounded-md border bg-linear-to-b">
        <span aria-hidden className="text-foreground/10 font-serif text-7xl font-light">
          {fragrance.name.charAt(0)}
        </span>
        <span className="label-eyebrow text-muted-foreground/60 absolute bottom-3">
          {comingSoonLabel}
        </span>
      </div>
      <div className="mt-4 space-y-1">
        <h3 className="font-serif text-xl">{fragrance.name}</h3>
        <p className="text-muted-foreground text-sm">{fragrance.mood}</p>
        <p className="text-sm">{formatEur(fragrance.priceEur)}</p>
      </div>
    </article>
  );
}
