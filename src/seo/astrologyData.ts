// Comprehensive Vedic Astrology Knowledge Base for Parashari Analysis

export interface PlanetInfo {
  name: string;
  sanskrit: string;
  key: string;
  element: string;
  day: string;
  gemstone: string;
  mantra: string;
  deity: string;
  qualities: string[];
  description: string;
}

export interface HouseInfo {
  number: number;
  name: string;
  sanskrit: string;
  key: string;
  karaka: string;
  governance: string[];
  description: string;
}

export interface SignInfo {
  number: number;
  name: string;
  sanskrit: string;
  key: string;
  element: string;
  ruler: string;
  symbol: string;
  description: string;
}

export interface NakshatraInfo {
  number: number;
  name: string;
  key: string;
  ruler: string;
  deity: string;
  symbol: string;
  guna: string;
  description: string;
}

export const PLANETS: PlanetInfo[] = [
  {
    name: "Sun",
    sanskrit: "Surya",
    key: "sun",
    element: "Fire (Agni)",
    day: "Sunday",
    gemstone: "Ruby (Manikya)",
    mantra: "Om Hram Hrim Hroom Sah Suryaya Namah",
    deity: "Lord Shiva / Agni",
    qualities: ["Soul (Atman)", "Father", "Authority", "Ego", "Vitality", "Leadership"],
    description: "In Vedic Astrology (Jyotish), the Sun represents the Atman (soul), willpower, royal authority, vitality, and paternal blessings. It governs the 5th sign Leo and rules Simha Rashi."
  },
  {
    name: "Moon",
    sanskrit: "Chandra",
    key: "moon",
    element: "Water (Jala)",
    day: "Monday",
    gemstone: "Pearl (Moti)",
    mantra: "Om Shram Shrim Shrom Sah Chandraya Namah",
    deity: "Goddess Gauri / Lord Shiva",
    qualities: ["Mind (Manas)", "Mother", "Emotions", "Intuition", "Peace", "Nourishment"],
    description: "The Moon rules the mind (Manas), emotional stability, maternal instincts, and memory. It governs Cancer (Karka) and is the core anchor of Chandra Kundli."
  },
  {
    name: "Mars",
    sanskrit: "Mangal",
    key: "mars",
    element: "Fire (Agni)",
    day: "Tuesday",
    gemstone: "Red Coral (Moonga)",
    mantra: "Om Kram Krim Krom Sah Bhaumaya Namah",
    deity: "Lord Kartikeya / Hanuman",
    qualities: ["Courage", "Brothers", "Energy", "Property", "Ambition", "Action"],
    description: "Mars signifies physical strength, courage, property, younger siblings, and executive drive. It rules Aries (Mesha) and Scorpio (Vrishchika)."
  },
  {
    name: "Mercury",
    sanskrit: "Budh",
    key: "mercury",
    element: "Earth (Prithvi)",
    day: "Wednesday",
    gemstone: "Emerald (Panna)",
    mantra: "Om Bram Brim Brom Sah Budhaya Namah",
    deity: "Lord Vishnu",
    qualities: ["Intellect (Buddhi)", "Speech", "Commerce", "Logic", "Analytical Skill"],
    description: "Mercury governs intellect, analytical reasoning, communication, business acumen, and nervous system health. It rules Gemini (Mithuna) and Virgo (Kanya)."
  },
  {
    name: "Jupiter",
    sanskrit: "Guru",
    key: "jupiter",
    element: "Ether (Akasha)",
    day: "Thursday",
    gemstone: "Yellow Sapphire (Pukhraj)",
    mantra: "Om Gram Grim Grom Sah Gurave Namah",
    deity: "Lord Dakshinamurthy / Brihaspati",
    qualities: ["Wisdom (Jnana)", "Dharma", "Wealth", "Children", "Higher Learning"],
    description: "Jupiter is the supreme benefic planet representing divine grace, higher wisdom, spiritual dharma, wealth, and children. It rules Sagittarius (Dhanu) and Pisces (Meena)."
  },
  {
    name: "Venus",
    sanskrit: "Shukra",
    key: "venus",
    element: "Water (Jala)",
    day: "Friday",
    gemstone: "Diamond / White Sapphire (Hira)",
    mantra: "Om Dram Drim Drom Sah Shukraya Namah",
    deity: "Goddess Lakshmi",
    qualities: ["Love", "Marriage", "Luxury", "Arts", "Refinement", "Sensual Joy"],
    description: "Venus rules love, marital harmony, aesthetic refinement, financial prosperity, and artistic creation. It rules Taurus (Vrishabha) and Libra (Tula)."
  },
  {
    name: "Saturn",
    sanskrit: "Shani",
    key: "saturn",
    element: "Air (Vayu)",
    day: "Saturday",
    gemstone: "Blue Sapphire (Neelam)",
    mantra: "Om Sham Shanaiscarayai Namah",
    deity: "Lord Hanuman / Lord Shiva",
    qualities: ["Karma", "Discipline", "Longevity", "Hard Work", "Patience", "Perseverance"],
    description: "Saturn is the cosmic taskmaster enforcing karmic retribution, discipline, endurance, longevity, and spiritual humility. It rules Capricorn (Makara) and Aquarius (Kumbha)."
  },
  {
    name: "Rahu",
    sanskrit: "North Node",
    key: "rahu",
    element: "Air (Vayu / Shadow)",
    day: "Saturday",
    gemstone: "Hessonite (Gomed)",
    mantra: "Om Bhram Bhrim Bhrom Sah Rahave Namah",
    deity: "Goddess Durga",
    qualities: ["Ambition", "Illusion (Maya)", "Innovation", "Foreign Lands", "Material Drive"],
    description: "Rahu is the shadow planet (Chhaya Graha) representing worldly desires, rapid technological innovation, foreign travels, and unconventional breakthroughs."
  },
  {
    name: "Ketu",
    sanskrit: "South Node",
    key: "ketu",
    element: "Fire (Agni / Shadow)",
    day: "Tuesday",
    gemstone: "Cat's Eye (Lehsuniya)",
    mantra: "Om Stram Strim Strom Sah Ketave Namah",
    deity: "Lord Ganesha",
    qualities: ["Moksha", "Detachment", "Spiritual Intuition", "Research", "Past Life Karma"],
    description: "Ketu signifies spiritual enlightenment (Moksha), deep esoteric intuition, detachment from worldly illusions, and liberation from karmic cycles."
  }
];

