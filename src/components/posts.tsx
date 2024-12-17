import Link from 'next/link'

import { formatDate, getAllPosts } from '@/lib/posts'

export function BlogPostsHomepage() {
  const allBlogs = getAllPosts();
  const maxPosts = 5;

  return (
    <div>
      {allBlogs
        .sort((a, b) => {
          if (
            new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt)
          ) {
            return -1
          }
          return 1
        })
        .slice(0, maxPosts)
        .map((post) => (
          <Link
            key={post.slug}
            className="flex flex-col space-y-1 mb-4"
            href={`/${post.uri}`}
          >
            <div className="mt-6">
              <p className="text-neutral-900 dark:text-neutral-100 tracking-tight">
                {post.metadata.title}
                {post.metadata.outdated && (
                  <span className="ml-2 text-yellow-600 dark:text-yellow-400 text-sm">
                    (Outdated)
                  </span>
                )}
              </p>
              <p className="text-neutral-600 dark:text-neutral-400 tabular-nums">
                {formatDate(post.metadata.publishedAt || post.metadata.date, false)}
              </p>
            </div>
          </Link>
        ))}
    </div>
  )
}

export function BlogPosts() {
  const allBlogs = getAllPosts(false);

  return (
    <div>
      {allBlogs
        .sort((a, b) => {
          if (
            new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt)
          ) {
            return -1
          }
          return 1
        })
        .map((post) => (
          <Link
            key={post.slug}
            className="flex flex-col space-y-1 mb-4"
            href={`/${post.uri}`}
          >
            <div className="w-full flex flex-col md:flex-row space-x-0 md:space-x-2">
              <p className="text-neutral-600 dark:text-neutral-400 w-[100px] tabular-nums">
                {formatDate(post.metadata.publishedAt || post.metadata.date, false)}
              </p>
              <p className="text-neutral-900 dark:text-neutral-100 tracking-tight">
                {post.metadata.title}
                {post.metadata.outdated && (
                  <span className="ml-2 text-yellow-600 dark:text-yellow-400 text-sm">
                    (Outdated)
                  </span>
                )}
              </p>
            </div>
          </Link>
        ))}
    </div>
  )
}
