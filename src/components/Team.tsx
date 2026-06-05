import React from "react";
import { motion } from "motion/react";
import { useContent } from "../context/ContentContext";
import { Users2, Linkedin, Github, Compass, Users, Facebook, Instagram, MessageCircle } from "lucide-react";
import ScrollBlurReveal from "./ScrollBlurReveal";

export default function Team() {
  const { team, sectionHeadings } = useContent();
  return (
    <section id="team" className="relative py-24 bg-transparent overflow-hidden">
      {/* Decorative gradients */}
      <div className="absolute top-1/3 left-10 w-80 h-80 bg-purple-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-10 right-5 w-96 h-96 bg-fuchsia-500/5 rounded-full blur-[120px] pointer-events-none" />

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
              const title = sectionHeadings?.teamTitle || "যাঁদের গাইডেন্সে আপনি পথ চলবেন প্রতিদিন";
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
            text={sectionHeadings?.teamSubtitle || "আমাদের প্রতিটি মডিউল এবং প্রজেক্টগুলি আমাদের দেশের সেরা অভিজ্ঞ মেন্টর এবং প্রকৌশলীদের দিয়ে ডিরেক্টলি তদারকি করা হয়ে থাকে।"}
            className="text-slate-400 text-xs sm:text-sm md:text-base leading-relaxed max-w-2xl mx-auto"
            as="p"
            delay={0.15}
            stagger={0.03}
          />
        </div>

        {/* Team Grid */}
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto items-stretch justify-center">
          {team.map((member, idx) => (
            <motion.div
              id={`team-card-${member.id}`}
              key={member.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.6, delay: idx * 0.12, ease: "easeOut" }}
              className="team-neon-card w-full max-w-md sm:max-w-lg md:max-w-none group mx-auto flex"
            >
              <div className="team-neon-inner p-4 sm:p-5 flex flex-row items-center gap-4 sm:gap-5 w-full">
                {/* Profile Image Section with rotating neon border */}
                <div className="team-photo-neon-card w-20 h-20 sm:w-28 sm:h-28 flex-shrink-0">
                  <div className="team-photo-neon-inner relative w-full h-full">
                    {/* Subtle gradient glow behind the photo */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-purple-900/40 to-indigo-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <img
                      src={member.imageUrl}
                      alt={member.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                    />
                  </div>
                </div>

                {/* Info Column */}
                <div className="flex-grow flex flex-col justify-between h-full min-w-0">
                  <div className="space-y-1 sm:space-y-1.5">
                    {/* Name and Role */}
                    <div>
                      <h3 className="text-sm sm:text-base font-black text-slate-100 group-hover:text-purple-400 transition-colors leading-snug tracking-tight truncate">
                        {member.name}
                      </h3>
                      <p className="inline-block bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[8px] sm:text-[10px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider mt-0.5">
                        {member.role}
                      </p>
                    </div>

                    {/* Biography */}
                    <p className="text-slate-350 text-[10px] sm:text-xs leading-relaxed line-clamp-2 sm:line-clamp-3">
                      {member.bio}
                    </p>

                    {/* Skill Badges */}
                    <div className="flex flex-wrap gap-1 mt-1">
                      {member.skills.slice(0, 3).map((sk, i) => (
                        <span 
                          key={i} 
                          className="text-[8px] sm:text-[9px] font-bold text-slate-300 bg-purple-950/30 border border-purple-900/30 px-1 sm:px-1.5 py-0.5 rounded-sm"
                        >
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Social media connections */}
                  <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-purple-950/45 flex-wrap">
                    <span className="text-[8px] text-slate-500 uppercase tracking-wider font-mono hidden sm:inline mr-1">সংযুক্ত থাকুন:</span>
                    
                    {/* LinkedIn */}
                    {member.showLinkedin !== false && member.linkedinUrl && (
                      <a 
                        href={member.linkedinUrl} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="p-1 rounded bg-slate-950/80 border border-purple-950 hover:text-purple-400 hover:border-purple-500/30 text-slate-400 transition-all text-xs"
                        aria-label={`${member.name} - LinkedIn`}
                      >
                        <Linkedin className="w-3 h-3" />
                      </a>
                    )}
                    
                    {/* Github */}
                    {member.showGithub !== false && member.githubUrl && (
                      <a 
                        href={member.githubUrl} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="p-1 rounded bg-slate-[#02010c] border border-purple-950 hover:text-purple-400 hover:border-purple-500/30 text-slate-400 transition-all text-xs"
                        aria-label={`${member.name} - Github`}
                      >
                        <Github className="w-3 h-3" />
                      </a>
                    )}
                    
                    {/* Facebook */}
                    {member.showFacebook !== false && member.facebookUrl && (
                      <a 
                        href={member.facebookUrl} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="p-1 rounded bg-slate-950/80 border border-purple-950 hover:text-purple-400 hover:border-purple-500/30 text-slate-400 transition-all text-xs"
                        aria-label={`${member.name} - Facebook`}
                      >
                        <Facebook className="w-3 h-3" />
                      </a>
                    )}

                    {/* Instagram */}
                    {member.showInstagram !== false && member.instagramUrl && (
                      <a 
                        href={member.instagramUrl} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="p-1 rounded bg-slate-950/80 border border-purple-950 hover:text-purple-400 hover:border-purple-500/30 text-slate-400 transition-all text-xs"
                        aria-label={`${member.name} - Instagram`}
                      >
                        <Instagram className="w-3 h-3" />
                      </a>
                    )}

                    {/* WhatsApp */}
                    {member.showWhatsapp !== false && member.whatsappUrl && (
                      <a 
                        href={member.whatsappUrl.startsWith("http") ? member.whatsappUrl : `https://wa.me/${member.whatsappUrl.replace(/\D/g, "")}`} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="p-1 rounded bg-slate-950/80 border border-purple-950 hover:text-purple-300 hover:border-purple-500/30 text-slate-400 transition-all text-xs"
                        aria-label={`${member.name} - WhatsApp`}
                      >
                        <MessageCircle className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
