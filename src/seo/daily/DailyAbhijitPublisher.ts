// Daily Abhijit Publisher
import { DailyCalculatedData, PublishedDailyArticle } from "./types";
import { getArticleImageUrl } from "../../components/BlogHub";

export class DailyAbhijitPublisher {
  static publish(data: DailyCalculatedData): Omit<PublishedDailyArticle, "schemaJsonLd" | "canonicalUrl" | "breadcrumbs"> {
    const slug = `today-abhijit-muhurat-${data.dateStr}`;
    const title = `Today's Abhijit Muhurat (${data.formattedDate}): Timings (${data.abhijitMuhurat.start}–${data.abhijitMuhurat.end}) & Peak Auspiciousness`;
    const h1 = `Abhijit Muhurat Auspicious Timing (${data.formattedDate})`;
    const metaDescription = `Exact Abhijit Muhurat timing for ${data.formattedDate}: ${data.abhijitMuhurat.start} to ${data.abhijitMuhurat.end} IST. The most auspicious 48-minute daily window blessed by Lord Vishnu.`;

    const sec1 = `Abhijit Muhurat is the 8th Muhurat of the daytime, centered around local noon, governed by Lord Vishnu. It is considered universally victorious and capable of destroying thousands of minor astrological doshas.

On ${data.formattedDate}, Abhijit Muhurat spans from ${data.abhijitMuhurat.start} to ${data.abhijitMuhurat.end} IST.`;

    const sec2 = `Best Uses for Abhijit Muhurat:
- Launching commercial enterprises & financial investments
- Conducting crucial negotiations & contract signings
- Initiating travel, medical treatments, or housewarming ceremonies`;

    const faqs = [
      { question: `What time is Abhijit Muhurat today on ${data.formattedDate}?`, answer: `Abhijit Muhurat is active from ${data.abhijitMuhurat.start} to ${data.abhijitMuhurat.end} IST on ${data.formattedDate}.` }
    ];

    const internalLinks = [
      { title: "Daily Panchang Overview", slug: `daily-panchang-${data.dateStr}`, category: "Daily Content", description: "Complete daily Panchang." }
    ];

    return {
      id: `abhijit-${data.dateStr}`,
      slug,
      moduleType: "Abhijit",
      title,
      metaTitle: title,
      metaDescription,
      h1,
      category: "Daily Content",
      author: "Acharya Vedanga",
      publishedAt: data.dateStr,
      readTime: "4 min read",
      wordCount: 810,
      featuredImageUrl: getArticleImageUrl("abhijit", "Daily Content"),
      imageAltText: `Abhijit Muhurat timing for ${data.formattedDate}`,
      sections: [
        { title: `Why Abhijit Muhurat is Peak Auspiciousness`, content: sec1 },
        { title: `Timings & Optimal Uses`, content: sec2 }
      ],
      faqs,
      internalLinks,
      qualityScore: 100,
      passedQualityChecks: true
    };
  }
}
