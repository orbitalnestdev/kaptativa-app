// Posts del blog. Vacío a pedido: los artículos anteriores se eliminaron (/blog redirige a la home).
// Para publicar, agregá objetos con { id, title, slug, ... } y volvé a mostrar el link "Blog" en Header y Footer.
export const BLOG_POSTS = [];

export function getPostBySlug(slug) {
  return BLOG_POSTS.find(p => p.slug === slug);
}

