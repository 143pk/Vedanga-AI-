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
  CheckCircle2,
  Zap,
  ArrowLeft,
  Lightbulb,
  VolumeX,
  TrendingUp,
  ShieldCheck,
  FileText,
  List,
  Layers
} from "lucide-react";
import { getProgrammaticPage, ProgrammaticPageData } from "../seo/programmaticEngine";
import { searchSeoTopics, SearchResultItem } from "../seo/seoSearch";
import { PLANETS, HOUSES, SIGNS, NAKSHATRAS, HIGH_INTENT_LANDINGS } from "../seo/astrologyData";

export interface BlogArticleItem {
  id: string;
  slug: string;
  title: string;
  category: "Planets" | "Houses" | "Rashis" | "Nakshatras" | "Kundli Guides" | "Yogas & Remedies" | "Daily Content" | "Landings";
  readTime: string;
  publishedAt: string;
  author: string;
  excerpt: string;
  featured?: boolean;
  tags: string[];
  imageUrl?: string;
}

export function getArticleImageUrl(slug: string, category?: string): string {
  const s = slug.toLowerCase();

  if (s.includes("saturn") || s.includes("shani")) {
    return "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=1000&q=80";
  }
  if (s.includes("venus") || s.includes("shukra")) {
    return "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1000&q=80";
  }
  if (s.includes("sun") || s.includes("surya")) {
    return "https://images.unsplash.com/photo-1532693322450-2cb5c511067d?auto=format&fit=crop&w=1000&q=80";
  }
  if (s.includes("moon") || s.includes("chandra") || s.includes("horoscope")) {
    return "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1000&q=80";
  }
  if (s.includes("rahu") || s.includes("ketu")) {
    return "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1000&q=80";
  }
  if (s.includes("jupiter") || s.includes("guru") || s.includes("mercury") || s.includes("mars")) {
    return "https://images.unsplash.com/photo-1502134249126-9f3755a50d78?auto=format&fit=crop&w=1000&q=80";
  }
  if (s.includes("house") || s.includes("bhava")) {
    return "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1000&q=80";
  }
  if (s.includes("nakshatra")) {
    return "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?auto=format&fit=crop&w=1000&q=80";
  }
  if (s.includes("kundli") || s.includes("birth-chart") || category === "Landings") {
    return "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1000&q=80";
  }
  if (s.includes("remedy") || s.includes("yogas") || s.includes("mantra")) {
    return "https://images.unsplash.com/photo-1609137144813-7d9921338f24?auto=format&fit=crop&w=1000&q=80";
  }

  if (category === "Planets") {
    return "https://images.unsplash.com/photo-1502134249126-9f3755a50d78?auto=format&fit=crop&w=1000&q=80";
  }
  if (category === "Houses") {
    return "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1000&q=80";
  }
  if (category === "Nakshatras") {
    return "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?auto=format&fit=crop&w=1000&q=80";
  }
  if (category === "Rashis") {
    return "https://images.unsplash.com/photo-1532960401447-7dd05bef20b0?auto=format&fit=crop&w=1000&q=80";
  }

  return "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1000&q=80";
}

