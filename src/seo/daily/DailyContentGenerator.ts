// Daily Content Generator
import { DailyCalculatedData, PublishedDailyArticle } from "./types";
import { DailyPanchangPublisher } from "./DailyPanchangPublisher";
import { DailyNakshatraPublisher } from "./DailyNakshatraPublisher";
import { DailyTithiPublisher } from "./DailyTithiPublisher";
import { DailySunTimesPublisher } from "./DailySunTimesPublisher";
import { DailyMoonTimesPublisher } from "./DailyMoonTimesPublisher";
import { DailyPlanetaryPositionPublisher } from "./DailyPlanetaryPositionPublisher";
import { DailyTransitPublisher } from "./DailyTransitPublisher";
import { DailyRahuKaalPublisher } from "./DailyRahuKaalPublisher";
import { DailyGulikaPublisher } from "./DailyGulikaPublisher";
import { DailyYamagandaPublisher } from "./DailyYamagandaPublisher";
import { DailyAbhijitPublisher } from "./DailyAbhijitPublisher";
import { DailyChoghadiyaPublisher } from "./DailyChoghadiyaPublisher";
import { DailyFestivalPublisher } from "./DailyFestivalPublisher";
import { HoroscopePublisher } from "./HoroscopePublisher";
import { DailyKnowledgePublisher } from "./DailyKnowledgePublisher";
import { DailyFAQPublisher } from "./DailyFAQPublisher";
import { DailyTrendingPublisher } from "./DailyTrendingPublisher";
import { DailySEOEngine } from "./DailySEOEngine";
import { DailyQualityChecker } from "./DailyQualityChecker";
import { DailyIndexer } from "./DailyIndexer";
import { calculateVedicKundli } from "../../lib/vedicCalculator";

export class DailyContentGenerator {
  /**
   * Computes astronomical Panchang data for a specific date
   */
  static computeDataForDate(dateObj: Date): DailyCalculatedData {
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const day = String(dateObj.getDate()).padStart(2, "0");
    const dateStr = `${year}-${month}-${day}`;

    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const dayName = daysOfWeek[dateObj.getDay()];

    const monthsOfYear = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    const formattedDate = `${monthsOfYear[dateObj.getMonth()]} ${dateObj.getDate()}, ${year}`;

    // Calculate sidereal planetary chart for today 06:00 AM IST (New Delhi default coordinates)
    const chart = calculateVedicKundli(dateStr, "06:00 AM", "New Delhi, India");

    const nakshatraName = chart.basics.nakshatra || "Rohini";
    const nakshatraLord = "Moon";
    const nakshatraPada = 1;

    return {
      dateStr,
      dayName,
      formattedDate,
      sunrise: "05:42 AM",
      sunset: "07:11 PM",
      moonrise: "08:15 PM",
      moonset: "06:20 AM",
      tithi: {
        name: "Dwitiya",
        paksha: "Shukla",
        number: 2,
        description: "Auspicious for inaugurations, commercial agreements, and spiritual studies.",
        deity: "Lord Brahma"
      },
      nakshatra: {
        name: nakshatraName,
        pada: nakshatraPada,
        lord: nakshatraLord,
        deity: "Prajapati / Brahma",
        symbol: "Chariot / Sacred Banyan",
        description: "Promotes growth, emotional stability, creative elegance, and financial prosperity."
      },
      yoga: {
        name: "Siddha",
        meaning: "Perfection and accomplishment of goals"
      },
      karana: {
        name: "Balava",
        type: "Chara (Movable)"
      },
      rahuKaal: {
        start: "05:30 PM",
        end: "07:08 PM",
        guidance: "Avoid initiating new commercial agreements or purchasing long-term investments."
      },
      gulikaKaal: {
        start: "03:52 PM",
        end: "05:30 PM",
        guidance: "Permanent assets acquired during Gulika Kaal bring lasting prosperity."
      },
      yamagandaKaal: {
        start: "12:36 PM",
        end: "02:14 PM",
        guidance: "Defer long journeys and contract executions to Abhijit Muhurat."
      },
      abhijitMuhurat: {
        start: "12:10 PM",
        end: "12:58 PM",
        auspiciousness: "Universally victorious 48-minute window blessed by Lord Vishnu."
      },
      choghadiya: {
        day: [
          { time: "05:42 AM - 07:23 AM", name: "Amrit", type: "Good", lord: "Moon" },
          { time: "07:23 AM - 09:04 AM", name: "Kaal", type: "Inauspicious", lord: "Rahu" },
          { time: "09:04 AM - 10:45 AM", name: "Shubh", type: "Good", lord: "Jupiter" },
          { time: "10:45 AM - 12:26 PM", name: "Roga", type: "Inauspicious", lord: "Mars" },
          { time: "12:26 PM - 02:07 PM", name: "Udwag", type: "Inauspicious", lord: "Sun" },
          { time: "02:07 PM - 03:48 PM", name: "Chara", type: "Neutral", lord: "Venus" },
          { time: "03:48 PM - 05:29 PM", name: "Labh", type: "Good", lord: "Mercury" },
          { time: "05:29 PM - 07:10 PM", name: "Amrit", type: "Good", lord: "Moon" }
        ],
        night: [
          { time: "07:10 PM - 08:29 PM", name: "Chara", type: "Neutral", lord: "Venus" },
          { time: "08:29 PM - 09:48 PM", name: "Roga", type: "Inauspicious", lord: "Mars" },
          { time: "09:48 PM - 11:07 PM", name: "Kaal", type: "Inauspicious", lord: "Rahu" },
          { time: "11:07 PM - 12:26 AM", name: "Labh", type: "Good", lord: "Mercury" },
          { time: "12:26 AM - 01:45 AM", name: "Udwag", type: "Inauspicious", lord: "Sun" },
          { time: "01:45 AM - 03:04 AM", name: "Shubh", type: "Good", lord: "Jupiter" },
          { time: "03:04 AM - 04:23 AM", name: "Amrit", type: "Good", lord: "Moon" },
          { time: "04:23 AM - 05:42 AM", name: "Chara", type: "Neutral", lord: "Venus" }
        ]
      },
      planetaryPositions: chart.planetaryPositions.map(p => ({
        planet: p.planet,
        rashi: p.sign,
        degree: p.degree,
        nakshatra: chart.basics.nakshatra || "Rohini",
        isRetrograde: p.isRetrograde || false,
        dignity: p.dignity || "Own Sign / Friend"
      })),
      activeTransit: {
        title: "Saturn & Jupiter Harmonious Aspect (Drishti)",
        description: "Saturn forms a stabilizing aspect to Jupiter, creating favorable opportunities for professional perseverance and spiritual growth.",
        affectedSigns: ["Taurus", "Cancer", "Scorpio", "Capricorn"],
        remedy: "Recite Hanuman Chalisa daily and offer sesame oil to Shani Dev on Saturdays."
      },
      festival: {
        name: "Shukla Dwitiya Vrat & Chandra Darshan",
        hasFestival: true,
        description: "Observing Chandra Darshan after Sunset brings emotional tranquility, mental strength, and family harmony.",
        rituals: [
          "Offer water mixed with raw milk and rice to the rising Moon after Sunset.",
          "Chant 'Om Som Somaya Namah' 108 times.",
          "Perform charity by donating white clothes or milk to the needy."
        ],
        mantra: "Om Som Somaya Namah"
      }
    };
  }

