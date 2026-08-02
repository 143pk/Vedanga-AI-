import React, { useState, useEffect } from "react";
import {
  BookOpen,
  Sun,
  Moon,
  Sparkles,
  Award,
  HeartHandshake,
  Scroll,
  Bookmark,
  CheckCircle2,
  ChevronRight,
  GraduationCap,
  Volume2,
  Share2,
  Lightbulb,
  Flame,
  Compass,
  Star,
  Quote,
  Feather,
  BookMarked,
  Search,
  Zap,
  Calendar,
  X,
  Clock,
  TrendingUp,
  ExternalLink,
  ChevronDown,
  HelpCircle,
  MessageSquare,
  ShieldCheck,
  Check
} from "lucide-react";
import { UserProfile } from "../types";
import { getProgrammaticPage, ProgrammaticPageData } from "../seo/programmaticEngine";
import { searchSeoTopics, SearchResultItem } from "../seo/seoSearch";
import { PLANETS, HOUSES, SIGNS, NAKSHATRAS, HIGH_INTENT_LANDINGS } from "../seo/astrologyData";

interface LearningViewProps {
  user: UserProfile;
}

type LearningSection =
  | "trending"
  | "lesson"
  | "planet"
  | "nakshatra"
  | "yoga"
  | "guru"
  | "story";

