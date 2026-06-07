"use client";

import { BagIcon } from "@/components/ui/icons";
import { getDictionary } from "@/core/i18n";
import { useHydrated } from "@/hooks/use-hydrated";
import { cartCount } from "../lib";
import { useCartStore } from "../provider";

export function BagButton() {
  const count = useCartStore((state) => cartCount(state.lines));
  const openCart = useCartStore((state) => state.openCart);
  const hydrated = useHydrated();
  const t = getDictionary().cart;

  return (
    <button
      type="button"
      aria-label={t.openBag}
      onClick={openCart}
      className="text-foreground/65 hover:text-foreground focus-visible:ring-ring relative inline-flex size-9 items-center justify-center rounded-md transition-colors outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
    >
      <BagIcon className="size-5" />
      {hydrated && count > 0 && (
        <span className="bg-foreground text-background absolute -top-0.5 -right-0.5 flex min-w-4 items-center justify-center rounded-full px-1 text-[10px] leading-4 font-medium">
          {count}
        </span>
      )}
    </button>
  );
}
