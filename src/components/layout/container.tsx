import { cn } from "@/lib/utils";

type ContainerProps = React.ComponentProps<"div">;

/** Shared page width + gutters (docs/conventions/styling.md). */
export function Container({ className, ...props }: ContainerProps) {
  return <div className={cn("mx-auto w-full max-w-6xl px-6 md:px-10", className)} {...props} />;
}
