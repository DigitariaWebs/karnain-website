"use client";

import { Button } from "@/components/ui/button";
import { getDictionary } from "@/core/i18n";
import { cn } from "@/lib/utils";
import { useCartStore } from "../provider";
import type { CartItemInput } from "../types";

type AddToBagButtonProps = {
  item: CartItemInput;
  className?: string;
};

export function AddToBagButton({ item, className }: AddToBagButtonProps) {
  const addItem = useCartStore((state) => state.addItem);
  const t = getDictionary().cart;
  return (
    <Button
      type="button"
      size="lg"
      onClick={() => addItem(item)}
      className={cn("label-eyebrow h-12 px-8", className)}
    >
      {t.addToBag}
    </Button>
  );
}
