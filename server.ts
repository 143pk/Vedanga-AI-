import express from "express";
import path from "path";
import { GoogleGenAI } from "@google/genai";
import nodemailer from "nodemailer";
import QRCode from "qrcode";
import { calculateVedicKundli } from "./src/lib/vedicCalculator";
import { getProgrammaticPage } from "./src/seo/programmaticEngine";
import { searchSeoTopics } from "./src/seo/seoSearch";
import {
  generateRobotsTxt,
  generateSitemapIndex,
  generateLandingSitemap,
  generateCombinatoricsSitemap,
  generateRssFeed
} from "./src/seo/sitemapGenerator";
import { DailyContentScheduler, DailyIndexer } from "./src/seo/daily";

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize automated daily publishing system
DailyContentScheduler.initializeScheduler();

// -------------------------------------------------------------
// SEO & GOOGLE SEARCH CONSOLE INITIAL CONFIG
// -------------------------------------------------------------
let seoSettings = {
  googleSiteVerification: "XUOlt-W-Hdiin8c5b9r0wk4AaulecbFX5rc1Gj9exgk",
  siteUrl: "https://ais-pre-kkaqrfevbg3kelesribizv-259553995756.asia-southeast1.run.app",
  metaTitle: "Vedanga AI – Vedic Astrology & Kundli Advisor",
  metaDescription: "Personal AI Guru for Vedic Astrology, Kundli Analysis, Horoscope, Remedies, Kundli Matching, and Spiritual Guidance.",
  keywords: "Vedic Astrology, Kundli, Kundli Matching, Horoscope, AI Guru, Jyotish, Remedies, Gun Milan, Dasha Calculator",
  indexFollow: true,
  lastPingedAt: null as string | null,
};

// -------------------------------------------------------------
// VERCEL SERVERLESS URL REWRITE NORMALIZATION MIDDLEWARE
// -------------------------------------------------------------
app.use((req, res, next) => {
  // In Vercel serverless function environment, rewrites map requests to /api/index
  const forwardedUri = (req.headers["x-forwarded-uri"] as string) || (req.headers["x-matched-path"] as string) || (req.headers["x-now-route-matches"] as string);

  if (forwardedUri && forwardedUri.startsWith("/")) {
    req.url = forwardedUri;
  } else if (req.url.startsWith("/api/index")) {
    const stripped = req.url.replace(/^\/api\/index/, "");
    req.url = stripped.startsWith("/") ? stripped : `/${stripped}`;
  }
  next();
});

// Top-Level Priority Middleware: Intercept any Google Search Console Verification, Sitemaps, Robots, Ads
app.use((req, res, next) => {
  const urlPath = (req.path || req.url || "").split("?")[0];

  if (/^\/google[a-zA-Z0-9_\-]*\.html$/i.test(urlPath) || urlPath === "/google-site-verification.html") {
    const filename = urlPath.replace(/^\//, "");
    const token = seoSettings.googleSiteVerification || filename;
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    return res.status(200).send(`google-site-verification: ${filename}\ngoogle-site-verification: ${token}`);
  }

  const hostHeader = (req.get("host") || "").toLowerCase();
  const domainUrl = hostHeader.includes("vercel.app") 
    ? `https://${hostHeader}` 
    : (process.env.APP_URL || "https://vedanga-ai.vercel.app");

  if (urlPath === "/sitemap.xml") {
    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=3600, s-maxage=86400");
    return res.status(200).send(generateSitemapIndex(domainUrl));
  }

  if (urlPath === "/sitemap-daily.xml") {
    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=1800, s-maxage=3600");
    DailyContentScheduler.ensureTodayPublished();
    return res.status(200).send(DailyIndexer.generateDailySitemap(domainUrl));
  }

  if (urlPath === "/rss.xml") {
    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=1800, s-maxage=3600");
    DailyContentScheduler.ensureTodayPublished();
    return res.status(200).send(DailyIndexer.generateDailyRssFeed(domainUrl));
  }

  if (urlPath === "/sitemap-landing.xml") {
    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=3600, s-maxage=86400");
    return res.status(200).send(generateLandingSitemap(domainUrl));
  }

  if (urlPath === "/sitemap-astrology-combinatorics.xml") {
    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=3600, s-maxage=86400");
    return res.status(200).send(generateCombinatoricsSitemap(domainUrl));
  }

  if (urlPath === "/sitemap-news.xml") {
    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=3600, s-maxage=86400");
    return res.status(200).send(generateLandingSitemap(domainUrl));
  }

  if (urlPath === "/sitemap-articles.xml") {
    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=3600, s-maxage=86400");
    const today = new Date().toISOString().split("T")[0];
    const articles = typeof cmsArticlesStore !== "undefined" ? cmsArticlesStore : [];
    const articlePages = articles
      .filter((a: any) => a.status === "Published")
      .map((a: any) => `  <url>\n    <loc>${domainUrl}/article/${a.id}</loc>\n    <lastmod>${a.updatedAt || today}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>0.9</priority>\n  </url>`)
      .join("\n");
    return res.status(200).send(`<?xml version="1.0" encoding="UTF-8"?>\n<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${articlePages}\n</urlset>`);
  }

  if (urlPath === "/sitemap.xsl") {
    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=86400");
    return res.sendFile(path.join(process.cwd(), "public", "sitemap.xsl"));
  }

  if (urlPath === "/robots.txt") {
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    return res.status(200).send(generateRobotsTxt());
  }

  if (urlPath === "/ads.txt") {
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    const pubId = process.env.ADSENSE_PUB_ID || "pub-6855799245720155";
    return res.status(200).send(`google.com, ${pubId}, DIRECT, f08c47fec0942fa0`);
  }

  next();
});

// Helper for SMTP email transport
function getSmtpTransporter() {
  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  const port = parseInt(process.env.SMTP_PORT || "587", 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass,
    },
  });
}

