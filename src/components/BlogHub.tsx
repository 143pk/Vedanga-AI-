import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  BookOpen,
  Sparkles,
  Search,
  Bookmark,
  BookMarked,
  Clock,
  User,
  Share2,
  Volume2,
  ChevronRight,
  X,
  Flame,
  Star,
  Sun,
  Moon,
  Compass,
  Feather,
  HelpCircle,
  Check,
  CheckCircle2,
  Zap,
  Calendar,
  ArrowLeft,
  Lightbulb,
  VolumeX,
  Copy,
  Tag,
  Filter,
  TrendingUp,
  MessageSquare
} from "lucide-react";
import { getProgrammaticPage, ProgrammaticPageData } from "../seo/programmaticEngine";
import { searchSeoTopics, SearchResultItem } from "../seo/seoSearch";
import { PLANETS, HOUSES, SIGNS, NAKSHATRAS, HIGH_INTENT_LANDINGS } from "../seo/astrologyData";

export interface BlogArticleItem {
  id: string;
  slug: string;
  title: string;
  category: "Planets" | "Houses" | "Rashis" | "Nakshatras" | "Kundli Guides" | "Yogas & Remedies";
  readTime: string;
  publishedAt: string;
  author: string;
  excerpt: string;
  featured?: boolean;
  tags: string[];
}

