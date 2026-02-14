import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Letter Rush",
    short_name: "Letter Rush",
    description: "A daily word game. Get a letter, fill in the categories, beat the clock.",
    start_url: "/",
    display: "standalone",
    background_color: "#1a1f2e",
    theme_color: "#1a1f2e",
    icons: [
      {
        src: "/icon",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
