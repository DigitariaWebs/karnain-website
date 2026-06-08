import Link from "next/link";
import { formatEur } from "@/lib/format";
import { DeleteFragranceButton } from "./delete-fragrance-button";

/** Structural row — avoids importing the catalog feature (boundary rule). */
type ProductRow = {
  slug: string;
  name: string;
  family: string;
  priceEur: number;
  status: "published" | "draft";
};

export function ProductTable({ fragrances }: { fragrances: readonly ProductRow[] }) {
  if (fragrances.length === 0) {
    return <p className="text-muted-foreground py-10 text-sm">Aucune fragrance.</p>;
  }
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b text-left">
          <th className="label-eyebrow text-muted-foreground py-3 font-medium">Fragrance</th>
          <th className="label-eyebrow text-muted-foreground py-3 font-medium">Famille</th>
          <th className="label-eyebrow text-muted-foreground py-3 font-medium">Prix</th>
          <th className="py-3" />
        </tr>
      </thead>
      <tbody>
        {fragrances.map((fragrance) => (
          <tr key={fragrance.slug} className="border-b">
            <td className="py-3">
              <Link
                href={`/admin/${fragrance.slug}`}
                className="font-serif text-base hover:underline"
              >
                {fragrance.name}
              </Link>
              {fragrance.status === "draft" ? (
                <span className="bg-secondary text-muted-foreground ml-2 rounded-full px-2 py-0.5 text-[10px] tracking-wide uppercase">
                  Brouillon
                </span>
              ) : null}
            </td>
            <td className="text-muted-foreground py-3">{fragrance.family}</td>
            <td className="py-3">{formatEur(fragrance.priceEur)}</td>
            <td className="py-3 text-right">
              <DeleteFragranceButton slug={fragrance.slug} name={fragrance.name} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
