import { type MetadataRoute } from "next/dist/lib/metadata/types/metadata-interface";

import { env } from "constants/env";
import { url } from "constants/url";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        disallow: !env.isProduction ? "/" : "",
      },
    ],
    sitemap: new URL("/sitemap.xml", url).href,
  };
}
