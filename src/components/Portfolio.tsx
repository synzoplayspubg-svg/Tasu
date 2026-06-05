import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useContent } from "../context/ContentContext";
import ScrollBlurReveal from "./ScrollBlurReveal";
import { 
  FolderGit2, 
  ExternalLink, 
  Calendar, 
  User, 
  Layers, 
  ArrowUpRight,
  LayoutGrid,
  Smartphone,
  Code2,
  ShoppingCart,
  Briefcase,
  FileText
} from "lucide-react";

interface PortfolioProps {
  onOrderRequest?: (projectTitle: string) => void;
}

export default function Portfolio({ onOrderRequest }: PortfolioProps) {
  const { portfolio, portfolioCategories = [], sectionHeadings, contactConfig } = useContent();
  const [filter, setFilter] = useState("All");

  const activeCategories = portfolioCategories.filter(cat => cat.active);

  const getFormattedUrl = (url?: string) => {
    if (!url || !url.trim()) {
      return "#";
    }
    const trimmed = url.trim();
    if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
      return trimmed;
    }
    return `https://${trimmed}`;
  };

  const getIconComponent = (iconName?: string) => {
    switch (iconName) {
      case "Smartphone": return Smartphone;
      case "Code2": return Code2;
      case "ShoppingCart": return ShoppingCart;
      case "Briefcase": return Briefcase;
      case "FileText": return FileText;
      default: return Layers;
    }
  };

  const categoryConfig = [
    { id: "All", label: "সব প্রজেক্ট", icon: LayoutGrid },
    ...activeCategories.map(cat => ({
      id: cat.id,
      label: cat.label,
      icon: getIconComponent(cat.iconName)
    }))
  ];

  const filteredItems = filter === "All" 
    ? portfolio 
    : portfolio.filter(item => item.category === filter);

  return (
    <section id="portfolio" className="relative py-24 bg-transparent overflow-hidden">
      {/* Dynamic graphic lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-purple-500/5 to-fuchsia-500/5 rounded-full blur-[130px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 md:px-8 z-10">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16 space-y-5">
          
          <motion.h2 
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, amount: 0.05 }}
            transition={{ type: "spring", stiffness: 40, damping: 15 }}
            className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white leading-tight"
          >
            {(() => {
              const title = sectionHeadings?.portfolioTitle || "আমাদের ডিজাইন ও ডেভেলাপমেন্ট পোর্টফোলিও";
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
                <span className="inline-block flex-wrap justify-center">
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
            text={sectionHeadings?.portfolioSubtitle || "আমরা সেরা টেকনোলজি এবং বেস্ট প্র্যাক্টিস ব্যবহার করে যেসকল ক্লায়েন্ট প্রজেক্ট যথাসময়ে সম্পন্ন করেছি, তার কয়েকটি ঝলক নিচে তুলে ধরা হলো।"}
            className="text-slate-400 text-xs sm:text-sm md:text-base leading-relaxed max-w-2xl mx-auto"
            as="p"
            delay={0.12}
            stagger={0.03}
          />

          {/* Filter Navigation Buttons */}
          <div className="pt-4 flex justify-center w-full">
            <div className="flex flex-wrap justify-center items-center gap-2 bg-[#0d041c]/90 p-2 rounded-2xl border border-purple-950/40 shadow-inner max-w-full overflow-x-auto relative">
              {categoryConfig.map((cat, idx) => {
                const Icon = cat.icon;
                const isActive = filter === cat.id;
                const count = cat.id === "All"
                  ? portfolio.length
                  : portfolio.filter(item => item.category === cat.id).length;

                return (
                  <button
                    id={`portfolio-filter-btn-${idx}`}
                    key={cat.id}
                    onClick={() => setFilter(cat.id)}
                    className={`relative px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all duration-300 cursor-pointer select-none outline-none group ${
                      isActive ? "text-purple-200" : "text-slate-450 hover:text-slate-200"
                    }`}
                  >
                    {/* Sliding Background */}
                    {isActive && (
                      <motion.div
                        layoutId="activeCategoryBg"
                        className="absolute inset-0 bg-gradient-to-r from-purple-500/15 via-fuchsia-500/10 to-pink-500/15 border border-purple-500/30 rounded-xl backdrop-blur-md shadow-[0_0_20px_rgba(168,85,247,0.12)] z-0"
                        transition={{ type: "spring", stiffness: 350, damping: 26 }}
                      />
                    )}

                    {/* Icon with beautiful gradient touch */}
                    <Icon className={`w-4 h-4 relative z-10 transition-transform duration-350 shrink-0 ${
                      isActive ? "scale-110 text-purple-400" : "text-slate-600 group-hover:scale-105 group-hover:text-slate-400"
                    }`} />

                    {/* Category text key */}
                    <span className="relative z-10 whitespace-nowrap">{cat.label}</span>

                    {/* Count indicator dynamic tab */}
                    <span className={`relative z-10 px-2 py-0.5 rounded-full text-[9px] font-sans font-black tracking-tight leading-none transition-all duration-300 shrink-0 ${
                      isActive
                        ? "bg-purple-500/25 text-purple-200 border border-purple-400/20"
                        : "bg-[#070112] text-slate-600 border border-slate-900/40"
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Portfolio Dynamic Grid List */}
        <motion.div 
          layout
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch"
        >
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item) => (
              <motion.div
                id={`portfolio-card-${item.id}`}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                key={item.id}
                className="bg-[#130725]/40 border border-purple-950/40 hover:border-purple-500/20 rounded-2xl overflow-hidden shadow-lg hover:shadow-purple-500/5 group flex flex-col justify-between transition-all"
              >
                {/* Image Section representation with hover premium indicators */}
                <a 
                  href={getFormattedUrl(item.demoUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative overflow-hidden aspect-video bg-slate-950 cursor-pointer group/img block"
                >
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-500"
                  />
                  {/* Decorative glassmorphism tag */}
                  <span className="absolute top-4 left-4 bg-slate-950/85 backdrop-blur-md border border-slate-800 text-[10px] sm:text-xs font-semibold text-purple-400 px-3 py-1 rounded-full shadow-md z-10">
                    {item.category}
                  </span>

                  {/* Ultimate glassmorphism hover cover */}
                  <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs opacity-0 group-hover/img:opacity-100 flex items-center justify-center transition-all duration-350 z-20">
                    <div className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white font-black text-xs sm:text-sm flex items-center gap-1.5 shadow-lg shadow-purple-500/30 scale-90 group-hover/img:scale-100 transition-all duration-350">
                      <span>সরাসরি ওয়েবসাইট দেখুন</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                  </div>
                </a>

                {/* Info block */}
                <div className="p-6 flex-grow flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-slate-100 group-hover:text-purple-300 transition-colors mb-3 leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mb-6">
                      {item.description}
                    </p>
                  </div>

                  {/* Project metadata */}
                  <div className="space-y-4 pt-4 border-t border-slate-800/60 mt-auto">
                    {/* Client & Year */}
                    <div className="flex justify-between items-center text-[11px] sm:text-xs text-slate-400 font-medium font-sans">
                      <div className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-purple-500/80" />
                        <span>ক্লায়েন্ট: {item.client}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-purple-500/80" />
                        <span>সাল: {item.year}</span>
                      </div>
                    </div>

                    {/* Tag bubbles */}
                    <div className="flex flex-wrap gap-1.5 pb-1">
                      {item.tags.map((tag, i) => (
                        <span 
                          key={i} 
                          className="text-[10px] font-bold text-purple-300 bg-purple-500/5 px-2.5 py-1 rounded-full border border-purple-500/10"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Interactive "Visit Website" direct anchor link */}
                    <a
                      href={getFormattedUrl(item.demoUrl)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full mt-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600/10 via-fuchsia-600/10 to-pink-600/10 hover:from-purple-600 hover:via-fuchsia-600 hover:to-pink-600 border border-purple-500/20 hover:border-transparent text-purple-300 hover:text-white text-xs sm:text-sm font-black flex items-center justify-center gap-1.5 transition-all duration-300 cursor-pointer shadow-md select-none group/view-btn"
                    >
                      <ExternalLink className="w-4 h-4 text-purple-400 group-hover/view-btn:text-white transition-colors" />
                      <span>সরাসরি ওয়েবসাইট দেখুন</span>
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>




      </div>
    </section>
  );
}
