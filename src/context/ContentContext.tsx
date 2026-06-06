import React, { createContext, useContext, useState, useEffect } from "react";
import { WebsiteProduct, Service, PortfolioItem, PortfolioCategory, Testimonial, TeamMember, NoticeItem, NoticeConfig, OfferConfig, ContactConfig, PackagePlan, PromoPopupConfig } from "../types";
import { SERVICES, WEBSITES, PORTFOLIO, TESTIMONIALS, TEAM } from "../data";
import { supabase, isSupabaseConfigured } from "../lib/supabase";
import { safeLocalStorage } from "../utils/safeStorage";

export interface HeroConfig {
  title: string;
  subtitle: string;
  ctaText: string;
  whatsappNumber: string;
}

export interface OwnerConfig {
  name: string;
  role: string;
  title: string;
  picUrl: string;
}

export interface HeaderBrandingConfig {
  brandName: string;
  brandBadge: string;
  brandSubtitle: string;
  fontFamily: string;
  googleFontUrl: string;
  customFontUrl?: string;
  subtitleFontFamily?: string;
  subtitleCustomFontUrl?: string;
  subtitleFontSize?: string;
  loaderText?: string;
}

export interface SectionHeadingsConfig {
  servicesTitle: string;
  servicesSubtitle: string;
  portfolioTitle: string;
  portfolioSubtitle: string;
  websitesTitle: string;
  websitesSubtitle: string;
  customiseTitle: string;
  customiseSubtitle: string;
  whyUsTitle: string;
  whyUsSubtitle: string;
  testimonialsTitle: string;
  testimonialsSubtitle: string;
  teamTitle: string;
  teamSubtitle: string;
  contactTitle: string;
  contactSubtitle: string;
}

