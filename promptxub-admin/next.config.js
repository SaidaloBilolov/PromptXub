/** @type {import('next').NextConfig} */
const nextConfig = {
  // Only enable standalone output mode for Docker builds; Vercel requires default deployment output
  ...(process.env.DOCKER_BUILD === 'true' ? { output: 'standalone' } : {}),
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ik.imagekit.io',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
    ],
  },
};

module.exports = nextConfig;
