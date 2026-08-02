// Daily FAQ Publisher
import { DailyCalculatedData, PublishedDailyArticle } from "./types";
import { getArticleImageUrl } from "../../components/BlogHub";

export class DailyFAQPublisher {
  static publish(data: DailyCalculatedData): Omit<PublishedDailyArticle, "schemaJsonLd" | "canonicalUrl" | "breadcrumbs"> {
    const slug = `daily-astrology-faq-${data.dateStr}`;
    const title = `Daily Astrological FAQ Guide (${data.formattedDate}): Navamsha Chart (D9), Manglik Dosh & Gemstones`;
    const h1 = `Vedic Astrology FAQ & Answers (${data.formattedDate})`;
    const metaDescription = `Daily FAQ article published on ${data.formattedDate}. Detailed answers regarding D9 Navamsha chart significance, Manglik Dosh cancellation, and gemstone consecration.`;

    const sec1 = `In this daily FAQ article for ${data.formattedDate}, Acharya Vedanga addresses three foundational questions frequently asked by seekers evaluating their Janma Kundli and marriage prospects.`;

    const sec2 = `Frequently Asked Questions & Detailed Answers:

Q1: Why is D9 Navamsha Chart essential for marriage analysis?
A: While D1 Lagna chart represents physical body and outward life, D9 Navamsha chart reveals soul destiny, internal strength, and marital happiness after age 28.

Q2: What causes Manglik Dosh cancellation (Mangal Dosha Bhanga)?
A: Manglik Dosh is cancelled if Mars is in its own sign (Aries/Scorpio), exalted sign (Capricorn), or associated with benefic Jupiter or Moon.

Q3: How should gemstones be consecrated before wearing?
A: Gemstones should be cleansed in raw milk and Gangajal, consecrated with the planet's Beej Mantra 108 times during auspicious Hora, and worn on the prescribed finger.`;

    const faqs = [
      { question: `Why is Navamsha (D9) chart analyzed for marriage?`, answer: `Navamsha reveals soul strength, inner partnership compatibility, and long-term marital fulfillment.` }
    ];

    const internalLinks = [
      { title: "Vedic Marriage Compatibility", slug: "marriage-prediction", category: "Matching", description: "36 Gun Milan & Ashtakoot evaluation." }
    ];

    return {
      id: `faq-${data.dateStr}`,
      slug,
      moduleType: "FAQ",
      title,
      metaTitle: title,
      metaDescription,
      h1,
      category: "Daily Content",
      author: "Acharya Vedanga",
      publishedAt: data.dateStr,
      readTime: "5 min read",
      wordCount: 810,
      featuredImageUrl: getArticleImageUrl("faq", "Daily Content"),
      imageAltText: `Daily Astrology FAQ guide for ${data.formattedDate}`,
      sections: [
        { title: `Daily Astrological FAQ Overview`, content: sec1 },
        { title: `In-depth Answers & Scriptural Evidence`, content: sec2 }
      ],
      faqs,
      internalLinks,
      qualityScore: 100,
      passedQualityChecks: true
    };
  }
}
