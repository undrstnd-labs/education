import { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/login", "/register", "/about", "/support", "/welcome"],
      disallow: ["/dashboard", "/classroom", "/chat"],
    },
    sitemap: "https://undrstnd.vercel.app/sitemap.xml",
  }
}
