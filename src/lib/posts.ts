import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { fileURLToPath } from 'url';
import { remark } from 'remark';
import html from 'remark-html';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const postsDirectory = path.join(dirname, '../../', '_posts');

function getPostContentFiles(dir: string): string[] {
  let results: string[] = [];
  const list = fs.readdirSync(dir);

  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat && stat.isDirectory()) {
      results = results.concat(getPostContentFiles(filePath));
    } else if (file.endsWith('.md') || file.endsWith('.html')) {
      results.push(filePath);
    }
  });

  return results;
}

function getRelativeUriFromPath(filePath: string): string {
  const relativePath = path.relative(postsDirectory, filePath);
  const [year, month, /* day */, ...slugParts] = relativePath.split('-' /* not path.sep */);
  const relativePathResolved = year + '-' + month + '-' + slugParts.join('-').replace(/\.(md|html)$/, '');
  return relativePathResolved;
}

function getDateFromPath(filePath: string): Date {
  let relativePath = path.relative(postsDirectory, filePath);
  relativePath = relativePath.replaceAll(path.sep, '-');
  const parts = relativePath.split('-');
  if (!parts.slice(0, 3).every(part => /^\d+$/.test(part))) {
    throw new Error('Invalid date in path: ' + relativePath);
  }
  return new Date(parts.slice(0, 3).join('-')); // Create a date like '2005-01-01'
}

export function getPostRelativeUris() {
  const files = getPostContentFiles(postsDirectory);
  return files.map(file => getRelativeUriFromPath(file));
}

export function getPostByRelativeUri(relativeUri: string) {
  if (relativeUri.includes('.md') || relativeUri.includes('.html')) {
    throw new Error('Invalid relative path with an extension: ' + relativeUri);
  }
  relativeUri = relativeUri.replaceAll('/', '-');
  const [year, month, ...slugParts] = relativeUri.split('-');
  const slug = slugParts.join('-');
  const uri = `${year}/${month}/${slug}`;
  // the relative path does not include the day number, so we need
  // to use the year-month prefix and also the slug to try to find the file
  const matchingPaths = fs.readdirSync(postsDirectory).filter(file => {
    return file.startsWith(`${year}-${month}-`) && ((file.endsWith('-' + slug + '.md') || file.endsWith('-' + slug + '.html')));
  });
  if (matchingPaths.length === 0) {
    throw new Error('No matching file found for relative path: ' + relativeUri);
  } else if (matchingPaths.length > 1) {
    throw new Error('Multiple matching files found for relative path: ' + relativeUri + '... ' + matchingPaths.join(', '));
  }
  const filePath = path.join(postsDirectory, matchingPaths[0]);
  const contentType: 'markdown' | 'html' = filePath.endsWith('.md') ? 'markdown' : 'html';
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(fileContents);
  const slugDate = getDateFromPath(filePath);
  if (!data.date) {
    // the date is in the slug
    data.date = slugDate.toISOString().split('T')[0];
  }

  let contentHtml = '';
  if (contentType === 'markdown') {
    contentHtml = remark().use(html, {
      sanitize: false,
    }).processSync(content).toString();
  } else {
    contentHtml = content.replace(/\[RAW\]/g, '').replace(/\[\/RAW\]/g, '');
  }

  // CDN
  contentHtml = contentHtml.replaceAll('{{ site.cdn }}', 'https://waz.blob.core.windows.net/waz/');

  // some ancient html fun
  if (data.title.includes('&amp;')) {
    data.title = data.title.replaceAll('&amp;', '&');
  }

  return { relativePath: relativeUri, uri, slug, path: filePath, metadata: data, content, html: contentHtml };
}

export function getAllPosts(excludeOutdated = true) {
  const relativePaths = getPostRelativeUris();
  let posts = relativePaths.map(rp => getPostByRelativeUri(rp));

  posts = posts.sort((a, b) =>
    new Date(b.metadata.date).getTime() - new Date(a.metadata.date).getTime()
  );

  if (excludeOutdated) {
    posts = posts.filter(post => {
      return !post.metadata.outdated;
    });
  }

  return posts;
}

// https://github.com/vercel/examples/blob/main/solutions/blog/app/blog/utils.ts sample
export function formatDate(date: string, includeRelative = false) {
  const currentDate = new Date();
  if (!date.includes('T')) {
    date = `${date}T00:00:00`;
  }
  const targetDate = new Date(date);

  const yearsAgo = currentDate.getFullYear() - targetDate.getFullYear();
  const monthsAgo = currentDate.getMonth() - targetDate.getMonth();
  const daysAgo = currentDate.getDate() - targetDate.getDate();

  let formattedDate = '';

  if (yearsAgo > 0) {
    formattedDate = `${yearsAgo}y ago`;
  } else if (monthsAgo > 0) {
    formattedDate = `${monthsAgo}mo ago`;
  } else if (daysAgo > 0) {
    formattedDate = `${daysAgo}d ago`;
  } else {
    formattedDate = 'Today';
  }

  const fullDate = targetDate.toLocaleString('en-us', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  if (!includeRelative) {
    return fullDate;
  }

  return `${fullDate} (${formattedDate})`;
}
