import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/login", "/register"],
        disallow: [
          "/api/",
          "/admin",
          "/super-admin",
          "/dashboard",
          "/reveal",
          "/wishlist",
          "/invite/",
          "/reset-password",
          "/forgot-password",
        ],
      },
    ],
    sitemap: "https://thesantacircle.com/sitemap.xml",
  };
}
