"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AnimatePresence, m } from "@/components/motion";
import { buttonVariants } from "@/components/ui/button";
import { CloseIcon } from "@/components/ui/icons";
import { getDictionary } from "@/core/i18n";
import { formatEur } from "@/lib/format";
import { cn } from "@/lib/utils";
import { cartSubtotal } from "../lib";
import { useCartStore } from "../provider";
import { CartLineRow } from "./cart-line-row";

export function CartDrawer() {
  const isOpen = useCartStore((state) => state.isOpen);
  const closeCart = useCartStore((state) => state.closeCart);
  const lines = useCartStore((state) => state.lines);
  const t = getDictionary().cart;

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeCart();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, closeCart]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <m.div
            aria-hidden
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            onClick={closeCart}
            className="bg-foreground/30 fixed inset-0 z-50"
          />
          <m.aside
            role="dialog"
            aria-modal="true"
            aria-label={t.title}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="bg-background fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col border-l"
          >
            <div className="flex h-16 items-center justify-between border-b px-6">
              <p className="label-eyebrow">{t.title}</p>
              <button
                type="button"
                aria-label={t.closeBag}
                autoFocus
                onClick={closeCart}
                className="text-foreground/65 hover:text-foreground focus-visible:ring-ring inline-flex size-10 items-center justify-center rounded-md transition-colors outline-none focus-visible:ring-2"
              >
                <CloseIcon className="size-6" />
              </button>
            </div>

            {lines.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
                <p className="text-muted-foreground">{t.empty}</p>
                <Link
                  href="/#collection"
                  onClick={closeCart}
                  className={cn(buttonVariants({ variant: "outline" }), "label-eyebrow")}
                >
                  {t.emptyCta}
                </Link>
              </div>
            ) : (
              <>
                <ul className="flex-1 divide-y overflow-y-auto px-6">
                  {lines.map((line) => (
                    <CartLineRow key={line.slug} line={line} />
                  ))}
                </ul>
                <div className="space-y-4 border-t px-6 py-6">
                  <div className="flex items-center justify-between">
                    <span className="label-eyebrow text-muted-foreground">{t.subtotal}</span>
                    <span className="text-lg">{formatEur(cartSubtotal(lines))}</span>
                  </div>
                  <Link
                    href="/panier"
                    onClick={closeCart}
                    className={cn(buttonVariants({ size: "lg" }), "label-eyebrow h-12 w-full")}
                  >
                    {t.viewBag}
                  </Link>
                  <button
                    type="button"
                    onClick={closeCart}
                    className="text-muted-foreground hover:text-foreground w-full text-center text-sm underline-offset-4 hover:underline"
                  >
                    {t.continue}
                  </button>
                </div>
              </>
            )}
          </m.aside>
        </>
      )}
    </AnimatePresence>
  );
}
