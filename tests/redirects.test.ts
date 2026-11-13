import { describe, it, expect } from 'vitest';
const nextConfig = require('../next.config.js');

describe('Legacy URL 301 Redirect Rules', () => {
  it('should define redirect configuration in next.config.js', async () => {
    expect(nextConfig.redirects).toBeDefined();
    const redirects = await nextConfig.redirects();
    expect(Array.isArray(redirects)).toBe(true);
  });

  it('should permanently redirect legacy routes to correct target destinations', async () => {
    const redirects = await nextConfig.redirects();

    const expectedMappings = [
      { source: '/about-us', destination: '/about' },
      { source: '/board-of-directors', destination: '/about/leadership' },
      { source: '/course', destination: '/courses' },
      { source: '/product/:slug*', destination: '/courses' },
      { source: '/access-program-bangladesh', destination: '/programs/access' },
      { source: '/success-story', destination: '/community/stories' },
      { source: '/contact-us', destination: '/contact' },
      { source: '/l-p-c-school', destination: '/schools' },
      { source: '/l-p-c-school/lpc-laboratory-school-college-dhaka', destination: '/schools/dhaka' },
      { source: '/l-p-c-school/lpc-laboratory-school-college-rajshahi', destination: '/schools/rajshahi' },
    ];

    expectedMappings.forEach(({ source, destination }) => {
      const match = redirects.find((r: any) => r.source === source);
      expect(match).toBeDefined();
      expect(match.destination).toBe(destination);
      expect(match.permanent).toBe(true); // Must be 301 permanent redirect
    });
  });

  it('must not blanket-redirect unmapped legacy routes to homepage', async () => {
    const redirects = await nextConfig.redirects();
    const blanketHomeRedirect = redirects.find((r: any) => r.source === '/:path*' && r.destination === '/');
    expect(blanketHomeRedirect).toBeUndefined();
  });
});