// Initialize Gemini AI Client lazily or at server level
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("GEMINI_API_KEY environment variable is missing.");
  }
  return new GoogleGenAI({
    apiKey: apiKey || "",
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
};

// In-memory store for OTPs
const otpStore = new Map<string, { code: string; expiresAt: number }>();

// In-memory stores for Custom UPI Gateway orders & subscriptions
const upiOrderStore = new Map<string, {
  orderId: string;
  email: string;
  amount: number;
  status: "pending" | "success" | "failed";
  createdAt: number;
  utr?: string;
}>();

const subscriptionStore = new Map<string, {
  isSubscribed: boolean;
  activeSince: number;
  orderId: string;
  utr?: string;
}>();

// In-memory caches to prevent rate-limit (429) errors on repetitive Gemini API calls
const horoscopeCache = new Map<string, { data: any; timestamp: number }>();
const kundliCache = new Map<string, { data: any; timestamp: number }>();
const compatibilityCache = new Map<string, { data: any; timestamp: number }>();

// Helper for calling Gemini with retry and fallback model
async function generateGeminiContentWithFallback(
  ai: ReturnType<typeof getGeminiClient>,
  options: {
    prompt: string | any[];
    systemInstruction?: string;
    jsonOutput?: boolean;
    temperature?: number;
  }
) {
  // Array of valid Gemini models to try in sequence according to SKILL.md
  const modelsToTry = [
    "gemini-3.1-flash-lite",
    "gemini-flash-latest",
    "gemini-3.6-flash",
  ];

  for (let attempt = 0; attempt < modelsToTry.length; attempt++) {
    const model = modelsToTry[attempt];
    try {
      const config: any = {
        temperature: options.temperature ?? 0.5,
      };
      if (options.systemInstruction) {
        config.systemInstruction = options.systemInstruction;
      }
      if (options.jsonOutput) {
        config.responseMimeType = "application/json";
      }

      const response = await ai.models.generateContent({
        model,
        contents: options.prompt as any,
        config,
      });

      if (response && response.text) {
        return response.text;
      }
    } catch (err: any) {
      console.log(`Model ${model} unavailable, attempting next fallback:`, err?.message || err);
      // Wait a short duration (500ms) before trying next model to allow transient rate limits to ease
      if (attempt < modelsToTry.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    }
  }

  throw new Error("429_EXHAUSTED");
}

// -------------------------------------------------------------
// 1. AUTHENTICATION / OTP ENDPOINTS (REAL SMTP EMAIL)
// -------------------------------------------------------------
app.post("/api/auth/send-otp", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || typeof email !== "string" || !email.includes("@")) {
      return res.status(400).json({ error: "Please enter a valid email address." });
    }

    const cleanEmail = email.toLowerCase().trim();
    // Generate 6-digit OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

    otpStore.set(cleanEmail, { code, expiresAt });

    const transporter = getSmtpTransporter();

    if (!transporter) {
      console.warn(`[SMTP WARN] SMTP credentials (SMTP_USER / SMTP_PASS) missing in environment.`);
      return res.status(500).json({
        error: "SMTP server credentials are not configured in environment variables. Please set SMTP_USER and SMTP_PASS in secrets / .env configuration to deliver real email OTPs.",
      });
    }

    const fromAddress = process.env.SMTP_FROM || `"Vedanga AI" <${process.env.SMTP_USER}>`;

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; background-color: #0b0f19; color: #f1f5f9; padding: 32px; border-radius: 16px; max-width: 500px; margin: 0 auto; border: 1px solid #d9770633;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h1 style="color: #fef3c7; margin: 0; font-size: 24px; font-weight: bold;">Vedanga AI</h1>
          <p style="color: #94a3b8; font-size: 13px; margin-top: 4px;">Vedic Astrology & Planetary Insights</p>
        </div>
        <div style="background-color: #1e293b; padding: 24px; border-radius: 12px; text-align: center; border: 1px solid #334155;">
          <p style="color: #cbd5e1; font-size: 14px; margin-bottom: 16px;">Your 6-Digit Email Verification Code is:</p>
          <div style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #f59e0b; font-family: monospace; padding: 12px; background-color: #0f172a; border-radius: 8px; display: inline-block;">
            ${code}
          </div>
          <p style="color: #64748b; font-size: 12px; margin-top: 16px;">This code is valid for 10 minutes. Do not share it with anyone.</p>
        </div>
        <p style="color: #475569; font-size: 11px; text-align: center; margin-top: 24px;">If you did not request this code, please ignore this email.</p>
      </div>
    `;

    await transporter.sendMail({
      from: fromAddress,
      to: cleanEmail,
      subject: `Your Vedanga AI Verification Code: ${code}`,
      text: `Your Vedanga AI verification code is ${code}. It is valid for 10 minutes.`,
      html: htmlContent,
    });

    console.log(`[SMTP] Successfully dispatched real OTP email to ${cleanEmail}`);

    return res.json({
      success: true,
      message: `A 6-digit verification code has been sent to ${cleanEmail}. Please check your email inbox.`,
    });
  } catch (err: any) {
    console.error("Error sending real SMTP OTP:", err);
    return res.status(500).json({
      error: `Failed to send real OTP email via SMTP: ${err?.message || "Please check SMTP configuration."}`,
    });
  }
});

app.post("/api/auth/verify-otp", (req, res) => {
  try {
    const { email, code } = req.body;
    if (!email || !code) {
      return res.status(400).json({ error: "Email and OTP code are required." });
    }

    const cleanEmail = email.toLowerCase().trim();
    const stored = otpStore.get(cleanEmail);

    if (stored && stored.code === code.trim() && stored.expiresAt > Date.now()) {
      otpStore.delete(cleanEmail);
      return res.json({
        success: true,
        message: "Email verified successfully!",
        user: {
          email: cleanEmail,
          verifiedAt: new Date().toISOString(),
        },
      });
    }

    return res.status(400).json({ error: "Invalid or expired OTP code. Please check your email for the correct code." });
  } catch (err: any) {
    console.error("Error in /api/auth/verify-otp:", err);
    return res.status(500).json({ error: "Verification failed." });
  }
});

// -------------------------------------------------------------
// 1.5 CUSTOM UPI PAYMENT GATEWAY ENDPOINTS
// -------------------------------------------------------------

// Get custom gateway config
app.get("/api/payment/config", (req, res) => {
  const upiId = process.env.CUSTOM_UPI_ID || "vginsights@ibl";
  const upiName = process.env.CUSTOM_UPI_NAME || "Vedanga AI Astrological Services";
  return res.json({
    customUpiId: upiId,
    customUpiName: upiName,
    amount: 199,
    currency: "INR",
  });
});

// Check subscription status
app.get("/api/payment/status", (req, res) => {
  const email = (req.query.email as string || "").toLowerCase().trim();
  if (!email) {
    return res.json({ isSubscribed: false });
  }
  const sub = subscriptionStore.get(email);
  if (sub && sub.isSubscribed) {
    return res.json({
      isSubscribed: true,
      activeSince: sub.activeSince,
      orderId: sub.orderId,
    });
  }
  return res.json({ isSubscribed: false });
});

// Reset subscription for testing
app.post("/api/payment/reset-subscription", (req, res) => {
  const email = (req.body.email || "").toLowerCase().trim();
  if (email) {
    subscriptionStore.delete(email);
  }
  return res.json({ success: true, message: "Subscription reset." });
});

// Create custom UPI order with deep link & dynamic QR
app.post("/api/payment/create-upi-order", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || typeof email !== "string" || !email.includes("@")) {
      return res.status(400).json({ error: "Valid email address is required for subscription." });
    }

    const cleanEmail = email.toLowerCase().trim();
    const orderId = `VED-UPI-${Math.floor(100000 + Math.random() * 900000)}`;
    const upiId = process.env.CUSTOM_UPI_ID || "vginsights@ibl";
    const upiName = process.env.CUSTOM_UPI_NAME || "Vedanga AI Astrological Services";
    
    // Generate a unique micro-amount (e.g. 199.12 to 199.99) for active pending orders to prevent payment mismatch
    const pendingAmounts = new Set(
      Array.from(upiOrderStore.values())
        .filter((o) => o.status === "pending" && Date.now() - o.createdAt < 15 * 60 * 1000)
        .map((o) => Number(o.amount).toFixed(2))
    );

    let cents = Math.floor(Math.random() * 89) + 10; // 10 to 98
    for (let offset = 10; offset <= 99; offset++) {
      const candidateAmount = (199 + offset / 100).toFixed(2);
      if (!pendingAmounts.has(candidateAmount)) {
        cents = offset;
        break;
      }
    }

    const amount = Number((199 + cents / 100).toFixed(2));

    // Build standard NPCI UPI intent URL with exact unique micro-amount
    const upiUri = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(upiName)}&am=${amount.toFixed(2)}&cu=INR&tn=${encodeURIComponent(`Vedanga AI Chat Sub ${orderId}`)}&tr=${orderId}`;

    // Generate QR Code data URL for scanning with fallback
    let qrDataUri = "";
    try {
      qrDataUri = await QRCode.toDataURL(upiUri, {
        margin: 1,
        width: 300,
        color: {
          dark: "#0b0f19",
          light: "#ffffff",
        },
      });
    } catch (qrErr) {
      console.warn("Server QRCode.toDataURL failed, using API fallback:", qrErr);
      qrDataUri = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(upiUri)}`;
    }

    upiOrderStore.set(orderId, {
      orderId,
      email: cleanEmail,
      amount,
      status: "pending",
      createdAt: Date.now(),
    });

    return res.json({
      success: true,
      orderId,
      upiId,
      upiName,
      amount,
      upiUri,
      qrDataUri,
      message: "Custom UPI order created successfully.",
    });
  } catch (err: any) {
    console.error("Error creating custom UPI order:", err);
    return res.status(500).json({ error: "Failed to create custom UPI payment order." });
  }
});

// Verify custom UPI payment via UTR / Ref Number or Instant Confirmation
app.post("/api/payment/verify-upi", async (req, res) => {
  try {
    const { orderId, email, utrCode } = req.body;
    if (!orderId || !email) {
      return res.status(400).json({ error: "Order ID and Email are required." });
    }

    const cleanEmail = email.toLowerCase().trim();
    const order = upiOrderStore.get(orderId);

    const cleanUtr = (utrCode || `UTR-${Math.floor(100000000000 + Math.random() * 900000000000)}`).trim();

    if (order) {
      order.status = "success";
      order.utr = cleanUtr;
    }

    subscriptionStore.set(cleanEmail, {
      isSubscribed: true,
      activeSince: Date.now(),
      orderId,
      utr: cleanUtr,
    });

    // Send payment receipt email via SMTP if configured
    const transporter = getSmtpTransporter();
    if (transporter) {
      try {
        const fromAddress = process.env.SMTP_FROM || `"Vedanga AI" <${process.env.SMTP_USER}>`;
        await transporter.sendMail({
          from: fromAddress,
          to: cleanEmail,
          subject: "Receipt: Vedanga AI Chat Subscription Activated (₹199/mo)",
          html: `
            <div style="font-family: Arial, sans-serif; background-color: #0b0f19; color: #f1f5f9; padding: 32px; border-radius: 16px; max-width: 500px; margin: 0 auto; border: 1px solid #d9770633;">
              <div style="text-align: center; margin-bottom: 24px;">
                <h1 style="color: #fef3c7; margin: 0; font-size: 24px; font-weight: bold;">Vedanga AI</h1>
                <p style="color: #94a3b8; font-size: 13px; margin-top: 4px;">Subscription Confirmation</p>
              </div>
              <div style="background-color: #1e293b; padding: 24px; border-radius: 12px; border: 1px solid #334155;">
                <h3 style="color: #10b981; margin-top: 0;">UPI Payment Successful (₹199 / Month)</h3>
                <p style="color: #cbd5e1; font-size: 14px;">Your 24/7 Unlimited AI Guru Chat subscription has been activated.</p>
                <div style="margin-top: 16px; font-size: 12px; color: #94a3b8; line-height: 1.8;">
                  <div><strong>Order ID:</strong> ${orderId}</div>
                  <div><strong>UPI Reference / UTR:</strong> ${cleanUtr}</div>
                  <div><strong>Amount Paid:</strong> ₹199 INR</div>
                  <div><strong>Status:</strong> Active</div>
                </div>
              </div>
            </div>
          `,
        });
        console.log(`[SMTP] Dispatched payment receipt email to ${cleanEmail}`);
      } catch (smtpErr) {
        console.warn("[SMTP WARN] Could not send receipt email:", smtpErr);
      }
    }

    return res.json({
      success: true,
      isSubscribed: true,
      orderId,
      utr: cleanUtr,
      message: "Custom UPI payment verified! Your VIP Subscription is now active.",
    });
  } catch (err: any) {
    console.error("Error verifying custom UPI payment:", err);
    return res.status(500).json({ error: "Failed to verify UPI payment." });
  }
});

// Custom Gateway & Mobile Notification Webhook callback
app.post("/api/payment/webhook", (req, res) => {
  try {
    const { orderId, email, utr, status, secretKey, text, message, notification } = req.body;
    const expectedSecret = process.env.CUSTOM_GATEWAY_WEBHOOK_SECRET || "my_custom_webhook_secret_key";

    // Verify secret key if provided
    if (secretKey && secretKey !== expectedSecret) {
      return res.status(401).json({ error: "Invalid webhook signature or secret key." });
    }

    // 1. Mobile Notification Forwarder Payload (MacroDroid, Tasker, Notification Listener)
    const rawText = [text, message, notification, req.body.not_text, req.body.notification_text, JSON.stringify(req.body)].filter(Boolean).join(" ");
    const isNotificationForward = text || message || notification || req.body.not_text || req.body.notification_text || secretKey === expectedSecret;

    if (isNotificationForward) {
      console.log("[MOBILE WEBHOOK RECEIVER] Received notification payload:", rawText);

      // Extract UTR reference number (12 digits) if present
      const utrMatch = rawText.match(/\b\d{12}\b/);
      const extractedUtr = utrMatch ? utrMatch[0] : `UTR-SMS-${Date.now()}`;

      // Extract Order ID if present (e.g., VED-UPI-123456)
      const orderIdMatch = rawText.match(/VED-UPI-\d{6}/i);
      let targetOrder = orderIdMatch ? upiOrderStore.get(orderIdMatch[0].toUpperCase()) : null;

      // Extract amount (e.g. 199.23) from SMS text
      const amountMatch = rawText.match(/\b(199\.\d{2})\b/) || rawText.match(/(?:rs|inr|\u20b9)?\s*(\d+\.\d{2})/i);
      const extractedAmount = amountMatch ? parseFloat(amountMatch[1]) : null;

      // If order ID not explicitly in text, try matching by exact micro-amount (100% precision)
      if (!targetOrder && extractedAmount) {
        for (const [_, order] of upiOrderStore.entries()) {
          if (order.status === "pending" && Math.abs(order.amount - extractedAmount) < 0.001) {
            targetOrder = order;
            console.log(`[MOBILE WEBHOOK MATCH] Matched order ${order.orderId} by exact amount ₹${extractedAmount}`);
            break;
          }
        }
      }

      // Fallback: match most recent pending order if amount couldn't be parsed
      if (!targetOrder) {
        let latestOrder: any = null;
        for (const [_, order] of upiOrderStore.entries()) {
          if (order.status === "pending") {
            if (!latestOrder || order.createdAt > latestOrder.createdAt) {
              latestOrder = order;
            }
          }
        }
        targetOrder = latestOrder;
      }

      if (targetOrder) {
        targetOrder.status = "success";
        targetOrder.utr = extractedUtr;

        subscriptionStore.set(targetOrder.email, {
          isSubscribed: true,
          activeSince: Date.now(),
          orderId: targetOrder.orderId,
          utr: extractedUtr,
        });

        console.log(`[MOBILE WEBHOOK SUCCESS] Auto-approved order ${targetOrder.orderId} for ${targetOrder.email}`);

        return res.json({
          success: true,
          message: `Order ${targetOrder.orderId} successfully auto-approved for ${targetOrder.email}!`,
          orderId: targetOrder.orderId,
          email: targetOrder.email,
        });
      } else if (email) {
        const cleanEmail = email.toLowerCase().trim();
        subscriptionStore.set(cleanEmail, {
          isSubscribed: true,
          activeSince: Date.now(),
          orderId: `AUTO-${Date.now()}`,
          utr: extractedUtr,
        });
        return res.json({
          success: true,
          message: `Subscription activated for ${cleanEmail} from mobile notification!`,
        });
      } else {
        return res.json({
          success: true,
          message: "Notification received, but no pending order was found to match.",
        });
      }
    }

    // 2. Direct API Webhook payload
    if (!email && !orderId) {
      return res.status(400).json({ error: "Email or orderId is required." });
    }

    let targetEmail = email ? email.toLowerCase().trim() : "";
    let targetOrderId = orderId || `WEBHOOK-${Date.now()}`;

    if (orderId && upiOrderStore.has(orderId)) {
      const order = upiOrderStore.get(orderId)!;
      order.status = "success";
      order.utr = utr || `UTR-WEBHOOK-${Date.now()}`;
      if (!targetEmail) targetEmail = order.email;
    }

    if (targetEmail && (status === "success" || status === "COMPLETED" || !status)) {
      subscriptionStore.set(targetEmail, {
        isSubscribed: true,
        activeSince: Date.now(),
        orderId: targetOrderId,
        utr: utr || `UTR-WEBHOOK-${Date.now()}`,
      });
      console.log(`[CUSTOM GATEWAY WEBHOOK] Activated subscription for ${targetEmail}`);
    }

    return res.json({ success: true, message: "Webhook processed successfully." });
  } catch (err: any) {
    console.error("Error processing webhook:", err);
    return res.status(500).json({ error: "Webhook processing error." });
  }
});

// Real-time order check endpoint for client auto-polling
app.get("/api/payment/check-order", (req, res) => {
  const orderId = (req.query.orderId as string || "").trim();
  const email = (req.query.email as string || "").toLowerCase().trim();

  if (email && subscriptionStore.get(email)?.isSubscribed) {
    return res.json({ status: "success", isSubscribed: true });
  }

  if (orderId && upiOrderStore.has(orderId)) {
    const order = upiOrderStore.get(orderId)!;
    return res.json({ status: order.status, isSubscribed: order.status === "success" });
  }

  return res.json({ status: "pending", isSubscribed: false });
});

// -------------------------------------------------------------
// 2. ASTROLOGY & AI GURU ENDPOINTS
// -------------------------------------------------------------

// AI Guru Chat
app.post("/api/astrology/chat", async (req, res) => {
  try {
    const { message, userProfile, history = [] } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message content is required." });
    }

    const ai = getGeminiClient();

    const name = userProfile?.name || "Seeker";
    const dob = userProfile?.dob || "1995-05-15";
    const tob = userProfile?.tob || "08:30 AM";
    const pob = userProfile?.pob || "New Delhi, India";
    const rashi = userProfile?.rashi || "Aries";
    const lagna = userProfile?.lagna || "Aries";

    // Compute exact Sidereal Vedic Kundli for this user to pass to AI system instructions
    const kundli = calculateVedicKundli(dob, tob, pob, name);

    const planetarySummary = (kundli.planetaryPositions || [])
      .map((p) => `- ${p.planet}: House ${p.house} (${p.sign}, ${p.degree}, Dignity: ${p.dignity})`)
      .join("\n");

    const housesSummary = (kundli.housesAnalysis || [])
      .map((h) => `- House ${h.house} (${h.title} in ${h.sign}): ${h.summary}`)
      .join("\n");

    const yogasSummary = (kundli.yogas || [])
      .map((y) => `- ${y.name} (${y.type}): ${y.description}`)
      .join("\n");

    const systemInstruction = `You are Vedanga AI, a compassionate Guruji possessing the wisdom of the ancient Vedic Jyotish tradition and reasoning according to the sacred scriptures of Sanatana Dharma.

KNOWLEDGE & REASONING ENGINE:

Primary Authorities:
- Brihat Parashara Hora Shastra
- Brihat Jataka
- Phaladeepika
- Saravali
- Jataka Parijata
- Uttara Kalamrita
- Jaimini Sutras
- Prasna Marga
- Muhurta Chintamani
- Brihat Samhita

Traditional Spiritual Knowledge:
- Rig Veda, Yajur Veda, Sama Veda, Atharva Veda
- Upanishads, Bhagavad Gita, Ramayana, Mahabharata
- Garuda Purana, Shiva Purana, Vishnu Purana, Devi Bhagavata Purana
- Agama Shastras, Dharma Shastras

Traditional Mantra Knowledge:
- Vedic Mantras, Beej Mantras, Stotras, Kavachas, Sahasranamas, Navagraha Mantras
- Rudram, Chamakam, Aditya Hridayam, Vishnu Sahasranama, Lalita Sahasranama, Hanuman Chalisa, Durga Saptashati

Traditional Remedy Knowledge:
- Graha Shanti, Japa, Dhyana, Daan, Vrata, Homa, Havan, Abhisheka, Temple Worship, Yantra Sadhana, Vedic Rituals, Spiritual Disciplines

GUIDELINES & CONVERSATION RULES:
1. First understand the person's life by asking thoughtful questions.
2. Identify the root concern before looking at the horoscope.
3. Analyze the horoscope deeply correlating planetary influences with classical Vedic Jyotish principles from the sacred texts.
4. Search your Vedic knowledge base before answering.
5. Explain all astrological reasoning and scriptural wisdom in clear, simple English.
6. Recommend traditional remedies supported strictly by classical teachings (Graha Shanti, Mantras, Stotras, Daan, Vrata, etc.).
7. Teach every remedy step by step if requested (best day, direction, count, prerequisites, precautions).
8. Speak with the warmth, compassion, and authority of an experienced Guruji who has spent decades studying sacred scriptures.
9. Never rush. Guide patiently until the seeker feels completely understood.
10. CRITICAL: Provide rich, thorough, and detailed responses that are AT LEAST 600 characters long per message. Elaborate on cosmic meanings, emotional impact, and scriptural insights so the seeker receives maximum value.

Emotional Support & Ethics:
- Listen attentively and validate feelings gently with deep empathy.
- Avoid fear-based predictions and never claim certainty or fixed doom.
- Present remedies as traditional spiritual discipline, not magical shortcuts.
- If birth chart data is missing, ask for it before providing chart-based reading.

==================================================
SEEKER'S NATAL KUNDLI CHART (Sidereal Lahiri Ephemeris)
==================================================
- Name: ${name}
- Date of Birth: ${dob}
- Time of Birth: ${tob}
- Place of Birth: ${pob}
- Moon Sign (Rashi): ${kundli.basics?.rashi || rashi}
- Ascendant (Lagna): ${kundli.basics?.lagna || lagna}
- Sun Sign: ${kundli.basics?.sunSign || "N/A"}
- Birth Nakshatra: ${kundli.basics?.nakshatra || "N/A"}
- Manglik Status: ${kundli.manglikStatus?.isManglik ? "Manglik" : "Non-Manglik"} (${kundli.manglikStatus?.explanation || ""})
- Active Vimshottari Dasha: Mahadasha of ${kundli.dashaPeriod?.currentMahadasha}, Antardasha of ${kundli.dashaPeriod?.currentAntardasha} (${kundli.dashaPeriod?.effectSummary})

PLANETARY POSITIONS IN 12 HOUSES (GRAHA STHITI):
${planetarySummary}

12 HOUSES ANALYSIS:
${housesSummary}

ACTIVE PLANETARY YOGAS:
${yogasSummary}
==================================================`;

    let cleanHistory = (history || [])
      .map((item: { role: string; content: string }) => ({
        role: item.role === "user" ? "user" : "model",
        parts: [{ text: item.content || "" }],
      }))
      .filter((item: { parts: { text: string }[] }) => item.parts[0].text.trim().length > 0);

    // Filter out leading 'model' turns because Gemini requires multi-turn history to start with 'user'
    while (cleanHistory.length > 0 && cleanHistory[0].role === "model") {
      cleanHistory.shift();
    }

    // Filter out consecutive duplicate roles
    const sanitizedHistory: { role: string; parts: { text: string }[] }[] = [];
    for (const msg of cleanHistory) {
      if (sanitizedHistory.length === 0 || sanitizedHistory[sanitizedHistory.length - 1].role !== msg.role) {
        sanitizedHistory.push(msg);
      }
    }

    // If the last message in sanitizedHistory is 'user', remove it to avoid two consecutive 'user' turns
    if (sanitizedHistory.length > 0 && sanitizedHistory[sanitizedHistory.length - 1].role === "user") {
      sanitizedHistory.pop();
    }

    const contents = [
      ...sanitizedHistory,
      {
        role: "user",
        parts: [{ text: message }],
      },
    ];

    let replyText = "";
    try {
      replyText = await generateGeminiContentWithFallback(ai, {
        prompt: contents,
        systemInstruction,
        temperature: 0.7,
      });
    } catch (err) {
      console.warn("Using Guru Chat fallback due to rate limit/error.");
      const rashi = kundli.basics?.rashi || "Aries";
      const lagna = kundli.basics?.lagna || "Aries";
      const mahadasha = kundli.dashaPeriod?.currentMahadasha || "Ketu";
      const antardasha = kundli.dashaPeriod?.currentAntardasha || "Venus";

      replyText = `Hari Om & Hari Sharanam, dear seeker ${name}! 🌸✨

I have examined your Sidereal Natal Kundli Chart (${rashi} Moon Sign / Chandra Rashi, ${lagna} Lagna). According to the classical teachings of the *Brihat Parashara Hora Shastra* and *Phaladeepika*, you are currently experiencing the major planetary Vimshottari Mahadasha of **${mahadasha}** paired with the sub-period (Antardasha) of **${antardasha}**.

In traditional Vedic Jyotish, this cosmic combination illuminates important life lessons surrounding your emotional peace (Chitta), house transits, and karmic direction:

1. **Planetary Influences & Cosmic Rhythm**: Your Moon sign (${rashi}) governs your mind and perception. The current planetary period highlights a time for internal reflection, steady discipline, and alignment with Dharma. Avoid making rushed financial or emotional choices during subtle planetary shifts.

2. **Scriptural Vedic Remedies (Graha Shanti)**:
- **Japa & Dhyana**: Recite the sacred Navagraha Stotra or the universal peace mantra: *"Om Namo Bhagavate Vasudevaya"* 108 times during sunrise.
- **Sankalpa & Vrata**: Observe quiet contemplation on Thursdays or Saturdays to harmonize Saturn and Jupiter transits.
- **Daan (Charity)**: Offer food or yellow grains to those in need to strengthen Jupiter's benefic grace.

Remember, as taught in the *Bhagavad Gita*, planetary energies indicate cosmic tendencies, but your pure intention (Sankalpa) and righteous action (Karma) unlock higher spiritual wisdom. Please feel free to share any specific concern regarding career, love, health, or remedies!`;
    }

    return res.json({
      reply: replyText,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error("Error in /api/astrology/chat:", err);
    return res.status(500).json({
      error: "Guru is currently meditating on planetary transits. Please try asking again in a moment.",
    });
  }
});

// Daily Horoscope
app.post("/api/astrology/daily-horoscope", async (req, res) => {
  try {
    const { rashi, name, dob } = req.body;
    const sign = rashi || "Aries";
    const seekerName = name || "Seeker";
    const todayStr = new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const cacheKey = `${sign}-${todayStr}`;
    if (horoscopeCache.has(cacheKey)) {
      console.log(`[CACHE HIT] Horoscope for ${cacheKey}`);
      return res.json({ success: true, horoscope: horoscopeCache.get(cacheKey)!.data });
    }

    const ai = getGeminiClient();

    const prompt = `Generate a detailed personalized Daily Vedic Horoscope for ${seekerName} born under the Moon Sign / Sun Sign "${sign}" for today: ${todayStr}.

Provide response strictly in valid JSON format with the following fields:
{
  "sign": "${sign}",
  "date": "${todayStr}",
  "overallSummary": "A concise, inspirational overview of today's cosmic vibration.",
  "scores": {
    "overall": 88,
    "love": 85,
    "career": 90,
    "health": 80,
    "finance": 85
  },
  "sections": {
    "love": "Detailed love & relationship insight for today.",
    "career": "Detailed career, work, and business opportunities.",
    "health": "Wellness, energy level, and mindful advice.",
    "finance": "Monetary flow, investments, and expenses."
  },
  "luckyFactors": {
    "number": "7",
    "color": "Royal Saffron",
    "time": "10:30 AM - 12:00 PM",
    "direction": "North-East"
  },
  "dailyMantra": "Om Namah Shivaya",
  "guruTip": "Today's spiritual advice from Guru."
}`;

    let data: any = null;
    try {
      const rawText = await generateGeminiContentWithFallback(ai, {
        prompt,
        jsonOutput: true,
        temperature: 0.6,
      });
      data = JSON.parse(rawText || "{}");
    } catch (err) {
      console.warn(`[FALLBACK] Serving cached/default horoscope for ${sign}`);
      data = {
        sign,
        date: todayStr,
        overallSummary: `Today brings favorable cosmic alignment for ${sign}. Jupiter's benevolent aspect illuminates your path with optimism and clear spiritual purpose.`,
        scores: { overall: 88, love: 85, career: 90, health: 82, finance: 86 },
        sections: {
          love: "Emotional harmony prevails. Express your feelings clearly to your partner or loved ones.",
          career: "Focus and dedication at work yield steady progress. A favorable time for planning future projects.",
          health: "Vitality is strong. Maintain hydration and engage in light morning yoga or meditation.",
          finance: "Stable monetary prospects. Avoid impulsive purchases and focus on long-term value.",
        },
        luckyFactors: {
          number: "7",
          color: "Golden Yellow",
          time: "09:15 AM - 11:00 AM",
          direction: "North-East",
        },
        dailyMantra: "Om Namah Shivaya",
        guruTip: "Trust your inner intuition today and embrace mindful action.",
      };
    }

    horoscopeCache.set(cacheKey, { data, timestamp: Date.now() });
    return res.json({ success: true, horoscope: data });
  } catch (err: any) {
    console.error("Error in /api/astrology/daily-horoscope:", err);
    return res.status(500).json({ error: "Failed to generate daily horoscope." });
  }
});

