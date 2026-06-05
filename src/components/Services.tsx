import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useContent } from "../context/ContentContext";
import ScrollBlurReveal from "./ScrollBlurReveal";
import { 
  Palette, 
  Globe, 
  ShoppingCart, 
  Sparkles, 
  ShieldCheck,
  CheckCircle2,
  Cpu,
  ChevronDown,
  X,
  ArrowUpRight,
  Clock,
  Layers
} from "lucide-react";

interface ServicesProps {
  onContactRequest: () => void;
}

export default function Services({ onContactRequest }: ServicesProps) {
  const { services, sectionHeadings } = useContent();
  // Track which service details are currently expanded
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({});

  const toggleDetails = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedIds(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "Figma":
        return <Palette className="w-6 h-6 text-purple-400" />;
      case "Globe":
        return <Globe className="w-6 h-6 text-blue-400" />;
      case "ShoppingCart":
        return <ShoppingCart className="w-6 h-6 text-indigo-400" />;
      case "Sparkles":
        return <Sparkles className="w-6 h-6 text-amber-400" />;
      default:
        return <Globe className="w-6 h-6 text-purple-400" />;
    }
  };

  return (
    <section id="services" className="relative py-24 bg-transparent overflow-hidden">
      {/* Dynamic ambient backgrounds */}
      <div className="absolute inset-0 bg-[#07020e]/10" />
      <div className="absolute top-1/4 left-0 w-80 h-80 bg-purple-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-[400px] h-[400px] bg-fuchsia-500/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-4 md:px-8 z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-5">
          
          <motion.h2 
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, amount: 0.05 }}
            transition={{ type: "spring", stiffness: 40, damping: 15 }}
            className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white leading-tight"
          >
            {(() => {
              const title = sectionHeadings?.servicesTitle || "আমাদের সেবা বিস্তারিত";
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
            text={sectionHeadings?.servicesSubtitle || "প্রয়োজন অনুযায়ী সার্ভিস সিলেক্ট করে বিস্তারিত দেখতে পারেন। আমরা শতভাগ কোডিং কোয়ালিটি ও সিকিউরিটি নিশ্চিত প্রদান করি।"}
            className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-2xl mx-auto"
            as="p"
            delay={0.15}
            stagger={0.03}
          />
        </div>

        {/* Compact Rectangle Services List with alternating side slide animation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {services.map((srv, idx) => {
            const isExpanded = !!expandedIds[srv.id];
            // Alternating side slide direction (Left for even, Right for odd) to slide smoothly into place
            const isLeft = idx % 2 === 0;
            const staggerDelay = (idx % 2) * 0.12;

            return (
              <motion.div
                id={`service-card-wrapper-${srv.id}`}
                key={srv.id}
                initial={{ opacity: 0, x: isLeft ? -45 : 45, y: 8 }}
                whileInView={{ opacity: 1, x: 0, y: 0 }}
                viewport={{ once: true, amount: 0.02 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 45, 
                  damping: 17,
                  delay: 0.05 + staggerDelay
                }}
                style={{ willChange: "transform, opacity" }}
                className="w-full"
              >
                <div
                  id={`service-card-${srv.id}`}
                  className={`neon-card-border-container ${
                    isExpanded 
                      ? "card-expanded shadow-[0_10px_30px_rgba(168,85,247,0.18)]" 
                      : "shadow-lg shadow-black/30 hover:shadow-[0_8px_25px_rgba(168,85,247,0.12)]"
                  }`}
                >
                  <div className="neon-card-inner-content group bg-[#11051f]/95 hover:bg-[#160a2b]/95 transition-colors duration-300">

                  {/* Compact Rectangular Layout Header */}
                  <div className="p-5 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5 min-w-0">
                      {/* Icon */}
                      <div className="p-3 rounded-xl bg-[#0e041d] border border-purple-500/10 group-hover:border-purple-500/20 flex-shrink-0">
                        {getIcon(srv.iconName)}
                      </div>
                      
                      {/* Title & short preview */}
                      <div className="min-w-0">
                        <h3 className="text-base font-bold text-slate-100 group-hover:text-purple-400 transition-colors leading-snug truncate">
                          {srv.title}
                        </h3>
                        <p className="text-slate-400 text-xs mt-0.5 truncate max-w-[240px] md:max-w-[180px] lg:max-w-[260px]">
                          {srv.description}
                        </p>
                      </div>
                    </div>

                    {/* Toggle Button Details */}
                    <button
                      id={`service-toggle-${srv.id}`}
                      onClick={(e) => toggleDetails(srv.id, e)}
                      className={`flex-shrink-0 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all duration-300 cursor-pointer ${
                        isExpanded
                          ? "bg-rose-500/10 border border-rose-500/35 text-rose-400 hover:bg-rose-500/20"
                          : "bg-purple-500/10 border border-purple-500/25 text-purple-300 hover:bg-purple-600/20"
                      }`}
                    >
                      {isExpanded ? (
                        <>
                          <span>বন্ধ করুন</span>
                          <X className="w-3.5 h-3.5" />
                        </>
                      ) : (
                        <>
                          <span>বিস্তারিত</span>
                          <ChevronDown className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-y-0.5" />
                        </>
                      )}
                    </button>
                  </div>

                  {/* Expanded Details Slide Panel */}
                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-5 pt-1 border-t border-purple-950/30 bg-[#0d041b]/60">
                          {/* Inner detailed rich text description */}
                          <div className="space-y-4 text-left">
                            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-normal">
                              {srv.description}
                            </p>

                            {/* Tech Stack list */}
                            <div className="space-y-2">
                              <h4 className="text-[11px] font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
                                <Cpu className="w-3.5 h-3.5" />
                                ব্যবহৃত টেকনোলজিস ও ফিচারস:
                              </h4>
                              <div className="flex flex-wrap gap-1.5">
                                {srv.techs.map((t, idxTech) => (
                                  <span
                                    key={idxTech}
                                    className="text-[10px] font-medium text-slate-300 bg-slate-950/80 px-2.5 py-1 rounded-lg border border-purple-950/30"
                                  >
                                    {t}
                                  </span>
                                ))}
                              </div>
                            </div>

                            {/* Deliverables footer */}
                            <div className="pt-4 border-t border-purple-950/30 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3.5 mt-2">
                              <div className="flex items-center gap-2 text-slate-400 text-xs">
                                <Clock className="w-3.5 h-3.5 text-purple-400" />
                                <span>সম্ভাব্য সময়কাল: <strong className="text-slate-200">{srv.duration}</strong></span>
                              </div>

                              {/* Order Call Action */}
                              <button
                                id={`service-order-${srv.id}`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onContactRequest();
                                }}
                                className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 text-[11px] font-bold text-white hover:shadow-lg hover:shadow-purple-900/30 transition-all duration-300 cursor-pointer"
                              >
                                <span>অর্ডার করুন</span>
                                <ArrowUpRight className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          );
        })}
        </div>

        {/* Feature badges footer inside service section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.05 }}
          transition={{ type: "spring", stiffness: 40, damping: 15, delay: 0.1 }}
          className="mt-16 bg-[#110620]/60 border border-purple-950/40 rounded-3xl p-6.5 md:p-8 flex flex-col md:flex-row items-center justify-around gap-6 text-center md:text-left shadow-2xl relative overflow-hidden"
        >
          {/* subtle ambient light behind badges footer */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-4 bg-purple-500/10 rounded-full blur-md" />

          <div className="flex items-center gap-3.5">
            <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20">
              <CheckCircle2 className="w-6 h-6 text-purple-400 flex-shrink-0" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-200">১০০% কাস্টম কোডিং ও ডিজাইন</h4>
              <p className="text-xs text-slate-400 mt-0.5">কোনো ক্র্যাকড টেমপ্লেট বা অপ্রয়োজনীয় ভারী বিল্ডার বাদেই</p>
            </div>
          </div>
          <div className="w-full md:w-px h-px md:h-12 bg-purple-950/40" />
          <div className="flex items-center gap-3.5">
            <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20">
              <CheckCircle2 className="w-6 h-6 text-purple-400 flex-shrink-0" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-200">সার্বক্ষণিক প্রোগ্রেস এবং ডেমো প্রিভিউ</h4>
              <p className="text-xs text-slate-400 mt-0.5">লাইভ সার্ভার লিংকের মাধ্যমে সার্বক্ষণিক লাইভ প্রজেক্ট ট্র্যাকিং</p>
            </div>
          </div>
          <div className="w-full md:w-px h-px md:h-12 bg-purple-950/40" />
          <div className="flex items-center gap-3.5">
            <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20">
              <CheckCircle2 className="w-6 h-6 text-purple-400 flex-shrink-0" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-200">ডেডিকেটেড মেইনটেইন্যান্স ও লাইফটাইম সাপোর্ট</h4>
              <p className="text-xs text-slate-400 mt-0.5">যেকোনো টেকনিক্যাল ত্রুটি বা পরিবর্তনের জন্য আজীবন সাপোর্ট ফাইল</p>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
