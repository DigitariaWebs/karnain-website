import { cn } from "@/lib/utils";
import type { Fragrance } from "../types";
import { FragranceCard } from "./fragrance-card";

type FragranceGridProps = {
  fragrances: readonly Fragrance[];
  comingSoonLabel: string;
  className?: string;
};

/** A responsive grid of fragrance cards. Column count is owned by the call site. */
export function FragranceGrid({ fragrances, comingSoonLabel, className }: FragranceGridProps) {
  return (
    <ul className={cn("grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4", className)}>
      {fragrances.map((fragrance) => (
        <li key={fragrance.slug}>
          <FragranceCard fragrance={fragrance} comingSoonLabel={comingSoonLabel} />
        </li>
      ))}
    </ul>
  );
}
