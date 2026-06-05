import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { safeLocalStorage } from "../utils/safeStorage";
import { 
  Home, 
  Sparkles, 
  Briefcase, 
  Globe, 
  Award, 
  MessageSquare, 
  Users, 
  PhoneCall, 
  Compass, 
  X,
  Zap
} from "lucide-react";

interface FloatingNavProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
}

export default function FloatingNav({ activeSection, onNavigate }: FloatingNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  
  // Keep track of whether the initial guide comment has been dismissed
  const [isGuideDismissed, setIsGuideDismissed] = useState<boolean>(() => {
    try {
      const dismissed = safeLocalStorage.getItem("avexon_floating_nav_guide_dismissed");
      return dismissed === "true";
    } catch {
      return false;
    }
  });

  // Monitor scroll height to show/hide quick Scroll-to-Top feature
  useEffect(() => {
    const handleScroll = () => {
      const isOver = window.scrollY > 400;
      setShowScrollTop(prev => prev !== isOver ? isOver : prev);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const sections = [
    { id: "hero", labelBn: "হোম", labelEn: "Home", icon: Home },
    { id: "services", labelBn: "সার্ভিস", labelEn: "Services", icon: Sparkles },
    { id: "portfolio", labelBn: "পোর্টফোলিও", labelEn: "Portfolio", icon: Briefcase },
    { id: "websites", labelBn: "রেডিমেড ওয়েবসাইট", labelEn: "Websites", icon: Globe },
    { id: "customise", labelBn: "প্যাকেজ রেডি করুন", labelEn: "Custom Plan", icon: Zap },
    { id: "why-choose-us", labelBn: "কেন আমরা", labelEn: "Why Us", icon: Award },
    { id: "reviews", labelBn: "রিভিউস", labelEn: "Reviews", icon: MessageSquare },
    { id: "team", labelBn: "টিম", labelEn: "Our Team", icon: Users },
    { id: "contact", labelBn: "যোগাযোগ", labelEn: "Contact", icon: PhoneCall },
  ];

  const dismissGuide = () => {
    setIsGuideDismissed(true);
    try {
      safeLocalStorage.setItem("avexon_floating_nav_guide_dismissed", "true");
    } catch (e) {
      console.warn("safeLocalStorage is not available: ", e);
    }
  };

  const handleSectionClick = (id: string) => {
    dismissGuide();
    onNavigate(id);
    setIsOpen(false); // Auto close menu after navigation for better UX
  };

  const handleBannerClick = () => {
    dismissGuide();
    setIsOpen(true);
  };

  const handleTriggerClick = () => {
    dismissGuide();
    setIsOpen(!isOpen);
  };

  return (
    <div id="floating-navigation-system" className="fixed bottom-6 right-6 lg:bottom-10 lg:right-10 z-50 flex flex-col items-end gap-3 lg:gap-4 pointer-events-none">
      
      {/* 2. Main Expanded Navigation Hub */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="floating-nav-panel"
            initial={{ opacity: 0, y: 20, scale: 0.95, originY: 1, originX: 1 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 350, damping: 26 }}
            className="pointer-events-auto w-80 max-w-[calc(100vw-2.5rem)] bg-[#070211]/96 border border-purple-500/20 rounded-3xl p-4.5 shadow-2xl shadow-purple-950/40 backdrop-blur-2xl relative overflow-hidden"
          >
            {/* Ambient Background Glow Effect inside panel */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-purple-600/10 blur-2xl rounded-full pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-800/10 blur-2xl rounded-full pointer-events-none" />

            {/* Header portion */}
            <div className="flex flex-col gap-1 pb-2.5 mb-3 border-b border-purple-950/50 relative z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse animate-duration-1000" />
                  <span className="text-[10px] font-bold tracking-widest text-purple-400 uppercase font-mono">
                    Navigator 🧭
                  </span>
                </div>
                <button
                  id="btn-close-nav-panel"
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-purple-950/50 transition-colors cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Compact 3-Column Bento Grid */}
            <div className="grid grid-cols-3 gap-1.5 relative z-10">
              {sections.map((section, idx) => {
                const isActive = activeSection === section.id;
                const IconComponent = section.icon;

                return (
                  <motion.button
                    id={`floating-nav-item-${section.id}`}
                    key={section.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.015 }}
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleSectionClick(section.id)}
                    className={`flex flex-col items-center justify-center p-2 rounded-2xl transition-all duration-200 cursor-pointer text-center relative group min-h-[66px] ${
                      isActive 
                        ? "bg-purple-600/20 border border-purple-500/40 text-purple-200" 
                        : "bg-purple-950/10 hover:bg-purple-950/45 text-slate-400 hover:text-purple-200 border border-purple-500/5 hover:border-purple-500/20"
                    }`}
                  >
                    <div className={`p-1 rounded-lg transition-all ${
                      isActive 
                        ? "text-purple-300" 
                        : "text-slate-500 group-hover:text-purple-400"
                    }`}>
                      <IconComponent className="w-4 h-4" />
                    </div>
                    
                    <span className="text-[10px] font-sans font-semibold leading-tight text-slate-300 group-hover:text-white transition-colors line-clamp-1 mt-1">
                      {section.labelBn}
                    </span>
                    <span className="text-[7px] font-mono text-slate-600 group-hover:text-purple-400/80 transition-colors mt-0.5 uppercase tracking-tighter">
                      {section.labelEn}
                    </span>

                    {/* Active dynamic indicator line */}
                    {isActive && (
                      <motion.div 
                        layoutId="activePointerDot" 
                        className="absolute bottom-1 w-5 h-[2px] rounded-full bg-purple-400 shadow-[0_0_6px_rgba(168,85,247,0.8)]" 
                      />
                    )}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. Primary Rotating Glow FAB Trigger and Helpful Side-Banner */}
      <div className="flex items-center gap-2 pointer-events-none">
        {/* Sparkle Explanatory Side Tooltip (In Bangla + En) */}
        <AnimatePresence>
          {!isOpen && !isGuideDismissed && (
            <motion.div
              id="floating-nav-guide-banner"
              initial={{ opacity: 0, x: 15, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 15, scale: 0.95 }}
              transition={{ delay: 0.4, duration: 0.3 }}
              className="pointer-events-auto flex items-center gap-2.5 bg-[#070210]/95 border border-purple-500/20 hover:border-purple-400/40 px-3 py-2 rounded-xl shadow-lg shadow-purple-950/20 backdrop-blur-md select-none group/guide cursor-pointer"
              onClick={handleBannerClick}
            >

              <div className="flex flex-col text-left">
                <span className="text-[11px] font-sans font-bold text-purple-200 group-hover/guide:text-purple-300 transition-colors">
                  দ্রুত ন্যাভিগেট করুন 🧭
                </span>
                <span className="text-[9px] text-slate-500 leading-none font-sans mt-0.5">
                  ওয়েবসাইটের যেকোনো লিঙ্কে যেতে ক্লিক করুন
                </span>
              </div>
              
              {/* Manual Close Button inside Guide Banner */}
              <button
                id="btn-close-guide-banner"
                onClick={(e) => {
                  e.stopPropagation();
                  dismissGuide();
                }}
                className="p-1 rounded-lg text-slate-500 hover:text-white hover:bg-white/5 transition-colors ml-1 cursor-pointer"
                title="বন্ধ করুন"
              >
                <X className="w-3 h-3" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="relative">


          <motion.button
            id="btn-floating-nav-trigger"
            onClick={handleTriggerClick}
            className="pointer-events-auto timer-neon-card timer-neon-card-hour w-14 h-14 lg:w-20 lg:h-20 rounded-xl lg:rounded-2xl shadow-2xl focus:outline-none cursor-pointer group active:scale-95 shadow-[0_0_20px_rgba(168,85,247,0.35)]"
            whileHover={{ scale: 1.08 }}
          >
            {/* Inner mask styled button matches the timer shape */}
            <div className="timer-neon-inner flex items-center justify-center">
              <AnimatePresence mode="wait">
                {isOpen ? (
                  <motion.div
                    key="close-icon"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="w-6 h-6 lg:w-9 lg:h-9 text-fuchsia-400" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu-icon"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center justify-center pointer-events-none"
                  >
                    <Compass className="w-6 h-6 lg:w-9 lg:h-9 text-purple-400 group-hover:text-purple-300 transition-colors duration-300 animate-pulse" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.button>
        </div>
      </div>

    </div>
  );
}