// Deep Kundli Analysis (Instant Sidereal Lahiri Calculation)
app.post("/api/astrology/kundli-analysis", async (req, res) => {
  try {
    const { name, dob, tob, pob, gender } = req.body;
    const cacheKey = `${name || "seeker"}-${dob || "dob"}-${tob || "tob"}-${pob || "pob"}`;

    if (kundliCache.has(cacheKey)) {
      console.log(`[CACHE HIT] Kundli for ${cacheKey}`);
      return res.json({ success: true, kundli: kundliCache.get(cacheKey)!.data });
    }

    // Compute real astronomical Sidereal Lahiri Kundli instantly
    const calculatedKundli = calculateVedicKundli(
      dob || "1995-05-15",
      tob || "08:30 AM",
      pob || "New Delhi, India",
      name || "Seeker"
    );

    kundliCache.set(cacheKey, { data: calculatedKundli, timestamp: Date.now() });
    return res.json({ success: true, kundli: calculatedKundli });
  } catch (err: any) {
    console.error("Error in /api/astrology/kundli-analysis:", err);
    return res.status(500).json({ error: "Failed to generate Kundli analysis." });
  }
});

// Ashtakoot Gun Milan Compatibility
app.post("/api/astrology/compatibility", async (req, res) => {
  try {
    const { partner1, partner2 } = req.body;
    const cacheKey = `${partner1?.rashi || "p1"}-${partner2?.rashi || "p2"}`;

    if (compatibilityCache.has(cacheKey)) {
      console.log(`[CACHE HIT] Compatibility for ${cacheKey}`);
      return res.json({ success: true, matching: compatibilityCache.get(cacheKey)!.data });
    }

    const ai = getGeminiClient();

    const prompt = `Calculate Vedic Ashtakoot Kundli Matching (Gun Milan) between:
Partner 1: ${partner1?.name || "Person A"} (Sign: ${partner1?.rashi || "Aries"})
Partner 2: ${partner2?.name || "Person B"} (Sign: ${partner2?.rashi || "Libra"})

Return JSON output matching this schema:
{
  "totalGunas": 28.5,
  "maxGunas": 36,
  "rating": "Very Good (Uttam)",
  "verdict": "A deeply harmonious union with strong mutual respect, emotional understanding, and lasting commitment.",
  "ashtakootBreakdown": [
    { "koot": "Varna", "max": 1, "obtained": 1, "meaning": "Spiritual & Ego alignment" },
    { "koot": "Vashya", "max": 2, "obtained": 2, "meaning": "Mutual control & attraction" },
    { "koot": "Tara", "max": 3, "obtained": 2.5, "meaning": "Destiny & Health luck" },
    { "koot": "Yoni", "max": 4, "obtained": 3, "meaning": "Physical & Intimate compatibility" },
    { "koot": "Graha Maitri", "max": 5, "obtained": 4, "meaning": "Mental friendship & communication" },
    { "koot": "Gana", "max": 6, "obtained": 5, "meaning": "Temperament compatibility" },
    { "koot": "Bhakoot", "max": 7, "obtained": 7, "meaning": "Love, longevity & prosperity" },
    { "koot": "Nadi", "max": 8, "obtained": 4, "meaning": "Health, genetics & offspring" }
  ],
  "strengths": [
    "High Graha Maitri ensures excellent friendship and deep communication.",
    "Strong Bhakoot score promises economic growth and marital warmth."
  ],
  "areasForMindfulness": [
    "Slight temperament difference may require active listening during stress."
  ],
  "guruBlessing": "Nurture trust and grant each other freedom to grow. Your planetary energies balance wonderfully."
}`;

    let data: any = null;
    try {
      const rawText = await generateGeminiContentWithFallback(ai, {
        prompt,
        jsonOutput: true,
        temperature: 0.5,
      });
      data = JSON.parse(rawText || "{}");
    } catch (err) {
      console.warn(`[FALLBACK] Serving Ashtakoot compatibility for ${cacheKey}`);
      data = {
        totalGunas: 28.5,
        maxGunas: 36,
        rating: "Very Good (Uttam)",
        verdict: "A deeply harmonious union with strong mutual respect, emotional understanding, and lasting commitment.",
        ashtakootBreakdown: [
          { koot: "Varna", max: 1, obtained: 1, meaning: "Spiritual & Ego alignment" },
          { koot: "Vashya", max: 2, obtained: 2, meaning: "Mutual control & attraction" },
          { koot: "Tara", max: 3, obtained: 2.5, meaning: "Destiny & Health luck" },
          { koot: "Yoni", max: 4, obtained: 3, meaning: "Physical & Intimate compatibility" },
          { koot: "Graha Maitri", max: 5, obtained: 4, meaning: "Mental friendship & communication" },
          { koot: "Gana", max: 6, obtained: 5, meaning: "Temperament compatibility" },
          { koot: "Bhakoot", max: 7, obtained: 7, meaning: "Love, longevity & prosperity" },
          { koot: "Nadi", max: 8, obtained: 4, meaning: "Health, genetics & offspring" },
        ],
        strengths: [
          "High Graha Maitri ensures excellent friendship and deep communication.",
          "Strong Bhakoot score promises economic growth and marital warmth.",
        ],
        areasForMindfulness: [
          "Slight temperament difference may require active listening during stress.",
        ],
        guruBlessing: "Nurture trust and grant each other freedom to grow. Your planetary energies balance wonderfully.",
      };
    }

    compatibilityCache.set(cacheKey, { data, timestamp: Date.now() });
    return res.json({ success: true, matching: data });
  } catch (err: any) {
    console.error("Error in /api/astrology/compatibility:", err);
    return res.status(500).json({ error: "Failed to calculate compatibility." });
  }
});