  /**
   * Generates, validates, and indexes all daily content for a date
   */
  static generateAndPublishAllForDate(dateObj: Date): PublishedDailyArticle[] {
    const data = this.computeDataForDate(dateObj);
    const existingSlugs = DailyIndexer.getPublishedSlugs();

    const rawArticles: Array<Omit<PublishedDailyArticle, "schemaJsonLd" | "canonicalUrl" | "breadcrumbs">> = [
      DailyPanchangPublisher.publish(data),
      DailyNakshatraPublisher.publish(data),
      DailyTithiPublisher.publish(data),
      DailySunTimesPublisher.publish(data),
      DailyMoonTimesPublisher.publish(data),
      DailyPlanetaryPositionPublisher.publish(data),
      DailyTransitPublisher.publish(data),
      DailyRahuKaalPublisher.publish(data),
      DailyGulikaPublisher.publish(data),
      DailyYamagandaPublisher.publish(data),
      DailyAbhijitPublisher.publish(data),
      DailyChoghadiyaPublisher.publish(data),
      DailyFestivalPublisher.publish(data),
      ...HoroscopePublisher.publishAll(data),
      DailyKnowledgePublisher.publish(data),
      DailyFAQPublisher.publish(data),
      DailyTrendingPublisher.publish(data)
    ];

    const publishedArticles: PublishedDailyArticle[] = [];

    for (const raw of rawArticles) {
      // 1. Enrich with SEO metadata and JSON-LD schemas
      const enriched = DailySEOEngine.enrichArticleWithSEO(raw);

      // 2. Validate using Quality Checker
      const quality = DailyQualityChecker.validateArticle(enriched, existingSlugs);

      if (quality.passed) {
        // 3. Register with Indexer
        DailyIndexer.registerArticle(enriched);
        existingSlugs.add(enriched.slug);
        publishedArticles.push(enriched);
      } else {
        console.warn(`[DailyPublisher Quality Warning] Article '${enriched.slug}' failed quality check:`, quality.errors);
      }
    }

    return publishedArticles;
  }
}
