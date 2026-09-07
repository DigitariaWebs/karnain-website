import { notFound, redirect } from "next/navigation";
import { Container } from "@/components/layout/container";
import { AdminNotConfigured, ProductForm, getAdminUser } from "@/features/admin";
import { getFragranceForAdmin } from "@/features/catalog";

export default async function EditFragrancePage({ params }: { params: Promise<{ slug: string }> }) {
  const session = await getAdminUser();
  if (!session.configured) return <AdminNotConfigured />;
  if (!session.user) redirect("/admin/login");

  const { slug } = await params;
  const fragrance = await getFragranceForAdmin(slug);
  if (!fragrance) notFound();

  return (
    <Container className="py-12">
      <p className="label-eyebrow text-muted-foreground">Modifier</p>
      <h1 className="mt-2 font-serif text-3xl font-light">{fragrance.name}</h1>
      <div className="mt-8">
        <ProductForm initial={fragrance} />
      </div>
    </Container>
  );
}
