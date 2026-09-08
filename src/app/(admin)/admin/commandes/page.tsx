import Link from "next/link";
import { Container } from "@/components/layout/container";
import { buttonVariants } from "@/components/ui/button";
import {
  AdminNotConfigured,
  OrderTable,
  SignOutButton,
  guardAdminPage,
  getOrders,
} from "@/features/admin";
import { cn } from "@/lib/utils";

export default async function AdminOrdersPage() {
  const guard = await guardAdminPage();
  if (!guard.configured) return <AdminNotConfigured />;

  const orders = await getOrders();

  return (
    <Container className="py-12">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b pb-6">
        <div>
          <p className="label-eyebrow text-muted-foreground">Administration</p>
          <h1 className="mt-2 font-serif text-3xl font-light">Commandes</h1>
        </div>
        <div className="flex items-center gap-5">
          <Link
            href="/admin"
            className={cn(buttonVariants({ variant: "outline" }), "label-eyebrow")}
          >
            Catalogue
          </Link>
          <SignOutButton />
        </div>
      </div>
      <div className="mt-8">
        <OrderTable orders={orders} />
      </div>
    </Container>
  );
}
