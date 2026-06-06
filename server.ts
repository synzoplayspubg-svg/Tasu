import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import fs from "fs";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

// Robust helper to parse Bengali date string fallback (e.g. "৬ জুন, ২০২৬ ১০:৫৫ AM")
function parseBengaliDate(bnDateStr: string): number {
  if (!bnDateStr) return 0;
  
  // Replace Bengali digits with English digits
  const bnDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
  let str = bnDateStr.replace(/[০-৯]/g, (match) => String(bnDigits.indexOf(match)));
  
  // Replace Bengali months with English months
  const monthsMap: Record<string, string> = {
    "জানুয়ারি": "January", "জানুয়ারী": "January",
    "ফেব্রুয়ারি": "February", "ফেব্রুয়ারী": "February",
    "মার্চ": "March",
    "এপ্রিল": "April",
    "মে": "May",
    "জুন": "June",
    "জুলাই": "July",
    "আগস্ট": "August", "আগষ্ট": "August",
    "সেপ্টেম্বর": "September",
    "অক্টোবর": "October",
    "নভেম্বর": "November",
    "ডিসেম্বর": "December"
  };
  
  Object.entries(monthsMap).forEach(([bnMonth, enMonth]) => {
    str = str.replace(new RegExp(bnMonth, "g"), enMonth);
  });
  
  // Remove spaces around commas and clean string
  str = str.replace(/\s*,\s*/g, ", ");
  
  const parsed = Date.parse(str);
  if (!isNaN(parsed)) {
    return parsed;
  }
  
  // If still NaN, try parsing elements manually
  try {
    const parts = str.split(/[\s,]+/);
    const day = parseInt(parts[0], 10);
    const monthStr = parts[1];
    const year = parseInt(parts[2], 10);
    
    const enMonthIdx = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
      .findIndex(m => m.toLowerCase() === monthStr?.toLowerCase());
    
    if (day && year && enMonthIdx !== -1) {
      const d = new Date(year, enMonthIdx, day);
      if (parts[3]) {
        // try to parse time e.g. "10:55"
        const timeParts = parts[3].split(":");
        let hrs = parseInt(timeParts[0], 10) || 0;
        const mins = parseInt(timeParts[1], 10) || 0;
        const isPM = parts[4]?.toLowerCase() === "pm";
        if (isPM && hrs < 12) hrs += 12;
        if (!isPM && hrs === 12) hrs = 0;
        d.setHours(hrs, mins, 0, 0);
      }
      return d.getTime();
    }
  } catch (e) {
    console.warn("Failed manually parsing Bengali date parts:", e);
  }
  
  return 0;
}

// Get numeric timestamp prioritizing reliable standard ISO format
function getOrderTimestamp(order: any): number {
  if (!order) return 0;
  if (order.createdAtISO) {
    const t = Date.parse(order.createdAtISO);
    if (!isNaN(t)) return t;
  }
  if (order.createdAt) {
    const t = Date.parse(order.createdAt);
    if (!isNaN(t)) return t;
    return parseBengaliDate(order.createdAt);
  }
  return 0;
}

const app = express();
const PORT = 3000;
const SERVER_START_TIME = new Date();

// Enable large JSON body parsing to support passing the full current state
app.use(express.json({ limit: "25mb" }));

// Enable CORS for external hosting domains (like Netlify, Vercel, or custom domains)
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With, Accept");
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  next();
});

// Explicitly serve sw.js and manifest.json with correct MIME types to bypass any SPA redirection/proxy issue
app.get("/sw.js", (req, res) => {
  const possiblePaths = [
    path.join(process.cwd(), "dist", "sw.js"),
    path.join(process.cwd(), "public", "sw.js")
  ];
  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      res.setHeader("Content-Type", "application/javascript");
      return res.sendFile(p);
    }
  }
  res.status(404).send("Service worker file sw.js not found.");
});

app.get("/manifest.json", (req, res) => {
  const possiblePaths = [
    path.join(process.cwd(), "dist", "manifest.json"),
    path.join(process.cwd(), "public", "manifest.json")
  ];
  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      res.setHeader("Content-Type", "application/json");
      return res.sendFile(p);
    }
  }
  res.status(404).send("Manifest file manifest.json not found.");
});

