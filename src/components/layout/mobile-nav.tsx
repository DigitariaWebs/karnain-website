"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, m } from "@/components/motion";
import { CloseIcon, InstagramIcon, MenuIcon, WhatsAppIcon } from "@/components/ui/icons";

type NavItem = { label: string; href: string };

type MobileNavProps = {
  items: readonly NavItem[];
  openLabel: string;
  closeLabel: string;
  brand: string;
  contactLabel: string;
  contactHref: string;
  instagramUrl: string;
  instagramLabel: string;
};

const iconButton =
  "focus-visible:ring-ring inline-flex size-10 items-center justify-center rounded-md outline-none transition-colors hover:text-foreground/60 focus-visible:ring-2 focus-visible:ring-offset-2";

export function MobileNav({
  items,
  openLabel,
  closeLabel,
  brand,
  contactLabel,
  contactHref,
  instagramUrl,
  instagramLabel,
}: MobileNavProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-label={openLabel}
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpen(true)}
        className={iconButton}
      >
        <MenuIcon className="size-6" />
      </button>

      <AnimatePresence>
        {open && (
          <m.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label={brand}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="bg-background fixed inset-0 z-50 flex flex-col"
          >
            <div className="flex h-16 items-center justify-between px-6">
              <span className="font-sans text-lg font-medium tracking-[0.3em] uppercase">
                {brand}
              </span>
              <button
                type="button"
                aria-label={closeLabel}
                autoFocus
                onClick={() => setOpen(false)}
                className={iconButton}
              >
                <CloseIcon className="size-6" />
              </button>
            </div>

            <nav aria-label={brand} className="flex flex-col gap-8 px-6 py-10">
              {items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="font-serif text-4xl font-light"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="mt-auto flex items-center justify-between border-t px-6 py-6">
              <Link
                href={contactHref}
                onClick={() => setOpen(false)}
                className="label-eyebrow inline-flex items-center gap-2"
              >
                <WhatsAppIcon className="size-4" />
                {contactLabel}
              </Link>
              <a
                href={instagramUrl}
                aria-label={instagramLabel}
                target="_blank"
                rel="noreferrer"
                className={iconButton}
              >
                <InstagramIcon className="size-5" />
              </a>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}
