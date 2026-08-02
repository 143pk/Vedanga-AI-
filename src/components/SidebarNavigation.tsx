import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Home,
  Flame,
  Newspaper,
  Star,
  Calendar,
  Sun,
  Moon,
  Sunrise,
  MoonStar,
  Globe,
  Orbit,
  Clock,
  CheckCircle2,
  Grid,
  Award,
  SunMedium,
  CircleDot,
  Layers,
  Sparkles,
  Hourglass,
  Gem,
  ShieldCheck,
  Volume2,
  CalendarDays,
  BookOpen,
  Briefcase,
  Heart,
  Coins,
  Activity,
  Plane,
  User,
  Building,
  Crown,
  AlertTriangle,
  HelpCircle,
  BookMarked,
  Search,
  ChevronDown,
  ChevronRight,
  X,
  Bookmark,
  TrendingUp,
  History,
  Menu,
  ChevronLeft
} from "lucide-react";
import { PLANETS, HOUSES, SIGNS, NAKSHATRAS } from "../seo/astrologyData";

export interface SidebarNavigationProps {
  activeSlug: string | null;
  activeCategory: string;
  activeTopicKey?: string | null;
  onSelectSlug: (slug: string) => void;
  onSelectCategory: (category: string) => void;
  onSelectTopic: (category: string, topicKey: string) => void;
  onGoHome: () => void;
  bookmarkedSlugs: string[];
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  isCollapsedDesktop: boolean;
  onToggleCollapseDesktop: () => void;
}

interface NavItem {
  id: string;
  label: string;
  categoryId?: string;
  topicKey?: string;
  slug?: string;
  category?: string;
  icon: React.ElementType;
  badge?: string;
  count?: number;
  children?: {
    id: string;
    label: string;
    categoryId: string;
    topicKey: string;
    slug?: string;
    badge?: string;
  }[];
}

