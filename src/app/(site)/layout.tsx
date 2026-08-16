import { ScrollFlag } from "@/components/layout/scroll-flag";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { BagButton, CartDrawer, CartStoreProvider } from "@/features/cart";

/** Public site chrome: header (with the bag), footer, and the cart provider/drawer. */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartStoreProvider>
      <ScrollFlag />
      <div className="flex min-h-dvh flex-col">
        <SiteHeader bag={<BagButton />} />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </div>
      <CartDrawer />
    </CartStoreProvider>
  );
}
