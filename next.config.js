const createNextIntlPlugin = require("next-intl/plugin")

const withNextIntl = createNextIntlPlugin("./lib/i18n.ts")
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "tailwindui.com",
        port: "",
        pathname: "/img/component-images/**",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
        port: "",
      },
      {
        protocol: "https",
        hostname: "avatars.jakerunzer.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "owevajnqzufpffslceev.supabase.co",
        port: "",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "undrstnd.vercel.app",
        port: "",
      },
    ],
  },
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    config.resolve.alias.canvas = false
    config.resolve.alias.encoding = false

    return config
  },
}

module.exports = withNextIntl(nextConfig)
