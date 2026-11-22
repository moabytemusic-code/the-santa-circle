import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/login",
          "/register",
          "/white-elephant-vs-secret-santa",
          "/white-elephant-rules",
          "/generator-for-secret-santa",
          "/secret-santa-app",
          "/secret-santa-wishlist",
          "/secret-santa-generator-with-exclusions",
          "/gift-guides",
          "/games-bundle",
        ],
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
