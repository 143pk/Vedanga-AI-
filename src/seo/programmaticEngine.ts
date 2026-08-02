// Comprehensive Programmatic SEO Engine for Vedanga AI
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
  wordCount: number;
}

const BASE_URL = process.env.APP_URL || "https://vedanga-ai.vercel.app";

// Helper to normalize strings for slug comparison
function toSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Generate 25-30 thorough, Schema-compliant FAQs dynamically
function generateTopicFaqs(topicTitle: string, category: string, primaryPlanet?: string, secondaryItem?: string): FAQItem[] {
  const pName = primaryPlanet || "the ruling graha";
  const sec = secondaryItem || "the native's birth chart";

  return [
    {
      question: `What is the core significance of ${topicTitle} in Vedic Astrology?`,
      answer: `In classical Parashari Jyotish, ${topicTitle} plays a vital role in dictating individual karma, psychological temperament, and life event timing. It reveals how planetary energy manifests through the house cusps and zodiac signs of your birth chart.`
    },
    {
      question: `How does ${topicTitle} affect career development and professional success?`,
      answer: `${topicTitle} influences executive authority, communication style, perseverance, and strategic decision-making. When well-placed or supported by benefic aspects from Jupiter or Mercury, it accelerates career recognition, promotions, and financial stability.`
    },
    {
      question: `What is the impact of ${topicTitle} on marriage, love, and relationships?`,
      answer: `Relationships are governed by emotional harmony, mutual respect, and 7th house strength. ${topicTitle} shapes emotional sensitivity, communication tone, and long-term commitment in marital partnerships.`
    },
    {
      question: `Which remedies pacify challenging effects of ${topicTitle}?`,
      answer: `Authentic Vedic remedies include chanting the prescribed Beej Mantra daily during sunrise, offering water or milk to deities, donating grains to the needy, and wearing sattvic gemstones after evaluating your Janma Kundli.`
    },
    {
      question: `Does ${topicTitle} form any auspicious Yogas or inauspicious Doshas?`,
      answer: `Whether ${topicTitle} creates a Dosha or Yoga depends on planetary dignity, combustion, retrogression, and house lordship. Exalted placements form Raj Yogas, whereas afflicted placements may require targeted mantra sadhana.`
    },
    {
      question: `What ancient Sanskrit shlokas describe the results of ${topicTitle}?`,
      answer: `Brihat Parashara Hora Shastra states: 'Grahanam Chara-Charen Bhaavayam Jyotishm Sanatanah'—All planetary movements continually mirror past karmic seeds (Purva Janma Karma) unfolding during active Vimshottari Dasha cycles.`
    },
    {
      question: `How does ${topicTitle} operate during Mahadasha and Antardasha periods?`,
      answer: `During its active Vimshottari Mahadasha or Antardasha, ${topicTitle} becomes the chief driver of daily thoughts, opportunities, health shifts, and spiritual realizations.`
    },
    {
      question: `What gemstone is recommended for ${topicTitle}?`,
      answer: `Gemstones depend on the primary ruling planet. For Sun it is Ruby, Moon is Pearl, Mars is Red Coral, Mercury is Emerald, Jupiter is Yellow Sapphire, Venus is Diamond, and Saturn is Blue Sapphire.`
    },
    {
      question: `How can Vedanga AI analyze my birth chart for ${topicTitle}?`,
      answer: `Vedanga AI calculates exact planetary degrees, Nakshatra Padas, Ashtakavarga points, and Vimshottari Dasha timelines to provide personalized AI astrological guidance in real time.`
    },
    {
      question: `What is the difference between D1 Lagna chart and D9 Navamsha chart for ${topicTitle}?`,
      answer: `The D1 Lagna chart indicates physical manifestation and external life events, while the D9 Navamsha chart reveals soul destiny, inner strength, and long-term marital fulfillment.`
    },
    {
      question: `Can planetary transits (Gochar) modify the effects of ${topicTitle}?`,
      answer: `Yes! Major planetary transits—especially Saturn (Shani Gochar), Jupiter (Guru Gochar), Rahu, and Ketu—act as cosmic triggers that activate latent natal promises.`
    },
    {
      question: `What role does Nakshatra Pada play in ${topicTitle}?`,
      answer: `Each Nakshatra is divided into 4 Padas corresponding to Dharma, Artha, Kama, and Moksha. The specific Pada refines the subtle vibration and planetary ruler of the natal degree.`
    },
    {
      question: `How does Ashtakavarga score influence ${topicTitle}?`,
      answer: `A high Ashtakavarga score (4 or more bindus) in the relevant house ensures smooth results, financial protection, and resilience against adverse transits.`
    },
    {
      question: `What spiritual practices align with ${topicTitle}?`,
      answer: `Spiritual practices include morning Pranayama, Gayatri Mantra recitation, listening to Vedic Stotrams, and engaging in selfless service (Seva).`
    },
    {
      question: `Why is exact birth time critical for analyzing ${topicTitle}?`,
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
      question: `How can I check if Rahu or Ketu influences ${topicTitle}?`,
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

// Generate Topic Cluster Links dynamically based on the current slug
function generateTopicClusterLinks(slug: string): RelatedLink[] {
  const pMatch = PLANETS.find(p => slug.includes(p.key) || slug.includes(p.name.toLowerCase()));
  const pName = pMatch ? pMatch.name : "Sun";
  const pKey = pMatch ? pMatch.key : "sun";

  const cluster: RelatedLink[] = [
    { title: `${pName} Mahadasha Guide`, slug: `${pKey}-mahadasha`, category: "Dasha", description: `Navigating long-term karmic cycles, power dynamics, and life developments under ${pName} Mahadasha.` },
    { title: `${pName} Antardasha Analysis`, slug: `${pKey}-antardasha`, category: "Dasha", description: `Understanding sub-period event timing, career breakthroughs, and mental shifts during ${pName} Antardasha.` },
    { title: `${pName} in Aries (Exaltation)`, slug: `${pKey}-in-aries`, category: "Planets in Signs", description: `High energy, pioneering leadership, and dynamic self-expression of ${pName} in Aries.` },
    { title: `${pName} in 3rd House Mastery`, slug: `${pKey}-in-3rd-house`, category: "Planets in Houses", description: `Courage, self-effort, younger siblings, and media communication skills with ${pName} in 3rd House.` },
    { title: `${pName} in 10th House (Digbala)`, slug: `${pKey}-in-10th-house`, category: "Planets in Houses", description: `Directional strength, high executive authority, government recognition, and career success.` },
    { title: `${pName} with Saturn Conjunction`, slug: `${pKey}-saturn-conjunction`, category: "Conjunctions", description: `Balancing duty, discipline, fatherly karma, and delayed recognition in ${pName}-Saturn alignment.` },
    { title: `${pName} with Mars Conjunction`, slug: `${pKey}-mars-conjunction`, category: "Conjunctions", description: `High vitality, executive fire, competitive ambition, and physical stamina.` },
    { title: `${pName} Remedies & Beej Mantras`, slug: `${pKey}-remedies`, category: "Remedies", description: `Authentic Stotras, Beej Mantras, fasting protocols, and charity items to strengthen ${pName}.` },
    { title: `${pName} Gemstone Protocol`, slug: `${pKey}-gemstone-guide`, category: "Gemstones", description: `Metal selection, consecration mantras, and auspicious muhurat for wearing ${pMatch?.gemstone || "sacred gems"}.` },
    { title: "Free AI Kundli Generator", slug: "ai-kundli", category: "Calculators", description: "Generate complete Janma Kundli with planetary positions and active Dasha." },
    { title: "AI Marriage Compatibility & Gun Milan", slug: "marriage-prediction", category: "Matching", description: "36 Gun Milan, Ashtakoot match, Manglik Dosh check, and marriage prospects." },
    { title: "Vimshottari Dasha Timeline Calculator", slug: "dasha-analysis", category: "Dasha", description: "Explore active Mahadasha, Antardasha, and upcoming planetary shifts." },
    { title: "Career Astrology & 10th House Predictor", slug: "career-prediction", category: "Career", description: "Discover professional success, government job yogas, and business timing." },
    { title: "Janma Nakshatra Calculator", slug: "nakshatra-calculator", category: "Calculators", description: "Find your birth star, ruling deity, and Pada trait analysis." }
  ];

  return cluster.filter(l => l.slug !== slug);
}

// Main Dynamic Resolver for Programmatic SEO Pages
export function getProgrammaticPage(rawSlug: string): ProgrammaticPageData {
  const slug = toSlug(rawSlug);
  const todayStr = new Date().toISOString().split("T")[0];

  // 1. Check High-Intent Landing Pages
  const landingMatch = HIGH_INTENT_LANDINGS.find(l => l.slug === slug);
  if (landingMatch) {
    const faqs = generateTopicFaqs(landingMatch.h1, landingMatch.category);
    
    const sec1 = `Welcome to Vedanga AI's ${landingMatch.h1}. In Vedic Astrology (Jyotish Shastra), precise mathematical calculations are essential for accurate predictions. This authoritative engine combines Swiss Ephemeris longitudes with artificial intelligence to deliver detailed insights rooted in Maharishi Parashara's classical Brihat Parashara Hora Shastra, Saravali, and Phaladeepika.\n\nWhether you are analyzing your personal Janma Kundli, calculating active Vimshottari Dasha periods, evaluating 36 Ashtakoot Gun Milan points for marriage compatibility, or determining professional success via the D10 Dasamsa chart, Vedanga AI processes exact planetary degrees, house cusps (Sripati / Placidus), Ashtakavarga bindu scores, and Shadbala planetary strengths in real time.\n\nOur system bridges classical Sanskrit scriptural wisdom with modern user interface design, ensuring that seekers receive compassionate, highly actionable astrological guidance without complex manual mathematical calculations.`;
    
    const sec2 = `Key Astrological Metrics & Computational Architecture:\n\n1. Lagna & Lagna Lord (Ascendant): Determines physical stamina, overall life direction, vitality, and primary personal orientation.\n2. Moon Sign (Chandra Rashi) & Birth Nakshatra: Governs the mind (Manas), emotional subconscious, intuitive abilities, and Sade Sati vulnerability.\n3. Vimshottari Dasha Axis (120-Year Cycle): Identifies the exact ruling Mahadasha, Antardasha, and Pratyantardasha planets governing your current life timing.\n4. Divisional Charts (Shodashvarga): Examines the D9 Navamsha for marriage and spiritual growth, D10 Dasamsa for career and authority, and D7 Saptamsha for progeny.\n5. Planetary Dignities & Aspects (Drishti): Evaluates Exaltation (Uchcha), Debilitation (Neecha), Combustion (Mudhya), Retrogression (Vakra), and Mutual Aspects.`;
    
    const sec3 = `Authentic Vedic Remedies, Mantras & Remedial Protocols:\n\nIn classical Jyotish, remedies do not alter cosmic karma; rather, they refine the practitioner's inner subtle body (Sukshma Sharira) to withstand or transcend planetary afflictions.\n\n- Morning Solar Homage: Offer water to Surya Dev in a copper vessel at sunrise while chanting the Gayatri Mantra or Aditya Hridayam.\n- Beej Mantra Japa: Recite the planetary Beej Mantra 108 times daily using a consecrated Rudraksha or Sphatik mala.\n- Sattvic Charity (Dana): Donate yellow lentils, sesame seeds, grains, or copper items on consecrated planetary days to neutralize afflicted malefic energy.\n- Gemstone Consecration: Wear authentic natural gemstones set in recommended metals (Gold, Silver, Copper, Panchdhatu) after verifying Lagna lordship and house position.`;

    const sec4 = `How to Use Vedanga AI for Birth Chart Verification:\n\nTo begin your reading, simply enter your exact Date of Birth, Time of Birth (AM/PM), and Birth Location into Vedanga AI. The engine instantly computes your Sidereal Kundli using the Lahiri Ayanamsha (Chitrapaksha) and renders an interactive chart. You can then ask personalized questions to Guru Chat or navigate through dedicated analysis tabs for Horoscope, Dasha, Kundli Matching, and Learning Modules.`;

    const fullContent = `${sec1}\n\n${sec2}\n\n${sec3}\n\n${sec4}`;
    const wordCount = fullContent.split(/\s+/).length + faqs.map(f => f.question + " " + f.answer).join(" ").split(/\s+/).length;

    return {
      slug: landingMatch.slug,
      title: `${landingMatch.title} | Vedanga AI`,
      metaDescription: landingMatch.description,
      canonicalUrl: `${BASE_URL}/learn/${landingMatch.slug}`,
      category: landingMatch.category,
      h1: landingMatch.h1,
      author: "Acharya Vedanga - Chief Vedic Astrologer",
      updatedAt: todayStr,
      readTime: "8 min read • Master Tool Guide",
      scripturalShloka: "ॐ नमो ब्रह्मादिभ्यो विज्ञानसम्प्रदायकर्तृभ्यो वंशऋषिभ्यो महद्भ्यो नमो गुरुभ्यः॥",
      executiveSummary: `Welcome to Vedanga AI's ${landingMatch.h1}. This master tool combines high-precision ephemeris calculations with artificial intelligence to deliver exact astrological insights rooted in Maharishi Parashara's classical Brihat Parashara Hora Shastra.`,
      sections: [
        { title: "1. Executive Cosmic Overview & Methodology", content: sec1 },
        { title: "2. Key Astrological Metrics Analyzed", content: sec2 },
        { title: "3. Authentic Vedic Remedies & Practice Protocol", content: sec3 },
        { title: "4. Practical Application & Step-by-Step Guidance", content: sec4 }
      ],
      faqs,
      topicClusterLinks: generateTopicClusterLinks(slug),
      relatedPlanets: PLANETS,
      relatedHouses: HOUSES,
      relatedSigns: SIGNS,
      relatedNakshatras: NAKSHATRAS,
      ctaPrompt: landingMatch.ctaPrompt,
      wordCount,
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
          "mainEntity": faqs.slice(0, 15).map(f => ({
            "@type": "Question",
            "name": f.question,
            "acceptedAnswer": { "@type": "Answer", "text": f.answer }
          }))
        },
        {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": BASE_URL },
            { "@type": "ListItem", "position": 2, "name": "Learn", "item": `${BASE_URL}/learn` },
            { "@type": "ListItem", "position": 3, "name": landingMatch.h1, "item": `${BASE_URL}/learn/${landingMatch.slug}` }
          ]
        }
      ]
    };
  }

  // 2. Parse Dynamic Combinatorics Slugs
  let primaryPlanet = PLANETS.find(p => slug.includes(p.key) || slug.includes(p.name.toLowerCase()));
  let secondaryHouse = HOUSES.find(h => slug.includes(`${h.number}th`) || slug.includes(`${h.number}st`) || slug.includes(`${h.number}nd`) || slug.includes(`${h.number}rd`) || slug.includes(h.key));
  let secondarySign = SIGNS.find(s => slug.includes(s.key) || slug.includes(s.name.toLowerCase()));
  let secondaryNakshatra = NAKSHATRAS.find(n => slug.includes(n.key) || slug.includes(n.name.toLowerCase()));

  const formattedTitle = slug
    .split("-")
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  const category = slug.includes("house")
    ? "Planets in Houses"
    : slug.includes("mahadasha") || slug.includes("antardasha") || slug.includes("dasha")
    ? "Dasha Analysis"
    : slug.includes("ascendant") || slug.includes("lagna")
    ? "Ascendant Guide"
    : slug.includes("nakshatra")
    ? "Nakshatras"
    : slug.includes("panchang") || slug.includes("muhurat") || slug.includes("transit") || slug.includes("horoscope")
    ? "Daily Content"
    : "Vedic Astrology";

  const pName = primaryPlanet ? primaryPlanet.name : "Ruling Graha";
  const pSanskrit = primaryPlanet ? primaryPlanet.sanskrit : "Graha";

  const faqs = generateTopicFaqs(formattedTitle, category, primaryPlanet?.name, secondaryHouse?.name || secondarySign?.name || secondaryNakshatra?.name);

  const sec1 = `In classical Vedic Astrology (Jyotish Shastra), ${formattedTitle} represents a distinct cosmic vibration that shapes individual destiny, psychological conditioning, and life trajectories. According to Maharishi Parashara's foundational text Brihat Parashara Hora Shastra, every planetary configuration operates as a precise mirror of past karmic seeds (Purva Punya & Purva Janma Karma).\n\nWhen ${formattedTitle} manifests in a birth chart, it alters the energetic flow through the Sushumna Nadi and influences how the native processes ambition, relationships, career responsibilities, and spiritual growth. Understanding this placement allows seekers to align their personal willpower with cosmic rhythms rather than resisting karmic lessons.`;

  const sec2 = `Psychological Archetype & Behavioral Dynamics:\n\nFrom a psychological perspective, ${formattedTitle} shapes cognitive patterns, stress responses, and emotional instincts. When well-dignified or supported by benefic planetary aspects (such as Jupiter's aspect or Mercury's intellect), the native exhibits strong executive willpower, calm focus, and strategic foresight.\n\nConversely, if ${formattedTitle} suffers from combustion (Mudhya), debilitation (Neecha), or affliction from natural malefics (Rahu, Ketu, or Saturn), the native may experience initial self-doubt, internal friction, or delayed recognition. However, in Parashari Jyotish, malefic pressures often act as catalysts for profound spiritual endurance and lasting maturity over time.`;

  const sec3 = `Career, Wealth, Marriage & Health Indications:\n\n1. Executive Career & Authority: ${formattedTitle} directly impacts professional choices, leadership capacity, and public reputation. It determines whether a native thrives in government administration, corporate leadership, creative arts, or independent entrepreneurship.\n2. Wealth Accumulation (Dhana Yogas): In financial matters, this placement dictates liquid cash flow, savings habits, and investment risk tolerance. Linkages with the 2nd, 5th, 9th, and 11th houses create strong Dhana Yogas.\n3. Relationship Dynamics: In marital and domestic life, ${formattedTitle} influences emotional sensitivity, expectations from a partner, and communication clarity. Balanced energy fosters mutual respect and domestic tranquility.\n4. Health & Vitality: Physical well-being is governed by the Lagna and ruling Graha strengths. Proper alignment supports vitality, while afflicted placements highlight specific body parts requiring lifestyle discipline and Ayurvedic care.`;

  const sec4 = `Authentic Parashari Remedies & Mantra Sadhana:\n\nTo harmonize and strengthen ${formattedTitle}, classical texts recommend a structured remedial protocol:\n\n- Beej Mantra Recitation: Chant '${primaryPlanet?.mantra || "Om Namah Shivaya"}' 108 times during morning twilight.\n- Sacred Stotra Chanting: Recite the Aditya Hridayam Stotra, Vishnu Sahasranama, or Hanuman Chalisa depending on the ruling Graha.\n- Consecrated Gemstone Protocol: Wear natural ${primaryPlanet?.gemstone || "sattvic gems"} set in pure metal on ${primaryPlanet?.day || "auspicious days"} after consulting your Janma Kundli.\n- Sattvic Charity & Seva: Offer grains, sesame, or yellow lentils to the needy and practice selfless service to neutralize karmic blockages.`;

  const fullContent = `${sec1}\n\n${sec2}\n\n${sec3}\n\n${sec4}`;
  const wordCount = fullContent.split(/\s+/).length + faqs.map(f => f.question + " " + f.answer).join(" ").split(/\s+/).length;

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
      { title: `1. Parashari Mechanics & Cosmic Significance of ${formattedTitle}`, content: sec1 },
      { title: "2. Psychological Archetype & Behavioral Dynamics", content: sec2 },
      { title: "3. Career, Wealth, Marriage & Health Indications", content: sec3 },
      { title: "4. Authentic Parashari Remedies & Remedial Protocol", content: sec4 }
    ],
    faqs,
    topicClusterLinks: generateTopicClusterLinks(slug),
    relatedPlanets: PLANETS,
    relatedHouses: HOUSES,
    relatedSigns: SIGNS,
    relatedNakshatras: NAKSHATRAS,
    ctaPrompt: `Analyze ${formattedTitle} in my birth chart and give me personalized remedies`,
    wordCount,
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
        "mainEntity": faqs.slice(0, 15).map(f => ({
          "@type": "Question",
          "name": f.question,
          "acceptedAnswer": { "@type": "Answer", "text": f.answer }
        }))
      },
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": BASE_URL },
          { "@type": "ListItem", "position": 2, "name": "Learn", "item": `${BASE_URL}/learn` },
          { "@type": "ListItem", "position": 3, "name": formattedTitle, "item": `${BASE_URL}/learn/${slug}` }
        ]
      }
    ]
  };
}
