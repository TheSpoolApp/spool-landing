import { getBlogMetaMap } from '@/data/content';
import { OG_SIZE, renderOgImage } from '@/lib/ogImage';

export const size = OG_SIZE;
export const contentType = 'image/png';
export const alt = 'Spool blog post';

const blogMeta = getBlogMetaMap();

export function generateStaticParams() {
  return Object.keys(blogMeta).map((id) => ({ id }));
}

export default async function Image({ params }) {
  const { id } = await params;
  return renderOgImage({ title: blogMeta[id]?.title ?? 'The Spool Blog', eyebrow: 'Spool Blog' });
}
