import { BlogPosts } from '@/components/posts';

export default function Page() {
  return (
    <section>
      <section className="mt-12">
        <h2 className="text-2.5xl font-semibold sm:font-bold">Blog</h2>
        <div className="mt-4 flex flex-col gap-y-4">
          <BlogPosts />
        </div>
      </section>
    </section>
  )
}