export const SidebarNavigation: React.FC<SidebarNavigationProps> = ({
  activeSlug,
  activeCategory,
  activeTopicKey,
  onSelectSlug,
  onSelectCategory,
  onSelectTopic,
  onGoHome,
  bookmarkedSlugs,
  isOpenMobile,
  onCloseMobile,
  isCollapsedDesktop,
  onToggleCollapseDesktop,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    "daily-astrology": true,
    "daily-horoscope": false,
    planets: false,
    houses: false,
    "zodiac-signs": false,
    nakshatras: false,
    dashas: false,
  });

  // Load recently viewed from localStorage
  const [recentlyViewed, setRecentlyViewed] = useState<{ slug: string; title: string; date: string }[]>(() => {
    try {
      const saved = localStorage.getItem("vedanga_recently_viewed");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Synchronize active section expansion when activeSlug changes
  useEffect(() => {
    if (!activeSlug) return;
    const s = activeSlug.toLowerCase();

    if (s.includes("daily") || s.includes("panchang") || s.includes("tithi") || s.includes("rahu") || s.includes("choghadiya")) {
      setExpandedSections((prev) => ({ ...prev, "daily-astrology": true }));
    } else if (s.includes("horoscope")) {
      setExpandedSections((prev) => ({ ...prev, "daily-horoscope": true }));
    } else if (PLANETS.some((p) => s.includes(p.key) || s.includes(p.name.toLowerCase()))) {
      setExpandedSections((prev) => ({ ...prev, planets: true }));
    } else if (HOUSES.some((h) => s.includes(`${h.number}th`) || s.includes(h.key))) {
      setExpandedSections((prev) => ({ ...prev, houses: true }));
    } else if (SIGNS.some((sg) => s.includes(sg.key) || s.includes(sg.name.toLowerCase()))) {
      setExpandedSections((prev) => ({ ...prev, "zodiac-signs": true }));
    } else if (NAKSHATRAS.some((n) => s.includes(n.key) || s.includes(n.name.toLowerCase()))) {
      setExpandedSections((prev) => ({ ...prev, nakshatras: true }));
    } else if (s.includes("dasha") || s.includes("mahadasha") || s.includes("antardasha")) {
      setExpandedSections((prev) => ({ ...prev, dashas: true }));
    }
  }, [activeSlug]);

  const toggleSection = (id: string) => {
    setExpandedSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const clearRecentlyViewed = (e: React.MouseEvent) => {
    e.stopPropagation();
    setRecentlyViewed([]);
    localStorage.removeItem("vedanga_recently_viewed");
  };

  // Build the navigation items tree
  const navTree: NavItem[] = useMemo(() => {
    return [
      { id: "home", label: "Home", categoryId: "home", icon: Home },
      { id: "trending", label: "Trending Today", categoryId: "trending", icon: Flame, badge: "HOT" },
      { id: "latest", label: "Latest Articles", categoryId: "latest", icon: Newspaper, count: 24 },
      { id: "popular", label: "Most Popular", categoryId: "popular", icon: Star, count: 18 },

      {
        id: "daily-astrology",
        label: "Daily Astrology",
        icon: Calendar,
        count: 13,
        children: [
          { id: "daily-panchang", label: "Today's Panchang", categoryId: "daily-astrology", topicKey: "daily-panchang", badge: "Today" },
          { id: "daily-nakshatra", label: "Today's Nakshatra", categoryId: "daily-astrology", topicKey: "daily-nakshatra" },
          { id: "daily-tithi", label: "Today's Tithi", categoryId: "daily-astrology", topicKey: "daily-tithi" },
          { id: "daily-sunrise-sunset", label: "Today's Sunrise & Sunset", categoryId: "daily-astrology", topicKey: "daily-sunrise-sunset" },
          { id: "daily-moonrise-moonset", label: "Today's Moonrise & Moonset", categoryId: "daily-astrology", topicKey: "daily-moonrise-moonset" },
          { id: "daily-planetary-positions", label: "Today's Planetary Positions", categoryId: "daily-astrology", topicKey: "daily-planetary-positions" },
          { id: "daily-planetary-transits", label: "Today's Planetary Transits", categoryId: "daily-astrology", topicKey: "daily-planetary-transits" },
          { id: "daily-rahu-kaal", label: "Today's Rahu Kaal", categoryId: "daily-astrology", topicKey: "daily-rahu-kaal" },
          { id: "daily-gulika-kaal", label: "Today's Gulika Kaal", categoryId: "daily-astrology", topicKey: "daily-gulika-kaal" },
          { id: "daily-yamaganda-kaal", label: "Today's Yamaganda Kaal", categoryId: "daily-astrology", topicKey: "daily-yamaganda-kaal" },
          { id: "daily-abhijit-muhurat", label: "Today's Abhijit Muhurat", categoryId: "daily-astrology", topicKey: "daily-abhijit-muhurat" },
          { id: "daily-choghadiya", label: "Today's Choghadiya", categoryId: "daily-astrology", topicKey: "daily-choghadiya" },
          { id: "daily-festivals-vrats", label: "Today's Festivals & Vrats", categoryId: "daily-astrology", topicKey: "daily-festivals-vrats" },
        ],
      },

      {
        id: "daily-horoscope",
        label: "Daily Horoscope",
        icon: SunMedium,
        count: 12,
        children: SIGNS.map((s) => ({
          id: `${s.key}-horoscope`,
          label: `${s.name} (${s.sanskrit})`,
          categoryId: "daily-horoscope",
          topicKey: s.key,
        })),
      },

      {
        id: "planets",
        label: "Planets",
        icon: CircleDot,
        count: PLANETS.length,
        children: PLANETS.map((p) => ({
          id: p.key,
          label: `${p.name} (${p.sanskrit})`,
          categoryId: "planets",
          topicKey: p.key,
        })),
      },

      {
        id: "houses",
        label: "Houses",
        icon: Layers,
        count: HOUSES.length,
        children: HOUSES.map((h) => ({
          id: h.key,
          label: `${h.number}${h.number === 1 ? "st" : h.number === 2 ? "nd" : h.number === 3 ? "rd" : "th"} House (${h.sanskrit})`,
          categoryId: "houses",
          topicKey: h.key,
        })),
      },

      {
        id: "zodiac-signs",
        label: "Zodiac Signs",
        icon: Sparkles,
        count: SIGNS.length,
        children: SIGNS.map((s) => ({
          id: `${s.key}-sign`,
          label: `${s.name} (${s.sanskrit})`,
          categoryId: "zodiac-signs",
          topicKey: s.key,
        })),
      },

      {
        id: "nakshatras",
        label: "Nakshatras",
        icon: Moon,
        count: NAKSHATRAS.length,
        children: NAKSHATRAS.map((n) => ({
          id: n.key,
          label: `${n.number}. ${n.name}`,
          categoryId: "nakshatras",
          topicKey: n.key,
        })),
      },

      {
        id: "dashas",
        label: "Dashas",
        icon: Hourglass,
        count: 3,
        children: [
          { id: "mahadasha", label: "Mahadasha Analysis", categoryId: "dashas", topicKey: "mahadasha" },
          { id: "antardasha", label: "Antardasha Guide", categoryId: "dashas", topicKey: "antardasha" },
          { id: "pratyantar", label: "Pratyantar Dasha", categoryId: "dashas", topicKey: "pratyantar" },
        ],
      },

      { id: "planetary-transits", label: "Planetary Transits", categoryId: "planetary-transits", icon: Orbit, count: 14 },
      { id: "gemstones", label: "Gemstones", categoryId: "gemstones", icon: Gem, count: 9 },
      { id: "remedies", label: "Remedies", categoryId: "remedies", icon: ShieldCheck, count: 12 },
      { id: "mantras", label: "Mantras", categoryId: "mantras", icon: Volume2, count: 15 },
      { id: "vrat-festivals", label: "Vrat & Festivals", categoryId: "vrat-festivals", icon: CalendarDays, count: 21 },
      { id: "muhurat", label: "Muhurat", categoryId: "muhurat", icon: Clock, count: 10 },
      { id: "astrology-learning", label: "Astrology Learning", categoryId: "astrology-learning", icon: BookOpen, count: 32 },
      { id: "career-astrology", label: "Career Astrology", categoryId: "career-astrology", icon: Briefcase, count: 11 },
      { id: "marriage-astrology", label: "Marriage Astrology", categoryId: "marriage-astrology", icon: Heart, count: 14 },
      { id: "finance-astrology", label: "Finance Astrology", categoryId: "finance-astrology", icon: Coins, count: 12 },
      { id: "health-astrology", label: "Health Astrology", categoryId: "health-astrology", icon: Activity, count: 8 },
      { id: "foreign-travel", label: "Foreign Travel", categoryId: "foreign-travel", icon: Plane, count: 7 },
      { id: "child-astrology", label: "Child Astrology", categoryId: "child-astrology", icon: User, count: 9 },
      { id: "property-astrology", label: "Property Astrology", categoryId: "property-astrology", icon: Building, count: 6 },
      { id: "raj-yogas", label: "Raj Yogas", categoryId: "raj-yogas", icon: Crown, count: 16 },
      { id: "doshas", label: "Doshas", categoryId: "doshas", icon: AlertTriangle, count: 11 },
      { id: "astrology-faqs", label: "Astrology FAQs", categoryId: "astrology-faqs", icon: HelpCircle, count: 45 },
      { id: "astrology-encyclopedia", label: "Astrology Encyclopedia", categoryId: "astrology-encyclopedia", icon: BookMarked, count: 108 },
    ];
  }, []);

  // Auto expand the current active category in sidebar
  useEffect(() => {
    if (activeCategory) {
      const matchingItem = navTree.find(
        (item) =>
          item.categoryId === activeCategory ||
          item.id === activeCategory ||
          item.children?.some((c) => c.categoryId === activeCategory || c.topicKey === activeTopicKey)
      );
      if (matchingItem) {
        setExpandedSections((prev) => ({
          ...prev,
          [matchingItem.id]: true,
        }));
      } else {
        setExpandedSections((prev) => ({
          ...prev,
          [activeCategory]: true,
        }));
      }
    }
  }, [activeCategory, activeTopicKey, navTree]);

  // Filter navigation items based on search query
  const filteredTree = useMemo(() => {
    if (!searchQuery.trim()) return navTree;
    const q = searchQuery.toLowerCase().trim();

    return navTree
      .map((item) => {
        const matchesParent = item.label.toLowerCase().includes(q);
        const matchingChildren = item.children?.filter((c) => c.label.toLowerCase().includes(q) || (c.slug && c.slug.includes(q)));

        if (matchesParent || (matchingChildren && matchingChildren.length > 0)) {
          return {
            ...item,
            children: matchingChildren && matchingChildren.length > 0 ? matchingChildren : item.children,
          };
        }
        return null;
      })
      .filter(Boolean) as NavItem[];
  }, [navTree, searchQuery]);

  const handleItemClick = (opts: { slug?: string; categoryId?: string; topicKey?: string; id?: string }) => {
    const { slug, categoryId, topicKey, id } = opts;

    if (id === "home") {
      onGoHome();
    } else if (id === "trending") {
      onSelectCategory("trending");
    } else if (id === "latest") {
      onSelectCategory("latest");
    } else if (id === "popular") {
      onSelectCategory("popular");
    } else if (categoryId && topicKey) {
      onSelectTopic(categoryId, topicKey);
    } else if (categoryId) {
      onSelectCategory(categoryId);
    } else if (id) {
      onSelectCategory(id);
    } else if (slug) {
      onSelectSlug(slug);
    }

    if (isOpenMobile) {
      onCloseMobile();
    }
  };

  const trendingPills = [
    { label: "Saturn in 3rd House", slug: "saturn-in-3rd-house" },
    { label: "Venus in Pisces", slug: "venus-in-pisces" },
    { label: "AI Kundli Generator", slug: "ai-kundli" },
    { label: "Daily Panchang", slug: "daily-panchang" },
  ];

  const sidebarContent = (
    <div className="h-full flex flex-col bg-white border-r border-amber-200/80 shadow-xs select-none">
      {/* Sidebar Header & Brand Logo */}
      <div className="p-3.5 border-b border-amber-200/70 flex items-center justify-between gap-2 shrink-0 bg-gradient-to-b from-amber-50/60 to-white">
        {!isCollapsedDesktop ? (
          <button
            onClick={onGoHome}
            className="flex items-center space-x-2.5 text-left group hover:opacity-85 transition-opacity cursor-pointer"
            title="Go to Vedanga Astrology Journal Home"
          >
            <div className="w-8 h-8 rounded-xl bg-amber-600 p-[1.5px] shadow-xs">
              <div className="w-full h-full bg-white rounded-[9px] flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-amber-700 group-hover:scale-105 transition-transform" />
              </div>
            </div>
            <div>
              <span className="font-serif text-sm font-bold text-slate-900 block leading-tight group-hover:text-amber-800 transition-colors">
                Vedanga Navigation
              </span>
              <span className="text-[10px] text-amber-800 font-semibold block">
                Classical Jyotish Index
              </span>
            </div>
          </button>
        ) : (
          <button
            onClick={onGoHome}
            className="w-full flex justify-center py-1 group cursor-pointer"
            title="Go to Home"
          >
            <BookOpen className="w-5 h-5 text-amber-700 group-hover:scale-110 transition-transform" />
          </button>
        )}

        {/* Desktop Collapse Toggle */}
        <button
          onClick={onToggleCollapseDesktop}
          className="hidden lg:flex p-1.5 rounded-lg bg-slate-100 hover:bg-amber-100 text-slate-600 hover:text-amber-900 transition-colors cursor-pointer"
          title={isCollapsedDesktop ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          <ChevronLeft className={`w-4 h-4 transition-transform duration-300 ${isCollapsedDesktop ? "rotate-180" : ""}`} />
        </button>

        {/* Mobile Close Toggle */}
        <button
          onClick={onCloseMobile}
          className="lg:hidden p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
          title="Close Navigation"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {!isCollapsedDesktop && (
        <>
          {/* Top Search Input */}
          <div className="p-3 border-b border-slate-100 shrink-0 bg-slate-50/50">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search categories, planets, signs..."
                className="w-full pl-8 pr-7 py-1.5 rounded-xl bg-white border border-slate-200 focus:border-amber-600 focus:ring-1 focus:ring-amber-200 text-xs text-slate-800 placeholder-slate-400 outline-none transition-all shadow-xs"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

          {/* Quick Trending Banner */}
          {!searchQuery && (
            <div className="px-3 py-2 border-b border-amber-100 bg-amber-50/40 shrink-0">
              <div className="flex items-center justify-between text-[11px] font-bold text-amber-900 uppercase tracking-wider mb-1.5">
                <span className="flex items-center space-x-1">
                  <Flame className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
                  <span>Trending Topics</span>
                </span>
                <span className="text-[10px] text-amber-700 font-normal">Hot</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {trendingPills.map((p) => (
                  <button
                    key={p.slug}
                    onClick={() => handleItemClick({ categoryId: "planets", topicKey: p.slug.split("-")[0] })}
                    className="px-2 py-0.5 rounded-md bg-white hover:bg-amber-100 border border-amber-200/80 text-[10px] font-semibold text-slate-800 hover:text-amber-900 transition-all cursor-pointer truncate max-w-[130px]"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Main Scrollable Navigation Tree */}
      <div className="flex-1 overflow-y-auto px-2 py-3 space-y-1 custom-scrollbar">
        {filteredTree.map((item) => {
          const Icon = item.icon;
          const isParentActive = activeCategory === (item.categoryId || item.id);
          const isExpanded = expandedSections[item.id] || searchQuery.length > 0;
          const hasChildren = item.children && item.children.length > 0;

          if (isCollapsedDesktop) {
            return (
              <button
                key={item.id}
                onClick={() => handleItemClick({ categoryId: item.categoryId || item.id, id: item.id, slug: item.slug })}
                className={`w-full p-2.5 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                  isParentActive
                    ? "bg-amber-800 text-white font-bold shadow-xs"
                    : "text-slate-600 hover:bg-amber-50 hover:text-amber-900"
                }`}
                title={item.label}
              >
                <Icon className="w-4 h-4 shrink-0" />
              </button>
            );
          }

          return (
            <div key={item.id} className="space-y-0.5">
              <button
                onClick={() => {
                  if (hasChildren) {
                    toggleSection(item.id);
                  }
                  handleItemClick({ categoryId: item.categoryId || item.id, id: item.id, slug: item.slug });
                }}
                className={`w-full px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-all cursor-pointer group ${
                  isParentActive
                    ? "bg-amber-800 text-white shadow-xs font-bold"
                    : "text-slate-700 hover:bg-amber-50 hover:text-amber-900"
                }`}
              >
                <div className="flex items-center space-x-2.5 truncate">
                  <Icon className={`w-4 h-4 shrink-0 ${isParentActive ? "text-white" : "text-amber-700 group-hover:text-amber-800"}`} />
                  <span className="truncate">{item.label}</span>
                </div>

                <div className="flex items-center space-x-1.5 shrink-0">
                  {item.badge && (
                    <span className="px-1.5 py-0.2 rounded bg-amber-200 text-amber-950 font-extrabold text-[9px] uppercase tracking-wider">
                      {item.badge}
                    </span>
                  )}
                  {item.count !== undefined && (
                    <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                      isParentActive ? "bg-amber-900/60 text-white" : "bg-slate-100 text-slate-500 group-hover:bg-amber-100 group-hover:text-amber-900"
                    }`}>
                      {item.count}
                    </span>
                  )}
                  {hasChildren && (
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`} />
                  )}
                </div>
              </button>

              {/* Submenu Accordion Render */}
              <AnimatePresence>
                {hasChildren && isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="pl-6 pr-1 py-1 space-y-0.5 border-l-2 border-amber-200/60 ml-3 my-0.5 overflow-hidden"
                  >
                    {item.children!.map((child) => {
                      const isChildActive = activeTopicKey === child.topicKey || activeSlug === child.slug;
                      return (
                        <button
                          key={child.id}
                          onClick={() => handleItemClick({ categoryId: child.categoryId, topicKey: child.topicKey, slug: child.slug, id: child.id })}
                          className={`w-full px-2.5 py-1 rounded-lg text-[11px] font-medium flex items-center justify-between transition-all cursor-pointer ${
                            isChildActive
                              ? "bg-amber-100 text-amber-950 font-bold border-l-2 border-amber-800"
                              : "text-slate-600 hover:text-amber-900 hover:bg-amber-50/70"
                          }`}
                        >
                          <span className="truncate">{child.label}</span>
                          {child.badge && (
                            <span className="px-1 py-0.2 text-[8px] font-extrabold bg-emerald-100 text-emerald-900 rounded">
                              {child.badge}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}

        {!isCollapsedDesktop && (
          <>
            {/* Recently Viewed Block */}
            {recentlyViewed.length > 0 && (
              <div className="pt-3 mt-3 border-t border-slate-200 space-y-1.5">
                <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 uppercase tracking-wider px-2">
                  <span className="flex items-center space-x-1">
                    <History className="w-3 h-3 text-amber-700" />
                    <span>Recently Viewed</span>
                  </span>
                  <button
                    onClick={clearRecentlyViewed}
                    className="text-[9px] text-amber-700 hover:underline cursor-pointer"
                  >
                    Clear
                  </button>
                </div>
                {recentlyViewed.slice(0, 4).map((rv) => (
                  <button
                    key={rv.slug}
                    onClick={() => handleItemClick(rv.slug)}
                    className="w-full text-left px-2 py-1 rounded-lg hover:bg-amber-50 text-[11px] text-slate-700 truncate block font-medium transition-colors"
                  >
                    • {rv.title}
                  </button>
                ))}
              </div>
            )}

            {/* Bookmarks Quick Link */}
            {bookmarkedSlugs.length > 0 && (
              <div className="pt-2 mt-2 border-t border-slate-200 px-2">
                <button
                  onClick={() => onSelectCategory("Bookmarks")}
                  className="w-full px-2.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 text-xs font-bold flex items-center justify-between transition-all cursor-pointer"
                >
                  <span className="flex items-center space-x-1.5">
                    <Bookmark className="w-3.5 h-3.5 text-amber-700 fill-amber-700" />
                    <span>Saved Bookmarks</span>
                  </span>
                  <span className="px-1.5 py-0.2 rounded-full bg-amber-800 text-white text-[10px]">
                    {bookmarkedSlugs.length}
                  </span>
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Footer Meta inside Sidebar */}
      {!isCollapsedDesktop && (
        <div className="p-3 border-t border-slate-200 text-[10px] text-slate-500 text-center bg-slate-50/80 shrink-0">
          <span className="font-semibold text-slate-700">Vedanga Astrology v2.5</span>
          <p className="text-[9px] text-slate-400 mt-0.5">Sidereal Lahiri Ayanamsha Active</p>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* DESKTOP STICKY SIDEBAR */}
      <aside
        className={`hidden lg:block sticky top-16 h-[calc(100vh-4rem)] z-30 transition-all duration-300 shrink-0 ${
          isCollapsedDesktop ? "w-16" : "w-72"
        }`}
      >
        {sidebarContent}
      </aside>

      {/* MOBILE DRAWER OVERLAY */}
      <AnimatePresence>
        {isOpenMobile && (
          <>
            {/* Backdrop Mask */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onCloseMobile}
              className="lg:hidden fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50"
            />

            {/* Sliding Drawer Container */}
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 250 }}
              className="lg:hidden fixed top-0 left-0 bottom-0 w-80 max-w-[85vw] z-50 shadow-2xl"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
