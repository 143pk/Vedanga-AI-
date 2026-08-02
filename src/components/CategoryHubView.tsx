import React, { useState, useMemo } from "react";
import { motion } from "motion/react";
import { BreadcrumbNav, BreadcrumbItem } from "./BreadcrumbNav";
import { AdsterraBanner } from "./AdsterraBanner";
import {
  BookOpen,
  Search,
  Sparkles,
  Flame,
  Clock,
  Eye,
  Star,
  ChevronRight,
  Tag,
  ArrowRight,
  TrendingUp,
  Layers,
  CircleDot,
  Calendar,
  SunMedium,
  Moon,
  Hourglass,
  Gem,
  ShieldCheck,
  Briefcase,
  Heart,
  Coins,
  Activity,
  Award,
  Filter,
  CheckCircle2,
  Share2,
  Bookmark
} from "lucide-react";
import {
  getCategoryHubInfo,
  getSubTopicHubInfo,
  getArticlesForCategory,
  ArticleCard,
  TopicCard
} from "../seo/categoryHubData";

export interface CategoryHubViewProps {
  categoryId: string; // e.g. "planets", "daily-astrology", "houses", "nakshatras", "daily-horoscope", "career-astrology", "marriage-astrology", etc.
  topicKey?: string; // Optional sub-topic key like "saturn", "1st-house", "aries", "ashwini"
  onSelectSlug: (slug: string) => void;
  onSelectTopic: (categoryId: string, topicKey: string) => void;
  onSelectCategory: (categoryId: string) => void;
  onGoHome: () => void;
  bookmarkedSlugs: string[];
  onToggleBookmark: (slug: string, e: React.MouseEvent) => void;
}

