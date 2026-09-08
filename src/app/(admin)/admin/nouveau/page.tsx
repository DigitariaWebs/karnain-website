import { Container } from "@/components/layout/container";
import { AdminNotConfigured, ProductForm, guardAdminPage } from "@/features/admin";

export default async function NewFragrancePage() {
  const guard = await guardAdminPage();
  if (!guard.configured) return <AdminNotConfigured />;

  return (
    <Container className="py-12">
      <p className="label-eyebrow text-muted-foreground">Administration</p>
      <h1 className="mt-2 font-serif text-3xl font-light">Nouvelle fragrance</h1>
      <div className="mt-8">
        <ProductForm />
      </div>
    </Container>
  );
}
