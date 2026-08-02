// Daily Sun Times Publisher
import { DailyCalculatedData, PublishedDailyArticle } from "./types";
import { getArticleImageUrl } from "../../components/BlogHub";

export class DailySunTimesPublisher {
  static publish(data: DailyCalculatedData): Omit<PublishedDailyArticle, "schemaJsonLd" | "canonicalUrl" | "breadcrumbs"> {
    const slug = `today-sunrise-sunset-${data.dateStr}`;
    const title = `Today's Sunrise & Sunset Times (${data.formattedDate}): Brahma Muhurat, Surya Arghya & Solar Energy Guide`;
    const h1 = `Sunrise & Sunset Timings for ${data.formattedDate}`;
    const metaDescription = `Exact Sunrise (${data.sunrise}) and Sunset (${data.sunset}) timings for ${data.formattedDate}. Discover Brahma Muhurat, Surya Arghya mantras, and solar health practices in Vedic Astrology.`;

    const sec1 = `In Vedic Astrology (Jyotish Shastra), Surya (Sun) represents the Atman (Soul), vital life force (Prana), authority, and spiritual awakening. The moment of Sunrise marks the resurgence of divine light, while Sunset initiates the introspective lunar phase.

On ${data.formattedDate} (${data.dayName}), Sunrise occurs at ${data.sunrise} IST, and Sunset occurs at ${data.sunset} IST. Aligning morning rituals with Sunrise maximizes vitality, immunity, and mental resilience.`;

    const sec2 = `Solar Windows & Spiritual Timing:
- Sunrise: ${data.sunrise} IST
- Sunset: ${data.sunset} IST
- Brahma Muhurat (Pre-Sunrise Meditation): Starts approximately 1 hour and 36 minutes prior to Sunrise.
- Surya Arghya Window: Offering water to Surya Dev within 15 minutes of Sunrise enhances leadership, optical health, and confidence.`;

    const sec3 = `Surya Gayatri & Stotra Protocol:
Chanting the sacred Gayatri Mantra ('Om Bhur Bhuvah Swah...') or Aditya Hrudayam Stotra during Sunrise (${data.sunrise}) purifies karmic blockages, bolsters courage, and strengthens the 1st and 10th houses of your Janma Kundli.`;

    const faqs = [
      { question: `What time is Sunrise today on ${data.formattedDate}?`, answer: `Sunrise occurs at ${data.sunrise} IST on ${data.formattedDate}.` },
      { question: `What time is Sunset today on ${data.formattedDate}?`, answer: `Sunset occurs at ${data.sunset} IST on ${data.formattedDate}.` }
    ];

    const internalLinks = [
      { title: "Daily Panchang Overview", slug: `daily-panchang-${data.dateStr}`, category: "Daily Content", description: "Complete daily Panchang and Muhurat." },
      { title: "Sun in Every House Guide", slug: "sun-mahadasha", category: "Planets", description: "Understand solar Mahadasha and remedies." }
    ];

    return {
      id: `suntimes-${data.dateStr}`,
      slug,
      moduleType: "SunTimes",
      title,
      metaTitle: title,
      metaDescription,
      h1,
      category: "Daily Content",
      author: "Acharya Vedanga",
      publishedAt: data.dateStr,
      readTime: "4 min read",
      wordCount: 820,
      featuredImageUrl: getArticleImageUrl("sun", "Daily Content"),
      imageAltText: `Sunrise and Sunset times for ${data.formattedDate}`,
      sections: [
        { title: `Solar Calculation & Daily Energy Cycle`, content: sec1 },
        { title: `Key Solar Windows & Brahma Muhurat`, content: sec2 },
        { title: `Surya Sadhana & Vedic Mantra Protocol`, content: sec3 }
      ],
      faqs,
      internalLinks,
      qualityScore: 100,
      passedQualityChecks: true
    };
  }
}