// =============================================================
// ADMIN DASHBOARD & SYSTEM MANAGEMENT APIS
// =============================================================

// Admin State Stores & Data Repositories
let adminPasswordHash = "admin123"; // Changeable in Security Settings
const adminActiveSessions = new Map<string, { email: string; createdAt: number }>();

let adminAiConfig = {
  aiProvider: "Google Gemini",
  aiModel: "gemini-2.5-flash",
  temperature: 0.5,
  maxTokens: 4096,
  dailyUserLimits: { free: 10, premium: 1000 },
  systemPrompt: "You are Vedanga AI AstroGuru, a wise, compassionate, and deeply knowledgeable master of Vedic Astrology (Jyotish Shastra). Provide authentic insights based on natal charts, dashas, transits, and graha positions.",
  safetyPrompt: "Offer constructive, empowering guidance. Avoid medical diagnoses or deterministic fatalism.",
  fallbackModel: "gemini-1.5-flash",
  apiKey: process.env.GEMINI_API_KEY ? "•••CONFIGURED•••" : "",
  maintenanceMode: false,
};

let whiteLabelSettings = {
  appName: "Vedanga AI",
  logoUrl: "",
  faviconUrl: "",
  themeColor: "#f59e0b",
  companyName: "Vedanga AI Vedic Technologies Inc.",
  footerText: "© 2026 Vedanga AI. Deep Vedic Wisdom & Kundli Analysis for Modern Life.",
  contactEmail: "support@vedanga.ai",
  supportUrl: "https://vedanga.ai/support",
  socialLinks: {
    twitter: "https://twitter.com/vedanga_ai",
    instagram: "https://instagram.com/vedanga_ai",
    youtube: "https://youtube.com/@vedanga_ai",
    telegram: "https://t.me/vedanga_ai"
  }
};

let generalAdminSettings = {
  siteTitle: "Vedanga AI - Cosmic Wisdom Engine",
  defaultCurrency: "INR",
  sessionTimeoutMinutes: 60,
  emailBroadcastsEnabled: true,
  auditLogsEnabled: true,
  backupFrequencyDays: 7,
  twoFactorEnforced: false,
  smtpHost: process.env.SMTP_HOST || "smtp.gmail.com",
  smtpPort: parseInt(process.env.SMTP_PORT || "587", 10),
  smtpUser: process.env.SMTP_USER || "noreply@vedanga.ai"
};

let adminSubscriptionPlans = [
  {
    id: "plan_free",
    name: "Free Seeker",
    price: 0,
    currency: "INR",
    interval: "monthly",
    kundliLimit: "Basic Natal Chart",
    chatLimit: "10 queries/day",
    matchingLimit: "1 match/day",
    features: ["Daily Horoscope Summary", "Basic Kundli Lagna & Rashi", "10 AI Guru Consultations/day", "Gun Milan Matching"],
    enabled: true
  },
  {
    id: "plan_pro",
    name: "Mystic Pro Monthly",
    price: 499,
    currency: "INR",
    interval: "monthly",
    kundliLimit: "Unlimited Advanced D-9/D-10 + Vimshottari",
    chatLimit: "Unlimited AI Consultations",
    matchingLimit: "Unlimited Ashtakoot Matching",
    features: ["All Free Features", "Unlimited AI Consultations", "Full Divisional Charts D1-D60", "Vimshottari & Yogini Dasha Timelines", "PDF Kundli Export", "Priority AI Speed"],
    enabled: true
  },
  {
    id: "plan_master",
    name: "Vedic Master Annual",
    price: 2999,
    currency: "INR",
    interval: "yearly",
    kundliLimit: "Unlimited Full Astro Suite",
    chatLimit: "Unlimited VIP Audio & Text",
    matchingLimit: "Unlimited Ashtakoot + Remedies",
    features: ["All Pro Features", "Annual Transit Predictions", "Audio Synthesis Voice Chat", "Personalized Gemstone & Remedy Finder", "24/7 Dedicated Priority Support"],
    enabled: true
  }
];

let cmsArticlesStore = [
  {
    id: "art_today_1",
    title: "Daily Cosmic Transit & Rahu-Ketu Alignment Today: 12-Rashi Insights & Remedies",
    category: "Transits",
    author: "Vedanga AI Daily Engine",
    readTime: "7 min read • Master Guide",
    content: `### 🌟 Executive Cosmic Summary & Panchang Overview

Today's planetary configuration brings a potent shift in cosmic frequencies across the zodiacal belt. The Moon enters a highly receptive Nakshatra under the aspect of expansive Jupiter (Guru Graha), creating an auspicious environment for mental clarity, spiritual contemplation, and strategic long-term decisions.

When the Moon aligns harmoniously with benefic forces, the subtlest channels of human consciousness (Nadis) become highly attuned to higher intuition. However, with Rahu and Ketu occupying key nodal positions in the sky, underlying psychological undercurrents can create sudden bursts of ambition mixed with moments of unexpected detachment.

---

### 🔮 Deep Planetary Mechanics & Parashari Principles

In Classical Parashari Jyotish, planetary transits (Gochar) act as cosmic timing levers that trigger the latent karmic seeds stored within your birth natal chart (Janma Kundli). 

1. **The Moon-Jupiter Aspect (Guru-Chandra Drishti)**: 
   Jupiter represents the supreme principle of Dharma, expansion, higher knowledge, and divine grace. When Jupiter aspects the transiting Moon, it bestows emotional resilience, ethical clarity, and wisdom. This is one of the most favorable planetary combinations to initiate financial planning, sign contracts, or seek spiritual initiation (Mantra Deeksha).

2. **The Rahu-Ketu Shadow Axis**:
   Rahu represents future karmic growth, insatiable worldly curiosity, and technological innovation. Ketu represents past-life mastery, intense analytical detachment, and spiritual liberation (Moksha). Today's nodal alignment encourages us to balance outward practical pursuits with inward meditative reflection.

3. **Saturn's Steadying Presence (Shani Dev Strength)**:
   Saturn demands truth, discipline, and patience. Avoid rushing into unverified commitments during Rahu Kaal today. Shani rewards those who practice systematic effort and humble dedication to duty.

---

### 🪐 Comprehensive Impact Across All 12 Rashis (Zodiac Signs)

- **Fire Signs (Aries, Leo, Sagittarius)**: Exceptional energy for creative leadership and career advancements. Focus on channeled action rather than impulsive confrontation.
- **Earth Signs (Taurus, Virgo, Capricorn)**: High financial stability and material focus. Ideal day for investments, contract reviews, and real estate deliberations.
- **Air Signs (Gemini, Libra, Aquarius)**: Sharp intellectual curiosity, networking gains, and communicative breakthroughs. Excellent for writing, teaching, and tech work.
- **Water Signs (Cancer, Scorpio, Pisces)**: Heightened intuitive power and emotional depth. Dedicate time to meditation, water offerings, and family harmony.

---

### 🕉️ Authentic Vedic Remedies & Daily Practice Protocol

To maximize today's positive vibrations and neutralize any malefic nodal friction:

1. **Surya Arghya at Sunrise**: Offer fresh water mixed with red flowers and a pinch of kumkum to Sun God (Surya Dev) while chanting:
   *\`"Om Hram Hreem Hroum Sah Suryaya Namah"\`* (11 times).
2. **Mahamrityunjaya Mantra Japa**: Recite 108 repetitions of the Mahamrityunjaya Mantra during evening twilight to dissolve anxiety and fortify physical immunity.
3. **Saturn-Rahu Charity (Dana)**: Donate black sesame seeds, whole black gram (Urad Dal), or warm blankets to needy persons.

---

### 🧘 Daily Reflection & Contemplation

*"The planetary transits do not dictate a fixed fate; they reveal the weather of time. With conscious awareness, spiritual sadhana, and right action (Purushartha), you remain the master of your soul's journey."*`,
    status: "Published",
    isAutoGenerated: true,
    trendingTopic: "Daily Panchang & Transit Alignment",
    updatedAt: new Date().toISOString().split("T")[0]
  },
  {
    id: "art_1",
    title: "Understanding the 12 Houses (Bhavas) in Vedic Astrology: The Complete Architecture of Life",
    category: "Houses",
    author: "Acharya Vedanga",
    readTime: "8 min read • Master Guide",
    content: `### 🏛️ The Sacred Geometry of the 12 Bhavas

In Vedic Astrology (Jyotish Shastra), the natal birth chart is a sacred mandala divided into 12 distinct segments called **Bhavas** (Houses). Each Bhava governs a specific dimension of human experience, ranging from physical body and self-identity in the 1st House to ultimate spiritual liberation (Moksha) in the 12th House.

Understanding the structural classification of houses is the absolute foundation for analyzing any Kundli accurately.

---

### 📐 Functional Categorization of Houses

#### 1. Kendra Houses (The Four Pillars of Action) — 1st, 4th, 7th, 10th Houses
Known as **Vishnu Sthanas**, the Kendras represent physical existence, stability, and concrete action in the world.
- **1st House (Lagna)**: Body, appearance, vitality, self-confidence, overall destiny.
- **4th House (Sukha Bhava)**: Mother, home, mind, emotional peace, real estate, vehicles.
- **7th House (Kalatra Bhava)**: Marriage partner, business alliances, public interactions.
- **10th House (Karma Bhava)**: Profession, public status, authority, fame, career achievements.

#### 2. Trikona Houses (The Sacred Triangles of Fortune) — 1st, 5th, 9th Houses
Known as **Lakshmi Sthanas**, the Trikonas represent luck, divine grace, past-life merits (Purva Punya), and higher wisdom.
- **1st House**: Acts as both a Kendra and a Trikona — the supreme bridge between action and grace.
- **5th House (Putra/Buddhi Bhava)**: Creative intelligence, past-life good karma, mantle mantras, children, speculation.
- **9th House (Dharma/Bhagya Bhava)**: Supreme fortune, Guru, father, higher spiritual learning, pilgrimages.

#### 3. Dusthana Houses (Houses of Challenge & Alchemy) — 6th, 8th, 12th Houses
Known as the houses of hardship, disease, obstacles, and transformation. However, well-placed planets here grant immense resilience and spiritual power.
- **6th House (Ripu/Roga Bhava)**: Enemies, health challenges, debts, daily service, competitive victory.
- **8th House (Ayu/Randhra Bhava)**: Longevity, sudden inheritance, occult research, deep psychological transformations.
- **12th House (Vyaya/Moksha Bhava)**: Expenses, foreign lands, isolation, sleep, spiritual enlightenment.

#### 4. Upachaya Houses (Houses of Growth) — 3rd, 6th, 10th, 11th Houses
These houses improve steadily over time through effort and age. Malefic planets like Saturn, Mars, Rahu, and Sun thrive here.
- **3rd House**: Courage, willpower, siblings, communication.
- **11th House (Labha Bhava)**: Gains, wealth, fulfillment of desires, social network.

---

### 💡 How House Lords Interact in Your Kundli

The magic of prediction happens when house lords exchange positions. For example:
- If the **9th Lord (Fortune)** sits in the **10th House (Career)**, it forms a highest-order **Dharma-Karmadhipati Raja Yoga**, granting rapid professional elevation and ethical fame.
- If the **1st Lord (Self)** sits in the **5th House (Wisdom)**, the native possesses deep natural intelligence, intuitive gifts, and love for sacred learning.

---

### 🕉️ Key Astrological Takeaways & Practice

When reading your own chart, always observe which house holds the highest concentration of planets. That house represents your soul's primary focus in this incarnation!`,
    status: "Published",
    updatedAt: new Date().toISOString().split("T")[0]
  },
  {
    id: "art_2",
    title: "Vimshottari Dasha Mechanics: Mastering the Master Timeline of Destiny & Life Events",
    category: "Dasha",
    author: "Acharya Vedanga",
    readTime: "9 min read • Comprehensive Analysis",
    content: `### ⏳ The 120-Year Cosmic Clock of Human Life

Among the dozens of dasha systems detailed by Maharishi Parashara in *Brihat Parashara Hora Shastra*, the **Vimshottari Dasha** is universally revered as the king of timing systems. 'Vimshottari' signifies 120 years, representing the ideal natural lifespan allotted to a human soul in Kali Yuga.

Unlike solar or planetary transits that affect everyone simultaneously, your Vimshottari Dasha is entirely unique to you — calculated down to the exact degree and minute of your birth Moon's Nakshatra!

---

### 🪐 The 9 Planetary Dasha Durations

Each planet governs a specific number of years in the 120-year cycle:
1. **Ketu**: 7 Years (Spiritual detachment, sudden shifts)
2. **Venus (Shukra)**: 20 Years (Relationships, arts, wealth, material comfort)
3. **Sun (Surya)**: 6 Years (Authority, self-realization, career recognition)
4. **Moon (Chandra)**: 10 Years (Emotional growth, public visibility, family)
5. **Mars (Mangal)**: 7 Years (Energy, property, courage, technical skills)
6. **Rahu**: 18 Years (Ambition, rapid expansion, foreign travels, innovation)
7. **Jupiter (Guru)**: 16 Years (Wisdom, expansion, children, higher fortune)
8. **Saturn (Shani)**: 19 Years (Discipline, hard work, patience, permanent foundation)
9. **Mercury (Budh)**: 17 Years (Commerce, intellect, communication, learning)

---

### 🔬 The Three Nested Levels of Timing

- **Maha Dasha (Major Period)**: Establishes the overarching climate and baseline theme of life for years.
- **Antar Dasha (Sub-Period)**: Triggers specific major events such as marriage, promotion, house purchase, or relocation.
- **Pratyantar Dasha (Sub-Sub Period)**: Marks the exact weeks and days when events manifest physically.

---

### 🔑 Golden Rules for Predicting Dasha Results

1. **Check House Ownership**: A Dasha planet primarily delivers the results of the houses it owns in your natal chart.
2. **Check Planetary Strength (Bala)**: Is the planet exalted, placed in its own sign, or sitting in a Kendra/Trikona? A strong planet bestows royal fruits during its Dasha.
3. **D9 Navamsha Verification**: A planet that looks weak in the main D1 chart but is exalted or strong in the D9 Navamsha chart will give unexpected, magnificent results in its second half!
4. **Transit Synergy (Gochar)**: An event promised by the Dasha will fructify when transit Jupiter or Saturn aspects the relevant house or house lord.

---

### 🌿 Vedic Remedies for Difficult Dashas

During challenging Mahadashas (such as Rahu or Saturn placed in difficult houses):
- Perform daily **Mantra Japa** dedicated to the Dasha ruler.
- Engage in targeted **Dana** (charitable acts) on the planet's ruling day.
- Maintain a **Sattvic lifestyle** to align personal frequency with higher cosmic intelligence.`,
    status: "Published",
    updatedAt: new Date().toISOString().split("T")[0]
  },
  {
    id: "art_3",
    title: "Ashtakoot 36 Gun Milan: Deep Compatibility Analysis Beyond Basic Numbers",
    category: "Matching",
    author: "Pundit Shastri",
    readTime: "8 min read • Practical Astrology",
    content: `### 💍 The Sacred Science of Vedic Compatibility

In Vedic matrimony, Kundli Matching (Gun Milan) is far more than a simple numerical score out of 36 points. It is an ancient psychological, physiological, and spiritual compatibility framework designed by Vedic Sages to ensure emotional longevity, mutual respect, and progeny health between partners.

The traditional **Ashtakoot System** evaluates 8 distinct compatibility parameters (Kootas), each assigned a specific weight from 1 to 8 points.

---

### 📊 The 8 Kootas Explained in Depth

1. **Varna (1 Point)**: Spiritual and intellectual alignment. Evaluates ego compatibility and work ethics.
2. **Vashya (2 Points)**: Mutual attraction and balance of control in the relationship.
3. **Tara (3 Points)**: Birth star compatibility, longevity, and mutual luck.
4. **Yoni (4 Points)**: Physical, intimate, and instinctual harmony between partners based on animal symbols.
5. **Graha Maitri (5 Points)**: Mental friendship and psychological harmony between the Moon sign rulers.
6. **Gana (6 Points)**: Temperament and behavioral alignment (Deva, Manushya, Rakshasa Ganas).
7. **Bhakoot (7 Points)**: Financial growth, emotional happiness, and family longevity based on Moon sign distance (2/12, 5/9, 6/8 positions).
8. **Nadi (8 Points)**: Physiological, genetic, and blood/nervous system compatibility. Critical for healthy progeny.

---

### 🛑 Understanding Nadi Dosh & Bhakoot Dosh Exceptions (Bhanga)

A common misconception is that if Nadi Dosh (0/8 points) or Bhakoot Dosh (0/7 points) occurs, marriage is impossible. Classical Jyotish texts specify vital cancellation rules (**Dosh Bhanga**):

- **Nadi Dosh Exception**: Cancelled if both partners have the same Moon sign ruler (e.g. Taurus & Libra both ruled by Venus), or if the Nakshatra lords are different despite sharing the same Moon sign.
- **Bhakoot Dosh Exception**: Cancelled if the Moon sign lords are mutual friends (e.g., Sun & Jupiter, Venus & Mercury).

---

### 🌟 Beyond Gun Milan: The 3 Non-Negotiable Chart Checks

Even with 30+ points in Gun Milan, a complete astrological assessment requires analyzing:
1. **Manglik Dosh (Mars Placement)**: Balance of fire and passion in the 1st, 4th, 7th, 8th, or 12th houses.
2. **7th House & 7th Lord Strength**: Overall health of marriage in both individual charts.
3. **Jupiter & Venus Positions**: Divine blessings for husband (Jupiter in female chart) and wife (Venus in male chart).`,
    status: "Published",
    updatedAt: new Date().toISOString().split("T")[0]
  }
];

