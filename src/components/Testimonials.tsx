import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useContent } from "../context/ContentContext";
import { Star, MessageSquareCode, Quote } from "lucide-react";
import ScrollBlurReveal from "./ScrollBlurReveal";

const getInitials = (fullName: string) => {
  if (!fullName) return "C";
  const nameParts = fullName.trim().split(/\s+/);
  if (nameParts.length >= 2) {
    const first = nameParts[0].charAt(0);
    const second = nameParts[1].charAt(0);
    return `${first}${second}`;
  }
  return fullName.trim().slice(0, 2);
};

export default function Testimonials() {
  const { testimonials, sectionHeadings } = useContent();
  const filteredReviews = testimonials;

  return (
    <section id="reviews" className="relative py-24 bg-transparent overflow-hidden">
      {/* Decorative ambient background */}
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-purple-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-fuchsia-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 md:px-8 z-10">
        
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
              const title = sectionHeadings?.testimonialsTitle || "আমাদের সফলতার হিরো ও ক্লায়েন্ট ফিডব্যাক";
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
            text={sectionHeadings?.testimonialsSubtitle || "শুধুমাত্র আমাদের কথার ওপর বিশ্বাস করতে হবে না, দেখুন আমাদের প্রিমিয়াম কাস্টম ও রেডিমেড ওয়েবসাইট ক্রেতারা আমাদের সেবা সম্পর্কে কী ডাইরেক্ট মতামত প্রদান করেছেন।"}
            className="text-slate-400 text-xs sm:text-sm md:text-base leading-relaxed max-w-2xl mx-auto"
            as="p"
            delay={0.12}
            stagger={0.03}
          />
        </div>

        {/* Reviews Horizontal Running Lane (Infinite Ticker) */}
        <div className="space-y-6 md:space-y-8 overflow-hidden max-w-[100vw] relative py-4">
          
          {/* Top Fade & Bottom/Sides Fade for beautiful vignette frame overlay */}
          <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-r from-[#010003] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-l from-[#010003] to-transparent z-10 pointer-events-none" />

          {/* Lane 1: Scrolling Left */}
          {filteredReviews.length > 0 ? (
            <div className="relative w-full flex overflow-hidden py-1">
              <div className="animate-marquee-slow gap-4 pr-4">
                {/* Repeat items 6 times to make sure it covers infinite screen width gracefully */}
                {[...Array(6)].flatMap((_, repeatIdx) => 
                  filteredReviews.map((rev, itemIdx) => (
                    <div
                      key={`l1-${rev.id}-${repeatIdx}-${itemIdx}`}
                      className="review-capsule-card max-w-sm sm:max-w-md md:max-w-lg shrink-0 select-none cursor-pointer"
                      title={rev.text}
                    >
                      <div className="review-capsule-inner flex items-center gap-4">
                        {/* Custom Initials Avatar */}
                        <div className="relative w-11 h-11 rounded-full flex items-center justify-center bg-gradient-to-br from-purple-600/90 to-fuchsia-600/90 border border-purple-400/30 text-white font-extrabold text-xs tracking-wider shrink-0 shadow-[inset_0_1px_5px_rgba(255,255,255,0.4)]">
                          {getInitials(rev.name)}
                        </div>

                        {/* Info structure */}
                        <div className="flex flex-col text-left justify-center min-w-0">
                          <div className="flex items-center gap-2 mb-0.5 min-w-0 flex-wrap sm:flex-nowrap">
                            <span className="text-xs sm:text-sm font-bold text-slate-100 truncate max-w-[90px] sm:max-w-[130px]">{rev.name}</span>
                            <span className="shrink-0 text-[10px] text-fuchsia-400 font-mono bg-fuchsia-950/20 px-2 py-0.5 rounded-full border border-fuchsia-500/10 scale-90">
                              {rev.type === "readymade" ? "রেডিমেড" : "কাস্টম"}
                            </span>
                            <div className="flex items-center shrink-0">
                              {[...Array(rev.rating)].map((_, i) => (
                                <Star key={i} className="w-3 h-3 fill-[#ffb74d] text-[#ffb74d] shrink-0" />
                              ))}
                            </div>
                          </div>
                          <p className="text-slate-355 text-[11px] sm:text-xs truncate max-w-[170px] sm:max-w-[240px] md:max-w-[320px] font-medium leading-relaxed italic">
                            "{rev.text}"
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-12 max-w-xs mx-auto bg-[#0d041b] border border-purple-500/10 rounded-2xl shadow-xl">
              <p className="text-slate-400 text-sm">কোনো মতামত খুঁজে পাওয়া যায়নি।</p>
            </div>
          )}

          {/* Lane 2: Scrolling Right (Reverse directions for beautiful rhythm parity) */}
          {filteredReviews.length > 0 && (
            <div className="relative w-full flex overflow-hidden py-1">
              <div className="animate-marquee-slow-reverse gap-4 pr-4">
                {[...Array(6)].flatMap((_, repeatIdx) => 
                  [...filteredReviews].reverse().map((rev, itemIdx) => (
                    <div
                      key={`l2-${rev.id}-${repeatIdx}-${itemIdx}`}
                      className="review-capsule-card max-w-sm sm:max-w-md md:max-w-lg shrink-0 select-none cursor-pointer"
                      title={rev.text}
                    >
                      <div className="review-capsule-inner flex items-center gap-4">
                        {/* Custom Initials Avatar */}
                        <div className="relative w-11 h-11 rounded-full flex items-center justify-center bg-gradient-to-br from-purple-600/90 to-fuchsia-600/90 border border-purple-400/30 text-white font-extrabold text-xs tracking-wider shrink-0 shadow-[inset_0_1px_5px_rgba(255,255,255,0.4)]">
                          {getInitials(rev.name)}
                        </div>

                        <div className="flex flex-col text-left justify-center min-w-0">
                          <div className="flex items-center gap-2 mb-0.5 min-w-0 flex-wrap sm:flex-nowrap">
                            <span className="text-xs sm:text-sm font-bold text-slate-100 truncate max-w-[90px] sm:max-w-[130px]">{rev.name}</span>
                            <span className="shrink-0 text-[11px] text-purple-400 font-mono bg-purple-950/20 px-2 py-0.5 rounded-full border border-purple-500/10 scale-90">
                              {rev.type === "readymade" ? "রেডিমেড" : "কাস্টম"}
                            </span>
                            <div className="flex items-center shrink-0">
                              {[...Array(rev.rating)].map((_, i) => (
                                <Star key={i} className="w-3 h-3 fill-[#ffb74d] text-[#ffb74d]" />
                              ))}
                            </div>
                          </div>
                          <p className="text-slate-355 text-[11px] sm:text-xs truncate max-w-[170px] sm:max-w-[240px] md:max-w-[320px] font-medium leading-relaxed italic">
                            "{rev.text}"
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

      </div>
    </section>
  );
}