export const CategoryHubView: React.FC<CategoryHubViewProps> = ({
  categoryId,
  topicKey,
  onSelectSlug,
  onSelectTopic,
  onSelectCategory,
  onGoHome,
  bookmarkedSlugs,
  onToggleBookmark,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "featured" | "trending" | "latest">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Retrieve metadata for Category Hub or Sub-Topic Hub
  const hubData = useMemo(() => {
    if (topicKey) {
      return getSubTopicHubInfo(categoryId, topicKey);
    }
    return getCategoryHubInfo(categoryId);
  }, [categoryId, topicKey]);

  // Retrieve matching articles
  const articles = useMemo(() => {
    return getArticlesForCategory(categoryId, topicKey);
  }, [categoryId, topicKey]);

  // Filter articles based on search & tab
  const filteredArticles = useMemo(() => {
    let result = articles;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.snippet.toLowerCase().includes(q) ||
          a.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    if (activeTab === "featured") {
      result = result.filter((a) => a.featured);
    } else if (activeTab === "trending") {
      result = result.filter((a) => a.trending);
    } else if (activeTab === "latest") {
      result = [...result].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }

    return result;
  }, [articles, searchQuery, activeTab]);

  // Pagination slice
  const totalPages = Math.ceil(filteredArticles.length / itemsPerPage) || 1;
  const paginatedArticles = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredArticles.slice(start, start + itemsPerPage);
  }, [filteredArticles, currentPage]);

  const featuredArticles = useMemo(() => articles.filter((a) => a.featured), [articles]);
  const trendingArticles = useMemo(() => articles.filter((a) => a.trending), [articles]);
  const mostReadArticles = useMemo(() => [...articles].sort((a, b) => b.views - a.views).slice(0, 4), [articles]);

  // Dynamic Breadcrumbs structure
  const breadcrumbItems = useMemo(() => {
    const items: BreadcrumbItem[] = [
      { label: "Home", onClick: onGoHome, url: "/" }
    ];

    if (topicKey) {
      items.push({
        label: hubData.categoryTitle || "Category",
        onClick: () => onSelectCategory(categoryId),
        url: `/category/${categoryId}`
      });
      items.push({
        label: hubData.title,
        isCurrent: true,
        url: `/topic/${topicKey}`
      });
    } else {
      items.push({
        label: hubData.categoryTitle || hubData.title,
        isCurrent: true,
        url: `/category/${categoryId}`
      });
    }

    return items;
  }, [onGoHome, onSelectCategory, categoryId, topicKey, hubData]);

  // Schema structured data for CollectionPage
  const schemaJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: hubData.title,
    headline: hubData.heroHeadline,
    description: hubData.heroSubheadline,
    url: typeof window !== "undefined" ? window.location.href : "https://vedanga-ai.vercel.app",
    mainEntity: {
      "@type": "ItemList",
      itemListElement: articles.map((art, idx) => ({
        "@type": "ListItem",
        position: idx + 1,
        name: art.title,
        url: `https://vedanga-ai.vercel.app/article/${art.slug}`
      }))
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* JSON-LD Structured Data Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJsonLd) }}
      />

      {/* BREADCRUMB NAVIGATION */}
      <BreadcrumbNav items={breadcrumbItems} />

      {/* HERO BANNER SECTION */}
      <div className="relative rounded-3xl bg-gradient-to-br from-amber-950 via-amber-900 to-slate-950 text-white p-6 sm:p-10 shadow-xl overflow-hidden border border-amber-800/40">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-200 border border-amber-400/30 text-xs font-extrabold uppercase tracking-wider flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
              <span>{hubData.sanskritTitle || "Jyotish Hub"}</span>
            </span>
            <span className="text-xs text-amber-300/80 font-medium">
              Classical Sidereal Analysis
            </span>
          </div>

          <h1 className="font-serif text-2xl sm:text-4xl font-bold tracking-tight text-amber-50 leading-tight">
            {hubData.heroHeadline}
          </h1>

          <p className="text-sm sm:text-base text-amber-100/90 leading-relaxed font-sans">
            {hubData.heroSubheadline}
          </p>

          {/* Quick Search within Category */}
          <div className="pt-2">
            <div className="relative max-w-xl">
              <Search className="w-4 h-4 text-amber-300 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder={`Search within ${hubData.title}...`}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-amber-950/70 border border-amber-600/50 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30 text-xs sm:text-sm text-white placeholder-amber-200/60 outline-none transition-all shadow-inner"
              />
            </div>
          </div>
        </div>
      </div>

      {/* TOPIC CARDS / SUB-CATEGORIES GRID */}
      {hubData.subTopics && hubData.subTopics.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-lg sm:text-xl font-bold text-slate-900 flex items-center space-x-2">
              <Layers className="w-5 h-5 text-amber-700" />
              <span>Explore Sub-Topics & Cards</span>
            </h2>
            <span className="text-xs text-slate-500 font-semibold">
              {hubData.subTopics.length} Categories Available
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {hubData.subTopics.map((topic) => (
              <div
                key={topic.id}
                onClick={() => {
                  if (topic.slug) {
                    onSelectSlug(topic.slug);
                  } else if (topic.topicKey) {
                    onSelectTopic(categoryId, topic.topicKey);
                  }
                }}
                className="p-4 rounded-2xl bg-white border border-amber-200/80 hover:border-amber-500 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between space-y-2.5"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-serif text-sm font-bold text-slate-900 group-hover:text-amber-800 transition-colors flex items-center space-x-1.5">
                      <span>{topic.title}</span>
                    </span>
                    {topic.badge && (
                      <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-extrabold text-[9px] uppercase tracking-wider">
                        {topic.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {topic.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[11px] font-semibold text-amber-800 group-hover:text-amber-950">
                  <span className="flex items-center space-x-1">
                    <span>Explore Topic</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                  {topic.count !== undefined && (
                    <span className="text-slate-400 font-normal">
                      {topic.count} Articles
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* DETAILED CATEGORY INTRODUCTION (500 - 1000 WORDS CLASSICAL ESSAY) */}
      <section className="p-6 sm:p-8 rounded-3xl bg-amber-50/50 border border-amber-200/80 space-y-4">
        <div className="flex items-center space-x-2 text-amber-900">
          <BookOpen className="w-5 h-5 text-amber-700" />
          <h2 className="font-serif text-lg sm:text-xl font-bold">
            Classical Overview & Astronomical Principles
          </h2>
        </div>

        <div className="prose prose-amber max-w-none text-slate-800 text-xs sm:text-sm leading-relaxed space-y-3 font-sans">
          {hubData.introductionContent.map((paragraph, idx) => (
            <p key={idx}>{paragraph}</p>
          ))}
        </div>

        {/* Popular Tags */}
        <div className="pt-3 border-t border-amber-200/60 flex flex-wrap items-center gap-1.5">
          <Tag className="w-3.5 h-3.5 text-amber-700 mr-1" />
          <span className="text-xs font-bold text-slate-700 mr-1">Popular Tags:</span>
          {hubData.tags.map((tag) => (
            <button
              key={tag}
              onClick={() => {
                setSearchQuery(tag);
                setCurrentPage(1);
              }}
              className="px-2.5 py-1 rounded-lg bg-white hover:bg-amber-100 border border-amber-200 text-slate-700 text-[11px] font-semibold transition-colors cursor-pointer"
            >
              #{tag}
            </button>
          ))}
        </div>
      </section>

      {/* FEATURED & TRENDING ARTICLES CAROUSEL / HIGHLIGHTS */}
      {featuredArticles.length > 0 && !searchQuery && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-lg sm:text-xl font-bold text-slate-900 flex items-center space-x-2">
              <Star className="w-5 h-5 text-amber-500 fill-amber-400" />
              <span>Featured Research Articles</span>
            </h2>
            <span className="text-xs text-amber-800 font-semibold">Handpicked</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {featuredArticles.slice(0, 2).map((article) => {
              const isBookmarked = bookmarkedSlugs.includes(article.slug);
              return (
                <div
                  key={article.slug}
                  onClick={() => onSelectSlug(article.slug)}
                  className="p-5 rounded-3xl bg-gradient-to-br from-amber-900 to-amber-950 text-white border border-amber-700/60 hover:shadow-xl transition-all cursor-pointer group flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-200 border border-amber-400/30 text-[10px] font-extrabold uppercase tracking-wider">
                        Featured Research
                      </span>
                      <button
                        onClick={(e) => onToggleBookmark(article.slug, e)}
                        className="p-1 rounded-lg hover:bg-amber-800/60 text-amber-300 transition-colors"
                        title={isBookmarked ? "Remove Bookmark" : "Save Bookmark"}
                      >
                        <Bookmark className={`w-4 h-4 ${isBookmarked ? "fill-amber-400" : ""}`} />
                      </button>
                    </div>

                    <h3 className="font-serif text-base sm:text-lg font-bold group-hover:text-amber-300 transition-colors leading-snug">
                      {article.title}
                    </h3>

                    <p className="text-xs text-amber-100/80 line-clamp-2 leading-relaxed">
                      {article.snippet}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-amber-800/60 text-[11px] text-amber-300/90 font-medium">
                    <div className="flex items-center space-x-3">
                      <span className="flex items-center space-x-1">
                        <Clock className="w-3.5 h-3.5 text-amber-400" />
                        <span>{article.readTime}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Eye className="w-3.5 h-3.5 text-amber-400" />
                        <span>{article.views.toLocaleString()} views</span>
                      </span>
                    </div>

                    <span className="flex items-center space-x-1 font-bold group-hover:translate-x-1 transition-transform">
                      <span>Read Article</span>
                      <ChevronRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Adsterra Banner */}
      <AdsterraBanner label="Sponsored Ad" />

      {/* ALL ARTICLES LISTING & FILTER TABS */}
      <section className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
          <div className="flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-amber-700" />
            <h2 className="font-serif text-lg sm:text-xl font-bold text-slate-900">
              Articles Directory
            </h2>
            <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs font-bold">
              {filteredArticles.length}
            </span>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold text-slate-600">
            <button
              onClick={() => {
                setActiveTab("all");
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === "all" ? "bg-white text-amber-900 font-bold shadow-xs" : "hover:text-slate-900"
              }`}
            >
              All Articles
            </button>
            <button
              onClick={() => {
                setActiveTab("featured");
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === "featured" ? "bg-white text-amber-900 font-bold shadow-xs" : "hover:text-slate-900"
              }`}
            >
              Featured
            </button>
            <button
              onClick={() => {
                setActiveTab("trending");
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === "trending" ? "bg-white text-amber-900 font-bold shadow-xs" : "hover:text-slate-900"
              }`}
            >
              Trending
            </button>
            <button
              onClick={() => {
                setActiveTab("latest");
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === "latest" ? "bg-white text-amber-900 font-bold shadow-xs" : "hover:text-slate-900"
              }`}
            >
              Latest
            </button>
          </div>
        </div>

        {/* Article Cards Grid */}
        {paginatedArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {paginatedArticles.map((article) => {
              const isBookmarked = bookmarkedSlugs.includes(article.slug);
              return (
                <div
                  key={article.slug}
                  onClick={() => onSelectSlug(article.slug)}
                  className="p-5 rounded-2xl bg-white border border-slate-200/90 hover:border-amber-500 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-900 text-[10px] font-bold border border-amber-200">
                        {article.category}
                      </span>
                      <button
                        onClick={(e) => onToggleBookmark(article.slug, e)}
                        className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-amber-700 transition-colors"
                        title={isBookmarked ? "Remove Bookmark" : "Save Bookmark"}
                      >
                        <Bookmark className={`w-4 h-4 ${isBookmarked ? "fill-amber-600 text-amber-600" : ""}`} />
                      </button>
                    </div>

                    <h3 className="font-serif text-sm sm:text-base font-bold text-slate-900 group-hover:text-amber-800 transition-colors leading-snug">
                      {article.title}
                    </h3>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {article.snippet}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px] text-slate-500">
                    <div className="flex items-center space-x-3">
                      <span className="flex items-center space-x-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>{article.readTime}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Eye className="w-3 h-3 text-slate-400" />
                        <span>{article.views.toLocaleString()}</span>
                      </span>
                    </div>

                    <span className="flex items-center space-x-1 font-bold text-amber-800 group-hover:text-amber-950">
                      <span>Read</span>
                      <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-8 text-center rounded-2xl bg-slate-50 border border-slate-200 text-slate-500 space-y-2">
            <p className="font-serif text-sm font-bold text-slate-800">No articles match your query.</p>
            <p className="text-xs">Try clearing your search query or selecting a different filter tab.</p>
            <button
              onClick={() => {
                setSearchQuery("");
                setActiveTab("all");
              }}
              className="px-3 py-1.5 rounded-xl bg-amber-800 text-white text-xs font-bold transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* PAGINATION CONTROLS */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center space-x-2 pt-4">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 disabled:opacity-40 hover:bg-amber-50 cursor-pointer transition-colors"
            >
              Previous
            </button>

            {Array.from({ length: totalPages }).map((_, idx) => {
              const pageNum = idx + 1;
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-8 h-8 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                    currentPage === pageNum
                      ? "bg-amber-800 text-white shadow-xs"
                      : "bg-white border border-slate-200 text-slate-700 hover:bg-amber-50"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 disabled:opacity-40 hover:bg-amber-50 cursor-pointer transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </section>

      {/* RELATED CATEGORIES & INTERNAL LINKS */}
      {hubData.relatedCategories && hubData.relatedCategories.length > 0 && (
        <section className="p-6 rounded-3xl bg-white border border-amber-200/80 space-y-3">
          <h3 className="font-serif text-sm font-bold text-slate-900 flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-amber-700" />
            <span>Explore Related Jyotish Categories</span>
          </h3>

          <div className="flex flex-wrap gap-2">
            {hubData.relatedCategories.map((rel) => (
              <button
                key={rel.id}
                onClick={() => {
                  if (rel.categoryId && rel.topicKey) {
                    onSelectTopic(rel.categoryId, rel.topicKey);
                  } else {
                    onSelectCategory(rel.id);
                  }
                }}
                className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-xs font-bold text-amber-900 transition-colors cursor-pointer flex items-center space-x-1"
              >
                <span>{rel.title}</span>
                <ChevronRight className="w-3.5 h-3.5 text-amber-700" />
              </button>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
