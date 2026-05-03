import { PersonalEmotionalMap } from "@/components/personal-emotional-map";
import { requireAuthenticatedUser } from "@/lib/supabase/auth";
import { getUserPosts } from "@/lib/supabase/posts";
import type { Post } from "@/types/posts";

export default async function EmotionalMapPage() {
  const { supabase, user } = await requireAuthenticatedUser();
  let posts: Post[] = [];

  try {
    posts = await getUserPosts(supabase, user.id);
  } catch {
    posts = [];
  }

  return (
    <main className="page-shell emotional-map-page">
      <PersonalEmotionalMap posts={posts} />
    </main>
  );
}