export const HOUSES: HouseInfo[] = [
  {
    number: 1,
    name: "1st House (Lagna / Tanu Bhava)",
    sanskrit: "Tanu Bhava",
    key: "1st-house",
    karaka: "Sun",
    governance: ["Self", "Physical Body", "Personality", "Overall Health", "Life Direction"],
    description: "The 1st House or Lagna governs self-identity, physical constitution, vitality, character, and primary life momentum."
  },
  {
    number: 2,
    name: "2nd House (Dhana Bhava)",
    sanskrit: "Dhana Bhava",
    key: "2nd-house",
    karaka: "Jupiter / Mercury",
    governance: ["Accumulated Wealth", "Family", "Speech", "Food Habits", "Face & Eyes"],
    description: "The 2nd House rules accumulated wealth, bank savings, family lineage, vocal tone, and dietary preferences."
  },
  {
    number: 3,
    name: "3rd House (Sahaja Bhava)",
    sanskrit: "Sahaja Bhava",
    key: "3rd-house",
    karaka: "Mars",
    governance: ["Courage", "Younger Siblings", "Short Travels", "Communication", "Hands"],
    description: "The 3rd House governs self-effort, courage, willpower, younger siblings, media skills, and short journeys."
  },
  {
    number: 4,
    name: "4th House (Sukha Bhava)",
    sanskrit: "Sukha Bhava",
    key: "4th-house",
    karaka: "Moon",
    governance: ["Mother", "Home", "Real Estate", "Inner Peace", "Vehicles", "Education"],
    description: "The 4th House rules domestic happiness, maternal blessings, real estate property, vehicles, and heart-felt contentment."
  },
  {
    number: 5,
    name: "5th House (Putra / Dharma Bhava)",
    sanskrit: "Putra Bhava",
    key: "5th-house",
    karaka: "Jupiter",
    governance: ["Children", "Speculation", "Intellect", "Past Life Merits (Purva Punya)", "Mantras"],
    description: "The 5th House governs progeny, creative intelligence, speculative investments, mantra japa, and past-life karma."
  },
  {
    number: 6,
    name: "6th House (Shatru / Roga Bhava)",
    sanskrit: "Shatru Bhava",
    key: "6th-house",
    karaka: "Mars / Saturn",
    governance: ["Enemies", "Diseases", "Debts", "Daily Service", "Litigation", "Obstacles"],
    description: "The 6th House rules daily work routine, overcoming competitors, healing illnesses, debts, and competitive strength."
  },
  {
    number: 7,
    name: "7th House (Yuvati / Kalatra Bhava)",
    sanskrit: "Yuvati Bhava",
    key: "7th-house",
    karaka: "Venus",
    governance: ["Spouse", "Marriage", "Business Partnerships", "Foreign Relations", "Public Interaction"],
    description: "The 7th House governs marital union, spouse characteristics, long-term business partnerships, and public image."
  },
  {
    number: 8,
    name: "8th House (Randhra Bhava)",
    sanskrit: "Randhra Bhava",
    key: "8th-house",
    karaka: "Saturn",
    governance: ["Longevity", "Transformation", "Hidden Secrets", "Inheritance", "Occult Wisdom"],
    description: "The 8th House governs longevity, sudden transformative shifts, unearned inheritance, esoteric sciences, and research."
  },
  {
    number: 9,
    name: "9th House (Dharma / Bhagya Bhava)",
    sanskrit: "Bhagya Bhava",
    key: "9th-house",
    karaka: "Jupiter / Sun",
    governance: ["Luck (Bhagya)", "Father", "Guru", "Higher Learning", "Pilgrimage", "Morality"],
    description: "The 9th House is the highest trine (Trikona) signifying divine luck, spiritual guidance from Gurus, pilgrimage, and morality."
  },
  {
    number: 10,
    name: "10th House (Karma Bhava)",
    sanskrit: "Karma Bhava",
    key: "10th-house",
    karaka: "Sun / Mercury / Jupiter / Saturn",
    governance: ["Career", "Profession", "Public Status", "Reputation", "Authority", "Actions"],
    description: "The 10th House governs career achievements, professional reputation, societal contribution, government favors, and leadership."
  },
  {
    number: 11,
    name: "11th House (Labha Bhava)",
    sanskrit: "Labha Bhava",
    key: "11th-house",
    karaka: "Jupiter",
    governance: ["Financial Gains", "Elder Siblings", "Social Networks", "Fulfillment of Desires"],
    description: "The 11th House rules monetary income, liquid cash flow, elder siblings, professional networking, and dream fulfillment."
  },
  {
    number: 12,
    name: "12th House (Vyaya / Moksha Bhava)",
    sanskrit: "Vyaya Bhava",
    key: "12th-house",
    karaka: "Saturn / Ketu",
    governance: ["Moksha", "Expenditures", "Foreign Settlement", "Isolation", "Bed Pleasures", "Subconscious"],
    description: "The 12th House governs spiritual liberation (Moksha), foreign relocation, meditation, subconscious dreams, and expenditures."
  }
];

