// Daily Indexer for Vedanga AI
import { PublishedDailyArticle } from "./types";
import { DailySEOEngine } from "./DailySEOEngine";

const BASE_URL = process.env.APP_URL || "https://vedanga-ai.vercel.app";

export class DailyIndexer {
  private static articlesStore: Map<string, PublishedDailyArticle> = new Map();
  private static publishedSlugs: Set<string> = new Set();

  /**
   * Register a newly published and validated article into the store and search index
   */
  static registerArticle(article: PublishedDailyArticle): void {
    this.articlesStore.set(article.slug, article);
    this.publishedSlugs.add(article.slug);
  }

  /**
   * Get all published daily articles
   */
  static getAllArticles(): PublishedDailyArticle[] {
    return Array.from(this.articlesStore.values()).sort(
      (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  }

  /**
   * Get a specific article by slug
   */
  static getArticleBySlug(slug: string): PublishedDailyArticle | undefined {
    return this.articlesStore.get(slug);
  }

  /**
   * Get set of all published slugs
   */
  static getPublishedSlugs(): Set<string> {
    return new Set(this.publishedSlugs);
  }

  /**
   * Generate dynamic Daily XML Sitemap (/sitemap-daily.xml)
   */
  static generateDailySitemap(customBaseUrl?: string): string {
    const domainUrl = customBaseUrl || BASE_URL;
    const articles = this.getAllArticles();
    const today = new Date().toISOString().split("T")[0];

    const urlNodes = articles.map(a => `  <url>
    <loc>${domainUrl}/learn/${a.slug}</loc>
    <lastmod>${a.publishedAt || today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>`).join("\n");

    return `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlNodes}
</urlset>`;
  }

  /**
   * Generate RSS Feed for daily articles
   */
  static generateDailyRssFeed(customBaseUrl?: string): string {
    const domainUrl = customBaseUrl || BASE_URL;
    const articles = this.getAllArticles();
    const today = new Date().toUTCString();

    const itemsXml = articles.map(a => DailySEOEngine.generateRssItem(a)).join("\n");

    return `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>Vedanga AI – Daily Vedic Astrology & Panchang Insights</title>
  <link>${domainUrl}</link>
  <description>Automated daily publication of Vedic Panchang, Nakshatra, Tithi, Transits, Horoscopes, Rahu Kaal, Abhijit Muhurat, and Classical Remedies.</description>
  <language>en-us</language>
  <lastBuildDate>${today}</lastBuildDate>
  <atom:link href="${domainUrl}/rss.xml" rel="self" type="application/rss+xml" />
${itemsXml}
</channel>
</rss>`;
  }

  /**
   * Get discoverable topics for category pages & related links
   */
  static getCategoryArticles(category: string): PublishedDailyArticle[] {
    return this.getAllArticles().filter(a => a.category === category || category === "All");
  }

  /**
   * Get recent trending daily articles
   */
  static getTrendingDailyArticles(limit: number = 6): PublishedDailyArticle[] {
    return this.getAllArticles().slice(0, limit);
  }
}
