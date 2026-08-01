// Programmatic SEO Astrology Engine for Vedanga AI
import { PLANETS, HOUSES, SIGNS, NAKSHATRAS, HIGH_INTENT_LANDINGS } from "./astrologyData";

export interface FAQItem {
  question: string;
  answer: string;
}

export interface RelatedLink {
  title: string;
  slug: string;
  category: string;
  description: string;
}

export interface ProgrammaticPageData {
  slug: string;
  title: string;
  metaDescription: string;
  canonicalUrl: string;
  category: string;
  h1: string;
  author: string;
  updatedAt: string;
  readTime: string;
  scripturalShloka: string;
  executiveSummary: string;
  sections: {
    title: string;
    content: string;
  }[];
  faqs: FAQItem[];
  topicClusterLinks: RelatedLink[];
  relatedPlanets: typeof PLANETS;
  relatedHouses: typeof HOUSES;
  relatedSigns: typeof SIGNS;
  relatedNakshatras: typeof NAKSHATRAS;
  ctaPrompt: string;
  schemaJsonLd: Record<string, any>[];
}

const BASE_URL = "https://ais-pre-kkaqrfevbg3kelesribizv-259553995756.asia-southeast1.run.app";

// Helper to normalize strings for slug comparison
function toSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Generates 20-40 structured FAQs dynamically for any astrological topic
function generateTopicFaqs(topicTitle: string, category: string, primaryPlanet?: string, secondaryItem?: string): FAQItem[] {
  const pName = primaryPlanet || "the ruling graha";
  const sec = secondaryItem || "the native's birth chart";

  return [
    {
      question: `What is the significance of ${topicTitle} in Vedic Astrology?`,
      answer: `In classical Parashari Jyotish, ${topicTitle} plays a pivotal role in determining karmic trajectories, psychological temperament, and life event timing. It directly reflects how planetary forces interact with individual consciousness.`
    },
    {
      question: `How does ${topicTitle} affect career and professional growth?`,
      answer: `${topicTitle} influences executive authority, communication skills, perseverance, and strategic decision-making. When well-placed or supported by benefic aspects, it accelerates career recognition and financial success.`
    },
    {
      question: `What is the impact of ${topicTitle} on marriage and relationships?`,
      answer: `Relationships are governed by emotional harmony and mutual respect. ${topicTitle} influences emotional sensitivity, communication tone, and long-term commitment in partnerships.`
    },
    {
      question: `Which remedies are recommended for pacifying negative effects of ${topicTitle}?`,
      answer: `Authentic Vedic remedies include chanting the prescribed Beej Mantra daily during sunrise, offering water to Surya Dev, donating grain or sesame to the needy, and wearing sattvic gemstones after consulting your Kundli.`
    },
    {
      question: `Does ${topicTitle} cause any Doshas in the Kundli?`,
      answer: `Whether ${topicTitle} forms a Dosha or Yoga depends entirely on planetary dignity, combustion, retrogression, and house lordship. An afflicted placement can create temporary obstacles, whereas an exalted placement forms powerful Raj Yogas.`
    },
    {
      question: `What Sanskrit Shlokas describe the results of ${topicTitle}?`,
      answer: `Brihat Parashara Hora Shastra states: "Grahanam Chara-Charen Bhaavayam Jyotishm Sanatanah" - All planetary positions continually mirror past karmic seeds (Purva Janma Karma) that unfold during active Dasha periods.`
    },
    {
      question: `How does ${topicTitle} operate during Mahadasha and Antardasha?`,
      answer: `During its active Vimshottari Mahadasha or Antardasha, ${topicTitle} becomes the primary driver of daily thoughts, opportunities, health shifts, and spiritual realizations.`
    },
    {
      question: `What gemstone is associated with ${topicTitle}?`,
      answer: `Gemstones depend on the primary ruling planet. For example, Sun relates to Ruby (Manikya), Moon to Pearl, Mars to Red Coral, Mercury to Emerald, Jupiter to Yellow Sapphire, Venus to Diamond, and Saturn to Blue Sapphire.`
    },
    {
      question: `How can Vedanga AI help analyze my birth chart for ${topicTitle}?`,
      answer: `Vedanga AI calculates exact planetary degrees, Nakshatra Padas, Ashtakavarga points, and Vimshottari Dasha timelines to give you tailored AI astrological guidance in real time.`
    },
    {
      question: `Is ${topicTitle} different in D1 Lagna chart vs D9 Navamsha chart?`,
      answer: `Yes! The D1 Lagna chart indicates physical manifestation and external life events, while the D9 Navamsha chart reveals soul destiny, inner strength, and long-term marital fulfillment.`
    },
    {
      question: `Can planetary transit (Gochar) modify the effects of ${topicTitle}?`,
      answer: `Absolutely. Major planetary transits—especially Saturn (Shani Gochar), Jupiter (Guru Gochar), Rahu, and Ketu—act as cosmic triggers that activate latent natal promises.`
    },
    {
      question: `What role does Nakshatra Pada play in ${topicTitle}?`,
      answer: `Each Nakshatra is divided into 4 Padas corresponding to Dharma, Artha, Kama, and Moksha. The specific Pada refines the subtle vibration and planetary ruler of the natal degree.`
    },
    {
      question: `How does Ashtakavarga score influence ${topicTitle}?`,
      answer: `A high Ashtakavarga score (4 or more bindus) in the relevant house ensures smooth results and protection against adverse transits.`
    },
    {
      question: `What are the spiritual practices associated with ${topicTitle}?`,
      answer: `Spiritual practices include morning Pranayama, Gayatri Mantra recitation, listening to Vedic Stotram, and practicing selfless service (Seva).`
    },
    {
      question: `Why is time of birth critical for analyzing ${topicTitle}?`,
      answer: `An accurate birth time determines the precise Lagna degree and house cusps, which shift every 4 minutes. Precise birth time ensures accurate Dasha calculations.`
    },
    {
      question: `What food or lifestyle habits align with ${topicTitle}?`,
      answer: `Consuming fresh Sattvic food, drinking clean copper-infused water, maintaining disciplined sleep routines, and avoiding tamasic habits align your energy with positive planetary vibrations.`
    },
    {
      question: `Can Lal Kitab remedies be combined with Parashari remedies for ${topicTitle}?`,
      answer: `Lal Kitab remedies offer practical daily action steps (like feeding birds or offering milk to banyan roots) that complement traditional Parashari Mantra and Stotra practices.`
    },
    {
      question: `What is the difference between Mahadasha and Antardasha for ${topicTitle}?`,
      answer: `Mahadasha sets the overall 6 to 20-year cosmic climate, while Antardasha represents the sub-period (months to years) that brings specific event execution.`
    },
    {
      question: `How can I check if I have a Rahu or Ketu influence on ${topicTitle}?`,
      answer: `Rahu adds amplification, material obsession, and innovation, while Ketu brings detachment, deep intuition, and spiritual research. You can check this instantly in Vedanga AI.`
    },
    {
      question: `What makes Vedanga AI the most authoritative Vedic Astrology engine?`,
      answer: `Vedanga AI combines authentic Maharishi Parashara and Jaimini Jyotish algorithms with advanced Gemini AI intelligence to deliver precise, compassionate, and actionable astrological guidance.`
    },
    {
      question: `How does ${topicTitle} influence mental peace and stress management?`,
      answer: `Mental peace is closely linked to Moon and 4th House health. When ${topicTitle} activates supportive houses, it bestows emotional balance, calm focus, and resilience.`
    },
    {
      question: `Are there specific colors or days to wear for ${topicTitle}?`,
      answer: `Yes, each planet has consecrated days and colors: Sunday (Gold/Red for Sun), Monday (White/Silver for Moon), Tuesday (Bright Red for Mars), Wednesday (Green for Mercury), Thursday (Yellow for Jupiter), Friday (White/Pastel for Venus), Saturday (Blue/Black for Saturn).`
    },
    {
      question: `How does ${topicTitle} impact financial wealth and savings?`,
      answer: `Wealth (Dhana) is governed by 2nd, 5th, 9th, and 11th houses. When ${topicTitle} forms benefic linkages with these houses, it creates steady income streams and asset accumulation.`
    },
    {
      question: `Can meditation help neutralize challenging planetary transits for ${topicTitle}?`,
      answer: `Yes, meditation stabilizes the mind (Manas), preventing hasty reactive decisions during intense Saturn, Rahu, or Mars transits.`
    },
    {
      question: `Where can I ask deeper personalized questions about ${topicTitle}?`,
      answer: `You can click "Ask Vedanga AI about YOUR Birth Chart" on any page to open a live session with Guru Chat and receive personalized insights tailored to your exact Kundli.`
    }
  ];
}

