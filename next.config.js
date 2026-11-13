const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.alias['@'] = path.resolve(__dirname, 'src');
    return config;
  },
  async redirects() {
    return [
      {
        source: '/about-us',
        destination: '/about',
        permanent: true,
      },
      {
        source: '/board-of-directors',
        destination: '/about/leadership',
        permanent: true,
      },
      {
        source: '/course',
        destination: '/courses',
        permanent: true,
      },
      {
        source: '/product/:slug*',
        destination: '/courses',
        permanent: true,
      },
      {
        source: '/access-program-bangladesh',
        destination: '/programs/access',
        permanent: true,
      },
      {
        source: '/success-story',
        destination: '/community/stories',
        permanent: true,
      },
      {
        source: '/contact-us',
        destination: '/contact',
        permanent: true,
      },
      {
        source: '/l-p-c-school',
        destination: '/schools',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
