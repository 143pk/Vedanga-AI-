// Comprehensive Category & Sub-Topic Hub Data Engine for Vedanga Astrology
import { PLANETS, HOUSES, SIGNS, NAKSHATRAS } from "./astrologyData";

export interface ArticleCard {
  title: string;
  slug: string;
  category: string;
  snippet: string;
  readTime: string;
  date: string;
  views: number;
  featured?: boolean;
  trending?: boolean;
  tags: string[];
}

export interface TopicCard {
  id: string;
  title: string;
  sanskritTitle?: string;
  description: string;
  slug?: string; // If it goes directly to an article, or a sub-topic hub
  topicKey?: string;
  iconName?: string;
  count?: number;
  badge?: string;
}

export interface CategoryHubInfo {
  id: string;
  title: string;
  sanskritTitle?: string;
  icon: string;
  heroHeadline: string;
  heroSubheadline: string;
  introductionContent: string[]; // 500 - 1000 words paragraphs
  subTopics: TopicCard[];
  tags: string[];
  relatedCategories: { id: string; title: string }[];
}

export interface SubTopicHubInfo {
  id: string;
  categoryId: string;
  categoryTitle: string;
  title: string;
  sanskritTitle?: string;
  heroHeadline: string;
  heroSubheadline: string;
  introductionContent: string[];
  subTopics: TopicCard[];
  tags: string[];
  relatedCategories: { id: string; title: string; categoryId: string; topicKey: string }[];
}

// --------------------------------------------------------------------------
// CATEGORY HUBS DATA
// --------------------------------------------------------------------------

