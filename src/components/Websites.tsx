import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useContent } from "../context/ContentContext";
import { WebsiteProduct } from "../types";
import ScrollBlurReveal from "./ScrollBlurReveal";
import { 
  Globe, 
  Layers, 
  ShoppingCart, 
  Star, 
  X, 
  ArrowRight,
  Sparkles,
  ShoppingBag,
  Laptop,
  Clock,
  Eye,
  ArrowUpRight,
  Heart,
  Flame,
  CheckCircle2,
  Bookmark,
  Smartphone,
  Wifi,
  Battery,
  ExternalLink,
  Lock,
  RefreshCw,
  AlertCircle,
  Signal,
  Calendar
} from "lucide-react";

interface WebsitesProps {
  onOrderRequest: (websiteTitle: string) => void;
}

export default function Websites({ onOrderRequest }: WebsitesProps) {
  const { websites, offerConfig, sectionHeadings } = useContent();

  const [isOfferExpired, setIsOfferExpired] = useState(false);

  useEffect(() => {
    if (!offerConfig || !offerConfig.show) {
      setIsOfferExpired(true);
      return;
    }
    if (offerConfig.timerType === "midnight") {
      setIsOfferExpired(false);
      return;
    }
    if (offerConfig.timerType === "custom_target" && offerConfig.customTargetDate) {
      const checkExpiry = () => {
        try {
          const targetTime = new Date(offerConfig.customTargetDate!).getTime();
          setIsOfferExpired(Date.now() >= targetTime);
        } catch (e) {
          setIsOfferExpired(true);
        }
      };
      
      checkExpiry();
      const interval = setInterval(checkExpiry, 1000);
      return () => clearInterval(interval);
    }
    setIsOfferExpired(false);
  }, [offerConfig]);

  const isOfferActiveVal = !isOfferExpired && !!offerConfig?.show;

  const showDiscountPrice = !!(isOfferActiveVal && offerConfig?.discountActive && offerConfig?.discountPercentage);
  const [selectedWebsite, setSelectedWebsite] = useState<WebsiteProduct | null>(null);
  const [demoProduct, setDemoProduct] = useState<WebsiteProduct | null>(null);
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);
  const [wishlisted, setWishlisted] = useState<Record<string, boolean>>({});
  const [isIframeLoading, setIsIframeLoading] = useState(true);
  const [iframeKey, setIframeKey] = useState(0);

  // Dynamic body lock and class trigger to hide the main floating header navbar
  useEffect(() => {
    if (selectedWebsite || demoProduct) {
      document.body.classList.add("modal-open");
    } else {
      document.body.classList.remove("modal-open");
    }
    return () => {
      document.body.classList.remove("modal-open");
    };
  }, [selectedWebsite, demoProduct]);

  const toggleWishlist = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setWishlisted(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Custom demo links for the preview interactive experience
  const getDemoLink = (id: string, product?: WebsiteProduct) => {
    if (product && product.demoUrl) {
      return product.demoUrl;
    }
    switch (id) {
      case "w1": return "https://react.dev";
      case "w2": return "https://tailwindcss.com";
      default: return "https://vite.dev";
    }
  };

  // Detailed features catalog to render in the pop up
  const getFeaturesList = (webId: string) => {
    const webObj = websites.find(w => w.id === webId);
    if (webObj && webObj.features && webObj.features.length > 0) {
      return webObj.features;
    }
    switch (webId) {
      case "w1":
        return [
          "বিকাশ, রকেট, নগদ ও SSLCommerz অটোমেটেড পেমেন্ট গেটওয়ে ইন্টিগ্রেশন",
          "কমপ্লিট মাল্টি-ভেন্ডর সিস্টেম ও ইন্ডিপেন্ডেন্ট সেলার ম্যানেজমেন্ট ড্যাশবোর্ড",
          "রিয়েল-টাইম ইনভেন্টরি কন্ট্রোল, স্টক লেভেল অ্যালার্ট ও পুশ আপডেট",
          "অটোমেটেড কাস্টমার এসএমএস এবং ইমেল নোটিফিকেশন এলার্ট সিস্টেমস",
          "কুপন কোড, ডিসকাউন্ট ক্যাম্পেইন ও ফ্ল্যাশ ডিল জেনারেটর সার্ভিসেস",
          "১০০% রেস্পন্সিভ মোবাইল ফ্রেন্ডলি ইন্টারফেস ও ডাইনামিক এডমিন প্যানেল"
        ];
      case "w2":
        return [
          "আল্ট্রা-ফাস্ট লোডিং স্পিড এবং প্রো-অ্যাক্টিভ এসইও অপ্টিমাইজড আর্কিটেকচার",
          "ইন্টারঅ্যাক্টিভ সার্ভিস মডিউল, ক্যারিয়ার হাব এবং ক্যাটাগরাইজড ব্লগ সিস্টেম",
          "লিড ক্যাটালগ ক্যাপিচারিং ফর্ম এবং মেলচিম্প অটো রেসপন্ডার ইন্টিগ্রেশন",
          "রিয়েল-টাইম ক্লায়েন্ট টেস্টিমোনিয়াল এবং প্রজেক্ট পোর্টফোলিও শোকেস",
          "প্রফেশনাল ইউনিক থিম কাস্টমাইজেশন ও মেগা ড্রপডাউন নেভিগেশন মেনু",
          "আনলিমিটেড ফ্রি হোস্টিং ক্লাউড লাইফটাইম ব্যাকআপ সেটআপ গ্যারান্টি"
        ];
      default:
        return [
          "গুগল অ্যাডসেন্স (AdSense) ও ডাইনামিক লোকাল ব্যানার অ্যাড কন্ট্রোল পোর্টাল",
          "আনলিমিটেড ক্যাটাগরি ভিত্তিক সংবাদ বিন্যাস এবং ইনস্ট্যান্ট ব্রেকিং নিউজ টিকার",
          "নিউজলেটার সাবস্ক্রিপশন ও সোশ্যাল মিডিয়া অটোমেটেড ইনস্ট্যান্ট শেয়ারিং",
          "একাধিক অ্যাডমিন, সাব-অ্যাডমিন ও রিপোর্টার রোল কন্ট্রোল প্যানেল",
          "মাল্টিমিডিয়া গ্যালারি, ফেসবুক লাইভ এমবেডেড ও ভিডিও প্লেলিস্ট মডিউল",
          "সুপার-ফাস্ট ক্লাউডফ্লেয়ার সিডিএন (CDN) ইন্টিগ্রেশন ও আল্ট্রা সিকিউর ডাটাবেজ"
        ];
    }
  };

  return (
    <section id="websites" className="relative py-28 bg-transparent overflow-hidden border-t border-purple-950/25">
      {/* Decorative grids and soft color halos */}
      <div className="absolute inset-x-0 top-0 h-[600px] bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(147,51,234,0.06),transparent_100%)] pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-[450px] h-[450px] bg-purple-500/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute left-10 top-1/2 w-96 h-96 bg-fuchsia-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 md:px-8 z-10 flex flex-col justify-between">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-5">
          
          <motion.h2 
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, amount: 0.05 }}
            transition={{ type: "spring", stiffness: 40, damping: 15 }}
            className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white leading-tight"
          >
            {(() => {
              const title = sectionHeadings?.websitesTitle || "আমাদের রেডিমেড ওয়েবসাইট সপ";
              const words = title.trim().split(/\s+/);
              if (words.length <= 1) {
                return (
                  <span className="bg-gradient-to-r from-purple-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent font-black">
                    {title}
                  </span>
                );
              }
              const hlCount = words.length >= 4 ? 2 : 1;
              const normalWords = words.slice(0, words.length - hlCount);
              const highlightWords = words.slice(words.length - hlCount);
              return (
                <span className="inline-block">
                  <span className="bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                    {normalWords.join(" ")}
                  </span>{" "}
                  <span className="relative inline-block px-1">
                    <motion.span 
                      animate={{
                        backgroundPosition: ["0% center", "-200% center"],
                        scale: [1, 1.025, 1],
                      }}
                      transition={{
                        backgroundPosition: {
                          duration: 5,
                          repeat: Infinity,
                          ease: "linear"
                        },
                        scale: {
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }
                      }}
                      style={{
                        backgroundImage: "linear-gradient(135deg, #3b0764 0%, #8b5cf6 30%, #f3e8ff 50%, #8b5cf6 70%, #3b0764 100%)",
                        backgroundSize: "200% auto",
                      }}
                      className="text-transparent bg-clip-text font-black select-none inline-block pb-1 filter drop-shadow-[0_2px_8px_rgba(139,92,246,0.4)]"
                    >
                      {highlightWords.join(" ")}
                    </motion.span>
                    <motion.span 
                      initial={{ width: 0, opacity: 0 }}
                      whileInView={{ width: "100%", opacity: 0.95 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.35, duration: 0.9, ease: "easeOut" }}
                      className="absolute -bottom-1.5 left-0 h-[3px] bg-gradient-to-r from-violet-900 via-purple-500 to-fuchsia-300 rounded-full shadow-[0_0_15px_rgba(168,85,247,0.75)]"
                    />
                    <motion.span 
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 0.35, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.5, duration: 1 }}
                      className="absolute inset-0 bg-purple-500/10 blur-md rounded-lg -z-10 pointer-events-none"
                    />
                  </span>
                </span>
              );
            })()}
          </motion.h2>
          
          <ScrollBlurReveal 
            text={sectionHeadings?.websitesSubtitle || "ফুড ডেলিভারি অ্যাপের মতো সহজে নির্বাচন করুন। পছন্দসই ডেমো পরখ করুন এবং কোনো জটিল কোডিং ছাড়াই মাত্র ৩ দিনে সম্পূর্ণ বাংলায় এডমিন ড্যাশবোর্ড সহ সাইটটি বুঝে নিন।"}
            className="text-slate-400 text-xs sm:text-sm md:text-base leading-relaxed max-w-2xl mx-auto"
            as="p"
            delay={0.15}
            stagger={0.03}
          />
        </div>

        {/* Dynamic Widescreen Offer Countdown Timer with Bangla Date */}
        <LiveSellAndOfferTimer />

        {/* Grid of Columns and Rows (Side-by-Side and Row-by-Row Layout) - Perfect Square Proportions */}
        <div 
          style={{ perspective: "1200px" }}
          className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 lg:gap-8 items-stretch mb-20"
        >
          {websites.map((web, idx) => {
            const discountPct = showDiscountPrice 
              ? (offerConfig.discountPercentage || 10) 
              : Math.round(((web.originalPrice - web.price) / web.originalPrice) * 100);
            const isWishlisted = !!wishlisted[web.id];

            return (
              <motion.div
                id={`website-card-${web.id}`}
                key={web.id}
                initial={{ 
                  opacity: 0, 
                  y: 80, 
                  scale: 0.9, 
                  rotateX: 15,
                  rotateY: idx % 3 === 0 ? -10 : idx % 3 === 1 ? 0 : 10,
                }}
                whileInView={{ 
                  opacity: 1, 
                  y: 0, 
                  scale: 1, 
                  rotateX: 0, 
                  rotateY: 0,
                }}
                whileHover={{
                  y: -8,
                  scale: 1.015,
                  transition: { duration: 0.25, ease: "easeOut" }
                }}
                viewport={{ once: true, amount: 0.05 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 30, 
                  damping: 15, 
                  mass: 0.9,
                  delay: (idx % 3) * 0.12
                }}
                style={{ 
                  transformStyle: "preserve-3d", 
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                  willChange: "transform, opacity"
                }}
                onMouseEnter={() => setHoveredCardId(web.id)}
                onMouseLeave={() => setHoveredCardId(null)}
                className="why-choose-us-neon-card no-glow-card relative flex flex-col group aspect-[10/16.8] sm:aspect-[10/14.8] rounded-2xl sm:rounded-3xl"
              >
                {/* Inner Card (covers the spin gradient except for the 3px border) */}
                <div className="why-choose-us-neon-inner flex-1 flex flex-col !p-0 overflow-hidden relative z-10 transition-colors duration-300 rounded-[13px] sm:rounded-[21px]">
                  {/* Decorative border highlight glows */}
                  <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-purple-500/40 to-transparent group-hover:via-fuchsia-400 transition-opacity" />

                  {/* Top Side: Thumbnail section representing food-app style photo. Occupies ~36% of the height */}
                  <div className="h-[36%] w-full relative overflow-hidden select-none bg-slate-950 flex-shrink-0">
                  <img
                    src={web.image}
                    alt={web.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                  />

                  {/* Glassmorphic Dark Overlay with Quick Action Buttons on Hover */}
                  <div className="absolute inset-0 bg-slate-950/75 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center gap-1 sm:gap-2 px-1 sm:px-3">
                    <motion.button
                      id={`hover-info-btn-${web.id}`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedWebsite(web)}
                      className="w-full max-w-[130px] flex items-center justify-center gap-1 py-1 sm:py-2 rounded-md sm:rounded-xl bg-purple-600 text-white font-bold text-[9px] sm:text-xs shadow-lg cursor-pointer hover:bg-purple-500 transition-all font-sans"
                    >
                      <Eye className="w-2.5 sm:w-3.5 h-2.5 sm:h-3.5" />
                      <span>ফিচার তালিকা</span>
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setDemoProduct(web);
                        setIsIframeLoading(true);
                        setIframeKey(prev => prev + 1);
                      }}
                      className="w-full max-w-[130px] flex items-center justify-center gap-1 py-1 sm:py-2 rounded-md sm:rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold text-[9px] sm:text-xs border border-purple-500/20 cursor-pointer transition-all font-sans"
                    >
                      <Globe className="w-2.5 sm:w-3.5 h-2.5 sm:h-3.5 text-purple-400" />
                      <span>লাইভ ডেমো</span>
                    </motion.button>
                  </div>

                  {/* Discount Percentage Ribbon */}
                  {showDiscountPrice && (
                    <div className="absolute bottom-1 sm:bottom-2 left-1 sm:left-2 bg-rose-500 text-[7px] sm:text-[9.5px] font-black text-white px-1 sm:px-2.5 py-0.5 rounded shadow-md flex items-center gap-0.5 sm:gap-1">
                      <Flame className="w-2.5 sm:w-3.5 h-2.5 sm:h-3.5 animate-bounce" />
                      <span>{discountPct}% OFF</span>
                    </div>
                  )}

                  {/* Delivery time label */}
                  <div className="absolute top-1 sm:top-2 right-1 sm:right-2 bg-emerald-500/90 text-white text-[7px] sm:text-[9px] font-black px-1 sm:px-2 py-0.5 rounded shadow-md flex items-center gap-0.5 sm:gap-1">
                    <Clock className="w-2 sm:w-3 h-2 sm:h-3" />
                    <span>{web.deliveryTime}</span>
                  </div>

                  {/* Wishlist/Bookmark Heart Icon */}
                  <button
                    onClick={(e) => toggleWishlist(web.id, e)}
                    className="absolute bottom-1 sm:bottom-2 right-1 sm:right-2 p-1 sm:p-2 rounded-full bg-slate-900/80 border border-purple-500/10 text-slate-300 hover:text-rose-500 transition-colors cursor-pointer"
                  >
                    <Heart className={`w-2.5 sm:w-3.5 h-2.5 sm:h-3.5 ${isWishlisted ? "fill-rose-500 text-rose-500" : "text-slate-400 hover:text-rose-400"}`} />
                  </button>
                </div>

                {/* Bottom Side: Rich Content section. Occupies ~64% of the height */}
                <div className="h-[64%] p-2.5 sm:p-4 pb-5 sm:pb-6 w-full flex flex-col justify-between overflow-visible">
                  {/* Top content: Details & Interactive buttons */}
                  <div className="space-y-2 sm:space-y-3.5">
                    {/* Header: Title & Star Rating */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[7.5px] sm:text-[10px] text-purple-400 font-sans bg-purple-500/10 px-1.5 py-0.5 rounded border border-purple-500/10 font-black">{web.featuresCount}টি কি-ফিচারস</span>
                      </div>

                      <h3 className="text-[10.5px] sm:text-base md:text-[16px] font-extrabold text-slate-100 group-hover:text-purple-400 leading-snug transition-colors line-clamp-2 min-h-[32px] sm:min-h-[44px]">
                        {web.title}
                      </h3>
                    </div>

                    {/* Interactive Helpers: Live Demo & View Features side-by-side */}
                    <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
                       <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDemoProduct(web);
                          setIsIframeLoading(true);
                          setIframeKey(prev => prev + 1);
                        }}
                        className="flex items-center justify-center gap-0.5 sm:gap-1.5 py-1.5 sm:py-2 rounded-lg bg-[#0d041c] hover:bg-[#150a29] border border-purple-500/15 hover:border-purple-500/30 text-[9px] sm:text-[11px] font-black text-slate-300 hover:text-white cursor-pointer shadow-md transition-all duration-300"
                      >
                        <span className="truncate">লাইভ ডেমো</span>
                        <ArrowUpRight className="w-2.5 sm:w-3 h-2.5 sm:h-3 text-purple-400 flex-shrink-0" />
                      </button>

                      <button
                        id={`view-facilities-btn-${web.id}`}
                        onClick={() => setSelectedWebsite(web)}
                        className="flex items-center justify-center gap-0.5 sm:gap-1 py-1.5 sm:py-2 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 hover:text-purple-100 border border-purple-500/20 hover:border-purple-500/40 text-[9px] sm:text-[11px] font-black cursor-pointer select-none transition-all duration-300"
                      >
                        <CheckCircle2 className="w-2.5 sm:w-3.5 h-2.5 sm:h-3.5 text-purple-400 flex-shrink-0 animate-pulse" />
                        <span className="truncate">সুবিধাসমূহ</span>
                      </button>
                    </div>
                  </div>

                  {/* Actions & Pricing Row - Pushed firmly to the bottom and guaranteed not to squeeze */}
                  <div className="mt-auto pt-2 sm:pt-3 border-t border-purple-500/15 space-y-1.5 sm:space-y-2 flex-shrink-0">
                    <div className="flex items-center justify-between">
                      <span className={`text-[7.5px] sm:text-[9px] uppercase tracking-wider font-extrabold block ${showDiscountPrice ? "text-emerald-400 font-bold" : "text-slate-400"}`}>
                        {showDiscountPrice ? "অফার প্রাইস (এককালীন)" : "এককালীন ফাইনাল প্রাইস"}
                      </span>
                      <div className="flex items-baseline gap-0.5 sm:gap-1">
                        {showDiscountPrice ? (
                          <>
                            <span className="text-sm sm:text-lg md:text-[20px] font-black text-purple-400 font-sans">
                              ৳{(Math.round(web.price * (1 - (offerConfig.discountPercentage || 10) / 100))).toLocaleString("bn-BD")}
                            </span>
                            <span className="text-[9px] sm:text-[11px] text-slate-500 line-through font-medium font-sans">
                              ৳{web.price.toLocaleString("bn-BD")}
                            </span>
                          </>
                        ) : (
                          <>
                            <span className="text-sm sm:text-lg md:text-[20px] font-black text-purple-400 font-sans">৳{web.price.toLocaleString("bn-BD")}</span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Big Highly Visible Premium Buy Button - Website Signature Purple to Fuchsia Gradient */}
                    <button
                      id={`order-btn-${web.id}`}
                      onClick={() => onOrderRequest(web.title)}
                      className="w-full flex items-center justify-center py-2.5 sm:py-3.5 rounded-lg sm:rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 active:scale-[0.98] text-white font-black text-[11px] sm:text-[13.5px] tracking-wide cursor-pointer shadow-[0_4px_15px_rgba(124,58,237,0.18)] hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300 flex-shrink-0 min-h-[36px] sm:min-h-[44px]"
                    >
                      <span>কিনুন (Order Now)</span>
                    </button>
                  </div>
                </div>

                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Detailed Features Dialog popup modal with nice CSS transitions */}
        <AnimatePresence>
          {selectedWebsite && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              {/* Blur backdrop overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedWebsite(null)}
                className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
              />

              {/* Modal Box */}
              <motion.div
                id="course-curriculum-modal"
                initial={{ opacity: 0, scale: 0.95, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 30 }}
                transition={{ type: "spring", duration: 0.5 }}
                className="relative w-full max-w-xl max-h-[85vh] bg-[#0c0418] border border-purple-500/30 rounded-3xl p-5 sm:p-7 shadow-2xl z-10 flex flex-col overflow-hidden"
              >
                {/* Decorative glows inside modal */}
                <div className="absolute top-0 right-0 w-36 h-36 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />

                {/* Close Button */}
                <button
                  id="modal-close-btn"
                  onClick={() => setSelectedWebsite(null)}
                  className="absolute top-4 right-4 p-2.5 rounded-full text-slate-400 hover:text-white bg-[#150a25] border border-purple-950 hover:border-purple-500/25 transition cursor-pointer z-20"
                  aria-label="Close modal dialog"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Scrollable Container for content (Header & Features list are scrollable together) */}
                <div className="flex-1 overflow-y-auto pr-1.5 custom-scrollbar text-left mb-5">
                  {/* Header info */}
                  <div className="mb-5 text-left pr-8">
                    <span className="text-[10px] uppercase font-black tracking-widest text-purple-300 bg-purple-500/10 border border-purple-500/20 px-2.5 py-1 rounded-md inline-block">
                      ডেভেলপমেন্ট ও ডেমো ফিচার প্যানেল
                    </span>
                    <h3 className="text-base sm:text-xl font-extrabold text-slate-100 mt-3 leading-snug">
                      {selectedWebsite.title}
                    </h3>
                    <p className="text-[11.5px] sm:text-xs text-slate-400 mt-2 leading-relaxed">
                      প্রতিটি রেডিমেড মডেলে আপনার নিজস্ব ব্র্যান্ড লোগো, কনটেন্ট, কালার থিম এবং পণ্যের তালিকা সম্পূর্ণরূপে রিমডিউল করে দেওয়া হবে।
                    </p>
                  </div>

                  {/* Features list */}
                  <div className="space-y-2.5">
                    {getFeaturesList(selectedWebsite.id).map((feat, index) => (
                      <div 
                        key={index}
                        className="flex items-start gap-3 p-3.5 rounded-xl bg-[#140a25]/50 border border-purple-950/40 hover:border-purple-500/10 transition duration-300"
                      >
                        <div className="w-5.5 h-5.5 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-[11px] font-sans text-purple-400 font-black flex-shrink-0 mt-0.5">
                          {index + 1}
                        </div>
                        <span className="text-xs sm:text-sm text-slate-300 font-medium">
                          {feat}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sticky/Fixed Modal Footer Actions (Always visible outside scroll height) */}
                <div className="pt-3.5 border-t border-purple-500/20 flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#0c0418] z-10 relative">
                  <div className="text-left w-full sm:w-auto flex sm:flex-col justify-between items-center sm:items-start">
                    <span className="text-[10px] sm:text-[11px] text-slate-500 font-extrabold uppercase tracking-widest">
                      {showDiscountPrice ? "স্পেশাল অফার প্রাইজ (এককালীন)" : "এককালীন ফাইনাল প্রাইস"}
                    </span>
                    <p className="text-lg sm:text-2xl font-black text-purple-400 font-sans mt-0.5">
                      {showDiscountPrice && offerConfig?.discountPercentage ? (
                        <>
                          <span className="text-xs text-slate-500 line-through mr-2">৳{selectedWebsite.price.toLocaleString("bn-BD")}</span>
                          ৳{(Math.round(selectedWebsite.price * (1 - offerConfig.discountPercentage / 100))).toLocaleString("bn-BD")}
                        </>
                      ) : (
                        `৳${selectedWebsite.price.toLocaleString("bn-BD")}`
                      )}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-3.5 w-full sm:w-auto shrink-0">
                    <button
                      id="modal-cancel-btn"
                      onClick={() => setSelectedWebsite(null)}
                      className="px-5 py-3 sm:px-6 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white border border-rose-500/40 hover:border-rose-500/80 text-xs font-black shadow-md cursor-pointer transition-all duration-300 text-center select-none"
                    >
                      বন্ধ করুন
                    </button>
                    <button
                      id="modal-enroll-btn"
                      onClick={() => {
                        setSelectedWebsite(null);
                        onOrderRequest(selectedWebsite.title);
                      }}
                      className="px-6 py-3 sm:px-8 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 active:scale-[0.98] text-white text-xs font-black text-center cursor-pointer select-none transition-all duration-300 shadow-md hover:shadow-purple-500/25"
                    >
                      কিনুন (Order Now)
                    </button>
                  </div>
                </div>

              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Live Mobile UI IFrame Pop-up Modal */}
        <AnimatePresence>
          {demoProduct && (
            <div className="fixed inset-0 z-[110] flex items-center justify-center p-0 md:p-4 overflow-hidden">
              {/* Dark Blur Backdrop overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => {
                  setDemoProduct(null);
                  setIsIframeLoading(true);
                }}
                className="absolute inset-0 bg-slate-950/85 backdrop-blur-md z-0"
              />

              {/* Layout container allowing responsive side-by-side or stacked on mobile */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 30 }}
                transition={{ type: "spring", stiffness: 140, damping: 18 }}
                className="relative w-full h-full md:h-auto md:max-w-4xl bg-slate-950 md:bg-[#0b0316]/95 border-0 md:border md:border-purple-500/20 rounded-none md:rounded-[28px] p-0 md:p-6 shadow-2xl z-10 flex flex-col md:flex-row gap-0 md:gap-6 max-h-screen md:max-h-[85vh] overflow-hidden"
              >
                {/* Left/Main portion: Real Smartphone Frame */}
                <div className="flex-1 flex justify-center items-center w-full h-full md:h-auto">
                  <div className="relative w-full h-full md:w-[365px] md:h-[700px] rounded-none md:rounded-[42px] border-0 md:border-[10px] md:border-slate-800 bg-[#07010f] shadow-none md:shadow-2xl overflow-hidden flex flex-col md:ring-2 md:ring-purple-500/50 shrink-0">
                    
                    {/* Speaker Ear Piece + Front Camera notch (Only visible on Desktop Simulator) */}
                    <div className="hidden md:flex absolute top-0 inset-x-0 h-6 bg-slate-800 rounded-b-xl justify-center items-center z-50">
                      <div className="w-16 h-2 bg-black rounded-full mb-0.5" />
                      <div className="w-2.5 h-2.5 bg-sky-950 rounded-full ml-1.5 mb-0.5 border border-slate-700/50" />
                    </div>

                    {/* Smartphone Custom Header bar (Signal/Battery/Time Indicator - Only visible on Desktop Simulator) */}
                    <div className="hidden md:flex pt-6 px-4 pb-1.5 bg-slate-900 border-b border-purple-950/20 justify-between items-center text-[10px] text-white/90 z-20 shrink-0 font-sans select-none">
                      <div className="font-semibold tracking-tight">09:41 AM</div>
                      
                      {/* Dynamic Island Pill */}
                      <div className="w-16 h-3 rounded-full bg-slate-950 shadow-inner flex items-center justify-center opacity-80" />

                      <div className="flex items-center gap-1">
                        <Signal className="w-2.5 h-2.5 text-white/90" />
                        <span className="text-[8px] font-black tracking-tighter">5G</span>
                        <Wifi className="w-2.5 h-2.5 text-white/90" />
                        <div className="relative w-5 h-2.5 rounded-sm border border-white/60 p-0.5 flex items-center">
                          <div className="bg-emerald-400 h-full w-[80%] rounded-2xs" />
                          <div className="absolute -right-0.5 top-1/2 -translate-y-1/2 w-0.5 h-1 bg-white/60 rounded-r-xs" />
                        </div>
                      </div>
                    </div>

                    {/* Mobile Browser URL address panel */}
                    <div className="px-3 py-2 pt-4 md:pt-2 bg-slate-900/90 flex items-center gap-2 z-20 shrink-0 border-b border-purple-500/10">
                      <div className="flex-1 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#120724] border border-purple-500/15 text-[10px] text-slate-300 font-mono truncate">
                        <Lock className="w-2.5 h-2.5 text-emerald-400 shrink-0" />
                        <span className="truncate flex-1 select-all">{getDemoLink(demoProduct.id, demoProduct).replace("https://", "")}</span>
                      </div>
                      
                      {/* Interactive refresh inside device */}
                      <button
                        onClick={() => {
                          setIsIframeLoading(true);
                          setIframeKey(prev => prev + 1);
                        }}
                        className="p-1.5 rounded-lg bg-slate-950 text-purple-400 hover:text-purple-300 border border-purple-500/15 active:scale-95 transition-transform"
                        title="রিলোড করুন"
                      >
                        <RefreshCw className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Standard IFrame rendering area occupies remainder of the screen */}
                    <div className="flex-1 bg-[#0b0316] relative overflow-hidden">
                      {isIframeLoading && (
                        <div className="absolute inset-0 bg-[#0b0316] flex flex-col justify-center items-center z-35 p-4 text-center">
                          <div className="relative flex items-center justify-center mb-3">
                            <div className="absolute w-12 h-12 rounded-full border-2 border-dashed border-purple-500/30 animate-[spin_3s_linear_infinite]" />
                            <div className="w-8 h-8 rounded-full border-t-2 border-purple-500 animate-[spin_1s_linear_infinite]" />
                          </div>
                          <span className="text-[10px] text-purple-400 font-semibold animate-pulse">ডেমো লোড হচ্ছে...</span>
                        </div>
                      )}
                      
                      <iframe
                        key={iframeKey}
                        src={getDemoLink(demoProduct.id, demoProduct)}
                        onLoad={() => setIsIframeLoading(false)}
                        className="w-full h-full border-0 bg-white"
                        referrerPolicy="no-referrer"
                        sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                        title="Demo Live Preview"
                      />
                    </div>

                    {/* Phone gesture Home bar at the bottom (Only visible on Desktop Simulator) */}
                    <div className="hidden md:flex h-4 bg-slate-900 z-20 shrink-0 items-center justify-center pb-0.5 select-none">
                      <div className="w-20 h-0.75 bg-white/40 rounded-full" />
                    </div>

                    {/* Elegant floating/sticky bottom bar strictly on Mobile Screen to handle Close, Order & New Tab actions */}
                    <div className="md:hidden bg-[#0c041bcc]/95 backdrop-blur-md border-t border-purple-500/20 p-3 px-4 flex items-center justify-between gap-3 z-40 shrink-0 select-none">
                      <button 
                        onClick={() => {
                          setDemoProduct(null);
                          setIsIframeLoading(true);
                        }}
                        className="flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 font-bold text-xs"
                      >
                        <span>ফিরুন</span>
                      </button>
                      
                      <div className="text-center">
                        <div className="text-[9px] text-slate-400 font-medium uppercase tracking-wider leading-none mb-0.5">
                          {showDiscountPrice ? "অফার মূল্য" : "এককালীন মূল্য"}
                        </div>
                        <div className="text-[14px] font-black text-purple-400 font-sans">
                          {showDiscountPrice && offerConfig?.discountPercentage ? (
                            <>
                              <span className="text-[10px] text-slate-500 line-through mr-1 text-xs">৳{demoProduct.price.toLocaleString("bn-BD")}</span>
                              ৳{(Math.round(demoProduct.price * (1 - offerConfig.discountPercentage / 100))).toLocaleString("bn-BD")}
                            </>
                          ) : (
                            `৳${demoProduct.price.toLocaleString("bn-BD")}`
                          )}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <a
                          href={getDemoLink(demoProduct.id, demoProduct)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2.5 rounded-xl bg-[#140a25] border border-purple-500/35 text-purple-300 flex items-center justify-center active:scale-95 transition-transform"
                          title="নতুন ট্যাবে খুলুন"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                        
                        <button
                          onClick={() => {
                            setDemoProduct(null);
                            onOrderRequest(demoProduct.title);
                          }}
                          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white font-black text-xs text-center cursor-pointer select-none transition-all duration-300 active:scale-95 shadow-md"
                        >
                          কিনুন (Buy)
                        </button>
                      </div>
                    </div>

                  </div>
                </div>

                {/* Right/Meta portion: Website summary & controls (Only visible on Desktop) */}
                <div className="hidden md:flex flex-1 flex-col justify-between text-left space-y-4">
                  
                  {/* Headline Info info card */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Smartphone className="w-5 h-5 text-purple-400" />
                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-purple-300 bg-purple-500/10 border border-purple-500/20 px-2.5 py-1 rounded-md inline-block">
                        লাইভ ডেমো মোবাইল প্রিভিউ
                      </span>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-black text-slate-100">
                      {demoProduct.title}
                    </h3>
                    
                    <p className="text-xs text-slate-400 font-sans leading-relaxed">
                      এটি একটি ডাইনামিক লাইভ প্রিভিউ। আপনিবাম পাশের ফোন উইন্ডোর ভেতরের সাইটটি স্ক্রোল ও বাটন ক্লিক করে সরাসরি ইন্টারঅ্যাক্ট করতে পারবেন।
                    </p>

                    {/* Helper box explaining frame security limits (X-Frame / CSP) */}
                    <div className="bg-purple-950/15 border border-purple-500/20 p-3.5 rounded-2xl flex gap-3 text-[11px] leading-relaxed text-purple-300">
                      <AlertCircle className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
                      <div>
                        <span className="font-black text-amber-300">নোট:</span> কিছু আধুনিক ওয়েবসাইট তাদের নিরাপত্তা পলিসির (CSP/X-Frame-Options) কারণে অন্য সাইটের সুড়ঙ্গে (IFrame) সরাসরি লোড নাও হতে পারে। যদি সাইটটি লোড না হয়, কাইন্ডলি নিচে দেওয়া <span className="text-white font-bold underline">নতুন ট্যাবে খুলুন</span> বাটনটি ব্যবহার করুন।
                      </div>
                    </div>
                  </div>

                  {/* Actions buttons */}
                  <div className="pt-4 border-t border-purple-500/10 space-y-3">
                    
                    {/* Price panel */}
                    <div className="flex justify-between items-center px-1">
                      <span className="text-[10px] text-slate-500 font-extrabold uppercase tracking-widest leading-none">
                        {showDiscountPrice ? "অফার ডেলিভারি মূল্য" : "এককালীন ডেলিভারি মূল্য"}
                      </span>
                      <p className="text-xl font-black text-purple-400 font-sans flex items-center">
                        {showDiscountPrice && offerConfig?.discountPercentage ? (
                          <>
                            <span className="text-xs text-slate-500 line-through mr-2 font-medium">৳{demoProduct.price.toLocaleString("bn-BD")}</span>
                            ৳{(Math.round(demoProduct.price * (1 - offerConfig.discountPercentage / 100))).toLocaleString("bn-BD")}
                          </>
                        ) : (
                          `৳${demoProduct.price.toLocaleString("bn-BD")}`
                        )}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                      {/* External Link Bypass Button */}
                      <a
                        href={getDemoLink(demoProduct.id, demoProduct)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-1.5 py-3 rounded-xl bg-[#140a25] border border-purple-500/30 hover:border-purple-500/60 font-black text-purple-300 hover:text-purple-100 text-xs shadow-md transition-all text-center select-none"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>নতুন ট্যাবে খুলুন</span>
                      </a>

                      {/* Click to Order directly */}
                      <button
                        onClick={() => {
                          setDemoProduct(null);
                          onOrderRequest(demoProduct.title);
                        }}
                        className="py-3 rounded-xl bg-gradient-to-r from-purple-600 to-rose-600 hover:from-purple-500 hover:to-rose-500 text-white text-xs font-black text-center select-none cursor-pointer transition-all duration-300 active:scale-95 hover:shadow-lg hover:shadow-purple-500/20"
                      >
                        কিনুন (Order Now)
                      </button>
                    </div>

                    <button
                      onClick={() => {
                        setDemoProduct(null);
                        setIsIframeLoading(true);
                      }}
                      className="w-full py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white text-xs font-bold hover:bg-slate-950 transition-colors cursor-pointer"
                    >
                      বন্ধ করুন (Close Frame)
                    </button>
                  </div>

                </div>

              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

// Beautifully Animated Limited-Time Special Offer Countdown-Timer with Bangla Date
function LiveSellAndOfferTimer() {
  const { offerConfig } = useContent();
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [isExpired, setIsExpired] = useState(false);

  // Countdown timer that resets dynamically at midnight or parses custom deadline
  useEffect(() => {
    if (!offerConfig || !offerConfig.show) {
      setIsExpired(true);
      return;
    }

    const calculateTimeLeft = () => {
      const now = new Date();
      let targetTime = 0;
      
      if (offerConfig.timerType === "custom_target" && offerConfig.customTargetDate) {
        try {
          targetTime = new Date(offerConfig.customTargetDate).getTime();
        } catch (e) {
          console.warn("Invalid custom target date configured:", e);
        }
      }
      
      if (!targetTime) {
        const endOfToday = new Date();
        endOfToday.setHours(23, 59, 59, 999);
        targetTime = endOfToday.getTime();
      }
      
      const diff = targetTime - now.getTime();
      
      if (diff <= 0) {
        if (offerConfig.timerType === "custom_target") {
          setIsExpired(true);
        }
        return { hours: 0, minutes: 0, seconds: 0 };
      }
      
      setIsExpired(false);
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      return { hours, minutes, seconds };
    };

    setTimeLeft(calculateTimeLeft());
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(interval);
  }, [offerConfig]);

  if (!offerConfig || !offerConfig.show || isExpired) {
    return null;
  }

  const formatBanglaNumber = (num: number) => {
    const banglaDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
    return num
      .toString()
      .split("")
      .map((char) => (isNaN(parseInt(char)) ? char : banglaDigits[parseInt(char)]))
      .join("");
  };

  const months = [
    "জানুয়ারি", "ফেব্রুয়ারি", "মার্চ", "এপ্রিল", "মে", "জুন",
    "জুলাই", "আগস্ট", "সেপ্টেম্বর", "অক্টোবর", "নভেম্বর", "ডিসেম্বর"
  ];
  const days = ["রবিবার", "সোমবার", "মঙ্গলবার", "বুধবার", "বৃহস্পতিবার", "শুক্রবার", "শনিবার"];
  
  const now = new Date();
  const dayName = days[now.getDay()];
  const dateStr = `${formatBanglaNumber(now.getDate())} ${months[now.getMonth()]} ${formatBanglaNumber(now.getFullYear())}`;

  return (
    <div className="offer-neon-card w-full max-w-5xl mx-auto mb-16 select-none animate-fade-in">
      <div className="offer-neon-inner p-4 sm:p-6 bg-gradient-to-r from-[#14082c] via-[#090214] to-[#120524]">
        {/* 
          Horizontal Premium Grid Texture Overlay
        */}
        <div className="absolute inset-0 bg-[radial-gradient(#271647_1px,transparent_1px)] [background-size:14px_14px] opacity-25 mix-blend-color-dodge pointer-events-none" />
        
        {/* Edge glows highlighting the beautiful flat card container */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-purple-500/40 to-transparent" />
        <div className="absolute bottom-0 inset-x-0 h-[1.2px] bg-gradient-to-r from-transparent via-fuchsia-500/20 to-transparent" />
        <div className="absolute -top-12 -left-12 w-28 h-28 bg-purple-600/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-28 h-28 bg-fuchsia-600/10 rounded-full blur-2xl pointer-events-none" />

        {/* Main Grid Content - Perfectly Aligned and Balanced */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center relative z-10 text-center lg:text-left">
          
          {/* Left Side (Col-span 4): Info and Dynamic Bangla Date */}
          <div className="lg:col-span-4 flex flex-col items-center lg:items-start space-y-1.5 border-b lg:border-b-0 lg:border-r border-purple-500/10 pb-4 lg:pb-0 lg:pr-6">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/25 text-purple-300">
              <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider">
                {offerConfig.badgeText || "আজকের বিশেষ মেগা অফার"}
              </span>
            </div>

            <div className="text-white text-xs sm:text-sm font-black flex items-center gap-2 font-sans bg-black/25 px-2.5 py-1 rounded-lg border border-purple-500/15">
              <Calendar className="w-4 h-4 text-purple-400 shrink-0" />
              <span>{dayName}, {dateStr}</span>
            </div>
          </div>

          {/* Center Side (Col-span 4): Flat, Rectangular, Glowing Countdown Timer Units */}
          <div className="lg:col-span-4 flex flex-col items-center">
            <div className="flex items-center justify-center gap-3.5">
              
              {/* Hour Rectangle Box with rotating loop neon outline */}
              <div className="flex flex-col items-center">
                <div className="timer-neon-card timer-neon-card-hour w-13 h-12 rounded-xl">
                  <div className="timer-neon-inner flex items-center justify-center">
                    <span className="font-mono text-base sm:text-lg font-extrabold text-white tracking-wider">
                      {formatBanglaNumber(timeLeft.hours).padStart(2, "০")}
                    </span>
                  </div>
                </div>
                <span className="text-[9.5px] text-purple-300 font-extrabold mt-1 tracking-wider uppercase font-sans">
                  ঘণ্টা
                </span>
              </div>

              <span className="font-mono text-base sm:text-lg text-purple-400 font-black animate-pulse pb-4">
                :
              </span>

              {/* Minute Rectangle Box with rotating loop neon outline */}
              <div className="flex flex-col items-center">
                <div className="timer-neon-card timer-neon-card-min w-13 h-12 rounded-xl">
                  <div className="timer-neon-inner flex items-center justify-center">
                    <span className="font-mono text-base sm:text-lg font-extrabold text-white tracking-wider">
                      {formatBanglaNumber(timeLeft.minutes).padStart(2, "০")}
                    </span>
                  </div>
                </div>
                <span className="text-[9.5px] text-fuchsia-300 font-extrabold mt-1 tracking-wider uppercase font-sans">
                  মিনিট
                </span>
              </div>

              <span className="font-mono text-base sm:text-lg text-fuchsia-400 font-black animate-pulse pb-4">
                :
              </span>

              {/* Second Rectangle Box with rotating loop neon outline */}
              <div className="flex flex-col items-center">
                <div className="timer-neon-card timer-neon-card-sec w-13 h-12 rounded-xl">
                  <div className="timer-neon-inner flex items-center justify-center">
                    <span className="font-mono text-base sm:text-lg font-extrabold text-rose-400 tracking-wider animate-[pulse_1s_infinite]">
                      {formatBanglaNumber(timeLeft.seconds).padStart(2, "০")}
                    </span>
                  </div>
                </div>
                <span className="text-[9.5px] text-rose-350 font-extrabold mt-1 tracking-wider uppercase font-sans">
                  সেকেন্ড
                </span>
              </div>

            </div>
          </div>

          {/* Right Side (Col-span 4): Urgency Statement and blinking flame icon */}
          <div className="lg:col-span-4 flex flex-col items-center lg:items-end justify-center text-center lg:text-right border-t lg:border-t-0 lg:border-l border-purple-500/10 pt-4 lg:pt-0 lg:pl-6 space-y-1">
            <div className="flex items-center gap-1 text-fuchsia-400">
              <Flame className="w-4 h-4 animate-pulse" />
              <span className="text-xs font-extrabold">{offerConfig.urgencyText || "দ্রুত ফুরিয়ে যাচ্ছে!"}</span>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-400 font-bold leading-relaxed max-w-xs lg:max-w-none">
              {offerConfig.descriptionText || "সীমিত সময়ের মেগা ফ্ল্যাশ ডিল শেষ হওয়ার পূর্বেই অর্ডার কনফার্ম করে ওয়েবসাইট ওনারশিপ বুঝে নিন।"}
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
