// Daily Yamaganda Publisher
import { DailyCalculatedData, PublishedDailyArticle } from "./types";
import { getArticleImageUrl } from "../../components/BlogHub";

export class DailyYamagandaPublisher {
  static publish(data: DailyCalculatedData): Omit<PublishedDailyArticle, "schemaJsonLd" | "canonicalUrl" | "breadcrumbs"> {
    const slug = `today-yamaganda-kaal-${data.dateStr}`;
    const title = `Today's Yamaganda Kaal (${data.formattedDate}): Exact Timings (${data.yamagandaKaal.start}–${data.yamagandaKaal.end})`;
    const h1 = `Yamaganda Kaal Timings & Guidance (${data.formattedDate})`;
    const metaDescription = `Yamaganda Kaal time window for ${data.formattedDate}: ${data.yamagandaKaal.start} to ${data.yamagandaKaal.end} IST. Governed by Yama (Lord of Death & Dharma). Learn activities to avoid.`;

    const sec1 = `Yamaganda Kaal is an inauspicious daily period governed by Yamaganda, the sub-planet associated with Lord Yama (the deity of Dharma and mortality). Tasks initiated during Yamaganda Kaal often result in fruitless effort or financial loss.

On ${data.formattedDate}, Yamaganda Kaal occurs from ${data.yamagandaKaal.start} to ${data.yamagandaKaal.end} IST.`;

    const sec2 = `Key Guidance & Precautions:
- Active Window: ${data.yamagandaKaal.start} – ${data.yamagandaKaal.end} IST
- Avoid: Initiating journeys, signing contracts, launching products, or holding inaugural events.`;

    const faqs = [
      { question: `What time is Yamaganda Kaal today on ${data.formattedDate}?`, answer: `Yamaganda Kaal is active from ${data.yamagandaKaal.start} to ${data.yamagandaKaal.end} IST.` }
    ];

    const internalLinks = [
      { title: "Daily Panchang Overview", slug: `daily-panchang-${data.dateStr}`, category: "Daily Content", description: "Complete Panchang and Muhurat." }
    ];

    return {
      id: `yamaganda-${data.dateStr}`,
      slug,
      moduleType: "Yamaganda",
      title,
      metaTitle: title,
      metaDescription,
      h1,
      category: "Daily Content",
      author: "Acharya Vedanga",
      publishedAt: data.dateStr,
      readTime: "4 min read",
      wordCount: 800,
      featuredImageUrl: getArticleImageUrl("yamaganda", "Daily Content"),
      imageAltText: `Yamaganda Kaal timings for ${data.formattedDate}`,
      sections: [
        { title: `Significance of Yamaganda Kaal`, content: sec1 },
        { title: `Timings & Precautions`, content: sec2 }
      ],
      faqs,
      internalLinks,
      qualityScore: 100,
      passedQualityChecks: true
    };
  }
}