export const CATEGORY_HUBS: Record<string, CategoryHubInfo> = {
  home: {
    id: "home",
    title: "Vedanga Astrology Journal",
    sanskritTitle: "वेदाङ्ग ज्योतिष शोध पत्रिका",
    icon: "BookOpen",
    heroHeadline: "Classical Parashari & Jaimini Vedic Astrology Knowledge Base",
    heroSubheadline: "Explore authentic scriptural insights on Navagrahas, 12 Bhavas, 27 Nakshatras, Vimshottari Dashas, Daily Panchang, Yogas, and Remedies.",
    introductionContent: [
      "Welcome to the Vedanga Astrology Journal — an authoritative research repository dedicated to classical Vedic astrology (Jyotish Shastra). Rooted in fundamental texts like Brihat Parashara Hora Shastra, Phaladeepika, Saravali, and Jaimini Sutram, our journal connects timeless wisdom with practical modern analysis.",
      "Navigate through our categorized knowledge hubs covering planetary placements (Navagraha), house lords (Bhavas), lunar mansions (Nakshatras), planetary periods (Vimshottari Dasha), daily Panchang, and planetary transits.",
      "Use the sidebar navigation or search bar above to instantly find deep-dive articles, calculation guides, and traditional remedies tailored to your curiosity."
    ],
    subTopics: [
      { id: "planets-hub", topicKey: "planets", title: "Navagraha - Planets Hub", slug: "planets", description: "Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn, Rahu, and Ketu in classical astrology." },
      { id: "houses-hub", topicKey: "houses", title: "12 Bhavas - Houses Hub", slug: "houses", description: "1st House to 12th House, house lords, aspects, and house strength." },
      { id: "signs-hub", topicKey: "zodiac-signs", title: "12 Rashis - Zodiac Signs", slug: "zodiac-signs", description: "Aries to Pisces: elements, lords, exaltation, and sign characteristics." },
      { id: "nakshatras-hub", topicKey: "nakshatras", title: "27 Nakshatras - Lunar Mansions", slug: "nakshatras", description: "Ashwini to Revati: deities, padas, ruling planets, and nakshatra characteristics." },
      { id: "daily-astrology-hub", topicKey: "daily-astrology", title: "Daily Panchang & Transits", slug: "daily-astrology", description: "Today's Tithi, Nakshatra, Rahu Kaal, Abhijit Muhurat, and transits." },
      { id: "dashas-hub", topicKey: "dashas", title: "Vimshottari Dashas", slug: "dashas", description: "Mahadasha, Antardasha, and Pratyantar Dasha timing and interpretations." },
    ],
    tags: ["Vedic Astrology", "Jyotish Shastra", "Navagraha", "Kundli", "Panchang", "Nakshatra", "Vimshottari Dasha", "Parashari"],
    relatedCategories: [
      { id: "planets", title: "Planets Hub" },
      { id: "houses", title: "Houses Hub" },
      { id: "daily-astrology", title: "Daily Astrology" },
      { id: "nakshatras", title: "Nakshatras Hub" }
    ]
  },

  trending: {
    id: "trending",
    title: "Trending Topics in Astrology",
    sanskritTitle: "चर्चित विषय",
    icon: "Flame",
    heroHeadline: "Most Read & Discussed Vedic Astrology Research Articles Today",
    heroSubheadline: "Discover trending planetary transits, high-impact Yogas, Sade Sati guides, and viral Kundli interpretations.",
    introductionContent: [
      "Stay informed with the most sought-after classical Jyotish topics right now. From current Saturn and Rahu transits to high-potency Dhan Yogas and Sade Sati mitigation guides, these articles represent our community's top readings."
    ],
    subTopics: [
      { id: "tr-saturn", topicKey: "saturn", title: "Saturn Transits & Sade Sati", slug: "saturn-in-3rd-house", description: "Shani Dev's impact across houses and signs." },
      { id: "tr-venus", topicKey: "venus", title: "Venus Exaltation & Relationships", slug: "venus-in-pisces", description: "Shukra Dev's role in love, art, and prosperity." },
      { id: "tr-panchang", topicKey: "panchang", title: "Daily Panchang & Muhurat", slug: "daily-panchang", description: "Real-time celestial timings and auspicious periods." },
    ],
    tags: ["Trending", "Saturn", "Venus", "Panchang", "Sade Sati", "Transits"],
    relatedCategories: [
      { id: "planets", title: "Planets Hub" },
      { id: "daily-astrology", title: "Daily Astrology" }
    ]
  },

  latest: {
    id: "latest",
    title: "Latest Vedic Knowledge Articles",
    sanskritTitle: "नवीनतम लेख",
    icon: "Newspaper",
    heroHeadline: "Freshly Published Research, Panchang & Planetary Analysis",
    heroSubheadline: "Explore our newest articles on classical Parashari principles, Remedies, Gemstones, and Nakshatra Padas.",
    introductionContent: [
      "Browse the newest additions to the Vedanga Astrology Journal repository. Our researchers regularly publish comprehensive, scripturally grounded guides."
    ],
    subTopics: [
      { id: "lt-panchang", topicKey: "panchang", title: "Today's Panchang", slug: "daily-panchang", description: "Daily astronomical updates." },
      { id: "lt-saturn", topicKey: "saturn", title: "Saturn in 3rd House", slug: "saturn-in-3rd-house", description: "New research on Shani Dev." }
    ],
    tags: ["Latest", "New Articles", "Jyotish Research", "Vedic Astrology"],
    relatedCategories: [
      { id: "planets", title: "Planets Hub" },
      { id: "houses", title: "Houses Hub" }
    ]
  },

  popular: {
    id: "popular",
    title: "Most Popular Astrology Guides",
    sanskritTitle: "लोकप्रिय मार्गदर्शिकाएँ",
    icon: "Star",
    heroHeadline: "All-Time Most Read Classical Astrology Masterclasses",
    heroSubheadline: "Our definitive guides on Kundli Matching, Vimshottari Dashas, Raj Yogas, and Planetary Gemstones.",
    introductionContent: [
      "These essential articles have guided thousands of practitioners and seekers understanding birth charts, planetary periods, and remedies."
    ],
    subTopics: [
      { id: "pop-matching", topicKey: "marriage", title: "36 Points Kundli Matching", slug: "ashtakoota-kundli-matching", description: "Ashtakoota marriage compatibility breakdown." },
      { id: "pop-dasha", topicKey: "dashas", title: "Saturn Mahadasha Survival Guide", slug: "saturn-mahadasha", description: "19-year Vimshottari dasha navigation." },
      { id: "pop-gemstone", topicKey: "gemstones", title: "Blue Sapphire (Neelam) Guide", slug: "blue-sapphire-neelam", description: "Testing and wearing Saturn's gemstone." }
    ],
    tags: ["Popular", "Kundli Matching", "Mahadasha", "Gemstones", "Yogas"],
    relatedCategories: [
      { id: "dashas", title: "Dashas Hub" },
      { id: "gemstones", title: "Gemstones Hub" }
    ]
  },

  planets: {
    id: "planets",
    title: "Navagraha - Planets Hub",
    sanskritTitle: "नवग्रह मण्डल",
    icon: "CircleDot",
    heroHeadline: "The Nine Cosmic Influencers (Navagrahas) in Vedic Astrology",
    heroSubheadline: "Explore how Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn, Rahu, and Ketu shape human consciousness, destiny, health, and karmic timing.",
    introductionContent: [
      "In classical Vedic Astrology (Jyotish Shastra), the Nine Planets or 'Navagrahas' are not merely physical celestial bodies floating in space; they are cosmic energy centers that administer individual karma. The word 'Graha' in Sanskrit derives from the root 'Grah', which means 'to seize' or 'to influence'. Grahas seize human consciousness at the moment of birth according to exact sidereal longitudes, embedding planetary blueprints into your Janma Kundli (birth chart).",
      "Each Graha rules specific domains of life. The Sun (Surya) represents the Atman (soul), willpower, father, government, and vitality. The Moon (Chandra) governs Manas (mind), emotions, mother, liquid elements, and psychological stability. Mars (Mangal) rules physical courage, energy, siblings, and real estate. Mercury (Budha) controls intellect, speech, commerce, and analytical discrimination.",
      "Jupiter (Guru) represents divine wisdom, spiritual grace, children, wealth, and higher learning. Venus (Shukra) rules love, marital harmony, creative arts, luxury, and devotion. Saturn (Shani) is the cosmic taskmaster, enforcing karmic discipline, endurance, longevity, and spiritual humility. Rahu and Ketu—the lunar nodes—act as karmic shadow planets, driving worldly desire and spiritual liberation respectively.",
      "Navigating planetary placements across the 12 Bhavas (houses) and 12 Rashis (zodiac signs) reveals the timing of Vimshottari Mahadashas, planetary transits (Gochara), and functional benefic or malefic influences. Understanding Navagraha dynamics enables you to harness cosmic rhythms, select suitable gemstones, perform targeted Beej Mantra japas, and optimize auspicious life decisions."
    ],
    subTopics: PLANETS.map((p) => ({
      id: p.key,
      topicKey: p.key,
      title: `${p.name} (${p.sanskrit})`,
      sanskritTitle: p.sanskrit,
      description: p.description,
      badge: p.element,
      count: 12
    })),
    tags: ["Navagraha", "Surya", "Chandra", "Mangal", "Budha", "Guru", "Shukra", "Shani", "Rahu", "Ketu", "Exaltation", "Debilitation", "Combustion"],
    relatedCategories: [
      { id: "daily-astrology", title: "Daily Planetary Positions" },
      { id: "dashas", title: "Vimshottari Dashas" },
      { id: "gemstones", title: "Graha Gemstones" },
      { id: "remedies", title: "Planetary Remedies" }
    ]
  },

  "daily-astrology": {
    id: "daily-astrology",
    title: "Daily Panchang & Celestial Calendar",
    sanskritTitle: "दैनिक पञ्चाङ्ग एवं मुहूर्त",
    icon: "Calendar",
    heroHeadline: "Complete Daily Vedic Panchang, Muhurats & Astronomical Timings",
    heroSubheadline: "Track today's Tithi, Nakshatra, Yoga, Karana, Rahu Kaal, Choghadiya, Abhijit Muhurat, and planetary transits calculated via Lahiri Ayanamsha.",
    introductionContent: [
      "The Panchang is the traditional Vedic astronomical almanac consisting of five (Pancha) vital limbs (Anga): Tithi (Lunar Day), Vara (Solar Weekday), Nakshatra (Lunar Mansion), Yoga (Solar-Lunar Angle), and Karana (Half Lunar Day). Together, these five limbs capture the exact vibrational quality of time (Kaala) at any given moment.",
      "By consulting the daily Panchang, practitioners of Vedic wisdom align their important activities—such as starting new businesses, holding weddings, purchasing property, or initiating spiritual sadhanas—with auspicious planetary energies (Auspicious Muhurat), while avoiding inauspicious time windows like Rahu Kaal, Yamaganda Kaal, and Gulika Kaal.",
      "Furthermore, tracking today's planetary positions and daily Choghadiya muhurats allows individuals to optimize daily scheduling. Whether you are seeking the exact time for today's Sunrise and Sunset, Moonrise and Moonset, or daily festivals and fasts (Vrats), the Daily Panchang Hub serves as your definitive celestial guide."
    ],
    subTopics: [
      { id: "daily-panchang", title: "Today's Panchang", slug: "daily-panchang", description: "Detailed 5-limb almanac with Tithi, Vara, Nakshatra, Yoga, Karana." },
      { id: "daily-nakshatra", title: "Today's Nakshatra", slug: "daily-nakshatra", description: "Current active Nakshatra, deity, pada, and auspicious activities." },
      { id: "daily-tithi", title: "Today's Tithi", slug: "daily-tithi", description: "Active lunar day, paksha (Shukla/Krishna), and spiritual significance." },
      { id: "daily-sunrise-sunset", title: "Today's Sunrise & Sunset", slug: "daily-sunrise-sunset", description: "Precise astronomical solar timings for your location." },
      { id: "daily-moonrise-moonset", title: "Today's Moonrise & Moonset", slug: "daily-moonrise-moonset", description: "Moon phase, illumination percentage, and lunar timings." },
      { id: "daily-planetary-positions", title: "Today's Planetary Positions", slug: "daily-planetary-positions", description: "Real-time Sidereal longitudes of all 9 planets today." },
      { id: "daily-planetary-transits", title: "Today's Planetary Transits", slug: "daily-planetary-transits", description: "Major planetary ingress, retrogression, and sign changes." },
      { id: "daily-rahu-kaal", title: "Today's Rahu Kaal", slug: "daily-rahu-kaal", description: "Inauspicious 90-minute window governed by Rahu to avoid new beginnings." },
      { id: "daily-gulika-kaal", title: "Today's Gulika Kaal", slug: "daily-gulika-kaal", description: "Saturnian sub-period timing for routine work and duties." },
      { id: "daily-yamaganda-kaal", title: "Today's Yamaganda Kaal", slug: "daily-yamaganda-kaal", description: "Ketu-influenced window; avoid critical financial transactions." },
      { id: "daily-abhijit-muhurat", title: "Today's Abhijit Muhurat", slug: "daily-abhijit-muhurat", description: "Most auspicious mid-day 48-minute period that destroys all doshas." },
      { id: "daily-choghadiya", title: "Today's Choghadiya", slug: "daily-choghadiya", description: "Day and Night Choghadiya table (Amrit, Shubh, Labh, Chara, Rog, Kaal, Udveg)." },
      { id: "daily-festivals-vrats", title: "Today's Festivals & Vrats", slug: "daily-festivals-vrats", description: "Ekadashi, Pradosh, Sankashti, and Hindu festival observances today." }
    ],
    tags: ["Panchang", "Tithi", "Nakshatra", "Rahu Kaal", "Abhijit Muhurat", "Choghadiya", "Sunrise", "Moonrise", "Gochara"],
    relatedCategories: [
      { id: "daily-horoscope", title: "Daily Horoscope" },
      { id: "muhurat", title: "Auspicious Muhurat" },
      { id: "vrat-festivals", title: "Festivals & Vrats" }
    ]
  },

  "daily-horoscope": {
    id: "daily-horoscope",
    title: "Daily Horoscope & Rashi Bhavishya",
    sanskritTitle: "दैनिक राशि भविष्य",
    icon: "SunMedium",
    heroHeadline: "Accurate Daily Horoscope Predictions for All 12 Zodiac Signs",
    heroSubheadline: "Discover today's career, love, health, and financial forecasts based on real-time Moon transit (Chandra Rashi) and planetary aspects.",
    introductionContent: [
      "In authentic Vedic Astrology, daily horoscopes (Rashifal) are calculated based on the position of the Moon (Chandra) as it transits through the 12 zodiac signs (Rashis) and 27 Nakshatras. Because the Moon reflects the human mind and emotional state, lunar transit predictions offer deeply relevant daily guidance.",
      "Unlike western astrology which relies heavily on solar months, Vedic Rashi Bhavishya analyzes how today's transiting planets aspect your Moon Sign, Ascendant (Lagna), and active Dasha lords. This reveals favorable hours for decision-making, lucky colors, lucky numbers, and specific cautions.",
      "Select your Moon Sign or Rising Sign below to read your detailed daily forecast, including career opportunities, romantic compatibility, financial flow, health advice, and daily spiritual remedies."
    ],
    subTopics: SIGNS.map((s) => ({
      id: `${s.key}-horoscope`,
      topicKey: s.key,
      title: `${s.name} (${s.sanskrit})`,
      sanskritTitle: s.sanskrit,
      description: `Today's horoscope prediction, lucky color, number, and transit insights for ${s.name}.`,
      badge: s.element
    })),
    tags: ["Daily Horoscope", "Moon Sign", "Chandra Rashi", "Aries Horoscope", "Taurus Horoscope", "Scorpio Horoscope", "Rashifal"],
    relatedCategories: [
      { id: "zodiac-signs", title: "Zodiac Signs Guide" },
      { id: "daily-astrology", title: "Daily Panchang" }
    ]
  },

  houses: {
    id: "houses",
    title: "The 12 Houses (Bhavas) in Vedic Astrology",
    sanskritTitle: "द्वादश भाव विज्ञान",
    icon: "Layers",
    heroHeadline: "Mastering the 12 Houses (Bhavas) of the Horoscope",
    heroSubheadline: "Explore Tanu Bhava to Vyaya Bhava—how physical body, wealth, siblings, home, children, health, marriage, longevity, dharma, career, gains, and liberation unfold.",
    introductionContent: [
      "The birth chart (Janma Kundli) is divided into 12 equal 30-degree sectors called Bhavas or Houses. Each house corresponds to a specific dimension of human life and represents the stage upon which planetary actors perform their karmic roles.",
      "The 12 Bhavas are categorized into Kendra houses (1st, 4th, 7th, 10th - pillars of life), Trikona houses (1st, 5th, 9th - divine grace and purushartha), Dusthana houses (6th, 8th, 12th - obstacles, transformations, and liberation), and Upachaya houses (3rd, 6th, 10th, 11th - growth over time).",
      "Understanding house lordships, planetary occupations, and planetary aspects (Drishti) allows astrologers to decode life events with remarkable precision—from career peaks in the 10th house to marital bonds in the 7th house and spiritual awakening in the 12th house."
    ],
    subTopics: HOUSES.map((h) => ({
      id: h.key,
      topicKey: h.key,
      title: `${h.number}${h.number === 1 ? "st" : h.number === 2 ? "nd" : h.number === 3 ? "rd" : "th"} House - ${h.name} (${h.sanskrit})`,
      sanskritTitle: h.sanskrit,
      description: h.description,
      badge: `Karaka: ${h.karaka}`
    })),
    tags: ["12 Houses", "Bhavas", "Kendra", "Trikona", "Dusthana", "Lagna Bhava", "7th House Marriage", "10th House Career"],
    relatedCategories: [
      { id: "planets", title: "Planets in Houses" },
      { id: "raj-yogas", title: "House Lord Yogas" }
    ]
  },

  "zodiac-signs": {
    id: "zodiac-signs",
    title: "Zodiac Signs (Rashis) Hub",
    sanskritTitle: "द्वादश राशि मण्डल",
    icon: "Sparkles",
    heroHeadline: "The 12 Sidereal Zodiac Signs (Rashis) of Jyotish",
    heroSubheadline: "In-depth psychological, physical, and karmic traits of Aries to Pisces according to Nirayana Sidereal Zodiac.",
    introductionContent: [
      "In Vedic Astrology, the 360-degree zodiac belt is partitioned into 12 equal 30-degree signs called Rashis. Unlike western astrology which utilizes the tropical zodiac, Jyotish uses the fixed Sidereal Zodiac (Nirayana), taking into account the precession of equinoxes (Ayanamsha).",
      "Each sign possesses a unique combination of element (Fire, Earth, Air, Water), modality (Movable, Fixed, Dual), ruling planet (Rashi Swami), and gender. Understanding your Sun Sign, Moon Sign, and Ascendant (Lagna) sign gives a 360-degree blueprint of your personality, career inclinations, and relationship tendencies."
    ],
    subTopics: SIGNS.map((s) => ({
      id: s.key,
      topicKey: s.key,
      title: `${s.name} (${s.sanskrit})`,
      sanskritTitle: s.sanskrit,
      description: s.description,
      badge: `${s.element} • ${s.ruler}`
    })),
    tags: ["Zodiac Signs", "Rashis", "Mesha", "Vrishabha", "Mithuna", "Karka", "Simha", "Kanya", "Tula", "Vrischika", "Dhanu", "Makara", "Kumbha", "Meena"],
    relatedCategories: [
      { id: "nakshatras", title: "Nakshatras" },
      { id: "daily-horoscope", title: "Daily Horoscope" }
    ]
  },

  nakshatras: {
    id: "nakshatras",
    title: "The 27 Nakshatras (Lunar Mansions)",
    sanskritTitle: "सप्तविंशति नक्षत्र मण्डल",
    icon: "Moon",
    heroHeadline: "The Secret Power of the 27 Vedic Nakshatras",
    heroSubheadline: "Explore birth Nakshatras, ruling deities, planetary lords, 4 Padas, symbolisms, and psychological traits.",
    introductionContent: [
      "The 27 Nakshatras or Lunar Mansions form the heart and soul of predictive Vedic Astrology. Each Nakshatra spans 13 degrees and 20 minutes of the zodiac and is subdivided into four equal 3-degree 20-minute quarters called Padas (matching the Navamsha D9 chart).",
      "Your Janma Nakshatra (the constellation where the Moon was residing at your birth) dictates your birth mental mindset, primary instincts, deity connection, and sets your Vimshottari Mahadasha operating sequence.",
      "From Ashwini governed by the celestial healers (Ashwini Kumaras) to Revati presided over by Pushan, exploring Nakshatra lore provides profound psychological clarity and timing precision."
    ],
    subTopics: NAKSHATRAS.map((n) => ({
      id: n.key,
      topicKey: n.key,
      title: `${n.number}. ${n.name}`,
      description: `${n.description} Ruled by ${n.ruler}, Deity: ${n.deity}.`,
      badge: `Ruled by ${n.ruler}`
    })),
    tags: ["27 Nakshatras", "Ashwini", "Rohini", "Pushya", "Magha", "Chitra", "Swati", "Anuradha", "Revati", "Padas", "Moon Constellations"],
    relatedCategories: [
      { id: "dashas", title: "Vimshottari Dasha" },
      { id: "zodiac-signs", title: "Zodiac Signs" }
    ]
  },

  dashas: {
    id: "dashas",
    title: "Vimshottari Dasha System",
    sanskritTitle: "विंशोत्तरी दशा पद्धति",
    icon: "Hourglass",
    heroHeadline: "Understanding Mahadasha, Antardasha & Planetary Period Timing",
    heroSubheadline: "Unlock the 120-year Vedic karmic clock to predict exact timing of career growth, marriage, wealth, moves, and health changes.",
    introductionContent: [
      "Vimshottari Dasha is the premier predictive tool in Parashari Jyotish. Based on a 120-year cycle, it calculates how planetary energy matures and manifests across different phases of your life.",
      "The major planetary period is called Mahadasha, followed by sub-periods (Antardasha), sub-sub-periods (Pratyantar Dasha), and fine daily cycles (Sookshma Dasha). Understanding your active Dasha lord reveals which house themes and planetary promises are currently activated in your Kundli."
    ],
    subTopics: [
      { id: "mahadasha", title: "Mahadasha Analysis", slug: "mahadasha-analysis", description: "Major 6 to 20 year planetary periods governing life directions." },
      { id: "antardasha", title: "Antardasha Guide", slug: "antardasha-analysis", description: "Sub-periods that trigger specific life events and milestone dates." },
      { id: "pratyantar", title: "Pratyantar Dasha", slug: "pratyantar-dasha-analysis", description: "Micro-periods for pin-pointing month-by-month developments." }
    ],
    tags: ["Vimshottari Dasha", "Mahadasha", "Antardasha", "Shani Mahadasha", "Rahu Mahadasha", "Guru Mahadasha"],
    relatedCategories: [
      { id: "planets", title: "Planets Hub" },
      { id: "planetary-transits", title: "Planetary Transits" }
    ]
  },

  "planetary-transits": {
    id: "planetary-transits",
    title: "Planetary Transits (Gochara)",
    sanskritTitle: "ग्रह गोचर फल",
    icon: "Orbit",
    heroHeadline: "Planetary Ingress, Retrogression & Transit Predictions",
    heroSubheadline: "How current movements of Saturn, Jupiter, Rahu-Ketu, and inner planets impact your Moon sign and birth chart.",
    introductionContent: [
      "While your Janma Kundli shows your fixed birth potential and active Dasha indicates timing, Planetary Transits (Gochara) trigger daily, monthly, and yearly real-time events.",
      "Major transits like Saturn Transit (Shani Gochara), Jupiter Transit (Guru Gochara), and Rahu-Ketu Axis shifts produce major life turning points, career shifts, and spiritual growth."
    ],
    subTopics: [
      { id: "saturn-transit", title: "Saturn Transit (Shani Gochara)", slug: "saturn-transit-2026", description: "Saturn transit through signs, Sade Sati, and Dhaiya impact." },
      { id: "jupiter-transit", title: "Jupiter Transit (Guru Gochara)", slug: "jupiter-transit-guide", description: "Jupiter expansion, divine grace, marriage, and wealth blessings." },
      { id: "rahu-ketu-transit", title: "Rahu-Ketu Transit", slug: "rahu-ketu-transit-analysis", description: "18-month node shift impacts across 12 Moon signs." }
    ],
    tags: ["Transits", "Gochara", "Saturn Transit", "Jupiter Transit", "Rahu Transit", "Retrograde Planets"],
    relatedCategories: [
      { id: "planets", title: "Planets Hub" },
      { id: "daily-astrology", title: "Daily Panchang" }
    ]
  },

  gemstones: {
    id: "gemstones",
    title: "Vedic Gemstones (Ratna Vigyan)",
    sanskritTitle: "नवरत्न विज्ञान",
    icon: "Gem",
    heroHeadline: "Authentic Vedic Gemstones & Navaratna Healing",
    heroSubheadline: "Discover appropriate gemstones for Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn, Rahu, and Ketu.",
    introductionContent: [
      "Gemstone Therapy (Ratna Chikitsa) is one of the most celebrated remedial measures in Vedic Astrology. Precious gemstones act as natural optical filters that harness and amplify specific cosmic ray wavelengths corresponding to the Nine Planets.",
      "Wearing a suitable gemstone strengthens functionally benefic planets in your horoscope, boosting confidence, focus, prosperity, and vitality. Learn the proper metals, fingers, auspicious days, and consecration mantras."
    ],
    subTopics: [
      { id: "blue-sapphire", title: "Blue Sapphire (Neelam)", slug: "blue-sapphire-neelam", description: "Saturn's gemstone for instant success, discipline, and focus." },
      { id: "ruby", title: "Ruby (Manik)", slug: "ruby-manik", description: "Sun's gemstone for leadership, authority, and soul strength." },
      { id: "emerald", title: "Emerald (Panna)", slug: "emerald-panna", description: "Mercury's gemstone for intellect, business acumen, and speech." },
      { id: "yellow-sapphire", title: "Yellow Sapphire (Pukhraj)", slug: "yellow-sapphire-pukhraj", description: "Jupiter's gemstone for wisdom, marriage, wealth, and children." },
      { id: "red-coral", title: "Red Coral (Moonga)", slug: "red-coral-moonga", description: "Mars' gemstone for courage, vitality, and real estate growth." }
    ],
    tags: ["Gemstones", "Ratna", "Neelam", "Pukhraj", "Panna", "Manik", "Moonga", "Navaratna"],
    relatedCategories: [
      { id: "remedies", title: "Vedic Remedies" },
      { id: "mantras", title: "Planetary Mantras" }
    ]
  },

  remedies: {
    id: "remedies",
    title: "Vedic Remedies (Upayas)",
    sanskritTitle: "वैदिक उपाय एवं निवारण",
    icon: "ShieldCheck",
    heroHeadline: "Authentic Vedic Remedies for Planetary Afflictions",
    heroSubheadline: "Scientific remedial measures including Mantras, Daan (Charity), Fasting (Vrat), Rudraksha, and Yantras.",
    introductionContent: [
      "Jyotish is not a fatalistic science; it provides effective remedial measures (Upayas) to mitigate malefic planetary influences and amplify positive karmic fruit.",
      "Classical remedies focus on three primary pillars: Mantra (sound frequencies), Daan (selfless charity to balance elements), and Vrat (spiritual fasting to purify the physical sheath)."
    ],
    subTopics: [
      { id: "mantra-remedies", title: "Mantra Sadhana", slug: "vedic-mantras", description: "Beej mantras and Stotrams for pacifying Grahas." },
      { id: "daan-remedies", title: "Charity & Daan", slug: "planetary-charity-guide", description: "Grains, clothes, and items to donate on planetary days." },
      { id: "rudraksha", title: "Rudraksha Guide", slug: "rudraksha-healing-guide", description: "1 to 14 Mukhi Rudrakshas aligned with Grahas." }
    ],
    tags: ["Remedies", "Upayas", "Beej Mantra", "Charity", "Rudraksha", "Fasting"],
    relatedCategories: [
      { id: "mantras", title: "Mantras Hub" },
      { id: "doshas", title: "Doshas & Remedies" }
    ]
  },

  "career-astrology": {
    id: "career-astrology",
    title: "Career & Profession Astrology",
    sanskritTitle: "आजीविका एवं कर्म विचार",
    icon: "Briefcase",
    heroHeadline: "Decode Your Professional Destiny with Vedic Astrology",
    heroSubheadline: "Explore 10th House (Karma Bhava), D10 Dasamsha chart, Sun, Saturn, and Mercury influences on job vs business.",
    introductionContent: [
      "Career astrology evaluates the 10th house of executive authority, 2nd house of earnings, 6th house of service, 11th house of gains, and the D10 Dasamsha divisional chart.",
      "Whether you are targeting government jobs, corporate leadership, tech entrepreneurship, creative arts, or foreign employment, Jyotish pinpoints your innate talents and career promotion cycles."
    ],
    subTopics: [
      { id: "govt-jobs", title: "Government Job Yogas", slug: "government-job-astrology", description: "Sun, Mars, and 10th lord combinations for administrative services." },
      { id: "business", title: "Business & Entrepreneurship", slug: "business-success-astrology", description: "7th and 11th house Yogas for high-yield business ventures." },
      { id: "promotions", title: "Promotions & Job Changes", slug: "career-promotion-timing", description: "Dasha timing for raises, job changes, and accolades." }
    ],
    tags: ["Career", "10th House", "Dasamsha D10", "Govt Jobs", "Business", "Promotions"],
    relatedCategories: [
      { id: "finance-astrology", title: "Finance Astrology" },
      { id: "houses", title: "10th House Analysis" }
    ]
  },

  "marriage-astrology": {
    id: "marriage-astrology",
    title: "Marriage & Relationship Astrology",
    sanskritTitle: "विवाह एवं दाम्पत्य विचार",
    icon: "Heart",
    heroHeadline: "Vedic Marriage Compatibility, Kundli Matching & Relationship Timing",
    heroSubheadline: "Explore 7th house, Venus, Jupiter, Ashtakoota Guna Milan, Manglik Dosha, and Navamsha D9 insights.",
    introductionContent: [
      "Marriage is considered a sacred samskara in Vedic culture. Astrology examines marital harmony through the 7th house (Kalatra Bhava), Venus (for men), Jupiter (for women), and the D9 Navamsha chart.",
      "Discover Ashtakoota 36-point Guna Milan matching, remedies for delay in marriage, Manglik Dosha analysis, and love marriage vs arranged marriage yogas."
    ],
    subTopics: [
      { id: "guna-milan", title: "Ashtakoota Guna Milan", slug: "ashtakoota-kundli-matching", description: "36-point compatibility scoring system." },
      { id: "manglik-dosha", title: "Manglik Dosha & Cancellation", slug: "manglik-dosha-remedies", description: "Mars in 1st, 4th, 7th, 8th, 12th house effects." },
      { id: "marriage-timing", title: "Timing of Marriage", slug: "marriage-timing-astrology", description: "Predicting exact age and Dasha windows for marriage." }
    ],
    tags: ["Marriage", "7th House", "Kundli Matching", "Manglik Dosha", "Love Marriage", "Navamsha D9"],
    relatedCategories: [
      { id: "zodiac-signs", title: "Compatibility by Sign" },
      { id: "houses", title: "7th House Analysis" }
    ]
  },

  "finance-astrology": {
    id: "finance-astrology",
    title: "Finance & Wealth Astrology",
    sanskritTitle: "धन एवं समृद्धि विचार",
    icon: "Coins",
    heroHeadline: "Dhan Yogas, Wealth Potential & Financial Intelligence",
    heroSubheadline: "Examine 2nd House of accumulated wealth, 11th House of gains, 5th House of investments, and Laxmi Yogas.",
    introductionContent: [
      "Financial prosperity in Jyotish is evaluated through Dhan Yogas formed between the lords of the 1st, 2nd, 5th, 9th, and 11th houses.",
      "Learn about wealth accumulation timing, stock market investment Yogas, real estate gains, and methods to clear debt during tough Dashas."
    ],
    subTopics: [
      { id: "dhan-yogas", title: "Dhan Yogas in Kundli", slug: "wealth-and-dhan-yogas", description: "Powerful planetary combinations generating immense riches." },
      { id: "stock-market", title: "Stock Market & Investments", slug: "stock-market-astrology", description: "5th house, Mercury, and Rahu influences on speculative gains." },
      { id: "debts-loans", title: "Debts & Financial Recovery", slug: "clearing-debts-astrology", description: "6th house malefic influences and remedies for financial freedom." }
    ],
    tags: ["Finance", "Dhan Yogas", "2nd House", "11th House", "Wealth", "Stock Market"],
    relatedCategories: [
      { id: "career-astrology", title: "Career Astrology" },
      { id: "raj-yogas", title: "Raj Yogas" }
    ]
  },

  "astrology-learning": {
    id: "astrology-learning",
    title: "Astrology Learning Hub (Jyotish Vidya)",
    sanskritTitle: "ज्योतिष शिक्षा एवं शोध",
    icon: "BookOpen",
    heroHeadline: "Learn Authentic Parashari Vedic Astrology from First Principles",
    heroSubheadline: "Comprehensive tutorials from beginner basics (Rashis, Bhavas, Grahas) to advanced techniques (Ashtakavarga, Vargas, Jaimini).",
    introductionContent: [
      "Welcome to the Vedanga Astrology Learning Hub—a structured educational resource designed for enthusiasts, students, and practicing astrologers.",
      "Explore foundational principles from Maharishi Parashara's Brihat Parashara Hora Shastra, Varahamihira's Brihat Jataka, and Kalyana Varma's Saravali."
    ],
    subTopics: [
      { id: "beginner-astrology", title: "Beginner Jyotish Guide", slug: "astrology-learning-guide", description: "Basics of birth charts, planets, signs, and house meanings." },
      { id: "ashtakavarga", title: "Ashtakavarga System", slug: "ashtakavarga-guide", description: "Quantitative point system for transits and house strength." },
      { id: "divisional-charts", title: "Divisional Charts (Vargas)", slug: "divisional-charts-vargas", description: "D9 Navamsha, D10 Dasamsha, D7 Saptamsha, D12 Dwadasamsha." }
    ],
    tags: ["Jyotish Learning", "Parashari", "Ashtakavarga", "Divisional Charts", "Vargas", "Jaimini"],
    relatedCategories: [
      { id: "astrology-encyclopedia", title: "Astrology Encyclopedia" },
      { id: "astrology-faqs", title: "Astrology FAQs" }
    ]
  }
};

