// Types and Interfaces for Automated Daily Publishing System

export interface DailyCalculatedData {
  dateStr: string; // YYYY-MM-DD
  dayName: string; // e.g. Sunday
  formattedDate: string; // e.g. August 2, 2026
  sunrise: string;
  sunset: string;
  moonrise: string;
  moonset: string;
  tithi: {
    name: string;
    paksha: "Shukla" | "Krishna";
    number: number;
    description: string;
    deity: string;
  };
  nakshatra: {
    name: string;
    pada: number;
    lord: string;
    deity: string;
    symbol: string;
    description: string;
  };
  yoga: {
    name: string;
    meaning: string;
  };
  karana: {
    name: string;
    type: string;
  };
  rahuKaal: {
    start: string;
    end: string;
    guidance: string;
  };
  gulikaKaal: {
    start: string;
    end: string;
    guidance: string;
  };
  yamagandaKaal: {
    start: string;
    end: string;
    guidance: string;
  };
  abhijitMuhurat: {
    start: string;
    end: string;
    auspiciousness: string;
  };
  choghadiya: {
    day: Array<{ time: string; name: string; type: "Good" | "Neutral" | "Inauspicious"; lord: string }>;
    night: Array<{ time: string; name: string; type: "Good" | "Neutral" | "Inauspicious"; lord: string }>;
  };
  planetaryPositions: Array<{
    planet: string;
    rashi: string;
    degree: string;
    nakshatra: string;
    isRetrograde: boolean;
    dignity: string;
  }>;
  activeTransit: {
    title: string;
    description: string;
    affectedSigns: string[];
    remedy: string;
  };
  festival: {
    name: string;
    hasFestival: boolean;
    description: string;
    rituals: string[];
    mantra: string;
  };
}

export interface PublishedDailyArticle {
  id: string; // e.g. panchang-2026-08-02
  slug: string; // e.g. daily-panchang-2026-08-02
  moduleType: 
    | "Panchang"
    | "Nakshatra"
    | "Tithi"
    | "SunTimes"
    | "MoonTimes"
    | "PlanetaryPositions"
    | "Transit"
    | "RahuKaal"
    | "Gulika"
    | "Yamaganda"
    | "Abhijit"
    | "Choghadiya"
    | "Festival"
    | "Horoscope"
    | "Knowledge"
    | "FAQ"
    | "Trending";
  title: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  canonicalUrl: string;
  category: string;
  author: string;
  publishedAt: string; // YYYY-MM-DD
  readTime: string;
  wordCount: number;
  featuredImageUrl: string;
  imageAltText: string;
  sections: Array<{
    title: string;
    content: string;
  }>;
  faqs: Array<{
    question: string;
    answer: string;
  }>;
  tables?: Array<{
    title: string;
    headers: string[];
    rows: string[][];
  }>;
  internalLinks: Array<{
    title: string;
    slug: string;
    category: string;
    description: string;
  }>;
  breadcrumbs: Array<{
    name: string;
    url: string;
  }>;
  schemaJsonLd: Record<string, any>[];
  qualityScore: number;
  passedQualityChecks: boolean;
}

export interface QualityCheckResult {
  passed: boolean;
  score: number;
  wordCount: number;
  checks: {
    isUnique: boolean;
    hasMinWordCount: boolean;
    hasInternalLinks: boolean;
    hasValidMetadata: boolean;
    hasValidSchema: boolean;
    hasImageOptimization: boolean;
  };
  errors: string[];
}