export const LearningView: React.FC<LearningViewProps> = ({ user }) => {
  const [activeSection, setActiveSection] = useState<LearningSection>("trending");
  const [bookmarkedItems, setBookmarkedItems] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("vedanga_bookmarks");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [cmsArticles, setCmsArticles] = useState<any[]>([]);
  const [trendingTopicsList, setTrendingTopicsList] = useState<any[]>([]);
  const [articleCategory, setArticleCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedArticleModal, setSelectedArticleModal] = useState<any | null>(null);
  const [selectedProgrammaticSlug, setSelectedProgrammaticSlug] = useState<string | null>(null);
  const [programmaticPageData, setProgrammaticPageData] = useState<ProgrammaticPageData | null>(null);
  const [expandedFaqIndex, setExpandedFaqIndex] = useState<number | null>(null);
  const [readerFontSize, setReaderFontSize] = useState<"sm" | "base" | "lg">("base");
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [copiedToast, setCopiedToast] = useState<boolean>(false);

  // Auto detect initial path /learn/some-slug
  useEffect(() => {
    const path = window.location.pathname;
    if (path.startsWith("/learn/") && path.length > 7) {
      const slug = path.replace(/^\/learn\//, "");
      if (slug) {
        setSelectedProgrammaticSlug(slug);
        setProgrammaticPageData(getProgrammaticPage(slug));
      }
    }
  }, []);

  // Update programmatic page data whenever slug changes
  useEffect(() => {
    if (selectedProgrammaticSlug) {
      const page = getProgrammaticPage(selectedProgrammaticSlug);
      setProgrammaticPageData(page);
      document.title = page.title;
      window.history.pushState(null, "", `/learn/${selectedProgrammaticSlug}`);
      window.scrollTo({ top: 0, behavior: "instant" });
    } else {
      document.title = "Vedanga AI – Vedic Knowledge Hub";
    }
  }, [selectedProgrammaticSlug]);

  useEffect(() => {
    fetch("/api/cms/articles")
      .then((res) => res.json())
      .then((data) => {
        if (data.articles) setCmsArticles(data.articles);
        if (data.trendingTopics) setTrendingTopicsList(data.trendingTopics);
      })
      .catch((err) => console.error("Failed to load CMS articles", err));
  }, []);

  // Scroll to top when opening an article post
  useEffect(() => {
    if (selectedArticleModal) {
      window.scrollTo({ top: 0, behavior: "instant" });
      document.body.style.overflow = "unset";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [selectedArticleModal]);

  // Text to Speech for 3-minute post listening
  const handleToggleSpeech = (text: string) => {
    if (!("speechSynthesis" in window)) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      window.speechSynthesis.cancel();
      const cleanText = text.replace(/[#*`]/g, "");
      const utterance = new SpeechSynthesisUtterance(cleanText.substring(0, 3000));
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  const [selectedPlanetIdx, setSelectedPlanetIdx] = useState<number>(0);
  const [selectedNakshatraIdx, setSelectedNakshatraIdx] = useState<number>(0);
  const [selectedYogaIdx, setSelectedYogaIdx] = useState<number>(0);
  const [selectedStoryIdx, setSelectedStoryIdx] = useState<number>(0);
  const [lessonIdx, setLessonIdx] = useState<number>(0);
  const [quizAnswered, setQuizAnswered] = useState<number | null>(null);

  const toggleBookmark = (id: string) => {
    setBookmarkedItems((prev) => {
      const next = prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id];
      localStorage.setItem("vedanga_bookmarks", JSON.stringify(next));
      return next;
    });
  };

  // --- DATA DEFINITIONS ---

  // 1. Daily Jyotish Lessons
  const jyotishLessons = [
    {
      id: "lesson_kendra_trikona",
      title: "Kendra & Trikona Houses: The Pillars of Fortune",
      category: "Foundation & Bhavas",
      level: "Intermediate",
      readTime: "5 min read",
      summary:
        "Understand why 1st, 4th, 7th, 10th (Kendras) represent Vishnu's sustaining power, while 1st, 5th, 9th (Trikonas) represent Lakshmi's grace.",
      coreConcept:
        "In Vedic Astrology, the 12 houses are categorized into specific functional groups. Kendra houses (1, 4, 7, 10) are the pillars of action and physical manifestation (Vishnu Sthanas). Trikona houses (1, 5, 9) are the houses of luck, divine grace, past-life merits (Punya), and wisdom (Lakshmi Sthanas).",
      mechanics: [
        "1st House (Lagna): Functions as both a Kendra and a Trikona — the supreme bridge between self-action and divine grace.",
        "5th House: Purva Punya (past good karma), intelligence, children, and mantric power.",
        "9th House: Dharma, Higher Wisdom, Guru's Grace, and Supreme Fortune (Bhagya).",
        "4th & 10th Houses: Emotional foundations and supreme karma in society."
      ],
      goldenRule:
        "When the lord of a Kendra house associates with the lord of a Trikona house without malefic affliction, a potent Raja Yoga (King's Combination) is formed, granting power and success.",
      example:
        "For Aries Ascendant, Mars (1st lord - Kendra/Trikona) joining Jupiter (9th lord - Trikona) in the 10th house creates a highest-order Dharma-Karmadhipati Raja Yoga.",
      quiz: {
        question: "Which house serves as both a Kendra and a Trikona?",
        options: ["5th House", "1st House (Lagna)", "9th House", "10th House"],
        correct: 1,
        explanation: "The 1st House (Lagna/Ascendant) is unique because it is considered both the first Kendra (pillar of action) and the first Trikona (house of dharma)."
      }
    },
    {
      id: "lesson_dasha_mechanics",
      title: "The Mechanics of Vimshottari Dasha: Unfolding Time",
      category: "Timing of Events",
      level: "Advanced",
      readTime: "6 min read",
      summary:
        "How a 120-year planetary timeline calculated from your birth Moon Nakshatra governs the exact unfoldment of your destiny.",
      coreConcept:
        "Vimshottari Dasha is the jewel of Parashari Jyotish. 'Vimshottari' means 120 years, representing the ideal human lifespan. The starting Dasha planet and remaining balance are determined precisely by the longitude of the Moon in its Nakshatra at the moment of birth.",
      mechanics: [
        "Major Period (Maha Dasha): Sets the overarching climate and environmental background of life.",
        "Sub Period (Antar Dasha): Triggers specific events and psychological focus.",
        "Sub-Sub Period (Pratyantar Dasha): Marks precise weeks and days when events fructify.",
        "Dasha Planet Strength: A planet can only grant its full promise if it is well-placed in Rashi and Navamsha (D9)."
      ],
      goldenRule:
        "A planet in its Dasha period acts primarily as the ruler of the houses it owns, conditioned by the house it occupies and the planets aspecting it.",
      example:
        "If running Jupiter Dasha, and Jupiter owns the 9th house of fortune placed in the 11th house of gains, the native experiences significant financial and spiritual expansion.",
      quiz: {
        question: "What determines the starting Vimshottari Dasha at birth?",
        options: ["Sun's degree", "Lagna degree", "Moon's Nakshatra position", "Saturn's placement"],
        correct: 2,
        explanation: "The exact longitude of the Moon within its natal Nakshatra determines which planet's Dasha is active at birth and how much balance remains."
      }
    },
    {
      id: "lesson_retrograde_vakri",
      title: "Understanding Retrograde Planets (Vakri Grahas)",
      category: "Planetary Dynamics",
      level: "Intermediate",
      readTime: "4 min read",
      summary:
        "Why retrograde planets appear to move backward in the sky, carrying intense Chesta Bala (motional strength) and unresolved karmic debts.",
      coreConcept:
        "When a planet is closest to Earth, optical illusion causes it to appear retrograde (Vakri) against the background stars. In Jyotish, retrogradation increases a planet's 'Chesta Bala' (motional strength), making its energy deeply internalized and persistent.",
      mechanics: [
        "Internalized Energy: Retrograde planets reflect intense mental focus and deep soul desires from previous births.",
        "Non-Conventional Approach: Natives with retrograde planets often reject standard societal paths in favor of unique methods.",
        "Aspecting Previous House: A retrograde planet exerts strong energetic influence on the house preceding it.",
        "Sun & Moon are NEVER retrograde; Rahu & Ketu are almost ALWAYS retrograde."
      ],
      goldenRule:
        "A benefic retrograde planet gives intense creative and spiritual gifts, while a malefic retrograde planet requires conscious karmic patience and discipline.",
      example:
        "Retrograde Jupiter in 1st house confers deep intuitive philosophical wisdom, often questioning dogmatic religious teachings.",
      quiz: {
        question: "Which two celestial bodies are NEVER retrograde?",
        options: ["Mars & Venus", "Sun & Moon", "Mercury & Jupiter", "Saturn & Mars"],
        correct: 1,
        explanation: "The Sun and Moon always move in direct forward motion across the zodiac and never undergo retrogression."
      }
    }
  ];

  // 2. Planets of the Day / All 9 Grahas
  const grahas = [
    {
      name: "Surya (Sun)",
      title: "The Royal Soul & Cosmic Light",
      sanskrit: "सूर्य",
      day: "Sunday",
      element: "Fire (Agni)",
      gemstone: "Ruby (Manikya)",
      chakra: "Manipura (Solar Plexus)",
      rashiRuler: "Leo (Simha)",
      exalted: "Aries 10°",
      debilitated: "Libra 10°",
      karakaFor: "Atma (Soul), Father, King/Government, Vitality, Leadership, Self-Respect",
      traits: "Magnanimous, authoritative, righteous, dignified, radiant, courageous.",
      remedy: "Offer Surya Arghya (water offering) at sunrise and chant Aditya Hrudayam Stotram."
    },
    {
      name: "Chandra (Moon)",
      title: "The Mind, Emotions & Divine Nurturer",
      sanskrit: "चन्द्र",
      day: "Monday",
      element: "Water (Jala)",
      gemstone: "Pearl (Moti)",
      chakra: "Ajna / Anahata",
      rashiRuler: "Cancer (Karka)",
      exalted: "Taurus 3°",
      debilitated: "Scorpio 3°",
      karakaFor: "Manas (Mind), Mother, Memory, Public Image, Peace, Nourishment",
      traits: "Intuitive, gentle, receptive, empathetic, changeable, loving.",
      remedy: "Worship Goddess Gauri / Lord Shiva on Mondays; practice pranayama during full moon."
    },
    {
      name: "Mangala (Mars)",
      title: "The Divine Commander & Vital Energy",
      sanskrit: "मंगल",
      day: "Tuesday",
      element: "Fire (Agni)",
      gemstone: "Red Coral (Moonga)",
      chakra: "Swadhisthana",
      rashiRuler: "Aries & Scorpio",
      exalted: "Capricorn 28°",
      debilitated: "Cancer 28°",
      karakaFor: "Courage, Physical Strength, Siblings, Land/Property, Technical Skill, Defense",
      traits: "Dynamic, decisive, fiery, protective, competitive, assertive.",
      remedy: "Recite Hanuman Chalisa on Tuesdays and donate lentils or red items."
    },
    {
      name: "Budha (Mercury)",
      title: "The Intellectual Prince & Messenger",
      sanskrit: "बुध",
      day: "Wednesday",
      element: "Earth (Prithvi)",
      gemstone: "Emerald (Panna)",
      chakra: "Vishuddha (Throat)",
      rashiRuler: "Gemini & Virgo",
      exalted: "Virgo 15°",
      debilitated: "Pisces 15°",
      karakaFor: "Speech, Commerce, Logic, Mathematics, Astrology, Nervous System",
      traits: "Witty, analytical, adaptable, eloquent, curious, youthful.",
      remedy: "Chant Vishnu Sahasranama on Wednesdays and nurture green plants."
    },
    {
      name: "Guru / Brihaspati (Jupiter)",
      title: "The Great Preceptor & Divine Grace",
      sanskrit: "बृहस्पति",
      day: "Thursday",
      element: "Ether (Akasha)",
      gemstone: "Yellow Sapphire (Pukhraj)",
      chakra: "Anahata / Sahasrara",
      rashiRuler: "Sagittarius & Pisces",
      exalted: "Cancer 5°",
      debilitated: "Capricorn 5°",
      karakaFor: "Wisdom, Dharma, Wealth, Guru, Children, Higher Philosophy, Grace",
      traits: "Benevolent, philosophical, optimistic, expansive, virtuous, spiritual.",
      remedy: "Offer yellow flowers to Guru/Shiva on Thursdays; practice selfless teaching."
    },
    {
      name: "Shukra (Venus)",
      title: "The Ambassador of Love, Art & Harmony",
      sanskrit: "शुक्र",
      day: "Friday",
      element: "Water (Jala)",
      gemstone: "Diamond / White Sapphire",
      chakra: "Swadhisthana / Anahata",
      rashiRuler: "Taurus & Libra",
      exalted: "Pisces 27°",
      debilitated: "Virgo 27°",
      karakaFor: "Beauty, Romance, Fine Arts, Luxury, Vehicles, Spouse, Sanjeevani Vidya",
      traits: "Charming, artistic, harmonious, diplomatic, compassionate, refined.",
      remedy: "Recite Sri Suktam or Mahalaxmi Ashtakam on Fridays; respect women."
    },
    {
      name: "Shani (Saturn)",
      title: "The Karmic Judge & Timekeeper",
      sanskrit: "शनि",
      day: "Saturday",
      element: "Air (Vayu)",
      gemstone: "Blue Sapphire (Neelam)",
      chakra: "Muladhara (Root)",
      rashiRuler: "Capricorn & Aquarius",
      exalted: "Libra 20°",
      debilitated: "Aries 20°",
      karakaFor: "Longevity, Discipline, Perseverance, Service, Humility, Solitude, Real Estate",
      traits: "Patient, austere, methodical, pragmatic, dutiful, steady.",
      remedy: "Feed black sesame seeds or mustard oil lamp to Lord Shani/Hanuman on Saturdays."
    }
  ];

  // 3. Nakshatras
  const nakshatras = [
    {
      name: "Rohini",
      sanskrit: "रोहिणी",
      deity: "Brahma (The Creator)",
      ruler: "Moon",
      symbol: "Chariot / Temple / Banyan Tree",
      shakti: "Rohana Shakti (Power to grow and create)",
      traits: "Charming, artistic, sensual, fertile, passionate, grounded.",
      shadow: "Possessiveness, jealousy, materialism if unbalanced.",
      auspiciousFor: "Starting creative arts, agriculture, marriage, purchases, luxury."
    },
    {
      name: "Ashwini",
      sanskrit: "अश्विनी",
      deity: "Ashwini Kumaras (Celestial Physicians)",
      ruler: "Ketu",
      symbol: "Horse's Head",
      shakti: "Shidhra Vyapani Shakti (Power to heal quickly)",
      traits: "Swift, energetic, pioneering, spontaneous, natural healer.",
      shadow: "Impatience, impulsiveness, difficulty finishing long tasks.",
      auspiciousFor: "Medical treatments, swift travel, initiation, starting new journeys."
    },
    {
      name: "Magha",
      sanskrit: "मघा",
      deity: "Pitris (Ancestral Spirits)",
      ruler: "Ketu",
      symbol: "Royal Throne / Palanquin",
      shakti: "Tyage Shepani Shakti (Power to leave the body / ancestral power)",
      traits: "Regal, noble, honorable, respectful of tradition, natural authority.",
      shadow: "Arrogance, pride, high expectation of deference.",
      auspiciousFor: "Honoring ancestors, coronation, leadership roles, legacy work."
    },
    {
      name: "Revati",
      sanskrit: "रेवती",
      deity: "Pushan (Nourisher of Paths)",
      ruler: "Mercury",
      symbol: "Fish / Drum",
      shakti: "Kshiradyapana Shakti (Power to nourish and protect travelers)",
      traits: "Compassionate, gentle, spiritual, loving, visionary, protective.",
      shadow: "Over-sensitivity, escapism, taking on others' emotional burdens.",
      auspiciousFor: "Spiritual retreats, travel, adoption, caring for animals, music."
    }
  ];

  // 4. Yogas Explained
  const yogas = [
    {
      name: "Gajakesari Yoga",
      category: "Auspicious Wisdom & Fame",
      sanskrit: "गजकेसरी योग",
      formula: "Jupiter placed in a Kendra (1st, 4th, 7th, 10th house) from the Moon.",
      meaning: "Gaja means Elephant (majestic strength) and Kesari means Lion (unshakable courage). Together they create a person of vast intelligence, moral integrity, and social renown.",
      results: [
        "High intellectual capacity and spiritual inclination",
        "Commanding respect in society and professional circles",
        "Protection during adverse planetary transits",
        "Financial stability and enduring legacy"
      ],
      cancellation: "If Jupiter or Moon is severely combust, debilitated in Navamsha, or heavily aspected by Rahu/Saturn without benefic intervention."
    },
    {
      name: "Budhaditya Yoga",
      category: "Intellectual Brilliance",
      sanskrit: "बुधादित्य योग",
      formula: "Sun and Mercury placed in the same house, particularly in 1st, 5th, 9th, or 10th.",
      meaning: "Sun provides divine illumination and authority, while Mercury provides razor-sharp logic and analytical power.",
      results: [
        "Exceptional verbal and written communication skills",
        "Quick comprehension of complex mathematical or financial concepts",
        "Success in administration, publishing, and astrology",
        "Renown for ethical leadership"
      ],
      cancellation: "If Mercury is within 3 degrees of Sun (deep combustion) or afflicted by Ketu/Mars."
    },
    {
      name: "Pancha Mahapurusha - Ruchaka Yoga",
      category: "Great Commander Combination",
      sanskrit: "रुचक योग",
      formula: "Mars in its own sign (Aries/Scorpio) or exaltation (Capricorn) in a Kendra house (1, 4, 7, 10).",
      meaning: "Ruchaka Yoga creates an extraordinarily courageous, physically resilient, and strategic leader who protects dharma.",
      results: [
        "Unshakeable physical stamina and military or executive authority",
        "Ownership of vast lands, real estate, and structural infrastructure",
        "Victory over rivals and obstacle clearing capability"
      ],
      cancellation: "Combustion with Sun or affliction by Saturn without Jupiter aspect."
    },
    {
      name: "Vipareeta Raja Yoga",
      category: "Triumph Through Adversity",
      sanskrit: "विपरीत राजयोग",
      formula: "Lords of dusthana houses (6th, 8th, 12th) occupying other dusthana houses without association with benefic house lords.",
      meaning: "Vipareeta means 'contrary'. It produces unexpected elevation and triumph emerging directly out of crisis or competitor downfall.",
      results: [
        "Immense wealth arising from sudden unexpected inheritances or legal victories",
        "Ability to thrive under high-pressure crisis situations",
        "Total neutralization of secret enemies"
      ],
      cancellation: "If a dusthana lord is aspected by or conjunct a Kendra/Trikona benefic lord."
    }
  ];

  // 5. Guru Wisdom
  const guruWisdom = [
    {
      author: "Maharishi Parashara",
      title: "The Eternal Light of Karma",
      sutra: "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन। ग्रहचारो हि जीवस्य कर्मपाकमनुस्मरेत्॥",
      translation: "Planetary positions do not create your fate out of nowhere; they are divine cosmic mirrors reflecting the ripening seed of your own past deeds (Karma-Paka).",
      commentary: "Jyotish is not fatalism. Knowing your horoscope allows you to apply conscious remedies (Sadhana, Mantra, Dana) to dissolve negative karmic seeds before they manifest physically.",
      practice: "Dedicate 10 minutes today to self-reflection: observe your spontaneous reactions without judgment and dedicate your work to the Divine."
    },
    {
      author: "Swami Vivekananda",
      title: "Unshakable Will Power",
      sutra: "उत्तिष्ठत जाग्रत प्राप्य वरान्निबोधत।",
      translation: "Arise, awake, and stop not till the goal is reached!",
      commentary: "No planetary transit, no matter how severe, can override a human soul anchored in supreme devotion and relentless self-effort (Purushartha).",
      practice: "When facing a difficult task today, chant 'Om Namah Shivaya' 3 times to invoke inner strength before acting."
    },
    {
      author: "Acharya Varahamihira",
      title: "The Sacred Duty of an Astrologer",
      sutra: "त्रिस्कन्धज्योतिषवेत्ता हि सर्वज्ञ इव पूज्यते।",
      translation: "One who masters the three branches of Jyotish (Ganita, Hora, Samhita) with a pure heart is revered like a sage.",
      commentary: "True Vedic wisdom must be practiced with utmost humility, truthfulness, and compassion for all suffering beings.",
      practice: "Speak truthful and pleasant words today; avoid harsh criticism."
    }
  ];

  // 6. Vedic Stories
  const vedicStories = [
    {
      title: "Samudra Manthan & The Cosmic Origin of Rahu-Ketu",
      source: "Vishnu Purana & Shrimad Bhagavatam",
      moral: "Desire without purity leads to fragmentation, but divine surrender grants true immortality.",
      summary:
        "During the churning of the cosmic milk ocean (Samudra Manthan), Amrita (nectar of immortality) emerged. A demon named Swarbhanu quietly slipped between Surya (Sun) and Chandra (Moon) to drink the nectar disguised as a Deva.",
      fullStory:
        "Surya and Chandra noticed the deception and alerted Lord Vishnu, who immediately severed Swarbhanu's neck with the Sudarshana Chakra. However, because nectar had already passed his throat, both severed parts remained immortal!\n\nThe head became Rahu (the head of desire, worldly obsession, and eclipse), and the body became Ketu (the tail of detachment, moksha, and deep intuitive wisdom). To this day, Rahu and Ketu periodically shadow the Sun and Moon during eclipses as a cosmic reminder of karmic cause and effect.",
      astrologicalSignificance:
        "In your birth chart, Rahu represents where your soul seeks new worldly experience and obsession, while Ketu represents where you have already achieved mastery in past lives and seek spiritual liberation."
    },
    {
      title: "King Vikramaditya & Saturn's Trial of Patience",
      source: "Shani Mahatmya",
      moral: "Saturn humbles the proud ego not to destroy, but to purify and refine soul character.",
      summary:
        "When King Vikramaditya declared in court that the Sun was superior and Saturn was merely a bringer of suffering, Lord Shani paid a visit to test the King's wisdom during his 7.5-year Sade Sati transit.",
      fullStory:
        "The King lost his kingdom, was falsely accused of theft, had his hands and feet severed, and worked humbly grinding oil seeds at an oilman's house for years without resentment.\n\nThroughout these intense trials, Vikramaditya maintained unwavering patience, chanted prayers to Lord Shani, and surrendered his ego completely. Pleased with his absolute humility and fortitude, Lord Shani restored his hands, limbs, kingdom, and granted him unmatched wisdom and prosperity.",
      astrologicalSignificance:
        "Saturn's Dasha or Sade Sati is not punishment — it is divine alchemy. When you embrace patience, discipline, and hard work, Shani bestows the highest permanent blessings."
    }
  ];

  // Active item selections
  const currentLesson = jyotishLessons[lessonIdx];
  const currentPlanet = grahas[selectedPlanetIdx];
  const currentNakshatra = nakshatras[selectedNakshatraIdx];
  const currentYoga = yogas[selectedYogaIdx];
  const currentGuru = guruWisdom[0];
  const currentStory = vedicStories[selectedStoryIdx];

  // PROGRAMMATIC SEO KNOWLEDGE HUB PAGE READER
  if (selectedProgrammaticSlug && programmaticPageData) {
    const page = programmaticPageData;
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-28 animate-fade-in">
        {/* Sticky Header with Breadcrumbs & Actions */}
        <div className="sticky top-0 z-30 bg-slate-900/95 backdrop-blur-md border-b border-amber-500/30 px-4 md:px-8 py-3 flex items-center justify-between shadow-2xl">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none text-xs">
            <button
              onClick={() => {
                setSelectedProgrammaticSlug(null);
                setProgrammaticPageData(null);
                window.history.pushState(null, "", "/learn");
                window.scrollTo({ top: 0, behavior: "instant" });
              }}
              className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold transition-all cursor-pointer flex items-center gap-1.5 shadow-md shrink-0"
            >
              <X className="w-3.5 h-3.5" />
              <span>← Back to Knowledge Hub</span>
            </button>
            <span className="text-slate-600 hidden sm:inline">/</span>
            <span className="text-amber-400 font-medium hidden sm:inline">{page.category}</span>
            <span className="text-slate-600 hidden md:inline">/</span>
            <span className="text-slate-400 truncate max-w-[200px] hidden md:inline">{page.h1}</span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Listen Audio */}
            <button
              onClick={() => handleToggleSpeech(page.executiveSummary + " " + page.sections.map(s => s.content).join(" "))}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all cursor-pointer ${
                isSpeaking
                  ? "bg-amber-500 text-slate-950 border-amber-400 font-bold animate-pulse"
                  : "bg-slate-950 text-amber-300 border-amber-500/30 hover:border-amber-400"
              }`}
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{isSpeaking ? "Pause" : "Listen (Audio)"}</span>
            </button>

            {/* Share */}
            <button
              onClick={() => {
                navigator.clipboard.writeText(page.canonicalUrl);
                setCopiedToast(true);
                setTimeout(() => setCopiedToast(false), 2500);
              }}
              className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-amber-300 hover:border-amber-400 text-xs font-bold flex items-center gap-1 cursor-pointer"
              title="Copy Page URL"
            >
              <Share2 className="w-3.5 h-3.5" />
              {copiedToast && <span className="text-[10px] text-green-400">Copied!</span>}
            </button>
          </div>
        </div>

        {/* Article Body Container */}
        <div className="max-w-4xl mx-auto px-4 md:px-8 py-8 space-y-8">
          {/* Main Title & EEAT Metadata Header */}
          <div className="bg-gradient-to-b from-slate-900 to-slate-950 border border-amber-500/30 p-6 md:p-10 rounded-3xl shadow-2xl space-y-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30 px-3 py-1 rounded-full flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                {page.category}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-1 rounded-full flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Verified Parashari Jyotish
              </span>
              <span className="text-xs text-slate-400 font-mono ml-auto">
                {page.readTime}
              </span>
            </div>

            <h1 className="font-serif text-3xl md:text-5xl font-extrabold text-amber-100 leading-tight">
              {page.h1}
            </h1>

            {/* Author & EEAT Information */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 font-mono">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 text-slate-950 flex items-center justify-center font-bold text-sm">
                  AV
                </div>
                <div>
                  <div className="font-bold text-amber-200 text-sm">{page.author}</div>
                  <div className="text-[10px] text-slate-400">Senior Vedic Astrologer & Sanskrit Researcher</div>
                </div>
              </div>
              <div className="text-right text-[11px] text-slate-400">
                <div>Last Updated: <span className="text-amber-300 font-bold">{page.updatedAt}</span></div>
                <div>Peer-Reviewed by Vedanga AI Council</div>
              </div>
            </div>

            {/* Sanskrit Shloka Box */}
            <div className="p-5 rounded-2xl bg-amber-950/30 border border-amber-500/40 relative overflow-hidden">
              <div className="text-amber-300 font-serif text-lg md:text-xl font-bold tracking-wide mb-2 text-center">
                {page.scripturalShloka}
              </div>
              <div className="text-xs text-slate-300 italic text-center font-sans">
                Source: Classical Parashari Hora & Maharishi Jaimini Sutram
              </div>
            </div>

            {/* Executive Cosmic Summary */}
            <div className="space-y-3">
              <h3 className="text-sm uppercase tracking-wider text-amber-400 font-bold flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" /> Executive Cosmic Summary
              </h3>
              <p className="text-slate-200 text-base md:text-lg leading-relaxed font-normal bg-slate-950/60 p-5 rounded-2xl border border-slate-800">
                {page.executiveSummary}
              </p>
            </div>
          </div>

          {/* Detailed H2 Sections */}
          <div className="space-y-6">
            {page.sections.map((section, idx) => (
              <div key={idx} className="bg-slate-900/80 border border-slate-800 hover:border-amber-500/30 p-6 md:p-8 rounded-3xl space-y-4 transition-all">
                <h2 className="font-serif text-xl md:text-2xl font-bold text-amber-300 flex items-center gap-2.5 border-b border-slate-800 pb-3">
                  <span className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 text-xs font-mono font-bold flex items-center justify-center border border-amber-500/30">
                    0{idx + 1}
                  </span>
                  {section.title}
                </h2>
                <div className="text-slate-300 text-base md:text-lg leading-relaxed whitespace-pre-line font-normal">
                  {section.content}
                </div>
              </div>
            ))}
          </div>

          {/* INTERACTIVE RELATED WIDGETS SECTION */}
          <div className="bg-slate-900/90 border border-amber-500/30 p-6 md:p-8 rounded-3xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="font-serif text-xl font-bold text-amber-100 flex items-center gap-2">
                <Compass className="w-5 h-5 text-amber-400" />
                Cosmic Building Blocks & Astrological Elements
              </h3>
              <span className="text-xs text-slate-400 font-mono">Explore Classical Jyotish</span>
            </div>

            {/* Planets Grid */}
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Ruling Grahas (Planets)</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {PLANETS.map((p) => (
                  <button
                    key={p.key}
                    onClick={() => setSelectedProgrammaticSlug(`${p.key}-in-vedic-astrology`)}
                    className="p-3 bg-slate-950 border border-slate-800 hover:border-amber-500/50 rounded-2xl text-left transition-all cursor-pointer hover:bg-slate-900 group"
                  >
                    <div className="font-bold text-amber-200 text-sm group-hover:text-amber-300">{p.name} ({p.sanskrit})</div>
                    <div className="text-[11px] text-slate-400 truncate">{p.qualities[0]} • {p.day}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 20-40 DYNAMIC SCRIPTURAL FAQS SECTION */}
          <div className="bg-slate-900/90 border border-slate-800 p-6 md:p-8 rounded-3xl space-y-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1">
                  <HelpCircle className="w-4 h-4" /> Scriptural FAQ & Analysis
                </span>
              </div>
              <h3 className="font-serif text-2xl font-bold text-amber-100">
                20+ Classical Questions & Scriptural Answers
              </h3>
              <p className="text-xs text-slate-400">
                Authentic answers derived from Brihat Parashara Hora Shastra, Phaladeepika, and Jaimini Sutras.
              </p>
            </div>

            <div className="space-y-3">
              {page.faqs.map((faq, fIdx) => {
                const isOpen = expandedFaqIndex === fIdx;
                return (
                  <div
                    key={fIdx}
                    className="bg-slate-950 border border-slate-800 hover:border-amber-500/30 rounded-2xl transition-all overflow-hidden"
                  >
                    <button
                      onClick={() => setExpandedFaqIndex(isOpen ? null : fIdx)}
                      className="w-full p-4 text-left font-semibold text-sm text-amber-200 hover:text-amber-300 flex items-center justify-between gap-3 cursor-pointer"
                    >
                      <span className="flex items-start gap-2">
                        <span className="text-amber-400 font-bold shrink-0">Q{fIdx + 1}.</span>
                        <span>{faq.question}</span>
                      </span>
                      <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${isOpen ? "rotate-180 text-amber-400" : ""}`} />
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-4 pt-1 text-slate-300 text-xs md:text-sm leading-relaxed border-t border-slate-900 bg-slate-900/40">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* AUTOMATIC TOPIC CLUSTERS & INTERLINKING SECTION */}
          <div className="bg-slate-900/90 border border-amber-500/30 p-6 md:p-8 rounded-3xl space-y-6">
            <div className="space-y-1 border-b border-slate-800 pb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4" /> Automatic Topic Clusters
              </span>
              <h3 className="font-serif text-2xl font-bold text-amber-100">
                Related Astrological Guides & Deep Dives
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {page.topicClusterLinks.map((link, lIdx) => (
                <button
                  key={lIdx}
                  onClick={() => setSelectedProgrammaticSlug(link.slug)}
                  className="p-4 bg-slate-950 border border-slate-800 hover:border-amber-500/50 rounded-2xl text-left transition-all cursor-pointer hover:bg-slate-900/90 group flex flex-col justify-between space-y-2"
                >
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400/80 bg-amber-500/10 px-2 py-0.5 rounded-full">
                      {link.category}
                    </span>
                    <div className="font-serif font-bold text-amber-200 text-sm group-hover:text-amber-300 line-clamp-1">
                      {link.title}
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-2">
                      {link.description}
                    </p>
                  </div>
                  <div className="text-[11px] font-bold text-amber-400 flex items-center gap-1 pt-1">
                    <span>Read Guide</span>
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* AI CALL TO ACTION CARD */}
          <div className="p-8 rounded-3xl bg-gradient-to-r from-amber-950 via-slate-900 to-indigo-950 border-2 border-amber-500/50 shadow-2xl text-center space-y-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">
              <Sparkles className="w-3.5 h-3.5" /> Vedanga AI Direct Consultation
            </div>
            <h3 className="font-serif text-2xl md:text-3xl font-extrabold text-amber-100">
              Want Exact Guidance for YOUR Birth Chart?
            </h3>
            <p className="text-slate-300 text-sm md:text-base max-w-xl mx-auto">
              Ask Guru Chat to analyze your specific birth details, active Vimshottari Dasha, and transit alignments in real time.
            </p>
            <button
              onClick={() => {
                localStorage.setItem("vedanga_chat_prefill", page.ctaPrompt);
                window.location.hash = "#chat";
              }}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 font-extrabold text-base transition-all hover:scale-105 shadow-xl shadow-amber-500/30 flex items-center gap-2 mx-auto cursor-pointer"
            >
              <MessageSquare className="w-5 h-5 fill-slate-950" />
              <span>Ask Vedanga AI about YOUR Birth Chart →</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Full-Page Dedicated Post Reader View (Isolated Complete View)
  if (selectedArticleModal) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-28 animate-fade-in">
        {/* Sticky Header with Back Button & Controls */}
        <div className="sticky top-0 z-30 bg-slate-900/95 backdrop-blur-md border-b border-amber-500/30 px-4 md:px-8 py-3.5 flex items-center justify-between shadow-2xl">
          <button
            onClick={() => {
              setSelectedArticleModal(null);
              if (isSpeaking) {
                window.speechSynthesis?.cancel();
                setIsSpeaking(false);
              }
              window.scrollTo({ top: 0, behavior: "instant" });
            }}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs transition-all cursor-pointer flex items-center gap-2 shadow-lg shadow-amber-500/20"
          >
            <X className="w-4 h-4" />
            <span>← Back to All Posts</span>
          </button>

          <div className="flex items-center gap-2">
            {/* Audio Button */}
            <button
              onClick={() => handleToggleSpeech(selectedArticleModal.content)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all cursor-pointer ${
                isSpeaking
                  ? "bg-amber-500 text-slate-950 border-amber-400 font-bold animate-pulse"
                  : "bg-slate-950 text-amber-300 border-amber-500/30 hover:border-amber-400"
              }`}
              title="Listen to Post Audio"
            >
              <Volume2 className="w-4 h-4" />
              <span className="hidden sm:inline">{isSpeaking ? "Pause Audio" : "Listen (Audio)"}</span>
            </button>

            {/* Font Size Selector */}
            <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
              <button
                onClick={() => setReaderFontSize("sm")}
                className={`px-2.5 py-1 rounded-lg ${readerFontSize === "sm" ? "bg-amber-500 text-slate-950 font-bold" : "text-slate-400"}`}
              >
                A-
              </button>
              <button
                onClick={() => setReaderFontSize("base")}
                className={`px-2.5 py-1 rounded-lg ${readerFontSize === "base" ? "bg-amber-500 text-slate-950 font-bold" : "text-slate-400"}`}
              >
                A
              </button>
              <button
                onClick={() => setReaderFontSize("lg")}
                className={`px-2.5 py-1 rounded-lg ${readerFontSize === "lg" ? "bg-amber-500 text-slate-950 font-bold" : "text-slate-400"}`}
              >
                A+
              </button>
            </div>

            {/* Bookmark Button */}
            <button
              onClick={() => toggleBookmark(selectedArticleModal.id)}
              className={`p-2.5 rounded-xl text-xs font-bold flex items-center gap-2 border transition-all cursor-pointer ${
                bookmarkedItems.includes(selectedArticleModal.id)
                  ? "bg-amber-500 text-slate-950 border-amber-400"
                  : "bg-slate-950 text-slate-300 border-slate-800 hover:border-amber-500/40"
              }`}
              title="Bookmark Post"
            >
              <Bookmark className={`w-4 h-4 ${bookmarkedItems.includes(selectedArticleModal.id) ? "fill-slate-950" : ""}`} />
            </button>
          </div>
        </div>

        {/* Dedicated Single Article Page Content */}
        <div className="max-w-4xl mx-auto px-4 md:px-8 py-6 md:py-10">
          <div className="bg-slate-900/90 border border-amber-500/30 p-6 md:p-12 rounded-3xl shadow-2xl space-y-8">
            {/* Header Metadata */}
            <div className="space-y-4 border-b border-slate-800 pb-6">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30 px-3 py-1 rounded-full">
                  {selectedArticleModal.category}
                </span>
                <span className="text-xs text-amber-400 font-mono flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> {selectedArticleModal.readTime || "7 min read"}
                </span>
              </div>

              <h1 className="font-serif text-3xl md:text-5xl font-extrabold text-amber-100 leading-tight">
                {selectedArticleModal.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-xs md:text-sm text-slate-400 font-mono pt-2">
                <span>Author: <strong className="text-amber-200">{selectedArticleModal.author || "Acharya Vedanga"}</strong></span>
                <span>•</span>
                <span>Published: {selectedArticleModal.updatedAt || "Today"}</span>
                <span>•</span>
                <span className="text-amber-300 font-bold">
                  {selectedArticleModal.content ? selectedArticleModal.content.split(/\s+/).length : 600} Words
                </span>
              </div>
            </div>

            {/* Formatted Article Content Body */}
            <div
              className={`space-y-6 leading-relaxed font-sans text-slate-200 ${
                readerFontSize === "sm" ? "text-sm md:text-base" : readerFontSize === "lg" ? "text-lg md:text-xl" : "text-base md:text-lg"
              }`}
            >
              {(selectedArticleModal.content || "").split("\n\n").map((paragraph: string, idx: number) => {
                const trimmed = paragraph.trim();
                if (trimmed.startsWith("###")) {
                  return (
                    <div key={idx} className="pt-6 pb-2 border-b border-amber-500/30">
                      <h3 className="font-serif text-xl md:text-2xl font-bold text-amber-300 flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-amber-400 shrink-0" />
                        {trimmed.replace(/^###\s*/, "")}
                      </h3>
                    </div>
                  );
                }
                if (trimmed.startsWith("---")) {
                  return <hr key={idx} className="border-amber-500/20 my-6" />;
                }
                if (trimmed.startsWith("- ") || trimmed.startsWith("1.") || trimmed.startsWith("2.") || trimmed.startsWith("3.")) {
                  return (
                    <ul key={idx} className="space-y-3 bg-slate-950/80 p-6 rounded-2xl border border-slate-800 text-slate-300 my-4">
                      {trimmed.split("\n").map((line, lIdx) => (
                        <li key={lIdx} className="flex items-start gap-3">
                          <span className="text-amber-400 font-bold shrink-0 mt-0.5">•</span>
                          <span>{line.replace(/^[-*1234567890.]\s*/, "").replace(/\*\*(.*?)\*\*/g, "$1")}</span>
                        </li>
                      ))}
                    </ul>
                  );
                }
                return (
                  <p key={idx} className="text-slate-300 leading-relaxed font-normal">
                    {trimmed.split(/(\*\*.*?\*\*)/).map((part, pIdx) => {
                      if (part.startsWith("**") && part.endsWith("**")) {
                        return (
                          <strong key={pIdx} className="text-amber-200 font-semibold">
                            {part.slice(2, -2)}
                          </strong>
                        );
                      }
                      return part;
                    })}
                  </p>
                );
              })}
            </div>

            {/* Bottom Actions */}
            <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={() => toggleBookmark(selectedArticleModal.id)}
                  className={`flex-1 sm:flex-none px-5 py-3 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                    bookmarkedItems.includes(selectedArticleModal.id)
                      ? "bg-amber-500 text-slate-950 border-amber-400"
                      : "bg-slate-950 text-slate-300 border-slate-800 hover:border-amber-500/40"
                  }`}
                >
                  <Bookmark className="w-4 h-4" />
                  <span>{bookmarkedItems.includes(selectedArticleModal.id) ? "Saved in Bookmarks" : "Save Article"}</span>
                </button>

                <button
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    setCopiedToast(true);
                    setTimeout(() => setCopiedToast(false), 3000);
                  }}
                  className="flex-1 sm:flex-none px-5 py-3 bg-slate-950 text-slate-300 border border-slate-800 hover:border-amber-500/40 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Share2 className="w-4 h-4 text-amber-400" />
                  <span>{copiedToast ? "Copied Link!" : "Share Post"}</span>
                </button>
              </div>

              <button
                onClick={() => {
                  setSelectedArticleModal(null);
                  if (isSpeaking) {
                    window.speechSynthesis?.cancel();
                    setIsSpeaking(false);
                  }
                }}
                className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-extrabold rounded-2xl text-xs transition-all cursor-pointer shadow-xl shadow-amber-500/20"
              >
                ← Return to All Posts
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6 pb-24">
      {/* Top Banner Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-950/60 via-slate-900 to-indigo-950/60 border border-amber-500/30 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5" /> Vedanga Learning Academy
              </span>
            </div>
            <h1 className="font-serif text-2xl md:text-3xl font-bold text-amber-100 tracking-wide">
              Vedic Astrology & Wisdom Portal
            </h1>
            <p className="text-xs md:text-sm text-slate-300 mt-1 max-w-xl">
              Daily authentic Jyotish lessons, planetary profiles, Nakshatra wisdom, Yogas, Guru teachings, and sacred Puranic stories.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-950/80 p-2 rounded-2xl border border-amber-500/20 text-xs text-amber-300 font-mono">
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span>Daily Dose of Sattva</span>
          </div>
        </div>

        {/* Navigation Section Pills */}
        <div className="flex gap-2 overflow-x-auto pt-5 scrollbar-none">
          {[
            { id: "trending", label: "🔥 Daily Auto-Posts & Trending Topics", icon: Flame },
            { id: "lesson", label: "Daily Lesson", icon: BookOpen },
            { id: "planet", label: "Planet of the Day", icon: Sun },
            { id: "nakshatra", label: "Nakshatra Wisdom", icon: Moon },
            { id: "yoga", label: "Yoga Explained", icon: Award },
            { id: "guru", label: "Guru Wisdom", icon: Quote },
            { id: "story", label: "Vedic Story", icon: Scroll },
          ].map((item) => {
            const Icon = item.icon;
            const active = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id as LearningSection)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-semibold whitespace-nowrap cursor-pointer transition-all ${
                  active
                    ? "bg-amber-500 text-slate-950 font-bold shadow-lg shadow-amber-500/20 scale-[1.02]"
                    : "bg-slate-950/80 border border-slate-800 text-slate-300 hover:text-amber-200 hover:border-amber-500/30"
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? "text-slate-950" : "text-amber-400"}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* SECTION 0: DAILY TRENDING TOPICS & AUTOMATED POSTS */}
      {activeSection === "trending" && (
        <div className="space-y-6 animate-fade-in">
          {/* Automated Publishing Status Banner */}
          <div className="p-4 bg-gradient-to-r from-amber-950/60 via-purple-950/60 to-slate-900 border border-amber-500/40 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="flex h-2.5 w-2.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
                </span>
                <span className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-400" /> Daily Vedic Research & Insights Active
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Updated daily with classical Parashari analysis on Panchang, Sade Sati, planetary transits, Vrats, and authentic Vedic remedies based on sidereal astronomical calculations.
              </p>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400 bg-slate-950/80 px-3 py-1.5 rounded-2xl border border-slate-800 shrink-0">
              <Clock className="w-3.5 h-3.5 text-amber-400" /> Next Post: Daily at 00:00 UTC
            </div>
          </div>

          {/* Daily Trending Search Topics Carousel */}
          {trendingTopicsList.length > 0 && (
            <div className="space-y-2">
              <span className="text-xs font-bold text-amber-200/90 flex items-center gap-1.5 uppercase tracking-wider">
                <TrendingUp className="w-4 h-4 text-amber-400" /> Daily Top Searched Jyotish Topics
              </span>
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                {trendingTopicsList.map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-950/80 border border-slate-800 hover:border-amber-500/40 p-2.5 rounded-2xl text-xs whitespace-nowrap flex items-center gap-2 transition-all cursor-default"
                  >
                    <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                      #{idx + 1} Trending
                    </span>
                    <span className="text-slate-200 font-medium">{item.topic}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Search & Category Filter with Smart SEO Suggestions */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-amber-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search 10,000+ topics (e.g. Saturn Venus, Sun 3rd House)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-950 border border-amber-500/30 focus:border-amber-400 rounded-2xl pl-9 pr-8 py-2.5 text-xs text-slate-100 placeholder-slate-500 outline-none shadow-lg"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-3 text-slate-500 hover:text-amber-400 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto scrollbar-none">
                {["All", "Panchang", "Transits", "Dasha", "Remedies", "Fasting", "Matching", "Gemstones"].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setArticleCategory(cat)}
                    className={`px-3 py-1.5 rounded-xl text-[11px] font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      articleCategory === cat
                        ? "bg-amber-500 text-slate-950 font-bold"
                        : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Smart SEO Real-Time Search Results Grid */}
            {searchQuery.trim().length >= 2 && (
              <div className="p-4 bg-slate-900/95 border border-amber-500/40 rounded-3xl space-y-3 shadow-2xl">
                <div className="flex items-center justify-between text-xs text-amber-300 font-bold border-b border-slate-800 pb-2">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    Instant Knowledge Base Results for "{searchQuery}"
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">Live Index</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 max-h-80 overflow-y-auto pr-1">
                  {searchSeoTopics(searchQuery).map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setSelectedProgrammaticSlug(item.slug);
                        setSearchQuery("");
                      }}
                      className="p-3 bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-amber-500/50 rounded-2xl text-left transition-all cursor-pointer group flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between text-[10px] text-amber-400 font-bold uppercase mb-0.5">
                          <span>{item.category}</span>
                          <span className="text-slate-500 font-mono">{item.type}</span>
                        </div>
                        <div className="font-serif font-bold text-amber-100 text-xs md:text-sm group-hover:text-amber-300">
                          {item.title}
                        </div>
                        <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                          {item.snippet}
                        </p>
                      </div>
                      <div className="text-[10px] font-bold text-amber-400 flex items-center gap-1 mt-2">
                        <span>Open Astrological Guide →</span>
                      </div>
                    </button>
                  ))}
                  {searchSeoTopics(searchQuery).length === 0 && (
                    <div className="col-span-2 text-center py-6 text-xs text-slate-400">
                      No exact match found. Try searching for "Saturn", "Venus", "3rd House", "Mahadasha", "Nakshatra", "AI Kundli", etc.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Articles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {cmsArticles
              .filter((art) => {
                const matchesCat = articleCategory === "All" || art.category === articleCategory;
                const matchesSearch =
                  !searchQuery ||
                  art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  art.content.toLowerCase().includes(searchQuery.toLowerCase());
                return matchesCat && matchesSearch;
              })
              .map((art) => {
                const isBookmarked = bookmarkedItems.includes(art.id);
                const wordCount = art.content ? art.content.split(/\s+/).length : 500;
                return (
                  <div
                    key={art.id}
                    onClick={() => setSelectedArticleModal(art)}
                    className="p-5 rounded-3xl bg-slate-900/90 border border-amber-500/30 hover:border-amber-500/60 transition-all flex flex-col justify-between space-y-4 shadow-xl group hover:shadow-amber-500/10 cursor-pointer"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase">
                            {art.category}
                          </span>
                          {art.isAutoGenerated && (
                            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 uppercase flex items-center gap-1">
                              <Sparkles className="w-3 h-3 text-purple-300" /> Daily Auto-Post
                            </span>
                          )}
                          <span className="text-[10px] font-mono text-amber-400 bg-slate-950 px-2 py-0.5 rounded-full border border-slate-800">
                            {wordCount} Words
                          </span>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleBookmark(art.id);
                          }}
                          className="text-slate-500 hover:text-amber-400 transition-colors p-1 cursor-pointer"
                          title="Bookmark Article"
                        >
                          <Bookmark
                            className={`w-4 h-4 ${isBookmarked ? "text-amber-400 fill-amber-400" : ""}`}
                          />
                        </button>
                      </div>

                      <h3 className="font-serif text-base md:text-lg font-bold text-amber-100 group-hover:text-amber-300 transition-colors leading-snug">
                        {art.title}
                      </h3>

                      <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                        {art.content.replace(/[#*`]/g, "")}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-slate-300">{art.author || "Vedanga AI"}</span>
                        <span>•</span>
                        <span className="text-amber-400 font-semibold">{art.readTime || "7 min read"}</span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedArticleModal(art);
                        }}
                        className="px-3.5 py-1.5 rounded-xl bg-amber-500/10 group-hover:bg-amber-500 text-amber-300 group-hover:text-slate-950 border border-amber-500/30 font-bold transition-all flex items-center gap-1 cursor-pointer"
                      >
                        <span>Read Post</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* SECTION 1: DAILY JYOTISH LESSON */}
      {activeSection === "lesson" && (
        <div className="space-y-6">
          {/* Lesson selector tabs */}
          <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 scrollbar-none">
            {jyotishLessons.map((l, idx) => (
              <button
                key={l.id}
                onClick={() => {
                  setLessonIdx(idx);
                  setQuizAnswered(null);
                }}
                className={`flex-1 min-w-[200px] p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                  lessonIdx === idx
                    ? "bg-amber-500/15 border-amber-500/50 text-amber-200 shadow-md"
                    : "bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200"
                }`}
              >
                <div className="text-[10px] uppercase font-mono text-amber-400 mb-0.5">Lesson {idx + 1} • {l.level}</div>
                <div className="text-xs font-bold line-clamp-1">{l.title}</div>
              </button>
            ))}
          </div>

          {/* Lesson Main Card */}
          <div className="p-6 rounded-3xl bg-slate-900/90 border border-amber-500/30 space-y-6 shadow-xl">
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    {currentLesson.category}
                  </span>
                  <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                    <BookMarked className="w-3.5 h-3.5 text-amber-400" /> {currentLesson.readTime}
                  </span>
                </div>
                <h2 className="font-serif text-xl font-bold text-amber-100">
                  {currentLesson.title}
                </h2>
                <p className="text-xs text-slate-300 mt-1">
                  {currentLesson.summary}
                </p>
              </div>

              <button
                onClick={() => toggleBookmark(currentLesson.id)}
                className={`p-2.5 rounded-2xl border transition-all cursor-pointer ${
                  bookmarkedItems.includes(currentLesson.id)
                    ? "bg-amber-500/20 border-amber-500 text-amber-300"
                    : "bg-slate-950 border-slate-800 text-slate-400 hover:text-amber-300"
                }`}
                title="Bookmark Lesson"
              >
                <Bookmark className={`w-5 h-5 ${bookmarkedItems.includes(currentLesson.id) ? "fill-amber-400 text-amber-400" : ""}`} />
              </button>
            </div>

            {/* Core Principle */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-amber-500/20 space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-amber-400" /> Core Principle
              </h3>
              <p className="text-xs md:text-sm text-slate-200 leading-relaxed font-sans">
                {currentLesson.coreConcept}
              </p>
            </div>

            {/* Mechanics Breakdown */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-sky-400 flex items-center gap-2">
                <Compass className="w-4 h-4 text-sky-400" /> Astrological Mechanics
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {currentLesson.mechanics.map((m, mIdx) => (
                  <div key={mIdx} className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex items-start gap-2.5 text-xs text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>{m}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Golden Rule */}
            <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/30 flex items-start gap-3">
              <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-amber-400 block tracking-wider">
                  Parashari Golden Rule
                </span>
                <p className="text-xs md:text-sm font-semibold text-amber-100 mt-0.5 leading-relaxed">
                  "{currentLesson.goldenRule}"
                </p>
              </div>
            </div>

            {/* Real Chart Example */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1.5">
              <div className="text-xs font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-2">
                <Award className="w-4 h-4 text-indigo-400" /> Real Chart Application
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {currentLesson.example}
              </p>
            </div>

            {/* Interactive Self-Check Quiz */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-amber-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase text-amber-300 tracking-wider flex items-center gap-2">
                  <Flame className="w-4 h-4 text-amber-400" /> Quick Knowledge Check
                </h4>
                <span className="text-[10px] font-mono text-slate-400">Interactive Quiz</span>
              </div>
              <p className="text-xs font-semibold text-slate-200">
                {currentLesson.quiz.question}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                {currentLesson.quiz.options.map((opt, oIdx) => {
                  const isSelected = quizAnswered === oIdx;
                  const isCorrect = oIdx === currentLesson.quiz.correct;

                  let btnStyle = "bg-slate-900 border-slate-800 text-slate-300 hover:border-amber-500/40";
                  if (quizAnswered !== null) {
                    if (isCorrect) {
                      btnStyle = "bg-emerald-950/80 border-emerald-500 text-emerald-200 font-bold";
                    } else if (isSelected) {
                      btnStyle = "bg-rose-950/80 border-rose-500 text-rose-200 font-bold";
                    }
                  }

                  return (
                    <button
                      key={oIdx}
                      onClick={() => setQuizAnswered(oIdx)}
                      className={`p-3 rounded-xl border text-xs text-left transition-all cursor-pointer ${btnStyle}`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>

              {quizAnswered !== null && (
                <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-300 space-y-1">
                  <span className="font-bold text-amber-300">
                    {quizAnswered === currentLesson.quiz.correct ? "✓ Correct!" : "✕ Not quite!"}
                  </span>
                  <p>{currentLesson.quiz.explanation}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: PLANET OF THE DAY */}
      {activeSection === "planet" && (
        <div className="space-y-6">
          {/* Planet Selector Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {grahas.map((g, idx) => (
              <button
                key={g.name}
                onClick={() => setSelectedPlanetIdx(idx)}
                className={`px-3.5 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap cursor-pointer transition-all ${
                  selectedPlanetIdx === idx
                    ? "bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20"
                    : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200"
                }`}
              >
                {g.name}
              </button>
            ))}
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/90 border border-amber-500/30 space-y-6 shadow-xl">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-300 flex items-center justify-center font-serif text-2xl font-bold">
                  {currentPlanet.sanskrit[0]}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-serif text-xl font-bold text-amber-100">
                      {currentPlanet.name}
                    </h2>
                    <span className="text-sm font-serif text-amber-400">
                      ({currentPlanet.sanskrit})
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 font-medium">
                    {currentPlanet.title}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 text-[11px] font-mono">
                <span className="bg-slate-950 px-3 py-1 rounded-xl border border-slate-800 text-amber-300">
                  Day: {currentPlanet.day}
                </span>
                <span className="bg-slate-950 px-3 py-1 rounded-xl border border-slate-800 text-sky-300">
                  Tattva: {currentPlanet.element}
                </span>
              </div>
            </div>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Rashi Ruler</span>
                <span className="text-xs font-bold text-amber-200">{currentPlanet.rashiRuler}</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Exaltation Sign</span>
                <span className="text-xs font-bold text-emerald-300">{currentPlanet.exalted}</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Debilitation Sign</span>
                <span className="text-xs font-bold text-rose-300">{currentPlanet.debilitated}</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Gemstone</span>
                <span className="text-xs font-bold text-indigo-300">{currentPlanet.gemstone}</span>
              </div>
            </div>

            {/* Karaka Significations */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-amber-500/20 space-y-1.5">
              <h3 className="text-xs font-bold uppercase text-amber-300 tracking-wider flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-400" /> Primary Karakas (Natural Significations)
              </h3>
              <p className="text-xs text-slate-200 leading-relaxed font-sans">
                {currentPlanet.karakaFor}
              </p>
            </div>

            {/* Personality & Energetic Traits */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1.5">
              <h3 className="text-xs font-bold uppercase text-sky-300 tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-sky-400" /> Psychological & Energetic Qualities
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {currentPlanet.traits}
              </p>
            </div>

            {/* Sacred Remedy */}
            <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/30 flex items-start gap-3">
              <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 shrink-0">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-amber-400 block tracking-wider">
                  Harmonizing Remedial Practice
                </span>
                <p className="text-xs md:text-sm font-semibold text-amber-100 mt-0.5 leading-relaxed">
                  {currentPlanet.remedy}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: NAKSHATRA WISDOM */}
      {activeSection === "nakshatra" && (
        <div className="space-y-6">
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {nakshatras.map((n, idx) => (
              <button
                key={n.name}
                onClick={() => setSelectedNakshatraIdx(idx)}
                className={`px-3.5 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap cursor-pointer transition-all ${
                  selectedNakshatraIdx === idx
                    ? "bg-amber-500 text-slate-950 font-bold shadow-md"
                    : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200"
                }`}
              >
                {n.name}
              </button>
            ))}
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/90 border border-amber-500/30 space-y-6 shadow-xl">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-serif text-2xl font-bold text-amber-100">
                    {currentNakshatra.name} Nakshatra
                  </h2>
                  <span className="text-base font-serif text-amber-400">
                    ({currentNakshatra.sanskrit})
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  Symbol: {currentNakshatra.symbol}
                </p>
              </div>

              <div className="flex gap-2 text-[11px] font-mono">
                <span className="bg-slate-950 px-3 py-1 rounded-xl border border-slate-800 text-amber-300">
                  Deity: {currentNakshatra.deity}
                </span>
                <span className="bg-slate-950 px-3 py-1 rounded-xl border border-slate-800 text-purple-300">
                  Ruler: {currentNakshatra.ruler}
                </span>
              </div>
            </div>

            {/* Shakti Power */}
            <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/30 flex items-start gap-3">
              <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-amber-400 block tracking-wider">
                  Nakshatra Shakti (Inherent Power)
                </span>
                <p className="text-xs md:text-sm font-bold text-amber-100 mt-0.5">
                  {currentNakshatra.shakti}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1.5">
                <h3 className="text-xs font-bold uppercase text-emerald-400 tracking-wider flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Prominent Strengths
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {currentNakshatra.traits}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1.5">
                <h3 className="text-xs font-bold uppercase text-amber-400 tracking-wider flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-amber-400" /> Shadow Side & Lessons
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {currentNakshatra.shadow}
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
              <h3 className="text-xs font-bold uppercase text-sky-300 tracking-wider flex items-center gap-2">
                <Sun className="w-4 h-4 text-sky-400" /> Ideal Auspicious Activities (Muhurta)
              </h3>
              <p className="text-xs text-slate-200 leading-relaxed">
                {currentNakshatra.auspiciousFor}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 4: YOGA EXPLAINED */}
      {activeSection === "yoga" && (
        <div className="space-y-6">
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {yogas.map((y, idx) => (
              <button
                key={y.name}
                onClick={() => setSelectedYogaIdx(idx)}
                className={`px-3.5 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap cursor-pointer transition-all ${
                  selectedYogaIdx === idx
                    ? "bg-amber-500 text-slate-950 font-bold shadow-md"
                    : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200"
                }`}
              >
                {y.name}
              </button>
            ))}
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/90 border border-amber-500/30 space-y-6 shadow-xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {currentYoga.category}
                </span>
                <div className="flex items-center gap-2 mt-1">
                  <h2 className="font-serif text-2xl font-bold text-amber-100">
                    {currentYoga.name}
                  </h2>
                  <span className="text-base font-serif text-amber-400">
                    ({currentYoga.sanskrit})
                  </span>
                </div>
              </div>
            </div>

            {/* Formation Formula */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-amber-500/20 space-y-1">
              <h3 className="text-xs font-bold uppercase text-amber-300 tracking-wider flex items-center gap-2">
                <Compass className="w-4 h-4 text-amber-400" /> Astrological Formula
              </h3>
              <p className="text-xs font-mono text-slate-200 leading-relaxed">
                {currentYoga.formula}
              </p>
            </div>

            {/* Deep Meaning */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
              <h3 className="text-xs font-bold uppercase text-sky-300 tracking-wider flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-sky-400" /> Esoteric Symbolism
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                {currentYoga.meaning}
              </p>
            </div>

            {/* Real World Manifestations */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase text-emerald-400 tracking-wider flex items-center gap-2">
                <Award className="w-4 h-4 text-emerald-400" /> Key Benefits & Results
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                {currentYoga.results.map((res, rIdx) => (
                  <div key={rIdx} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-start gap-2.5 text-xs text-slate-300">
                    <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>{res}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Cancellation Conditions */}
            <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-500/30 space-y-1">
              <h3 className="text-xs font-bold uppercase text-rose-300 tracking-wider flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-rose-400" /> Cancellation or Weakening Factors (Bhanga)
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {currentYoga.cancellation}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 5: GURU WISDOM */}
      {activeSection === "guru" && (
        <div className="p-6 rounded-3xl bg-slate-900/90 border border-amber-500/30 space-y-6 shadow-xl">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
            <div className="p-3 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-300">
              <Quote className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 font-mono">
                Rishi Teaching of the Day
              </span>
              <h2 className="font-serif text-2xl font-bold text-amber-100">
                {currentGuru.author}
              </h2>
            </div>
          </div>

          {/* Sanskrit Verse */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-amber-500/30 space-y-2 text-center">
            <span className="text-[10px] uppercase font-bold text-amber-400 tracking-widest block font-mono">
              Sacred Sanskrit Sutra
            </span>
            <p className="font-serif text-base md:text-lg text-amber-200 font-bold leading-relaxed">
              "{currentGuru.sutra}"
            </p>
            <p className="text-xs text-slate-300 italic pt-2 border-t border-slate-800/80 max-w-xl mx-auto">
              "{currentGuru.translation}"
            </p>
          </div>

          {/* Commentary */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1.5">
            <h3 className="text-xs font-bold uppercase text-sky-300 tracking-wider flex items-center gap-2">
              <Feather className="w-4 h-4 text-sky-400" /> Spiritual Commentary
            </h3>
            <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
              {currentGuru.commentary}
            </p>
          </div>

          {/* Daily Contemplation */}
          <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/30 flex items-start gap-3">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 shrink-0">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-amber-400 block tracking-wider">
                Daily Contemplative Practice
              </span>
              <p className="text-xs md:text-sm font-semibold text-amber-100 mt-0.5 leading-relaxed">
                {currentGuru.practice}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 6: VEDIC STORY */}
      {activeSection === "story" && (
        <div className="space-y-6">
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {vedicStories.map((s, idx) => (
              <button
                key={s.title}
                onClick={() => setSelectedStoryIdx(idx)}
                className={`px-3.5 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap cursor-pointer transition-all ${
                  selectedStoryIdx === idx
                    ? "bg-amber-500 text-slate-950 font-bold shadow-md"
                    : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200"
                }`}
              >
                Story {idx + 1}: {s.title.split("&")[0]}
              </button>
            ))}
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/90 border border-amber-500/30 space-y-6 shadow-xl">
            <div className="pb-4 border-b border-slate-800">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Source: {currentStory.source}
              </span>
              <h2 className="font-serif text-2xl font-bold text-amber-100 mt-2">
                {currentStory.title}
              </h2>
            </div>

            {/* Moral Card */}
            <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/30 flex items-start gap-3">
              <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 shrink-0">
                <Lightbulb className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-amber-400 block tracking-wider">
                  Core Spiritual Moral
                </span>
                <p className="text-xs md:text-sm font-bold text-amber-100 mt-0.5">
                  "{currentStory.moral}"
                </p>
              </div>
            </div>

            {/* Narrative Content */}
            <div className="space-y-3 text-xs md:text-sm text-slate-300 leading-relaxed bg-slate-950/80 p-5 rounded-2xl border border-slate-800">
              <p className="font-semibold text-amber-200">{currentStory.summary}</p>
              <div className="whitespace-pre-line text-slate-300 font-sans">
                {currentStory.fullStory}
              </div>
            </div>

            {/* Astrological Takeaway */}
            <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 space-y-1">
              <h3 className="text-xs font-bold uppercase text-indigo-300 tracking-wider flex items-center gap-2">
                <Compass className="w-4 h-4 text-indigo-400" /> Astrological Application in Your Chart
              </h3>
              <p className="text-xs text-indigo-100 leading-relaxed font-medium">
                {currentStory.astrologicalSignificance}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* PERSISTENT KNOWLEDGE HUB DIRECTORY FOOTER */}
      <div className="p-6 md:p-8 rounded-3xl bg-slate-900/90 border border-amber-500/30 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5 font-mono">
            <Compass className="w-4 h-4" /> Vedic Knowledge Hub Directory
          </span>
          <span className="text-[10px] text-slate-400 font-mono">10,000+ Parashari Pages</span>
        </div>

        <div className="flex flex-wrap gap-2 pt-1">
          {[
            { label: "Saturn in 3rd House", slug: "saturn-in-3rd-house" },
            { label: "Venus in Pisces Exaltation", slug: "venus-in-pisces" },
            { label: "Sun Antardasha Analysis", slug: "sun-antardasha" },
            { label: "Rahu Mahadasha Guide", slug: "rahu-mahadasha" },
            { label: "Aquarius Ascendant Blueprint", slug: "aquarius-ascendant" },
            { label: "Punarvasu Nakshatra Wisdom", slug: "punarvasu-nakshatra" },
            { label: "Free AI Kundli Generator", slug: "ai-kundli" },
            { label: "AI Marriage Compatibility & Gun Milan", slug: "marriage-prediction" },
            { label: "Vimshottari Dasha Calculator", slug: "dasha-analysis" },
            { label: "Career & 10th House Predictor", slug: "career-prediction" },
            { label: "Today's AI Horoscope Forecast", slug: "ai-horoscope" },
            { label: "Janma Nakshatra Calculator", slug: "nakshatra-calculator" }
          ].map((item, idx) => (
            <button
              key={idx}
              onClick={() => {
                setSelectedProgrammaticSlug(item.slug);
                window.scrollTo({ top: 0, behavior: "instant" });
              }}
              className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-amber-500/50 text-xs text-amber-200/90 hover:text-amber-300 font-medium transition-all cursor-pointer hover:bg-slate-900 flex items-center gap-1"
            >
              <span>{item.label}</span>
              <ChevronRight className="w-3 h-3 text-amber-400" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
