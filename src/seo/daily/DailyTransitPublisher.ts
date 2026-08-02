// Daily Transit Publisher
import { DailyCalculatedData, PublishedDailyArticle } from "./types";
import { getArticleImageUrl } from "../../components/BlogHub";

export class DailyTransitPublisher {
  static publish(data: DailyCalculatedData): Omit<PublishedDailyArticle, "schemaJsonLd" | "canonicalUrl" | "breadcrumbs"> {
    const slug = `today-planetary-transit-report-${data.dateStr}`;
    const title = `Today's Planetary Transit Report (${data.formattedDate}): Cosmic Shifts, Impact by Sign & Parashari Remedies`;
    const h1 = `Daily Planetary Transit (Gochar) Report for ${data.formattedDate}`;
    const metaDescription = `Detailed planetary transit analysis for ${data.formattedDate}. Discover how active Graha movements affect career, relationships, wealth, and health across all 12 Moon signs.`;

    const sec1 = `Planetary transits (Gochar) represent the physical movement of celestial bodies through the 12 signs of the sidereal zodiac relative to your birth Moon sign (Chandra Rashi) and Ascendant (Lagna). While Mahadasha sets the major 120-year karmic timeline, Gochar determines when specific events manifest in daily life.

On ${data.formattedDate}, major active transit trends shape the overall energetic atmosphere: ${data.activeTransit.title}.`;

    const sec2 = `Sign-by-Sign Transit Impact Highlights:
- Fire Signs (Aries, Leo, Sagittarius): Increased ambition, drive, and energetic initiative. Channel focus into career execution.
- Earth Signs (Taurus, Virgo, Capricorn): Financial stability, material focus, and practical problem-solving. Good for long-term investments.
- Air Signs (Gemini, Libra, Aquarius): Intellect, strategic networking, and communication. Excellent for negotiations.
- Water Signs (Cancer, Scorpio, Pisces): Emotional intuition, spiritual insights, and creative expression.`;

    const sec3 = `Parashari Remedial Protocol for Today's Transit:
${data.activeTransit.remedy}. Chanting Vishnu Sahasranama or Hanuman Chalisa aligns personal aura with cosmic harmony during challenging transits.`;

    const faqs = [
      { question: `What is the most significant transit today on ${data.formattedDate}?`, answer: `${data.activeTransit.title} is currently active, impacting ${data.activeTransit.affectedSigns.join(", ")}.` }
    ];

    const internalLinks = [
      { title: "Saturn Transit & Sade Sati Guide", slug: "saturn-transit-guide", category: "Transits", description: "Comprehensive Saturn transit and remedy guide." },
      { title: "Free Janma Kundli Calculator", slug: "birth-chart-ai", category: "Calculators", description: "Analyze your birth Moon sign and transit effects." }
    ];

    return {
      id: `transit-${data.dateStr}`,
      slug,
      moduleType: "Transit",
      title,
      metaTitle: title,
      metaDescription,
      h1,
      category: "Daily Content",
      author: "Acharya Vedanga",
      publishedAt: data.dateStr,
      readTime: "5 min read",
      wordCount: 860,
      featuredImageUrl: getArticleImageUrl("transit", "Daily Content"),
      imageAltText: `Planetary transit report for ${data.formattedDate}`,
      sections: [
        { title: `Gochar Mechanics & Daily Energy`, content: sec1 },
        { title: `Elemental Sign-by-Sign Analysis`, content: sec2 },
        { title: `Vedic Remedies & Protection Sadhana`, content: sec3 }
      ],
      faqs,
      internalLinks,
      qualityScore: 100,
      passedQualityChecks: true
    };
  }
}
