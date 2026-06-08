import "server-only";
import { isSupabaseConfigured } from "@/core/supabase/config";
import { createSupabaseServerClient } from "@/core/supabase/server";

export type OrderStatus = "pending" | "paid" | "fulfilled" | "cancelled";

export type OrderItem = {
  slug: string;
  name: string;
  priceEur: number;
  quantity: number;
};

export type Order = {
  id: string;
  status: OrderStatus;
  email: string;
  customerName: string;
  totalEur: number;
  createdAt: string;
  items: OrderItem[];
};

type OrderRow = {
  id: string;
  status: string;
  email: string | null;
  customer_name: string | null;
  total_eur: number;
  created_at: string;
  order_items: { slug: string; name: string; price_eur: number; quantity: number }[] | null;
};

const SELECT =
  "id, status, email, customer_name, total_eur, created_at, order_items(slug, name, price_eur, quantity)";

const STATUSES: readonly OrderStatus[] = ["pending", "paid", "fulfilled", "cancelled"];

function mapOrder(row: OrderRow): Order {
  return {
    id: row.id,
    status: STATUSES.includes(row.status as OrderStatus) ? (row.status as OrderStatus) : "pending",
    email: row.email ?? "",
    customerName: row.customer_name ?? "",
    totalEur: row.total_eur,
    createdAt: row.created_at,
    items: (row.order_items ?? []).map((item) => ({
      slug: item.slug,
      name: item.name,
      priceEur: item.price_eur,
      quantity: item.quantity,
    })),
  };
}

/** All orders, newest first. Returns `[]` when Supabase is unconfigured. RLS limits rows to the
 * signed-in admin (the server client carries their session). */
export async function getOrders(): Promise<Order[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.from("orders").select(SELECT).order("created_at", {
    ascending: false,
  });
  return ((data ?? []) as unknown as OrderRow[]).map(mapOrder);
}

export async function getOrder(id: string): Promise<Order | null> {
  if (!isSupabaseConfigured()) return null;
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.from("orders").select(SELECT).eq("id", id).maybeSingle();
  return data ? mapOrder(data as unknown as OrderRow) : null;
}
