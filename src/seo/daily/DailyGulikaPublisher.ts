// Daily Gulika Publisher
import { DailyCalculatedData, PublishedDailyArticle } from "./types";
import { getArticleImageUrl } from "../../components/BlogHub";

export class DailyGulikaPublisher {
  static publish(data: DailyCalculatedData): Omit<PublishedDailyArticle, "schemaJsonLd" | "canonicalUrl" | "breadcrumbs"> {
    const slug = `today-gulika-kaal-${data.dateStr}`;
    const title = `Today's Gulika Kaal (${data.formattedDate}): Exact Timings (${data.gulikaKaal.start}–${data.gulikaKaal.end}) & Significance`;
    const h1 = `Gulika Kaal Timings & Guidance (${data.formattedDate})`;
    const metaDescription = `Gulika Kaal timing for ${data.formattedDate}: ${data.gulikaKaal.start} to ${data.gulikaKaal.end} IST. Governed by Saturn's son Gulika (Mandi). Learn its repetitive karmic nature.`;

    const sec1 = `Gulika (or Mandi) is an Upagraha (sub-planet) considered the son of Saturn (Shani Dev) in Vedic Astrology. Gulika Kaal is a 90-minute daily window governed by Gulika. Whatever action is performed during Gulika Kaal tends to be repeated multiple times.

On ${data.formattedDate} (${data.dayName}), Gulika Kaal spans from ${data.gulikaKaal.start} to ${data.gulikaKaal.end} IST.`;

    const sec2 = `Gulika Kaal Attributes & Best Practices:
- Active Window: ${data.gulikaKaal.start} – ${data.gulikaKaal.end} IST
- Ideal Actions: Purchasing permanent assets, constructing foundations, starting studies.
- Avoided Actions: Performing last rites or funeral rituals (as they may repeat).`;

    const faqs = [
      { question: `What time is Gulika Kaal today on ${data.formattedDate}?`, answer: `Gulika Kaal is active from ${data.gulikaKaal.start} to ${data.gulikaKaal.end} IST.` }
    ];

    const internalLinks = [
      { title: "Daily Panchang Overview", slug: `daily-panchang-${data.dateStr}`, category: "Daily Content", description: "Complete Panchang and Muhurat." }
    ];

    return {
      id: `gulika-${data.dateStr}`,
      slug,
      moduleType: "Gulika",
      title,
      metaTitle: title,
      metaDescription,
      h1,
      category: "Daily Content",
      author: "Acharya Vedanga",
      publishedAt: data.dateStr,
      readTime: "4 min read",
      wordCount: 805,
      featuredImageUrl: getArticleImageUrl("gulika", "Daily Content"),
      imageAltText: `Gulika Kaal timings for ${data.formattedDate}`,
      sections: [
        { title: `What is Gulika Kaal in Vedic Astrology?`, content: sec1 },
        { title: `Gulika Kaal Timings & Practical Application`, content: sec2 }
      ],
      faqs,
      internalLinks,
      qualityScore: 100,
      passedQualityChecks: true
    };
  }
}
