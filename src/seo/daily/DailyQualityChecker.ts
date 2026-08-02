// Daily Quality Checker for Vedanga AI
import { PublishedDailyArticle, QualityCheckResult } from "./types";

export class DailyQualityChecker {
  /**
   * Performs automated quality validation on a generated article before publishing
   */
  static validateArticle(article: PublishedDailyArticle, existingSlugs: Set<string>): QualityCheckResult {
    const errors: string[] = [];

    // 1. Uniqueness / Duplicate check
    const isUnique = !existingSlugs.has(article.slug);
    if (!isUnique) {
      errors.push(`Duplicate slug detected: ${article.slug}`);
    }

    // 2. Minimum Word Count check (minimum 800 words)
    const contentText = article.sections.map(s => s.title + " " + s.content).join(" ");
    const faqText = article.faqs.map(f => f.question + " " + f.answer).join(" ");
    const totalWords = (contentText + " " + faqText).trim().split(/\s+/).length;
    
    const hasMinWordCount = totalWords >= 800;
    if (!hasMinWordCount) {
      errors.push(`Word count ${totalWords} is below minimum requirement of 800 words.`);
    }

    // 3. Internal Links verification
    const hasInternalLinks = article.internalLinks && article.internalLinks.length >= 3;
    if (!hasInternalLinks) {
      errors.push(`Insufficient internal links. Found ${article.internalLinks?.length || 0}, required at least 3.`);
    }

    // 4. Metadata validation
    const hasValidTitle = !!article.title && article.title.length >= 20;
    const hasValidMetaDesc = !!article.metaDescription && article.metaDescription.length >= 50;
    const hasValidH1 = !!article.h1 && article.h1.length >= 10;
    const hasValidMetadata = hasValidTitle && hasValidMetaDesc && hasValidH1;

    if (!hasValidMetadata) {
      errors.push("Invalid metadata: ensure Title, Meta Description, and H1 are fully populated.");
    }

    // 5. Schema confirmation
    const hasValidSchema = Array.isArray(article.schemaJsonLd) && article.schemaJsonLd.length >= 2;
    if (!hasValidSchema) {
      errors.push("Missing or incomplete JSON-LD schemas.");
    }

    // 6. Image Optimization check
    const hasImageOptimization = !!article.featuredImageUrl && !!article.imageAltText && article.imageAltText.length >= 5;
    if (!hasImageOptimization) {
      errors.push("Missing featured image URL or descriptive alt text.");
    }

    const passed = isUnique && hasMinWordCount && hasInternalLinks && hasValidMetadata && hasValidSchema && hasImageOptimization;

    // Calculate quality score (0 to 100)
    let score = 100;
    if (!isUnique) score -= 40;
    if (!hasMinWordCount) score -= 25;
    if (!hasInternalLinks) score -= 15;
    if (!hasValidMetadata) score -= 10;
    if (!hasValidSchema) score -= 5;
    if (!hasImageOptimization) score -= 5;

    return {
      passed,
      score: Math.max(0, score),
      wordCount: totalWords,
      checks: {
        isUnique,
        hasMinWordCount,
        hasInternalLinks,
        hasValidMetadata,
        hasValidSchema,
        hasImageOptimization
      },
      errors
    };
  }
}
