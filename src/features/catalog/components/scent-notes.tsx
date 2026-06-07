import { getDictionary } from "@/core/i18n";
import type { ScentNotes as ScentNotesType } from "../types";

/** The head/heart/base pyramid, read-only. Server component. */
export function ScentNotes({ notes }: { notes: ScentNotesType }) {
  const t = getDictionary().product;
  const groups = [
    { label: t.noteHead, items: notes.head },
    { label: t.noteHeart, items: notes.heart },
    { label: t.noteBase, items: notes.base },
  ];

  return (
    <div>
      <h2 className="label-eyebrow text-muted-foreground">{t.notesTitle}</h2>
      <dl className="mt-4 divide-y border-t">
        {groups.map((group) => (
          <div key={group.label} className="flex items-baseline justify-between gap-6 py-3">
            <dt className="label-eyebrow text-muted-foreground">{group.label}</dt>
            <dd className="text-right font-serif text-lg">{group.items.join(", ")}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