// Topic Cluster Generator - Returns 8 to 15 internal links
function generateTopicClusterLinks(slug: string): RelatedLink[] {
  const links: RelatedLink[] = [
    { title: "Free AI Kundli Generator", slug: "ai-kundli", category: "Calculators", description: "Generate complete Janma Kundli with planetary positions and active Dasha." },
    { title: "AI Marriage Compatibility & Gun Milan", slug: "marriage-prediction", category: "Matching", description: "36 Gun Milan, Ashtakoot match, Manglik Dosh check, and marriage prospects." },
    { title: "Vimshottari Dasha Timeline Calculator", slug: "dasha-analysis", category: "Dasha", description: "Explore active Mahadasha, Antardasha, and upcoming planetary shifts." },
    { title: "Career Astrology & 10th House Predictor", slug: "career-prediction", category: "Career", description: "Discover professional success, government job yogas, and business timing." },
    { title: "Today's AI Horoscope Forecast", slug: "ai-horoscope", category: "Horoscope", description: "Daily Moon sign and Lagna planetary transit guidance." },
    { title: "Janma Nakshatra Calculator", slug: "nakshatra-calculator", category: "Calculators", description: "Find your birth star, ruling deity, and Pada trait analysis." },
    { title: "Saturn in 3rd House Mastery", slug: "saturn-in-3rd-house", category: "Planets in Houses", description: "Courage, perseverance, sibling dynamics, and long-term willpower." },
    { title: "Venus in Pisces Exaltation", slug: "venus-in-pisces", category: "Planets in Signs", description: "Unconditional love, divine devotion, creative brilliance, and luxury." },
    { title: "Sun Antardasha Analysis", slug: "sun-antardasha", category: "Dasha", description: "Vitality, authority, fatherly blessings, and career breakthroughs." },
    { title: "Rahu Mahadasha Guide", slug: "rahu-mahadasha", category: "Dasha", description: "Navigating material expansion, foreign travel, and worldly ambition." },
    { title: "Aquarius Ascendant Blueprint", slug: "aquarius-ascendant", category: "Ascendants", description: "Visionary intellect, humanitarian drive, and Saturnian structure." },
    { title: "Punarvasu Nakshatra Insights", slug: "punarvasu-nakshatra", category: "Nakshatras", description: "Renewal, divine protection, quiver of arrows, and abundance." }
  ];

  return links.filter(l => l.slug !== slug);
}