// Add fallback generic Category Hub generator for any remaining categories
export function getCategoryHubInfo(categoryId: string): CategoryHubInfo {
  const normKey = categoryId.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-");
  if (CATEGORY_HUBS[normKey]) {
    return CATEGORY_HUBS[normKey];
  }

  // Generate dynamic category hub for any arbitrary category name
  const formattedTitle = categoryId
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  return {
    id: normKey,
    title: `${formattedTitle} Hub`,
    sanskritTitle: "ज्योतिष विषय",
    icon: "BookOpen",
    heroHeadline: `Comprehensive ${formattedTitle} in Vedic Astrology`,
    heroSubheadline: `In-depth classical analysis, planetary yogas, remedies, and research articles regarding ${formattedTitle}.`,
    introductionContent: [
      `${formattedTitle} represents an important facet of Vedic Astrology (Jyotish Shastra). In classical texts, planetary positions across the 12 houses and 12 signs dictate how ${formattedTitle} unfolds in human destiny.`,
      `By analyzing your birth chart (Janma Kundli) alongside active Vimshottari Dasha periods and current planetary transits (Gochara), you can understand your unique karmic timing and potential for ${formattedTitle}.`,
      `Explore our featured research articles, topic guides, and practical Vedic remedies below to deepen your understanding of ${formattedTitle}.`
    ],
    subTopics: [
      { id: `${normKey}-overview`, title: `${formattedTitle} Overview`, slug: `${normKey}-guide`, description: `Fundamental principles and classical concepts of ${formattedTitle}.` },
      { id: `${normKey}-remedies`, title: `${formattedTitle} Remedies`, slug: `${normKey}-remedies`, description: `Effective Vedic remedies, mantras, and gemstones for ${formattedTitle}.` },
      { id: `${normKey}-yogas`, title: `${formattedTitle} Yogas & Combinations`, slug: `${normKey}-yogas`, description: `Key planetary combinations and yogas governing ${formattedTitle}.` }
    ],
    tags: [formattedTitle, "Vedic Astrology", "Jyotish", "Kundli", "Planets", "Houses"],
    relatedCategories: [
      { id: "planets", title: "Planets Hub" },
      { id: "houses", title: "Houses Hub" },
      { id: "daily-astrology", title: "Daily Astrology" }
    ]
  };
}

