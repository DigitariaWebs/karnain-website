"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { type ActionResult, saveFragrance } from "../actions";

/** Structural values — avoids importing the catalog feature (boundary rule). */
type ProductFormValues = {
  slug: string;
  name: string;
  collectionSlug: string;
  family: string;
  priceEur: number;
  mood: string;
  description: string;
  featured: boolean;
  notes: { head: readonly string[]; heart: readonly string[]; base: readonly string[] };
  images: readonly string[];
};

const fieldLabel = "label-eyebrow text-muted-foreground";

export function ProductForm({ initial }: { initial?: ProductFormValues }) {
  const [state, formAction, pending] = useActionState<ActionResult | null, FormData>(
    saveFragrance,
    null,
  );
  const isEdit = Boolean(initial);

  return (
    <form action={formAction} className="max-w-2xl space-y-5">
      <input
        type="hidden"
        name="collectionSlug"
        defaultValue={initial?.collectionSlug ?? "karnain-addicte"}
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="slug" className={fieldLabel}>
            Slug
          </label>
          <Input id="slug" name="slug" defaultValue={initial?.slug} readOnly={isEdit} required />
        </div>
        <div className="space-y-2">
          <label htmlFor="name" className={fieldLabel}>
            Nom
          </label>
          <Input id="name" name="name" defaultValue={initial?.name} required />
        </div>
        <div className="space-y-2">
          <label htmlFor="family" className={fieldLabel}>
            Famille
          </label>
          <Input id="family" name="family" defaultValue={initial?.family} required />
        </div>
        <div className="space-y-2">
          <label htmlFor="priceEur" className={fieldLabel}>
            Prix en euros
          </label>
          <Input
            id="priceEur"
            name="priceEur"
            type="number"
            min={0}
            defaultValue={initial?.priceEur ?? 195}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="mood" className={fieldLabel}>
          Ambiance
        </label>
        <Input id="mood" name="mood" defaultValue={initial?.mood} />
      </div>

      <div className="space-y-2">
        <label htmlFor="description" className={fieldLabel}>
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          defaultValue={initial?.description}
          className="border-input focus-visible:ring-ring w-full rounded-md border bg-transparent px-3 py-2 text-sm outline-none focus-visible:ring-2"
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <div className="space-y-2">
          <label htmlFor="notesHead" className={fieldLabel}>
            Notes de tête
          </label>
          <Input id="notesHead" name="notesHead" defaultValue={initial?.notes.head.join(", ")} />
        </div>
        <div className="space-y-2">
          <label htmlFor="notesHeart" className={fieldLabel}>
            Notes de cœur
          </label>
          <Input id="notesHeart" name="notesHeart" defaultValue={initial?.notes.heart.join(", ")} />
        </div>
        <div className="space-y-2">
          <label htmlFor="notesBase" className={fieldLabel}>
            Notes de fond
          </label>
          <Input id="notesBase" name="notesBase" defaultValue={initial?.notes.base.join(", ")} />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="images" className={fieldLabel}>
          Images, chemins séparés par des virgules
        </label>
        <Input id="images" name="images" defaultValue={initial?.images.join(", ")} />
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          name="featured"
          defaultChecked={initial?.featured}
          className="accent-primary size-4"
        />
        Mise en avant dans les signatures
      </label>

      {state && !state.ok ? <p className="text-destructive text-sm">{state.error}</p> : null}

      <Button type="submit" disabled={pending} className="label-eyebrow">
        {pending ? "Enregistrement…" : "Enregistrer"}
      </Button>
    </form>
  );
}