// Main Dynamic Resolver for all Programmatic SEO Slugs
export function getProgrammaticPage(rawSlug: string): ProgrammaticPageData {
  const slug = toSlug(rawSlug);
  const todayStr = new Date().toISOString().split("T")[0];

  // 1. Check High Intent Landing Pages
  const landingMatch = HIGH_INTENT_LANDINGS.find(l => l.slug === slug);
  if (landingMatch) {
    const faqs = generateTopicFaqs(landingMatch.h1, landingMatch.category);
    return {
      slug: landingMatch.slug,
      title: `${landingMatch.title} | Vedanga AI`,
      metaDescription: landingMatch.description,
      canonicalUrl: `${BASE_URL}/learn/${landingMatch.slug}`,
      category: landingMatch.category,
      h1: landingMatch.h1,
      author: "Acharya Vedanga - Chief Vedic Astrologer",
      updatedAt: todayStr,
      readTime: "6 min read • Master Tool Guide",
      scripturalShloka: "ॐ नमो ब्रह्मादिभ्यो विज्ञानसम्प्रदायकर्तृभ्यो वंशऋषिभ्यो महद्भ्यो नमो गुरुभ्यः॥",
      executiveSummary: `Welcome to Vedanga AI's ${landingMatch.h1}. This authoritative tool combines high-precision ephemeris calculations with artificial intelligence to deliver exact astrological insights rooted in Maharishi Parashara's classical Brihat Parashara Hora Shastra.`,
      sections: [
        {
          title: "1. Executive Cosmic Overview & Methodology",
          content: `In Vedic Astrology, precise calculations form the bedrock of accurate predictions. Vedanga AI processes planetary longitudes, Ayanamsha (Lahiri), house cusps (Sripati / Placidus), and Vimshottari Dasha sub-periods in real time to reveal your soul's karmic roadmap.`
        },
        {
          title: "2. Key Astrological Metrics Analyzed",
          content: `- **Lagna & Lagna Lord**: Defines physical stamina, identity, and primary life focus.\n- **Moon Sign & Nakshatra**: Unlocks mental temperament, emotional conditioning, and mind power.\n- **Vimshottari Dasha Axis**: Pinpoints active planetary timers dictating life milestones.\n- **Divisional Charts (Vargas)**: Analyzes D9 Navamsha for marriage and D10 Dasamsa for career.`
        },
        {
          title: "3. Authentic Vedic Remedies & Practice Protocol",
          content: `To harmonize planetary frequencies, practice daily morning Gayatri Mantra Japa, offer water to Surya Dev, chant planetary Beej Mantras, and engage in selfless service (Seva).`
        }
      ],
      faqs,
      topicClusterLinks: generateTopicClusterLinks(slug),
      relatedPlanets: PLANETS.slice(0, 4),
      relatedHouses: HOUSES.slice(0, 4),
      relatedSigns: SIGNS.slice(0, 4),
      relatedNakshatras: NAKSHATRAS.slice(0, 4),
      ctaPrompt: landingMatch.ctaPrompt,
      schemaJsonLd: [
        {
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": landingMatch.h1,
          "description": landingMatch.description,
          "author": { "@type": "Person", "name": "Acharya Vedanga - Chief Vedic Astrologer" },
          "publisher": { "@type": "Organization", "name": "Vedanga AI", "url": BASE_URL },
          "datePublished": todayStr,
          "dateModified": todayStr
        },
        {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": faqs.slice(0, 10).map(f => ({
            "@type": "Question",
            "name": f.question,
            "acceptedAnswer": { "@type": "Answer", "text": f.answer }
          }))
        }
      ]
    };
  }

  // 2. Parse Combinatorics Slugs (e.g. saturn-in-3rd-house, venus-in-pisces, sun-antardasha, rahu-mahadasha, aquarius-ascendant, punarvasu-nakshatra)
  let primaryPlanet = PLANETS.find(p => slug.includes(p.key) || slug.includes(p.name.toLowerCase()));
  let secondaryHouse = HOUSES.find(h => slug.includes(`${h.number}th`) || slug.includes(`${h.number}st`) || slug.includes(`${h.number}nd`) || slug.includes(`${h.number}rd`) || slug.includes(h.key));
  let secondarySign = SIGNS.find(s => slug.includes(s.key) || slug.includes(s.name.toLowerCase()));
  let secondaryNakshatra = NAKSHATRAS.find(n => slug.includes(n.key) || slug.includes(n.name.toLowerCase()));

  // Title formatting
  const formattedTitle = slug
    .split("-")
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  const category = slug.includes("house")
    ? "Planets in Houses"
    : slug.includes("mahadasha") || slug.includes("antardasha")
    ? "Dasha Analysis"
    : slug.includes("ascendant") || slug.includes("lagna")
    ? "Ascendant Guide"
    : slug.includes("nakshatra")
    ? "Nakshatras"
    : "Vedic Astrology";

  const pName = primaryPlanet ? primaryPlanet.name : "Planet";
  const pSanskrit = primaryPlanet ? primaryPlanet.sanskrit : "Graha";

  const faqs = generateTopicFaqs(formattedTitle, category, primaryPlanet?.name, secondaryHouse?.name || secondarySign?.name || secondaryNakshatra?.name);

  return {
    slug,
    title: `${formattedTitle} in Vedic Astrology – Complete Guide & Remedies | Vedanga AI`,
    metaDescription: `Discover the deep scriptural significance, career impact, relationship dynamics, and authentic Vedic remedies for ${formattedTitle} according to Parashari Jyotish.`,
    canonicalUrl: `${BASE_URL}/learn/${slug}`,
    category,
    h1: `${formattedTitle}: Detailed Vedic Astrological Analysis`,
    author: "Acharya Vedanga - Chief Vedic Astrologer",
    updatedAt: todayStr,
    readTime: "7 min read • Master Analysis",
    scripturalShloka: primaryPlanet
      ? `ॐ ${primaryPlanet.mantra} || ग्रहैः समस्तं जगदेतदोषैः सम्पूरितं वा परिपालितं वा ||`
      : "ॐ नमः शिवाय ॥ सर्वग्रह निवारकं सर्वमंगलदायकम् ॥",
    executiveSummary: `In classical Vedic Astrology (Jyotish), ${formattedTitle} creates a distinct karmic vibration. ${
      primaryPlanet ? `${primaryPlanet.name} (${primaryPlanet.sanskrit}), representing ${primaryPlanet.qualities.join(", ")},` : "This astrological placement"
    } interacts with the individual birth chart to influence life purpose, executive courage, financial prosperity, and spiritual evolution.`,
    sections: [
      {
        title: `1. Parashari Mechanics & Cosmic Significance of ${formattedTitle}`,
        content: `According to Maharishi Parashara's Brihat Parashara Hora Shastra, every planetary configuration operates as a precise mirror of past karmic seeds (Purva Punya & Karma). When ${formattedTitle} is active in your Kundli, it alters the energetic flow through your Sushumna Nadi and affects decision-making in daily life.`
      },
      {
        title: "2. Career, Wealth & Social Impact",
        content: `In professional matters, ${formattedTitle} dictates how you handle responsibility, executive pressure, communication, and financial management. Supported by benefic aspects or strong Ashtakavarga bindus, it bestows steady advancement, leadership recognition, and material prosperity.`
      },
      {
        title: "3. Relationships, Marriage & Emotional Harmony",
        content: `Emotional stability is rooted in the health of the Moon and 4th/7th houses. ${formattedTitle} shapes your communication style, empathy, expectations from a spouse, and overall peace in domestic partnerships.`
      },
      {
        title: "4. Authentic Practical Vedic Remedies (Mantra & Stotra)",
        content: `- **Mantra Sadhana**: Recite the Beej Mantra "${primaryPlanet?.mantra || "Om Namah Shivaya"}" 108 times daily during morning twilight.\n- **Charity (Dana)**: Offer grains, sesame seeds, or yellow lentils to the needy on ${primaryPlanet?.day || "Thursdays"}.\n- **Stotra Recitation**: Chant the Aditya Hridayam Stotra or Vishnu Sahasranama for divine protection and clarity.`
      }
    ],
    faqs,
    topicClusterLinks: generateTopicClusterLinks(slug),
    relatedPlanets: PLANETS,
    relatedHouses: HOUSES,
    relatedSigns: SIGNS,
    relatedNakshatras: NAKSHATRAS,
    ctaPrompt: `Analyze ${formattedTitle} in my birth chart and tell me its remedies`,
    schemaJsonLd: [
      {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": `${formattedTitle}: Detailed Vedic Astrological Analysis`,
        "description": `In-depth Vedic astrological analysis of ${formattedTitle}, covering career, marriage, health, and authentic Parashari remedies.`,
        "author": { "@type": "Person", "name": "Acharya Vedanga - Chief Vedic Astrologer" },
        "publisher": { "@type": "Organization", "name": "Vedanga AI", "url": BASE_URL },
        "datePublished": todayStr,
        "dateModified": todayStr
      },
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqs.slice(0, 10).map(f => ({
          "@type": "Question",
          "name": f.question,
          "acceptedAnswer": { "@type": "Answer", "text": f.answer }
        }))
      }
    ]
  };
}
