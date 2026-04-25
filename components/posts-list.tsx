import Image from "next/image";

import type { Post } from "@/types/posts";

type PostsListProps = {
  posts: Post[];
  errorMessage?: string;
};

// Este listado muestra solo publicaciones del usuario autenticado que ya fueron filtradas en servidor.
export function PostsList({ posts, errorMessage }: PostsListProps) {
  return (
    <section className="panel">
      <h2>Mis ultimas publicaciones</h2>

      {errorMessage ? (
        <p className="feedback feedback-error">{errorMessage}</p>
      ) : posts.length === 0 ? (
        <p className="helper-text">Todavia no has creado publicaciones de prueba.</p>
      ) : (
        <ul className="posts-list">
          {posts.map((post) => (
            <li className="post-item" key={post.id}>
              <div className="post-meta">
                {/* Mostramos una fecha legible para la revision manual del flujo de prueba. */}
                <strong>{new Date(post.created_at).toLocaleString("es-ES")}</strong>
                <span>{post.is_public ? "Publica" : "Privada"}</span>
              </div>
              {post.image_url ? (
                <Image
                  alt={`Imagen generada para: ${post.prompt}`}
                  className="post-image"
                  height={1024}
                  src={post.image_url}
                  unoptimized
                  width={1024}
                />
              ) : null}
              <p>{post.prompt}</p>
              {post.image_url ? (
                <a href={post.image_url} rel="noreferrer" target="_blank">
                  Ver imagen
                </a>
              ) : (
                <span className="helper-text">Sin imagen asociada</span>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