export const SIGNS: SignInfo[] = [
  { number: 1, name: "Aries", sanskrit: "Mesha", key: "aries", element: "Fire", ruler: "Mars", symbol: "Ram", description: "Dynamic, pioneering, courageous, passionate, and energetic first sign of the zodiac." },
  { number: 2, name: "Taurus", sanskrit: "Vrishabha", key: "taurus", element: "Earth", ruler: "Venus", symbol: "Bull", description: "Grounded, steadfast, sensual, security-seeking, and prosperous fixed earth sign." },
  { number: 3, name: "Gemini", sanskrit: "Mithuna", key: "gemini", element: "Air", ruler: "Mercury", symbol: "Twins", description: "Intellectual, communicative, versatile, adaptable, and witty dual air sign." },
  { number: 4, name: "Cancer", sanskrit: "Karka", key: "cancer", element: "Water", ruler: "Moon", symbol: "Crab", description: "Nurturing, intuitive, deeply feeling, protective, and family-oriented cardinal water sign." },
  { number: 5, name: "Leo", sanskrit: "Simha", key: "leo", element: "Fire", ruler: "Sun", symbol: "Lion", description: "Majestic, noble, creative, authoritative, and warm-hearted fixed fire sign." },
  { number: 6, name: "Virgo", sanskrit: "Kanya", key: "virgo", element: "Earth", ruler: "Mercury", symbol: "Virgin", description: "Analytical, methodical, service-minded, detail-oriented, and practical dual earth sign." },
  { number: 7, name: "Libra", sanskrit: "Tula", key: "libra", element: "Air", ruler: "Venus", symbol: "Scales", description: "Harmonious, diplomatic, aesthetic, relationship-focused cardinal air sign." },
  { number: 8, name: "Scorpio", sanskrit: "Vrishchika", key: "scorpio", element: "Water", ruler: "Mars", symbol: "Scorpion", description: "Intense, transformative, magnetic, secretive, and resilient fixed water sign." },
  { number: 9, name: "Sagittarius", sanskrit: "Dhanu", key: "sagittarius", element: "Fire", ruler: "Jupiter", symbol: "Archer", description: "Philosophical, optimistic, truth-seeking, adventurous dual fire sign." },
  { number: 10, name: "Capricorn", sanskrit: "Makara", key: "capricorn", element: "Earth", ruler: "Saturn", symbol: "Sea-Goat", description: "Ambitious, disciplined, pragmatic, structured cardinal earth sign." },
  { number: 11, name: "Aquarius", sanskrit: "Kumbha", key: "aquarius", element: "Air", ruler: "Saturn", symbol: "Water Bearer", description: "Humanitarian, visionary, intellectual, unconventional fixed air sign." },
  { number: 12, name: "Pisces", sanskrit: "Meena", key: "pisces", element: "Water", ruler: "Jupiter", symbol: "Two Fish", description: "Compassionate, mystical, spiritual, imaginative dual water sign." }
];

