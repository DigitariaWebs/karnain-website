"use client";

import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Button, buttonVariants } from "@/components/ui/button";
import { getDictionary } from "@/core/i18n";
import { cn } from "@/lib/utils";

export default function FragranceError({ reset }: { reset: () => void }) {
  const t = getDictionary().product;
  return (
    <Container className="flex flex-col items-center gap-5 py-24 text-center">
      <h1 className="font-serif text-3xl font-light">{t.errorTitle}</h1>
      <p className="text-muted-foreground">{t.errorBody}</p>
      <div className="flex flex-wrap justify-center gap-3">
        <Button onClick={reset} className="label-eyebrow">
          {t.retry}
        </Button>
        <Link
          href="/#collection"
          className={cn(buttonVariants({ variant: "outline" }), "label-eyebrow")}
        >
          {t.backToCollection}
        </Link>
      </div>
    </Container>
  );
}
