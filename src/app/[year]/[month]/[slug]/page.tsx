import Link from 'next/link';
import { formatDate, getPostByRelativeUri, getPostRelativeUris } from '../../../../lib/posts';
// import { GetStaticPropsContext } from 'next';

export async function generateStaticParams() {
  const postRelativePaths = getPostRelativeUris();
  const vals: PostSlugProps[] = postRelativePaths.map(relativePath => {
    const [year, month, ...slugPart] = relativePath.split('-');
    return {
      slug: slugPart.join('-').replace(/\.(md|html)$/, '') ,
      year,
      month,
    };
  });
  return vals;
}

export async function generateMetadata(props: Props) {
  const params = await props.params;
  const relativePath = params.year + '-' + params.month + '-' + params.slug;
  const post = getPostByRelativeUri(relativePath);
  return { title: post.metadata.title };
}

type PostSlugProps = {
  year: string;
  month: string;
  slug: string;
};

type Props = {
  params: Promise<PostSlugProps>;
};

export default async function PostPage(props: Props) {
  const params = await props.params;
  const { slug, month, year } = params;
  const relativePath = year + '-' + month + '-' + slug;
  const post = getPostByRelativeUri(relativePath);
  const { html: contentHtml } = post;

  return (
    <>
      {post?.metadata?.outdated && (
        <div className="mb-4 p-4 bg-yellow-100 text-yellow-800 rounded">
          ⚠️ This post is outdated and may contain information that is no longer accurate.
        </div>
      )}
      <Link href="/" className="mb-4 block">← About Jeff</Link>
      <article>
        <h1 className="text-3xl font-semibold leading-tight sm:text-4.5xl sm:font-bold">
          {post.metadata.title}
        </h1>
        <p className="mt-4 text-lg text-zinc-450">
          {formatDate(post.metadata.publishedAt || post.metadata.date)}
        </p>
        {post.metadata.jumbotron && post.metadata.jumbotronStyle && (
          <div
            className="mt-8 jumbotron"
            title={parseJumbotronData(post.metadata)?.title || ''}
          >
            <div
              className="img"
              style={{
                backgroundImage: parseJumbotronData(post.metadata).backgroundImage as string,
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
                backgroundPosition: 'right center',
                WebkitBackgroundSize: 'cover',
                overflow: 'hidden',
                minHeight: '435px',
              }}
            />
          </div>
        )}
        <div
          id="md"
          className="mt-12 leading-relaxed prose"
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />
      </article>

      
    </>
  );
}

function parseJumbotronData(metadata: Record<string, string>) {
  if (metadata.jumbotronStyle) {
    const backgroundImage = metadata.jumbotronStyle.match(/url\((.*?)\)/) || '';
    const title = metadata.jumbotronTitle || '';
    const props = { backgroundImage: backgroundImage[0], title };
    return props;
  }
  return { backgroundImage: '', title: '' };
}
