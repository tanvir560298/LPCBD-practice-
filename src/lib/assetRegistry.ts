/**
 * Central Asset Registry for LPC Bangladesh
 * Tracks asset source, license, crop ratio, minor consent requirements, and accessibility alt text.
 */

export interface TrackedAsset {
  id: string;
  category: 'wordmark' | 'course_thumbnail' | 'campus_photo' | 'student_avatar' | 'faculty_portrait';
  src: string;
  altText: string;
  aspectRatio: '1:1' | '16:9' | '4:3' | '3:2';
  sourceType: 'typographic_vector' | 'synthetic_placeholder' | 'licensed_photo' | 'official_approved';
  license: string;
  minorConsentRequired: boolean;
  notes: string;
}

export const ASSET_REGISTRY: Record<string, TrackedAsset> = {
  'lpc-provisional-wordmark': {
    id: 'lpc-provisional-wordmark',
    category: 'wordmark',
    src: '/assets/brand/lpc-wordmark.svg',
    altText: 'Language Proficiency Center (LPC) Bangladesh typographic crest wordmark',
    aspectRatio: '1:1',
    sourceType: 'typographic_vector',
    license: 'Internal project design prototype',
    minorConsentRequired: false,
    notes: 'Provisional typographic crest; official vector logo pending LPC administration handoff.',
  },
  'course-spoken-english': {
    id: 'course-spoken-english',
    category: 'course_thumbnail',
    src: '/assets/courses/spoken-english.jpg',
    altText: 'Interactive adult language lab discussion in a communicative English workshop',
    aspectRatio: '16:9',
    sourceType: 'synthetic_placeholder',
    license: 'Placeholder tokenized representation',
    minorConsentRequired: false,
    notes: 'To be replaced with verified LPC Dhaka language lab session photographs.',
  },
  'course-ielts-intensive': {
    id: 'course-ielts-intensive',
    category: 'course_thumbnail',
    src: '/assets/courses/ielts-intensive.jpg',
    altText: 'Student reviewing IELTS Academic Writing Task 2 rubric feedback',
    aspectRatio: '16:9',
    sourceType: 'synthetic_placeholder',
    license: 'Placeholder tokenized representation',
    minorConsentRequired: false,
    notes: 'Timed test simulation imagery.',
  },
  'access-program-classroom': {
    id: 'access-program-classroom',
    category: 'campus_photo',
    src: '/assets/programs/access-scholars.jpg',
    altText: 'English Access Microscholarship scholars engaged in collaborative community dialogue',
    aspectRatio: '16:9',
    sourceType: 'synthetic_placeholder',
    license: 'Pending partner attribution clearance',
    minorConsentRequired: true,
    notes: 'High caution: Minor students involved. Requires signed parental consent before publication.',
  },
  'school-dhaka-campus': {
    id: 'school-dhaka-campus',
    category: 'campus_photo',
    src: '/assets/schools/dhaka-campus.jpg',
    altText: 'LPC Laboratory School and College Dhanmondi campus academic building',
    aspectRatio: '4:3',
    sourceType: 'synthetic_placeholder',
    license: 'Pending official campus photography release',
    minorConsentRequired: false,
    notes: 'Awaiting high-resolution campus exterior photos from Dhaka school office.',
  },
};

