// Real-Time Vedic Astrology Search Index for Vedanga AI
import { PLANETS, HOUSES, SIGNS, NAKSHATRAS, HIGH_INTENT_LANDINGS } from "./astrologyData";

export interface SearchResultItem {
  title: string;
  slug: string;
  category: string;
  snippet: string;
  type: "landing" | "combinatorics" | "planet" | "house" | "sign" | "nakshatra";
}

export function searchSeoTopics(query: string): SearchResultItem[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];

  const results: SearchResultItem[] = [];

  // 1. Check High-Intent Calculators and Landings
  HIGH_INTENT_LANDINGS.forEach(l => {
    if (l.title.toLowerCase().includes(q) || l.description.toLowerCase().includes(q) || l.slug.includes(q)) {
      results.push({
        title: l.h1,
        slug: l.slug,
        category: l.category,
        snippet: l.description,
        type: "landing"
      });
    }
  });

  // 2. Check Planets
  PLANETS.forEach(p => {
    if (p.name.toLowerCase().includes(q) || p.sanskrit.toLowerCase().includes(q) || p.qualities.some(k => k.toLowerCase().includes(q))) {
      results.push({
        title: `${p.name} (${p.sanskrit}) in Vedic Astrology`,
        slug: `${p.key}-in-vedic-astrology`,
        category: "Planets",
        snippet: p.description,
        type: "planet"
      });
      // Generate combination snippets
      results.push({
        title: `${p.name} Mahadasha & Antardasha Analysis`,
        slug: `${p.key}-mahadasha`,
        category: "Dasha",
        snippet: `Complete analysis of ${p.name} Vimshottari Mahadasha timeline and sub-periods.`,
        type: "combinatorics"
      });
      results.push({
        title: `${p.name} Remedies & Beej Mantras`,
        slug: `${p.key}-remedies`,
        category: "Remedies",
        snippet: `Effective Vedic remedies, Stotram, and Mantras to strengthen ${p.name}.`,
        type: "combinatorics"
      });
    }
  });

  // 3. Check Houses
  HOUSES.forEach(h => {
    if (h.name.toLowerCase().includes(q) || h.sanskrit.toLowerCase().includes(q) || h.governance.some(g => g.toLowerCase().includes(q))) {
      results.push({
        title: `${h.name} (${h.sanskrit}) Insights`,
        slug: h.key,
        category: "Houses",
        snippet: h.description,
        type: "house"
      });
    }
  });

  // 4. Check Signs
  SIGNS.forEach(s => {
    if (s.name.toLowerCase().includes(q) || s.sanskrit.toLowerCase().includes(q)) {
      results.push({
        title: `${s.name} (${s.sanskrit}) Rashi Astrology`,
        slug: `${s.key}-rashi`,
        category: "Signs",
        snippet: s.description,
        type: "sign"
      });
      results.push({
        title: `${s.name} Ascendant (Lagna) Blueprint`,
        slug: `${s.key}-ascendant`,
        category: "Ascendants",
        snippet: `Life purpose, health, and career trajectory for ${s.name} Lagna.`,
        type: "combinatorics"
      });
    }
  });

  // 5. Check Nakshatras
  NAKSHATRAS.forEach(n => {
    if (n.name.toLowerCase().includes(q) || n.ruler.toLowerCase().includes(q) || n.deity.toLowerCase().includes(q)) {
      results.push({
        title: `${n.name} Nakshatra (${n.ruler} Ruled)`,
        slug: `${n.key}-nakshatra`,
        category: "Nakshatras",
        snippet: n.description,
        type: "nakshatra"
      });
    }
  });

  // 6. Handle Conjunction Search (e.g., "saturn venus", "sun mars")
  const words = q.split(/\s+/);
  if (words.length >= 2) {
    const p1 = PLANETS.find(p => p.name.toLowerCase().includes(words[0]) || p.sanskrit.toLowerCase().includes(words[0]));
    const p2 = PLANETS.find(p => p.name.toLowerCase().includes(words[1]) || p.sanskrit.toLowerCase().includes(words[1]));
    if (p1 && p2 && p1.key !== p2.key) {
      results.unshift({
        title: `${p1.name} ${p2.name} Conjunction in Kundli`,
        slug: `${p1.key}-${p2.key}-conjunction`,
        category: "Conjunctions",
        snippet: `Analysis of ${p1.name} and ${p2.name} planetary alignment in the same house.`,
        type: "combinatorics"
      });
      results.unshift({
        title: `${p1.name} ${p2.name} Dasha & Transit Effects`,
        slug: `${p1.key}-${p2.key}-dasha`,
        category: "Dasha",
        snippet: `Timing of events during ${p1.name} Mahadasha and ${p2.name} Antardasha.`,
        type: "combinatorics"
      });
      results.unshift({
        title: `${p1.name} ${p2.name} Compatibility & Marriage`,
        slug: `${p1.key}-${p2.key}-compatibility`,
        category: "Matching",
        snippet: `Relationship dynamics between ${p1.name} and ${p2.name} dominant birth charts.`,
        type: "combinatorics"
      });
    }
  }

  // Deduplicate by slug
  const uniqueMap = new Map<string, SearchResultItem>();
  results.forEach(r => {
    if (!uniqueMap.has(r.slug)) {
      uniqueMap.set(r.slug, r);
    }
  });

  return Array.from(uniqueMap.values()).slice(0, 20);
}
