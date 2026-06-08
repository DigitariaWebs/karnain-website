import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Container } from "@/components/layout/container";
import { AdminNotConfigured, OrderStatusForm, getAdminUser, getOrder } from "@/features/admin";
import { formatEur } from "@/lib/format";

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getAdminUser();
  if (!session.configured) return <AdminNotConfigured />;
  if (!session.user) redirect("/admin/login");

  const { id } = await params;
  const order = await getOrder(id);
  if (!order) notFound();

  return (
    <Container className="py-12">
      <Link
        href="/admin/commandes"
        className="label-eyebrow text-muted-foreground hover:text-foreground"
      >
        ← Commandes
      </Link>
      <h1 className="mt-3 font-serif text-3xl font-light">Commande</h1>
      <p className="text-muted-foreground mt-1 text-sm">
        {new Date(order.createdAt).toLocaleString("fr-FR")}
      </p>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1.5fr_1fr]">
        <div>
          <ul className="divide-y border-t border-b">
            {order.items.map((item) => (
              <li key={item.slug} className="flex justify-between py-3 text-sm">
                <span>
                  {item.name} × {item.quantity}
                </span>
                <span>{formatEur(item.priceEur * item.quantity)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex justify-between font-medium">
            <span>Total</span>
            <span>{formatEur(order.totalEur)}</span>
          </div>
        </div>

        <aside className="space-y-6">
          <div>
            <p className="label-eyebrow text-muted-foreground">Client</p>
            <p className="mt-1 text-sm">{order.customerName || "—"}</p>
            <p className="text-muted-foreground text-sm">{order.email || "—"}</p>
          </div>
          <OrderStatusForm id={order.id} status={order.status} />
        </aside>
      </div>
    </Container>
  );
}
