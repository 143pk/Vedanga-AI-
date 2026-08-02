// Daily Content Scheduler
import { DailyContentGenerator } from "./DailyContentGenerator";
import { DailyIndexer } from "./DailyIndexer";
import { PublishedDailyArticle } from "./types";

export class DailyContentScheduler {
  private static publishedDates: Set<string> = new Set();
  private static isInitialized = false;

  /**
   * Initializes the daily scheduler and ensures today's content is pre-published
   */
  static initializeScheduler(): void {
    if (this.isInitialized) return;
    this.isInitialized = true;

    // Run immediate check for today
    this.ensureTodayPublished();

    // Set up 24-hour interval trigger (86,400,000 ms)
    setInterval(() => {
      this.ensureTodayPublished();
    }, 12 * 60 * 60 * 1000); // Check every 12 hours
  }

  /**
   * Ensures that today's daily content is fully generated, validated, and indexed
   */
  static ensureTodayPublished(): PublishedDailyArticle[] {
    const today = new Date();
    const dateStr = today.toISOString().split("T")[0];

    return this.ensureDatePublished(dateStr, today);
  }

  /**
   * Generates and publishes all content for a specific date if not already published
   */
  static ensureDatePublished(dateStr: string, dateObj?: Date): PublishedDailyArticle[] {
    if (this.publishedDates.has(dateStr)) {
      // Content already generated and published for this date
      return DailyIndexer.getAllArticles().filter(a => a.publishedAt === dateStr);
    }

    const targetDate = dateObj || new Date(dateStr);
    console.log(`[DailyContentScheduler] Triggering automated daily publication for date: ${dateStr}`);

    const newArticles = DailyContentGenerator.generateAndPublishAllForDate(targetDate);
    this.publishedDates.add(dateStr);

    console.log(`[DailyContentScheduler] Successfully published ${newArticles.length} SEO-optimized pages for ${dateStr}`);
    return newArticles;
  }

  /**
   * Check if a date has already been published
   */
  static isDatePublished(dateStr: string): boolean {
    return this.publishedDates.has(dateStr);
  }
}
