import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    // Wikimedia Commons is used for the port/networking reference photos in
    // the Explore page's "Key Differences" modal. Special:FilePath resolves
    // stable filenames to files hosted on upload.wikimedia.org.
    remotePatterns: [
      { protocol: "https", hostname: "commons.wikimedia.org" },
      { protocol: "https", hostname: "upload.wikimedia.org" },
    ],
  },
  async redirects() {
    return [
      // Old slugs that moved to SEO-friendly canonical URLs. Handled at the
      // routing layer so crawlers receive a real 307 HTTP redirect (redirect()
      // in the page body would be inlined client-side on static pages).
      { source: "/components/psu", destination: "/components/power-supply", permanent: false },
      { source: "/components/case", destination: "/components/pc-case", permanent: false },
    ];
  },
};

export default nextConfig;
