import type { NextConfig } from 'next';

/** The WordPress host, so its media is allowed through next/image on every environment. */
const wordpressUrl = (() => {
  try {
    return new URL(process.env.NEXT_PUBLIC_WORDPRESS_URL ?? 'http://vine-house-ministries.local');
  } catch {
    return new URL('http://vine-house-ministries.local');
  }
})();

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
      // WordPress media: the LocalWP host in development, the Bluehost host
      // in production, both read from NEXT_PUBLIC_WORDPRESS_URL.
      {
        protocol: wordpressUrl.protocol.replace(':', '') as 'http' | 'https',
        hostname: wordpressUrl.hostname,
        port: wordpressUrl.port,
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
