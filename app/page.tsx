import { PrivateHome } from "@/components/private-home";

type HomePageProps = {
  searchParams: Promise<{
    generated_post_id?: string;
    message?: string;
    post_id?: string;
    type?: string;
  }>;
};

export default async function HomePage({ searchParams }: HomePageProps) {
  // La Home privada concentra el flujo principal y recibe feedback por query params.
  return <PrivateHome searchParams={await searchParams} />;
}
