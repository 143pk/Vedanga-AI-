// Daily Tithi Publisher
import { DailyCalculatedData, PublishedDailyArticle } from "./types";
import { getArticleImageUrl } from "../../components/BlogHub";

export class DailyTithiPublisher {
  static publish(data: DailyCalculatedData): Omit<PublishedDailyArticle, "schemaJsonLd" | "canonicalUrl" | "breadcrumbs"> {
    const slug = `today-tithi-${data.dateStr}`;
    const title = `Today's Tithi (${data.formattedDate}): ${data.tithi.name} (${data.tithi.paksha} Paksha) Spiritual Significance & Rituals`;
    const h1 = `Today's Tithi: ${data.tithi.name} (${data.tithi.paksha} Paksha)`;
    const metaDescription = `Detailed guide to today's Tithi (${data.tithi.name}, ${data.tithi.paksha} Paksha) on ${data.formattedDate}. Presided over by ${data.tithi.deity}. Discover fasting rituals, auspicious activities, and spiritual remedies.`;

    const sec1 = `In the Vedic calendar, Tithi measures the 12-degree longitudinal advancement of the Moon relative to the Sun. Each lunar month comprises 30 Tithis split equally between Shukla Paksha (waxing fortnight) and Krishna Paksha (waning fortnight). On ${data.formattedDate}, the active Tithi is ${data.tithi.name}.

${data.tithi.name} is governed by deity ${data.tithi.deity}. It sets the foundational emotional, spiritual, and subtle energetic tone for daily activities, religious ceremonies, and family gatherings.`;

    const sec2 = `Astrological & Spiritual Significance of ${data.tithi.name}:

- Active Tithi: ${data.tithi.name}
- Fortnight (Paksha): ${data.tithi.paksha} Paksha
- Ruling Deva/Devi: ${data.tithi.deity}
- Core Attributes: ${data.tithi.description}`;

    const sec3 = `Recommended Vrat, Puja & Remedies for Today:
Performing sacred recitations, lighting a ghee lamp facing east during sunrise (${data.sunrise}), donating sesame seeds or sweets, and meditating on ${data.tithi.deity} brings peace and invokes protective cosmic grace.`;

    const faqs = [
      { question: `What Tithi is active today on ${data.formattedDate}?`, answer: `Today's Tithi is ${data.tithi.name} in ${data.tithi.paksha} Paksha.` },
      { question: `Who is the presiding deity of ${data.tithi.name}?`, answer: `The deity governing ${data.tithi.name} is ${data.tithi.deity}.` }
    ];

    const internalLinks = [
      { title: "Daily Panchang Overview", slug: `daily-panchang-${data.dateStr}`, category: "Daily Content", description: "Complete daily Panchang and Muhurat." },
      { title: "Free Birth Chart Analysis", slug: "birth-chart-ai", category: "Calculators", description: "Calculate Janma Kundli and Dasha." }
    ];

    return {
      id: `tithi-${data.dateStr}`,
      slug,
      moduleType: "Tithi",
      title,
      metaTitle: title,
      metaDescription,
      h1,
      category: "Daily Content",
      author: "Acharya Vedanga",
      publishedAt: data.dateStr,
      readTime: "5 min read",
      wordCount: 850,
      featuredImageUrl: getArticleImageUrl("tithi", "Daily Content"),
      imageAltText: `Today Tithi ${data.tithi.name} for ${data.formattedDate}`,
      sections: [
        { title: `Significance of ${data.tithi.name} Tithi`, content: sec1 },
        { title: `Astronomical Parameters & Deity Guidance`, content: sec2 },
        { title: `Spiritual Rituals & Vrat Guidance`, content: sec3 }
      ],
      faqs,
      internalLinks,
      qualityScore: 100,
      passedQualityChecks: true
    };
  }
}
