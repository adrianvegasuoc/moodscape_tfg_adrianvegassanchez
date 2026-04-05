import { AppShell } from "@/components/app-shell";
import { isSupabaseConfigured } from "@/lib/env";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export default async function HomePage() {
  if (!isSupabaseConfigured()) {
    return <AppShell userEmail={null} />;
  }

  const supabase = await createServerSupabaseClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  return <AppShell userEmail={user?.email ?? null} />;
}