interface ContentContextType {
  hero: HeroConfig;
  owner: OwnerConfig;
  services: Service[];
  websites: WebsiteProduct[];
  portfolio: PortfolioItem[];
  portfolioCategories: PortfolioCategory[];
  testimonials: Testimonial[];
  team: TeamMember[];
  logoUrl: string;
  headerBranding: HeaderBrandingConfig;
  noticeConfig: NoticeConfig;
  offerConfig: OfferConfig;
  contactConfig: ContactConfig;
  sectionHeadings: SectionHeadingsConfig;
  customPackagePlans?: Record<string, PackagePlan[]>;
  whyChooseUsStats?: any[];
  whyChooseUsItems?: any[];
  promoPopupConfig: PromoPopupConfig;
  updateHero: (newHero: HeroConfig) => void;
  updateOwner: (newOwner: OwnerConfig) => void;
  updateServices: (newServices: Service[]) => void;
  updateWebsites: (newWebsites: WebsiteProduct[]) => void;
  updatePortfolio: (newPortfolio: PortfolioItem[]) => void;
  updatePortfolioCategories: (newCats: PortfolioCategory[]) => void;
  updateTestimonials: (newTestimonials: Testimonial[]) => void;
  updateTeam: (newTeam: TeamMember[]) => void;
  updateLogoUrl: (url: string) => void;
  updateHeaderBranding: (newBranding: HeaderBrandingConfig) => void;
  updateNoticeConfig: (newNoticeConfig: NoticeConfig) => void;
  updateOfferConfig: (newOfferConfig: OfferConfig) => void;
  updateContactConfig: (newContactConfig: ContactConfig) => void;
  updateSectionHeadings: (newHeadings: SectionHeadingsConfig) => void;
  updateCustomPackagePlans: (newPlans: Record<string, PackagePlan[]>) => void;
  updateWhyChooseUsStats: (newStats: any[]) => void;
  updateWhyChooseUsItems: (newItems: any[]) => void;
  updatePromoPopupConfig: (newPromoConfig: PromoPopupConfig) => void;
  updateMultipleFields: (updates: {
    hero?: HeroConfig;
    owner?: OwnerConfig;
    services?: Service[];
    websites?: WebsiteProduct[];
    portfolio?: PortfolioItem[];
    portfolioCategories?: PortfolioCategory[];
    testimonials?: Testimonial[];
    team?: TeamMember[];
    logoUrl?: string;
    headerBranding?: HeaderBrandingConfig;
    noticeConfig?: NoticeConfig;
    offerConfig?: OfferConfig;
    contactConfig?: ContactConfig;
    sectionHeadings?: SectionHeadingsConfig;
    customPackagePlans?: Record<string, PackagePlan[]>;
    whyChooseUsStats?: any[];
    whyChooseUsItems?: any[];
    promoPopupConfig?: PromoPopupConfig;
  }) => void;
  resetAll: () => void;
  isLoading: boolean;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

// Instant high-performance real-time synchronization channel for cross-tab or cross-iframe updates
const contentSyncChannel = typeof window !== "undefined" && "BroadcastChannel" in window
  ? new BroadcastChannel("avexon_content_sync")
  : null;

const defaultHero: HeroConfig = {
  title: "এভেক্সন (Avexon)",
  subtitle: "আপনার ব্যবসার জন্য প্রফেশনাল ডিজাইন ও ডেভেলপমেন্ট এবং সাশ্রয়ী রেডিমেড ওয়েবসাইট সলিউশন!",
  ctaText: "আজই প্রকল্প শুরু করুন",
  whatsappNumber: "01613911528"
};

const defaultOwner: OwnerConfig = {
  name: "তাহসিন রিজন",
  role: "CEO",
  title: "প্রতিষ্ঠাতা ও লিড ডেভেলপার",
  picUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=350&h=350"
};

const defaultHeaderBranding: HeaderBrandingConfig = {
  brandName: "Avexon",
  brandBadge: "Studio",
  brandSubtitle: "Premium Web Agency",
  fontFamily: "",
  googleFontUrl: "",
  customFontUrl: "",
  subtitleFontFamily: "",
  subtitleCustomFontUrl: "",
  subtitleFontSize: "9px",
  loaderText: "Avexon"
};

const defaultNotices: NoticeItem[] = [
  {
    id: "n-1",
    iconName: "Sparkles",
    text: "যেকোনো কাস্টম বা প্রি-মেড ওয়েবসাইট অর্ডারে পাচ্ছেন ফ্ল্যাট ১০% মেগা ডিসকাউন্ট!",
    badge: "সীমিত সময়ের অফার",
    highlight: "PROMO: AVEXON10"
  },
  {
    id: "n-2",
    iconName: "Flame",
    text: "আমাদের প্রিমিয়াম রেডি-মেড ওয়েবসাইটগুলো মাত্র ৩ থেকে ৫ দিনে সম্পূর্ণ প্রস্তুত ও লাইভ করা হয়।",
    badge: "দ্রুততম ডেলিভারি"
  },
  {
    id: "n-3",
    iconName: "HeartHandshake",
    text: "প্রতিটি ব্রোঞ্জ, সিলভার ও গোল্ড প্রজেক্টের সাথে পাচ্ছেন ১ বছরের ফ্রি প্রিমিয়াম মেইনটেন্যান্স সাপোর্ট।",
    badge: "লাইফটাইম সাপোর্ট"
  },
  {
    id: "n-4",
    iconName: "ShieldCheck",
    text: "bKash, Nagad এবং Rocket পেমেন্ট ভেরিফিকেশন সহ শতভাগ নিরাপদ ও স্বয়ংক্রিয় অর্ডার ম্যানেজমেন্ট!",
    badge: "সিকিউরড"
  },
  {
    id: "n-5",
    iconName: "Clock",
    text: "আপনার বাজেট ও প্রয়োজন অনুযায়ী নিজস্ব ফিচার দিয়ে ওয়েবসাইট প্যাকেজ তৈরি করতে পারেন অত্যন্ত সহজে।",
    badge: "নতুন ফিচার",
    highlight: "কাস্টমাইজেশন"
  }
];

const defaultNoticeConfig: NoticeConfig = {
  show: true,
  notices: defaultNotices
};

const defaultOfferConfig: OfferConfig = {
  show: true,
  badgeText: "আজকের বিশেষ মেগা অফার",
  urgencyText: "দ্রুত ফুরিয়ে যাচ্ছে!",
  descriptionText: "সীমিত সময়ের মেগা ফ্ল্যাশ ডিল শেষ হওয়ার পূর্বেই অর্ডার কনফার্ম করে ওয়েবসাইট ওনারশিপ বুঝে নিন।",
  timerType: "midnight",
  customTargetDate: "",
  discountActive: false,
  discountPercentage: 10
};

const defaultContact: ContactConfig = {
  officeAddress: "লেভেল ৪, রূপায়ন টাওয়ার, কারওয়ান বাজার, ঢাকা-১২১৫",
  helplineNumbers: "+৮৮০ ১৭৬৩-৪৪৫৬৯৯, +৮৮০ ১৮১২-৯৯০১১১",
  officialEmails: "support@avexon.com, info@avexon.com",
  supportHours: "শনিবার থেকে বৃহস্পতিবার, সকাল ১০:০০ টা থেকে রাত ০৮:০০ টা",
  facebookUrl: "https://facebook.com",
  twitterUrl: "https://twitter.com",
  linkedinUrl: "https://linkedin.com",
  githubUrl: "https://github.com",
  bkashNumber: "01613911528",
  nagadNumber: "01613911528",
  instagramUrl: "https://instagram.com",
  whatsappUrl: "https://wa.me/8801613911528",
  smsApiKey: "",
  smsSenderId: "",
  smsAdminNumber: "01613911528",
  smsEnabledClient: false,
  smsEnabledAdmin: false,
  smsClientTemplate: "প্রিয় [NAME], Avexon-এ আপনার অর্ডার [ORDER_ID] সাবমিট হয়েছে। পেমেন্ট চেক করে দ্রুত কাজ শুরু হবে। ধন্যবাদ!",
  smsAdminTemplate: "নতুন অর্ডার এসেছে! ID: [ORDER_ID], ক্লায়েন্ট: [NAME], প্যাকেজ: [PACKAGE], ফোন: [PHONE], মূল্য: [PRICE] TK।",
  smsEnabledDone: false,
  smsDoneTemplate: "প্রিয় [NAME], আপনার রেডিমেড ওয়েবসাইট ওর্ডার [ORDER_ID] টি সম্পূর্ণ রেডি! ওর্ডার ট্র্যাকিং এ গিয়ে আপনার ওয়েবসাইটের এডমিন প্যানেল ইমেইল ও পাসওয়ার্ড সংগ্রহ করে নিন। ধন্যবাদ - Avexon।"
};

export const defaultPortfolioCategories: PortfolioCategory[] = [
  { id: "UI/UX ডিজাইন ও ওয়েব", label: "UI/UX ডিজাইন", active: true, iconName: "Layers" },
  { id: "মোবাইল অ্যাপ", label: "মোবাইল অ্যাপ", active: true, iconName: "Smartphone" },
  { id: "ওয়েব ডেভেলপমেন্ট", label: "ওয়েব ডেভেলপমেন্ট", active: true, iconName: "Code2" },
  { id: "প্রিমিয়াম ই-কমার্স", label: "প্রিমিয়াম ই-কমার্স", active: true, iconName: "ShoppingCart" },
  { id: "কর্পোরেট ওয়েবসাইট", label: "কর্পোরেট ওয়েবসাইট", active: true, iconName: "Briefcase" },
  { id: "মিডিয়া ও ব্লগ পোর্টাল", label: "মিডিয়া ও ব্লগ পোর্টাল", active: true, iconName: "FileText" }
];

const defaultSectionHeadings: SectionHeadingsConfig = {
  servicesTitle: "আমাদের সেবা বিস্তারিত",
  servicesSubtitle: "আমরা আপনাদের জন্য যা যা করে থাকি",
  portfolioTitle: "সফল প্রজেক্ট পোর্টফোলিও",
  portfolioSubtitle: "আমাদের সম্পন্ন করা কাস্টম ও রেডিমেড প্রজেক্ট সমুহ এবং কাজের বাস্তব প্রমাণ",
  websitesTitle: "রেডিমেড ওয়েবসাইট শপ",
  websitesSubtitle: "আপনার পছন্দের ক্যাটাগরির রেডিমেড ওয়েবসাইট মাত্র ৩ দিনে লাইভ করুন",
  customiseTitle: "প্যাকেজ রেডি করুন",
  customiseSubtitle: "আপনার বাজেট ও প্রয়োজনীয় ফিচার সিলেক্ট করে নিজের মতো ওয়েবসাইট প্যাকেজ বানান!",
  whyUsTitle: "কেন Avexon বেছে নিবেন?",
  whyUsSubtitle: "আমরা স্রেফ কোনো সাধারণ টেমপ্লেট কাস্টমাইজেশন সার্ভিস নই। আপনার ব্যবসায়িক রূপান্তর এবং ইউজার এক্সপেরিয়েন্সকে নিখুঁত করতে আমরা সরবরাহ করি বেস্ট-ইন-ক্লাস ডিজিটাল প্রোডাক্টস।",
  testimonialsTitle: "আমাদের সফলতার হিরো ও ক্লায়েন্ট ফিডব্যাক",
  testimonialsSubtitle: "শুধুমাত্র আমাদের কথার ওপর বিশ্বাস করতে হবে না, দেখুন আমাদের প্রিমিয়াম কাস্টম ও রেডিমেড ওয়েবসাইট ক্রেতারা আমাদের সেবা সম্পর্কে কী ডাইরেক্ট মতামত প্রদান করেছেন।",
  teamTitle: "যাঁদের গাইডেন্সে আপনি পথ চলবেন প্রতিদিন",
  teamSubtitle: "লাইভ ক্লাসের প্রতিটি মডিউল এবং রিয়েল ক্লায়েন্ট প্রজেক্টগুলি আমাদের দেশের সেরা অভিজ্ঞ মেন্টর এবং প্রকৌশলীদের দিয়ে ডিরেক্টলি তদারকি করা হয়ে থাকে।",
  contactTitle: "আমাদের সেবা সম্পর্কে আপনার মতামত প্রদান করুন",
  contactSubtitle: "আমাদের প্রিমিয়াম রেডিমেড ওয়েবসাইট বা কাস্টম প্রজেক্ট সেবা আপনার কেমন লেগেছে? আপনার একটি ফিডব্যাক আমাদের আরও নিখুঁত হতে ও অন্যদের অনুপ্রাণিত করতে সাহায্য করবে।"
};

const defaultPromoPopupConfig: PromoPopupConfig = {
  show: true,
  imageUrl: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&q=80&w=600&h=400",
  linkUrl: "https://wa.me/8801613911528",
  buttonText: "আমাদের সাথে কথা বলুন 💬"
};

const defaultWhyChooseUsStats = [
  {
    id: "stat-1",
    value: "১০০% ওনারশিপ",
    label: "হ্যান্ডওভার ও সোর্স কোড গ্যারান্টি",
    iconName: "Code"
  },
  {
    id: "stat-2",
    value: "২৪/৭ সাপোর্ট",
    label: "প্রো-অ্যাক্টিভ মেইনটেইন্যান্স",
    iconName: "Headphones"
  },
  {
    id: "stat-3",
    value: "৩-৭ দিন",
    label: "সুপার ফাস্ট ডেলিভারি টাইমলাইন",
    iconName: "Clock"
  }
];

const defaultWhyChooseUsItems = [
  {
    id: "item-1",
    step: 1,
    title: "হাইপার-পারফর্মিং স্পিড ও কোড অপ্টিমাইজেশন",
    badge: "স্পিড গ্যারান্টি",
    description: "কোনো ভারী এলিমেন্টর বা অতিরিক্ত প্লাগইন স্লাইডিং নয়। আমরা ব্যবহার করি আল্ট্রা-ফাস্ট ও লাইটওয়েট টেকনোলজি যেমন React, Next.js ও Node.js, যার ফলে আপনার সাইট লোড হবে চোখের পলকে এবং গুগল সার্চ র‍্যাংকিংয়ে থাকবে সবার উপরে।",
    iconName: "Zap",
    align: "left"
  },
  {
    id: "item-2",
    step: 2,
    title: "১০০% প্রিমিয়াম ও কাস্টমাইজড ইউজার ইন্টারফেস",
    badge: "টেইলার্ড ইউএক্স",
    description: "আপনার ব্যবসার ব্রান্ড কালার ও টার্গেটেড অডিয়েন্সকে ফোকাস করে আমরা সম্পূর্ণ স্ক্র্যাচ থেকে ইউনিক ওয়েবসাইট স্ট্রাকচার ডিজাইন করি। আপনার কাস্টমারদের জন্য কেনাকাটা বা ব্রাউজিং অভিজ্ঞতা হবে অত্যন্ত সহজ ও প্রফেশনাল।",
    iconName: "Cpu",
    align: "right"
  },
  {
    id: "item-3",
    step: 3,
    title: "স্মার্ট পেমেন্ট গেটওয়ে ও নোটিফিকেশন অটোমেশন",
    badge: "কমপ্লিট অটোমেশন",
    description: "বিকাশ, রকেট, নগদসহ যেকোনো লোকাল ও ইন্টারন্যাশনাল পেমেন্ট গেটওয়ে এবং অটো এসএমএস ও ইমেইল এলার্ট ইন্টিগ্রেশন। সাথে পাচ্ছেন অত্যন্ত সহজ ও বাংলায় ডাইনামিক এডমিন ড্যাশবোর্ড, যা কোডিং জানা ছাড়াই কন্ট্রোল করতে পারবেন।",
    iconName: "CircleDollarSign",
    align: "left"
  },
  {
    id: "item-4",
    step: 4,
    title: "মালওয়্যার সুরক্ষা ও উইকলি অটো ব্যাকআপ",
    badge: "সিকিউরিটি প্রো",
    description: "আমাদের তৈরি প্রতিটি সাইট মালওয়্যার ও ডিডোস (DDoS) প্রটেকশনসহ সম্পূর্ণ সুরক্ষিত থাকে। আমরা ক্লাউডফ্লেয়ার সেটআপ এবং যেকোনো যান্ত্রিক ক্র্যাশ বা হ্যাকিং রিস্ক এড়াতে প্রতি সপ্তাহে ক্লাউড ড্রাইভে অটো ব্যাকআপ নিশ্চিত করি।",
    iconName: "ShieldCheck",
    align: "right"
  },
  {
    id: "item-5",
    step: 5,
    title: "২৪/৭ ডেডিকেটেড পিচ-পারফেক্ট কাস্টমার সাপোর্ট",
    badge: "লাইভ কেয়ার",
    description: "ওয়েবসাইট ডেলিভারি দেওয়ার পরও যেকোনো জরুরি সাহায্য বা মেইনটেইন্যান্স ইস্যুতে আমাদের ডেডিকেটেড ইঞ্জিনিয়ার টিম প্রস্তুত থাকে। কোনো কল বা মেসেজ পেন্ডিং থাকবে না, আমরা লাইভ সেশনের মাধ্যমে সাথে সাথে সমাধান প্রদান করি।",
    iconName: "Activity",
    align: "left"
  }
];

const safeGetLocalStorage = <T,>(key: string, defaultValue: T): T => {
  try {
    const stored = safeLocalStorage.getItem(key);
    if (stored) {
      if (typeof defaultValue === "string" && !stored.startsWith("{") && !stored.startsWith("[")) {
        return stored as unknown as T;
      }
      const parsed = JSON.parse(stored);
      if (Array.isArray(defaultValue) && !Array.isArray(parsed)) {
        return defaultValue;
      }
      return parsed as T;
    }
  } catch (e) {
    console.warn("Error reading from safeLocalStorage:", e);
  }
  return defaultValue;
};

export function ContentProvider({ children }: { children: React.ReactNode }) {
  const [hero, setHeroConfig] = useState<HeroConfig>(() => safeGetLocalStorage("avx_c_hero", defaultHero));
  const [owner, setOwner] = useState<OwnerConfig>(() => safeGetLocalStorage("avx_c_owner", defaultOwner));
  const [services, setServices] = useState<Service[]>(() => safeGetLocalStorage("avx_c_services", SERVICES));
  const [websites, setWebsites] = useState<WebsiteProduct[]>(() => safeGetLocalStorage("avx_c_websites", WEBSITES));
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>(() => safeGetLocalStorage("avx_c_portfolio", PORTFOLIO));
  const [portfolioCategories, setPortfolioCategories] = useState<PortfolioCategory[]>(() => safeGetLocalStorage("avx_c_portfolio_categories", defaultPortfolioCategories));
  const [testimonials, setTestimonials] = useState<Testimonial[]>(() => safeGetLocalStorage("avx_c_testimonials", TESTIMONIALS));
  const [team, setTeam] = useState<TeamMember[]>(() => safeGetLocalStorage("avx_c_team", TEAM));
  const [logoUrl, setLogoUrl] = useState<string>(() => safeGetLocalStorage("avx_c_logo", "https://www.image2url.com/r2/default/images/1780210596854-d50e17fe-f288-45b0-8d70-5a0cb736b9be.jpeg"));
  const [headerBranding, setHeaderBranding] = useState<HeaderBrandingConfig>(() => safeGetLocalStorage("avx_c_header_branding", defaultHeaderBranding));
  const [noticeConfig, setNoticeConfig] = useState<NoticeConfig>(() => safeGetLocalStorage("avx_c_notice", defaultNoticeConfig));
  const [offerConfig, setOfferConfig] = useState<OfferConfig>(() => safeGetLocalStorage("avx_c_offer", defaultOfferConfig));
  const [contactConfig, setContactConfig] = useState<ContactConfig>(() => safeGetLocalStorage("avx_c_contact", defaultContact));
  const [sectionHeadings, setSectionHeadings] = useState<SectionHeadingsConfig>(() => safeGetLocalStorage("avx_c_headings", defaultSectionHeadings));
  const [customPackagePlans, setCustomPackagePlans] = useState<Record<string, PackagePlan[]> | undefined>(() => safeGetLocalStorage("avx_c_package_plans", undefined));
  const [whyChooseUsStats, setWhyChooseUsStats] = useState<any[]>(() => safeGetLocalStorage("avx_c_why_choose_us_stats", defaultWhyChooseUsStats));
  const [whyChooseUsItems, setWhyChooseUsItems] = useState<any[]>(() => safeGetLocalStorage("avx_c_why_choose_us_items", defaultWhyChooseUsItems));
  const [promoPopupConfig, setPromoPopupConfig] = useState<PromoPopupConfig>(() => safeGetLocalStorage("avx_c_promo_popup", defaultPromoPopupConfig));
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const lastSavedTime = React.useRef<number>(0);
  const activeChannelRef = React.useRef<any>(null);

  // Master local storage caching synchronizer
  const updateLocalCache = (updates: Record<string, any>) => {
    const cacheKeyMap: Record<string, string> = {
      hero: "avx_c_hero",
      owner: "avx_c_owner",
      services: "avx_c_services",
      websites: "avx_c_websites",
      portfolio: "avx_c_portfolio",
      portfolioCategories: "avx_c_portfolio_categories",
      testimonials: "avx_c_testimonials",
      team: "avx_c_team",
      logoUrl: "avx_c_logo",
      headerBranding: "avx_c_header_branding",
      noticeConfig: "avx_c_notice",
      offerConfig: "avx_c_offer",
      contactConfig: "avx_c_contact",
      sectionHeadings: "avx_c_headings",
      customPackagePlans: "avx_c_package_plans",
      whyChooseUsStats: "avx_c_why_choose_us_stats",
      whyChooseUsItems: "avx_c_why_choose_us_items",
      promoPopupConfig: "avx_c_promo_popup"
    };

    Object.entries(updates).forEach(([key, val]) => {
      const cacheKey = cacheKeyMap[key];
      if (cacheKey && val !== undefined) {
        try {
          if (typeof val === "string" && key === "logoUrl") {
            safeLocalStorage.setItem(cacheKey, val);
          } else {
            safeLocalStorage.setItem(cacheKey, JSON.stringify(val));
          }
        } catch (e) {
          console.warn(`Error writing cache for ${key}:`, e);
        }
      }
    });
  };

  // Load from Supabase (or fallback local JSON DB) with localStorage as offline fallback
  useEffect(() => {
    let subscription: { unsubscribe: () => void } | null = null;
    let safetyTimer: any = null;

    const fetchInitialData = async () => {
      const startTime = Date.now();
      // Force loading screen until fresh data is resolved, with an extended 7000ms safety limit
      setIsLoading(true);
      safetyTimer = setTimeout(() => {
        setIsLoading(false);
      }, 7000);

      // Helper function to retry relative API fetches to allow container startup
      const fetchWithRetry = async (url: string, retries = 4, delayMs = 1200): Promise<any> => {
        for (let i = 0; i < retries; i++) {
          try {
            const res = await fetch(url);
            if (res.ok) {
              const data = await res.json();
              if (data && data.success && data.data) {
                return data.data;
              }
            }
          } catch (e) {
            console.warn(`[Content Fetch] Try ${i + 1} failed for ${url}:`, e);
          }
          if (i < retries - 1) {
            await new Promise((resolve) => setTimeout(resolve, delayMs));
          }
        }
        throw new Error(`Failed to fetch from ${url} after ${retries} retries`);
      };

      try {
        let loadedData: any = null;

        // Step 1: Query Supabase Content Database as the high-priority persistent source
        if (isSupabaseConfigured && supabase) {
          try {
            console.log("[Content DB] Primary load: fetching initial data from Supabase...");
            const { data: dbData, error } = await supabase
              .from("avexon_content")
              .select("*");

            if (!error && dbData && dbData.length > 0) {
              const dbMap: Record<string, any> = {};
              dbData.forEach((row: any) => {
                dbMap[row.key] = row.value;
              });
              loadedData = dbMap;
            } else if (error) {
              console.warn("[Content DB] Supabase table query failed, falling back to Express API endpoint:", error.message);
            } else {
              // Seeding phase: Supabase table exists but is empty, so let's push existing default parameters
              console.log("[Content DB] Supabase table empty, running automatic database seed...");
              const defaultsToSeed: Record<string, any> = {
                hero: defaultHero,
                owner: defaultOwner,
                services: SERVICES,
                websites: WEBSITES,
                portfolio: PORTFOLIO,
                portfolioCategories: defaultPortfolioCategories,
                testimonials: TESTIMONIALS,
                team: TEAM,
                logoUrl: "https://www.image2url.com/r2/default/images/1780210596854-d50e17fe-f288-45b0-8d70-5a0cb736b9be.jpeg",
                headerBranding: defaultHeaderBranding,
                noticeConfig: defaultNoticeConfig,
                offerConfig: defaultOfferConfig,
                contactConfig: defaultContact,
                sectionHeadings: defaultSectionHeadings,
                whyChooseUsStats: defaultWhyChooseUsStats,
                whyChooseUsItems: defaultWhyChooseUsItems,
                promoPopupConfig: defaultPromoPopupConfig,
              };

              const seedPromises = Object.entries(defaultsToSeed).map(([k, v]) => {
                return supabase.from("avexon_content").upsert({ key: k, value: v });
              });
              await Promise.all(seedPromises);
              loadedData = defaultsToSeed;
            }
          } catch (supabaseCrash: any) {
            console.warn("[Content DB] Exception during Supabase initialization/fetch:", supabaseCrash.message);
          }
        }

        // Step 2: Fallback to local server API (Express JSON DB) if Supabase is offline or empty.
        // We use explicit retries to cleanly withstand backend cold starts!
        if (!loadedData) {
          try {
            console.log("[Content DB] Fallback load: Querying Express endpoint with auto-retries for container cold-start...");
            loadedData = await fetchWithRetry(`/api/content?t=${Date.now()}`, 4, 1200);
          } catch (expressError: any) {
            console.warn("[Content DB] All active server network queries failed. Fallback to localStorage.", expressError);
          }
        }

        // Step 3: Hydrate our states and cache to localStorage
        if (loadedData) {
          console.log("[Content DB] Successfully loaded database content state!", loadedData);
          if (loadedData.hero) setHeroConfig(loadedData.hero);
          if (loadedData.owner) setOwner(loadedData.owner);
          if (loadedData.services) setServices(loadedData.services);
          if (loadedData.websites) setWebsites(loadedData.websites);
          if (loadedData.portfolio) setPortfolio(loadedData.portfolio);
          if (loadedData.portfolioCategories) setPortfolioCategories(loadedData.portfolioCategories);
          if (loadedData.testimonials) setTestimonials(loadedData.testimonials);
          if (loadedData.team) setTeam(loadedData.team);
          if (loadedData.logoUrl) setLogoUrl(loadedData.logoUrl);
          if (loadedData.headerBranding) setHeaderBranding(loadedData.headerBranding);
          if (loadedData.noticeConfig) setNoticeConfig(loadedData.noticeConfig);
          if (loadedData.offerConfig) setOfferConfig(loadedData.offerConfig);
          if (loadedData.contactConfig) setContactConfig(loadedData.contactConfig);
          if (loadedData.sectionHeadings) setSectionHeadings(loadedData.sectionHeadings);
          if (loadedData.customPackagePlans) setCustomPackagePlans(loadedData.customPackagePlans);
          if (loadedData.whyChooseUsStats) setWhyChooseUsStats(loadedData.whyChooseUsStats);
          if (loadedData.whyChooseUsItems) setWhyChooseUsItems(loadedData.whyChooseUsItems);
          if (loadedData.promoPopupConfig) setPromoPopupConfig(loadedData.promoPopupConfig);

          // Automatically extract and cache any saved backend URL and server IP (from Supabase/Express) inside browser localStorage
          if (loadedData.backendUrl) {
            safeLocalStorage.setItem("avexon_api_backend_url", loadedData.backendUrl);
            if (typeof window !== "undefined") {
              (window as any).__avexon_active_backend_url = loadedData.backendUrl;
              window.dispatchEvent(new Event("storage"));
            }
          }
          if (loadedData.serverIp) {
            safeLocalStorage.setItem("avexon_api_server_ip", loadedData.serverIp);
          }

          updateLocalCache(loadedData);
        } else {
          // Absolute offline/failure fallback: hydrate states using browser local storage properties
          console.log("[Content DB] Offline Fallback: Extracting cache states from client localStorage...");
          const storedHero = safeLocalStorage.getItem("avx_c_hero");
          const storedOwner = safeLocalStorage.getItem("avx_c_owner");
          const storedServices = safeLocalStorage.getItem("avx_c_services");
          const storedWebsites = safeLocalStorage.getItem("avx_c_websites");
          const storedPortfolio = safeLocalStorage.getItem("avx_c_portfolio");
          const storedCats = safeLocalStorage.getItem("avx_c_portfolio_categories");
          if (storedCats) setPortfolioCategories(JSON.parse(storedCats));
          const storedTestimonials = safeLocalStorage.getItem("avx_c_testimonials");
          const storedTeam = safeLocalStorage.getItem("avx_c_team");
          const storedLogo = safeLocalStorage.getItem("avx_c_logo");
          const storedBranding = safeLocalStorage.getItem("avx_c_header_branding");
          const storedNotice = safeLocalStorage.getItem("avx_c_notice");
          const storedOffer = safeLocalStorage.getItem("avx_c_offer");
          const storedContact = safeLocalStorage.getItem("avx_c_contact");
          const storedHeadings = safeLocalStorage.getItem("avx_c_headings");
          const storedPackagePlans = safeLocalStorage.getItem("avx_c_package_plans");
          const storedWhyChooseUsStats = safeLocalStorage.getItem("avx_c_why_choose_us_stats");
          const storedWhyChooseUsItems = safeLocalStorage.getItem("avx_c_why_choose_us_items");
          const storedPromoPopup = safeLocalStorage.getItem("avx_c_promo_popup");

          if (storedHero) setHeroConfig(JSON.parse(storedHero));
          if (storedOwner) setOwner(JSON.parse(storedOwner));
          if (storedServices) setServices(JSON.parse(storedServices));
          if (storedWebsites) setWebsites(JSON.parse(storedWebsites));
          if (storedPortfolio) setPortfolio(JSON.parse(storedPortfolio));
          if (storedTestimonials) setTestimonials(JSON.parse(storedTestimonials));
          if (storedTeam) setTeam(JSON.parse(storedTeam));
          if (storedLogo) setLogoUrl(storedLogo);
          if (storedBranding) setHeaderBranding(JSON.parse(storedBranding));
          if (storedNotice) setNoticeConfig(JSON.parse(storedNotice));
          if (storedOffer) setOfferConfig(JSON.parse(storedOffer));
          if (storedContact) setContactConfig(JSON.parse(storedContact));
          if (storedHeadings) setSectionHeadings(JSON.parse(storedHeadings));
          if (storedPackagePlans) setCustomPackagePlans(JSON.parse(storedPackagePlans));
          if (storedWhyChooseUsStats) setWhyChooseUsStats(JSON.parse(storedWhyChooseUsStats));
          if (storedWhyChooseUsItems) setWhyChooseUsItems(JSON.parse(storedWhyChooseUsItems));
          if (storedPromoPopup) setPromoPopupConfig(JSON.parse(storedPromoPopup));
        }

        // Setup real-time postgres and broadcast subscription if Supabase was running
        if (isSupabaseConfigured && supabase) {
          const liveChan = supabase.channel("avexon_content_realtime");
          activeChannelRef.current = liveChan;
          subscription = liveChan
            .on(
              "postgres_changes",
              { event: "*", schema: "public", table: "avexon_content" },
              (payload: any) => {
                if (payload.eventType === "DELETE") return;
                const { key, value } = payload.new || {};
                if (!key) return;

                switch (key) {
                  case "hero": setHeroConfig(value); break;
                  case "owner": setOwner(value); break;
                  case "services": setServices(value); break;
                  case "websites": setWebsites(value); break;
                  case "portfolio": setPortfolio(value); break;
                  case "portfolioCategories": setPortfolioCategories(value); break;
                  case "testimonials": setTestimonials(value); break;
                  case "team": setTeam(value); break;
                  case "logoUrl": setLogoUrl(value); break;
                  case "headerBranding": setHeaderBranding(value); break;
                  case "noticeConfig": setNoticeConfig(value); break;
                  case "offerConfig": setOfferConfig(value); break;
                  case "contactConfig": setContactConfig(value); break;
                  case "sectionHeadings": setSectionHeadings(value); break;
                  case "customPackagePlans": setCustomPackagePlans(value); break;
                  case "whyChooseUsStats": setWhyChooseUsStats(value); break;
                  case "whyChooseUsItems": setWhyChooseUsItems(value); break;
                  case "promoPopupConfig": setPromoPopupConfig(value); break;
                  case "backendUrl": {
                    safeLocalStorage.setItem("avexon_api_backend_url", value);
                    if (typeof window !== "undefined") {
                      (window as any).__avexon_active_backend_url = value;
                      window.dispatchEvent(new Event("storage"));
                    }
                    break;
                  }
                  case "serverIp": {
                    safeLocalStorage.setItem("avexon_api_server_ip", value);
                    break;
                  }
                }
              }
            )
            .on(
              "broadcast",
              { event: "content_updated" },
              (response: any) => {
                const updates = response.payload;
                if (updates && typeof updates === "object") {
                  console.log("Received instant content broadcast updates:", updates);
                  if (updates.hero !== undefined) setHeroConfig(updates.hero);
                  if (updates.owner !== undefined) setOwner(updates.owner);
                  if (updates.services !== undefined) setServices(updates.services);
                  if (updates.websites !== undefined) setWebsites(updates.websites);
                  if (updates.portfolio !== undefined) setPortfolio(updates.portfolio);
                  if (updates.portfolioCategories !== undefined) setPortfolioCategories(updates.portfolioCategories);
                  if (updates.testimonials !== undefined) setTestimonials(updates.testimonials);
                  if (updates.team !== undefined) setTeam(updates.team);
                  if (updates.logoUrl !== undefined) setLogoUrl(updates.logoUrl);
                  if (updates.headerBranding !== undefined) setHeaderBranding(updates.headerBranding);
                  if (updates.noticeConfig !== undefined) setNoticeConfig(updates.noticeConfig);
                  if (updates.offerConfig !== undefined) setOfferConfig(updates.offerConfig);
                  if (updates.contactConfig !== undefined) setContactConfig(updates.contactConfig);
                  if (updates.sectionHeadings !== undefined) setSectionHeadings(updates.sectionHeadings);
                  if (updates.customPackagePlans !== undefined) setCustomPackagePlans(updates.customPackagePlans);
                  if (updates.whyChooseUsStats !== undefined) setWhyChooseUsStats(updates.whyChooseUsStats);
                  if (updates.whyChooseUsItems !== undefined) setWhyChooseUsItems(updates.whyChooseUsItems);
                  if (updates.promoPopupConfig !== undefined) setPromoPopupConfig(updates.promoPopupConfig);
                  if (updates.backendUrl !== undefined) {
                    safeLocalStorage.setItem("avexon_api_backend_url", updates.backendUrl);
                    if (typeof window !== "undefined") {
                      (window as any).__avexon_active_backend_url = updates.backendUrl;
                      window.dispatchEvent(new Event("storage"));
                    }
                  }
                  if (updates.serverIp !== undefined) {
                    safeLocalStorage.setItem("avexon_api_server_ip", updates.serverIp);
                  }
                }
              }
            )
            .subscribe((status) => {
              console.log("[Content DB] Supabase realtime active channel subscription status:", status);
            });
        }
      } catch (e) {
        console.warn("Critical block failure inside fetchInitialData:", e);
      } finally {
        if (safetyTimer) clearTimeout(safetyTimer);
        
        // Guarantee a minimum loading time of 1400ms to allow React's virtual DOM and assets/fonts to settle beautifully.
        // This completely eliminates and shields the user from any split-second blank page or default template flickering.
        const elapsed = Date.now() - startTime;
        const minDuration = 1400;
        if (elapsed < minDuration) {
          setTimeout(() => {
            setIsLoading(false);
          }, minDuration - elapsed);
        } else {
          setIsLoading(false);
        }
      }
    };

    fetchInitialData();

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, []);

  // Live synchronization: reload the data when storage changes, window focus is received, or via periodic 2-second polling
  useEffect(() => {
    const refreshContentSilently = async () => {
      if (Date.now() - lastSavedTime.current < 5000) {
        return;
      }
      try {
        let freshData: any = null;

        // On static hosting like Netlify, fetch from Supabase first as it has CORS enabled and avoids relative domain issues
        if (isSupabaseConfigured && supabase) {
          try {
            const { data: dbData, error } = await supabase
              .from("avexon_content")
              .select("*");
            if (!error && dbData && dbData.length > 0) {
              const dbMap: Record<string, any> = {};
              dbData.forEach((row: any) => {
                dbMap[row.key] = row.value;
              });
              freshData = dbMap;
            }
          } catch (_) {}
        }

        // Otherwise (or as a fallback), poll the Express JSON server API
        if (!freshData) {
          const response = await fetch(`/api/content?t=${Date.now()}`);
          if (response.ok) {
            const resJson = await response.json();
            if (resJson.success && resJson.data) {
              freshData = resJson.data;
            }
          }
        }

        if (freshData) {
          const d = freshData;
          if (d.hero) setHeroConfig(d.hero);
          if (d.owner) setOwner(d.owner);
          if (d.services && Array.isArray(d.services)) setServices(d.services);
          if (d.websites && Array.isArray(d.websites)) setWebsites(d.websites);
          if (d.portfolio && Array.isArray(d.portfolio)) setPortfolio(d.portfolio);
          if (d.portfolioCategories && Array.isArray(d.portfolioCategories)) setPortfolioCategories(d.portfolioCategories);
          if (d.testimonials && Array.isArray(d.testimonials)) setTestimonials(d.testimonials);
          if (d.team && Array.isArray(d.team)) setTeam(d.team);
          if (d.logoUrl) setLogoUrl(d.logoUrl);
          if (d.headerBranding) setHeaderBranding(d.headerBranding);
          if (d.noticeConfig) setNoticeConfig(d.noticeConfig);
          if (d.offerConfig) setOfferConfig(d.offerConfig);
          if (d.contactConfig) setContactConfig(d.contactConfig);
          if (d.sectionHeadings) setSectionHeadings(d.sectionHeadings);
          if (d.customPackagePlans) setCustomPackagePlans(d.customPackagePlans);
          if (d.whyChooseUsStats) setWhyChooseUsStats(d.whyChooseUsStats);
          if (d.whyChooseUsItems) setWhyChooseUsItems(d.whyChooseUsItems);
          if (d.promoPopupConfig) setPromoPopupConfig(d.promoPopupConfig);

          // Caching metadata if loaded
          if (d.backendUrl) {
            safeLocalStorage.setItem("avexon_api_backend_url", d.backendUrl);
            if (typeof window !== "undefined") {
              (window as any).__avexon_active_backend_url = d.backendUrl;
            }
          }
          if (d.serverIp) {
            safeLocalStorage.setItem("avexon_api_server_ip", d.serverIp);
          }

          updateLocalCache(freshData);
        }
      } catch (e) {
        // Silent catch for stable client flow
      }
    };

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "avexon_content_last_updated" || e.key?.startsWith("avx_c_")) {
        refreshContentSilently();
      }
    };

    const handleFocus = () => {
      refreshContentSilently();
    };

    // Instant cross-tab sync message handler via BroadcastChannel
    const handleBroadcastMessage = (event: MessageEvent) => {
      const updates = event.data;
      if (updates && typeof updates === "object") {
        console.log("Instant cross-tab broadcast update received:", updates);
        if (updates.hero !== undefined) setHeroConfig(updates.hero);
        if (updates.owner !== undefined) setOwner(updates.owner);
        if (updates.services !== undefined && Array.isArray(updates.services)) setServices(updates.services);
        if (updates.websites !== undefined && Array.isArray(updates.websites)) setWebsites(updates.websites);
        if (updates.portfolio !== undefined && Array.isArray(updates.portfolio)) setPortfolio(updates.portfolio);
        if (updates.portfolioCategories !== undefined && Array.isArray(updates.portfolioCategories)) setPortfolioCategories(updates.portfolioCategories);
        if (updates.testimonials !== undefined && Array.isArray(updates.testimonials)) setTestimonials(updates.testimonials);
        if (updates.team !== undefined && Array.isArray(updates.team)) setTeam(updates.team);
        if (updates.logoUrl !== undefined) setLogoUrl(updates.logoUrl);
        if (updates.headerBranding !== undefined) setHeaderBranding(updates.headerBranding);
        if (updates.noticeConfig !== undefined) setNoticeConfig(updates.noticeConfig);
        if (updates.offerConfig !== undefined) setOfferConfig(updates.offerConfig);
        if (updates.contactConfig !== undefined) setContactConfig(updates.contactConfig);
        if (updates.sectionHeadings !== undefined) setSectionHeadings(updates.sectionHeadings);
        if (updates.customPackagePlans !== undefined) setCustomPackagePlans(updates.customPackagePlans);
        if (updates.whyChooseUsStats !== undefined) setWhyChooseUsStats(updates.whyChooseUsStats);
        if (updates.whyChooseUsItems !== undefined) setWhyChooseUsItems(updates.whyChooseUsItems);
        if (updates.promoPopupConfig !== undefined) setPromoPopupConfig(updates.promoPopupConfig);

        updateLocalCache(updates);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("focus", handleFocus);
    contentSyncChannel?.addEventListener("message", handleBroadcastMessage);

    // Also poll every 2 seconds for active instant preview updates
    const pollInterval = setInterval(() => {
      refreshContentSilently();
    }, 2000);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("focus", handleFocus);
      contentSyncChannel?.removeEventListener("message", handleBroadcastMessage);
      clearInterval(pollInterval);
    };
  }, []);

  // Save changes to the server backend JSON database
  const saveStateToServer = async (updates: {
    hero?: HeroConfig;
    owner?: OwnerConfig;
    services?: Service[];
    websites?: WebsiteProduct[];
    portfolio?: PortfolioItem[];
    portfolioCategories?: PortfolioCategory[];
    testimonials?: Testimonial[];
    team?: TeamMember[];
    logoUrl?: string;
    headerBranding?: HeaderBrandingConfig;
    noticeConfig?: NoticeConfig;
    offerConfig?: OfferConfig;
    contactConfig?: ContactConfig;
    sectionHeadings?: SectionHeadingsConfig;
    customPackagePlans?: Record<string, PackagePlan[]>;
    whyChooseUsStats?: any[];
    whyChooseUsItems?: any[];
    promoPopupConfig?: PromoPopupConfig;
  }) => {
    lastSavedTime.current = Date.now();
    try {
      const payload = {
        hero: updates.hero !== undefined ? updates.hero : hero,
        owner: updates.owner !== undefined ? updates.owner : owner,
        services: updates.services !== undefined ? updates.services : services,
        websites: updates.websites !== undefined ? updates.websites : websites,
        portfolio: updates.portfolio !== undefined ? updates.portfolio : portfolio,
        portfolioCategories: updates.portfolioCategories !== undefined ? updates.portfolioCategories : portfolioCategories,
        testimonials: updates.testimonials !== undefined ? updates.testimonials : testimonials,
        team: updates.team !== undefined ? updates.team : team,
        logoUrl: updates.logoUrl !== undefined ? updates.logoUrl : logoUrl,
        headerBranding: updates.headerBranding !== undefined ? updates.headerBranding : headerBranding,
        noticeConfig: updates.noticeConfig !== undefined ? updates.noticeConfig : noticeConfig,
        offerConfig: updates.offerConfig !== undefined ? updates.offerConfig : offerConfig,
        contactConfig: updates.contactConfig !== undefined ? updates.contactConfig : contactConfig,
        sectionHeadings: updates.sectionHeadings !== undefined ? updates.sectionHeadings : sectionHeadings,
        customPackagePlans: updates.customPackagePlans !== undefined ? updates.customPackagePlans : customPackagePlans,
        whyChooseUsStats: updates.whyChooseUsStats !== undefined ? updates.whyChooseUsStats : whyChooseUsStats,
        whyChooseUsItems: updates.whyChooseUsItems !== undefined ? updates.whyChooseUsItems : whyChooseUsItems,
        promoPopupConfig: updates.promoPopupConfig !== undefined ? updates.promoPopupConfig : promoPopupConfig,
      };

      // Always write to JSON backup server file (only passing the actual updates to prevent state-race-condition overwrites)
      try {
        await fetch("/api/content", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updates)
        });
      } catch (backupErr) {
        console.warn("[Content Sync] Express backend fallback is currently offline or unreachable. Saving directly to primary Supabase storage instead.", backupErr);
      }

      // Synchronously emit live signal timestamp in localStorage for cross-tab preview
      safeLocalStorage.setItem("avexon_content_last_updated", Date.now().toString());

      // Synchronously broadcast updates over the BroadcastChannel to sync other open tabs/frames immediately
      contentSyncChannel?.postMessage(updates);

      // Synchronously write each updated key to Supabase so socket server broadcasts to other listeners instantly
      if (isSupabaseConfigured && supabase) {
        const promises = Object.entries(updates).map(async ([key, value]) => {
          if (value !== undefined) {
            const { error } = await supabase.from("avexon_content").upsert({ key, value });
            if (error) {
              console.error(`Error saving content key "${key}" to Supabase:`, error);
            } else {
              console.log(`Saved content key "${key}" to Supabase successfully.`);
            }
          }
        });
        await Promise.all(promises);

        // Also broadcast the update signal directly over the websocket channel for ultra-responsive, zero-lag rendering
        try {
          const chan = activeChannelRef.current || supabase.channel("avexon_content_realtime");
          if (!activeChannelRef.current) {
            chan.subscribe();
          }
          await chan.send({
            type: "broadcast",
            event: "content_updated",
            payload: updates
          });
          console.log("Broadcasted content edits across custom channel successfully:", updates);
        } catch (be) {
          console.warn("Realtime broadcast send failed:", be);
        }
      }
    } catch (e) {
      console.warn("Could not save content state to server: ", e);
    }
  };


  // Dynamically inject custom Google Font link if googleFontUrl is provided
  useEffect(() => {
    const fontId = "dynamic-branding-google-font";
    let existingLink = document.getElementById(fontId) as HTMLLinkElement | null;

    if (headerBranding.googleFontUrl) {
      if (existingLink) {
        existingLink.href = headerBranding.googleFontUrl;
      } else {
        const link = document.createElement("link");
        link.id = fontId;
        link.rel = "stylesheet";
        link.href = headerBranding.googleFontUrl;
        document.head.appendChild(link);
      }
    } else {
      if (existingLink) {
        existingLink.remove();
      }
    }
  }, [headerBranding.googleFontUrl]);

  // Dynamically inject custom uploaded font style if customFontUrl is provided
  useEffect(() => {
    const styleId = "dynamic-branding-custom-font";
    let existingStyle = document.getElementById(styleId) as HTMLStyleElement | null;

    if (headerBranding.customFontUrl) {
      const cssRule = `
        @font-face {
          font-family: 'CustomUploadedFont';
          src: url('${headerBranding.customFontUrl}');
          font-display: swap;
        }
      `;
      if (existingStyle) {
        existingStyle.textContent = cssRule;
      } else {
        const style = document.createElement("style");
        style.id = styleId;
        style.textContent = cssRule;
        document.head.appendChild(style);
      }
    } else {
      if (existingStyle) {
        existingStyle.remove();
      }
    }
  }, [headerBranding.customFontUrl]);

  // Dynamically inject custom uploaded subtitle font style if subtitleCustomFontUrl is provided
  useEffect(() => {
    const styleId = "dynamic-branding-custom-subtitle-font";
    let existingStyle = document.getElementById(styleId) as HTMLStyleElement | null;

    if (headerBranding.subtitleCustomFontUrl) {
      const cssRule = `
        @font-face {
          font-family: 'CustomUploadedSubtitleFont';
          src: url('${headerBranding.subtitleCustomFontUrl}');
          font-display: swap;
        }
      `;
      if (existingStyle) {
        existingStyle.textContent = cssRule;
      } else {
        const style = document.createElement("style");
        style.id = styleId;
        style.textContent = cssRule;
        document.head.appendChild(style);
      }
    } else {
      if (existingStyle) {
        existingStyle.remove();
      }
    }
  }, [headerBranding.subtitleCustomFontUrl]);

  const updateHero = (newHero: HeroConfig) => {
    setHeroConfig(newHero);
    safeLocalStorage.setItem("avx_c_hero", JSON.stringify(newHero));
    saveStateToServer({ hero: newHero });
  };

  const updateOwner = (newOwner: OwnerConfig) => {
    setOwner(newOwner);
    safeLocalStorage.setItem("avx_c_owner", JSON.stringify(newOwner));
    saveStateToServer({ owner: newOwner });
  };

  const updateServices = (newServices: Service[]) => {
    setServices(newServices);
    safeLocalStorage.setItem("avx_c_services", JSON.stringify(newServices));
    saveStateToServer({ services: newServices });
  };

  const updateWebsites = (newWebsites: WebsiteProduct[]) => {
    setWebsites(newWebsites);
    safeLocalStorage.setItem("avx_c_websites", JSON.stringify(newWebsites));
    try {
      safeLocalStorage.setItem("avexon_user_custom_websites", JSON.stringify(newWebsites));
    } catch(err) {}
    saveStateToServer({ websites: newWebsites });
  };

  const updatePortfolio = (newPortfolio: PortfolioItem[]) => {
    setPortfolio(newPortfolio);
    safeLocalStorage.setItem("avx_c_portfolio", JSON.stringify(newPortfolio));
    saveStateToServer({ portfolio: newPortfolio });
  };

  const updatePortfolioCategories = (newCats: PortfolioCategory[]) => {
    setPortfolioCategories(newCats);
    safeLocalStorage.setItem("avx_c_portfolio_categories", JSON.stringify(newCats));
    saveStateToServer({ portfolioCategories: newCats });
  };

  const updateTestimonials = (newTestimonials: Testimonial[]) => {
    setTestimonials(newTestimonials);
    safeLocalStorage.setItem("avx_c_testimonials", JSON.stringify(newTestimonials));
    saveStateToServer({ testimonials: newTestimonials });
  };

  const updateTeam = (newTeam: TeamMember[]) => {
    setTeam(newTeam);
    safeLocalStorage.setItem("avx_c_team", JSON.stringify(newTeam));
    saveStateToServer({ team: newTeam });
  };

  const updateLogoUrl = (url: string) => {
    setLogoUrl(url);
    safeLocalStorage.setItem("avx_c_logo", url);
    saveStateToServer({ logoUrl: url });
  };

  const updateHeaderBranding = (newBranding: HeaderBrandingConfig) => {
    setHeaderBranding(newBranding);
    safeLocalStorage.setItem("avx_c_header_branding", JSON.stringify(newBranding));
    saveStateToServer({ headerBranding: newBranding });
  };

  const updateNoticeConfig = (newNoticeConfig: NoticeConfig) => {
    setNoticeConfig(newNoticeConfig);
    safeLocalStorage.setItem("avx_c_notice", JSON.stringify(newNoticeConfig));
    saveStateToServer({ noticeConfig: newNoticeConfig });
  };

  const updateOfferConfig = (newOfferConfig: OfferConfig) => {
    setOfferConfig(newOfferConfig);
    safeLocalStorage.setItem("avx_c_offer", JSON.stringify(newOfferConfig));
    saveStateToServer({ offerConfig: newOfferConfig });
  };

  const updateContactConfig = (newContactConfig: ContactConfig) => {
    setContactConfig(newContactConfig);
    safeLocalStorage.setItem("avx_c_contact", JSON.stringify(newContactConfig));
    saveStateToServer({ contactConfig: newContactConfig });
  };

  const updateSectionHeadings = (newHeadings: SectionHeadingsConfig) => {
    setSectionHeadings(newHeadings);
    safeLocalStorage.setItem("avx_c_headings", JSON.stringify(newHeadings));
    saveStateToServer({ sectionHeadings: newHeadings });
  };

  const updateCustomPackagePlans = (newPlans: Record<string, PackagePlan[]>) => {
    setCustomPackagePlans(newPlans);
    safeLocalStorage.setItem("avx_c_package_plans", JSON.stringify(newPlans));
    saveStateToServer({ customPackagePlans: newPlans });
  };

  const updateWhyChooseUsStats = (newStats: any[]) => {
    setWhyChooseUsStats(newStats);
    safeLocalStorage.setItem("avx_c_why_choose_us_stats", JSON.stringify(newStats));
    saveStateToServer({ whyChooseUsStats: newStats });
  };

    const updateWhyChooseUsItems = (newItems: any[]) => {
    setWhyChooseUsItems(newItems);
    safeLocalStorage.setItem("avx_c_why_choose_us_items", JSON.stringify(newItems));
    saveStateToServer({ whyChooseUsItems: newItems });
  };
 
  const updatePromoPopupConfig = (newPromoConfig: PromoPopupConfig) => {
    setPromoPopupConfig(newPromoConfig);
    safeLocalStorage.setItem("avx_c_promo_popup", JSON.stringify(newPromoConfig));
    saveStateToServer({ promoPopupConfig: newPromoConfig });
  };

  const updateMultipleFields = (updates: {
    hero?: HeroConfig;
    owner?: OwnerConfig;
    services?: Service[];
    websites?: WebsiteProduct[];
    portfolio?: PortfolioItem[];
    portfolioCategories?: PortfolioCategory[];
    testimonials?: Testimonial[];
    team?: TeamMember[];
    logoUrl?: string;
    headerBranding?: HeaderBrandingConfig;
    noticeConfig?: NoticeConfig;
    offerConfig?: OfferConfig;
    contactConfig?: ContactConfig;
    sectionHeadings?: SectionHeadingsConfig;
    customPackagePlans?: Record<string, PackagePlan[]>;
    whyChooseUsStats?: any[];
    whyChooseUsItems?: any[];
    promoPopupConfig?: PromoPopupConfig;
  }) => {
    if (updates.hero !== undefined) {
      setHeroConfig(updates.hero);
      safeLocalStorage.setItem("avx_c_hero", JSON.stringify(updates.hero));
    }
    if (updates.owner !== undefined) {
      setOwner(updates.owner);
      safeLocalStorage.setItem("avx_c_owner", JSON.stringify(updates.owner));
    }
    if (updates.services !== undefined) {
      setServices(updates.services);
      safeLocalStorage.setItem("avx_c_services", JSON.stringify(updates.services));
    }
    if (updates.websites !== undefined) {
      setWebsites(updates.websites);
      safeLocalStorage.setItem("avx_c_websites", JSON.stringify(updates.websites));
    }
    if (updates.portfolio !== undefined) {
      setPortfolio(updates.portfolio);
      safeLocalStorage.setItem("avx_c_portfolio", JSON.stringify(updates.portfolio));
    }
    if (updates.portfolioCategories !== undefined) {
      setPortfolioCategories(updates.portfolioCategories);
      safeLocalStorage.setItem("avx_c_portfolio_categories", JSON.stringify(updates.portfolioCategories));
    }
    if (updates.testimonials !== undefined) {
      setTestimonials(updates.testimonials);
      safeLocalStorage.setItem("avx_c_testimonials", JSON.stringify(updates.testimonials));
    }
    if (updates.team !== undefined) {
      setTeam(updates.team);
      safeLocalStorage.setItem("avx_c_team", JSON.stringify(updates.team));
    }
    if (updates.logoUrl !== undefined) {
      setLogoUrl(updates.logoUrl);
      safeLocalStorage.setItem("avx_c_logo", updates.logoUrl);
    }
    if (updates.headerBranding !== undefined) {
      setHeaderBranding(updates.headerBranding);
      safeLocalStorage.setItem("avx_c_header_branding", JSON.stringify(updates.headerBranding));
    }
    if (updates.noticeConfig !== undefined) {
      setNoticeConfig(updates.noticeConfig);
      safeLocalStorage.setItem("avx_c_notice", JSON.stringify(updates.noticeConfig));
    }
    if (updates.offerConfig !== undefined) {
      setOfferConfig(updates.offerConfig);
      safeLocalStorage.setItem("avx_c_offer", JSON.stringify(updates.offerConfig));
    }
    if (updates.contactConfig !== undefined) {
      setContactConfig(updates.contactConfig);
      safeLocalStorage.setItem("avx_c_contact", JSON.stringify(updates.contactConfig));
    }
    if (updates.sectionHeadings !== undefined) {
      setSectionHeadings(updates.sectionHeadings);
      safeLocalStorage.setItem("avx_c_headings", JSON.stringify(updates.sectionHeadings));
    }
    if (updates.customPackagePlans !== undefined) {
      setCustomPackagePlans(updates.customPackagePlans);
      safeLocalStorage.setItem("avx_c_package_plans", JSON.stringify(updates.customPackagePlans));
    }
    if (updates.whyChooseUsStats !== undefined) {
      setWhyChooseUsStats(updates.whyChooseUsStats);
      safeLocalStorage.setItem("avx_c_why_choose_us_stats", JSON.stringify(updates.whyChooseUsStats));
    }
        if (updates.whyChooseUsItems !== undefined) {
      setWhyChooseUsItems(updates.whyChooseUsItems);
      safeLocalStorage.setItem("avx_c_why_choose_us_items", JSON.stringify(updates.whyChooseUsItems));
    }
    if (updates.promoPopupConfig !== undefined) {
      setPromoPopupConfig(updates.promoPopupConfig);
      safeLocalStorage.setItem("avx_c_promo_popup", JSON.stringify(updates.promoPopupConfig));
    }

    saveStateToServer(updates);
  };

  const resetAll = async () => {
    setHeroConfig(defaultHero);
    setOwner(defaultOwner);
    setServices(SERVICES);
    setWebsites(WEBSITES);
    setPortfolio(PORTFOLIO);
    setPortfolioCategories(defaultPortfolioCategories);
    setTestimonials(TESTIMONIALS);
    setTeam(TEAM);
    setLogoUrl("");
    setHeaderBranding(defaultHeaderBranding);
    setNoticeConfig(defaultNoticeConfig);
    setOfferConfig(defaultOfferConfig);
    setContactConfig(defaultContact);
    setSectionHeadings(defaultSectionHeadings);
    setWhyChooseUsStats(defaultWhyChooseUsStats);
    setWhyChooseUsItems(defaultWhyChooseUsItems);

    safeLocalStorage.removeItem("avx_c_hero");
    safeLocalStorage.removeItem("avx_c_owner");
    safeLocalStorage.removeItem("avx_c_services");
    safeLocalStorage.removeItem("avx_c_websites");
    safeLocalStorage.removeItem("avx_c_portfolio");
    safeLocalStorage.removeItem("avx_c_portfolio_categories");
    safeLocalStorage.removeItem("avx_c_testimonials");
    safeLocalStorage.removeItem("avx_c_team");
    safeLocalStorage.removeItem("avx_c_logo");
    safeLocalStorage.removeItem("avx_c_header_branding");
    safeLocalStorage.removeItem("avx_c_notice");
    safeLocalStorage.removeItem("avx_c_offer");
    safeLocalStorage.removeItem("avx_c_contact");
    safeLocalStorage.removeItem("avx_c_headings");
    safeLocalStorage.removeItem("avx_c_why_choose_us_stats");
    safeLocalStorage.removeItem("avx_c_why_choose_us_items");
    safeLocalStorage.removeItem("avx_c_promo_popup");

    try {
      await fetch("/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hero: defaultHero,
          owner: defaultOwner,
          services: SERVICES,
          websites: WEBSITES,
          portfolio: PORTFOLIO,
          testimonials: TESTIMONIALS,
          team: TEAM,
          logoUrl: "",
          headerBranding: defaultHeaderBranding,
          noticeConfig: defaultNoticeConfig,
          offerConfig: defaultOfferConfig,
          contactConfig: defaultContact,
          sectionHeadings: defaultSectionHeadings,
          whyChooseUsStats: defaultWhyChooseUsStats,
          whyChooseUsItems: defaultWhyChooseUsItems,
          promoPopupConfig: defaultPromoPopupConfig
        })
      });
    } catch (e) {}
  };

  return (
    <ContentContext.Provider
      value={{
        hero,
        owner,
        services,
        websites,
        portfolio,
        portfolioCategories,
        testimonials,
        team,
        logoUrl,
        headerBranding,
        noticeConfig,
        offerConfig,
        contactConfig,
        sectionHeadings,
        updateHero,
        updateOwner,
        updateServices,
        updateWebsites,
        updatePortfolio,
        updatePortfolioCategories,
        updateTestimonials,
        updateTeam,
        updateLogoUrl,
        updateHeaderBranding,
        updateNoticeConfig,
        updateOfferConfig,
        updateContactConfig,
        updateSectionHeadings,
        customPackagePlans,
        updateCustomPackagePlans,
        whyChooseUsStats,
        whyChooseUsItems,
        updateWhyChooseUsStats,
        updateWhyChooseUsItems,
        promoPopupConfig,
        updatePromoPopupConfig,
        updateMultipleFields,
        resetAll,
        isLoading
      }}
    >
      {children}
    </ContentContext.Provider>
  );
}

export function useContent() {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error("useContent must be used within a ContentProvider");
  }
  return context;
}
