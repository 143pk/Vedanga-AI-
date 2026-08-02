// Daily SEO Engine for Vedanga AI
import { PublishedDailyArticle } from "./types";

const BASE_URL = process.env.APP_URL || "https://vedanga-ai.vercel.app";

export class DailySEOEngine {
  /**
   * Generates comprehensive SEO metadata & Schema.org markup for a daily published article
   */
  static enrichArticleWithSEO(article: Omit<PublishedDailyArticle, "schemaJsonLd" | "canonicalUrl" | "breadcrumbs">): PublishedDailyArticle {
    const canonicalUrl = `${BASE_URL}/learn/${article.slug}`;

    const breadcrumbs = [
      { name: "Home", url: `${BASE_URL}/` },
      { name: "Daily Astrology", url: `${BASE_URL}/learn` },
      { name: article.category, url: `${BASE_URL}/learn?category=${encodeURIComponent(article.category)}` },
      { name: article.title, url: canonicalUrl }
    ];

    // Build JSON-LD Schemas
    const articleSchema = {
      "@context": "https://schema.org",
      "@type": "Article",
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": canonicalUrl
      },
      "headline": article.title,
      "description": article.metaDescription,
      "image": [article.featuredImageUrl],
      "datePublished": `${article.publishedAt}T06:00:00+05:30`,
      "dateModified": `${article.publishedAt}T06:00:00+05:30`,
      "author": {
        "@type": "Person",
        "name": article.author || "Acharya Vedanga",
        "jobTitle": "Head Vedic Astrologer & Parashari Jyotish Scholar",
        "worksFor": {
          "@type": "Organization",
          "name": "Vedanga AI"
        }
      },
      "publisher": {
        "@type": "Organization",
        "name": "Vedanga AI",
        "logo": {
          "@type": "ImageObject",
          "url": `${BASE_URL}/public/icon.png`
        }
      }
    };

    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": breadcrumbs.map((b, idx) => ({
        "@type": "ListItem",
        "position": idx + 1,
        "name": b.name,
        "item": b.url
      }))
    };

    const schemaJsonLd: Record<string, any>[] = [articleSchema, breadcrumbSchema];

    // If FAQs exist, attach FAQPage Schema
    if (article.faqs && article.faqs.length > 0) {
      const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": article.faqs.map(f => ({
          "@type": "Question",
          "name": f.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": f.answer
          }
        }))
      };
      schemaJsonLd.push(faqSchema);
    }

    return {
      ...article,
      canonicalUrl,
      breadcrumbs,
      schemaJsonLd
    };
  }

  /**
   * Generates RSS XML Feed item snippet
   */
  static generateRssItem(article: PublishedDailyArticle): string {
    return `    <item>
      <title><![CDATA[${article.title}]]></title>
      <link>${article.canonicalUrl}</link>
      <guid>${article.canonicalUrl}</guid>
      <pubDate>${new Date(article.publishedAt).toUTCString()}</pubDate>
      <description><![CDATA[${article.metaDescription}]]></description>
      <author>${article.author}</author>
      <category>${article.category}</category>
    </item>`;
  }

  /**
   * Generates Sitemap XML url element
   */
  static generateSitemapUrlNode(article: PublishedDailyArticle): string {
    return `  <url>
    <loc>${article.canonicalUrl}</loc>
    <lastmod>${article.publishedAt}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>`;
  }
}
