"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { type ActionResult, updateOrderStatus } from "../actions";

const OPTIONS = [
  ["pending", "En attente"],
  ["paid", "Payée"],
  ["fulfilled", "Expédiée"],
  ["cancelled", "Annulée"],
] as const;

export function OrderStatusForm({ id, status }: { id: string; status: string }) {
  const [state, formAction, pending] = useActionState<ActionResult | null, FormData>(
    updateOrderStatus,
    null,
  );

  return (
    <form action={formAction} className="flex flex-wrap items-end gap-3">
      <input type="hidden" name="id" value={id} />
      <div className="space-y-2">
        <label htmlFor="status" className="label-eyebrow text-muted-foreground block">
          Statut
        </label>
        <select
          id="status"
          name="status"
          defaultValue={status}
          className="border-input focus-visible:ring-ring rounded-md border bg-transparent px-3 py-2 text-sm outline-none focus-visible:ring-2"
        >
          {OPTIONS.map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>
      <Button type="submit" disabled={pending} className="label-eyebrow">
        {pending ? "Enregistrement…" : "Mettre à jour"}
      </Button>
      {state && !state.ok ? <p className="text-destructive w-full text-sm">{state.error}</p> : null}
    </form>
  );
}
