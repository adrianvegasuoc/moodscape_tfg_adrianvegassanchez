import { GeneratedImageResult } from "@/components/generated-image-result";
import { ImageGenerationForm } from "@/components/image-generation-form";
import { requireAuthenticatedUser } from "@/lib/supabase/auth";
import { getUserPosts } from "@/lib/supabase/posts";
import type { Post } from "@/types/posts";

type DashboardPageProps = {
  searchParams: Promise<{
    generated_post_id?: string;
    message?: string;
    type?: string;
  }>;
};

// Dashboard es una pagina privada: solo debe renderizarse con un usuario autenticado.
export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  // Si no hay sesion, este helper redirige automaticamente a login.
  const { supabase, user } = await requireAuthenticatedUser();
  // Los mensajes de exito o error se leen desde la URL tras crear una publicacion.
  const params = await searchParams;
  let posts: Post[] = [];

  try {
    // Leemos las publicaciones del usuario actual desde public.posts.
    posts = await getUserPosts(supabase, user.id);
  } catch (error) {
    // Si falla la lectura, mantenemos la pantalla de creacion sin romper el render principal.
    posts = [];
  }

  const generatedPost = params.generated_post_id
    ? posts.find((post) => post.id === params.generated_post_id)
    : undefined;
  const relatedPosts = posts
    .filter((post) => post.id !== generatedPost?.id && Boolean(post.image_url))
    .slice(0, 12);
  const authorLabel = (user.email ?? "moodscape").split("@")[0];

  return (
    <main className="page-shell dashboard-page">
      {generatedPost ? (
        <GeneratedImageResult
          authorLabel={authorLabel}
          post={generatedPost}
          relatedPosts={relatedPosts}
        />
      ) : (
        <ImageGenerationForm message={params.message} type={params.type} />
      )}
    </main>
  );
}
