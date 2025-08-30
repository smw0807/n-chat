import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      new URL('http://k.kakaocdn.net/**'),
      new URL('https://lh3.googleusercontent.com/**'),
    ],
  },
};

export default nextConfig;
