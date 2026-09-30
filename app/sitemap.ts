import type { MetadataRoute } from "next";

const siteUrl = "https://khanalcwani.com";

const routes = [
  "",
  "/about",
  "/work",
  "/now",
  "/learning",
  "/writing",
  "/blogs",
  "/media",
  "/contact",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : route === "/blogs" ? 0.8 : 0.7,
  }));
}
