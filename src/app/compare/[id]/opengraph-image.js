import { getCompareMetaMap } from '@/data/content';
import { OG_SIZE, renderOgImage } from '@/lib/ogImage';

export const size = OG_SIZE;
export const contentType = 'image/png';
export const alt = 'Spool app comparison';

const compareMeta = getCompareMetaMap();

export function generateStaticParams() {
  return Object.keys(compareMeta).map((id) => ({ id }));
}

export default async function Image({ params }) {
  const { id } = await params;
  return renderOgImage({ title: compareMeta[id]?.title ?? 'Compare screen time apps', eyebrow: 'Comparison' });
}