export const NAKSHATRAS: NakshatraInfo[] = [
  { number: 1, name: "Ashwini", key: "ashwini", ruler: "Ketu", deity: "Ashwini Kumaras", symbol: "Horse Head", guna: "Sattva", description: "Signifies swift healing, pioneering spirit, and vitality." },
  { number: 2, name: "Bharani", key: "bharani", ruler: "Venus", deity: "Yama", symbol: "Yoni", guna: "Rajas", description: "Governs transformation, endurance, creation, and duty." },
  { number: 3, name: "Krittika", key: "krittika", ruler: "Sun", deity: "Agni", symbol: "Razor / Flame", guna: "Rajas", description: "Represents sharp intellect, purification, and royal dignity." },
  { number: 4, name: "Rohini", key: "rohini", ruler: "Moon", deity: "Brahma", symbol: "Chariot", guna: "Rajas", description: "Embodies beauty, magnetism, artistic growth, and abundance." },
  { number: 5, name: "Mrigashira", key: "mrigashira", ruler: "Mars", deity: "Soma", symbol: "Deer Head", guna: "Tamas", description: "Signifies active searching, curiosity, and research." },
  { number: 6, name: "Ardra", key: "ardra", ruler: "Rahu", deity: "Rudra", symbol: "Teardrop", guna: "Tamas", description: "Triggers emotional storms leading to transformative breakthroughs." },
  { number: 7, name: "Punarvasu", key: "punarvasu", ruler: "Jupiter", deity: "Aditi", symbol: "Quiver of Arrows", guna: "Sattva", description: "Represents return of light, renewal, protection, and prosperity." },
  { number: 8, name: "Pushya", key: "pushya", ruler: "Saturn", deity: "Brihaspati", symbol: "Cow Udder / Lotus", guna: "Sattva", description: "The most auspicious nakshatra for spiritual nourishment and wealth." },
  { number: 9, name: "Ashlesha", key: "ashlesha", ruler: "Mercury", deity: "Nagas", symbol: "Coiled Serpent", guna: "Tamas", description: "Governs deep intuition, psychological insight, and kundalini energy." },
  { number: 10, name: "Magha", key: "magha", ruler: "Ketu", deity: "Pitris (Ancestors)", symbol: "Royal Throne", guna: "Tamas", description: "Signifies ancestral blessings, royal lineage, and leadership." },
  { number: 11, name: "Purva Phalguni", key: "purva-phalguni", ruler: "Venus", deity: "Bhaga", symbol: "Front Legs of Couch", guna: "Rajas", description: "Represents luxury, relaxation, romance, and creative arts." },
  { number: 12, name: "Uttara Phalguni", key: "uttara-phalguni", ruler: "Sun", deity: "Aryaman", symbol: "Back Legs of Couch", guna: "Rajas", description: "Signifies contracts, marital union, generosity, and public order." },
  { number: 13, name: "Hasta", key: "hasta", ruler: "Moon", deity: "Savitar", symbol: "Open Hand / Fist", guna: "Rajas", description: "Governs dexterity, handcrafts, healing arts, and humor." },
  { number: 14, name: "Chitra", key: "chitra", ruler: "Mars", deity: "Vishwakarma", symbol: "Bright Jewel", guna: "Tamas", description: "Signifies architectural brilliance, design, charisma, and glamour." },
  { number: 15, name: "Swati", key: "swati", ruler: "Rahu", deity: "Vayu", symbol: "Young Plant Shoot", guna: "Tamas", description: "Represents independence, diplomatic skill, trade, and flexibility." },
  { number: 16, name: "Vishakha", key: "vishakha", ruler: "Jupiter", deity: "Indra & Agni", symbol: "Triumphal Arch", guna: "Sattva", description: "Governs single-minded focus, determination, and goal victory." },
  { number: 17, name: "Anuradha", key: "anuradha", ruler: "Saturn", deity: "Mitra", symbol: "Lotus / Staff", guna: "Tamas", description: "Represents devotion, friendship, organizational skills, and travel." },
  { number: 18, name: "Jyeshtha", key: "jyeshtha", ruler: "Mercury", deity: "Indra", symbol: "Earring / Umbrella", guna: "Sattva", description: "Signifies seniority, protective power, courage, and heroism." },
  { number: 19, name: "Mula", key: "mula", ruler: "Ketu", deity: "Nirriti", symbol: "Tied Roots", guna: "Tamas", description: "Governs root cause analysis, radical transformation, and research." },
  { number: 20, name: "Purva Ashadha", key: "purva-ashadha", ruler: "Venus", deity: "Apas", symbol: "Elephant Tusk / Fan", guna: "Rajas", description: "Represents invincible confidence, purification, and victory." },
  { number: 21, name: "Uttara Ashadha", key: "uttara-ashadha", ruler: "Sun", deity: "Vishwadevas", symbol: "Small Cot", guna: "Sattva", description: "Signifies enduring victory, righteousness, and unyielding truth." },
  { number: 22, name: "Shravana", key: "shravana", ruler: "Moon", deity: "Lord Vishnu", symbol: "Three Footprints / Ear", guna: "Rajas", description: "Governs deep listening, oral traditions, learning, and fame." },
  { number: 23, name: "Dhanishta", key: "dhanishta", ruler: "Mars", deity: "Eight Vasus", symbol: "Drum / Flute", guna: "Tamas", description: "Signifies wealth, rhythm, musical brilliance, and fame." },
  { number: 24, name: "Shatabhisha", key: "shatabhisha", ruler: "Rahu", deity: "Varuna", symbol: "100 Physicians / Circle", guna: "Tamas", description: "Governs mysterious healing, secrets, astronomy, and independence." },
  { number: 25, name: "Purva Bhadrapada", key: "purva-bhadrapada", ruler: "Jupiter", deity: "Aja Ekapada", symbol: "Swords / Two Front Legs of Funeral Cot", guna: "Sattva", description: "Signifies ascetic intensity, passion, and spiritual illumination." },
  { number: 26, name: "Uttara Bhadrapada", key: "uttara-bhadrapada", ruler: "Saturn", deity: "Ahirbudhnya", symbol: "Back Legs of Funeral Cot / Snake in Water", guna: "Sattva", description: "Governs deep wisdom, psychic protection, patience, and detachment." },
  { number: 27, name: "Revati", key: "revati", ruler: "Mercury", deity: "Pushan", symbol: "Fish / Drum", guna: "Sattva", description: "Represents safe journeys, abundance, compassion, and divine completion." }
];