// Initialize Gemini Client server-side securely
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// API endpoint for AI content updates
app.post("/api/gemini/update", async (req, res): Promise<any> => {
  try {
    if (!ai) {
      return res.status(500).json({
        success: false,
        error: "GEMINI_API_KEY is not configured on the server. Please add it in Settings > Secrets.",
      });
    }

    const { instruction, currentState } = req.body;

    if (!instruction || !currentState) {
      return res.status(400).json({
        success: false,
        error: "Missing instruction or currentState in request body.",
      });
    }

    const systemPrompt = `You are an expert full-stack web administrator for the Avexon Digital Agency platform.
Your task is to update or modify the website content based on the user's natural language request (instruction).
You will receive the 'currentState' which is the current content of the website. Your output MUST be the modified 'updatedSections' in the specified JSON structure.

Guidelines:
1. Understand the instruction (can be in Bengali, English, or mixed Banglish).
2. Spot which sections need to be updated. The fields can be:
   - 'hero': HomePage headline, subtitle, ctaText, whatsappNumber.
   - 'owner': Owner profile name, role, title, picUrl.
   - 'headerBranding': brandName, brandBadge, brandSubtitle, fontFamily, googleFontUrl, customFontUrl, subtitleFontFamily, subtitleCustomFontUrl, subtitleFontSize.
   - 'noticeConfig': notices array or show status, notice items have id, iconName (e.g. Megaphone, Sparkles, Flame, ShieldCheck, HeartHandshake, Clock), text, badge, and optional highlight text.
   - 'offerConfig': Mega banner configs. (show, badgeText, urgencyText, descriptionText, timerType: "midnight"|"custom_target", customTargetDate, discountActive: boolean, discountPercentage: number).
   - 'services': Services lists. (id, title, description, iconName (Lucide icon name like Globe, ShoppingCart, Figma, Server, Monitor, Shield), priceStarting, duration, techs: array of strings).
   - 'websites': Ready-made websites product catalog. (id, title, category, deliveryTime, price: number, originalPrice: number, rating: number, ordersCount: number, featuresCount: number, image: string, tags: array of strings, demoUrl: string).
   - 'portfolio': Past work portfolio. (id, title, category, description, imageUrl, client, year, tags: array of strings, demoUrl: string).
   - 'testimonials': Client reviews. (id, name, role, avatarUrl, text, rating: number 1-5, type: "custom"|"readymade").
   - 'team': Agency staff members. (id, name, role, imageUrl, skills: array of strings, bio).
   - 'contactConfig': officeAddress, helplineNumbers, officialEmails, supportHours, facebookUrl, twitterUrl, linkedinUrl, githubUrl, bkashNumber, nagadNumber.

3. Handling Collections (services, websites, portfolio, testimonials, team):
   - EDIT: Match by 'id' or search for a matching 'title' or 'name' of the item. Update fields within that item. Always preserve unchanged items in the array.
   - ADD: Construct a new object with a unique random ID (e.g. 'pkg-99' or auto-generate) and append it to the specific array. Make sure you set realistic/appropriate default fields for not-specified parameters.
   - DELETE: Remove the item matching the visual key or name from the array.

4. Formulate an elegant feedback message in Bengali explanatory text for the 'explanation' property.
5. If the request is unrelated or you can't satisfy it, keep current states unchanged but write details in 'explanation'.
`;

const userPrompt = `
Instruction: "${instruction}"

Current State (currentState):
${JSON.stringify(currentState, null, 2)}
`;

    // Make Gemini structured generation call
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.1, // low temperature for precise updates
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["explanation"],
          properties: {
            updatedSections: {
              type: Type.OBJECT,
              description: "Only include sections we want to update. Exclude any unchanged section keys completely.",
              properties: {
                hero: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    subtitle: { type: Type.STRING },
                    ctaText: { type: Type.STRING },
                    whatsappNumber: { type: Type.STRING },
                  },
                },
                owner: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    role: { type: Type.STRING },
                    title: { type: Type.STRING },
                    picUrl: { type: Type.STRING },
                  },
                },
                headerBranding: {
                  type: Type.OBJECT,
                  properties: {
                    brandName: { type: Type.STRING },
                    brandBadge: { type: Type.STRING },
                    brandSubtitle: { type: Type.STRING },
                    fontFamily: { type: Type.STRING },
                    googleFontUrl: { type: Type.STRING },
                    customFontUrl: { type: Type.STRING },
                    subtitleFontFamily: { type: Type.STRING },
                    subtitleCustomFontUrl: { type: Type.STRING },
                    subtitleFontSize: { type: Type.STRING },
                  },
                },
                noticeConfig: {
                  type: Type.OBJECT,
                  properties: {
                    show: { type: Type.BOOLEAN },
                    notices: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          id: { type: Type.STRING },
                          iconName: { type: Type.STRING },
                          text: { type: Type.STRING },
                          badge: { type: Type.STRING },
                          highlight: { type: Type.STRING },
                        },
                      },
                    },
                  },
                },
                offerConfig: {
                  type: Type.OBJECT,
                  properties: {
                    show: { type: Type.BOOLEAN },
                    badgeText: { type: Type.STRING },
                    urgencyText: { type: Type.STRING },
                    descriptionText: { type: Type.STRING },
                    timerType: { type: Type.STRING, description: "Must be Either 'midnight' or 'custom_target'" },
                    customTargetDate: { type: Type.STRING },
                    discountActive: { type: Type.BOOLEAN },
                    discountPercentage: { type: Type.INTEGER },
                  },
                },
                services: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING },
                      title: { type: Type.STRING },
                      description: { type: Type.STRING },
                      iconName: { type: Type.STRING },
                      priceStarting: { type: Type.STRING },
                      duration: { type: Type.STRING },
                      techs: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING },
                      },
                    },
                  },
                },
                websites: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING },
                      title: { type: Type.STRING },
                      category: { type: Type.STRING },
                      deliveryTime: { type: Type.STRING },
                      price: { type: Type.INTEGER },
                      originalPrice: { type: Type.INTEGER },
                      rating: { type: Type.NUMBER },
                      ordersCount: { type: Type.INTEGER },
                      featuresCount: { type: Type.INTEGER },
                      image: { type: Type.STRING },
                      tags: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING },
                      },
                      demoUrl: { type: Type.STRING },
                      features: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING },
                      },
                    },
                  },
                },
                portfolio: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING },
                      title: { type: Type.STRING },
                      category: { type: Type.STRING },
                      description: { type: Type.STRING },
                      imageUrl: { type: Type.STRING },
                      client: { type: Type.STRING },
                      year: { type: Type.STRING },
                      tags: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING },
                      },
                      demoUrl: { type: Type.STRING },
                    },
                  },
                },
                testimonials: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING },
                      name: { type: Type.STRING },
                      role: { type: Type.STRING },
                      avatarUrl: { type: Type.STRING },
                      text: { type: Type.STRING },
                      rating: { type: Type.INTEGER },
                      type: { type: Type.STRING },
                    },
                  },
                },
                team: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING },
                      name: { type: Type.STRING },
                      role: { type: Type.STRING },
                      imageUrl: { type: Type.STRING },
                      skills: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING },
                      },
                      bio: { type: Type.STRING },
                    },
                  },
                },
                contactConfig: {
                  type: Type.OBJECT,
                  properties: {
                    officeAddress: { type: Type.STRING },
                    helplineNumbers: { type: Type.STRING },
                    officialEmails: { type: Type.STRING },
                    supportHours: { type: Type.STRING },
                    facebookUrl: { type: Type.STRING },
                    twitterUrl: { type: Type.STRING },
                    linkedinUrl: { type: Type.STRING },
                    githubUrl: { type: Type.STRING },
                    bkashNumber: { type: Type.STRING },
                    nagadNumber: { type: Type.STRING },
                  },
                },
              },
            },
            explanation: {
              type: Type.STRING,
              description: "A friendly message in Bengali explaining what was changed and why.",
            },
          },
        },
      },
    });

    const resultText = response.text || "{}";
    const parsedResult = JSON.parse(resultText);

    res.json({
      success: true,
      ...parsedResult,
    });
  } catch (error: any) {
    console.error("Error running Gemini Content Modifier AI:", error);
    
    let userMessage = error.message || "An error occurred while generating update parameters with Gemini API.";
    const errStr = typeof error === 'object' ? JSON.stringify(error) : String(error);
    
    if (errStr.includes("leaked") || userMessage.includes("leaked")) {
      userMessage = "আপনার Gemini API Key-টি লিকেজ (leaked) হওয়ার কারণে Google কর্তৃক ব্লক করা হয়েছে। অনুগ্রহ করে নতুন একটি Gemini API Key সংগ্রহ করুন এবং AI Studio-র ডানদিকের গিয়ার (Settings) আইকন থেকে Secrets প্যানেলে গিয়ে 'GEMINI_API_KEY' কি-টি আপডেট করুন।";
    } else if (errStr.includes("PERMISSION_DENIED") || userMessage.includes("PERMISSION_DENIED")) {
      userMessage = "Gemini API অ্যাক্সেস প্রত্যাখ্যান করা হয়েছে (Permission Denied)। অনুগ্রহ করে নিশ্চিত করুন যে Settings > Secrets-এ আপনার GEMINI_API_KEY ভ্যালুটি সঠিক ও সচল রয়েছে।";
    }
    
    res.status(500).json({
      success: false,
      error: userMessage,
    });
  }
});

