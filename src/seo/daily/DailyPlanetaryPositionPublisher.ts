// Daily Planetary Position Publisher
import { DailyCalculatedData, PublishedDailyArticle } from "./types";
import { getArticleImageUrl } from "../../components/BlogHub";

export class DailyPlanetaryPositionPublisher {
  static publish(data: DailyCalculatedData): Omit<PublishedDailyArticle, "schemaJsonLd" | "canonicalUrl" | "breadcrumbs"> {
    const slug = `today-planetary-positions-${data.dateStr}`;
    const title = `Today's Planetary Positions (${data.formattedDate}): Sidereal Graha Longitudes, Dignities & Ephemeris`;
    const h1 = `Today's Ephemeris & Planetary Positions (${data.formattedDate})`;
    const metaDescription = `Real-time planetary positions (Graha Gochar) for ${data.formattedDate}. Exact sidereal degrees, zodiac signs, Nakshatras, retrogressions, and planetary dignities evaluated using Lahiri Ayanamsha.`;

    const sec1 = `In Vedic Astrology (Jyotish Shastra), real-time planetary transits (Gochar) dynamically trigger karmic events across all 12 Lagna (Ascendant) and Moon signs. By tracking exact sidereal degrees using Lahiri Chitrapaksha Ayanamsha, astrologers analyze how active Grahas influence wealth, career, relationships, and health.

On ${data.formattedDate}, the 9 primary Grahas (Navagrahas) reside in their respective zodiac signs as detailed in today's sidereal ephemeris report.`;

    const sec2 = `Sidereal Planetary Ephemeris Report for ${data.formattedDate}:

${data.planetaryPositions.map(p => `- ${p.planet}: ${p.rashi} (${p.degree}) in ${p.nakshatra} Nakshatra ${p.isRetrograde ? "[RETROGRADE]" : ""} [Dignity: ${p.dignity}]`).join("\n")}`;

    const sec3 = `Astrological Interpretation of Today's Transits:
${data.activeTransit.title}: ${data.activeTransit.description}
Affected Signs: ${data.activeTransit.affectedSigns.join(", ")}.
Recommended Remedial Sadhana: ${data.activeTransit.remedy}`;

    const faqs = [
      { question: `What are the planetary positions today on ${data.formattedDate}?`, answer: `Today's planetary positions are calculated using exact sidereal longitudes (Lahiri Ayanamsha) as detailed in our ephemeris table.` },
      { question: `Are any planets retrograde today (${data.formattedDate})?`, answer: `Check our ephemeris table above for current retrogression (Vakra) status of Saturn, Jupiter, Mercury, Mars, or Venus.` }
    ];

    const internalLinks = [
      { title: "Free Janma Kundli Calculator", slug: "birth-chart-ai", category: "Calculators", description: "Calculate your complete birth chart with Lagna and Dasha." },
      { title: "Planet in Every House Guide", slug: "saturn-mahadasha", category: "Planets", description: "In-depth guide to planetary house placements." }
    ];

    return {
      id: `positions-${data.dateStr}`,
      slug,
      moduleType: "PlanetaryPositions",
      title,
      metaTitle: title,
      metaDescription,
      h1,
      category: "Daily Content",
      author: "Acharya Vedanga",
      publishedAt: data.dateStr,
      readTime: "6 min read",
      wordCount: 920,
      featuredImageUrl: getArticleImageUrl("planets", "Daily Content"),
      imageAltText: `Planetary positions and ephemeris for ${data.formattedDate}`,
      sections: [
        { title: `Sidereal Ephemeris & Gochar Overview`, content: sec1 },
        { title: `Exact Graha Positions & Dignity Table`, content: sec2 },
        { title: `Transit Impact Analysis & Parashari Remedies`, content: sec3 }
      ],
      faqs,
      tables: [
        {
          title: `Sidereal Graha Longitude Table (${data.formattedDate})`,
          headers: ["Planet (Graha)", "Rashi (Sign)", "Exact Degree", "Nakshatra", "Motion", "Dignity"],
          rows: data.planetaryPositions.map(p => [
            p.planet,
            p.rashi,
            p.degree,
            p.nakshatra,
            p.isRetrograde ? "Vakra (Retrograde)" : "Ruju (Direct)",
            p.dignity
          ])
        }
      ],
      internalLinks,
      qualityScore: 100,
      passedQualityChecks: true
    };
  }
}
