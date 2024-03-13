const createNextIntlPlugin = require("next-intl/plugin");

const withNextIntl = createNextIntlPlugin();
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "tailwindui.com",
        port: "",
        pathname: "/img/component-images/**",
      },
    ],
  },
};

module.exports = withNextIntl(nextConfig);
