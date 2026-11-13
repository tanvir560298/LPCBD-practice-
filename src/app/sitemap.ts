import { MetadataRoute } from 'next';
import { SYNTHETIC_COURSES } from '@/lib/mockData';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://lpcbd.org';

  const publicRoutes = [
    '',
    '/about',
    '/about/leadership',
    '/teachers',
    '/courses',
    '/programs/access',
    '/schools',
    '/schools/dhaka',
    '/schools/rajshahi',
    '/community/stories',
    '/community/alumni',
    '/blog',
    '/branches',
    '/contact',
    '/newsletter',
  ];

  const staticEntries: MetadataRoute.Sitemap = publicRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' || route === '/courses' ? 'weekly' : 'monthly',
    priority: route === '' ? 1.0 : route === '/courses' ? 0.9 : 0.7,
  }));

  const courseEntries: MetadataRoute.Sitemap = SYNTHETIC_COURSES.map((course) => ({
    url: `${baseUrl}/courses/${course.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [...staticEntries, ...courseEntries];
}

