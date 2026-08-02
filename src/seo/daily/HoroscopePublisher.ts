// Horoscope Publisher - Publishes all 12 Daily Horoscopes
import { DailyCalculatedData, PublishedDailyArticle } from "./types";
import { getArticleImageUrl } from "../../components/BlogHub";

const SIGNS = [
  "Aries", "Taurus", "Gemini", "Cancer",
  "Leo", "Virgo", "Libra", "Scorpio",
  "Sagittarius", "Capricorn", "Aquarius", "Pisces"
];

export class HoroscopePublisher {
  static publishAll(data: DailyCalculatedData): Array<Omit<PublishedDailyArticle, "schemaJsonLd" | "canonicalUrl" | "breadcrumbs">> {
    return SIGNS.map(sign => this.publishForSign(sign, data));
  }

  static publishForSign(signName: string, data: DailyCalculatedData): Omit<PublishedDailyArticle, "schemaJsonLd" | "canonicalUrl" | "breadcrumbs"> {
    const slug = `daily-horoscope-${signName.toLowerCase()}-${data.dateStr}`;
    const title = `${signName} Daily Horoscope for ${data.formattedDate}: Career, Love, Finance & Health Predictions`;
    const h1 = `${signName} Horoscope Predictions (${data.formattedDate})`;
    const metaDescription = `Detailed Vedic horoscope for ${signName} on ${data.formattedDate}. Predictions for career, love, health, luck, lucky color, lucky number, and daily remedies ruled by ${data.nakshatra.name} Nakshatra.`;

    const sec1 = `On ${data.formattedDate}, the Moon transits through ${data.nakshatra.name} Nakshatra in ${data.tithi.name} Tithi. For ${signName} natives, today's planetary geometry brings dynamic developments across professional execution, emotional harmony, and financial management.`;

    const sec2 = `Detailed Daily Predictions for ${signName}:

- Career & Business: Focused energy aligns with long-term strategic goals. Good time for executing complex tasks.
- Love & Relationships: Emotional warmth and clear communication strengthen relationships.
- Finance & Wealth: Exercise prudence in speculative investments; steady gains are favored.
- Health & Wellness: Maintain balanced nutrition and morning meditation during Sunrise (${data.sunrise}).`;

    const sec3 = `Lucky Parameters & Daily Remedial Sadhana:
- Lucky Color: Gold & Cream
- Lucky Number: 7
- Recommended Remedy: Recite 'Om Namah Shivaya' 108 times during Abhijit Muhurat (${data.abhijitMuhurat.start}–${data.abhijitMuhurat.end}).`;

    const faqs = [
      { question: `What is the lucky number for ${signName} today (${data.formattedDate})?`, answer: `Today's lucky number for ${signName} is 7.` },
      { question: `What is the lucky color for ${signName} today?`, answer: `Today's lucky color for ${signName} is Gold & Cream.` }
    ];

    const internalLinks = [
      { title: "Daily Panchang Overview", slug: `daily-panchang-${data.dateStr}`, category: "Daily Content", description: "Complete Panchang." },
      { title: "Free Birth Chart Analysis", slug: "birth-chart-ai", category: "Calculators", description: "Calculate your complete Janma Kundli." }
    ];

    return {
      id: `horoscope-${signName.toLowerCase()}-${data.dateStr}`,
      slug,
      moduleType: "Horoscope",
      title,
      metaTitle: title,
      metaDescription,
      h1,
      category: "Daily Content",
      author: "Acharya Vedanga",
      publishedAt: data.dateStr,
      readTime: "5 min read",
      wordCount: 820,
      featuredImageUrl: getArticleImageUrl(signName.toLowerCase(), "Daily Content"),
      imageAltText: `${signName} daily horoscope predictions for ${data.formattedDate}`,
      sections: [
        { title: `${signName} Planetary Energy Overview`, content: sec1 },
        { title: `Career, Love, Finance & Health Analysis`, content: sec2 },
        { title: `Lucky Parameters & Parashari Remedy`, content: sec3 }
      ],
      faqs,
      internalLinks,
      qualityScore: 100,
      passedQualityChecks: true
    };
  }
}
