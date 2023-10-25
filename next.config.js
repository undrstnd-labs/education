/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["tailwindui.com"],
  },
  experimental: {
    scrollRestoration: true,
  },
};

module.exports = nextConfig;