// Pre-compiled list of 30+ core blog post articles across categories
const FEATURED_BLOG_POSTS: BlogArticleItem[] = [
  {
    id: "post_sun_10th",
    slug: "sun-in-10th-house",
    title: "Sun in the 10th House: The Throne of Digbala, Fame & Divine Leadership",
    category: "Houses",
    readTime: "6 min read",
    publishedAt: "Aug 1, 2026",
    author: "Vedanga Research Team",
    featured: true,
    excerpt: "When Surya Dev occupies the 10th house of Karma Bhava, it gains directional strength (Digbala). Discover how this placement creates regal career authority, political power, and enduring legacy.",
    tags: ["Sun", "10th House", "Digbala", "Career", "Karma Bhava"]
  },
  {
    id: "post_dasha_guide",
    slug: "vimshottari-dasha-explained",
    title: "Vimshottari Dasha Unlocked: How 120-Year Planetary Cycles Shape Destiny",
    category: "Kundli Guides",
    readTime: "8 min read",
    publishedAt: "Jul 28, 2026",
    author: "Acharya Vedanga",
    featured: true,
    excerpt: "Your birth Moon Nakshatra initiates the Vimshottari Dasha cycle. Learn how Mahadasha and Antardasha sub-periods govern health, wealth, relationships, and spiritual awakening.",
    tags: ["Vimshottari Dasha", "Moon Nakshatra", "Timing of Events", "Astrology Basics"]
  },
  {
    id: "post_jupiter_9th",
    slug: "jupiter-in-9th-house",
    title: "Jupiter in 9th House: Bhagya Bhava, Guru's Grace & Divine Luck",
    category: "Planets",
    readTime: "5 min read",
    publishedAt: "Jul 25, 2026",
    author: "Vedanga Research Team",
    excerpt: "Brihaspati (Jupiter) in its own Karaka house grants profound higher wisdom, moral righteousness, fortune in foreign lands, and spiritual illumination.",
    tags: ["Jupiter", "9th House", "Bhagya", "Guru Grace", "Dharma"]
  },
  {
    id: "post_sadesati_remedies",
    slug: "saturn-sade-sati-survival-guide",
    title: "Saturn Sade Sati: The 7.5 Year Transmutation & Effective Vedic Remedies",
    category: "Yogas & Remedies",
    readTime: "7 min read",
    publishedAt: "Jul 20, 2026",
    author: "Acharya Vedanga",
    excerpt: "Sade Sati is not a curse, but a sacred crucible of spiritual discipline. Explore Hanuman Chalisa recitations, Shani Beej Mantra, and sesame oil lamp rituals.",
    tags: ["Saturn", "Sade Sati", "Remedies", "Shani Dev", "Transits"]
  },
  {
    id: "post_gajakesari_yoga",
    slug: "gajakesari-yoga-kundli",
    title: "Gaja Kesari Yoga: The Elephant-Lion Alignment of Royalty & Eternal Wisdom",
    category: "Yogas & Remedies",
    readTime: "6 min read",
    publishedAt: "Jul 15, 2026",
    author: "Vedanga Research Team",
    excerpt: "Formed when Jupiter is in a Kendra (1st, 4th, 7th, 10th) from the Moon, Gaja Kesari Yoga grants formidable intellect, wealth, and lasting social respect.",
    tags: ["Gaja Kesari Yoga", "Jupiter Moon", "Raja Yoga", "Wealth"]
  },
  {
    id: "post_rahu_ketu_axis",
    slug: "rahu-ketu-karmic-axis",
    title: "Rahu & Ketu: Decoding Your Past Life Karma & Obsessive Life Quest",
    category: "Planets",
    readTime: "7 min read",
    publishedAt: "Jul 10, 2026",
    author: "Acharya Vedanga",
    excerpt: "Ketu represents your mastered past-life abilities and detachment, while Rahu shows where your soul must venture in this incarnation to evolve.",
    tags: ["Rahu", "Ketu", "Karmic Axis", "Nodes", "Past Life"]
  },
  {
    id: "post_7th_house_marriage",
    slug: "7th-house-marriage-spouse",
    title: "7th House & Kalatra Bhava: Predicting Spouse Traits & Relationship Karma",
    category: "Houses",
    readTime: "6 min read",
    publishedAt: "Jul 05, 2026",
    author: "Vedanga Research Team",
    excerpt: "The 7th house governs marriage, legal partnerships, and public interaction. Learn how planetary occupants and 7th lord aspects determine marital harmony.",
    tags: ["7th House", "Marriage", "Spouse Traits", "Venus", "Kalatra Bhava"]
  },
  {
    id: "post_ashwini_nakshatra",
    slug: "ashwini-nakshatra-guide",
    title: "Ashwini Nakshatra: The Celestial Physicians & Swift Healing Power",
    category: "Nakshatras",
    readTime: "5 min read",
    publishedAt: "Jun 30, 2026",
    author: "Vedanga Research Team",
    excerpt: "Ruled by Ketu and symbolized by a horse head, Ashwini (0° - 13°20' Aries) bestows speed, entrepreneurial drive, and miraculous healing abilities.",
    tags: ["Ashwini", "Nakshatras", "Ketu Ruled", "Aries", "Healing"]
  },
  {
    id: "post_aries_rashi",
    slug: "aries-mesh-rashi-astrology",
    title: "Aries (Mesha Rashi): Mars Energy, Leadership & Fiery Life Path",
    category: "Rashis",
    readTime: "5 min read",
    publishedAt: "Jun 25, 2026",
    author: "Acharya Vedanga",
    excerpt: "The first zodiac sign represents the primordial spark of creation. Explore Mesha Rashi's ruling planet Mars, health tendencies, and ideal career matches.",
    tags: ["Aries", "Mesha", "Mars", "Fire Element", "Zodiac Signs"]
  },
  {
    id: "post_venus_in_exaltation",
    slug: "venus-in-pisces-exaltation",
    title: "Venus Exalted in Pisces: Unconditional Love, Artistry & Moksha",
    category: "Planets",
    readTime: "6 min read",
    publishedAt: "Jun 20, 2026",
    author: "Vedanga Research Team",
    excerpt: "Shukra Dev reaches ultimate exaltation at 27° Pisces (Meena Rashi). Discover why exalted Venus dissolves worldly boundaries into transcendent devotion.",
    tags: ["Venus", "Shukra", "Pisces Exaltation", "Love", "Moksha"]
  },
  {
    id: "post_1st_house_lagna",
    slug: "1st-house-lagna-personality",
    title: "1st House (Lagna): The Master Key to Your Body, Temperament & Vitality",
    category: "Houses",
    readTime: "6 min read",
    publishedAt: "Jun 15, 2026",
    author: "Vedanga Research Team",
    excerpt: "Your Ascendant sign and Lagna lord determine physical appearance, immunity, life stamina, and overall soul orientation in this birth.",
    tags: ["1st House", "Lagna", "Ascendant", "Vitality", "Self"]
  },
  {
    id: "post_nakshatra_padas",
    slug: "nakshatra-padas-navamsha",
    title: "Understanding Nakshatra Padas & Navamsha D9 Secrets",
    category: "Nakshatras",
    readTime: "7 min read",
    publishedAt: "Jun 10, 2026",
    author: "Acharya Vedanga",
    excerpt: "Each 13°20' Nakshatra is divided into four 3°20' Padas corresponding to Dharma, Artha, Kama, and Moksha, directly forming the D9 Navamsha chart.",
    tags: ["Padas", "Navamsha D9", "Nakshatras", "Sub-divisions"]
  }
];

