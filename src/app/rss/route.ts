import { getAllPosts } from '@/lib/posts'
import { baseUrl } from '../sitemap'
export const dynamic = "force-static";
export const revalidate = 120;

export async function GET() {
  const allBlogs = getAllPosts();

  const itemsXml = allBlogs
    .sort((a, b) => {
      if (new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt)) {
        return -1
      }
      return 1
    })
    .map(
      (post) =>
        `<item>
          <title>${post.metadata.title.replaceAll('&', '&amp;')}</title>
          <link>${baseUrl}/${post.uri}</link>
          <description>${post.metadata?.summary || ''}</description>
          <pubDate>${new Date(
            post.metadata.publishedAt || post.metadata.date
          ).toUTCString()}</pubDate>
        </item>`
    )
    .join('\n')

  const rssFeed = `<?xml version="1.0" encoding="UTF-8" ?>
  <rss version="2.0">
    <channel>
        <title>Personal Site of Jeff Wilcox</title>
        <link>${baseUrl}</link>
        <description>RSS feed for the personal blog of Jeff Wilcox, Principal Engineer, Microsoft</description>
        ${itemsXml}
    </channel>
  </rss>`

  return new Response(rssFeed, {
    headers: {
      'Content-Type': 'text/xml',
    },
  })
}
