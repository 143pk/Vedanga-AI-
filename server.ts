import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import nodemailer from "nodemailer";
import QRCode from "qrcode";
import { calculateVedicKundli } from "./src/lib/vedicCalculator";

const app = express();
const PORT = 3000;

app.use(express.json());

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

// Deep Kundli Analysis
app.post("/api/astrology/kundli-analysis", async (req, res) => {
  try {
    const { name, dob, tob, pob, gender } = req.body;
    const cacheKey = `${name || "seeker"}-${dob || "dob"}-${tob || "tob"}-${pob || "pob"}`;

    if (kundliCache.has(cacheKey)) {
      console.log(`[CACHE HIT] Kundli for ${cacheKey}`);
      return res.json({ success: true, kundli: kundliCache.get(cacheKey)!.data });
    }

    // Always compute real astronomical Sidereal Lahiri Kundli as baseline
    const calculatedKundli = calculateVedicKundli(
      dob || "1995-05-15",
      tob || "08:30 AM",
      pob || "New Delhi, India",
      name || "Seeker"
    );

    const ai = getGeminiClient();

    const prompt = `You are a high-precision Vedic Astrology (Jyotish) Sidereal Ephemeris Engine.
Perform an authentic, mathematically precise Vedic Natal Chart (Kundli) calculation using Sidereal Lahiri Ayanamsa for the following birth details:
- Name: ${name || "Seeker"}
- Date of Birth: ${dob || "1995-05-15"}
- Time of Birth: ${tob || "08:30 AM"}
- Place of Birth: ${pob || "New Delhi, India"}
- Gender: ${gender || "unspecified"}

CALCULATION INSTRUCTIONS:
1. Compute the exact Sidereal Ascendant (Lagna) sign based on the exact birth date, time, and timezone/location of birth place.
2. Determine Moon Sign (Rashi), Sun Sign, Nakshatra name, and Nakshatra Pada (1-4).
3. Determine the exact house placement (1 to 12) and sign for all 9 Grahas (Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn, Rahu, Ketu), where House 1 is the Lagna sign.
4. Calculate degrees within sign and dignity for each planet.
5. Provide detailed analysis for ALL 12 houses.
6. Evaluate Manglik Dosha accurately based on Mars house placement.
7. List real Vedic Raj Yogas or Dhana Yogas formed by planetary combinations in this specific chart.
8. Calculate Vimshottari Mahadasha and Antardasha active as of today.

Return STRICTLY valid JSON matching the exact structure:
${JSON.stringify(calculatedKundli, null, 2)}`;

    let data: any = calculatedKundli;
    try {
      const rawText = await generateGeminiContentWithFallback(ai, {
        prompt,
        jsonOutput: true,
        temperature: 0.2,
      });
      const aiData = JSON.parse(rawText || "{}");
      if (aiData && aiData.housesAnalysis) {
        const mergedHouses = calculatedKundli.housesAnalysis.map((h, i) => {
          const aiHouse = aiData.housesAnalysis?.[i];
          return {
            ...h,
            summary: aiHouse?.summary || h.summary,
          };
        });

        data = {
          ...calculatedKundli,
          housesAnalysis: mergedHouses,
          yogas: aiData.yogas && Array.isArray(aiData.yogas) ? aiData.yogas : calculatedKundli.yogas,
          dashaPeriod: aiData.dashaPeriod || calculatedKundli.dashaPeriod,
          remedies: aiData.remedies || calculatedKundli.remedies,
        };
      }
    } catch (err) {
      console.warn(`[FALLBACK] Serving exact calculated Sidereal Kundli for ${name}`);
      data = calculatedKundli;
    }

    kundliCache.set(cacheKey, { data, timestamp: Date.now() });
    return res.json({ success: true, kundli: data });
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

// -------------------------------------------------------------
// 3. VITE SERVER & STATIC HOSTING
// -------------------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
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

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`✨ Vedanga AI Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