const CURATED_BLOG_POSTS: BlogArticleItem[] = [
  {
    id: "landing_vedic_kundli",
    slug: "ai-kundli",
    title: "Complete Vedic Janma Kundli Guide – Precision Birth Chart Analysis",
    category: "Landings",
    readTime: "8 min read",
    publishedAt: new Date().toISOString().split("T")[0],
    author: "Acharya Vedanga - Chief Vedic Astrologer",
    featured: true,
    excerpt: "Comprehensive guide to understanding your Janma Kundli, planetary degrees, Vimshottari Dasha timeline, Bhavas, and authentic Parashari remedies.",
    tags: ["Kundli", "Birth Chart", "Lagna", "Vedic Astrology"]
  },
  {
    id: "landing_vedic_horoscope",
    slug: "ai-horoscope",
    title: "Vedic Horoscope & Planetary Transit Guidance",
    category: "Daily Content",
    readTime: "7 min read",
    publishedAt: new Date().toISOString().split("T")[0],
    author: "Acharya Vedanga",
    featured: true,
    excerpt: "Accurate daily, weekly, and yearly Vedic Horoscope analysis for all 12 zodiac signs tailored to your Moon sign and Lagna.",
    tags: ["Horoscope", "Daily Transit", "Moon Sign", "Gochar"]
  },
  {
    id: "post_saturn_3rd",
    slug: "saturn-in-3rd-house",
    title: "Saturn in the 3rd House: Perseverance, Courage & Sibling Dynamics",
    category: "Houses",
    readTime: "7 min read",
    publishedAt: "Aug 1, 2026",
    author: "Acharya Vedanga",
    featured: true,
    excerpt: "When Shani Dev resides in the 3rd house of Upachaya Bhava, it builds unshakeable endurance, self-effort, and media communication mastery over time.",
    tags: ["Saturn", "3rd House", "Upachaya", "Courage", "Karma"]
  },
  {
    id: "post_venus_pisces",
    slug: "venus-in-pisces",
    title: "Venus in Pisces: Exaltation of Divine Love, Aesthetics & Unconditional Devotion",
    category: "Planets",
    readTime: "6 min read",
    publishedAt: "Jul 29, 2026",
    author: "Acharya Vedanga",
    featured: true,
    excerpt: "Shukra Dev reaches supreme exaltation at 27° Pisces (Meena Rashi). Discover how this placement creates divine artistic talent, empathy, and spiritual fulfillment.",
    tags: ["Venus", "Pisces Exaltation", "Love", "Art", "Moksha"]
  },
  {
    id: "post_sun_antardasha",
    slug: "sun-antardasha",
    title: "Sun Antardasha Analysis: Vitality, Authority & Fatherly Blessings",
    category: "Kundli Guides",
    readTime: "8 min read",
    publishedAt: "Jul 25, 2026",
    author: "Acharya Vedanga",
    excerpt: "The sub-period of Surya Dev brings executive power, government recognition, fatherly inheritance, and clarity of life purpose.",
    tags: ["Sun", "Antardasha", "Surya Dev", "Career timing"]
  },
  {
    id: "post_rahu_mahadasha",
    slug: "rahu-mahadasha",
    title: "Rahu Mahadasha Guide: Navigating Material Expansion & Worldly Ambition",
    category: "Kundli Guides",
    readTime: "9 min read",
    publishedAt: "Jul 20, 2026",
    author: "Acharya Vedanga",
    excerpt: "The 18-year Rahu Mahadasha cycle brings sudden breakthroughs, foreign travels, technological innovation, and karmic transmutations.",
    tags: ["Rahu", "Mahadasha", "Material Drive", "Foreign Travel"]
  },
  {
    id: "post_aquarius_ascendant",
    slug: "aquarius-ascendant",
    title: "Aquarius Ascendant Blueprint: Visionary Intellect & Saturnian Discipline",
    category: "Rashis",
    readTime: "7 min read",
    publishedAt: "Jul 15, 2026",
    author: "Acharya Vedanga",
    excerpt: "Kumbha Lagna natives possess humanitarian vision, analytical depth, and structured perseverance under Saturn's guardianship.",
    tags: ["Aquarius", "Kumbha Lagna", "Ascendant", "Saturn"]
  },
  {
    id: "post_punarvasu_nakshatra",
    slug: "punarvasu-nakshatra",
    title: "Punarvasu Nakshatra Insights: Divine Renewal & Quiver of Abundance",
    category: "Nakshatras",
    readTime: "6 min read",
    publishedAt: "Jul 10, 2026",
    author: "Acharya Vedanga",
    excerpt: "Ruled by Jupiter and Goddess Aditi, Punarvasu Nakshatra signifies the return of light, protection, second chances, and spiritual prosperity.",
    tags: ["Punarvasu", "Jupiter Ruled", "Aditi", "Nakshatras"]
  },
  {
    id: "post_daily_panchang",
    slug: "daily-panchang",
    title: "Daily Vedic Panchang: Tithi, Nakshatra, Yoga, Karana & Abhijit Muhurat",
    category: "Daily Content",
    readTime: "5 min read",
    publishedAt: new Date().toISOString().split("T")[0],
    author: "Acharya Vedanga",
    excerpt: "Track auspicious daily time windows, Rahu Kaal, Yamagandam, and planetary hora for optimal spiritual and business endeavors.",
    tags: ["Panchang", "Tithi", "Abhijit Muhurat", "Rahu Kaal"]
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
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [copiedToast, setCopiedToast] = useState<boolean>(false);

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
        const data = getProgrammaticPage(slugCandidate);
        setArticlePageData(data);
      } else {
        setSelectedSlug(null);
        setArticlePageData(null);
        document.title = "Vedanga Astrology Journal – Classical Vedic Knowledge & Insights";
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

  // Inject dynamic JSON-LD structured data into head on article view
  useEffect(() => {
    if (articlePageData) {
      document.title = `${articlePageData.title}`;

      const oldScripts = document.querySelectorAll("script[data-dynamic-schema='true']");
      oldScripts.forEach((s) => s.remove());

      if (articlePageData.schemaJsonLd && articlePageData.schemaJsonLd.length > 0) {
        articlePageData.schemaJsonLd.forEach((schemaObj) => {
          const script = document.createElement("script");
          script.type = "application/ld+json";
          script.setAttribute("data-dynamic-schema", "true");
          script.text = JSON.stringify(schemaObj);
          document.head.appendChild(script);
        });
      }

      if (window.location.pathname !== `/learn/${selectedSlug}`) {
        window.history.pushState(null, "", `/learn/${selectedSlug}`);
      }
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  }, [selectedSlug, articlePageData]);

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
    setArticlePageData(getProgrammaticPage(slug));
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
    window.history.pushState(null, "", "/learn");
    document.title = "Vedanga Astrology Journal – Classical Vedic Knowledge & Insights";
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return searchSeoTopics(searchQuery);
  }, [searchQuery]);

  const displayArticles = useMemo(() => {
    let base = CURATED_BLOG_POSTS;

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

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-amber-100 selection:text-amber-900">
      {/* Toast Notification */}
      <AnimatePresence>
        {copiedToast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 right-6 z-50 bg-amber-700 text-white px-4 py-2.5 rounded-xl font-medium shadow-xl flex items-center space-x-2 text-sm"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Article link copied to clipboard</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HEADER NAVBAR */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-amber-200/80 px-4 py-3.5 shadow-xs">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <button
            onClick={handleBackToBlog}
            className="flex items-center space-x-3 text-left group focus:outline-none"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-600 p-[2px] shadow-sm">
              <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-amber-700 group-hover:scale-105 transition-transform" />
              </div>
            </div>
            <div>
              <span className="font-serif text-xl font-bold tracking-tight text-slate-900 block leading-tight">
                Vedanga Astrology Journal
              </span>
              <span className="text-[11px] font-semibold text-amber-800 tracking-wider block">
                Authentic Jyotish Research & Classical Insights
              </span>
            </div>
          </button>

          {/* Header Quick Navigation */}
          <div className="hidden sm:flex items-center space-x-2 text-xs font-semibold text-slate-700">
            <button
              onClick={() => setActiveCategory("Planets")}
              className="px-3 py-1.5 rounded-lg hover:bg-amber-50 hover:text-amber-800 transition-colors"
            >
              Planets
            </button>
            <button
              onClick={() => setActiveCategory("Houses")}
              className="px-3 py-1.5 rounded-lg hover:bg-amber-50 hover:text-amber-800 transition-colors"
            >
              Houses
            </button>
            <button
              onClick={() => setActiveCategory("Nakshatras")}
              className="px-3 py-1.5 rounded-lg hover:bg-amber-50 hover:text-amber-800 transition-colors"
            >
              Nakshatras
            </button>
            <button
              onClick={() => setActiveCategory("Kundli Guides")}
              className="px-3 py-1.5 rounded-lg hover:bg-amber-50 hover:text-amber-800 transition-colors"
            >
              Guides
            </button>
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* ARTICLE READER VIEW */}
        {selectedSlug && articlePageData ? (
          <article className="space-y-8 animate-fadeIn">
            {/* Breadcrumb Navigation */}
            <nav className="flex items-center space-x-2 text-xs text-slate-500 border-b border-slate-200 pb-3">
              <button onClick={handleBackToBlog} className="hover:text-amber-800 flex items-center space-x-1 font-medium">
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>All Articles</span>
              </button>
              <ChevronRight className="w-3 h-3 text-slate-400" />
              <span className="text-amber-800 font-semibold">{articlePageData.category}</span>
              <ChevronRight className="w-3 h-3 text-slate-400" />
              <span className="text-slate-800 truncate max-w-xs font-medium">{articlePageData.h1}</span>
            </nav>

            {/* Article Header Card */}
            <header className="bg-white rounded-2xl p-6 sm:p-8 border border-amber-200/80 shadow-xs space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-200">
                    {articlePageData.category}
                  </span>
                  <span className="flex items-center space-x-1 bg-slate-100 px-2.5 py-1 rounded-full font-medium">
                    <Clock className="w-3.5 h-3.5 text-amber-700" />
                    <span>{articlePageData.readTime}</span>
                  </span>
                  <span className="flex items-center space-x-1 bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-full border border-emerald-200 font-medium">
                    <FileText className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{articlePageData.wordCount} words (500+ verified)</span>
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleToggleSpeech(articlePageData.sections.map((s) => s.content).join(" "))}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center space-x-1.5 transition-colors ${
                      isSpeaking
                        ? "bg-amber-700 text-white border-amber-700"
                        : "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700"
                    }`}
                  >
                    {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                    <span>{isSpeaking ? "Pause Audio" : "Listen Article"}</span>
                  </button>

                  <button
                    onClick={handleShareArticle}
                    className="p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700"
                    title="Share Article"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={(e) => toggleBookmark(articlePageData.slug, e)}
                    className="p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700"
                    title="Bookmark"
                  >
                    {bookmarkedSlugs.includes(articlePageData.slug) ? (
                      <BookMarked className="w-4 h-4 text-amber-700 fill-amber-700" />
                    ) : (
                      <Bookmark className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight">
                {articlePageData.h1}
              </h1>

              {/* EEAT Author & Review Bar */}
              <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-600">
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center font-bold text-amber-900">
                    AV
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block">{articlePageData.author}</span>
                    <span className="text-slate-500">Chief Astrological Scholar • Parashari Research Institute</span>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1 text-emerald-800 font-semibold bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Scripturally Verified</span>
                  </div>
                  <span>Published: {articlePageData.updatedAt}</span>
                </div>
              </div>

              {/* Sanskrit Shloka Box */}
              {articlePageData.scripturalShloka && (
                <div className="p-4 rounded-xl bg-amber-50/90 border border-amber-200 text-amber-950 font-serif text-sm italic text-center shadow-xs">
                  "{articlePageData.scripturalShloka}"
                </div>
              )}
            </header>

            {/* Premium Article Hero Cover Image */}
            <div className="relative rounded-2xl overflow-hidden border border-amber-200/80 shadow-xs h-56 sm:h-72 md:h-80 bg-slate-950 group">
              <img
                src={getArticleImageUrl(articlePageData.slug, articlePageData.category)}
                alt={articlePageData.h1}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover opacity-90 transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 sm:bottom-5 sm:left-5 sm:right-5 flex items-center justify-between text-white text-xs">
                <span className="px-3 py-1 rounded-md bg-amber-900/80 backdrop-blur-md text-amber-200 border border-amber-500/40 font-semibold">
                  {articlePageData.category}
                </span>
                <span className="text-amber-100/90 font-serif italic text-xs hidden sm:inline">
                  Classical Parashari Principles • Scripturally Verified Analysis
                </span>
              </div>
            </div>

            {/* Table of Contents & Executive Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <section className="md:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-3">
                <h2 className="text-xs font-bold uppercase tracking-wider text-amber-800 flex items-center space-x-2">
                  <Lightbulb className="w-4 h-4 text-amber-600" />
                  <span>Executive Astrological Summary</span>
                </h2>
                <p className="text-slate-800 text-sm leading-relaxed">{articlePageData.executiveSummary}</p>
              </section>

              <section className="bg-amber-50/50 rounded-2xl p-5 border border-amber-200/80 shadow-xs space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center space-x-2">
                  <List className="w-4 h-4 text-amber-700" />
                  <span>In This Article</span>
                </h3>
                <ul className="space-y-1.5 text-xs text-slate-700 font-medium">
                  {articlePageData.sections.map((sec, idx) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <span className="text-amber-700 font-bold">•</span>
                      <span className="line-clamp-1">{sec.title}</span>
                    </li>
                  ))}
                  <li className="flex items-start space-x-2 pt-1 border-t border-amber-200/60">
                    <span className="text-amber-700 font-bold">•</span>
                    <span>Frequently Asked Questions ({articlePageData.faqs.length})</span>
                  </li>
                </ul>
              </section>
            </div>

            {/* Main Article Sections */}
            <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-8">
              {articlePageData.sections.map((section, idx) => (
                <div key={idx} className="space-y-3 pb-6 border-b border-slate-100 last:border-0 last:pb-0">
                  <h2 className="font-serif text-xl sm:text-2xl font-bold text-slate-900 flex items-center space-x-2">
                    <span className="w-2 h-6 rounded-full bg-amber-600 inline-block mr-1"></span>
                    <span>{section.title}</span>
                  </h2>
                  <div className="text-slate-700 text-sm sm:text-base leading-relaxed whitespace-pre-line space-y-3">
                    {section.content}
                  </div>
                </div>
              ))}
            </section>

            {/* Clickable Astrological Element Cards */}
            <section className="bg-white rounded-2xl p-6 border border-amber-200/80 shadow-xs space-y-6">
              <h2 className="font-serif text-xl font-bold text-slate-900 flex items-center space-x-2">
                <Compass className="w-5 h-5 text-amber-700" />
                <span>Explore Related Jyotish Concepts</span>
              </h2>

              {/* Planets Row */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-amber-900 uppercase tracking-wider block">Planets (Navagraha)</span>
                <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-2">
                  {PLANETS.map((p) => (
                    <button
                      key={p.key}
                      onClick={() => handleOpenArticle(`${p.key}-in-vedic-astrology`)}
                      className="p-2.5 rounded-xl bg-slate-50 hover:bg-amber-50 border border-slate-200 hover:border-amber-300 text-center transition-all group cursor-pointer"
                    >
                      <span className="block font-bold text-slate-900 text-xs group-hover:text-amber-800">{p.name}</span>
                      <span className="block text-[10px] text-slate-500">{p.sanskrit}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Houses Row */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider block">Houses (Bhavas)</span>
                <div className="grid grid-cols-3 sm:grid-cols-6 md:grid-cols-12 gap-1.5">
                  {HOUSES.map((h) => (
                    <button
                      key={h.key}
                      onClick={() => handleOpenArticle(h.key)}
                      className="p-2 rounded-lg bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-center transition-all group cursor-pointer"
                    >
                      <span className="block font-extrabold text-slate-900 text-xs group-hover:text-emerald-800">{h.number}H</span>
                      <span className="block text-[9px] text-slate-500 truncate">{h.sanskrit}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Signs Row */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-cyan-900 uppercase tracking-wider block">Zodiac Signs (Rashis)</span>
                <div className="grid grid-cols-3 sm:grid-cols-6 md:grid-cols-12 gap-1.5">
                  {SIGNS.map((s) => (
                    <button
                      key={s.key}
                      onClick={() => handleOpenArticle(`${s.key}-ascendant`)}
                      className="p-2 rounded-lg bg-slate-50 hover:bg-cyan-50 border border-slate-200 hover:border-cyan-300 text-center transition-all group cursor-pointer"
                    >
                      <span className="block font-bold text-slate-900 text-xs group-hover:text-cyan-800">{s.name}</span>
                      <span className="block text-[9px] text-slate-500">{s.sanskrit}</span>
                    </button>
                  ))}
                </div>
              </div>
            </section>

            {/* Topic Cluster & Internal Links Engine */}
            <section className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-serif text-xl font-bold text-slate-900 flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-amber-700" />
                  <span>Topic Cluster & Interlinked Knowledge</span>
                </h2>
                <span className="text-xs font-medium text-slate-500">Related Canonical Articles</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {articlePageData.topicClusterLinks.map((link) => (
                  <button
                    key={link.slug}
                    onClick={() => handleOpenArticle(link.slug)}
                    className="p-3.5 rounded-xl bg-slate-50 hover:bg-amber-50 border border-slate-200 hover:border-amber-300 text-left transition-all group cursor-pointer"
                  >
                    <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block mb-1">
                      {link.category}
                    </span>
                    <h4 className="font-bold text-xs text-slate-900 group-hover:text-amber-800 line-clamp-1">
                      {link.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 line-clamp-2 mt-1">{link.description}</p>
                  </button>
                ))}
              </div>
            </section>

            {/* Automatic FAQ Accordion Section */}
            <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="font-serif text-2xl font-bold text-slate-900 flex items-center space-x-2">
                  <HelpCircle className="w-6 h-6 text-amber-700" />
                  <span>Frequently Asked Questions ({articlePageData.faqs.length} FAQs)</span>
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Classical answers based on Brihat Parashara Hora Shastra, Phaladeepika, and Jaimini Sutram.
                </p>
              </div>

              <div className="space-y-3">
                {articlePageData.faqs.map((faq, idx) => {
                  const isOpen = expandedFaqIndex === idx;
                  return (
                    <div key={idx} className="border border-slate-200 rounded-xl overflow-hidden">
                      <button
                        onClick={() => setExpandedFaqIndex(isOpen ? null : idx)}
                        className="w-full p-4 text-left font-bold text-sm text-slate-900 bg-slate-50 hover:bg-amber-50/50 flex items-center justify-between gap-3 transition-colors cursor-pointer"
                      >
                        <span>{faq.question}</span>
                        <ChevronRight className={`w-4 h-4 text-amber-700 transition-transform ${isOpen ? "rotate-90" : ""}`} />
                      </button>
                      {isOpen && (
                        <div className="p-4 bg-white text-xs sm:text-sm text-slate-700 leading-relaxed border-t border-slate-100">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>

            {/* References & Disclaimer */}
            <footer className="p-6 rounded-2xl bg-slate-100 border border-slate-200 space-y-3 text-xs text-slate-600">
              <div className="flex items-center space-x-2 text-slate-800 font-bold">
                <BookOpen className="w-4 h-4 text-amber-700" />
                <span>Scriptural References & Ethical Disclaimer</span>
              </div>
              <p>
                <strong>Classical References:</strong> Brihat Parashara Hora Shastra, Phaladeepika (Mantreshwara), Saravali (Kalyana Varma), Jaimini Sutram, and Bhrigu Samhita.
              </p>
              <p className="text-[11px] text-slate-500">
                <strong>Disclaimer:</strong> Astrological articles are provided for educational, historical, and self-reflection purposes.
              </p>
            </footer>
          </article>
        ) : (
          /* BLOG HUB INDEX VIEW - CLEAN & MINIMALIST EDITORIAL LAYOUT */
          <div className="space-y-10">
            {/* Minimalist Hero Header */}
            <header className="py-8 sm:py-12 border-b border-amber-200/60 space-y-6 text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-amber-50 border border-amber-200/80 text-amber-900 text-xs font-semibold">
                <BookOpen className="w-3.5 h-3.5 text-amber-700" />
                <span>Vedic Astrology Knowledge Journal</span>
              </div>

              <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Classical Jyotish Insights & Vedic Wisdom
              </h1>

              <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto font-normal">
                In-depth articles and research on Navagraha planets, Bhavas, Rashis, Nakshatras, Mahadasha cycles, and authentic Parashari remedies.
              </p>

              {/* Minimalist Search Bar */}
              <div className="relative max-w-lg mx-auto pt-2">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search articles e.g. Saturn 3rd house, Rahu Dasha..."
                    className="w-full pl-11 pr-10 py-3 rounded-2xl bg-white border border-slate-200 focus:border-amber-600 focus:ring-2 focus:ring-amber-100 text-xs sm:text-sm font-medium text-slate-900 placeholder-slate-400 outline-none transition-all shadow-xs"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Instant Search Results Dropdown */}
                {searchQuery.trim() && (
                  <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl border border-amber-200 shadow-xl z-30 max-h-96 overflow-y-auto divide-y divide-slate-100 text-left">
                    {searchResults.length > 0 ? (
                      searchResults.map((res) => (
                        <button
                          key={res.slug}
                          onClick={() => {
                            setSearchQuery("");
                            handleOpenArticle(res.slug);
                          }}
                          className="w-full p-4 hover:bg-amber-50/60 text-left transition-colors flex items-start justify-between gap-3 cursor-pointer"
                        >
                          <div>
                            <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block">
                              {res.category}
                            </span>
                            <h4 className="font-bold text-sm text-slate-900">{res.title}</h4>
                            <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{res.snippet}</p>
                          </div>
                          <ChevronRight className="w-4 h-4 text-amber-700 shrink-0 mt-1" />
                        </button>
                      ))
                    ) : (
                      <div className="p-6 text-center text-xs text-slate-500">
                        No articles found matching "{searchQuery}". Try searching "Saturn", "Jupiter", or "House".
                      </div>
                    )}
                  </div>
                )}
              </div>
            </header>

            {/* Featured Hero Article */}
            {displayArticles.length > 0 && activeCategory === "All" && !searchQuery && (
              <section className="space-y-3">
                <div className="flex items-center space-x-2 text-xs font-bold text-amber-900 uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                  <span>Featured Article</span>
                </div>
                <div
                  onClick={() => handleOpenArticle(displayArticles[0].slug)}
                  className="bg-white rounded-3xl overflow-hidden border border-amber-200/90 hover:border-amber-400 hover:shadow-lg transition-all cursor-pointer grid grid-cols-1 md:grid-cols-12 gap-0 group"
                >
                  <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3 text-xs">
                        <span className="px-3 py-1 rounded-full font-bold bg-amber-100 text-amber-900 border border-amber-200">
                          {displayArticles[0].category}
                        </span>
                        <span className="text-slate-500 flex items-center space-x-1 font-medium">
                          <Clock className="w-3.5 h-3.5 text-amber-700" />
                          <span>{displayArticles[0].readTime}</span>
                        </span>
                      </div>

                      <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-slate-900 group-hover:text-amber-800 transition-colors leading-tight">
                        {displayArticles[0].title}
                      </h2>

                      <p className="text-slate-600 text-sm leading-relaxed line-clamp-3">
                        {displayArticles[0].excerpt}
                      </p>
                    </div>

                    <div className="pt-2 flex items-center space-x-2 text-xs font-bold text-amber-800 group-hover:translate-x-1 transition-transform">
                      <span>Read Featured Article</span>
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>

                  <div className="md:col-span-5 relative h-56 md:h-full min-h-[220px] bg-slate-950 overflow-hidden">
                    <img
                      src={getArticleImageUrl(displayArticles[0].slug, displayArticles[0].category)}
                      alt={displayArticles[0].title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover opacity-90 transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-slate-950/60 via-transparent to-transparent" />
                  </div>
                </div>
              </section>
            )}

            {/* Clean Category Tabs */}
            <section className="flex items-center justify-between gap-4 border-b border-slate-200/80 pb-3 overflow-x-auto">
              <div className="flex items-center space-x-2">
                {["All", "Planets", "Houses", "Rashis", "Nakshatras", "Kundli Guides", "Daily Content"].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      activeCategory === cat
                        ? "bg-amber-800 text-white shadow-xs"
                        : "bg-slate-100 text-slate-700 hover:bg-amber-50 hover:text-amber-900"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {bookmarkedSlugs.length > 0 && (
                <button
                  onClick={() => setActiveCategory("Bookmarks")}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center space-x-1.5 ${
                    activeCategory === "Bookmarks"
                      ? "bg-amber-800 text-white"
                      : "bg-amber-50 text-amber-900 border border-amber-200"
                  }`}
                >
                  <BookMarked className="w-3.5 h-3.5" />
                  <span>Bookmarks ({bookmarkedSlugs.length})</span>
                </button>
              )}
            </section>

            {/* Articles Grid */}
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayArticles.map((art) => (
                <article
                  key={art.slug}
                  onClick={() => handleOpenArticle(art.slug)}
                  className="bg-white rounded-2xl overflow-hidden border border-slate-200/90 hover:border-amber-300 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
                >
                  {/* Article Card Thumbnail Image */}
                  <div className="relative h-44 sm:h-48 bg-slate-950 overflow-hidden">
                    <img
                      src={getArticleImageUrl(art.slug, art.category)}
                      alt={art.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover opacity-90 transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                    <span className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md text-amber-200 border border-amber-500/30 px-2.5 py-0.5 rounded-md text-[11px] font-bold">
                      {art.category}
                    </span>
                    <span className="absolute bottom-3 right-3 text-slate-200 text-[11px] font-medium bg-slate-950/70 backdrop-blur-md px-2 py-0.5 rounded">
                      {art.readTime}
                    </span>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <h3 className="font-serif text-base sm:text-lg font-bold text-slate-900 group-hover:text-amber-800 transition-colors line-clamp-2 leading-snug">
                        {art.title}
                      </h3>

                      <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">{art.excerpt}</p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
                      <span>{art.publishedAt}</span>
                      <span className="font-bold text-amber-800 group-hover:translate-x-1 transition-transform flex items-center space-x-1">
                        <span>Read</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </section>
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="mt-16 bg-white border-t border-slate-200 px-4 py-8 text-xs text-slate-500 text-center space-y-3">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2 font-serif text-sm font-bold text-slate-900">
            <BookOpen className="w-4 h-4 text-amber-700" />
            <span>Vedanga Astrology Journal</span>
          </div>
          <div>© 2026 Vedanga Journal. Authentic Parashari Vedic Astrology Insights.</div>
        </div>
      </footer>
    </div>
  );
};

