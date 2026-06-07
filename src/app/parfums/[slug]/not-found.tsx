import Link from "next/link";
import { Container } from "@/components/layout/container";
import { buttonVariants } from "@/components/ui/button";
import { getDictionary } from "@/core/i18n";
import { cn } from "@/lib/utils";

export default function FragranceNotFound() {
  const t = getDictionary().product;
  return (
    <Container className="flex flex-col items-center gap-5 py-24 text-center">
      <h1 className="font-serif text-3xl font-light">{t.notFoundTitle}</h1>
      <p className="text-muted-foreground">{t.notFoundBody}</p>
      <Link href="/#collection" className={cn(buttonVariants(), "label-eyebrow")}>
        {t.backToCollection}
      </Link>
    </Container>
  );
}
