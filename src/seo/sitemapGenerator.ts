// Programmatic Sitemap, RSS Feed & Robots.txt Generator
import { PLANETS, HOUSES, SIGNS, NAKSHATRAS, HIGH_INTENT_LANDINGS } from "./astrologyData";

const DEFAULT_BASE_URL = process.env.APP_URL || "https://vedanga-ai.vercel.app";

export function generateRobotsTxt(customBaseUrl?: string): string {
  const BASE_URL = customBaseUrl || DEFAULT_BASE_URL;
  return `User-agent: *
Allow: /
Allow: /learn/
Allow: /article/
Allow: /sitemap*.xml

Sitemap: ${BASE_URL}/sitemap.xml
Sitemap: ${BASE_URL}/sitemap-articles.xml
Sitemap: ${BASE_URL}/sitemap-astrology-combinatorics.xml
Sitemap: ${BASE_URL}/sitemap-landing.xml
Sitemap: ${BASE_URL}/sitemap-news.xml
`;
}

export function generateSitemapIndex(customBaseUrl?: string): string {
  const BASE_URL = customBaseUrl || DEFAULT_BASE_URL;
  const today = new Date().toISOString().split("T")[0];
  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${BASE_URL}/sitemap-landing.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${BASE_URL}/sitemap-articles.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${BASE_URL}/sitemap-astrology-combinatorics.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${BASE_URL}/sitemap-news.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
</sitemapindex>`;
}

export function generateLandingSitemap(customBaseUrl?: string): string {
  const BASE_URL = customBaseUrl || DEFAULT_BASE_URL;
  const today = new Date().toISOString().split("T")[0];
  const staticUrls = [
    `${BASE_URL}/`,
    `${BASE_URL}/learn`,
    `${BASE_URL}/#kundli`,
    `${BASE_URL}/#matching`,
    `${BASE_URL}/#horoscope`,
    `${BASE_URL}/#chat`,
  ];

  const landingUrls = HIGH_INTENT_LANDINGS.map(l => `${BASE_URL}/learn/${l.slug}`);
  const all = [...staticUrls, ...landingUrls];

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${all
  .map(
    url => `  <url>
    <loc>${url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;
}

export function generateCombinatoricsSitemap(customBaseUrl?: string): string {
  const BASE_URL = customBaseUrl || DEFAULT_BASE_URL;
  const today = new Date().toISOString().split("T")[0];
  const urls: string[] = [];

  // Planet x House
  PLANETS.forEach(p => {
    HOUSES.forEach(h => {
      urls.push(`${BASE_URL}/learn/${p.key}-in-${h.key}`);
    });
  });

  // Planet x Sign
  PLANETS.forEach(p => {
    SIGNS.forEach(s => {
      urls.push(`${BASE_URL}/learn/${p.key}-in-${s.key}`);
    });
  });

  // Planet x Nakshatra
  PLANETS.forEach(p => {
    NAKSHATRAS.forEach(n => {
      urls.push(`${BASE_URL}/learn/${p.key}-in-${n.key}-nakshatra`);
    });
  });

  // Planet Dasha
  PLANETS.forEach(p => {
    urls.push(`${BASE_URL}/learn/${p.key}-mahadasha`);
    urls.push(`${BASE_URL}/learn/${p.key}-antardasha`);
    urls.push(`${BASE_URL}/learn/${p.key}-remedies`);
  });

  // Ascendants
  SIGNS.forEach(s => {
    urls.push(`${BASE_URL}/learn/${s.key}-ascendant`);
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    url => `  <url>
    <loc>${url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;
}

export function generateRssFeed(cmsArticles: any[], customBaseUrl?: string): string {
  const BASE_URL = customBaseUrl || DEFAULT_BASE_URL;
  const today = new Date().toUTCString();
  const itemsXml = cmsArticles
    .slice(0, 20)
    .map(a => `    <item>
      <title><![CDATA[${a.title}]]></title>
      <link>${BASE_URL}/article/${a.id}</link>
      <guid>${BASE_URL}/article/${a.id}</guid>
      <pubDate>${new Date(a.updatedAt || Date.now()).toUTCString()}</pubDate>
      <description><![CDATA[${(a.content || "").slice(0, 300)}...]]></description>
      <author>${a.author || "Acharya Vedanga"}</author>
      <category>${a.category || "Vedic Astrology"}</category>
    </item>`)
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>Vedanga AI – Daily Vedic Astrology & Cosmic News</title>
  <link>${BASE_URL}</link>
  <description>Daily Vedic Panchang, Planetary Transits, Dasha Analysis, Remedies, and AI Astrology Insights.</description>
  <language>en-us</language>
  <lastBuildDate>${today}</lastBuildDate>
  <atom:link href="${BASE_URL}/rss.xml" rel="self" type="application/rss+xml" />
${itemsXml}
</channel>
</rss>`;
}
