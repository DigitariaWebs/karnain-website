import Link from "next/link";
import { formatEur } from "@/lib/format";
import type { Order, OrderStatus } from "../orders";

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  pending: "En attente",
  paid: "Payée",
  fulfilled: "Expédiée",
  cancelled: "Annulée",
};

const th = "label-eyebrow text-muted-foreground py-3 font-medium";

export function OrderTable({ orders }: { orders: readonly Order[] }) {
  if (orders.length === 0) {
    return <p className="text-muted-foreground py-10 text-sm">Aucune commande pour l’instant.</p>;
  }
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b text-left">
          <th className={th}>Date</th>
          <th className={th}>Client</th>
          <th className={th}>Articles</th>
          <th className={th}>Total</th>
          <th className={th}>Statut</th>
        </tr>
      </thead>
      <tbody>
        {orders.map((order) => (
          <tr key={order.id} className="border-b">
            <td className="py-3">
              <Link href={`/admin/commandes/${order.id}`} className="hover:underline">
                {new Date(order.createdAt).toLocaleDateString("fr-FR")}
              </Link>
            </td>
            <td className="text-muted-foreground py-3">
              {order.customerName || order.email || "—"}
            </td>
            <td className="text-muted-foreground py-3">
              {order.items.reduce((count, item) => count + item.quantity, 0)}
            </td>
            <td className="py-3">{formatEur(order.totalEur)}</td>
            <td className="py-3">{ORDER_STATUS_LABEL[order.status]}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
