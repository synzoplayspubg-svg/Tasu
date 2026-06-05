import { WebsiteProduct, Service, PortfolioItem, Testimonial, TeamMember } from "./types";

export const SERVICES: Service[] = [
  {
    id: "s1",
    title: "রেডিমেড ওয়েবসাইট সেটআপ",
    description: "আমাদের প্রিমিয়াম স্টোর থেকে পছন্দমতো ডেমো সিলেক্ট করুন। বিকাশ, রকেট, নগদ পেমেন্ট গেটওয়ে এবং সম্পূর্ণ প্যানেল মাত্র ৩ দিনে রেডি করে সোর্স কোড ও ফুল ওনারশিপ সহ বুঝিয়ে দেওয়া হবে।",
    iconName: "ShoppingCart",
    priceStarting: "৳৮,০০০",
    duration: "১-৩ দিন",
    techs: ["Readymade Store", "Instant Launch", "Complete Admin Panel", "Payment Integration"]
  },
  {
    id: "s2",
    title: "কাস্টমাইজড ওয়েবসাইট ডেভেলপমেন্ট",
    description: "অপ্রয়োজনীয় এলিমেন্টর বা ভারী প্লাগইন ছাড়া সম্পূর্ণ স্ক্র্যাচ থেকে React, Next.js বা Node.js দিয়ে তৈরি আল্ট্রা-ফাস্ট কাস্টম ওয়েবসাইট, যা নিশ্চিত করবে অসাধারণ স্পিড ও সিকিউরিটি।",
    iconName: "Globe",
    priceStarting: "৳২৫,০০০",
    duration: "১০-২৫ দিন",
    techs: ["React.js", "Next.js", "Node.js", "MongoDB", "Tailwind CSS"]
  },
  {
    id: "s3",
    title: "ইউআই/ইউএক্স ডিজাইন ও ফিগমা প্রোটোটাইপিং",
    description: "কোড করার আগেই দেখে নিন আপনার সাইট দেখতে কেমন হবে। আপনার ব্র্যান্ড কালার ও ভিজ্যুয়াল আইডেন্টিটি বজায় রেখে নিখুঁত ফিগমা প্রোটোটাইপ ও ইউজার ফ্রেন্ডলি ইন্টারফেস ডিজাইন করা।",
    iconName: "Figma",
    priceStarting: "৳১০,০০০",
    duration: "৫-১০ দিন",
    techs: ["Figma Design", "UX Wireframing", "Interactive Prototypes", "Brand Aesthetics"]
  },
  {
    id: "s4",
    title: "স্মার্ট ই-কমার্স ও কমপ্লিট অটোমেশন",
    description: "আপনার ব্যবসার সম্পূর্ণ হিসাব-নিকাশ অটোমেটেড রাখতে রিয়েল-টাইম অর্ডার ট্র্যাকিং, কাস্টমারদের জন্য অটোমেটেড এসএমএস নোটিফিকেশন এলার্ট এবং বাংলায় ডায়নামিক মিনি এডমিন প্যানেল।",
    iconName: "Sparkles",
    priceStarting: "৳১৫,০০০",
    duration: "৭-১৫ দিন",
    techs: ["SMS Marketing API", "Payment Gateways", "Sales Tracking Dashboard", "Automated Security"]
  }
];

export const WEBSITES: WebsiteProduct[] = [
  {
    id: "w1",
    title: "আলটিমেট মাল্টি-ভেন্ডর ই-কমার্স প্ল্যাটফর্ম",
    category: "প্রিমিয়াম ই-কমার্স",
    deliveryTime: "২-৪ দিন",
    price: 12500,
    originalPrice: 25000,
    rating: 4.9,
    ordersCount: 145,
    featuresCount: 18,
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800",
    tags: ["SSLCommerz/Bkash", "SMS Gateway", "Dynamic Inventory", "Sub-Admin Panel"],
    demoUrl: "https://react.dev"
  },
  {
    id: "w2",
    title: "ক্ল্যাসিক কর্পোরেট ও এজেন্সি বিজনেস রানিং পোর্টফোলিও",
    category: "কর্পোরেট ওয়েবসাইট",
    deliveryTime: "১-৩ দিন",
    price: 8000,
    originalPrice: 15000,
    rating: 4.8,
    ordersCount: 98,
    featuresCount: 12,
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800",
    tags: ["Sleek UI/UX", "Interactive Forms", "SEO Optimized", "Lead Capturing"],
    demoUrl: "https://tailwindcss.com"
  },
  {
    id: "w3",
    title: "স্মার্ট অনলাইন নিউজ পোর্টাল ও ব্লগিং সলিউশন",
    category: "মিডিয়া ও ব্লগ পোর্টাল",
    deliveryTime: "২-৩ দিন",
    price: 9500,
    originalPrice: 18000,
    rating: 4.7,
    ordersCount: 74,
    featuresCount: 15,
    image: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=80&w=800",
    tags: ["Ad Dynamic Slots", "Multi-Category", "Newsletter Opt-in", "Super-Fast CDN"],
    demoUrl: "https://vite.dev"
  }
];

