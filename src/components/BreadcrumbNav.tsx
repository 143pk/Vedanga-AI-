import React from "react";
import { ChevronRight, Home } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  onClick?: () => void;
  isCurrent?: boolean;
  url?: string;
}

interface BreadcrumbNavProps {
  items: BreadcrumbItem[];
  className?: string;
}

/**
 * Dynamic Breadcrumb Navigation component for Vedanga AI.
 * Provides accessible UI navigation with chevron separators and injects
 * Schema.org JSON-LD BreadcrumbList structured data for search engine indexing.
 */
export const BreadcrumbNav: React.FC<BreadcrumbNavProps> = ({ items, className = "" }) => {
  if (!items || items.length === 0) return null;

  const baseUrl = typeof window !== "undefined" ? window.location.origin : "https://vedanga-ai.vercel.app";

  // Build JSON-LD BreadcrumbList structure for Google SEO crawlers
  const schemaBreadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => {
      let itemUrl = item.url || "/";
      if (!itemUrl.startsWith("http")) {
        itemUrl = `${baseUrl}${itemUrl.startsWith("/") ? "" : "/"}${itemUrl}`;
      }
      return {
        "@type": "ListItem",
        position: index + 1,
        name: item.label,
        item: itemUrl
      };
    })
  };

  return (
    <>
      {/* Schema.org BreadcrumbList Structured Data Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaBreadcrumbs) }}
      />

      <nav
        aria-label="Breadcrumb navigation"
        className={`flex items-center space-x-1.5 sm:space-x-2 text-xs font-medium text-slate-600 overflow-x-auto py-2 custom-scrollbar ${className}`}
      >
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          const isFirst = idx === 0;

          return (
            <React.Fragment key={`${item.label}-${idx}`}>
              {idx > 0 && (
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0 select-none" aria-hidden="true" />
              )}
              {isLast || item.isCurrent ? (
                <span
                  aria-current="page"
                  className="font-bold text-amber-950 bg-amber-100/90 border border-amber-300/80 px-2.5 py-0.5 rounded-md truncate max-w-[180px] sm:max-w-[320px] shrink-0 shadow-2xs flex items-center gap-1"
                >
                  {isFirst && <Home className="w-3.5 h-3.5 text-amber-800 shrink-0" />}
                  <span className="truncate">{item.label}</span>
                </span>
              ) : item.onClick ? (
                <button
                  onClick={item.onClick}
                  className="hover:text-amber-900 hover:bg-amber-100/60 text-slate-700 px-2 py-0.5 rounded-md transition-all cursor-pointer flex items-center space-x-1 shrink-0 font-semibold active:scale-95"
                >
                  {isFirst && <Home className="w-3.5 h-3.5 text-amber-800 shrink-0" />}
                  <span>{item.label}</span>
                </button>
              ) : (
                <span className="text-slate-600 truncate max-w-[150px] shrink-0 flex items-center gap-1">
                  {isFirst && <Home className="w-3.5 h-3.5 text-slate-500 shrink-0" />}
                  <span className="truncate">{item.label}</span>
                </span>
              )}
            </React.Fragment>
          );
        })}
      </nav>
    </>
  );
};