export const BlogHub: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [bookmarkedSlugs, setBookmarkedSlugs] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("vedanga_bookmarks");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [articlePageData, setArticlePageData] = useState<ProgrammaticPageData | null>(null);
  const [expandedFaqIndex, setExpandedFaqIndex] = useState<number | null>(null);
  const [readerFontSize, setReaderFontSize] = useState<"sm" | "base" | "lg">("base");
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [copiedToast, setCopiedToast] = useState<boolean>(false);
  const [newsletterEmail, setNewsletterEmail] = useState<string>("");
  const [newsletterSuccess, setNewsletterSuccess] = useState<boolean>(false);

  // Sync route on mount and popstate
  useEffect(() => {
    const handleUrlRoute = () => {
      const path = window.location.pathname;
      const hash = window.location.hash;

      let slugCandidate: string | null = null;
      if (path.startsWith("/learn/") && path.length > 7) {
        slugCandidate = path.replace(/^\/learn\//, "");
      } else if (hash && hash.startsWith("#article/")) {
        slugCandidate = hash.replace(/^#article\//, "");
      } else if (hash && hash.length > 1 && hash !== "#home") {
        slugCandidate = hash.substring(1);
      }

      if (slugCandidate) {
        setSelectedSlug(slugCandidate);
        setArticlePageData(getProgrammaticPage(slugCandidate));
      } else {
        setSelectedSlug(null);
        setArticlePageData(null);
        document.title = "Vedanga AI – Vedic Astrology Blog & Knowledge Hub";
      }
    };

    handleUrlRoute();
    window.addEventListener("popstate", handleUrlRoute);
    window.addEventListener("hashchange", handleUrlRoute);
    return () => {
      window.removeEventListener("popstate", handleUrlRoute);
      window.removeEventListener("hashchange", handleUrlRoute);
    };
  }, []);

  // Update programmatic page when selected slug changes
  useEffect(() => {
    if (selectedSlug) {
      const page = getProgrammaticPage(selectedSlug);
      setArticlePageData(page);
      document.title = `${page.title} | Vedanga AI Blog`;
      if (window.location.pathname !== `/learn/${selectedSlug}`) {
        window.history.pushState(null, "", `/learn/${selectedSlug}`);
      }
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  }, [selectedSlug]);

  const toggleBookmark = (slug: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setBookmarkedSlugs((prev) => {
      const next = prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug];
      localStorage.setItem("vedanga_bookmarks", JSON.stringify(next));
      return next;
    });
  };

  const handleOpenArticle = (slug: string) => {
    setSelectedSlug(slug);
    setExpandedFaqIndex(null);
    setIsSpeaking(false);
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  };

  const handleBackToBlog = () => {
    setSelectedSlug(null);
    setArticlePageData(null);
    setIsSpeaking(false);
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    window.history.pushState(null, "", "/");
    document.title = "Vedanga AI – Vedic Astrology Blog & Knowledge Hub";
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Text-to-Speech audio listening
  const handleToggleSpeech = (text: string) => {
    if (!("speechSynthesis" in window)) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      window.speechSynthesis.cancel();
      const cleanText = text.replace(/[#*`]/g, "");
      const utterance = new SpeechSynthesisUtterance(cleanText.substring(0, 2500));
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  const handleShareArticle = () => {
    const url = window.location.href;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopiedToast(true);
      setTimeout(() => setCopiedToast(false), 3000);
    }
  };

  const handleSubscribeNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim() && newsletterEmail.includes("@")) {
      setNewsletterSuccess(true);
      setTimeout(() => {
        setNewsletterEmail("");
        setNewsletterSuccess(false);
      }, 5000);
    }
  };

  // Search Results
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return searchSeoTopics(searchQuery);
  }, [searchQuery]);

  // Dynamic list of blog articles combining curated featured articles + astrology topics
  const displayArticles = useMemo(() => {
    let base = FEATURED_BLOG_POSTS;

    if (activeCategory === "Bookmarks") {
      return base.filter((art) => bookmarkedSlugs.includes(art.slug));
    }

    if (activeCategory !== "All") {
      base = base.filter((art) => art.category === activeCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return base.filter(
        (art) =>
          art.title.toLowerCase().includes(q) ||
          art.excerpt.toLowerCase().includes(q) ||
          art.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    return base;
  }, [activeCategory, searchQuery, bookmarkedSlugs]);

  // Category Colors
  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case "Planets":
        return "bg-amber-500/10 text-amber-300 border-amber-500/30";
      case "Houses":
        return "bg-emerald-500/10 text-emerald-300 border-emerald-500/30";
      case "Rashis":
        return "bg-cyan-500/10 text-cyan-300 border-cyan-500/30";
      case "Nakshatras":
        return "bg-purple-500/10 text-purple-300 border-purple-500/30";
      case "Kundli Guides":
        return "bg-yellow-500/10 text-yellow-300 border-yellow-500/30";
      case "Yogas & Remedies":
        return "bg-rose-500/10 text-rose-300 border-rose-500/30";
      default:
        return "bg-slate-800 text-slate-300 border-slate-700";
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-amber-500/30 selection:text-amber-200">
      {/* Toast Notification */}
      <AnimatePresence>
        {copiedToast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 right-6 z-50 bg-amber-500 text-slate-950 px-4 py-2.5 rounded-xl font-medium shadow-xl flex items-center space-x-2 text-sm"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Article URL copied to clipboard!</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HEADER NAVBAR */}
      <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-amber-500/20 px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          {/* Logo */}
          <button
            onClick={handleBackToBlog}
            className="flex items-center space-x-2.5 text-left group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-600 p-[1.5px] shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-950 rounded-xl flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-amber-300" />
              </div>
            </div>
            <div>
              <span className="font-serif text-xl font-bold tracking-tight bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-500 bg-clip-text text-transparent group-hover:from-white group-hover:to-amber-300 transition-colors">
                Vedanga AI Blog
              </span>
              <p className="text-[10px] text-amber-400/80 font-medium">
                Vedic Astrology & Planetary Insights
              </p>
            </div>
          </button>

          {/* Real-time Search Input */}
          <div className="flex-1 max-w-md hidden md:block relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search planets, houses, rashis, dasha..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900/90 border border-slate-800 focus:border-amber-500/50 rounded-xl pl-9 pr-8 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Bookmarks Counter / Return Button */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => {
                setActiveCategory("Bookmarks");
                setSelectedSlug(null);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                activeCategory === "Bookmarks" && !selectedSlug
                  ? "bg-amber-500 text-slate-950 border-amber-400"
                  : "bg-slate-900 border-slate-800 text-slate-300 hover:border-amber-500/30 hover:text-amber-300"
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Saved</span>
              <span className="ml-1 px-1.5 py-0.2 bg-amber-500/20 text-amber-300 rounded-full text-[10px]">
                {bookmarkedSlugs.length}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="mt-2 md:hidden relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search planets, houses, nakshatras..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 focus:border-amber-500/50 rounded-xl pl-9 pr-8 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </header>

      {/* SEARCH AUTCOMPLETE OVERLAY */}
      {searchQuery.trim() && searchResults.length > 0 && !selectedSlug && (
        <div className="max-w-4xl mx-auto px-4 mt-3">
          <div className="bg-slate-900 border border-amber-500/30 rounded-2xl p-4 shadow-2xl backdrop-blur-xl">
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800">
              <span className="text-xs font-semibold text-amber-300 flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Search Suggestions ({searchResults.length} topics found)</span>
              </span>
              <button
                onClick={() => setSearchQuery("")}
                className="text-xs text-slate-400 hover:text-white"
              >
                Clear
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-72 overflow-y-auto pr-1">
              {searchResults.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    handleOpenArticle(item.slug);
                    setSearchQuery("");
                  }}
                  className="p-2.5 rounded-xl bg-slate-950/70 hover:bg-amber-500/10 border border-slate-800 hover:border-amber-500/40 text-left group transition-all"
                >
                  <div className="flex items-center justify-between text-[11px] text-amber-400 font-medium mb-1">
                    <span>{item.category}</span>
                    <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </div>
                  <h4 className="text-xs font-semibold text-slate-200 group-hover:text-amber-200 line-clamp-1">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                    {item.snippet}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MAIN CONTENT ROUTING */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {selectedSlug && articlePageData ? (
            /* =================================================== */
            /* 1. FULL ARTICLE / BLOG POST READER VIEW             */
            /* =================================================== */
            <motion.article
              key={selectedSlug}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.25 }}
              className="space-y-8"
            >
              {/* Top Controls Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
                <button
                  onClick={handleBackToBlog}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500/40 text-slate-300 hover:text-amber-300 text-xs font-semibold transition-all cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Blog</span>
                </button>

                <div className="flex items-center space-x-2">
                  {/* Speech Audio Button */}
                  <button
                    onClick={() => handleToggleSpeech(articlePageData.executiveSummary + " " + articlePageData.sections.map(s => s.content).join(" "))}
                    className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                      isSpeaking
                        ? "bg-amber-500 text-slate-950 border-amber-400 animate-pulse"
                        : "bg-slate-900 border-slate-800 text-slate-300 hover:text-amber-300 hover:border-amber-500/30"
                    }`}
                    title="Listen to Audio Reading"
                  >
                    {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-amber-400" />}
                    <span>{isSpeaking ? "Stop Audio" : "Listen (3 min)"}</span>
                  </button>

                  {/* Font Size Selector */}
                  <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-0.5">
                    <button
                      onClick={() => setReaderFontSize("sm")}
                      className={`px-2 py-1 text-[11px] font-bold rounded-lg ${readerFontSize === "sm" ? "bg-amber-500/20 text-amber-300" : "text-slate-400 hover:text-slate-200"}`}
                    >
                      A-
                    </button>
                    <button
                      onClick={() => setReaderFontSize("base")}
                      className={`px-2 py-1 text-[11px] font-bold rounded-lg ${readerFontSize === "base" ? "bg-amber-500/20 text-amber-300" : "text-slate-400 hover:text-slate-200"}`}
                    >
                      A
                    </button>
                    <button
                      onClick={() => setReaderFontSize("lg")}
                      className={`px-2 py-1 text-[11px] font-bold rounded-lg ${readerFontSize === "lg" ? "bg-amber-500/20 text-amber-300" : "text-slate-400 hover:text-slate-200"}`}
                    >
                      A+
                    </button>
                  </div>

                  {/* Bookmark Button */}
                  <button
                    onClick={() => toggleBookmark(selectedSlug)}
                    className={`p-2 rounded-xl border transition-all cursor-pointer ${
                      bookmarkedSlugs.includes(selectedSlug)
                        ? "bg-amber-500/20 text-amber-300 border-amber-500/50"
                        : "bg-slate-900 border-slate-800 text-slate-400 hover:text-amber-300"
                    }`}
                    title="Bookmark Article"
                  >
                    <Bookmark className="w-4 h-4" />
                  </button>

                  {/* Share Button */}
                  <button
                    onClick={handleShareArticle}
                    className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-amber-300 transition-all cursor-pointer"
                    title="Share Article Link"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Breadcrumb Trail */}
              <nav className="flex items-center space-x-2 text-xs text-slate-400">
                <button onClick={handleBackToBlog} className="hover:text-amber-300">
                  Home
                </button>
                <ChevronRight className="w-3 h-3 text-slate-600" />
                <span className="text-amber-400 font-medium">{articlePageData.category}</span>
                <ChevronRight className="w-3 h-3 text-slate-600" />
                <span className="text-slate-300 truncate max-w-[200px] sm:max-w-md">
                  {articlePageData.h1}
                </span>
              </nav>

              {/* Article Header Banner */}
              <header className="space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getCategoryColor(articlePageData.category)}`}>
                    {articlePageData.category}
                  </span>
                  <span className="text-xs text-slate-400 flex items-center space-x-1 bg-slate-900 px-2.5 py-1 rounded-full border border-slate-800">
                    <Clock className="w-3 h-3 text-amber-400" />
                    <span>{articlePageData.readTime}</span>
                  </span>
                  <span className="text-xs text-slate-400 bg-slate-900 px-2.5 py-1 rounded-full border border-slate-800">
                    Updated {articlePageData.updatedAt}
                  </span>
                </div>

                <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-100 tracking-tight leading-tight">
                  {articlePageData.h1}
                </h1>

                <div className="flex items-center space-x-3 pt-2 text-xs text-slate-400">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 p-0.5">
                    <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center">
                      <Feather className="w-4 h-4 text-amber-300" />
                    </div>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-200 block">By {articlePageData.author}</span>
                    <span className="text-[11px] text-amber-400/80">Vedic Astrological Research Division</span>
                  </div>
                </div>
              </header>

              {/* Scriptural Quote Shloka Callout Box */}
              {articlePageData.scripturalShloka && (
                <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-950/40 via-slate-900 to-slate-950 border border-amber-500/30 relative overflow-hidden shadow-lg">
                  <Sparkles className="w-20 h-20 text-amber-500/5 absolute -right-4 -bottom-4 pointer-events-none" />
                  <div className="flex items-start space-x-3">
                    <BookOpen className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-bold tracking-widest text-amber-400 uppercase">
                        Vedic Scriptural Reference
                      </span>
                      <p className="font-serif italic text-sm sm:text-base text-amber-100/90 leading-relaxed">
                        "{articlePageData.scripturalShloka}"
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Executive Summary Callout */}
              <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
                <div className="flex items-center space-x-2 text-amber-300 text-xs font-bold uppercase tracking-wider">
                  <Lightbulb className="w-4 h-4 text-yellow-400" />
                  <span>Key Insights & Core Takeaways</span>
                </div>
                <p className="text-slate-300 text-sm leading-relaxed">
                  {articlePageData.executiveSummary}
                </p>
              </div>

              {/* Article Subsections Content */}
              <div
                className={`space-y-8 ${
                  readerFontSize === "sm"
                    ? "text-sm leading-relaxed"
                    : readerFontSize === "lg"
                    ? "text-lg leading-relaxed"
                    : "text-base leading-relaxed"
                }`}
              >
                {articlePageData.sections.map((section, idx) => (
                  <section key={idx} className="space-y-3 pt-4 border-t border-slate-800/60">
                    <h2 className="font-serif text-xl sm:text-2xl font-bold text-amber-200 flex items-center space-x-2">
                      <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
                      <span>{section.title}</span>
                    </h2>
                    <div className="text-slate-300 whitespace-pre-line space-y-3">
                      {section.content}
                    </div>
                  </section>
                ))}
              </div>

              {/* Dynamic FAQ Section */}
              {articlePageData.faqs && articlePageData.faqs.length > 0 && (
                <section className="pt-8 border-t border-amber-500/20 space-y-4">
                  <div className="flex items-center space-x-2">
                    <HelpCircle className="w-5 h-5 text-amber-400" />
                    <h3 className="font-serif text-2xl font-bold text-slate-100">
                      Frequently Asked Questions ({articlePageData.faqs.length} FAQs)
                    </h3>
                  </div>

                  <div className="space-y-3">
                    {articlePageData.faqs.map((faq, idx) => {
                      const isExpanded = expandedFaqIndex === idx;
                      return (
                        <div
                          key={idx}
                          className="rounded-xl bg-slate-900 border border-slate-800 overflow-hidden transition-all"
                        >
                          <button
                            onClick={() => setExpandedFaqIndex(isExpanded ? null : idx)}
                            className="w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-slate-800/50 transition-colors"
                          >
                            <span className="font-medium text-sm text-slate-200">
                              {faq.question}
                            </span>
                            <ChevronRight
                              className={`w-4 h-4 text-amber-400 shrink-0 transition-transform ${
                                isExpanded ? "rotate-90" : ""
                              }`}
                            />
                          </button>
                          <AnimatePresence>
                            {isExpanded && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="px-4 pb-4 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/60 pt-3 bg-slate-950/40"
                              >
                                {faq.answer}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </div>
                </section>
              )}

              {/* Topic Cluster Links / Related Posts */}
              {articlePageData.topicClusterLinks && articlePageData.topicClusterLinks.length > 0 && (
                <section className="pt-8 border-t border-slate-800 space-y-4">
                  <h3 className="font-serif text-xl font-bold text-amber-300 flex items-center space-x-2">
                    <Flame className="w-5 h-5 text-amber-400" />
                    <span>Explore Related Astrological Articles</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {articlePageData.topicClusterLinks.slice(0, 6).map((link, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleOpenArticle(link.slug)}
                        className="p-4 rounded-xl bg-slate-900 hover:bg-amber-500/10 border border-slate-800 hover:border-amber-500/40 text-left group transition-all"
                      >
                        <span className="text-[10px] font-bold text-amber-400 uppercase block mb-1">
                          {link.category}
                        </span>
                        <h4 className="font-serif text-sm font-semibold text-slate-200 group-hover:text-amber-200 line-clamp-2">
                          {link.title}
                        </h4>
                        <p className="text-xs text-slate-400 line-clamp-2 mt-1">
                          {link.description}
                        </p>
                      </button>
                    ))}
                  </div>
                </section>
              )}

              {/* Bottom Back Button */}
              <div className="pt-6 border-t border-slate-800 flex justify-center">
                <button
                  onClick={handleBackToBlog}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 hover:scale-105 transition-transform cursor-pointer"
                >
                  ← Explore All Blog Posts
                </button>
              </div>
            </motion.article>
          ) : (
            /* =================================================== */
            /* 2. BLOG HOMEPAGE / FEED VIEW                        */
            /* =================================================== */
            <motion.div
              key="blog_homepage"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-10"
            >
              {/* HERO FEATURED BANNER */}
              {activeCategory === "All" && !searchQuery && (
                <section className="relative rounded-3xl overflow-hidden border border-amber-500/30 bg-gradient-to-br from-amber-950/60 via-slate-900 to-slate-950 p-6 sm:p-10 shadow-2xl">
                  <Sparkles className="w-40 h-40 text-amber-500/5 absolute -right-6 -bottom-6 pointer-events-none" />
                  <div className="max-w-2xl space-y-4 relative z-10">
                    <div className="flex items-center space-x-2">
                      <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/40 flex items-center space-x-1">
                        <Flame className="w-3.5 h-3.5 text-amber-400" />
                        <span>Featured Blog Post</span>
                      </span>
                      <span className="text-xs text-slate-400">Aug 1, 2026</span>
                    </div>

                    <h1 className="font-serif text-2xl sm:text-4xl font-extrabold text-slate-100 leading-tight">
                      Sun in the 10th House: The Throne of Digbala, Fame & Divine Leadership
                    </h1>

                    <p className="text-slate-300 text-sm sm:text-base leading-relaxed line-clamp-3">
                      When Surya Dev occupies the 10th house of Karma Bhava, it gains directional strength (Digbala). Discover how this placement creates regal career authority, political power, and enduring legacy.
                    </p>

                    <div className="flex flex-wrap items-center gap-4 pt-2">
                      <button
                        onClick={() => handleOpenArticle("sun-in-10th-house")}
                        className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-bold text-xs sm:text-sm shadow-md shadow-amber-500/20 hover:scale-105 transition-transform flex items-center space-x-2 cursor-pointer"
                      >
                        <span>Read Featured Article</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>

                      <span className="text-xs text-slate-400 flex items-center space-x-1">
                        <Clock className="w-3.5 h-3.5 text-amber-400" />
                        <span>6 min read</span>
                      </span>
                    </div>
                  </div>
                </section>
              )}

              {/* CATEGORIES FILTER PILLS */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-serif text-xl sm:text-2xl font-bold text-amber-200 flex items-center space-x-2">
                    <BookOpen className="w-5 h-5 text-amber-400" />
                    <span>Astrological Categories</span>
                  </h2>

                  {activeCategory !== "All" && (
                    <button
                      onClick={() => setActiveCategory("All")}
                      className="text-xs text-amber-400 hover:underline"
                    >
                      Reset Category
                    </button>
                  )}
                </div>

                <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
                  {[
                    "All",
                    "Planets",
                    "Houses",
                    "Rashis",
                    "Nakshatras",
                    "Kundli Guides",
                    "Yogas & Remedies",
                    "Bookmarks"
                  ].map((cat) => {
                    const isActive = activeCategory === cat;
                    return (
                      <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap border transition-all cursor-pointer ${
                          isActive
                            ? "bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20"
                            : "bg-slate-900 text-slate-300 border-slate-800 hover:border-amber-500/40 hover:text-amber-200"
                        }`}
                      >
                        {cat === "All" && "✨ All Posts"}
                        {cat === "Planets" && "🪐 Planets & Grahas"}
                        {cat === "Houses" && "🏛️ Bhavas & Houses"}
                        {cat === "Rashis" && "♈ Zodiac Rashis"}
                        {cat === "Nakshatras" && "🌟 Nakshatras"}
                        {cat === "Kundli Guides" && "🔮 Kundli Guides"}
                        {cat === "Yogas & Remedies" && "📜 Yogas & Remedies"}
                        {cat === "Bookmarks" && `🔖 Saved (${bookmarkedSlugs.length})`}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* ARTICLES GRID */}
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Showing {displayArticles.length} blog posts</span>
                  {searchQuery && (
                    <span>Filtered by "{searchQuery}"</span>
                  )}
                </div>

                {displayArticles.length === 0 ? (
                  <div className="p-12 text-center rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                    <Bookmark className="w-10 h-10 text-slate-600 mx-auto" />
                    <h3 className="font-serif text-lg font-bold text-slate-300">
                      No blog posts found
                    </h3>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                      {activeCategory === "Bookmarks"
                        ? "You haven't bookmarked any articles yet. Click the bookmark icon on any post to save it here."
                        : "No articles matched your search query. Try searching for planets like 'Sun', 'Mars', or 'Houses'."}
                    </p>
                    <button
                      onClick={() => {
                        setActiveCategory("All");
                        setSearchQuery("");
                      }}
                      className="px-4 py-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-semibold"
                    >
                      View All Posts
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {displayArticles.map((art) => {
                      const isBookmarked = bookmarkedSlugs.includes(art.slug);
                      return (
                        <div
                          key={art.id}
                          onClick={() => handleOpenArticle(art.slug)}
                          className="group rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-amber-500/40 p-5 flex flex-col justify-between space-y-4 transition-all duration-300 hover:-translate-y-1 cursor-pointer shadow-lg hover:shadow-amber-500/5"
                        >
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${getCategoryColor(art.category)}`}>
                                {art.category}
                              </span>
                              <button
                                onClick={(e) => toggleBookmark(art.slug, e)}
                                className={`p-1.5 rounded-lg border transition-all ${
                                  isBookmarked
                                    ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                                    : "text-slate-500 border-transparent hover:text-amber-300"
                                }`}
                                title="Bookmark Post"
                              >
                                <Bookmark className="w-4 h-4" />
                              </button>
                            </div>

                            <h3 className="font-serif text-lg font-bold text-slate-100 group-hover:text-amber-200 transition-colors line-clamp-2 leading-snug">
                              {art.title}
                            </h3>

                            <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                              {art.excerpt}
                            </p>
                          </div>

                          <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                            <span className="flex items-center space-x-1">
                              <Clock className="w-3 h-3 text-amber-400" />
                              <span>{art.readTime}</span>
                            </span>

                            <span className="text-amber-400 font-semibold group-hover:translate-x-1 transition-transform flex items-center space-x-0.5">
                              <span>Read Post</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* QUICK TOPIC CLUSTERS DIRECTORY */}
              <section className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
                <h3 className="font-serif text-lg font-bold text-amber-300 flex items-center space-x-2">
                  <Compass className="w-5 h-5 text-amber-400" />
                  <span>Popular Vedic Astrology Topics Index</span>
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                  {[
                    { label: "Sun (Surya)", slug: "sun-in-vedic-astrology" },
                    { label: "Moon (Chandra)", slug: "moon-in-vedic-astrology" },
                    { label: "Mars (Mangal)", slug: "mars-in-vedic-astrology" },
                    { label: "Mercury (Budh)", slug: "mercury-in-vedic-astrology" },
                    { label: "Jupiter (Guru)", slug: "jupiter-in-vedic-astrology" },
                    { label: "Venus (Shukra)", slug: "venus-in-vedic-astrology" },
                    { label: "Saturn (Shani)", slug: "saturn-in-vedic-astrology" },
                    { label: "Rahu Node", slug: "rahu-in-vedic-astrology" },
                    { label: "Ketu Node", slug: "ketu-in-vedic-astrology" },
                    { label: "10th Karma House", slug: "sun-in-10th-house" },
                    { label: "7th Spouse House", slug: "7th-house-marriage-spouse" },
                    { label: "9th Fortune House", slug: "jupiter-in-9th-house" }
                  ].map((topic, i) => (
                    <button
                      key={i}
                      onClick={() => handleOpenArticle(topic.slug)}
                      className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-amber-500/40 text-xs font-medium text-slate-300 hover:text-amber-300 text-center transition-all truncate"
                    >
                      {topic.label}
                    </button>
                  ))}
                </div>
              </section>

              {/* NEWSLETTER SUBSCRIPTION BOX */}
              <section className="rounded-3xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-950 border border-amber-500/30 p-6 sm:p-8 text-center space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-300 flex items-center justify-center mx-auto border border-amber-500/40">
                  <Zap className="w-6 h-6 text-amber-400" />
                </div>

                <div className="space-y-1">
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-slate-100">
                    Subscribe to Weekly Planetary Transits & Astrological Insights
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">
                    Join 25,000+ seekers receiving in-depth Vedic wisdom, eclipse updates, and planetary transit guides directly in their inbox.
                  </p>
                </div>

                {newsletterSuccess ? (
                  <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold max-w-md mx-auto flex items-center justify-center space-x-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Hari Om! You are successfully subscribed to Vedanga AI Blog.</span>
                  </div>
                ) : (
                  <form onSubmit={handleSubscribeNewsletter} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
                    <input
                      type="email"
                      placeholder="Enter your email address..."
                      required
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                      className="flex-1 bg-slate-950 border border-slate-800 focus:border-amber-500/50 rounded-xl px-4 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 hover:scale-105 transition-transform cursor-pointer"
                    >
                      Subscribe Free
                    </button>
                  </form>
                )}
              </section>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* FOOTER */}
      <footer className="mt-16 border-t border-slate-800 bg-slate-950/80 py-8 px-4 text-center text-xs text-slate-500 space-y-3">
        <div className="flex items-center justify-center space-x-2 text-amber-400 font-serif font-semibold">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Vedanga AI – Vedic Astrology & Spiritual Knowledge Hub</span>
        </div>
        <p className="max-w-md mx-auto text-[11px]">
          Dedicated to preserving and revealing ancient Vedic wisdom, Jyotish Shastra, Parashari principles, and planetary insights for self-realization.
        </p>
        <p className="text-[10px] text-slate-600">
          © {new Date().getFullYear()} Vedanga AI. All blog posts are written for educational and spiritual enlightenment.
        </p>
      </footer>
    </div>
  );
};
