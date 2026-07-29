import React, { useState } from "react";
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
  BookMarked
} from "lucide-react";
import { UserProfile } from "../types";

interface LearningViewProps {
  user: UserProfile;
}

type LearningSection =
  | "lesson"
  | "planet"
  | "nakshatra"
  | "yoga"
  | "guru"
  | "story";

export const LearningView: React.FC<LearningViewProps> = ({ user }) => {
  const [activeSection, setActiveSection] = useState<LearningSection>("lesson");
  const [bookmarkedItems, setBookmarkedItems] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("vedanga_bookmarks");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

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
    </div>
  );
};