// --------------------------------------------------------------------------
// SUB-TOPIC HUB GENERATOR (e.g. Planets -> Saturn Hub, Houses -> 1st House Hub)
// --------------------------------------------------------------------------

export function getSubTopicHubInfo(categoryId: string, topicKey: string): SubTopicHubInfo {
  const cKey = categoryId.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-");
  const tKey = topicKey.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-");

  // Check if topic matches a Planet
  const planet = PLANETS.find((p) => p.key === tKey || p.name.toLowerCase() === tKey);
  if (planet) {
    return {
      id: planet.key,
      categoryId: "planets",
      categoryTitle: "Planets Hub",
      title: `${planet.name} (${planet.sanskrit}) Hub`,
      sanskritTitle: planet.sanskrit,
      heroHeadline: `${planet.name} (${planet.sanskrit}) in Vedic Astrology`,
      heroSubheadline: `${planet.description} Comprehensive analysis of ${planet.name} in Houses, Signs, Dashas, Transits, Career, Marriage, Remedies & Mantras.`,
      introductionContent: [
        `In classical Jyotish Shastra, ${planet.name} (${planet.sanskrit}) is a pivotal Graha governing essential human experiences. ${planet.description}`,
        `${planet.name} governs key attributes (${planet.qualities.join(", ")}) with elemental nature (${planet.element}) and presiding deity ${planet.deity}. Gemstone: ${planet.gemstone}. Mantra: ${planet.mantra}.`,
        `During active ${planet.name} Vimshottari Mahadasha or Antardasha periods, its energy manifests through your house placements, triggering key opportunities, psychological lessons, and physical health developments.`,
        `Explore all dimensions of ${planet.name} below—including its placement in the 12 Houses, placement in 12 Zodiac Signs, Mahadasha results, Gochara transits, Gemstone recommendations (${planet.gemstone}), and sacred Beej Mantras.`
      ],
      subTopics: [
        { id: `${planet.key}-in-houses`, title: `${planet.name} in Houses`, slug: `${planet.key}-in-3rd-house`, description: `${planet.name} effects across all 12 houses (1st to 12th Bhava).` },
        { id: `${planet.key}-in-signs`, title: `${planet.name} in Signs`, slug: `${planet.key}-in-capricorn`, description: `${planet.name} placement across Aries to Pisces.` },
        { id: `${planet.key}-mahadasha`, title: `${planet.name} Mahadasha`, slug: `${planet.key}-mahadasha`, description: `Complete Vimshottari Mahadasha analysis and sub-periods.` },
        { id: `${planet.key}-antardasha`, title: `${planet.name} Antardasha`, slug: `${planet.key}-antardasha`, description: `${planet.name} sub-period results under different Mahadashas.` },
        { id: `${planet.key}-transit`, title: `${planet.name} Transit (Gochara)`, slug: `${planet.key}-transit-2026`, description: `Real-time transits, sign shifts, and retrogression cycles.` },
        { id: `${planet.key}-remedies`, title: `${planet.name} Remedies`, slug: `${planet.key}-remedies`, description: `Vedic remedies, charity items, and fasting rituals for ${planet.name}.` },
        { id: `${planet.key}-career`, title: `${planet.name} Career Impact`, slug: `${planet.key}-career-influence`, description: `Influence of ${planet.name} on profession, business, and status.` },
        { id: `${planet.key}-marriage`, title: `${planet.name} & Relationships`, slug: `${planet.key}-7th-house-marriage`, description: `Impact of ${planet.name} on marital bliss and partnerships.` },
        { id: `${planet.key}-health`, title: `${planet.name} Health & Longevity`, slug: `${planet.key}-health-and-longevity`, description: `Medical astrology insights associated with ${planet.name}.` },
        { id: `${planet.key}-finance`, title: `${planet.name} Wealth & Debts`, slug: `${planet.key}-wealth-and-debts`, description: `Financial effects, asset accumulation, and debt indicators.` },
        { id: `${planet.key}-mantra`, title: `${planet.name} Beej Mantra`, slug: `${planet.key}-beej-mantra`, description: `Sacred sound frequency and japa instructions for ${planet.name}.` },
        { id: `${planet.key}-gemstone`, title: `${planet.name} Gemstone (${planet.gemstone})`, slug: `${planet.key}-gemstone-guide`, description: `How to wear ${planet.gemstone}, metal selection, and rituals.` }
      ],
      tags: [planet.name, planet.sanskrit, planet.gemstone, "Mahadasha", "Gochara", "Remedies", "Vedic Astrology"],
      relatedCategories: [
        { id: "planets", title: "All Planets", categoryId: "planets", topicKey: "" },
        { id: "dashas", title: "Dashas Hub", categoryId: "dashas", topicKey: "" },
        { id: "gemstones", title: "Gemstones Hub", categoryId: "gemstones", topicKey: "" }
      ]
    };
  }

  // Check if topic matches a House
  const house = HOUSES.find((h) => h.key === tKey || h.name.toLowerCase().includes(tKey));
  if (house) {
    return {
      id: house.key,
      categoryId: "houses",
      categoryTitle: "Houses Hub",
      title: `${house.number}${house.number === 1 ? "st" : house.number === 2 ? "nd" : house.number === 3 ? "rd" : "th"} House (${house.sanskrit}) Hub`,
      sanskritTitle: house.sanskrit,
      heroHeadline: `The ${house.number}${house.number === 1 ? "st" : house.number === 2 ? "nd" : house.number === 3 ? "rd" : "th"} House (${house.sanskrit}) in Jyotish`,
      heroSubheadline: `${house.description} Governance: ${house.governance.join(", ")}. Primary significator (Karaka): ${house.karaka}.`,
      introductionContent: [
        `In Vedic Astrology, the ${house.number}${house.number === 1 ? "st" : house.number === 2 ? "nd" : house.number === 3 ? "rd" : "th"} House, known as ${house.sanskrit} (${house.name}), represents crucial aspects of human destiny. ${house.description}`,
        `This house is naturally signified by Karaka planet ${house.karaka}. Key life areas governed include: ${house.governance.join(", ")}.`,
        `When benefics like Jupiter or Venus reside in or aspect the ${house.number}${house.number === 1 ? "st" : house.number === 2 ? "nd" : house.number === 3 ? "rd" : "th"} house, it brings smooth manifestation and prosperity. Conversely, malefic afflictions require targeted Vedic remedies.`
      ],
      subTopics: [
        { id: `${house.key}-overview`, title: `${house.name} Overview`, slug: house.key, description: `Comprehensive guide to ${house.name} (${house.sanskrit}).` },
        { id: `${house.key}-planets`, title: `Planets in ${house.name}`, slug: `saturn-in-3rd-house`, description: `How Sun, Moon, Mars, Jupiter, Saturn affect this house.` },
        { id: `${house.key}-lord`, title: `${house.name} Lord Placements`, slug: `${house.key}-lord-in-12-houses`, description: `Results when ${house.sanskrit} lord occupies other houses.` },
        { id: `${house.key}-remedies`, title: `${house.name} Remedies`, slug: `${house.key}-remedies-guide`, description: `Effective Vedic remedies for strengthening this house.` }
      ],
      tags: [house.name, house.sanskrit, "12 Houses", "Bhavas", "Karaka", house.karaka],
      relatedCategories: [
        { id: "houses", title: "All 12 Houses", categoryId: "houses", topicKey: "" },
        { id: "planets", title: "Planets Hub", categoryId: "planets", topicKey: "" }
      ]
    };
  }

  // Fallback sub-topic hub generator
  const formattedTitle = tKey
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  return {
    id: tKey,
    categoryId: cKey,
    categoryTitle: `${cKey.charAt(0).toUpperCase() + cKey.slice(1)} Hub`,
    title: `${formattedTitle} Topic Hub`,
    sanskritTitle: "विषय मण्डल",
    heroHeadline: `${formattedTitle} in Vedic Astrology`,
    heroSubheadline: `Deep dive into ${formattedTitle} concepts, planetary influences, yogas, transits, and remedies.`,
    introductionContent: [
      `${formattedTitle} is a core subject within the ${cKey} domain of Vedic Astrology. In classical Jyotish, detailed evaluation of planetary longitudes and house lordships illuminates ${formattedTitle}.`,
      `Explore our comprehensive topic guides, sub-category cards, and featured articles below regarding ${formattedTitle}.`
    ],
    subTopics: [
      { id: `${tKey}-guide`, title: `${formattedTitle} Comprehensive Guide`, slug: `${tKey}`, description: `In-depth overview and classical principles of ${formattedTitle}.` },
      { id: `${tKey}-remedies`, title: `${formattedTitle} Remedies & Mantras`, slug: `${tKey}-remedies`, description: `Effective Vedic remedies for ${formattedTitle}.` },
      { id: `${tKey}-yogas`, title: `${formattedTitle} Yogas & Insights`, slug: `${tKey}-yogas`, description: `Planetary combinations and timing for ${formattedTitle}.` }
    ],
    tags: [formattedTitle, cKey, "Vedic Astrology", "Jyotish", "Kundli"],
    relatedCategories: [
      { id: cKey, title: `${cKey.charAt(0).toUpperCase() + cKey.slice(1)} Hub`, categoryId: cKey, topicKey: "" }
    ]
  };
}

