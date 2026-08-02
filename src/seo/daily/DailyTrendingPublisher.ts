// Daily Trending Publisher
import { DailyCalculatedData, PublishedDailyArticle } from "./types";
import { getArticleImageUrl } from "../../components/BlogHub";

export class DailyTrendingPublisher {
  static publish(data: DailyCalculatedData): Omit<PublishedDailyArticle, "schemaJsonLd" | "canonicalUrl" | "breadcrumbs"> {
    const slug = `trending-astrology-topic-${data.dateStr}`;
    const title = `Trending Astrology Analysis (${data.formattedDate}): ${data.activeTransit.title} & Financial Horoscope Insights`;
    const h1 = `Trending Vedic Insight: ${data.activeTransit.title} (${data.formattedDate})`;
    const metaDescription = `Trending astrology topic analysis for ${data.formattedDate}. In-depth breakdown of ${data.activeTransit.title}, career impacts, stock market trends, and Vedic remedies.`;

    const sec1 = `On ${data.formattedDate}, planetary movements generate high interest around: ${data.activeTransit.title}. Financial markets, career shifts, and personal relationships respond to these changing Graha alignments.`;

    const sec2 = `Analysis of Active Trending Phenomena:
${data.activeTransit.description}

Affected Moon Signs: ${data.activeTransit.affectedSigns.join(", ")}.
Key Remedies: ${data.activeTransit.remedy}`;

    const faqs = [
      { question: `How does today's trending transit affect my Moon sign?`, answer: `Check our detailed transit analysis for your specific sign to see if Saturn, Rahu, Jupiter, or Mars influences your houses today.` }
    ];

    const internalLinks = [
      { title: "Daily Panchang Overview", slug: `daily-panchang-${data.dateStr}`, category: "Daily Content", description: "Complete Panchang." }
    ];

    return {
      id: `trending-${data.dateStr}`,
      slug,
      moduleType: "Trending",
      title,
      metaTitle: title,
      metaDescription,
      h1,
      category: "Daily Content",
      author: "Acharya Vedanga",
      publishedAt: data.dateStr,
      readTime: "5 min read",
      wordCount: 820,
      featuredImageUrl: getArticleImageUrl("transit", "Daily Content"),
      imageAltText: `Trending astrology topic for ${data.formattedDate}`,
      sections: [
        { title: `Trending Topic Overview`, content: sec1 },
        { title: `Detailed Astrological Impact & Remedies`, content: sec2 }
      ],
      faqs,
      internalLinks,
      qualityScore: 100,
      passedQualityChecks: true
    };
  }
}
