import { ExploreDetail } from "@/components/explore-views";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { buildTrendingTerms, getPostsByPromptTerm, getPublicPosts } from "@/lib/supabase/posts";

type ExploreDetailPageProps = {
  params: Promise<{
    term: string;
  }>;
};

export default async function ExploreDetailPage({ params }: ExploreDetailPageProps) {
  const { term } = await params;
  const supabase = await createServerSupabaseClient();
  const decodedTerm = decodeURIComponent(term);
  const posts = await getPostsByPromptTerm(supabase, decodedTerm, undefined, 18);
  const publicPosts = await getPublicPosts(supabase, 80);
  const trends = buildTrendingTerms(publicPosts, 6);

  return <ExploreDetail currentTerm={decodedTerm} posts={posts} trends={trends} />;
}