export const HIGH_INTENT_LANDINGS = [
  {
    slug: "ai-kundli",
    title: "Free AI Kundli Generator – Instant Vedic Birth Chart Analysis",
    description: "Generate your free Janma Kundli online with precision planetary degrees, Dasha timeline, Bhavas, and personalized AI astrological insights.",
    category: "Calculators",
    h1: "Free AI Kundli Generator & Precision Janma Kundli Analysis",
    ctaPrompt: "Generate my complete AI Kundli with planetary positions and active Dasha"
  },
  {
    slug: "ai-horoscope",
    title: "Today's AI Horoscope & Planetary Transit Guidance",
    description: "Accurate daily, weekly, and yearly AI Vedic Horoscope predictions for all 12 zodiac signs tailored to your Moon sign and Lagna.",
    category: "Horoscope",
    h1: "Daily AI Vedic Horoscope & Planetary Transit Forecast",
    ctaPrompt: "Give me my personalized daily Vedic Horoscope analysis"
  },
  {
    slug: "birth-chart-ai",
    title: "Birth Chart Analysis – Comprehensive Vedic Janma Kundli Guide",
    description: "In-depth birth chart decoding covering Lagna, Moon sign, Nakshatra pada, Shadbala, and divisional charts (D9 Navamsha).",
    category: "Calculators",
    h1: "Vedic Birth Chart Analysis: Decode Your Janma Patrika",
    ctaPrompt: "Analyze my birth chart D1 and D9 Navamsha in detail"
  },
  {
    slug: "marriage-prediction",
    title: "Kundli Matching & Marriage Compatibility Guide",
    description: "36 Gun Milan, Ashtakoot agreement, Manglik Dosh check, Nadi Dosh cancellation analysis, and 7th House marriage prospects.",
    category: "Matching",
    h1: "Vedic Marriage Compatibility & Ashtakoot Gun Milan Guide",
    ctaPrompt: "Analyze my marriage timing, spouse characteristics, and Gun Milan compatibility"
  },
  {
    slug: "career-prediction",
    title: "10th House & Career Astrology Analysis",
    description: "Discover your ideal profession, business prospects, government job yogas, and career promotion timelines using D10 Dasamsa chart.",
    category: "Career",
    h1: "Vedic Career Astrology & Professional Destiny Analysis",
    ctaPrompt: "Predict my career direction, business vs job success, and financial timing"
  },
  {
    slug: "dasha-analysis",
    title: "Vimshottari Dasha Calculator & Timeline Predictions",
    description: "Calculate your current Mahadasha, Antardasha, and Pratyantardasha timing with accurate planetary transit effects.",
    category: "Dasha",
    h1: "Vimshottari Mahadasha & Antardasha Timeline Analysis",
    ctaPrompt: "Explain my current Mahadasha & Antardasha phase and upcoming life shifts"
  },
  {
    slug: "nakshatra-calculator",
    title: "Free Nakshatra Calculator & Pada Blueprint Analysis",
    description: "Find your exact birth star (Janma Nakshatra), ruler, deity, Pada characteristics, and lifetime karmic trajectory.",
    category: "Calculators",
    h1: "Vedic Janma Nakshatra & Birth Star Calculator",
    ctaPrompt: "What is my birth Nakshatra, its ruling planet, and my core traits?"
  },
  {
    slug: "planet-calculator",
    title: "Planetary Strength & Shadbala Calculator",
    description: "Calculate planetary dignity, combustion, retrogression, Exaltation (Uchcha), Debilitation (Neecha), and Shadbala scores.",
    category: "Calculators",
    h1: "Planetary Strengths (Shadbala) & Dignity Calculator",
    ctaPrompt: "Calculate my planetary strengths and tell me which planet is strongest in my chart"
  },
  {
    slug: "ascendant-calculator",
    title: "Lagna / Rising Sign Calculator & Personality Analysis",
    description: "Find your exact Lagna (Ascendant), Lagna Lord strength, and physical blueprint according to authentic Parashari principles.",
    category: "Calculators",
    h1: "Ascendant (Lagna) Calculator & Life Blueprint Guide",
    ctaPrompt: "Identify my Lagna sign and explain my primary life purpose"
  },
  {
    slug: "moon-sign-calculator",
    title: "Chandra Rashi (Moon Sign) Calculator & Mind Analysis",
    description: "Calculate your Moon sign in Vedic Astrology to understand your psychological nature, emotional needs, and Sade Sati status.",
    category: "Calculators",
    h1: "Chandra Rashi (Moon Sign) Calculator & Emotional Blueprint",
    ctaPrompt: "Calculate my Moon sign and analyze my emotional and psychological traits"
  }
];
