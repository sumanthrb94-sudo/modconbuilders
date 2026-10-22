import type { MetadataRoute } from 'next';
import { site } from '@/content/site';

export default function sitemap(): MetadataRoute.Sitemap {
  return ['/', '/modcon-one', '/contact'].map((path) => ({
    url: `${site.url}${path === '/' ? '' : path}`,
    changeFrequency: 'monthly',
    priority: path === '/' ? 1 : 0.8,
  }));
}
