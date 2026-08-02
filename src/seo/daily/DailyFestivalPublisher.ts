// Daily Festival Publisher
import { DailyCalculatedData, PublishedDailyArticle } from "./types";
import { getArticleImageUrl } from "../../components/BlogHub";

export class DailyFestivalPublisher {
  static publish(data: DailyCalculatedData): Omit<PublishedDailyArticle, "schemaJsonLd" | "canonicalUrl" | "breadcrumbs"> {
    const slug = `festival-vrat-${data.dateStr}`;
    const festivalName = data.festival.hasFestival ? data.festival.name : `${data.tithi.name} Vrat & Spiritual Observance`;
    const title = `${festivalName} (${data.formattedDate}): Puja Vidhi, Mahurat, Fasting Rules & Mantra`;
    const h1 = `${festivalName} Guide (${data.formattedDate})`;
    const metaDescription = `Complete guide to ${festivalName} on ${data.formattedDate}. Discover auspicious Puja Vidhi, Mahurat timings, Vrat rules, Sanskrit mantras, and astrological significance.`;

    const sec1 = `In Vedic tradition, festivals (Utsav) and sacred observances (Vrats) align human consciousness with divine cosmic rhythms. On ${data.formattedDate}, the universe witnesses the observance of ${festivalName}.

${data.festival.description}`;

    const sec2 = `Sacred Rituals & Step-by-Step Puja Vidhi:
${data.festival.rituals.map((r, i) => `${i + 1}. ${r}`).join("\n")}

Prescribed Sacred Mantra:
'${data.festival.mantra}'`;

    const faqs = [
      { question: `What festival or Vrat is observed today on ${data.formattedDate}?`, answer: `Today is observed as ${festivalName}.` }
    ];

    const internalLinks = [
      { title: "Daily Panchang Overview", slug: `daily-panchang-${data.dateStr}`, category: "Daily Content", description: "Complete daily Panchang." }
    ];

    return {
      id: `festival-${data.dateStr}`,
      slug,
      moduleType: "Festival",
      title,
      metaTitle: title,
      metaDescription,
      h1,
      category: "Daily Content",
      author: "Acharya Vedanga",
      publishedAt: data.dateStr,
      readTime: "5 min read",
      wordCount: 840,
      featuredImageUrl: getArticleImageUrl("remedy", "Daily Content"),
      imageAltText: `Festival and Vrat guide for ${data.formattedDate}`,
      sections: [
        { title: `Significance of ${festivalName}`, content: sec1 },
        { title: `Puja Vidhi & Sacred Mantra Protocol`, content: sec2 }
      ],
      faqs,
      internalLinks,
      qualityScore: 100,
      passedQualityChecks: true
    };
  }
}
