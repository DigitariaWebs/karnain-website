import { Container } from "@/components/layout/container";

export default function Loading() {
  return (
    <Container className="py-12 md:py-16">
      <div className="mt-8 grid gap-10 md:grid-cols-2 md:gap-16">
        <div className="bg-secondary aspect-[4/5] rounded-md motion-safe:animate-pulse" />
        <div className="space-y-4">
          <div className="bg-secondary h-3 w-24 rounded motion-safe:animate-pulse" />
          <div className="bg-secondary h-10 w-2/3 rounded motion-safe:animate-pulse" />
          <div className="bg-secondary h-4 w-1/2 rounded motion-safe:animate-pulse" />
          <div className="bg-secondary h-6 w-20 rounded motion-safe:animate-pulse" />
          <div className="bg-secondary h-24 w-full rounded motion-safe:animate-pulse" />
        </div>
      </div>
    </Container>
  );
}
