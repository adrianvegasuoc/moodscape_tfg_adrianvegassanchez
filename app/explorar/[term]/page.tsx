import { ExploreDetail } from "@/components/explore-views";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { buildTrendingTerms, getPostsByPromptTerm, getPublicPosts } from "@/lib/supabase/posts";

type ExploreDetailPageProps = {
  params: Promise<{
    term: string;
  }>;
  searchParams: Promise<{
    view?: string;
  }>;
};

export default async function ExploreDetailPage({ params, searchParams }: ExploreDetailPageProps) {
  const { term } = await params;
  const resolvedSearchParams = await searchParams;
  const supabase = await createServerSupabaseClient();
  const decodedTerm = decodeURIComponent(term);
  const posts = await getPostsByPromptTerm(supabase, decodedTerm, undefined, 18);
  const publicPosts = await getPublicPosts(supabase, 80);
  const trends = buildTrendingTerms(publicPosts, 6);
  const isExpanded = resolvedSearchParams.view === "expanded";

  return (
    <ExploreDetail
      currentTerm={decodedTerm}
      isExpanded={isExpanded}
      posts={posts}
      trends={trends}
    />
  );
}