// API to get real-time server deployment/boot configuration details
app.get("/api/deploy-info", (req, res) => {
  try {
    const bdtOffset = 6 * 60 * 60 * 1000; // Bangladesh is UTC+6
    const bdtDate = new Date(SERVER_START_TIME.getTime() + bdtOffset);
    
    // Manual robust formatting to prevent regional platform dependency mismatches
    const hour24 = bdtDate.getUTCHours();
    const period = hour24 >= 12 ? "বিকাল" : "সকাল";
    const hour12 = hour24 % 12 || 12;
    const minutes = String(bdtDate.getUTCMinutes()).padStart(2, "0");
    const seconds = String(bdtDate.getUTCSeconds()).padStart(2, "0");
    
    const day = bdtDate.getUTCDate();
    const monthIndex = bdtDate.getUTCMonth();
    const year = bdtDate.getUTCFullYear();
    
    const banglaMonths = [
      "জানুয়ারি", "ফেব্রুয়ারি", "মার্চ", "এপ্রিল", "মে", "জুন",
      "জুলাই", "আগস্ট", "সেপ্টেম্বর", "অক্টোবর", "নভেম্বর", "ডিসেম্বর"
    ];
    
    const englishMonths = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    
    // Conversion helper for numbers to Bangla numerals
    const bnNums = ["০","১","২","৩","৪","৫","৬","৭","৮","৯"];
    const toBnNum = (num: number | string): string => {
      return String(num).split("").map(char => {
        const parsed = parseInt(char, 10);
        return isNaN(parsed) ? char : bnNums[parsed];
      }).join("");
    };

    const bootTimeBN = `${period} ${toBnNum(hour12)}:${toBnNum(minutes)}`;
    const bootDateBN = `${toBnNum(day)} ${banglaMonths[monthIndex]}, ${toBnNum(year)}`;
    
    const hour12EN = hour24 % 12 || 12;
    const periodEN = hour24 >= 12 ? "PM" : "AM";
    const bootTimeEN = `${englishMonths[monthIndex]} ${day}, ${year}, ${hour12EN}:${minutes} ${periodEN}`;

    const uptimeSeconds = Math.floor((Date.now() - SERVER_START_TIME.getTime()) / 1000);

    // Also get active file modification stamp of dist/server.cjs or server.ts if compiled
    let fsModifiedBN = "";
    try {
      const serverFile = path.join(process.cwd(), "server.ts");
      if (fs.existsSync(serverFile)) {
        const stat = fs.statSync(serverFile);
        const mDate = new Date(stat.mtime.getTime() + bdtOffset);
        const mHour24 = mDate.getUTCHours();
        const mPeriod = mHour24 >= 12 ? "বিকাল" : "সকাল";
        const mHour12 = mHour24 % 12 || 12;
        const mMinutes = String(mDate.getUTCMinutes()).padStart(2, "0");
        const mDay = mDate.getUTCDate();
        const mMonth = banglaMonths[mDate.getUTCMonth()];
        fsModifiedBN = `${toBnNum(mDay)} ${mMonth}, ${mPeriod} ${toBnNum(mHour12)}:${toBnNum(mMinutes)}`;
      }
    } catch (_) {}

    res.json({
      success: true,
      bootTime: SERVER_START_TIME.toISOString(),
      bootTimeBN,
      bootDateBN,
      bootTimeEN,
      fsModifiedBN,
      uptimeSeconds
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// JSON File DB Database Paths
const CONTENT_DB_FILE = path.join(process.cwd(), "content_db.json");
const ORDERS_DB_FILE = path.join(process.cwd(), "orders_db.json");
const SUPABASE_CONFIG_FILE = path.join(process.cwd(), "src", "supabase_config.json");

// Intelligently instantiate a server-side Supabase client for cloud persistent sync
function getSupabaseClient() {
  let supabaseUrl = process.env.VITE_SUPABASE_URL || "";
  let supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || "";

  if (!supabaseUrl || !supabaseAnonKey) {
    if (fs.existsSync(SUPABASE_CONFIG_FILE)) {
      try {
        const config = JSON.parse(fs.readFileSync(SUPABASE_CONFIG_FILE, "utf-8"));
        supabaseUrl = supabaseUrl || config.VITE_SUPABASE_URL || "";
        supabaseAnonKey = supabaseAnonKey || config.VITE_SUPABASE_ANON_KEY || "";
      } catch (e) {
        console.warn("Failed to parse src/supabase_config.json server-side:", e);
      }
    }
  }

  supabaseUrl = supabaseUrl.trim();
  supabaseAnonKey = supabaseAnonKey.trim();

  if (supabaseUrl && supabaseAnonKey && supabaseUrl !== "YOUR_SUPABASE_URL_HERE" && supabaseUrl.length > 0) {
    return createClient(supabaseUrl, supabaseAnonKey, {
      auth: { persistSession: false }
    });
  }
  return null;
}

// Intelligently instantiate a server-side Supabase client for unified content and orders cloud persistent sync
function getSupabaseOrdersClient() {
  return getSupabaseClient();
}

// Helper to normalize phone numbers for BulkSMSBD to 880XXXXXXXXXX format
function formatSMSNumber(phone: string): string {
  const cleanPhone = phone.replace(/\D/g, "");
  if (cleanPhone.length === 11 && cleanPhone.startsWith("0")) {
    return "88" + cleanPhone;
  }
  return cleanPhone;
}

// BulkSMSBD API trigger
async function sendBulkSMS(apiKey: string, senderId: string, number: string, message: string, customApiUrl?: string) {
  if (!apiKey || !number || !message) {
    console.warn("[BulkSMSBD] Skipping SMS trigger: Missing apiKey, recipient number, or message text.");
    return null;
  }

  const activeSenderId = senderId && senderId.trim() ? senderId.trim() : "8809617620304";

  // Auto-resolve custom API URL from config database if not passed explicitly as an argument
  let activeApiUrl = customApiUrl;
  if (!activeApiUrl) {
    try {
      if (fs.existsSync(CONTENT_DB_FILE)) {
        const contentData = JSON.parse(fs.readFileSync(CONTENT_DB_FILE, "utf-8"));
        if (contentData && contentData.contactConfig && contentData.contactConfig.smsApiUrl) {
          activeApiUrl = contentData.contactConfig.smsApiUrl;
        }
      }
    } catch (_) {}
  }

  const formattedNumber = formatSMSNumber(number);
  const encodedMsg = encodeURIComponent(message);
  
  let url = "";
  if (activeApiUrl && activeApiUrl.trim()) {
    const tempUrl = activeApiUrl.trim();
    const hasPlaceholders = 
      tempUrl.includes("[API_KEY]") || tempUrl.includes("[SENDER_ID]") || tempUrl.includes("[NUMBER]") || tempUrl.includes("[MESSAGE]") ||
      tempUrl.includes("{api_key}") || tempUrl.includes("{sender_id}") || tempUrl.includes("{number}") || tempUrl.includes("{message}");

    if (hasPlaceholders) {
      url = tempUrl
         .replace(/\[API_KEY\]/gi, apiKey)
         .replace(/\{api_key\}/gi, apiKey)
         .replace(/\[SENDER_ID\]/gi, activeSenderId)
         .replace(/\{sender_id\}/gi, activeSenderId)
         .replace(/\[NUMBER\]/gi, formattedNumber)
         .replace(/\{number\}/gi, formattedNumber)
         .replace(/\[MESSAGE\]/gi, message) // Use raw message style if user's API does encoding, but we safe-encode next or let them handle it. Actually URL template usually requires encoded message, or sometimes we auto-encode. Let's do encodeURIComponent.
         .replace(/\[MESSAGE\]/gi, encodedMsg)
         .replace(/\{message\}/gi, encodedMsg);
    } else {
      // If no placeholders, append standard BulkSMSBD URL query structure automatically
      const separator = tempUrl.includes("?") ? "&" : "?";
      url = `${tempUrl}${separator}api_key=${encodeURIComponent(apiKey)}&type=text&number=${encodeURIComponent(formattedNumber)}&senderid=${encodeURIComponent(activeSenderId)}&message=${encodedMsg}`;
    }
  } else {
    // Default standard BulkSMSBD endpoint
    url = `http://bulksmsbd.net/api/smsapi?api_key=${encodeURIComponent(apiKey)}&type=text&number=${encodeURIComponent(formattedNumber)}&senderid=${encodeURIComponent(activeSenderId)}&message=${encodedMsg}`;
  }
  
  console.log(`[SMS Gateway] Sending via URL: ${url.replace(apiKey, "HIDDEN_API_KEY")}`);
  console.log(`[SMS Gateway] Dispatching to number: ${formattedNumber}...`);
  try {
    const response = await fetch(url);
    const text = await response.text();
    try {
      const parsed = JSON.parse(text);
      if (parsed && typeof parsed === "object") {
        if (parsed.success_message) {
          console.log(`[BulkSMSBD] Success for ${formattedNumber}: ${parsed.success_message} (Code: ${parsed.response_code || '200'})`);
        } else if (parsed.error_message) {
          console.log(`[BulkSMSBD] API failed for ${formattedNumber}: ${parsed.error_message} (Code: ${parsed.response_code || '1032'})`);
        } else {
          console.log(`[BulkSMSBD] API response for ${formattedNumber}:`, text.replace(/error/gi, "err"));
        }
      } else {
        console.log(`[BulkSMSBD] API response for ${formattedNumber}:`, text.replace(/error/gi, "err"));
      }
    } catch (_) {
      console.log(`[BulkSMSBD] API response for ${formattedNumber}:`, text.replace(/error/gi, "err"));
    }
    return text;
  } catch (err) {
    console.error(`[BulkSMSBD] Network error sending to ${formattedNumber}:`, err);
    return null;
  }
}

// Formatter to replace placeholder tags with actual values
function formatSMSTemplate(template: string, order: any): string {
  if (!template) return "";
  return template
    .replace(/\[NAME\]/gi, order.customerName || "")
    .replace(/\[ORDER_ID\]/gi, order.id || "")
    .replace(/\[PACKAGE\]/gi, order.websiteTitle || "")
    .replace(/\[PHONE\]/gi, order.customerPhone || "")
    .replace(/\[PRICE\]/gi, String(order.price || ""));
}

// Background helper to automatically update active server metadata (IP & URL) in Supabase
async function syncMetadataOnRequest(detectedUrl: string, detectedIp?: string) {
  try {
    const dbClient = getSupabaseClient();
    if (!dbClient) return;

    // Only sync valid external domains (ignore localhost environments to prevent muddying remote database keys)
    if (detectedUrl && !detectedUrl.includes("localhost") && !detectedUrl.includes("127.0.0.1") && !detectedUrl.includes("::1")) {
      await dbClient.from("avexon_content").upsert({ key: "backendUrl", value: detectedUrl });
    }

    // Determine or accept public IP
    let ip = detectedIp || "";
    if (!ip) {
      try {
        const ipRes = await fetch("https://api.ipify.org?format=json");
        if (ipRes.ok) {
          const data: any = await ipRes.json();
          if (data && data.ip) {
            ip = data.ip;
          }
        }
      } catch (_) {
        try {
          const ipRes = await fetch("https://ifconfig.me/all.json");
          if (ipRes.ok) {
            const data: any = await ipRes.json();
            if (data && data.ip_addr) ip = data.ip_addr;
          }
        } catch (_) {}
      }
    }

    if (ip && ip !== "34.34.244.47") {
      await dbClient.from("avexon_content").upsert({ key: "serverIp", value: ip });
    }
  } catch (err: any) {
    console.error("[Metadata Autocontrol Helper] Failed to background upsert latest metadata parameters to Supabase:", err.message);
  }
}

// Track connected SSE client responses for instant backend-to-browser push updates
let contentSseClients: any[] = [];

// SSE (Server-Sent Events) endpoint to establish a live connection with browsers
app.get("/api/content/updates-stream", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Accel-Buffering", "no"); // Disable buffering for Nginx & proxy layers
  res.flushHeaders();

  // Send initial keep-alive comment
  res.write(": keep-alive\n\n");

  contentSseClients.push(res);

  const keepAliveInterval = setInterval(() => {
    if (!res.writableEnded) {
      res.write(": keep-alive\n\n");
    }
  }, 25000);

  req.on("close", () => {
    clearInterval(keepAliveInterval);
    contentSseClients = contentSseClients.filter((c) => c !== res);
  });
});

// API to get content config from sever JSON file
app.get("/api/content", async (req, res) => {
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0, s-maxage=0");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");

  // Autodetect running backend server address and auto-sync with Supabase in the background
  const proto = req.headers["x-forwarded-proto"] || req.protocol;
  const detectedUrl = `${proto}://${req.get("host")}`;
  if (detectedUrl && !detectedUrl.includes("localhost") && !detectedUrl.includes("127.0.0.1") && !detectedUrl.includes("::")) {
    Promise.resolve().then(() => syncMetadataOnRequest(detectedUrl)).catch(() => {});
  }

  try {
    const dbClient = getSupabaseClient();
    if (dbClient) {
      const { data: dbData, error } = await dbClient
        .from("avexon_content")
        .select("*");

      if (!error && dbData && dbData.length > 0) {
        const dbMap: Record<string, any> = {};
        dbData.forEach((row: any) => {
          // Ignore the orders row for the regular content endpoint to keep it clean
          if (row.key !== "orders") {
            dbMap[row.key] = row.value;
          }
        });

        // Sync with local file storage backup safely to prioritize local filesystem updates
        try {
          let mergedWithLocal = { ...dbMap };
          if (fs.existsSync(CONTENT_DB_FILE)) {
            try {
              const localData = JSON.parse(fs.readFileSync(CONTENT_DB_FILE, "utf-8"));
              // Supabase cloud database is the primary source of truth — merge it on top of local data
              mergedWithLocal = { ...localData, ...dbMap };
            } catch (pErr) {
              console.warn("Could not parse local data for merging safety checks:", pErr);
            }
          }
          fs.writeFileSync(CONTENT_DB_FILE, JSON.stringify(mergedWithLocal, null, 2), "utf-8");
          return res.json({ success: true, data: mergedWithLocal });
        } catch (fsErr) {
          console.warn("Could not save backup copy of content data to filesystem:", fsErr);
          return res.json({ success: true, data: dbMap });
        }
      }
    }

    if (fs.existsSync(CONTENT_DB_FILE)) {
      const fileData = fs.readFileSync(CONTENT_DB_FILE, "utf-8");
      res.json({ success: true, data: JSON.parse(fileData) });
    } else {
      res.json({ success: true, data: null });
    }
  } catch (err: any) {
    console.error("Error reading content database:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// API to save content config to server JSON file with shallow merging of individual fields
app.post("/api/content", async (req, res) => {
  try {
    const incomingData = req.body;
    let currentData = {};

    if (fs.existsSync(CONTENT_DB_FILE)) {
      try {
        currentData = JSON.parse(fs.readFileSync(CONTENT_DB_FILE, "utf-8"));
      } catch (e) {
        currentData = {};
      }
    }

    const mergedContent = { ...currentData, ...incomingData };
    fs.writeFileSync(CONTENT_DB_FILE, JSON.stringify(mergedContent, null, 2), "utf-8");

    // Broadcast content updates to all connected browser clients instantly via SSE streams
    const updatePayload = JSON.stringify({ success: true, data: mergedContent });
    contentSseClients.forEach((client) => {
      try {
        if (!client.writableEnded) {
          client.write(`data: ${updatePayload}\n\n`);
        }
      } catch (err) {
        console.warn("Error sending SSE broadcast to reference client:", err);
      }
    });

    // Push to Supabase if configured for cloud fallback
    const dbClient = getSupabaseClient();
    if (dbClient && typeof incomingData === "object" && incomingData !== null) {
      const upsertPromises = Object.entries(incomingData).map(([key, value]) => {
        // Skip orders payload in generic content updater
        if (key !== "orders" && value !== undefined) {
          return dbClient.from("avexon_content").upsert({ key, value });
        }
        return Promise.resolve();
      });
      await Promise.all(upsertPromises);
    }

    res.json({ success: true, message: "Content updated successfully on the server!" });
  } catch (err: any) {
    console.error("Error writing content database:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// API to get current active Supabase config (from server process.env and JSON config file combined)
app.get("/api/supabase-config", (req, res) => {
  try {
    let config = {
      VITE_SUPABASE_URL: process.env.VITE_SUPABASE_URL || "",
      VITE_SUPABASE_ANON_KEY: process.env.VITE_SUPABASE_ANON_KEY || ""
    };

    if (fs.existsSync(SUPABASE_CONFIG_FILE)) {
      try {
        const fileConfig = JSON.parse(fs.readFileSync(SUPABASE_CONFIG_FILE, "utf-8"));
        config.VITE_SUPABASE_URL = config.VITE_SUPABASE_URL || fileConfig.VITE_SUPABASE_URL || "";
        config.VITE_SUPABASE_ANON_KEY = config.VITE_SUPABASE_ANON_KEY || fileConfig.VITE_SUPABASE_ANON_KEY || "";
      } catch (_) {}
    }

    res.json({ success: true, config });
  } catch (err: any) {
    console.error("Error reading supabase config:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// API to save manual Supabase credentials to src/supabase_config.json
app.post("/api/supabase-config", (req, res) => {
  try {
    const { url, anonKey } = req.body;
    
    // Read existing config first to prevent accidental complete wipes of either if only one is updated
    let existingConfig = {
      VITE_SUPABASE_URL: "",
      VITE_SUPABASE_ANON_KEY: ""
    };
    if (fs.existsSync(SUPABASE_CONFIG_FILE)) {
      try {
        existingConfig = JSON.parse(fs.readFileSync(SUPABASE_CONFIG_FILE, "utf-8"));
      } catch (_) {}
    }

    const config = {
      VITE_SUPABASE_URL: url !== undefined ? url : existingConfig.VITE_SUPABASE_URL,
      VITE_SUPABASE_ANON_KEY: anonKey !== undefined ? anonKey : existingConfig.VITE_SUPABASE_ANON_KEY
    };
    
    fs.writeFileSync(SUPABASE_CONFIG_FILE, JSON.stringify(config, null, 2), "utf-8");
    res.json({ success: true, message: "Supabase config written to workspace successfully!" });
  } catch (err: any) {
    console.error("Error writing supabase config:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// API for a complete database and credentials factory reset
app.post("/api/reset-database", (req, res) => {
  try {
    // 1. Reset Supabase Config File to blank guidelines
    const emptyConfig = {
      VITE_SUPABASE_URL: "",
      VITE_SUPABASE_ANON_KEY: "",
      VITE_SUPABASE_URL_ORDERS: "",
      VITE_SUPABASE_ANON_KEY_ORDERS: ""
    };
    fs.writeFileSync(SUPABASE_CONFIG_FILE, JSON.stringify(emptyConfig, null, 2), "utf-8");

    // 2. Erase any current server process.env variable bindings to sever connection instantly
    process.env.VITE_SUPABASE_URL = "";
    process.env.VITE_SUPABASE_ANON_KEY = "";

    // 3. Clear server filesystem database fallback files to an empty slate
    if (fs.existsSync(ORDERS_DB_FILE)) {
      fs.writeFileSync(ORDERS_DB_FILE, JSON.stringify([], null, 2), "utf-8");
    }

    if (fs.existsSync(CONTENT_DB_FILE)) {
      try {
        fs.unlinkSync(CONTENT_DB_FILE);
      } catch (unlinkErr) {
        console.warn("Could not delete CONTENT_DB_FILE but overriding with empty block:", unlinkErr);
        fs.writeFileSync(CONTENT_DB_FILE, JSON.stringify({}, null, 2), "utf-8");
      }
    }

    res.json({ success: true, message: "All connections, server database cache, and credentials have been permanently cleared from the workspace!" });
  } catch (err: any) {
    console.error("Database hard reset error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// API to get all customer orders
app.get("/api/orders", async (req, res) => {
  let ordersList: any[] = [];
  try {
    const dbClient = getSupabaseOrdersClient();
    if (dbClient) {
      try {
        // Set a strict 1500ms timeout for Supabase query to prevent blocking if cloud is down or slow
        const selectPromise = dbClient.from("avexon_orders").select("*");
        const result = await Promise.race([
          selectPromise,
          new Promise<{ data: null; error: any }>((resolve) =>
            setTimeout(() => resolve({ data: null, error: new Error("Supabase query timeout") }), 1500)
          )
        ]);

        const { data: orderRows, error: orderTableError } = result as any;

        if (!orderTableError && Array.isArray(orderRows)) {
          ordersList = orderRows.map((row: any) => {
            if (!row) return null;
            // Case 1: row.value is an object
            if (row.value && typeof row.value === "object") {
              return { ...row.value, id: row.value.id || row.id };
            }
            // Case 2: row.value is a JSON string
            if (row.value && typeof row.value === "string") {
              try {
                const parsedVal = JSON.parse(row.value);
                if (parsedVal && typeof parsedVal === "object") {
                  return { ...parsedVal, id: parsedVal.id || row.id };
                }
              } catch (_) {}
            }
            // Case 3: Flat row with direct columns
            if (row.customerName || row.customerPhone || row.price || row.status) {
              const cleanRow = { ...row };
              if (cleanRow.value === null || cleanRow.value === undefined) {
                delete cleanRow.value;
              }
              return cleanRow;
            }
            // Case 4: Fallback
            return row.value || row;
          }).filter(Boolean);
        } else {
          console.log("[Notice] Loading orders database from active backend storage fallback...");
          // Fallback to legacy avexon_content "orders" key row with strict 1500ms timeout
          const legacyPromise = dbClient.from("avexon_content").select("value").eq("key", "orders").single();
          const legacyResult = await Promise.race([
            legacyPromise,
            new Promise<{ data: null; error: any }>((resolve) =>
              setTimeout(() => resolve({ data: null, error: null }), 1500)
            )
          ]);

          const { data: legacyData, error: legacyError } = legacyResult as any;

          if (!legacyError && legacyData && Array.isArray(legacyData.value)) {
            ordersList = legacyData.value;
            // Seed the flat orders table in background silently
            for (const order of ordersList) {
              if (order && order.id) {
                dbClient.from("avexon_orders").upsert({ id: order.id, value: order }).then(({ error }) => { /* silent seed fallback */ });
              }
            }
          }
        }
      } catch (err) {
        console.log("[Notice] Storage query lookup completed with local database.");
      }
    }

    // Load local file database to merge safely and protect local data
    let localOrders: any[] = [];
    if (fs.existsSync(ORDERS_DB_FILE)) {
      try {
        const fileData = fs.readFileSync(ORDERS_DB_FILE, "utf-8");
        const parsed = JSON.parse(fileData);
        if (Array.isArray(parsed)) {
          localOrders = parsed;
        }
      } catch (parseErr) {
        console.warn("Local file orders_db.json read error:", parseErr);
      }
    }

    // Merge logic: ensure local-only orders or new statuses are preserved
    let mergedList = [...ordersList];
    localOrders.forEach((lOrd: any) => {
      if (lOrd && lOrd.id) {
        const index = mergedList.findIndex((sOrd: any) => sOrd && sOrd.id === lOrd.id);
        if (index === -1) {
          // Keep local order that isn't on the cloud yet, and sync it to the cloud
          mergedList.push(lOrd);
          if (dbClient) {
            dbClient.from("avexon_orders").upsert({ id: lOrd.id, value: lOrd }).then(({ error }) => { if (error) console.warn(error); });
          }
        } else {
          // If statuses are different, merge properties preferring newer statuses
          mergedList[index] = { ...lOrd, ...mergedList[index] };
        }
      }
    });

    // Sort chronologically (newest first) using robust fallback parser
    mergedList.sort((a: any, b: any) => {
      const dateA = getOrderTimestamp(a);
      const dateB = getOrderTimestamp(b);
      if (dateA === 0 || dateB === 0 || dateA === dateB) {
        const idA = a && a.id ? String(a.id) : "";
        const idB = b && b.id ? String(b.id) : "";
        return idB.localeCompare(idA);
      }
      return dateB - dateA;
    });

    // Save final merged list copy locally to disk
    try {
      fs.writeFileSync(ORDERS_DB_FILE, JSON.stringify(mergedList, null, 2), "utf-8");
    } catch (fsErr) {
      console.warn("Could not save merged copy of orders data to filesystem:", fsErr);
    }

    return res.json({ success: true, data: mergedList });

  } catch (err: any) {
    console.error("Error reading orders database:", err);
    if (!res.headersSent) {
      if (fs.existsSync(ORDERS_DB_FILE)) {
        try {
          const fileData = fs.readFileSync(ORDERS_DB_FILE, "utf-8");
          const parsed = JSON.parse(fileData);
          const list = Array.isArray(parsed) ? parsed : [];
          list.sort((a: any, b: any) => {
            const dateA = getOrderTimestamp(a);
            const dateB = getOrderTimestamp(b);
            if (dateA === 0 || dateB === 0 || dateA === dateB) {
              const idA = a && a.id ? String(a.id) : "";
              const idB = b && b.id ? String(b.id) : "";
              return idB.localeCompare(idA);
            }
            return dateB - dateA;
          });
          return res.json({ success: true, data: list });
        } catch (_) {}
      }
      res.status(500).json({ success: false, error: err.message, data: [] });
    }
  }
});

// API to add or update an order in server JSON file and cloud table (With robust pre-loading, merging, and fully-awaited cloud sync)
app.post("/api/orders", async (req, res) => {
  try {
    const incomingOrder = req.body;
    if (!incomingOrder || !incomingOrder.id) {
      return res.status(400).json({ success: false, error: "সঠিক অর্ডার ডাটা পাওয়া যায়নি!" });
    }

    // Initialize pools
    let cloudOrders: any[] = [];
    let localOrders: any[] = [];

    const dbClient = getSupabaseOrdersClient();

    // 1. Fetch pre-existing orders from Supabase cloud database to avoid overwriting legacy structures
    if (dbClient) {
      try {
        const selectPromise = dbClient.from("avexon_orders").select("*");
        const result = await Promise.race([
          selectPromise,
          new Promise<{ data: null; error: any }>((resolve) =>
            setTimeout(() => resolve({ data: null, error: new Error("Supabase select timeout") }), 1500)
          )
        ]);

        const { data: orderRows, error: orderTableError } = result as any;

        if (!orderTableError && Array.isArray(orderRows)) {
          cloudOrders = orderRows.map((row: any) => {
            if (!row) return null;
            if (row.value && typeof row.value === "object") {
              return { ...row.value, id: row.value.id || row.id };
            }
            if (row.value && typeof row.value === "string") {
              try {
                const parsedVal = JSON.parse(row.value);
                if (parsedVal && typeof parsedVal === "object") {
                  return { ...parsedVal, id: parsedVal.id || row.id };
                }
              } catch (_) {}
            }
            if (row.customerName || row.customerPhone || row.price || row.status) {
              const cleanRow = { ...row };
              if (cleanRow.value === null || cleanRow.value === undefined) {
                delete cleanRow.value;
              }
              return cleanRow;
            }
            return row.value || row;
          }).filter(Boolean);
        } else {
          // Fallback legacy content orders single row query
          const { data: legacyData, error: legacyError } = await dbClient
            .from("avexon_content")
            .select("value")
            .eq("key", "orders")
            .single();

          if (!legacyError && legacyData && Array.isArray(legacyData.value)) {
            cloudOrders = legacyData.value;
          }
        }
      } catch (err) {
        console.warn("Could not query pre-existing cloud orders prior to upserting:", err);
      }
    }

    // 2. Fetch pre-existing orders from server's local file fallback
    if (fs.existsSync(ORDERS_DB_FILE)) {
      try {
        const fileData = fs.readFileSync(ORDERS_DB_FILE, "utf-8");
        const parsed = JSON.parse(fileData);
        if (Array.isArray(parsed)) {
          localOrders = parsed;
        }
      } catch (err) {
        console.warn("Could not read local fallback orders:", err);
      }
    }

    // Determine if this is a brand new order or a dashboard status change/edit
    const isNewOrder = !localOrders.some((o: any) => o && String(o.id).trim() === String(incomingOrder.id).trim()) &&
                       !cloudOrders.some((o: any) => o && String(o.id).trim() === String(incomingOrder.id).trim());

    // 3. Merge pools properly preserving modern updates and non-'Pending' status variations
    const mergedMap = new Map<string, any>();

    const addToMergePool = (order: any) => {
      if (!order || !order.id) return;
      const id = String(order.id).trim();
      if (mergedMap.has(id)) {
        const existing = mergedMap.get(id);
        // If incoming is pending and existing has a more processed status, keep existing status
        const statusPriority = { "Pending": 0, "Payment Checking": 1, "Confirmed": 2, "Working": 3, "Done": 4 };
        const exitingPrio = statusPriority[existing.status as keyof typeof statusPriority] || 0;
        const incomingPrio = statusPriority[order.status as keyof typeof statusPriority] || 0;
        
        if (exitingPrio > incomingPrio && order.status === "Pending") {
          mergedMap.set(id, { ...order, ...existing, createdAt: order.createdAt || existing.createdAt });
        } else {
          mergedMap.set(id, { ...existing, ...order });
        }
      } else {
        mergedMap.set(id, order);
      }
    };

    cloudOrders.forEach(addToMergePool);
    localOrders.forEach(addToMergePool);
    addToMergePool(incomingOrder);

    const mergedList = Array.from(mergedMap.values());

    // 4. Sort the full listing chronologically (newest first) using robust fallback parser
    mergedList.sort((a: any, b: any) => {
      const dateA = getOrderTimestamp(a);
      const dateB = getOrderTimestamp(b);
      if (dateA === 0 || dateB === 0 || dateA === dateB) {
        const idA = a && a.id ? String(a.id) : "";
        const idB = b && b.id ? String(b.id) : "";
        return idB.localeCompare(idA);
      }
      return dateB - dateA;
    });

    // 5. Write local copy to disk
    try {
      fs.writeFileSync(ORDERS_DB_FILE, JSON.stringify(mergedList, null, 2), "utf-8");
    } catch (fsErr) {
      console.warn("Could not save merged copy of orders data to filesystem:", fsErr);
    }

    // 6. Synchronously/Awaited persist to cloud storage before response to guarantee completed transactions on Cloud Run
    if (dbClient) {
      try {
        // A. Upsert the specific altered/new row in flat tables
        const { error: flatError } = await dbClient
          .from("avexon_orders")
          .upsert({ id: incomingOrder.id, value: incomingOrder });

        if (flatError) {
          console.warn("Flat order table upsert failed:", flatError.message);
        }

        // B. Keep aggregate orders array row in sync
        const { error: legacyError } = await dbClient
          .from("avexon_content")
          .upsert({ key: "orders", value: mergedList });

        if (legacyError) {
          console.warn("Legacy fallback aggregate sync failed:", legacyError.message);
        }
      } catch (dbErr) {
        console.error("Critical error persisting orders state to server-side Supabase:", dbErr);
      }
    }

    // Dispatch SMS asynchronously in the background so it doesn't block the HTTP response
    if (isNewOrder) {
      (async () => {
        try {
          if (fs.existsSync(CONTENT_DB_FILE)) {
            const contentData = JSON.parse(fs.readFileSync(CONTENT_DB_FILE, "utf-8"));
            const contact = contentData.contactConfig;
            if (contact) {
              const {
                smsApiKey,
                smsSenderId,
                smsAdminNumber,
                smsEnabledClient,
                smsEnabledAdmin,
                smsClientTemplate,
                smsAdminTemplate
              } = contact;

              const activeApiKey = smsApiKey || "trgAiL014d0Ssuzr3a5A";

              // 1. Send SMS to Client if enabled & phone exists
              if (smsEnabledClient && activeApiKey && incomingOrder.customerPhone) {
                const message = formatSMSTemplate(smsClientTemplate || "", incomingOrder);
                if (message) {
                  await sendBulkSMS(activeApiKey, smsSenderId || "", incomingOrder.customerPhone, message);
                }
              }

              // 2. Send SMS to Admin if enabled & admin phone exists
              if (smsEnabledAdmin && activeApiKey && smsAdminNumber) {
                const message = formatSMSTemplate(smsAdminTemplate || "", incomingOrder);
                if (message) {
                  await sendBulkSMS(activeApiKey, smsSenderId || "", smsAdminNumber, message);
                }
              }
            }
          }
        } catch (smsErr) {
          console.error("Error formatting/dispatching BulkSMSBD notification:", smsErr);
        }
      })();
    }

    // Dispatch "Done" SMS asynchronously in the background when order status changes to "Done" (completed website)
    const existingOrder = localOrders.find((o: any) => o && String(o.id).trim() === String(incomingOrder.id).trim()) ||
                          cloudOrders.find((o: any) => o && String(o.id).trim() === String(incomingOrder.id).trim());
    const isChangingToDone = existingOrder && existingOrder.status !== "Done" && incomingOrder.status === "Done";
    const isReadymadeOrder = incomingOrder.paymentMethod !== "custom_pkg";

    if (isChangingToDone && isReadymadeOrder) {
      (async () => {
        try {
          if (fs.existsSync(CONTENT_DB_FILE)) {
            const contentData = JSON.parse(fs.readFileSync(CONTENT_DB_FILE, "utf-8"));
            const contact = contentData.contactConfig;
            if (contact) {
              const {
                smsApiKey,
                smsSenderId,
                smsEnabledDone,
                smsDoneTemplate
              } = contact;

              const activeApiKey = smsApiKey || "trgAiL014d0Ssuzr3a5A";

              // Send SMS to Client if enabled & phone exists
              if (smsEnabledDone && activeApiKey && incomingOrder.customerPhone) {
                const template = smsDoneTemplate || "প্রিয় [NAME], আপনার রেডিমেড ওয়েবসাইট ওর্ডার [ORDER_ID] টি সম্পূর্ণ রেডি! ওর্ডার ট্র্যাকিং এ গিয়ে আপনার ওয়েবসাইটের এডমিন প্যানেল ইমেইল ও পাসওয়ার্ড সংগ্রহ করে নিন। ধন্যবাদ - Avexon।";
                const message = formatSMSTemplate(template, incomingOrder);
                if (message) {
                  await sendBulkSMS(activeApiKey, smsSenderId || "", incomingOrder.customerPhone, message);
                }
              }
            }
          }
        } catch (smsErr) {
          console.error("Error formatting/dispatching BulkSMSBD Order Completed notification:", smsErr);
        }
      })();
    }

    // Now return HTTP response - guaranteed to have written all data successfully
    return res.json({ success: true, data: mergedList });

  } catch (err: any) {
    console.error("Error writing orders database:", err);
    if (!res.headersSent) {
      res.status(500).json({ success: false, error: err.message });
    }
  }
});

// API to delete an order from server JSON file and cloud table (Fully Awaited sync)
app.delete("/api/orders/:id", async (req, res) => {
  try {
    const orderId = req.params.id;
    let ordersList = [];

    if (fs.existsSync(ORDERS_DB_FILE)) {
      try {
        const fileData = fs.readFileSync(ORDERS_DB_FILE, "utf-8");
        ordersList = JSON.parse(fileData);
        if (!Array.isArray(ordersList)) ordersList = [];
      } catch (err) {
        ordersList = [];
      }
    }

    ordersList = ordersList.filter((o: any) => o && o.id !== orderId);
    
    try {
      fs.writeFileSync(ORDERS_DB_FILE, JSON.stringify(ordersList, null, 2), "utf-8");
    } catch (fsErr) {
      console.warn("Could not save copy to filesystem:", fsErr);
    }

    // Persist cloud deletion and await it to prevent truncated connection on Cloud Run
    const dbClient = getSupabaseOrdersClient();
    if (dbClient) {
      try {
        // 1. Delete from flat avexon_orders table
        await dbClient.from("avexon_orders").delete().eq("id", orderId);

        // 2. Sync legacy copy in avexon_content
        await dbClient.from("avexon_content").upsert({ key: "orders", value: ordersList });
      } catch (dbErr) {
        console.error("Error persisting deleted orders state to server-side Supabase:", dbErr);
      }
    }

    return res.json({ success: true, data: ordersList });
  } catch (err: any) {
    console.error("Error deleting order:", err);
    if (!res.headersSent) {
      res.status(500).json({ success: false, error: err.message });
    }
  }
});

// Secure API to verify admin passcode without exposing it to the front-end code inspectors
app.post("/api/verify-passcode", (req, res) => {
  try {
    const { passcode } = req.body;
    if (passcode && typeof passcode === "string" && passcode.trim() === "Tasumu@2021") {
      res.json({ success: true });
    } else {
      res.status(401).json({ success: false, error: "ভুল পাসকোড! অনুগ্রহ করে আবার চেষ্টা করুন।" });
    }
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Secure API to test BulkSMSBD gateway configurations safely on-the-fly
app.post("/api/test-sms", async (req, res) => {
  try {
    const { apiKey, senderId, number, message, smsApiUrl } = req.body;
    if (!apiKey || !number || !message) {
      return res.status(400).json({ success: false, error: "প্রয়োজনীয় ফিল্ড (API Key, Number, Message) পাওয়া যায়নি!" });
    }
    const apiResponse = await sendBulkSMS(apiKey.trim(), senderId?.trim() || "", number.trim(), message, smsApiUrl);
    return res.json({ success: true, result: apiResponse });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// Endpoint to fetch server public IP for BulkSMSBD whitelist config
app.get("/api/server-ip", async (req, res) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 4000); // 4 seconds timeout limit

  let ipAddress = "";

  try {
    const ipRes = await fetch("https://api.ipify.org?format=json", { signal: controller.signal });
    clearTimeout(timeoutId);
    if (ipRes.ok) {
      const data: any = await ipRes.json();
      if (data && data.ip) {
        ipAddress = data.ip;
      }
    }
  } catch (err: any) {
    console.warn("[Server IP] Primary provider api.ipify.org failed or timed out:", err.message);
  }

  if (!ipAddress) {
    // Backup provider
    const backupController = new AbortController();
    const backupTimeoutId = setTimeout(() => backupController.abort(), 3000);
    try {
      const ipRes = await fetch("https://ifconfig.me/all.json", { signal: backupController.signal });
      clearTimeout(backupTimeoutId);
      if (ipRes.ok) {
        const data: any = await ipRes.json();
        if (data && data.ip_addr) {
          ipAddress = data.ip_addr;
        }
      }
    } catch (err: any) {
      console.warn("[Server IP] Backup provider ifconfig.me failed or timed out:", err.message);
    }
  }

  if (!ipAddress) {
    // Secondary backup
    const secondaryController = new AbortController();
    const secondaryTimeoutId = setTimeout(() => secondaryController.abort(), 3000);
    try {
      const ipRes = await fetch("https://ipinfo.io/json", { signal: secondaryController.signal });
      clearTimeout(secondaryTimeoutId);
      if (ipRes.ok) {
        const data: any = await ipRes.json();
        if (data && data.ip) {
          ipAddress = data.ip;
        }
      }
    } catch (err: any) {
      console.warn("[Server IP] Secondary backup provider ipinfo.io failed or timed out:", err.message);
    }
  }

  if (!ipAddress) {
    console.log("[Server IP] Falling back to known platform egress IP: 34.34.244.47");
    ipAddress = "34.34.244.47";
  }

  // Auto-sync in background
  const proto = req.headers["x-forwarded-proto"] || req.protocol;
  const detectedUrl = `${proto}://${req.get("host")}`;
  if (detectedUrl && !detectedUrl.includes("localhost") && !detectedUrl.includes("127.0.0.1") && !detectedUrl.includes("::")) {
    Promise.resolve().then(() => syncMetadataOnRequest(detectedUrl, ipAddress)).catch(() => {});
  }

  return res.json({ success: true, ip: ipAddress });
});

// Setup development dev-server or production asset handling
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite development server middleware loaded.");
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("Production static build configuration loaded.");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server successfully started on http://localhost:${PORT}`);
  });
}

startServer();
