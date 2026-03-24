import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "SixInSixty",
    short_name: "SixInSixty",
    description: "6 categories. 1 letter. 60 seconds. How many can you get?",
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
