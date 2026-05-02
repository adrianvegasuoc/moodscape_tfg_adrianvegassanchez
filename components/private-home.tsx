import type { Route } from "next";

import { EmotionalMapGallery } from "@/components/emotional-map-gallery";
import { GeneratedImageResult } from "@/components/generated-image-result";
import { ImageGenerationForm } from "@/components/image-generation-form";
import { InspirationCard } from "@/components/inspiration-card";
import { getUserHandleById } from "@/lib/supabase/admin";
import { requireAuthenticatedUser } from "@/lib/supabase/auth";
import {
  extractPromptTerms,
  getFallbackRecommendedPosts,
  getPostsByPromptTerm,
  getVisiblePostById,
  getUserPosts
} from "@/lib/supabase/posts";
import { getUserHandle } from "@/lib/user";
import type { Post } from "@/types/posts";

type PrivateHomeProps = {
  searchParams: {
    generated_post_id?: string;
    message?: string;
    post_id?: string;
    type?: string;
  };
};

export async function PrivateHome({ searchParams }: PrivateHomeProps) {
  const { supabase, user } = await requireAuthenticatedUser();
  let posts: Post[] = [];

  try {
    posts = await getUserPosts(supabase, user.id);
  } catch {
    posts = [];
  }

  const selectedPostId = searchParams.post_id ?? searchParams.generated_post_id;
  const ownSelectedPost = selectedPostId ? posts.find((post) => post.id === selectedPostId) : undefined;
  const selectedPost =
    ownSelectedPost ??
    (selectedPostId ? await getVisiblePostById(supabase, selectedPostId) : undefined) ??
    undefined;
  const authorLabel = selectedPost
    ? selectedPost.user_id === user.id
      ? getUserHandle(user)
      : (await getUserHandleById(selectedPost.user_id)) ?? undefined
    : undefined;
  const relatedRows =
    selectedPost && selectedPost.prompt
      ? (
          await Promise.all(
            extractPromptTerms(selectedPost.prompt).map(async (term) => {
              const relatedPosts = await getPostsByPromptTerm(
                supabase,
                term,
                selectedPost.id,
                3
              );

              return {
                title: `Inspirado en ${term}`,
                posts: relatedPosts
              };
            })
          )
        ).filter((row) => row.posts.length > 0)
      : [];
  const fallbackPosts =
    selectedPost && relatedRows.length === 0
      ? await getFallbackRecommendedPosts(supabase, selectedPost.id, 3)
      : [];
  const displayRows =
    relatedRows.length > 0
      ? relatedRows
      : fallbackPosts.length > 0
        ? [
            {
              title: "Mas creaciones para explorar",
              posts: fallbackPosts
            }
          ]
        : [];

  if (selectedPost) {
    return (
      <main className="page-shell dashboard-page">
        <GeneratedImageResult
          authorLabel={authorLabel}
          post={selectedPost}
          relatedRows={displayRows}
        />
      </main>
    );
  }

  return (
    <main className="page-shell dashboard-page home-page">
      <ImageGenerationForm message={searchParams.message} type={searchParams.type} />

      <div className="home-discovery-grid">
        <EmotionalMapGallery
          compact
          description="Revisa las imágenes que has creado recientemente."
          footerHref={"/mi-mapa-emocional" as Route}
          footerLabel="Ver mi mapa emocional"
          posts={posts.slice(0, 3)}
          title="Tus últimos momentos"
        />

        <InspirationCard />
      </div>
    </main>
  );
}
