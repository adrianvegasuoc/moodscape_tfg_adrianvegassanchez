import { DashboardHeader } from "@/components/dashboard-header";
import { GeneratedImageResult } from "@/components/generated-image-result";
import { ImageGenerationForm } from "@/components/image-generation-form";
import { PostsList } from "@/components/posts-list";
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
  let postsError: string | undefined;

  try {
    // Leemos las publicaciones del usuario actual desde public.posts.
    posts = await getUserPosts(supabase, user.id);
  } catch (error) {
    // Si falla la lectura, seguimos renderizando la pagina con feedback visible.
    postsError =
      error instanceof Error ? error.message : "No se pudieron cargar las publicaciones.";
  }

  const generatedPost = params.generated_post_id
    ? posts.find((post) => post.id === params.generated_post_id)
    : undefined;

  return (
    <main className="page-shell">
      {/* Header minimo con email del usuario y accion de cierre de sesion. */}
      <DashboardHeader email={user.email ?? "usuario"} />

      <section className="landing">
        <h1>Dashboard</h1>
        <p>
          Esta es la zona protegida de Moodscape. Desde aqui puedes generar una imagen con
          OpenAI, guardarla en Supabase Storage y persistir su URL en <code>public.posts</code>.
        </p>
      </section>

      {generatedPost ? <GeneratedImageResult post={generatedPost} /> : null}

      {/* Separamos formulario y listado para mantener el dashboard simple y modular. */}
      <div className="dashboard-grid">
        <ImageGenerationForm message={params.message} type={params.type} />
        <PostsList errorMessage={postsError} posts={posts} />
      </div>
    </main>
  );
}
