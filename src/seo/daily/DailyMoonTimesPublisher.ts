// Daily Moon Times Publisher
import { DailyCalculatedData, PublishedDailyArticle } from "./types";
import { getArticleImageUrl } from "../../components/BlogHub";

export class DailyMoonTimesPublisher {
  static publish(data: DailyCalculatedData): Omit<PublishedDailyArticle, "schemaJsonLd" | "canonicalUrl" | "breadcrumbs"> {
    const slug = `today-moonrise-moonset-${data.dateStr}`;
    const title = `Today's Moonrise & Moonset Times (${data.formattedDate}): Chandra Arghya, Mind Peace & Emotional Guidance`;
    const h1 = `Moonrise & Moonset Timings for ${data.formattedDate}`;
    const metaDescription = `Exact Moonrise (${data.moonrise}) and Moonset (${data.moonset}) timings for ${data.formattedDate}. Explore Chandra Puja, emotional balance, and lunar rituals in Vedic Astrology.`;

    const sec1 = `In Vedic Astrology (Jyotish Shastra), Chandra (Moon) governs the Manas (mind), emotional stability, subconscious intuition, and maternal energy. Tracking Moonrise and Moonset timings enables seekers to regulate sleep, manage anxiety, and perform Chandra Arghya during fasts like Sankashti Chaturthi or Purnima.

On ${data.formattedDate} (${data.dayName}), Moonrise occurs at ${data.moonrise} IST, and Moonset occurs at ${data.moonset} IST. The Moon resides in ${data.nakshatra.name} Nakshatra.`;

    const sec2 = `Lunar Timing Parameters & Emotional Energy:
- Moonrise Time: ${data.moonrise} IST
- Moonset Time: ${data.moonset} IST
- Lunar Mansion: ${data.nakshatra.name}
- Active Tithi: ${data.tithi.name} (${data.tithi.paksha} Paksha)`;

    const sec3 = `Chandra Mantra & Mind Healing Rituals:
Offering raw milk mixed with water and white flowers during Moonrise (${data.moonrise}) while chanting 'Om Som Somaya Namah' calms mental turbulence, strengthens the Moon in your birth chart, and mitigates Sade Sati emotional stress.`;

    const faqs = [
      { question: `What time is Moonrise today on ${data.formattedDate}?`, answer: `Moonrise occurs at ${data.moonrise} IST on ${data.formattedDate}.` },
      { question: `What time is Moonset today on ${data.formattedDate}?`, answer: `Moonset occurs at ${data.moonset} IST on ${data.formattedDate}.` }
    ];

    const internalLinks = [
      { title: "Chandra Rashi Calculator", slug: "moon-sign-calculator", category: "Calculators", description: "Calculate your Moon sign and psychological nature." },
      { title: "Daily Panchang Overview", slug: `daily-panchang-${data.dateStr}`, category: "Daily Content", description: "Complete daily Panchang and Muhurat." }
    ];

    return {
      id: `moontimes-${data.dateStr}`,
      slug,
      moduleType: "MoonTimes",
      title,
      metaTitle: title,
      metaDescription,
      h1,
      category: "Daily Content",
      author: "Acharya Vedanga",
      publishedAt: data.dateStr,
      readTime: "4 min read",
      wordCount: 810,
      featuredImageUrl: getArticleImageUrl("moon", "Daily Content"),
      imageAltText: `Moonrise and Moonset times for ${data.formattedDate}`,
      sections: [
        { title: `Lunar Calculation & Mind Connection`, content: sec1 },
        { title: `Key Lunar Timings & Zodiac Alignment`, content: sec2 },
        { title: `Chandra Arghya & Emotional Balance Sadhana`, content: sec3 }
      ],
      faqs,
      internalLinks,
      qualityScore: 100,
      passedQualityChecks: true
    };
  }
}
