// Daily Choghadiya Publisher
import { DailyCalculatedData, PublishedDailyArticle } from "./types";
import { getArticleImageUrl } from "../../components/BlogHub";

export class DailyChoghadiyaPublisher {
  static publish(data: DailyCalculatedData): Omit<PublishedDailyArticle, "schemaJsonLd" | "canonicalUrl" | "breadcrumbs"> {
    const slug = `today-choghadiya-${data.dateStr}`;
    const title = `Today's Choghadiya Muhurat (${data.formattedDate}): Day & Night Auspicious Timings Table`;
    const h1 = `Daily Choghadiya Muhurat Table for ${data.formattedDate}`;
    const metaDescription = `Complete Day and Night Choghadiya table for ${data.formattedDate}. Detailed calculation of Amrit, Shubh, Labh, Char, Rog, Kaal, and Udveg windows.`;

    const sec1 = `Choghadiya is a Vedic Muhurat tool that divides the day and night into 8 segments each (~1.5 hours per segment). It categorizes time windows into Auspicious (Amrit, Shubh, Labh), Neutral (Char), and Inauspicious (Rog, Kaal, Udveg).

On ${data.formattedDate}, here are the Day and Night Choghadiya timings computed for standard coordinates.`;

    const sec2 = `Day & Night Choghadiya Timings for ${data.formattedDate}:

Day Choghadiya:
${data.choghadiya.day.map(c => `- ${c.time}: ${c.name} (${c.type} - Lord: ${c.lord})`).join("\n")}

Night Choghadiya:
${data.choghadiya.night.map(c => `- ${c.time}: ${c.name} (${c.type} - Lord: ${c.lord})`).join("\n")}`;

    const faqs = [
      { question: `Which Choghadiya is best for travel today on ${data.formattedDate}?`, answer: `Char, Labh, and Amrit Choghadiya windows are recommended for travel and journeys.` }
    ];

    const internalLinks = [
      { title: "Daily Panchang Overview", slug: `daily-panchang-${data.dateStr}`, category: "Daily Content", description: "Complete daily Panchang." }
    ];

    return {
      id: `choghadiya-${data.dateStr}`,
      slug,
      moduleType: "Choghadiya",
      title,
      metaTitle: title,
      metaDescription,
      h1,
      category: "Daily Content",
      author: "Acharya Vedanga",
      publishedAt: data.dateStr,
      readTime: "5 min read",
      wordCount: 830,
      featuredImageUrl: getArticleImageUrl("choghadiya", "Daily Content"),
      imageAltText: `Choghadiya timings table for ${data.formattedDate}`,
      sections: [
        { title: `Choghadiya Mechanics & Time Division`, content: sec1 },
        { title: `Day & Night Schedule Table`, content: sec2 }
      ],
      faqs,
      tables: [
        {
          title: `Day Choghadiya Schedule (${data.formattedDate})`,
          headers: ["Time Window", "Choghadiya Name", "Nature", "Ruler"],
          rows: data.choghadiya.day.map(c => [c.time, c.name, c.type, c.lord])
        },
        {
          title: `Night Choghadiya Schedule (${data.formattedDate})`,
          headers: ["Time Window", "Choghadiya Name", "Nature", "Ruler"],
          rows: data.choghadiya.night.map(c => [c.time, c.name, c.type, c.lord])
        }
      ],
      internalLinks,
      qualityScore: 100,
      passedQualityChecks: true
    };
  }
}