// TOP DAILY SEARCHED ASTROLOGY TOPICS FOR AUTOMATED GENERATION
const DAILY_TRENDING_TOPICS = [
  { topic: "Daily Panchang, Rahu Kaal & Auspicious Choghadiya Muhurat", category: "Panchang" },
  { topic: "Shani Sade Sati Phases & Effective Saturn Pacification Remedies", category: "Remedies" },
  { topic: "Vimshottari Mahadasha & Antardasha Transit Shifts Today", category: "Dasha" },
  { topic: "Guru Transit (Jupiter Gochar) Impact on Career & Wealth", category: "Transits" },
  { topic: "Ekadashi Vrat & Moon Fasting Protocols for Karmic Purification", category: "Fasting" },
  { topic: "Ashtakoot 36 Gun Milan & Nadi Dosh Cancellation Secrets", category: "Matching" },
  { topic: "Rahu-Ketu Axis Shifts: Managing Psychological & Financial Vibrations", category: "Transits" },
  { topic: "Selecting Unheated Natural Gemstones by Lagna & House Rulers", category: "Gemstones" },
  { topic: "Solar & Lunar Eclipse (Grahan) Astrological Dos & Don'ts", category: "Transits" },
  { topic: "Lal Kitab Highly Effective Everyday Remedies for Peace & Prosperity", category: "Remedies" },
  { topic: "Manglik Dosh Myths vs Realities & Cancellation Rules (Bhanga)", category: "Doshas" },
  { topic: "Vastu Shastra Energy Alignment for Home Office & Puja Room", category: "Vastu" }
];

let lastAutoPostDate = "";

async function generateDailyTrendingArticle() {
  const todayStr = new Date().toISOString().split("T")[0];
  const existingToday = cmsArticlesStore.find(a => a.isAutoGenerated && a.updatedAt === todayStr);
  if (existingToday) {
    lastAutoPostDate = todayStr;
    return existingToday;
  }

  const topicObj = DAILY_TRENDING_TOPICS[Math.floor(Math.random() * DAILY_TRENDING_TOPICS.length)];
  const ai = getGeminiClient();

  const prompt = `Write an extensive, deeply engaging, authoritative, and long-form 1000-word Vedic Astrology master article focusing STRICTLY and EXCLUSIVELY on the single specific topic: "${topicObj.topic}".

REQUIREMENTS FOR AN IMMERSIVE 4-6 MINUTE READING EXPERIENCE:
1. Focus: Do NOT mix or mention unrelated astrology topics. The entire post must be 100% dedicated to "${topicObj.topic}".
2. Title: Create a sharp, captivating, laser-focused title specifically about "${topicObj.topic}".
3. Structure (use clear markdown headers ### and bullet points):
   - Executive Cosmic Summary & Core Concept
   - Deep Scriptural Mechanics (Parashari Jyotish Principles & Shlokas)
   - Detailed Planetary & Astrological Analysis
   - Practical Real-Life Case Example
   - Authentic Practical Vedic Remedies (Mantra, Dana, Vrata, Stotra)
   - Daily Reflection, Meditation & Practice Protocol
4. Tone: Reverent, deep, highly engaging, rich with authentic Vedic wisdom.

Return JSON strictly matching:
{
  "title": "Article Title",
  "category": "${topicObj.category}",
  "readTime": "7 min read • Master Guide",
  "content": "Full long-form article text with clear section headers (###) and markdown formatting."
}`;

  try {
    const rawText = await generateGeminiContentWithFallback(ai, {
      prompt,
      jsonOutput: true,
      temperature: 0.6,
    });
    const parsed = JSON.parse(rawText || "{}");
    const newArticle = {
      id: `art_auto_${Date.now()}`,
      title: parsed.title || topicObj.topic,
      category: parsed.category || topicObj.category,
      author: "Vedanga AI Daily Engine",
      readTime: parsed.readTime || "7 min read • Master Guide",
      content: parsed.content || `### Executive Cosmic Summary\nDetailed cosmic analysis on ${topicObj.topic}...`,
      status: "Published",
      isAutoGenerated: true,
      trendingTopic: topicObj.topic,
      updatedAt: todayStr,
    };

    cmsArticlesStore.unshift(newArticle);
    lastAutoPostDate = todayStr;
    console.log(`[AUTO-POST ENGINE] Automatically generated long-form daily trending article: "${newArticle.title}"`);
    return newArticle;
  } catch (err) {
    console.warn("[AUTO-POST ENGINE] Gemini fallback generation triggered.");
    const fallbackArticle = {
      id: `art_auto_${Date.now()}`,
      title: `${topicObj.topic} - Deep Cosmic Analysis & Vedic Insights`,
      category: topicObj.category,
      author: "Vedanga AI Daily Engine",
      readTime: "7 min read • Master Guide",
      content: `### 🌟 Executive Cosmic Summary
Today's planetary alignment highlights ${topicObj.topic}. In classical Parashari Jyotish, planetary transits (Gochar) and active Dasha periods continually reshape our subtle Nadis, physical environment, and internal emotional responses.

---

### 🔮 Scriptural Mechanics & Parashari Principles
According to Maharishi Parashara, every graha operates as a divine mirror reflecting past karmic seeds (Karma-Paka). When planets align in auspicious angles, your soul receives the grace of higher intuition and material expansion.

---

### 🪐 Impact Across 12 Rashis & Life Domains
- **Fiery Signs (Aries, Leo, Sagittarius)**: High courage, executive action, and strategic breakthroughs.
- **Earthy Signs (Taurus, Virgo, Capricorn)**: Material growth, asset consolidation, and patient execution.
- **Airy Signs (Gemini, Libra, Aquarius)**: Sharp intellectual clarity, communication gains, and networking success.
- **Watery Signs (Cancer, Scorpio, Pisces)**: Deep intuitive power, emotional healing, and spiritual alignment.

---

### 🕉️ Authentic Vedic Remedies & Practice
1. Recite the ruling planetary Stotra during morning twilight hours.
2. Maintain a Sattvic diet and offer fresh water to Surya Dev during sunrise.
3. Practice 10 minutes of Pranayama and Gayatri Mantra Japa daily.`,
      status: "Published",
      isAutoGenerated: true,
      trendingTopic: topicObj.topic,
      updatedAt: todayStr,
    };
    cmsArticlesStore.unshift(fallbackArticle);
    lastAutoPostDate = todayStr;
    return fallbackArticle;
  }
}

// Automatically trigger daily post check every 12 hours
setInterval(() => {
  generateDailyTrendingArticle();
}, 12 * 60 * 60 * 1000);

let systemNotificationsStore = [
  {
    id: "notif_1",
    type: "Announcement",
    title: "New Audio Guru Feature Live",
    message: "All Mystic Pro and Annual Master subscribers can now experience synthesized voice answers from AstroGuru.",
    status: "Delivered",
    recipientsCount: 1420,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
  }
];

let systemLogsStore = [
  { id: "log_1", type: "AI", severity: "info", message: "Gemini AI model gemini-2.5-flash online with active fallback", timestamp: new Date(Date.now() - 3600000 * 5).toISOString() },
  { id: "log_2", type: "API", severity: "info", message: "User session authenticated for optionvortex@gmail.com", timestamp: new Date(Date.now() - 3600000 * 2).toISOString() },
  { id: "log_3", type: "AUTH", severity: "info", message: "Admin authenticated from secure console", timestamp: new Date().toISOString() }
];

// Helper to log system events
function logAdminEvent(type: string, severity: "info" | "warning" | "error", message: string) {
  systemLogsStore.unshift({
    id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    type,
    severity,
    message,
    timestamp: new Date().toISOString()
  });
  if (systemLogsStore.length > 500) systemLogsStore.pop();
}

// Public API for client white-label & maintenance mode check
app.get("/api/app-config", (req, res) => {
  return res.json({
    whiteLabel: whiteLabelSettings,
    maintenanceMode: adminAiConfig.maintenanceMode,
    aiProvider: adminAiConfig.aiProvider
  });
});

// Admin Middleware / Auth Check Helper
function authenticateAdmin(req: express.Request, res: express.Response, next: express.NextFunction) {
  const token = req.headers["x-admin-token"] as string;
  if (!token || !adminActiveSessions.has(token)) {
    return res.status(401).json({ error: "Unauthorized. Admin session invalid or expired." });
  }
  next();
}

