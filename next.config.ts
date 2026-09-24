import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  turbopack: {},
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    // Optimise in production (Vercel fetches and caches upstream quickly);
    // skip it in development, where proxying 1800px placeholders from
    // Unsplash through the dev server times out and 500s the srcset.
    unoptimized: process.env.NODE_ENV === 'development',
    remotePatterns: [
      // WordPress media. The LocalWP host in development; set the production
      // host once the Bluehost domain is known.
      {
        protocol: 'http',
        hostname: 'vine-house-ministries.local',
        port: '',
        pathname: '/wp-content/uploads/**',
      },
      // Placeholder imagery, to be replaced by WordPress media as content migrates.
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
  transpilePackages: ['motion'],
  webpack: (config, { dev }) => {
    if (dev && process.env.DISABLE_HMR === 'true') {
      config.watchOptions = {
        ignored: /.*/,
      };
    }
    return config;
  },
};

export default nextConfig;