export const PORTFOLIO: PortfolioItem[] = [
  {
    id: "p1",
    title: "ডায়নামিক ফিনটেক ড্যাশবোর্ড ইন্টিগ্রেশন",
    category: "UI/UX ডিজাইন ও ওয়েব",
    description: "একটি আন্তর্জাতিক মোবাইল ফিন্যান্সিয়াল সার্ভিসের জন্য ইউজার ফ্রেন্ডলি ড্যাশবোর্ড ও ট্রানজেকশন ট্র্যাকিং সিস্টেম ডিজাইন ও ডেভেলপমেন্ট।",
    imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800",
    client: "সিলিকন ক্যাপিটাল ইউএসএ",
    year: "২০২৫",
    tags: ["Figma", "React", "Recharts", "Interactive UI"],
    demoUrl: "https://react.dev"
  },
  {
    id: "p2",
    title: "কুরিয়ার এবং লজিস্টিকস ট্র্যাকিং মোবাইল অ্যাপ",
    category: "মোবাইল অ্যাপ",
    description: "রিয়েল-টাইম জিপিএস ট্র্যাকিং, স্মার্ট রাউটিং এবং অটোমেটেড কাস্টমার নোটিফিকেশন সিস্টেম সহ কুরিয়ার ম্যানেজমেন্ট সলিউশন।",
    imageUrl: "https://images.unsplash.com/photo-1563013544-824ae1d704d3?auto=format&fit=crop&q=80&w=800",
    client: "স্পিডকার্গো বাংলাদেশ",
    year: "২০২৬",
    tags: ["Flutter", "Node.js", "Google Maps API", "Express"],
    demoUrl: "https://tailwindcss.com"
  },
  {
    id: "p3",
    title: "দেশীয় হ্যান্ডিক্রাফটস ই-কমার্স প্ল্যাটফর্ম",
    category: "ওয়েব ডেভেলপমেন্ট",
    description: "সম্পূর্ণ রেসপন্সিভ ই-কমার্স সাইট, ড্রপডাউন ক্যাটাগরি, ট্র্যাকিং সিস্টেম এবং দেশের শীর্ষস্থানীয় পেমেন্ট গেটওয়ে সম্বলিত ই-কমার্স প্ল্যাটফর্ম।",
    imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800",
    client: "অরণ্য ক্রাফটস লিমিটেড",
    year: "২০২৬",
    tags: ["Next.js", "Tailwind CSS", "SSLCommerz", "Prisma"],
    demoUrl: "https://vite.dev"
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "t1",
    name: "মেহেদী হাসান শুভ",
    role: "ফাউন্ডার, টেক সল্যুশনস বিডি",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
    text: "Avexon Studio থেকে আমাদের কোম্পানির জন্য একটি রেডিমেড ওয়েবসাইট অর্ডার করেছিলাম। মাত্র ৩ দিনে সম্পূর্ণ সেটআপ ডেলিভারি পেয়েছি। তাদের রেডিমেড ডিজাইনের মান প্রফেশনাল এবং ইন্টারফেস অত্যন্ত আকর্ষণীয়!",
    rating: 5,
    type: "readymade"
  },
  {
    id: "t2",
    name: "ফারহানা ইয়াসমিন",
    role: "ফাউন্ডার, অর্গানিক বাস্কেট",
    avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200",
    text: "আমরা যখন আমাদের নতুন ব্র‍্যান্ড এবং ওয়েবসাইট তৈরির জন্য চিন্তা করছিলাম, Avexon টিম চমৎকারভাবে আমাদের রিকোয়ারমেন্ট অনুযায়ী কাজ সম্পন্ন করে দিয়েছে। রিয়েল-টাইম পারফর্মেন্স প্রশংসনীয়!",
    rating: 5,
    type: "custom"
  },
  {
    id: "t3",
    name: "রাফসান উল ইসলাম",
    role: "এমডি, নেক্সাস লজিস্টিকস",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200",
    text: "কাস্টম ই-কমার্স ডেভেলপমেন্টের জন্য আমি Avexon কে বেছে নিয়েছিলাম। তাদের ইউজার ইন্টারফেস ডিজাইন, ডাটাবেজ স্পিড আর পেমেন্ট গেটওয়ের নিখুঁত কাজ সত্যিই অসাধারণ। যেকোনো বিজনেস ওয়েবসাইটের জন্য তারা সেরা!",
    rating: 5,
    type: "custom"
  }
];

export const TEAM: TeamMember[] = [
  {
    id: "tm1",
    name: "আমিরুল ইসলাম শাকিল",
    role: "ফাউন্ডার এবং লিড ইউআই/ইউএক্স ডিজাইনার",
    imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400",
    skills: ["Figma", "Product Strategy", "User Experience", "Design System"],
    bio: "ডিজাইন এবং প্রোডাক্ট স্ট্র্যাটেজিতে ৫+ বছরের অভিজ্ঞতা সম্পন্ন। শতাধিক সফল টিম প্রোজেক্ট ও ফ্রিল্যান্স এন্টারপ্রাইজ ডেভেলপমেন্ট পরিচালনা করেছেন।",
    linkedinUrl: "https://linkedin.com",
    githubUrl: "https://github.com",
    facebookUrl: "https://facebook.com",
    instagramUrl: "https://instagram.com",
    whatsappUrl: "01613911528",
    showLinkedin: true,
    showGithub: true,
    showFacebook: true,
    showInstagram: false,
    showWhatsapp: false
  },
  {
    id: "tm2",
    name: "তানভীর রহমান রনি",
    role: "সহ-প্রতিষ্ঠাতা ও লিড ফুল-স্ট্যাক ডেভেলপার",
    imageUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=400",
    skills: ["React.js", "Node.js", "System Architecture", "Cloud Deploy"],
    bio: "অত্যন্ত ফাস্ট এবং স্কেলযোগ্য সিস্টেম তৈরিতে দক্ষ। জটিল ডেটাবেস অপ্টিমাইজেশন ও সার্ভার আর্কিটেকচার নিয়ে কাজ করতে ভালোবাসেন।",
    linkedinUrl: "https://linkedin.com",
    githubUrl: "https://github.com",
    facebookUrl: "https://facebook.com",
    instagramUrl: "https://instagram.com",
    whatsappUrl: "01613911528",
    showLinkedin: true,
    showGithub: true,
    showFacebook: true,
    showInstagram: false,
    showWhatsapp: false
  }
];
