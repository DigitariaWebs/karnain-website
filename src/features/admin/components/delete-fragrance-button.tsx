"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { TrashIcon } from "@/components/ui/icons";
import { deleteFragrance } from "../actions";

export function DeleteFragranceButton({ slug, name }: { slug: string; name: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      aria-label={`Supprimer ${name}`}
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          await deleteFragrance(slug);
          router.refresh();
        })
      }
      className="text-muted-foreground hover:text-destructive transition-colors disabled:opacity-50"
    >
      <TrashIcon className="size-4" />
    </button>
  );
}
