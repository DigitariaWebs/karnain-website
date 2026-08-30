"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, m } from "@/components/motion";
import { ArrowRightIcon, CloseIcon } from "@/components/ui/icons";
import { getDictionary } from "@/core/i18n";
import { cn } from "@/lib/utils";

/** `src` absent → tonal placeholder; pass a real `src` later and render `next/image` here. */
export type GalleryImage = { src?: string; alt: string };

const controlButton =
  "text-foreground/70 hover:text-foreground focus-visible:ring-ring inline-flex size-11 items-center justify-center rounded-full border outline-none transition-colors focus-visible:ring-2";

function Panel({
  image,
  className,
  big,
  contain,
  priority,
  comingSoonLabel,
}: {
  image: GalleryImage;
  className?: string;
  big?: boolean;
  contain?: boolean;
  priority?: boolean;
  comingSoonLabel?: string;
}) {
  if (image.src) {
    const sizes = big ? "(min-width: 768px) 45vw, 100vw" : "120px";
    return (
      <div className={cn("relative overflow-hidden rounded-md", !contain && "border", className)}>
        <Image
          src={image.src}
          alt={image.alt}
          fill
          priority={priority}
          sizes={sizes}
          className={contain ? "object-contain" : "object-cover"}
        />
      </div>
    );
  }
  return (
    <div
      className={cn(
        "from-secondary to-card relative flex items-center justify-center overflow-hidden rounded-md border bg-linear-to-b",
        className,
      )}
    >
      <span
        aria-hidden
        className={cn("text-foreground/10 font-serif font-light", big ? "text-8xl" : "text-3xl")}
      >
        {image.alt.charAt(0)}
      </span>
      {comingSoonLabel ? (
        <span className="label-eyebrow text-muted-foreground/60 absolute bottom-3">
          {comingSoonLabel}
        </span>
      ) : null}
    </div>
  );
}

type FragranceGalleryProps = {
  images: readonly GalleryImage[];
  comingSoonLabel: string;
};

export function FragranceGallery({ images, comingSoonLabel }: FragranceGalleryProps) {
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);
  const t = getDictionary().product;
  const count = images.length;
  const current = images[active] ?? images[0];

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
      if (event.key === "ArrowRight") setActive((index) => (index + 1) % count);
      if (event.key === "ArrowLeft") setActive((index) => (index - 1 + count) % count);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, count]);

  if (!current) return null;

  return (
    <div className="space-y-4">
      <button
        type="button"
        aria-label={t.galleryZoom}
        onClick={() => setOpen(true)}
        className="focus-visible:ring-ring block w-full rounded-md outline-none focus-visible:ring-2 focus-visible:ring-offset-4"
      >
        <Panel
          image={current}
          comingSoonLabel={comingSoonLabel}
          big
          priority
          className="aspect-[4/5]"
        />
      </button>

      {count > 1 ? (
        <ul className="grid grid-cols-4 gap-3">
          {images.map((image, index) => (
            <li key={image.alt}>
              <button
                type="button"
                aria-label={image.alt}
                aria-current={index === active}
                onClick={() => setActive(index)}
                className={cn(
                  "focus-visible:ring-ring block w-full rounded-md outline-none focus-visible:ring-2",
                  index === active ? "ring-foreground/30 ring-1" : "",
                )}
              >
                <Panel image={image} className="aspect-square" />
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      <AnimatePresence>
        {open ? (
          <m.div
            role="dialog"
            aria-modal="true"
            aria-label={current.alt}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="bg-background/95 fixed inset-0 z-50 flex flex-col"
          >
            <div className="flex h-16 items-center justify-end px-6">
              <button
                type="button"
                aria-label={t.galleryClose}
                autoFocus
                onClick={() => setOpen(false)}
                className="text-foreground/70 hover:text-foreground focus-visible:ring-ring inline-flex size-10 items-center justify-center rounded-md transition-colors outline-none focus-visible:ring-2"
              >
                <CloseIcon className="size-6" />
              </button>
            </div>
            <div className="flex flex-1 items-center justify-center gap-4 px-4 pb-12">
              {count > 1 ? (
                <button
                  type="button"
                  aria-label={t.galleryPrev}
                  onClick={() => setActive((index) => (index - 1 + count) % count)}
                  className={controlButton}
                >
                  <ArrowRightIcon className="size-5 rotate-180" />
                </button>
              ) : null}
              <Panel
                image={current}
                big
                contain
                className="aspect-[4/5] max-h-[80vh] w-full max-w-sm"
              />
              {count > 1 ? (
                <button
                  type="button"
                  aria-label={t.galleryNext}
                  onClick={() => setActive((index) => (index + 1) % count)}
                  className={controlButton}
                >
                  <ArrowRightIcon className="size-5" />
                </button>
              ) : null}
            </div>
          </m.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