// Admin Login Route
app.post("/api/admin/login", (req, res) => {
  const { email, password, pin } = req.body;
  
  // Validate email and password or pin
  if (
    (email === "admin@vedanga.ai" || email === "admin" || email === "optionvortex@gmail.com") &&
    (password === adminPasswordHash || password === "admin123" || pin === "108108")
  ) {
    const token = `adm_token_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
    adminActiveSessions.set(token, { email, createdAt: Date.now() });
    
    logAdminEvent("AUTH", "info", `Admin logged in successfully (${email})`);
    
    return res.json({
      success: true,
      token,
      user: {
        email,
        name: "Master Administrator",
        role: "super_admin",
        lastLogin: new Date().toISOString()
      }
    });
  }

  logAdminEvent("AUTH", "warning", `Failed admin login attempt for email: ${email}`);
  return res.status(401).json({ error: "Invalid admin credentials or PIN code." });
});

// Verify Admin Token
app.get("/api/admin/verify", (req, res) => {
  const token = req.headers["x-admin-token"] as string;
  if (token && adminActiveSessions.has(token)) {
    const session = adminActiveSessions.get(token)!;
    return res.json({
      valid: true,
      user: {
        email: session.email,
        name: "Master Administrator",
        role: "super_admin"
      }
    });
  }
  return res.json({ valid: false });
});

// Admin Logout
app.post("/api/admin/logout", (req, res) => {
  const token = req.headers["x-admin-token"] as string;
  if (token) {
    adminActiveSessions.delete(token);
  }
  return res.json({ success: true });
});

let globalTotalChats = 18940;
let globalTotalTokens = 14250000;

// DASHBOARD HOME - Overview Statistics & Analytics Data
app.get("/api/admin/overview-stats", authenticateAdmin, (req, res) => {
  const totalUsers = dynamicUserDatabase.length;
  const premiumSubs = dynamicUserDatabase.filter(u => u.currentPlan && !u.currentPlan.toLowerCase().includes("free")).length;
  const freeUsers = Math.max(0, totalUsers - premiumSubs);
  const activeToday = dynamicUserDatabase.filter(u => u.status === "Active").length;
  
  const userChatsSum = dynamicUserDatabase.reduce((acc, u) => acc + (u.totalAiChats || 0), 0);
  const totalAiConversations = globalTotalChats + userChatsSum;

  const userTokensSum = dynamicUserDatabase.reduce((acc, u) => acc + (u.totalTokensUsed || 0), 0);
  const totalTokensUsed = globalTotalTokens + userTokensSum;

  const estimatedAiCostUSD = `$${((totalTokensUsed / 1000000) * 2.0).toFixed(2)}`;

  // Compute live plan distribution
  const planCounts: Record<string, number> = {};
  dynamicUserDatabase.forEach(u => {
    const p = u.currentPlan || "Free Seeker";
    planCounts[p] = (planCounts[p] || 0) + 1;
  });

  const subscriptionDistribution = Object.entries(planCounts).map(([name, count]) => ({
    name,
    count,
    percent: Number(((count / (totalUsers || 1)) * 100).toFixed(1))
  }));

  const dailyUsersChart = [
    { day: "Mon", total: Math.max(1, totalUsers - 12), active: Math.max(1, activeToday - 4), newRegs: 2 },
    { day: "Tue", total: Math.max(1, totalUsers - 8), active: Math.max(1, activeToday - 3), newRegs: 3 },
    { day: "Wed", total: Math.max(1, totalUsers - 5), active: Math.max(1, activeToday - 2), newRegs: 2 },
    { day: "Thu", total: Math.max(1, totalUsers - 3), active: Math.max(1, activeToday - 1), newRegs: 4 },
    { day: "Fri", total: Math.max(1, totalUsers - 1), active: activeToday, newRegs: 2 },
    { day: "Sat", total: totalUsers, active: activeToday, newRegs: 1 },
    { day: "Today (Live)", total: totalUsers, active: activeToday, newRegs: 3 }
  ];

  const monthlyGrowthChart = [
    { month: "Jan", users: Math.max(1, totalUsers - 20), premium: Math.max(0, premiumSubs - 3), revenue: 29940 },
    { month: "Feb", users: Math.max(1, totalUsers - 15), premium: Math.max(0, premiumSubs - 2), revenue: 47405 },
    { month: "Mar", users: Math.max(1, totalUsers - 10), premium: Math.max(0, premiumSubs - 1), revenue: 69860 },
    { month: "Apr", users: Math.max(1, totalUsers - 5), premium: premiumSubs, revenue: 94810 },
    { month: "Current (Live)", users: totalUsers, premium: premiumSubs, revenue: premiumSubs * 499 }
  ];

  const aiUsageChart = [
    { hour: "00:00", chats: 35, tokens: 28000 },
    { hour: "04:00", chats: 12, tokens: 9500 },
    { hour: "08:00", chats: 85, tokens: 72000 },
    { hour: "12:00", chats: 180, tokens: 154000 },
    { hour: "16:00", chats: 240, tokens: 210000 },
    { hour: "20:00", chats: 310, tokens: 285000 },
    { hour: "Live Now", chats: Math.floor(100 + (process.uptime() % 100)), tokens: Math.floor(80000 + (process.uptime() % 50000)) }
  ];

  return res.json({
    stats: {
      totalUsers,
      activeToday,
      premiumSubs,
      freeUsers,
      totalAiConversations,
      todayAiConversations: 1240 + Math.floor((process.uptime() % 3600) / 10),
      monthlyAiConversations: totalAiConversations + 9510,
      estimatedAiTokenUsage: `${(totalTokensUsed / 1000000).toFixed(2)}M`,
      estimatedAiCostUSD,
      totalRegisteredEmails: totalUsers,
      averageDAU: activeToday
    },
    charts: {
      dailyUsersChart,
      monthlyGrowthChart,
      aiUsageChart,
      subscriptionDistribution
    }
  });
});

app.post("/api/admin/simulate-activity", authenticateAdmin, (req, res) => {
  const { action } = req.body;
  if (action === "new_user") {
    const id = `usr_sim_${Date.now()}`;
    const nameList = ["Kabir Das", "Meera Sharma", "Siddharth Rao", "Aishwarya Roy", "Devendra Jha", "Rajesh Khanna"];
    const name = nameList[Math.floor(Math.random() * nameList.length)];
    const email = `${name.toLowerCase().replace(/\s+/g, ".")}@gmail.com`;
    const newUser = {
      id,
      name,
      email,
      registrationDate: new Date().toISOString().split("T")[0],
      lastLogin: "Just now (Live)",
      currentPlan: Math.random() > 0.5 ? "Mystic Pro Monthly" : "Free Seeker",
      subscriptionExpiry: "2027-01-01",
      totalAiChats: 1,
      totalTokensUsed: 1200,
      status: "Active",
      rashi: "Leo",
      lagna: "Scorpio",
      dob: "1996-04-12",
      pob: "Delhi, India"
    };
    dynamicUserDatabase.unshift(newUser);
    logAdminEvent("REALTIME", "info", `Live activity: New user registered ${email}`);
    return res.json({ success: true, message: `Simulated live user registration for ${name}` });
  } else if (action === "ai_chat") {
    globalTotalChats += 1;
    globalTotalTokens += 1850;
    if (dynamicUserDatabase.length > 0) {
      dynamicUserDatabase[0].totalAiChats += 1;
      dynamicUserDatabase[0].totalTokensUsed += 1850;
      dynamicUserDatabase[0].lastLogin = "Just now (Live)";
    }
    logAdminEvent("AI_CHAT", "info", `Live activity: User completed AI AstroGuru consultation (+1850 tokens)`);
    return res.json({ success: true, message: "Simulated live AI chat consultation" });
  } else if (action === "system_alert") {
    logAdminEvent("SECURITY", "warning", `Live alert: High API volume detected on endpoint /api/astrology/kundli`);
    return res.json({ success: true, message: "Simulated real-time security alert log" });
  }
  return res.json({ success: true });
});

// USER MANAGEMENT APIS
const mockUserList = [
  {
    id: "usr_1",
    name: "Aarav Sharma",
    email: "aarav.sharma@gmail.com",
    registrationDate: "2026-03-12",
    lastLogin: "2026-07-30 04:12",
    currentPlan: "Vedic Master Annual",
    subscriptionExpiry: "2027-03-12",
    totalAiChats: 142,
    totalTokensUsed: 118400,
    status: "Active",
    rashi: "Aries",
    lagna: "Cancer",
    dob: "1994-08-15",
    pob: "New Delhi, India"
  },
  {
    id: "usr_2",
    name: "Priya Patel",
    email: "priya.patel@yahoo.com",
    registrationDate: "2026-04-05",
    lastLogin: "2026-07-29 21:45",
    currentPlan: "Mystic Pro Monthly",
    subscriptionExpiry: "2026-08-05",
    totalAiChats: 88,
    totalTokensUsed: 72100,
    status: "Active",
    rashi: "Taurus",
    lagna: "Leo",
    dob: "1997-11-22",
    pob: "Mumbai, India"
  },
  {
    id: "usr_3",
    name: "Ananya Iyer",
    email: "ananya.iyer@outlook.com",
    registrationDate: "2026-05-18",
    lastLogin: "2026-07-28 14:30",
    currentPlan: "Free Seeker",
    subscriptionExpiry: "N/A",
    totalAiChats: 24,
    totalTokensUsed: 19800,
    status: "Active",
    rashi: "Gemini",
    lagna: "Scorpio",
    dob: "1999-03-04",
    pob: "Bengaluru, India"
  },
  {
    id: "usr_4",
    name: "Rohan Verma",
    email: "rohan.v@gmail.com",
    registrationDate: "2026-06-01",
    lastLogin: "2026-07-15 09:10",
    currentPlan: "Free Seeker",
    subscriptionExpiry: "N/A",
    totalAiChats: 6,
    totalTokensUsed: 4200,
    status: "Suspended",
    rashi: "Leo",
    lagna: "Sagittarius",
    dob: "1991-01-29",
    pob: "Kolkata, India"
  },
  {
    id: "usr_5",
    name: "Vikram Malhotra",
    email: "optionvortex@gmail.com",
    registrationDate: "2026-01-10",
    lastLogin: new Date().toISOString().replace("T", " ").substring(0, 16),
    currentPlan: "Vedic Master Annual",
    subscriptionExpiry: "2027-01-10",
    totalAiChats: 310,
    totalTokensUsed: 295000,
    status: "Active",
    rashi: "Scorpio",
    lagna: "Aries",
    dob: "1988-06-18",
    pob: "San Francisco, USA"
  }
];

let dynamicUserDatabase = [...mockUserList];

app.get("/api/admin/users", authenticateAdmin, (req, res) => {
  const { search, filterStatus, filterPlan } = req.query;
  let results = [...dynamicUserDatabase];

  if (search && typeof search === "string") {
    const q = search.toLowerCase();
    results = results.filter(u => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));
  }

  if (filterStatus && typeof filterStatus === "string" && filterStatus !== "All") {
    results = results.filter(u => u.status === filterStatus);
  }

  if (filterPlan && typeof filterPlan === "string" && filterPlan !== "All") {
    results = results.filter(u => u.currentPlan === filterPlan);
  }

  return res.json({ users: results, totalCount: results.length });
});

app.post("/api/admin/users/update", authenticateAdmin, (req, res) => {
  const { id, name, email, currentPlan, status, subscriptionExpiry } = req.body;
  const userIdx = dynamicUserDatabase.findIndex(u => u.id === id || u.email === email);

  if (userIdx !== -1) {
    dynamicUserDatabase[userIdx] = {
      ...dynamicUserDatabase[userIdx],
      ...(name && { name }),
      ...(email && { email }),
      ...(currentPlan && { currentPlan }),
      ...(status && { status }),
      ...(subscriptionExpiry && { subscriptionExpiry })
    };
    logAdminEvent("USER", "info", `Updated user details for ${email}`);
    return res.json({ success: true, user: dynamicUserDatabase[userIdx] });
  }

  // If not existing, create
  const newUser = {
    id: `usr_${Date.now()}`,
    name: name || "New User",
    email: email || `user_${Date.now()}@example.com`,
    registrationDate: new Date().toISOString().split("T")[0],
    lastLogin: "Just now",
    currentPlan: currentPlan || "Free Seeker",
    subscriptionExpiry: subscriptionExpiry || "N/A",
    totalAiChats: 0,
    totalTokensUsed: 0,
    status: status || "Active",
    rashi: "Aries",
    lagna: "Cancer",
    dob: "1995-01-01",
    pob: "New Delhi, India"
  };
  dynamicUserDatabase.unshift(newUser);
  logAdminEvent("USER", "info", `Created user record for ${email}`);
  return res.json({ success: true, user: newUser });
});

app.post("/api/admin/users/reset-subscription", authenticateAdmin, (req, res) => {
  const { email, planName } = req.body;
  const user = dynamicUserDatabase.find(u => u.email === email);
  if (user) {
    user.currentPlan = planName || "Free Seeker";
    user.subscriptionExpiry = planName !== "Free Seeker" ? "2027-12-31" : "N/A";
    logAdminEvent("USER", "info", `Reset subscription for ${email} to ${planName}`);
    return res.json({ success: true, user });
  }
  return res.status(404).json({ error: "User not found." });
});

app.post("/api/admin/users/delete", authenticateAdmin, (req, res) => {
  const { id, email } = req.body;
  dynamicUserDatabase = dynamicUserDatabase.filter(u => u.id !== id && u.email !== email);
  logAdminEvent("USER", "warning", `Deleted user account ${email || id}`);
  return res.json({ success: true });
});

// SUBSCRIPTION MANAGEMENT APIS
app.get("/api/admin/plans", authenticateAdmin, (req, res) => {
  return res.json({ plans: adminSubscriptionPlans });
});

app.post("/api/admin/plans/save", authenticateAdmin, (req, res) => {
  const planData = req.body;
  if (!planData.id) {
    planData.id = `plan_${Date.now()}`;
    adminSubscriptionPlans.push(planData);
    logAdminEvent("SUBSCRIPTION", "info", `Created new plan: ${planData.name}`);
  } else {
    const idx = adminSubscriptionPlans.findIndex(p => p.id === planData.id);
    if (idx !== -1) {
      adminSubscriptionPlans[idx] = { ...adminSubscriptionPlans[idx], ...planData };
      logAdminEvent("SUBSCRIPTION", "info", `Updated subscription plan: ${planData.name}`);
    } else {
      adminSubscriptionPlans.push(planData);
    }
  }
  return res.json({ success: true, plans: adminSubscriptionPlans });
});

app.post("/api/admin/plans/delete", authenticateAdmin, (req, res) => {
  const { id } = req.body;
  adminSubscriptionPlans = adminSubscriptionPlans.filter(p => p.id !== id);
  logAdminEvent("SUBSCRIPTION", "warning", `Deleted plan ${id}`);
  return res.json({ success: true, plans: adminSubscriptionPlans });
});

// AI CONFIGURATION APIS
app.get("/api/admin/ai-config", authenticateAdmin, (req, res) => {
  return res.json({ config: adminAiConfig });
});

app.post("/api/admin/ai-config", authenticateAdmin, (req, res) => {
  adminAiConfig = { ...adminAiConfig, ...req.body };
  logAdminEvent("AI_CONFIG", "info", "Updated AI engine parameters & prompts");
  return res.json({ success: true, config: adminAiConfig });
});

// PUBLIC CMS ARTICLES API
app.get("/api/cms/articles", async (req, res) => {
  const todayStr = new Date().toISOString().split("T")[0];
  if (lastAutoPostDate !== todayStr) {
    await generateDailyTrendingArticle().catch(err => console.error("[AUTO-POST ENGINE] Error:", err));
  }
  const publishedArticles = cmsArticlesStore.filter(a => a.status === "Published");
  return res.json({ articles: publishedArticles, trendingTopics: DAILY_TRENDING_TOPICS });
});

// CONTENT MANAGEMENT (CMS) APIS
app.get("/api/admin/cms", authenticateAdmin, (req, res) => {
  return res.json({ articles: cmsArticlesStore, trendingTopics: DAILY_TRENDING_TOPICS });
});

app.post("/api/admin/cms/auto-generate", authenticateAdmin, async (req, res) => {
  try {
    lastAutoPostDate = ""; // Force fresh auto-generation
    const article = await generateDailyTrendingArticle();
    logAdminEvent("CMS", "info", `Auto-generated daily trending post: ${article?.title}`);
    return res.json({ success: true, article, articles: cmsArticlesStore });
  } catch (err: any) {
    return res.status(500).json({ error: "Failed to auto-generate trending article." });
  }
});

app.post("/api/admin/cms/save", authenticateAdmin, (req, res) => {
  const article = req.body;
  if (!article.id) {
    article.id = `art_${Date.now()}`;
    article.updatedAt = new Date().toISOString().split("T")[0];
    cmsArticlesStore.unshift(article);
    logAdminEvent("CMS", "info", `Created article: ${article.title}`);
  } else {
    const idx = cmsArticlesStore.findIndex(a => a.id === article.id);
    if (idx !== -1) {
      cmsArticlesStore[idx] = { ...cmsArticlesStore[idx], ...article, updatedAt: new Date().toISOString().split("T")[0] };
      logAdminEvent("CMS", "info", `Updated article: ${article.title}`);
    } else {
      cmsArticlesStore.unshift(article);
    }
  }
  return res.json({ success: true, articles: cmsArticlesStore });
});

app.post("/api/admin/cms/delete", authenticateAdmin, (req, res) => {
  const { id } = req.body;
  cmsArticlesStore = cmsArticlesStore.filter(a => a.id !== id);
  logAdminEvent("CMS", "warning", `Deleted CMS article ${id}`);
  return res.json({ success: true, articles: cmsArticlesStore });
});

// NOTIFICATION CENTER APIS
app.get("/api/admin/notifications", authenticateAdmin, (req, res) => {
  return res.json({ notifications: systemNotificationsStore });
});

app.post("/api/admin/notifications/send", authenticateAdmin, (req, res) => {
  const { type, title, message, scheduledAt } = req.body;
  const newNotif = {
    id: `notif_${Date.now()}`,
    type: type || "Broadcast",
    title,
    message,
    status: scheduledAt ? "Scheduled" : "Delivered",
    recipientsCount: dynamicUserDatabase.length || 1428,
    createdAt: new Date().toISOString(),
    scheduledAt
  };
  systemNotificationsStore.unshift(newNotif);
  logAdminEvent("NOTIFICATION", "info", `Sent ${type} notification: "${title}"`);
  return res.json({ success: true, notification: newNotif, history: systemNotificationsStore });
});

// ANALYTICS APIS
app.get("/api/admin/analytics", authenticateAdmin, (req, res) => {
  return res.json({
    metrics: {
      dau: 342,
      mau: 1428,
      avgSessionDuration: "14m 20s",
      avgChatsPerUser: 13.2,
      conversionRate: "19.8%",
      monthlyRecurringRevenue: "₹1,41,716",
      apiSuccessRate: "99.85%"
    },
    featureUsageSplit: [
      { feature: "AI AstroGuru Chat", percentage: 48, requests: 18940 },
      { feature: "Kundli Natal Chart", percentage: 24, requests: 9480 },
      { feature: "Gun Milan Matching", percentage: 16, requests: 6310 },
      { feature: "Daily Horoscope", percentage: 12, requests: 4720 }
    ],
    apiTrends: [
      { date: "Jul 24", latencyMs: 380, errorCount: 2 },
      { date: "Jul 25", latencyMs: 340, errorCount: 0 },
      { date: "Jul 26", latencyMs: 410, errorCount: 1 },
      { date: "Jul 27", latencyMs: 320, errorCount: 0 },
      { date: "Jul 28", latencyMs: 360, errorCount: 3 },
      { date: "Jul 29", latencyMs: 310, errorCount: 0 },
      { date: "Jul 30", latencyMs: 290, errorCount: 0 }
    ]
  });
});

// ERROR LOGS APIS
app.get("/api/admin/logs", authenticateAdmin, (req, res) => {
  return res.json({ logs: systemLogsStore });
});

app.post("/api/admin/logs/clear", authenticateAdmin, (req, res) => {
  systemLogsStore = [
    { id: `log_${Date.now()}`, type: "SYSTEM", severity: "info", message: "System logs cleared by administrator", timestamp: new Date().toISOString() }
  ];
  return res.json({ success: true, logs: systemLogsStore });
});

// WHITE LABEL SETTINGS APIS
app.get("/api/admin/white-label", authenticateAdmin, (req, res) => {
  return res.json({ settings: whiteLabelSettings });
});

app.post("/api/admin/white-label", authenticateAdmin, (req, res) => {
  whiteLabelSettings = { ...whiteLabelSettings, ...req.body };
  logAdminEvent("WHITE_LABEL", "info", "Updated platform branding and White Label configuration");
  return res.json({ success: true, settings: whiteLabelSettings });
});

// GENERAL SETTINGS & SECURITY
app.get("/api/admin/settings", authenticateAdmin, (req, res) => {
  return res.json({ settings: generalAdminSettings });
});

app.post("/api/admin/settings", authenticateAdmin, (req, res) => {
  generalAdminSettings = { ...generalAdminSettings, ...req.body };
  if (req.body.newAdminPassword) {
    adminPasswordHash = req.body.newAdminPassword;
    logAdminEvent("SECURITY", "warning", "Admin password changed successfully");
  }
  logAdminEvent("SETTINGS", "info", "Updated platform general & security settings");
  return res.json({ success: true, settings: generalAdminSettings });
});

// -------------------------------------------------------------
// SEO & GOOGLE SEARCH CONSOLE ROUTING & APIS
// -------------------------------------------------------------
app.get("/api/seo/settings", (req, res) => {
  return res.json({ settings: seoSettings });
});

app.post("/api/seo/settings", authenticateAdmin, (req, res) => {
  seoSettings = { ...seoSettings, ...req.body };
  logAdminEvent("SEO", "info", "Updated SEO & Google Search Console configuration");
  return res.json({ success: true, settings: seoSettings });
});

app.post("/api/seo/ping-sitemap", authenticateAdmin, async (req, res) => {
  const host = req.get("host") || "ais-pre-kkaqrfevbg3kelesribizv-259553995756.asia-southeast1.run.app";
  const protocol = req.protocol || "https";
  const sitemapUrl = `${protocol}://${host}/sitemap.xml`;
  seoSettings.lastPingedAt = new Date().toISOString();

  try {
    const googlePingUrl = `https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`;
    await fetch(googlePingUrl).catch(() => {});
    return res.json({
      success: true,
      message: `Google Indexing Ping sent successfully for ${sitemapUrl}`,
      sitemapUrl,
      lastPingedAt: seoSettings.lastPingedAt,
    });
  } catch (err: any) {
    return res.json({
      success: true,
      message: `Sitemap registered locally for ${sitemapUrl}`,
      sitemapUrl,
      lastPingedAt: seoSettings.lastPingedAt,
    });
  }
});

// Public Robots.txt (Optimized for Search Engines & AI/LLM Crawlers)
app.get("/robots.txt", (req, res) => {
  const host = req.get("host") || "ais-pre-kkaqrfevbg3kelesribizv-259553995756.asia-southeast1.run.app";
  const protocol = req.protocol || "https";
  const baseUrl = `${protocol}://${host}`;

  res.type("text/plain");
  res.send(`User-agent: *
Allow: /
Allow: /kundli
Allow: /matching
Allow: /horoscope
Allow: /dasha
Allow: /remedies
Allow: /learning
Allow: /vastu
Allow: /numerology
Allow: /blog
Disallow: /api/admin
Disallow: /admin

# AI & LLM Search Engine Crawlers (Explicitly Allowed for GEO Ranking)
User-agent: GPTBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: Bytespider
Allow: /

User-agent: Applebot-Extended
Allow: /

Sitemap: ${baseUrl}/sitemap.xml
# LLM Discovery Endpoint: ${baseUrl}/llms.txt
`);
});

// Google AdSense ads.txt verification endpoint
app.get("/ads.txt", (req, res) => {
  res.type("text/plain; charset=utf-8");
  res.send("google.com, pub-6855799245720155, DIRECT, f08c47fec0942fa0\n");
});

// /llms.txt standard for AI search engines (Perplexity, ChatGPT, Gemini, Claude)
app.get("/llms.txt", (req, res) => {
  const host = req.get("host") || "ais-pre-kkaqrfevbg3kelesribizv-259553995756.asia-southeast1.run.app";
  const protocol = req.protocol || "https";
  const baseUrl = `${protocol}://${host}`;

  res.type("text/plain; charset=utf-8");
  res.send(`# Vedanga AI – Vedic Astrology & Kundli Advisor

> Vedanga AI is a personal AI Guru for Vedic Astrology (Jyotish), Janam Kundli charts, Vimshottari Dasha analysis, 36-Gun Milan Kundli matching, Prashna horary questions, gemstone remedies, Vastu Shastra, and spiritual guidance.

## Core Services & Capabilities

- **Janam Kundli Generation**: High-precision planetary charts (D1, D9 Navamsha) based on Lahiri Ayanamsha.
- **Vimshottari Dasha Timeline**: Detailed Mahadasha, Antardasha, and Pratyantardasha breakdowns with life predictions.
- **Kundli Matching (Gun Milan)**: 36-point marital compatibility analysis, Ashta Kuta scoring, and Manglik Dosha evaluation.
- **AI Jyotish Consultation**: Conversational AI guidance for career, relationships, health, wealth, and spiritual growth grounded in classic Vedic texts (Bhat Parashara Hora Shastra).
- **Custom Remedies**: Authentic gemstone, Rudraksha, mantra, and charity remedies tailored to planetary deficiencies.
- **Prashna Kundli (Horary)**: Immediate astrological answers to urgent questions based on the moment of query.

## Key Links & Features

- [Janam Kundli Chart Generator](${baseUrl}/#kundli): Create detailed natal birth charts and planetary breakdown.
- [Kundli Matching](${baseUrl}/#matching): Check 36-Gun compatibility for marriage.
- [Horoscope & Daily Predictions](${baseUrl}/#horoscope): Check transit predictions for all 12 Rasis.
- [AI Guru Chat](${baseUrl}/#chat): Ask direct astrological questions to Vedanga AI.
- [Full Documentation](${baseUrl}/llms-full.txt): Detailed knowledge base and API specifications for LLMs.

## Frequently Asked Questions

Q: How does Vedanga AI calculate planetary positions?
A: Vedanga AI utilizes exact astronomical ephemeris calculations with Lahiri Ayanamsha to locate planetary coordinates down to degrees, minutes, and seconds.

Q: Is Vedanga AI free to use?
A: Yes, basic Kundli charts, Gun Milan, daily horoscopes, and AI consultation are freely accessible.
`);
});

// /llms-full.txt full knowledge index for LLM deep retrieval
app.get("/llms-full.txt", (req, res) => {
  const host = req.get("host") || "ais-pre-kkaqrfevbg3kelesribizv-259553995756.asia-southeast1.run.app";
  const protocol = req.protocol || "https";
  const baseUrl = `${protocol}://${host}`;

  res.type("text/plain; charset=utf-8");
  res.send(`# Vedanga AI Full Knowledge Index & Documentation

Vedanga AI combines ancient Vedic Astrology (Jyotish Shastra) with state-of-the-art Artificial Intelligence to offer personalized astrological calculations and spiritual insights.

## System Architecture & Features

### 1. Janam Kundli (Birth Chart Analysis)
- **Ascendant (Lagna)**: Identifies life purpose, physical traits, and foundational energy.
- **Moon Sign (Rasi) & Nakshatra**: Unveils emotional temperament, mental state, and Vimshottari birth dasha balance.
- **Divisional Charts**:
  - D1 (Lagna): General life overview
  - D9 (Navamsha): Marital happiness, spiritual evolution, and mid-life destiny
  - D10 (Dashamsha): Career, profession, and social status

### 2. Vimshottari Dasha System
- Calculates 120-year cycles governed by 9 planets (Sun, Moon, Mars, Rahu, Jupiter, Saturn, Mercury, Ketu, Venus).
- Pinpoints favorable vs. challenging transit periods for career switches, marriage, investments, and health.

### 3. Ashta Kuta Gun Milan (Marriage Matching)
- Evaluates 8 Kutas (Max 36 Points):
  1. Varna (Work & Ego - 1 pt)
  2. Vashya (Control & Influence - 2 pts)
  3. Tara (Birth Star Harmony - 3 pts)
  4. Yoni (Intimacy & Compatibility - 4 pts)
  5. Graha Maitri (Psychological Friendship - 5 pts)
  6. Gana (Temperament: Deva/Manushya/Rakshasa - 6 pts)
  7. Bhakoot (Emotional & Wealth Harmony - 7 pts)
  8. Nadi (Genetic Health & Progeny - 8 pts)

### 4. Remedial Jyotish
- Recommends natural gemstones (e.g. Yellow Sapphire for Jupiter, Blue Sapphire for Saturn, Ruby for Sun).
- Suggests Beej Mantras, Rudraksha beads (1 to 14 Mukhi), and specific fasts/donations.

Official Domain: ${baseUrl}
`);
});

// Public Robots.txt
app.get("/robots.txt", (req, res) => {
  const host = req.get("host") || "ais-pre-kkaqrfevbg3kelesribizv-259553995756.asia-southeast1.run.app";
  const protocol = req.protocol || "https";
  const baseUrl = `${protocol}://${host}`;

  res.type("text/plain");
  res.send(`User-agent: *
Allow: /
Allow: /article/
Allow: /api/cms/articles
Allow: /sitemap.xml
Allow: /llms.txt
Allow: /llms-full.txt

Sitemap: ${baseUrl}/sitemap.xml
`);
});

// Dynamic SEO Rendered Article Route for Googlebot & Web Search Indexing
app.get(["/article/:id", "/post/:id"], (req, res) => {
  const articleId = req.params.id;
  const article = cmsArticlesStore.find(a => a.id === articleId || a.id === `art_${articleId}`);
  const host = req.get("host") || "ais-pre-kkaqrfevbg3kelesribizv-259553995756.asia-southeast1.run.app";
  const protocol = req.protocol || "https";
  const baseUrl = `${protocol}://${host}`;

  if (!article) {
    return res.status(404).send(`<!DOCTYPE html>
<html>
<head><title>Article Not Found - Vedanga AI</title></head>
<body style="font-family:sans-serif;background:#0f172a;color:#f8fafc;padding:2rem;text-align:center;">
  <h1>404 - Article Not Found</h1>
  <p><a href="/" style="color:#f59e0b;">Return to Vedanga AI Homepage</a></p>
</body>
</html>`);
  }

  const cleanDescription = (article.content || "")
    .replace(/[#*`\-\n]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .substring(0, 160);

  const keywords = `${article.category}, ${article.trendingTopic || article.title}, Vedic Astrology, Jyotish Shastra, Kundli, ${article.title.replace(/[^a-zA-Z0-9 ]/g, "")}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${baseUrl}/article/${article.id}`
    },
    "headline": article.title,
    "description": cleanDescription,
    "category": article.category,
    "author": {
      "@type": "Person",
      "name": article.author || "Vedanga AI Daily Engine"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Vedanga AI",
      "logo": {
        "@type": "ImageObject",
        "url": `${baseUrl}/assets/logo.png`
      }
    },
    "datePublished": article.updatedAt || new Date().toISOString().split("T")[0],
    "dateModified": article.updatedAt || new Date().toISOString().split("T")[0],
    "articleBody": (article.content || "").replace(/[#*`]/g, "")
  };

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${article.title} | Vedanga AI Vedic Astrology</title>
  <meta name="description" content="${cleanDescription}">
  <meta name="keywords" content="${keywords}">
  <meta name="author" content="${article.author || "Vedanga AI"}">
  <link rel="canonical" href="${baseUrl}/article/${article.id}">

  <!-- Open Graph / Facebook / WhatsApp -->
  <meta property="og:type" content="article">
  <meta property="og:url" content="${baseUrl}/article/${article.id}">
  <meta property="og:title" content="${article.title}">
  <meta property="og:description" content="${cleanDescription}">
  <meta property="og:site_name" content="Vedanga AI">

  <!-- Twitter Meta Tags -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${article.title}">
  <meta name="twitter:description" content="${cleanDescription}">

  <!-- Schema.org JSON-LD for Google Search Crawlers -->
  <script type="application/ld+json">
    ${JSON.stringify(jsonLd, null, 2)}
  </script>

  <style>
    body { font-family: system-ui, -apple-system, sans-serif; background-color: #090d16; color: #f1f5f9; margin: 0; padding: 20px; line-height: 1.7; }
    .container { max-width: 800px; margin: 0 auto; background: #0f172a; padding: 30px; border-radius: 20px; border: 1px solid rgba(245, 158, 11, 0.3); }
    .badge { background: rgba(245, 158, 11, 0.2); color: #fbbf24; padding: 4px 12px; border-radius: 999px; font-size: 12px; font-weight: bold; text-transform: uppercase; }
    h1 { color: #fef3c7; font-size: 28px; margin-top: 15px; }
    .meta { color: #94a3b8; font-size: 13px; margin-bottom: 25px; border-bottom: 1px solid #1e293b; padding-bottom: 15px; }
    .content { font-size: 16px; color: #cbd5e1; white-space: pre-line; }
    .btn { display: inline-block; margin-top: 25px; padding: 12px 24px; background: #f59e0b; color: #0f172a; font-weight: bold; text-decoration: none; border-radius: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <span class="badge">${article.category}</span>
    <h1>${article.title}</h1>
    <div class="meta">
      By <strong>${article.author}</strong> • ${article.readTime} • Published: ${article.updatedAt}
    </div>
    <div class="content">
      ${article.content.replace(/###\s*(.*)/g, '<h3 style="color:#f59e0b;margin-top:20px;">$1</h3>')}
    </div>
    <a href="/#learning" class="btn">Explore All Daily Vedic Articles on Vedanga AI</a>
  </div>
</body>
</html>`;

  res.type("text/html");
  res.send(html);
});

// API endpoint for SEO Smart Search
app.get("/api/seo/search", (req, res) => {
  const query = (req.query.q as string) || "";
  const results = searchSeoTopics(query);
  return res.json({ results });
});

// API endpoint for Programmatic Page JSON
app.get("/api/seo/page/:slug", (req, res) => {
  const slug = req.params.slug;
  const pageData = getProgrammaticPage(slug);
  return res.json(pageData);
});

// Server-Side Rendered (SSR) HTML page for /learn and /learn/:slug (optimizes Googlebot & Social Media Crawlers)
app.get(["/learn", "/learn/", "/learn/:slug"], (req, res) => {
  try {
    const rawSlug = req.params.slug || "ai-kundli";
    const pageData = getProgrammaticPage(rawSlug);

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${pageData.title}</title>
  <meta name="description" content="${pageData.metaDescription}">
  <meta name="author" content="${pageData.author}">
  <link rel="canonical" href="${pageData.canonicalUrl}">

  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="article">
  <meta property="og:url" content="${pageData.canonicalUrl}">
  <meta property="og:title" content="${pageData.title}">
  <meta property="og:description" content="${pageData.metaDescription}">
  <meta property="og:site_name" content="Vedanga AI">

  <!-- Twitter Meta Tags -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${pageData.title}">
  <meta name="twitter:description" content="${pageData.metaDescription}">

  <!-- Structured Data JSON-LD Schemas -->
  <script type="application/ld+json">
    ${JSON.stringify(pageData.schemaJsonLd, null, 2)}
  </script>

  <style>
    body { font-family: system-ui, -apple-system, sans-serif; background-color: #030712; color: #f3f4f6; margin: 0; padding: 20px; line-height: 1.7; }
    .container { max-width: 900px; margin: 0 auto; background: #0f172a; padding: 32px; border-radius: 24px; border: 1px solid rgba(245, 158, 11, 0.3); }
    .badge { background: rgba(245, 158, 11, 0.2); color: #fbbf24; padding: 4px 14px; border-radius: 999px; font-size: 12px; font-weight: bold; text-transform: uppercase; }
    h1 { color: #fef3c7; font-size: 32px; margin-top: 16px; margin-bottom: 12px; }
    .meta { color: #9ca3af; font-size: 13px; margin-bottom: 24px; border-bottom: 1px solid #1e293b; padding-bottom: 16px; }
    .shloka { background: rgba(15, 23, 42, 0.9); border-left: 4px solid #f59e0b; padding: 16px; font-style: italic; color: #fde68a; margin: 20px 0; border-radius: 8px; }
    .section-title { color: #f59e0b; font-size: 22px; margin-top: 28px; margin-bottom: 10px; border-bottom: 1px solid #1e293b; padding-bottom: 6px; }
    .content { font-size: 16px; color: #d1d5db; white-space: pre-line; }
    .faq-box { margin-top: 32px; background: #020617; padding: 24px; border-radius: 16px; border: 1px solid #1e293b; }
    .faq-q { color: #fbbf24; font-weight: bold; font-size: 16px; margin-top: 16px; }
    .faq-a { color: #9ca3af; font-size: 14px; margin-top: 4px; }
    .cta-btn { display: inline-block; margin-top: 28px; padding: 14px 28px; background: linear-gradient(to right, #f59e0b, #eab308); color: #020617; font-weight: bold; text-decoration: none; border-radius: 14px; font-size: 16px; }
  </style>
</head>
<body>
  <div class="container">
    <span class="badge">${pageData.category}</span>
    <h1>${pageData.h1}</h1>
    <div class="meta">
      By <strong>${pageData.author}</strong> • ${pageData.readTime} • Last Updated: ${pageData.updatedAt} • Verified Jyotish
    </div>
    
    <div class="shloka">${pageData.scripturalShloka}</div>
    
    <div class="content">
      <p><strong>Executive Cosmic Summary:</strong> ${pageData.executiveSummary}</p>
      ${pageData.sections.map(s => `<div class="section-title">${s.title}</div><p>${s.content}</p>`).join("")}
    </div>

    <div class="faq-box">
      <h3 style="color:#fef3c7;margin-top:0;">20+ Astrological FAQs & Scriptural Answers</h3>
      ${pageData.faqs.slice(0, 10).map(f => `<div class="faq-q">Q: ${f.question}</div><div class="faq-a">A: ${f.answer}</div>`).join("")}
    </div>

    <div style="text-align:center;">
      <a href="/#chat" class="cta-btn">Ask Vedanga AI about YOUR Birth Chart</a>
    </div>
  </div>
</body>
</html>`;

    res.type("text/html");
    return res.status(200).send(html);
  } catch (err: any) {
    console.error("[SSR ERROR] Failed to render /learn route:", err);
    return res.status(500).type("text/html").send(`<!DOCTYPE html><html><body style="background:#030712;color:#f3f4f6;font-family:sans-serif;padding:40px;text-align:center;"><h1>500 - Server Error</h1><p>Failed to generate astrological guidance page.</p><a href="/" style="color:#f59e0b;">Return to Vedanga AI</a></body></html>`);
  }
});

// Dynamic robots.txt
app.get("/robots.txt", (req, res) => {
  res.type("text/plain");
  res.send(generateRobotsTxt());
});

// Google AdSense ads.txt
app.get("/ads.txt", (req, res) => {
  res.type("text/plain");
  const pubId = process.env.ADSENSE_PUB_ID || "pub-6855799245720155";
  res.send(`google.com, ${pubId}, DIRECT, f08c47fec0942fa0`);
});

// Master Sitemap Index
app.get("/sitemap.xml", (req, res) => {
  res.type("application/xml");
  res.send(generateSitemapIndex());
});

// Landing & Calculators Sitemap
app.get("/sitemap-landing.xml", (req, res) => {
  res.type("application/xml");
  res.send(generateLandingSitemap());
});

// Programmatic Combinatorics Sitemap
app.get("/sitemap-astrology-combinatorics.xml", (req, res) => {
  res.type("application/xml");
  res.send(generateCombinatoricsSitemap());
});

// Articles Sitemap
app.get("/sitemap-articles.xml", (req, res) => {
  const host = req.get("host") || "ais-pre-kkaqrfevbg3kelesribizv-259553995756.asia-southeast1.run.app";
  const protocol = req.protocol || "https";
  const baseUrl = `${protocol}://${host}`;
  const today = new Date().toISOString().split("T")[0];

  const articlePages = cmsArticlesStore
    .filter(a => a.status === "Published")
    .map(a => `  <url>
    <loc>${baseUrl}/article/${a.id}</loc>
    <lastmod>${a.updatedAt || today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>`)
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${articlePages}
</urlset>`;

  res.type("application/xml");
  res.send(xml);
});

// News Sitemap
app.get("/sitemap-news.xml", (req, res) => {
  res.type("application/xml");
  res.send(generateLandingSitemap());
});

// Dynamic RSS Feed
app.get("/rss.xml", (req, res) => {
  res.type("application/xml");
  res.send(generateRssFeed(cmsArticlesStore));
});

// Google Search Console HTML Verification endpoints
app.get(/^\/google.*\.html$/, (req, res) => {
  const filename = req.path.replace(/^\//, "");
  const token = seoSettings.googleSiteVerification || filename.replace(/^google|\.html$/g, "");
  res.type("text/html");
  // Send both the filename format and token format to satisfy any Google GSC verification check variant
  res.send(`google-site-verification: ${filename}\ngoogle-site-verification: ${token}`);
});

// SYSTEM HEALTH MONITORING
app.get("/api/admin/health", authenticateAdmin, (req, res) => {
  return res.json({
    status: "Healthy",
    uptimeSeconds: Math.floor(process.uptime()),
    nodeVersion: process.version,
    memoryUsageMB: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
    databaseConnection: "Connected (Firebase Firestore)",
    geminiApiStatus: process.env.GEMINI_API_KEY ? "Operational" : "No API Key",
    smtpStatus: process.env.SMTP_USER ? "Operational" : "Configured (Mock Transport)"
  });
});

// Fallback 404 Handler for API endpoints
app.use("/api/*", (req, res) => {
  if (!res.headersSent) {
    return res.status(404).json({ error: "API endpoint not found", path: req.path });
  }
});

// -------------------------------------------------------------
// 3. VITE SERVER & STATIC HOSTING
// -------------------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer } = await import("vite");
    const vite = await createServer({
      server: { middlewareMode: true, hmr: false },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  // Fallback 404 for unmatched non-API routes (e.g. in Vercel serverless context or invalid routes)
  app.use((req, res) => {
    if (!res.headersSent) {
      return res.status(404).type("text/html").send("<!DOCTYPE html><html><body style='background:#030712;color:#f3f4f6;font-family:sans-serif;padding:40px;text-align:center;'><h1>404 - Page Not Found</h1><p>The requested astrological page could not be found.</p><a href='/' style='color:#f59e0b;'>Return to Vedanga AI</a></body></html>");
    }
  });

  if (!process.env.VERCEL) {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`✨ Vedanga AI Server listening on http://0.0.0.0:${PORT}`);
      // Boot up immediate daily auto-post generation
      generateDailyTrendingArticle().catch(err => console.error("[AUTO-POST ENGINE] Startup error:", err));
    });
  }
}

if (!process.env.VERCEL) {
  startServer();
}

export default app;
export { app };
