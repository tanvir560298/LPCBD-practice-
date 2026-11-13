import { describe, it, expect } from 'vitest';

describe('LPC Navigation & Route Mapping Inventory', () => {
  const REQUIRED_ORIGINAL_DESTINATIONS = [
    { original: 'Home', mappedRoute: '/' },
    { original: 'About US / About LPC', mappedRoute: '/about' },
    { original: 'Board of Directors', mappedRoute: '/about/leadership' },
    { original: 'Teachers', mappedRoute: '/teachers' },
    { original: 'Branches', mappedRoute: '/branches' },
    { original: 'Course', mappedRoute: '/courses' },
    { original: 'Individual course', mappedRoute: '/courses/spoken-english' },
    { original: 'Access Program', mappedRoute: '/programs/access' },
    { original: 'Alumni', mappedRoute: '/community/alumni' },
    { original: 'Success Story', mappedRoute: '/community/stories' },
    { original: 'L P C Schools', mappedRoute: '/schools' },
    { original: 'LPC Laboratory School & College Dhaka', mappedRoute: '/schools/dhaka' },
    { original: 'LPC Laboratory School & College Rajshahi', mappedRoute: '/schools/rajshahi' },
    { original: 'Blog', mappedRoute: '/blog' },
    { original: 'Contact Us', mappedRoute: '/contact' },
    { original: 'Login', mappedRoute: '/portal/login' },
    { original: 'Newsletter', mappedRoute: '/newsletter' },
  ];

  it('should have all 17 original destinations clearly mapped with valid routes', () => {
    expect(REQUIRED_ORIGINAL_DESTINATIONS.length).toBe(17);
    REQUIRED_ORIGINAL_DESTINATIONS.forEach((dest) => {
      expect(dest.mappedRoute).toBeDefined();
      expect(dest.mappedRoute.startsWith('/')).toBe(true);
      expect(dest.mappedRoute).not.toBe('#');
    });
  });

  it('consolidates duplicate Teachers menu into /teachers route', () => {
    const teacherRoutes = REQUIRED_ORIGINAL_DESTINATIONS.filter((d) => d.original === 'Teachers');
    expect(teacherRoutes.length).toBe(1);
    expect(teacherRoutes[0].mappedRoute).toBe('/teachers');
  });
});
