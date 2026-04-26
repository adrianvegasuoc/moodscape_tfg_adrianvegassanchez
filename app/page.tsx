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
  return <PrivateHome searchParams={await searchParams} />;
}
