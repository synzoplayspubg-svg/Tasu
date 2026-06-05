import React from "react";
import { motion } from "motion/react";
import { 
  Home, 
  Palette, 
  Briefcase, 
  Users, 
  Video, 
  Clock, 
  ArrowUpRight, 
  ChevronRight,
  TrendingUp,
  Award,
  Terminal,
  Sparkles,
  MessageSquare,
  ShieldCheck,
  Folder,
  Layers
} from "lucide-react";
import { useContent } from "../context/ContentContext";

interface HeroProps {
  onNavigate: (sectionId: string) => void;
}

export default function Hero({ onNavigate }: HeroProps) {
  const { hero, owner } = useContent();

  // Hero badge items matching the image
  const badges = [
    { icon: <Home className="w-4 h-4 text-purple-400" />, label: "ইনস্ট্যান্ট সেটআপ" },
    { icon: <Palette className="w-4 h-4 text-purple-400" />, label: "কাস্টম ডিজাইন ও ডেভেলপমেন্ট" },
    { icon: <Briefcase className="w-4 h-4 text-[#d8b4fe]" />, label: "১০০% কোডিং গ্যারান্টি" },
  ];

  // Specific features matching the list uniquely
  const features = [
    {
      title: "রেডিমেড ওয়েবসাইট শপ",
      icon: <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
    },
    {
      title: "ইনস্ট্যান্ট রেডি টু গো",
      icon: <Clock className="w-3.5 h-3.5 text-fuchsia-400" />
    },
    {
      title: "রিকোয়ারমেন্ট ভিত্তিক কাস্টম সাইট",
      icon: <Layers className="w-3.5 h-3.5 text-purple-400" />
    },
    {
      title: "ডিজাইন ও ডেভেলপমেন্ট",
      icon: <Palette className="w-3.5 h-3.5 text-fuchsia-400" />
    },
    {
      title: "লাইফটাইম সাপোর্ট",
      icon: <MessageSquare className="w-3.5 h-3.5 text-purple-400" />
    },
    {
      title: "নিরাপত্তা ও মেইনটেইন্যান্স",
      icon: <ShieldCheck className="w-3.5 h-3.5 text-fuchsia-400" />
    }
  ];

  const stats = [
    { value: "১৫০+", label: "সফল ওয়েবসাইট ডেমো" },
    { value: "১০০+", label: "রেডিমেড প্রফেশনাল মডেলস" },
    { value: "৯৮.৫%", label: "ইতিবাচক ক্লায়েন্ট ফিডব্যাক" }
  ];

  return (
    <section 
      id="hero" 
      className="relative min-h-screen pt-[136px] pb-16 flex items-center bg-transparent overflow-hidden"
    >
      {/* Premium Ambient Background Lighting */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-gradient-to-tr from-purple-500/15 to-fuchsia-500/5 rounded-full blur-[120px] pointer-events-none -translate-y-1/2" />
      <div className="absolute bottom-10 right-0 w-[450px] h-[450px] bg-gradient-to-tr from-purple-600/5 to-fuchsia-600/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[300px] h-[300px] bg-purple-500/5 rounded-full blur-[90px] pointer-events-none" />

      {/* Grid Pattern overlays */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(88,28,135,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(88,28,135,0.08)_1px,transparent_1px)] bg-[size:40px_40px] opacity-25 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 md:px-8 w-full z-10">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Bengali Text Presentation (Strictly matched to design) */}
          <div className="lg:col-span-7 flex flex-col items-start text-left space-y-5 md:space-y-6">
            
            {/* Tag Pills (Home Study, Design Training, Career Building) */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.05 }}
              transition={{ type: "spring", stiffness: 45, damping: 14 }}
              className="flex flex-wrap items-center gap-3"
            >
              {badges.map((badge, idx) => (
                <div 
                  key={idx}
                  className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#180C2C] border border-purple-950/50 hover:border-purple-500/30 text-xs md:text-sm font-semibold text-slate-300 shadow-md transition-all duration-300"
                >
                  {badge.icon}
                  <span>{badge.label}</span>
                </div>
              ))}
            </motion.div>

            {/* Grouped typography to keep gaps minimal, beautiful & unique */}
            <div className="flex flex-col gap-1.5 sm:gap-2.5 w-full">
              {/* Main Headline (Perfect typography pairing) */}
              <motion.h1 
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.05 }}
                transition={{ type: "spring", stiffness: 40, damping: 13, delay: 0.15 }}
                className="text-left flex flex-col gap-0.5 sm:gap-1"
              >
                <motion.span 
                  animate={{
                    backgroundPosition: ["0% center", "-200% center"],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  style={{
                    backgroundImage: "linear-gradient(120deg, #3b0764 0%, #c084fc 25%, #f3e8ff 50%, #c084fc 75%, #3b0764 100%)",
                    backgroundSize: "200% auto",
                  }}
                  className="text-3xl sm:text-4xl md:text-5xl lg:text-[56px] font-black tracking-tight leading-none bg-clip-text text-transparent filter drop-shadow-[0_2px_10px_rgba(168,85,247,0.30)] select-none pr-2 inline-block pt-1 pb-1"
                >
                  {(() => {
                    if (hero && hero.title) {
                      const cleanTitle = hero.title.trim();
                      const parenIndex = cleanTitle.search(/[(（]/);
                      if (parenIndex !== -1) return cleanTitle.substring(0, parenIndex).trim();
                      const spaceIndex = cleanTitle.indexOf(" ");
                      if (spaceIndex !== -1) return cleanTitle.substring(0, spaceIndex).trim();
                      return cleanTitle;
                    }
                    return "এভেক্সন";
                  })()}
                </motion.span>
                <span className="text-4xl sm:text-5xl md:text-6xl lg:text-[72px] font-extrabold text-white leading-tight md:leading-none select-none tracking-tight">
                  {(() => {
                    if (hero && hero.title) {
                      const cleanTitle = hero.title.trim();
                      const parenIndex = cleanTitle.search(/[(（]/);
                      if (parenIndex !== -1) return cleanTitle.substring(parenIndex).trim();
                      const spaceIndex = cleanTitle.indexOf(" ");
                      if (spaceIndex !== -1) return cleanTitle.substring(spaceIndex + 1).trim();
                      return "";
                    }
                    return "স্মার্ট ওয়েবসাইট সলিউশন";
                  })()}
                </span>
              </motion.h1>

              {/* Subheading with minimal gap */}
              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.05 }}
                transition={{ type: "spring", stiffness: 45, damping: 14, delay: 0.25 }}
                className="text-base sm:text-lg md:text-xl font-black text-white text-left tracking-tight mt-1"
              >
                আপনার ব্যবসার জন্য প্রফেশনাল{" "}
                <motion.span 
                  animate={{
                    backgroundPosition: ["0% center", "-200% center"],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  style={{
                    backgroundImage: "linear-gradient(120deg, #3b0764 0%, #c084fc 25%, #f3e8ff 50%, #c084fc 75%, #3b0764 100%)",
                    backgroundSize: "200% auto",
                  }}
                  className="text-transparent bg-clip-text font-black border-b-2 border-purple-500/30 pb-0.5 inline-block filter drop-shadow-[0_1px_4px_rgba(192,132,252,0.3)] select-none"
                >
                  ডিজাইন ও ডেভেলপমেন্ট
                </motion.span>{" "}
              </motion.h2>

              {/* Description Paragraph with snug top margin */}
              <motion.p 
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.05 }}
                transition={{ type: "spring", stiffness: 40, damping: 15, delay: 0.35 }}
                className="text-slate-300 text-[13px] sm:text-[14px] md:text-[14.5px] leading-relaxed max-w-2xl text-left font-normal mt-1.5 md:mt-2"
              >
                {hero && hero.subtitle && (hero.subtitle !== "আপনার ব্যবসার জন্য প্রফেশনাল ডিজাইন ও ডেভেলপমেন্ট এবং সাশ্রয়ী রেডিমেড ওয়েবসাইট সলিউশন!" && hero.subtitle.trim().length > 0) ? (
                  hero.subtitle
                ) : (
                  <>
                    নতুন উদ্যোক্তাদের স্বপ্ন পূরণে সবচেয়ে সাশ্রয়ী ও কম খরচে কোয়ালিটি সম্পন্ন রেডিমেড ই-কমার্স, ল্যান্ডিং পেজ বা ড্রপশিপিং পোর্টাল ডেভেলপ করে{" "}
                    <motion.span
                      animate={{
                        backgroundPosition: ["0% center", "-200% center"],
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      style={{
                        backgroundImage: "linear-gradient(120deg, #3b0764 0%, #c084fc 25%, #f3e8ff 50%, #c084fc 75%, #3b0764 100%)",
                        backgroundSize: "200% auto",
                      }}
                      className="font-black text-transparent bg-clip-text inline-block filter drop-shadow-[0_1px_6px_rgba(192,132,252,0.4)] select-none pr-1"
                    >
                      Avexon
                    </motion.span>
                    । আমরা সম্পূর্ণ গ্রাহকের পছন্দ ও রিকোয়ারমেন্ট অনুযায়ী প্রিমিয়াম ও দ্রুতগতির ওয়েবসাইট দারুণ ডিজাইন সহ কাস্টমাইজ করে থাকি।
                  </>
                )}
              </motion.p>
            </div>

            {/* Unique, highly compact grid of beautiful micro-cards for features */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.05 }}
              transition={{ type: "spring", stiffness: 35, damping: 14, delay: 0.45 }}
              className="w-full max-w-xl grid grid-cols-2 sm:grid-cols-3 gap-2.5 md:gap-3"
            >
              {features.map((feat, idx) => (
                <div 
                  key={idx} 
                  className="flex items-center gap-2.5 px-3.5 py-3 rounded-xl bg-[#090114]/85 border border-purple-900/35 hover:border-purple-500/40 hover:bg-[#120324]/95 shadow-lg shadow-black/35 hover:shadow-purple-500/10 transition-all duration-300 group overflow-hidden relative"
                >
                  {/* Subtle glowing card accent border snippet */}
                  <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-purple-700 to-fuchsia-500 opacity-60 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="p-1 rounded-lg bg-purple-500/10 text-purple-400 group-hover:bg-purple-500/15 group-hover:text-purple-300 transition-colors flex-shrink-0">
                    {feat.icon}
                  </div>
                  <span className="text-[11.5px] sm:text-[12.5px] font-bold text-slate-200 group-hover:text-white transition-colors leading-snug tracking-tight">
                    {feat.title}
                  </span>
                </div>
              ))}
            </motion.div>

            {/* Call to action element */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.05 }}
              transition={{ type: "spring", stiffness: 35, damping: 13, delay: 0.55 }}
              className="flex flex-wrap items-center gap-5 pt-1 w-full"
            >
              <button
                id="hero-primary-cta"
                onClick={() => onNavigate("websites")}
                className="group floating-cta-primary w-full md:w-auto select-none"
              >
                <div className="floating-inner-content-primary">
                  <span>{hero.ctaText}</span>
                  <ChevronRight className="w-5 h-5 text-purple-100 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>

              <button
                id="hero-secondary-cta"
                onClick={() => onNavigate("services")}
                className="group floating-cta-secondary w-full md:w-auto select-none"
              >
                <div className="floating-inner-content-secondary">
                  <span>এজেন্সি সার্ভিসেস</span>
                  <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-purple-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </button>
            </motion.div>

          </div>

          {/* Right Column: Beautiful Floating Avatar & Badges inspired by Reference */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, amount: 0.05 }}
            transition={{ type: "spring", stiffness: 30, damping: 15 }}
            className="lg:col-span-5 relative mt-16 lg:mt-0 flex items-center justify-center min-h-[460px]"
          >
            {/* Ambient Ambient Background Lighting */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute top-1/3 left-1/4 w-40 h-40 bg-fuchsia-500/10 rounded-full blur-[80px] pointer-events-none" />

            {/* Orbiting dashed ring paths */}
            <div className="absolute w-[340px] h-[340px] md:w-[380px] md:h-[380px] rounded-full border border-purple-500/10 animate-[spin_40s_linear_infinite] pointer-events-none" />
            <div className="absolute w-[260px] h-[260px] md:w-[300px] md:h-[300px] rounded-full border border-dashed border-fuchsia-500/15 animate-[spin_25s_linear_infinite_reverse] pointer-events-none" />

            {/* Central Main Circle Shape (Purple bg as requested) */}
            <div className="relative w-[220px] h-[220px] md:w-[260px] md:h-[260px] flex-shrink-0 z-10 select-none">
              <motion.div
                animate={{
                  y: [0, -8, 0],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="relative w-full h-full"
              >
                {/* Glowing Outer Shadow & Intense Back Flare (Pulsing Ambient) */}
                <div 
                  className="absolute inset-x-[-25px] inset-y-[-25px] rounded-full bg-gradient-to-tr from-[#6b21a8]/40 via-[#4c1d95]/30 to-[#12003c]/60 blur-3xl pointer-events-none animate-pulse"
                  style={{
                    animationDuration: "5s"
                  }}
                />
                <div className="absolute inset-[-10px] rounded-full bg-[#1e073c]/50 blur-2xl scale-110 pointer-events-none" />

                {/* 1. Deep Rotating Glossy Neon Aura Glow (Pulsing Ambient Shadow) */}
                <motion.div
                  animate={{ 
                    rotate: 360,
                    scale: [1, 1.02, 0.98, 1]
                  }}
                  transition={{
                    rotate: {
                      duration: 4.5,
                      repeat: Infinity,
                      ease: "linear"
                    },
                    scale: {
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }
                  }}
                  className="absolute inset-[-15px] rounded-full blur-2xl opacity-80 pointer-events-none z-10"
                  style={{
                    background: "conic-gradient(from 0deg, transparent 20%, rgba(147, 51, 234, 0.6) 45%, rgba(107, 33, 168, 0.85) 70%, rgba(88, 28, 135, 0.8) 90%, transparent 100%)",
                  }}
                />

                {/* 2. Sharp Spinning Purple Neon Chasing Trail (Realistic glowing fiber optic border) */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  className="absolute inset-[-3.5px] rounded-full pointer-events-none z-10"
                  style={{
                    background: "conic-gradient(from 0deg, transparent 15%, rgba(88, 28, 135, 0.4) 40%, rgba(147, 51, 234, 1) 60%, rgba(107, 33, 168, 1) 80%, rgba(168, 85, 247, 0.95) 93%, rgba(107, 33, 168, 1) 98%, transparent 100%)",
                    boxShadow: "0 0 35px 8px rgba(147, 51, 234, 0.65), inset 0 0 15px rgba(88, 28, 135, 0.8)"
                  }}
                />

                {/* The main solid purple background circle with realistic lighting overlays */}
                <div 
                  className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#9c3fe4] via-[#5c139c] to-[#120042] overflow-hidden shadow-2xl flex items-end justify-center group/circle transition-transform duration-500 hover:scale-[1.02] z-20 isolate"
                  style={{
                    clipPath: "circle(50% at 50% 50%)",
                    WebkitClipPath: "circle(50% at 50% 50%)",
                    transform: "translateZ(0)",
                    WebkitTransform: "translateZ(0)",
                  }}
                >
                  
                  {/* Outer circle layout pattern inside */}
                  <div className="absolute inset-4 rounded-full border border-purple-400/20 pointer-events-none" />
                  <div className="absolute inset-10 rounded-full border border-purple-300/10 pointer-events-none" />

                  {/* Behind-avatar intense spot rim glow (Volumetric Backdrop Flare) */}
                  <div className="absolute bottom-4 w-44 h-44 bg-gradient-to-tr from-[#f43f5e]/30 to-[#a855f7]/50 rounded-full blur-2xl pointer-events-none opacity-85" />
                  
                  {/* Person's photo PNG fitting perfectly inside */}
                  <img 
                    src={owner.picUrl} 
                    alt="Lead Architect - Avexon Studio" 
                    referrerPolicy="no-referrer"
                    className="w-[85%] h-[95%] object-cover object-bottom z-10 select-none filter drop-shadow-[0_0_15px_rgba(236,72,153,0.3)] transition-all duration-700 group-hover/circle:scale-102 group-hover/circle:brightness-105"
                    style={{
                      maskImage: "linear-gradient(to bottom, black 85%, transparent 100%)",
                      WebkitMaskImage: "linear-gradient(to bottom, black 85%, transparent 100%)",
                      transform: "translateZ(0)",
                      WebkitTransform: "translateZ(0)",
                    }}
                  />

                  {/* --- REALISTIC SPOTLIGHT GLOW & LIGHTING OVERLAYS --- */}
                  
                  {/* Left-Top ambient light overlay (adds rich lavender volumetric highlight over the photo) */}
                  <div 
                    className="absolute inset-0 z-15 pointer-events-none mix-blend-screen opacity-70"
                    style={{
                      background: "radial-gradient(circle at 30% 25%, rgba(216, 180, 254, 0.55) 0%, rgba(168, 85, 247, 0.2) 40%, transparent 65%)"
                    }}
                  />

                  {/* Golden pink sunset rim counter-light (from bottom right) to make the cut-out merge with the backdrop */}
                  <div 
                    className="absolute inset-0 z-15 pointer-events-none mix-blend-plus-lighter opacity-60"
                    style={{
                      background: "radial-gradient(circle at 80% 75%, rgba(244, 63, 94, 0.45) 0%, rgba(236, 72, 153, 0.1) 35%, transparent 60%)"
                    }}
                  />

                  {/* Absolute Innermost Gloss & Volumetric 3D Inner Shadow (lay over everything inside the circle) */}
                  <div 
                    className="absolute inset-0 rounded-full z-20 pointer-events-none"
                    style={{
                      boxShadow: "inset 0 0 25px 4px rgba(0, 0, 0, 0.9), inset 0 0 15px 2px rgba(168, 85, 247, 0.55), inset 0 12px 16px rgba(255, 255, 255, 0.18)"
                    }}
                  />

                  {/* Additional glass-like crisp specular inner border highlight */}
                  <div 
                    className="absolute inset-[0.5px] rounded-full z-20 pointer-events-none border border-white/10"
                    style={{
                      boxShadow: "inset 0 2px 4px rgba(255, 255, 255, 0.25), inset 0 -4px 6px rgba(0, 0, 0, 0.6)"
                    }}
                  />

                  {/* Clean, Solid, High-contrast, Non-blending Purple Outer Border Outline strictly on top of all images & blend overlays */}
                  <div className="absolute inset-0 rounded-full border-[3.5px] border-[#bf5aff] pointer-events-none z-30" />

                </div>



                {/* Elegant Floating Owner Name Card (Now attached directly with the avatar image, floats as one unified piece) */}
                <motion.div 
                  style={{ x: "-50%" }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  className="absolute bottom-[-22px] left-1/2 z-25 w-max max-w-[95vw] pointer-events-auto"
                >
                  <div
                    className="timer-neon-card timer-neon-card-hour rounded-xl shadow-2xl cursor-pointer select-none group/owner transition-all duration-300 transform active:scale-95"
                    onClick={(e) => {
                      e.stopPropagation();
                      onNavigate("team");
                    }}
                  >
                    <div className="timer-neon-inner flex items-center gap-2.5 px-3.5 py-2 rounded-[calc(0.75rem-1.8px)]">
                      {/* Micro avatar circle with status ring */}
                      <div className="relative flex-shrink-0">
                        <div className="w-7 h-7 rounded-full border border-purple-500/30 p-0.5 overflow-hidden">
                          <img 
                            src={owner.picUrl} 
                            alt={`${owner.name || "তাহসিন রিজন"} ${owner.role}`} 
                            referrerPolicy="no-referrer"
                            className="w-full h-full rounded-full object-cover group-hover/owner:scale-110 transition-transform duration-300"
                          />
                        </div>
                        {/* Glowing active online status badge removed */}
                      </div>
                      
                      <div className="flex flex-col text-left">
                        <div className="flex items-center gap-1 line-height-none">
                          <span className="text-[12px] font-extrabold text-white font-sans group-hover/owner:text-purple-300 transition-colors">
                            {owner.name || "তাহসিন রিজন"}
                          </span>
                          <span className="text-[7.5px] bg-purple-500/25 border border-purple-500/30 text-purple-300 px-1 py-0.1 rounded font-mono font-bold">{owner.role}</span>
                        </div>
                        <span className="text-[8.5px] text-slate-300 font-sans tracking-wide">
                          {owner.title ? owner.title.replace(/👑\s*\(ক্লিক করুন\)|👑|\(ক্লিক করুন\)|ক্লিক করুন/g, "").trim() : ""}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>

            {/* FLOATING TEXT BADGES OR CARDS (Stylishly aligned with references, guaranteed no face overlap) */}

            {/* Card 1: Left Badge (Magnificent styling, premium glow, elegant & beautifully animated, scaled down) */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.05 }}
              transition={{ delay: 0.35, type: "spring", stiffness: 50, damping: 15 }}
              className="absolute left-[0px] sm:left-[6px] md:left-[15px] top-[34%] z-20 pointer-events-auto"
            >
              <motion.div
                animate={{ 
                  y: [0, -6, 0]
                }}
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
                whileHover={{ scale: 1.05, rotate: -2, y: -4 }}
                whileTap={{ scale: 0.96 }}
                className="timer-neon-card timer-neon-card-hour rounded-xl shadow-2xl cursor-pointer select-none group/btn"
                onClick={() => onNavigate("contact")}
              >
                <div className="timer-neon-inner flex items-center gap-2 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-[calc(0.75rem-1.8px)]">
                  <div className="w-6.5 h-6.5 sm:w-7.5 sm:h-7.5 rounded-lg bg-purple-500/20 border border-purple-400/30 flex items-center justify-center flex-shrink-0 group-hover/btn:bg-purple-500/35 group-hover/btn:scale-110 transition-all duration-300">
                    <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-300" />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-[9.5px] sm:text-[11px] font-black tracking-tight text-white font-sans group-hover/btn:text-purple-300 transition-colors">১০০% সফল</span>
                    <span className="text-[7px]/none sm:text-[8px]/none text-slate-400 font-sans tracking-wide mt-0.5">
                      কোডিং নিশ্চয়তা 🎖️
                    </span>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Card 2: Right Badge (Magnificent fuchsia styling, premium glow, beautiful & scaled down) */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.05 }}
              transition={{ delay: 0.45, type: "spring", stiffness: 50, damping: 15 }}
              className="absolute right-[0px] sm:right-[6px] md:right-[15px] top-[34%] z-20 pointer-events-auto"
            >
              <motion.div
                animate={{ 
                  y: [0, -6, 0]
                }}
                transition={{ duration: 4.6, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
                whileHover={{ scale: 1.05, rotate: 2, y: -4 }}
                whileTap={{ scale: 0.96 }}
                className="timer-neon-card timer-neon-card-hour rounded-xl shadow-2xl cursor-pointer select-none group/btn"
                onClick={() => onNavigate("websites")}
              >
                <div className="timer-neon-inner flex items-center gap-2 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-[calc(0.75rem-1.8px)]">
                  <div className="w-6.5 h-6.5 sm:w-7.5 sm:h-7.5 rounded-lg bg-purple-500/20 border border-purple-400/30 flex items-center justify-center flex-shrink-0 group-hover/btn:bg-purple-500/35 group-hover/btn:scale-110 transition-all duration-300">
                    <Folder className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-300" />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-[9.5px] sm:text-[11px] font-black tracking-tight text-white font-sans group-hover/btn:text-purple-300 transition-colors">১৫০+ ডেমো</span>
                    <span className="text-[7px]/none sm:text-[8px]/none text-slate-400 font-sans tracking-wide mt-0.5">
                      রেডিমেড শপ 📁
                    </span>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Card 4: Bottom Right Customise Card (Magnificent styling, premium amber/orange glow, beautiful & scaled down) */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.05 }}
              transition={{ delay: 0.65, type: "spring", stiffness: 50, damping: 15 }}
              className="absolute right-[0px] sm:right-[6px] md:right-[15px] top-[55%] z-20 pointer-events-auto"
            >
              <motion.div
                animate={{ 
                  y: [0, -7, 0]
                }}
                transition={{ duration: 4.4, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
                whileHover={{ scale: 1.05, rotate: -2, y: -4 }}
                whileTap={{ scale: 0.96 }}
                className="timer-neon-card timer-neon-card-hour rounded-xl shadow-2xl cursor-pointer select-none group/btn"
                onClick={() => onNavigate("websites")}
              >
                <div className="timer-neon-inner flex items-center gap-2 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-[calc(0.75rem-1.8px)]">
                  <div className="w-6.5 h-6.5 sm:w-7.5 sm:h-7.5 rounded-lg bg-purple-500/20 border border-purple-400/30 flex items-center justify-center flex-shrink-0 group-hover/btn:bg-purple-500/35 group-hover/btn:scale-110 transition-all duration-300">
                    <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-300 animate-pulse" />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-[9.5px] sm:text-[11px] font-black tracking-tight text-white font-sans group-hover/btn:text-purple-300 transition-colors">কাস্টম ডিজাইন</span>
                    <span className="text-[7px]/none sm:text-[8px]/none text-slate-400 font-sans tracking-wide mt-0.5">
                      ১০০% হ্যান্ডক্রাফটেড 🎨
                    </span>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Card 3: Bottom Left Support Badge (Magnificent styling, premium teal glow, weighted beautifully & scaled down) */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.05 }}
              transition={{ delay: 0.55, type: "spring", stiffness: 50, damping: 15 }}
              className="absolute left-[0px] sm:left-[6px] md:left-[15px] top-[55%] z-20 pointer-events-auto"
            >
              <motion.div
                animate={{ 
                  y: [0, -7, 0]
                }}
                transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                whileHover={{ scale: 1.05, rotate: 2, y: -4 }}
                whileTap={{ scale: 0.96 }}
                className="timer-neon-card timer-neon-card-hour rounded-xl shadow-2xl cursor-pointer select-none group/btn"
                onClick={() => onNavigate("contact")}
              >
                <div className="timer-neon-inner flex items-center gap-2 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-[calc(0.75rem-1.8px)]">
                  <div className="w-6.5 h-6.5 sm:w-7.5 sm:h-7.5 rounded-lg bg-purple-500/20 border border-purple-400/30 flex items-center justify-center flex-shrink-0 group-hover/btn:bg-purple-500/35 group-hover/btn:scale-110 transition-all duration-300">
                    <MessageSquare className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-300 animate-pulse" />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-[9.5px] sm:text-[11px] font-black tracking-tight text-white font-sans group-hover/btn:text-purple-300 transition-colors">২৪/৭ অনলাইন</span>
                    <span className="text-[7px]/none sm:text-[8px]/none text-slate-400 font-sans tracking-wide mt-0.5">
                      লাইভ সাপোর্ট 💬
                    </span>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* FLOATING DECORATIVE GLASSMOPHIC ICONS (Vibrant icons scattering) */}

            {/* Floating Palette Icon (top left) */}
            <motion.div
              animate={{
                x: [0, 8, 0],
                y: [0, -10, 0],
                rotate: [0, 10, 0]
              }}
              transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute left-[10px] md:left-[-20px] top-[10%] w-11 h-11 rounded-2xl bg-gradient-to-br from-purple-500/15 to-indigo-500/5 border border-purple-500/30 shadow-lg flex items-center justify-center backdrop-blur-sm pointer-events-none z-10"
            >
              <Palette className="w-5 h-5 text-purple-400 filter drop-shadow-[0_0_6px_rgba(168,85,247,0.4)]" />
            </motion.div>

            {/* Floating Sparkles Icon (top right) */}
            <motion.div
              animate={{
                x: [0, -6, 0],
                y: [0, -8, 0],
                rotate: [0, -15, 0]
              }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.45 }}
              className="absolute right-[45px] md:right-[35px] top-[2%] w-10 h-10 rounded-2xl bg-gradient-to-br from-teal-500/15 to-emerald-500/5 border border-teal-500/25 shadow-lg flex items-center justify-center backdrop-blur-sm pointer-events-none z-10"
            >
              <Sparkles className="w-4.5 h-4.5 text-teal-400 filter drop-shadow-[0_0_6px_rgba(20,184,166,0.4)]" />
            </motion.div>

            {/* Floating Layers Icon (bottom left) */}
            <motion.div
              animate={{
                x: [0, 8, 0],
                y: [0, 10, 0],
                rotate: [0, 12, 0]
              }}
              transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut", delay: 0.9 }}
              className="absolute left-[0px] md:left-[-30px] bottom-[20%] w-[48px] h-[48px] rounded-2xl bg-gradient-to-br from-[#0c4efc]/20 to-blue-500/5 border border-blue-500/30 shadow-xl flex items-center justify-center backdrop-blur-sm pointer-events-none z-10"
            >
              <Layers className="w-5 h-5 text-blue-400 filter drop-shadow-[0_0_6px_rgba(59,130,246,0.4)]" />
            </motion.div>

            {/* Floating Speed Up Icon (bottom right) */}
            <motion.div
              animate={{
                x: [0, -8, 0],
                y: [0, -8, 0],
                rotate: [0, -8, 0]
              }}
              transition={{ duration: 5.2, repeat: Infinity, ease: "easeInOut", delay: 1.3 }}
              className="absolute right-[40px] md:right-[30px] bottom-[2%] w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500/15 to-orange-500/5 border border-amber-500/25 shadow-lg flex items-center justify-center backdrop-blur-sm pointer-events-none z-10"
            >
              <TrendingUp className="w-4.5 h-4.5 text-amber-400 filter drop-shadow-[0_0_6px_rgba(245,158,11,0.4)]" />
            </motion.div>

          </motion.div>

        </div>
      </div>
    </section>
  );
}
