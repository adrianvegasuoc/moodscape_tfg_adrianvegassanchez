import { ProfileForm } from "@/components/profile-form";
import { requireAuthenticatedUser } from "@/lib/supabase/auth";
import { getUserHandle } from "@/lib/user";

type PerfilPageProps = {
  searchParams: Promise<{
    message?: string;
    type?: string;
  }>;
};

export default async function PerfilPage({ searchParams }: PerfilPageProps) {
  const { user } = await requireAuthenticatedUser();
  const params = await searchParams;

  return (
    <main className="page-shell">
      <ProfileForm
        email={user.email ?? ""}
        message={params.message}
        type={params.type}
        username={getUserHandle(user)}
      />
    </main>
  );
}
