// Central site-wide identity and configuration used by metadata, structured
// data, sitemaps, robots, and Open Graph. Keep every URL and name in sync here.

// The production domain is injected at build time. Set NEXT_PUBLIC_SITE_URL
// in your environment (or .env.local) to override it, e.g.
// NEXT_PUBLIC_SITE_URL=https://pc-anatomy.brickshow.site
export const SITE_URL: string = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://pc-anatomy.brickshow.site"
).replace(/\/+$/, "");

export const SITE_NAME = "IDIC";
export const SITE_TITLE = "IDIC — Institute of Digital Intelligence Cambodia";
export const SITE_DESCRIPTION =
  "Explore computer hardware through an interactive 3D PC Anatomy experience. Learn about CPUs, RAM, motherboards, GPUs, storage, power supplies, and PC assembly.";
export const SITE_LANGUAGE = "en";

// Public project repository (open source).
export const GITHUB_URL = "https://github.com/brickshow/pc-anatomy";

// Real dates derived from the repository history. The component library was
// first published on 2026-08-06; the site was last revised when the SEO
// system shipped. Used only where Schema.org requires a publication date.
export const SITE_PUBLISHED_DATE = "2026-08-06";
export const SITE_REVISED_DATE = "2026-08-11";

// Absolute URL helper for canonical/OG/JSON-LD references.
export function absoluteUrl(path = "/"): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
