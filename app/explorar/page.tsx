import { redirect } from "next/navigation";

import { ExploreOverview } from "@/components/explore-views";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { buildTrendingTerms, getPostsByPromptTerm, getPublicPosts } from "@/lib/supabase/posts";

export default async function ExplorarPage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/descubre-moodscape");
  }

  const publicPosts = await getPublicPosts(supabase, 80);
  const trendTerms = buildTrendingTerms(publicPosts, 6);
  const trends = (
    await Promise.all(
      trendTerms.map(async (term) => ({
        term,
        posts: await getPostsByPromptTerm(supabase, term, undefined, 6)
      }))
    )
  ).filter((trend) => trend.posts.length > 0);

  return <ExploreOverview trends={trends} />;
}