// --------------------------------------------------------------------------
// ARTICLE LISTINGS GENERATOR FOR CATEGORIES & TOPICS
// --------------------------------------------------------------------------

export function getArticlesForCategory(categoryId: string, topicKey?: string): ArticleCard[] {
  const normCategory = categoryId.toLowerCase();
  const normTopic = topicKey ? topicKey.toLowerCase() : "";

  // Dynamic pool of curated articles matching category and subtopic
  const baseArticles: ArticleCard[] = [
    {
      title: "Saturn in 3rd House: Courage, Siblings & Career Momentum",
      slug: "saturn-in-3rd-house",
      category: "Planets",
      snippet: "Comprehensive classical analysis of Shani Dev in Sahaja Bhava. Discover impacts on willpower, communication style, and younger siblings.",
      readTime: "9 min read",
      date: "2026-08-01",
      views: 14200,
      featured: true,
      trending: true,
      tags: ["Saturn", "3rd House", "Shani", "Karmic Astrology"]
    },
    {
      title: "Venus in Pisces: Exalted Love, Creative Genius & Wealth",
      slug: "venus-in-pisces",
      category: "Planets",
      snippet: "Exalted Shukra in Meena Rashi brings unshakeable devotion, artistic mastery, spiritual romanticism, and financial luxury.",
      readTime: "8 min read",
      date: "2026-07-29",
      views: 11800,
      featured: true,
      trending: true,
      tags: ["Venus", "Pisces", "Exalted Planet", "Love Astrology"]
    },
    {
      title: "Today's Panchang & Vedic Celestial Calendar",
      slug: "daily-panchang",
      category: "Daily Astrology",
      snippet: "Complete 5-limb almanac featuring Tithi, Vara, Nakshatra, Yoga, Karana, Rahu Kaal, and Abhijit Muhurat.",
      readTime: "5 min read",
      date: "2026-08-02",
      views: 28500,
      featured: true,
      trending: true,
      tags: ["Daily Panchang", "Tithi", "Nakshatra", "Rahu Kaal"]
    },
    {
      title: "Saturn Mahadasha: 19-Year Karmic Journey & Remedies",
      slug: "saturn-mahadasha",
      category: "Dashas",
      snippet: "A complete survival and prosperity guide to navigating Saturn Vimshottari Mahadasha, Antardashas, and Shani Stotram.",
      readTime: "12 min read",
      date: "2026-07-25",
      views: 19400,
      featured: false,
      trending: true,
      tags: ["Saturn", "Mahadasha", "Dashas", "Remedies"]
    },
    {
      title: "1st House (Lagna): Physical Personality, Health & Soul Direction",
      slug: "1st-house-tanu-bhava",
      category: "Houses",
      snippet: "Tanu Bhava controls your physical vitality, head, immune resilience, and overall life purpose.",
      readTime: "10 min read",
      date: "2026-07-20",
      views: 9300,
      featured: false,
      trending: false,
      tags: ["1st House", "Lagna", "Health", "Personality"]
    },
    {
      title: "Ashwini Nakshatra: Ketu Ruled Celestial Healers",
      slug: "ashwini-nakshatra",
      category: "Nakshatras",
      snippet: "First Nakshatra of the zodiac; symbol of speed, medical remedies, initiative, and swift transformation.",
      readTime: "7 min read",
      date: "2026-07-18",
      views: 8700,
      featured: false,
      trending: false,
      tags: ["Ashwini", "Nakshatras", "Ketu", "Aries"]
    },
    {
      title: "Blue Sapphire (Neelam): Consecration Rituals & Benefits",
      slug: "blue-sapphire-neelam",
      category: "Gemstones",
      snippet: "How to wear Blue Sapphire safely, test for energetic compatibility, and harness Saturn's focal power.",
      readTime: "11 min read",
      date: "2026-07-15",
      views: 15600,
      featured: true,
      trending: false,
      tags: ["Blue Sapphire", "Neelam", "Gemstones", "Saturn"]
    },
    {
      title: "Ashtakoota Kundli Matching: 36 Points Marriage Compatibility",
      slug: "ashtakoota-kundli-matching",
      category: "Marriage Astrology",
      snippet: "Detailed breakdown of Nadi, Bhakoot, Gana, Maitri, Yoni, Tara, Vasya, and Varna points for marital bliss.",
      readTime: "14 min read",
      date: "2026-07-12",
      views: 22100,
      featured: true,
      trending: true,
      tags: ["Marriage", "Kundli Matching", "Guna Milan", "7th House"]
    },
    {
      title: "Government Job Yogas: Sun, Mars & 10th House Alchemy",
      slug: "government-job-astrology",
      category: "Career Astrology",
      snippet: "Identify key planetary Yogas for IAS, IPS, judicial, civil service, and public sector administrative career success.",
      readTime: "10 min read",
      date: "2026-07-10",
      views: 16700,
      featured: false,
      trending: true,
      tags: ["Govt Jobs", "Career", "10th House", "Sun"]
    },
    {
      title: "Dhan Yogas in Kundli: Unlocking Immense Wealth Potential",
      slug: "wealth-and-dhan-yogas",
      category: "Finance Astrology",
      snippet: "Classical Parashari Dhan Yogas formed between 1st, 2nd, 5th, 9th, and 11th house lords for financial freedom.",
      readTime: "11 min read",
      date: "2026-07-08",
      views: 18300,
      featured: true,
      trending: false,
      tags: ["Wealth", "Dhan Yogas", "2nd House", "11th House"]
    }
  ];

  // Synthesize extra topic-specific articles if needed
  if (normTopic) {
    const topicFormatted = normTopic.charAt(0).toUpperCase() + normTopic.slice(1);
    return [
      {
        title: `${topicFormatted} in Houses: Complete 1st to 12th Bhava Analysis`,
        slug: `${normTopic}-in-houses-guide`,
        category: categoryId,
        snippet: `In-depth breakdown of how ${topicFormatted} functions across all 12 astrological houses in your birth chart.`,
        readTime: "10 min read",
        date: "2026-08-01",
        views: 12400,
        featured: true,
        trending: true,
        tags: [topicFormatted, "Houses", "Bhava Analysis", "Vedic Astrology"]
      },
      {
        title: `${topicFormatted} Mahadasha & Antardasha Period Timing`,
        slug: `${normTopic}-mahadasha-guide`,
        category: categoryId,
        snippet: `Vimshottari Dasha timeline, career growth, financial milestones, and health caution years during ${topicFormatted} periods.`,
        readTime: "12 min read",
        date: "2026-07-28",
        views: 9800,
        featured: true,
        trending: false,
        tags: [topicFormatted, "Mahadasha", "Vimshottari", "Timing"]
      },
      {
        title: `Vedic Remedies, Beej Mantras & Fasting for ${topicFormatted}`,
        slug: `${normTopic}-remedies-and-mantras`,
        category: categoryId,
        snippet: `Classical remedies, Beej Mantra japas, gemstones, and charity items to balance ${topicFormatted} energies.`,
        readTime: "8 min read",
        date: "2026-07-24",
        views: 8900,
        featured: false,
        trending: true,
        tags: [topicFormatted, "Remedies", "Mantras", "Upayas"]
      },
      {
        title: `${topicFormatted} Influence on Career, Status & Financial Wealth`,
        slug: `${normTopic}-career-and-finance`,
        category: categoryId,
        snippet: `How ${topicFormatted} impacts your 10th house of career, 2nd house of wealth, and 11th house of gains.`,
        readTime: "9 min read",
        date: "2026-07-21",
        views: 7600,
        featured: false,
        trending: false,
        tags: [topicFormatted, "Career", "Finance", "10th House"]
      },
      {
        title: `${topicFormatted} Impact on Marriage, Relationships & 7th House`,
        slug: `${normTopic}-marriage-and-relationships`,
        category: categoryId,
        snippet: `Evaluating ${topicFormatted} influence on marital bliss, spouse characteristics, and partnership harmony.`,
        readTime: "9 min read",
        date: "2026-07-18",
        views: 6500,
        featured: false,
        trending: false,
        tags: [topicFormatted, "Marriage", "7th House", "Navamsha D9"]
      },
      ...baseArticles
    ];
  }

  // Filter base articles by category or return all
  const filtered = baseArticles.filter((a) =>
    a.category.toLowerCase().includes(normCategory) || normCategory.includes(a.category.toLowerCase())
  );

  return filtered.length > 0 ? filtered : baseArticles;
}
