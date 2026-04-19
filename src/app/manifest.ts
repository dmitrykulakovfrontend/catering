import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Любимый Кейтеринг · Lovely Catering",
    short_name: "Любимый Кейтеринг",
    description:
      "Любимый Кейтеринг (Lovely Catering) — кейтеринг в Москве: банкеты, фуршеты, корпоративы, свадьбы.",
    start_url: "/",
    display: "standalone",
    background_color: "#F7F8FB",
    theme_color: "#1A1A1A",
    lang: "ru",
    icons: [
      { src: "/icon.png", sizes: "512x512", type: "image/png" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
