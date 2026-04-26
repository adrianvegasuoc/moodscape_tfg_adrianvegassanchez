import type { Route } from "next";

import { EmotionalMapGallery } from "@/components/emotional-map-gallery";
import { GeneratedImageResult } from "@/components/generated-image-result";
import { ImageGenerationForm } from "@/components/image-generation-form";
import { requireAuthenticatedUser } from "@/lib/supabase/auth";
import { extractPromptTerms, getPostsByPromptTerm, getUserPosts } from "@/lib/supabase/posts";
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
  const selectedPost = selectedPostId ? posts.find((post) => post.id === selectedPostId) : undefined;
  const authorLabel = getUserHandle(user);
  const relatedRows =
    selectedPost && selectedPost.prompt
      ? (
          await Promise.all(
            extractPromptTerms(selectedPost.prompt).map(async (term) => {
              const relatedPosts = await getPostsByPromptTerm(
                supabase,
                term,
                selectedPost.id,
                6
              );

              return {
                title: `Inspirado en ${term}`,
                posts: relatedPosts
              };
            })
          )
        ).filter((row) => row.posts.length > 0)
      : [];

  if (selectedPost) {
    return (
      <main className="page-shell dashboard-page">
        <GeneratedImageResult
          authorLabel={authorLabel}
          post={selectedPost}
          relatedRows={relatedRows}
        />
      </main>
    );
  }

  return (
    <main className="page-shell dashboard-page home-page">
      <ImageGenerationForm message={searchParams.message} type={searchParams.type} />

      <EmotionalMapGallery
        compact
        footerHref={"/mi-mapa-emocional" as Route}
        footerLabel="Ver completo"
        posts={posts.slice(0, 9)}
        title="Mis creaciones"
      />
    </main>
  );
}
