import type { Metadata } from "next";
import { getDictionary } from "@/core/i18n";
import { CartView } from "@/features/cart";

export const metadata: Metadata = {
  title: getDictionary().cart.title,
};

export default function CartPage() {
  return <CartView />;
}
