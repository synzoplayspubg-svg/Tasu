import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useContent } from "../context/ContentContext";
import ScrollBlurReveal from "./ScrollBlurReveal";
import { 
  Send, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  CheckCircle,
  HelpCircle,
  MessageSquareReply,
  ShieldCheck,
  Facebook,
  Instagram,
  MessageCircle,
  Star,
  MessageSquareCode
} from "lucide-react";

interface ContactProps {
  initialSelectedWebsite: string;
}

export default function Contact({ initialSelectedWebsite }: ContactProps) {
  const { testimonials, updateTestimonials, contactConfig, hero, sectionHeadings } = useContent();

  // Review System States
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [type, setType] = useState<"readymade" | "custom">("readymade");
  const [rating, setRating] = useState<number>(5);
  const [text, setText] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState("avatar-1");
  const [validationError, setValidationError] = useState("");
  
  // Submit states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Avatar presets matching the elegant dark theme
  const AVATAR_PRESETS = [
    { id: "avatar-1", name: "পুরুষ পেশাদার ১", url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150&h=150" },
    { id: "avatar-2", name: "নারী পেশাদার ১", url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150" },
    { id: "avatar-3", name: "পুরুষ টেক ২", url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150&h=150" },
    { id: "avatar-4", name: "নারী লিডার ২", url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150&h=150" },
    { id: "avatar-5", name: "অ্যাবস্ট্রাক্ট টেক", url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150&h=150" }
  ];

  const ratingTexts: Record<number, string> = {
    1: "খুবই হতাশাজনক 😞",
    2: "চলনসই বা মাঝারি 😐",
    3: "মোটামুটি ভালো হয়েছে 🙂",
    4: "খুব চমৎকার লেগেছে! 🤩",
    5: "অসাধারণ ও নিখুঁত! 👑"
  };

  // Pre-select service type if ordered from previous websites list
  useEffect(() => {
    if (initialSelectedWebsite) {
      setType("readymade");
    }
  }, [initialSelectedWebsite]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError("");
    if (!name || !text) {
      setValidationError("অনুগ্রহ করে আপনার নাম এবং রিভিউ এর মন্তব্য সঠিকভাবে প্রদান করুন।");
      return;
    }

    setIsSubmitting(true);
    
    setTimeout(() => {
      // Pick a random avatar from presets so they get a nice default without having to choose
      const randomPreset = AVATAR_PRESETS[Math.floor(Math.random() * AVATAR_PRESETS.length)];
      
      const newReview = {
        id: "rev-user-" + Date.now().toString(),
        name,
        role: "সম্মানিত গ্রাহক",
        avatarUrl: randomPreset ? randomPreset.url : "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150&h=150",
        text,
        rating,
        type
      };

      // Instantly update our dynamic sqlite/localStorage review list
      updateTestimonials([newReview, ...testimonials]);

      setIsSubmitting(false);
      setSubmitSuccess(true);

      // Clean inputs
      setName("");
      setRole("");
      setText("");
      setRating(5);
    }, 1200);
  };

  return (
    <section id="contact" className="relative py-24 bg-transparent overflow-hidden">
      {/* Decorative ambient visual filters */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-gradient-to-tr from-purple-500/5 to-fuchsia-500/5 rounded-full blur-[130px] pointer-events-none" />

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
              const title = sectionHeadings?.contactTitle || "আমাদের সেবা সম্পর্কে আপনার মতামত প্রদান করুন";
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
            text={sectionHeadings?.contactSubtitle || "আমাদের প্রিমিয়াম রেডিমেড ওয়েবসাইট বা কাস্টম প্রজেক্ট সেবা আপনার কেমন লেগেছে? আপনার একটি ফিডব্যাক আমাদের আরও নিখুঁত হতে ও অন্যদের অনুপ্রাণিত করতে সাহায্য করবে।"}
            className="text-slate-400 text-xs sm:text-sm md:text-base leading-relaxed max-w-2xl mx-auto"
            as="p"
            delay={0.15}
            stagger={0.03}
          />
        </div>

        <div className="grid lg:grid-cols-12 gap-12 items-stretch max-w-6xl mx-auto">
          
          {/* Left Column: Direct contact information references & Social Floating Blocks */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-8">
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-slate-100">
                সরাসরি আমাদের সাথে কানেক্ট করুন
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed max-w-sm font-sans">
                ভার্চুয়ালি আমরা সবসময় সক্রিয়! যেকোনো প্রশ্নের দ্রুত উত্তর এবং তাত্ক্ষণিক সাপোর্টের জন্য নিচের সোশ্যাল মিডিয়া চ্যানেলগুলোতে ক্লিক করে সরাসরি যোগাযোগ করুন।
              </p>

              {/* Cool Glowing Floating Icons */}
              <div className="flex flex-wrap items-center gap-5 pt-4 justify-start max-w-[360px] mx-auto sm:mx-0">
                {/* Facebook Button */}
                <a
                  href={contactConfig.facebookUrl || "https://facebook.com"}
                  target="_blank"
                  rel="noreferrer"
                  className="social-square-card social-square-fb group"
                  title="Facebook-এ কানেক্ট করুন"
                >
                  <div className="social-square-inner fb-inner-glow">
                    <Facebook className="w-5.5 h-5.5 text-blue-400 group-hover:scale-110 group-hover:text-white transition-all duration-300" />
                  </div>
                </a>

                {/* Instagram Button */}
                <a
                  href={contactConfig.instagramUrl || "https://instagram.com"}
                  target="_blank"
                  rel="noreferrer"
                  className="social-square-card social-square-ig group"
                  title="Instagram-এ কানেক্ট করুন"
                >
                  <div className="social-square-inner ig-inner-glow">
                    <Instagram className="w-5.5 h-5.5 text-pink-400 group-hover:scale-110 group-hover:text-white transition-all duration-300" />
                  </div>
                </a>

                {/* WhatsApp Button */}
                <a
                  href={(() => {
                    if (!contactConfig.whatsappUrl) {
                      return `https://wa.me/88${hero?.whatsappNumber || "01613911528"}`;
                    }
                    const val = contactConfig.whatsappUrl.trim();
                    if (val.startsWith("http://") || val.startsWith("https://") || val.startsWith("wa.me/")) {
                      if (val.startsWith("wa.me/")) {
                        return "https://" + val;
                      }
                      return val;
                    }
                    const cleanNum = val.replace(/\D/g, "");
                    if (cleanNum.startsWith("880")) {
                      return `https://wa.me/${cleanNum}`;
                    }
                    if (cleanNum.startsWith("0")) {
                      return `https://wa.me/88${cleanNum}`;
                    }
                    return `https://wa.me/${cleanNum}`;
                  })()}
                  target="_blank"
                  rel="noreferrer"
                  className="social-square-card social-square-wa group"
                  title="WhatsApp-এ মেসেজ পাঠান"
                >
                  <div className="social-square-inner wa-inner-glow">
                    <MessageCircle className="w-5.5 h-5.5 text-emerald-400 group-hover:scale-110 group-hover:text-white transition-all duration-300" />
                  </div>
                </a>
              </div>

              {/* Online support contact credentials */}
              <div className="space-y-4 pt-4 border-t border-purple-500/5">
                <div className="flex items-center gap-4">
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-purple-400 shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-sans">Helpline Number:</h4>
                    <p className="text-xs sm:text-sm text-slate-200 mt-0.5 font-sans font-bold">
                      {contactConfig.helplineNumbers}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-purple-400 shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-sans">Official Email:</h4>
                    <p className="text-xs sm:text-sm text-slate-200 mt-0.5 font-sans">
                      {contactConfig.officialEmails}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-purple-400 shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-sans">Support Hours:</h4>
                    <p className="text-xs sm:text-sm text-slate-200 mt-0.5">
                      {contactConfig.supportHours}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick trust metrics panel */}
            <div className="p-5 rounded-2xl bg-[#110620]/60 border border-purple-950/40 flex items-center gap-3.5 shadow-lg">
              <ShieldCheck className="w-10 h-10 text-purple-400 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-bold text-slate-200">শতভাগ রিয়েল রিভিউ</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  একটি সুন্দর মতামত প্রদান করে আমাদের টিম মেম্বারদের উৎসাহিত করুন।
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Stunning Interactive Review Submission Card */}
          <div className="lg:col-span-7 bg-[#130725]/50 rounded-3xl p-6 sm:p-8 border border-purple-950/30 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-purple-500 to-fuchsia-400" />
            
            {/* Title / Description inside card */}
            <div className="mb-6 text-left">
              <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                <MessageSquareCode className="w-5.2 h-5.2 text-purple-400" />
                আপনার রিভিউ দিন
              </h3>
              <p className="text-xs text-slate-400 mt-1.5 font-sans">
                মডেল সিলেক্ট করুন, রেটিং দিন এবং আপনার সুন্দর অভিজ্ঞতা ও মতামতটি নিচের কার্ড ফর্মে ব্যক্ত করুন।
              </p>
            </div>

            {/* Form Toggle buttons for Service Type */}
            <div className="grid grid-cols-2 gap-3 mb-6 bg-slate-950 p-1.5 rounded-2xl border border-slate-900">
              <button
                id="review-toggle-readymade"
                type="button"
                onClick={() => { setType("readymade"); setValidationError(""); }}
                className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 cursor-pointer ${
                  type === "readymade"
                    ? "bg-[#240e44] text-purple-400 border border-purple-500/25 shadow-md shadow-black/40"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                রেডিমেড ওয়েবসাইট
              </button>
              <button
                id="review-toggle-custom"
                type="button"
                onClick={() => { setType("custom"); setValidationError(""); }}
                className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 cursor-pointer ${
                  type === "custom"
                    ? "bg-[#240e44] text-purple-400 border border-purple-500/25 shadow-md shadow-black/40"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                কাস্টম প্রজেক্ট
              </button>
            </div>

            {/* Reviews interactive inputs block */}
            <form onSubmit={handleSubmit} className="space-y-5 text-left">
              
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  আপনার নাম *
                </label>
                <input
                  id="review-input-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="যেমন- আমিনুল ইসলাম"
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3 text-xs sm:text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/30 transition-all font-medium"
                />
              </div>

              {/* Unique Interactive Star Ratings Frame */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  আপনার রেটিং নির্বাচন করুন *
                </label>
                <div className="flex flex-wrap items-center gap-4 bg-slate-950 p-4 rounded-xl border border-slate-900 justify-between">
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((starVal) => (
                      <motion.button
                        key={starVal}
                        type="button"
                        onClick={() => setRating(starVal)}
                        whileHover={{ scale: 1.25 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-1 cursor-pointer focus:outline-none"
                      >
                        <Star
                          className={`w-7 h-7 transition-colors duration-200 drop-shadow-[0_0_8px_rgba(255,183,77,0.15)] ${
                            starVal <= rating
                              ? "fill-[#ffb74d] text-[#ffb74d] filter drop-shadow-[0_0_12px_rgba(255,183,77,0.4)]"
                              : "text-slate-700 hover:text-slate-500"
                          }`}
                        />
                      </motion.button>
                    ))}
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-3.5 py-2 rounded-full border border-amber-500/15">
                      {ratingTexts[rating]}
                    </span>
                  </div>
                </div>
              </div>

              {/* Feedback messages details */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  আপনার কাস্টম রিভিউ / মন্তব্য লিখুন *
                </label>
                <textarea
                  id="review-input-text"
                  rows={4}
                  required
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="আমাদের ওয়েবসাইটের ডিজাইন, রানিং ব্যাকএন্ড স্পিড বা এক্সপার্ট সাপোর্ট নিয়ে আপনার দীর্ঘ অভিজ্ঞতার সত্য মতামত এখানে বিস্তারিত ব্যক্ত করুন..."
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3.5 text-xs sm:text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/30 transition-all font-medium custom-scrollbar resize-none"
                />
              </div>

              {/* Inline warning error instead of native alert dialog */}
              {validationError && (
                <div className="p-3 text-xs font-semibold text-rose-400 bg-rose-500/5 border border-rose-500/10 rounded-xl text-center">
                  ⚠️ {validationError}
                </div>
              )}

              {/* Send Button trigger */}
              <button
                id="review-submit-btn"
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2.5 py-4 px-6 rounded-xl bg-gradient-to-r from-purple-600 via-purple-700 to-fuchsia-700 hover:from-purple-500 hover:to-fuchsia-500 text-sm font-bold text-white shadow-xl shadow-purple-900/20 cursor-pointer transition-all disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-slate-100 border-t-transparent rounded-full animate-spin" />
                    <span>রিভিউ পাবলিশ করা হচ্ছে...</span>
                  </>
                ) : (
                  <>
                    <span>রিভিউ সাবমিট করুন</span>
                    <Send className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Success notification popup overlay */}
            <AnimatePresence>
              {submitSuccess && (
                <motion.div
                  id="review-success-overlay"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-slate-950/95 flex flex-col items-center justify-center p-6 text-center z-20"
                >
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", delay: 0.1 }}
                    className="max-w-md space-y-4"
                  >
                    <div className="w-16 h-16 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mx-auto mb-2 text-purple-400">
                      <CheckCircle className="w-10 h-10" />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-black text-slate-100">
                      রিভিউ পাবলিশ সফল হয়েছে!
                    </h3>
                    <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                      ধন্যবাদ! আপনার মূল্যবান রিভিউটি সফলভাবে লাইভ করা হয়েছে। এখন এটি উপরে "ক্লায়েন্ট ফিডব্যাক" রিভিউ সেকশনে তাৎক্ষণিকভাবে দেখতে পাবেন।
                    </p>
                    <div className="pt-4">
                      <button
                        id="success-form-reset-btn"
                        onClick={() => setSubmitSuccess(false)}
                        className="px-6 py-2.5 rounded-xl bg-slate-900 text-xs font-bold text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700 transition cursor-pointer"
                      >
                        অন্য একটি রিভিউ দিন
                      </button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </div>

      </div>
    </section>
  );
}
