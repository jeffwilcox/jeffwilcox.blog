import { getAllPosts } from "@/lib/posts"

export const baseUrl = 'https://jeffwilcox.blog';
export const dynamic = "force-static";
export const revalidate = 120;

export default async function sitemap() {
  const blogs = getAllPosts().map((post) => ({
    url: `${baseUrl}/${post.uri}`,
    lastModified: post.metadata.publishedAt || post.metadata.date,
  }));

  const routes = [''].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString().split('T')[0],
  }));

  return [...routes, ...blogs];
}
