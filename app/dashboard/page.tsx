import { PrivateHome } from "@/components/private-home";

type DashboardPageProps = {
  searchParams: Promise<{
    generated_post_id?: string;
    message?: string;
    type?: string;
  }>;
};

// Dashboard es una pagina privada: solo debe renderizarse con un usuario autenticado.
export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  return <PrivateHome searchParams={await searchParams} />;
}
