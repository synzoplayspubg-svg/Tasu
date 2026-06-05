import React from "react";
import { motion } from "motion/react";
import { useContent } from "../context/ContentContext";
import ScrollBlurReveal from "./ScrollBlurReveal";
import { 
  HelpCircle, 
  Clock, 
  ShieldCheck, 
  CircleDollarSign, 
  Zap, 
  Activity, 
  Cpu, 
  Headphones, 
  Code,
  ArrowUpRight
} from "lucide-react";

export default function WhyChooseUs() {
  const { sectionHeadings, whyChooseUsStats, whyChooseUsItems } = useContent();

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "Code": return <Code className="w-5 h-5 text-purple-400" />;
      case "Headphones": return <Headphones className="w-5 h-5 text-fuchsia-400" />;
      case "Clock": return <Clock className="w-5 h-5 text-amber-400" />;
      case "Zap": return <Zap className="w-5 h-5 text-amber-400" />;
      case "Cpu": return <Cpu className="w-5 h-5 text-purple-400" />;
      case "CircleDollarSign": return <CircleDollarSign className="w-5 h-5 text-emerald-400" />;
      case "ShieldCheck": return <ShieldCheck className="w-5 h-5 text-blue-400" />;
      case "Activity": return <Activity className="w-5 h-5 text-rose-400" />;
      case "ArrowUpRight": return <ArrowUpRight className="w-5 h-5 text-pink-400" />;
      default: return <HelpCircle className="w-5 h-5 text-purple-400" />;
    }
  };

  const finalStats = whyChooseUsStats && whyChooseUsStats.length > 0 ? whyChooseUsStats : [
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

  const finalItems = whyChooseUsItems && whyChooseUsItems.length > 0 ? whyChooseUsItems : [
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

  return (
    <section id="why-choose-us" className="relative py-28 bg-transparent overflow-hidden border-t border-purple-950/20">
      {/* Decorative glows and grid pattern */}
      <div className="absolute top-0 left-0 right-0 h-[1000px] bg-[linear-gradient(to_bottom,rgba(147,51,234,0.01)_1px,transparent_1px),linear-gradient(to_right,rgba(147,51,234,0.01)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)] pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-purple-600/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-fuchsia-600/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 md:px-8 z-10">
        
        {/* Section Title Container */}
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-5">
          
          <motion.h2 
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, amount: 0.05 }}
            transition={{ type: "spring", stiffness: 40, damping: 15 }}
            className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white leading-tight"
          >
            {(() => {
              const title = sectionHeadings?.whyUsTitle || "কেন Avexon (এভেক্সন) বেছে নিবেন?";
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
            text={sectionHeadings?.whyUsSubtitle || "আমরা স্রেফ কোনো সাধারণ টেমপ্লেট কাস্টমাইজেশন সার্ভিস নই। আপনার ব্যবসায়িক রূপান্তর এবং ইউজার এক্সপেরিয়েন্সকে নিখুঁত করতে আমরা সরবরাহ করি বেস্ট-ইন-ক্লাস ডিজিটাল প্রোডাক্টস।"}
            className="text-slate-400 text-xs sm:text-sm md:text-base leading-relaxed max-w-2xl mx-auto"
            as="p"
            delay={0.15}
            stagger={0.03}
          />
        </div>

        {/* Highlighted Stats Block */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto mb-24">
          {finalStats.map((stat, i) => (
            <motion.div
              id={`stat-card-${stat.id}`}
              key={stat.id}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.05 }}
              transition={{ type: "spring", stiffness: 45, damping: 14, delay: i * 0.08 }}
              className="why-choose-us-neon-card cursor-pointer group"
            >
              <div className="why-choose-us-neon-inner flex items-center gap-4.5 !p-6">
                <div className="w-13 h-13 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shrink-0 group-hover:bg-purple-500/20 transition-all duration-300">
                  {getIcon(stat.iconName)}
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-black text-white leading-none font-sans font-extrabold">{stat.value}</p>
                  <p className="text-xs text-slate-400 mt-2 font-medium">{stat.label}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Alternating Timeline Layout */}
        <div className="relative max-w-5xl mx-auto mt-28">
          
          {/* Central Vertical Timeline Line with running glows */}
          <div className="absolute left-[24px] md:left-1/2 top-4 bottom-4 w-[2px] bg-gradient-to-b from-purple-500 via-fuchsia-500/30 to-transparent -translate-x-1/2" />
          
          {/* Glowing pulse aura animation overlay */}
          <div className="absolute left-[24px] md:left-1/2 top-10 bottom-10 w-[2px] bg-gradient-to-b from-purple-500 via-white to-purple-500/0 -translate-x-1/2 blur-[2px] opacity-30 animate-pulse pointer-events-none" />

          {/* Timeline Nodes */}
          <div className="space-y-14 md:space-y-20">
            {finalItems.map((item, idx) => (
              <div 
                key={item.id}
                className={`relative flex flex-col md:flex-row items-start ${
                  item.align === "left" || !item.align ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                {/* Visual marker circle aligned to middle on desktop and left on mobile */}
                <div className="absolute left-[24px] md:left-1/2 top-2 -translate-x-1/2 z-20">
                  <motion.div
                    initial={{ scale: 0.6, opacity: 0, rotate: -45 }}
                    whileInView={{ scale: 1, opacity: 1, rotate: 0 }}
                    viewport={{ once: true, amount: 0.05 }}
                    transition={{ type: "spring", stiffness: 50, damping: 13 }}
                    className="w-12 h-12 rounded-full bg-[#110522] border-2 border-purple-500/80 shadow-[0_0_12px_rgba(168,85,247,0.2)] md:hover:shadow-[0_0_20px_rgba(240,70,255,0.6)] active:shadow-none focus:shadow-none flex items-center justify-center text-sm font-sans font-black text-purple-300 select-none cursor-pointer transition-all"
                  >
                    {item.step || (idx + 1)}
                  </motion.div>
                </div>

                {/* Left/Right empty placeholder for neat structure */}
                <div className="hidden md:block w-1/2" />

                {/* Actual content block container */}
                <motion.div
                  id={`timeline-card-${item.id}`}
                  initial={{ opacity: 0, x: (item.align === "left" || !item.align) ? -60 : 60, scale: 0.93 }}
                  whileInView={{ opacity: 1, x: 0, scale: 1 }}
                  viewport={{ once: true, amount: 0.05 }}
                  transition={{ type: "spring", stiffness: 40, damping: 15 }}
                  className="w-full md:w-1/2 pl-16 md:pl-0 md:px-11"
                >
                  <div className="why-choose-us-neon-card cursor-default group">
                    <div className="why-choose-us-neon-inner !p-6 sm:!p-8 relative overflow-hidden">
                      
                      {/* Corner gradient flair */}
                      <div className="absolute top-0 right-0 w-28 h-28 bg-[radial-gradient(circle_at_top_right,rgba(168,85,247,0.15),transparent_70%)] rounded-bl-3xl pointer-events-none group-hover:scale-110 transition-transform duration-500" />

                      {/* Badge and Icon heading */}
                      <div className="flex items-center justify-between gap-4 mb-4.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2.5 py-1 rounded-md">
                          {item.badge}
                        </span>
                        <div className="w-10.5 h-10.5 rounded-lg bg-purple-950/60 border border-purple-900/30 flex items-center justify-center shrink-0 group-hover:bg-purple-500/20 group-hover:border-purple-500/40 transition-colors duration-300">
                          {getIcon(item.iconName)}
                        </div>
                      </div>

                      {/* Headline */}
                      <h3 className="text-base sm:text-[18px] font-bold text-slate-100 group-hover:text-purple-400 transition-colors leading-snug mb-3.5 pr-2.5 font-sans">
                        {item.title}
                      </h3>

                      {/* Description Paragraph */}
                      <p className="text-slate-400 text-xs sm:text-sm leading-relaxed text-left font-normal pr-1">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </motion.div>

              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
