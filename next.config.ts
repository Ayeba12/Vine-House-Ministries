import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  turbopack: {},
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
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
