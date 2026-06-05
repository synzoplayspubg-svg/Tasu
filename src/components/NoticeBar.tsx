import React from "react";
import { Sparkles, Megaphone, Flame, Clock, ShieldCheck, HeartHandshake } from "lucide-react";
import { useContent } from "../context/ContentContext";

const IconMap: Record<string, React.ComponentType<any>> = {
  Sparkles: Sparkles,
  Flame: Flame,
  HeartHandshake: HeartHandshake,
  ShieldCheck: ShieldCheck,
  Clock: Clock,
  Megaphone: Megaphone,
};

function getNoticeIcon(iconName: string) {
  const IconComponent = IconMap[iconName] || Sparkles;
  
  let colorClass = "text-purple-400";
  let animateClass = "";
  
  if (iconName === "Flame") colorClass = "text-orange-500";
  else if (iconName === "HeartHandshake") colorClass = "text-pink-400";
  else if (iconName === "ShieldCheck") colorClass = "text-emerald-400";
  else if (iconName === "Clock") colorClass = "text-purple-400";
  else if (iconName === "Sparkles") {
    colorClass = "text-yellow-400";
    animateClass = "animate-pulse";
  } else if (iconName === "Megaphone") {
    colorClass = "text-purple-400";
  }
  
  return <IconComponent className={`w-3.5 h-3.5 ${colorClass} ${animateClass}`} />;
}

export default function NoticeBar() {
  const { noticeConfig } = useContent();

  const notices = noticeConfig?.notices || [];

  if (!noticeConfig?.show || notices.length === 0) {
    return null;
  }

  // Duplicate notices to guarantee endless seamless scroll width without blank spacing
  const doubledNotices = [...notices, ...notices, ...notices];

  return (
    <div 
      className="relative w-full bg-[#0A0512] overflow-hidden select-none z-40 h-[38px] flex items-center"
    >
      {/* Decorative ambient subtle background glow behind notices */}
      <div className="absolute inset-0 bg-radial-gradient from-purple-500/5 to-transparent pointer-events-none" />

      {/* Static Announcement Badge (Stays fixed on left to anchor the context) */}
      <div className="absolute left-0 top-0 bottom-0 px-3 bg-[#0d041c] border-r border-purple-500/10 flex items-center gap-1.5 z-10">
        <Megaphone className="w-3.5 h-3.5 text-purple-400 animate-bounce" style={{ animationDuration: '3s' }} />
        <span className="text-[11px] font-bold text-purple-300 uppercase tracking-widest whitespace-nowrap font-sans">
          ঘোষণা
        </span>
      </div>

      {/* Marquee Wrapper Area */}
      <div className="w-full overflow-hidden pl-[85px] relative flex items-center">
        {/* Soft fading overlays for professional high-end cinematic edges */}
        <div className="absolute left-[85px] top-0 bottom-0 w-8 bg-gradient-to-r from-[#0c0516] to-transparent z-[9] pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#0c0516] to-transparent z-[9] pointer-events-none" />

        {/* The Sliding Track */}
        <div className="animate-marquee-slow flex items-center gap-8 py-1">
          {doubledNotices.map((notice, idx) => (
            <div 
              key={`${notice.id}-${idx}`}
              className="flex items-center gap-2.5 text-[11px] md:text-xs text-purple-100/90 whitespace-nowrap group cursor-pointer hover:text-white transition-colors"
            >
              <div className="flex items-center justify-center p-1 bg-purple-500/10 rounded-lg group-hover:scale-110 transition-transform border border-purple-500/10">
                {getNoticeIcon(notice.iconName)}
              </div>
              
              <div className="flex items-center gap-1.5">
                {notice.badge && (
                  <span className="bg-purple-500/25 text-purple-300 text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wide border border-purple-500/20">
                    {notice.badge}
                  </span>
                )}
                <span className="font-medium tracking-wide">
                  {notice.text}
                </span>
                {notice.highlight && (
                  <span className="text-yellow-400 font-bold bg-yellow-400/10 border border-yellow-400/20 px-1.5 py-0.2 rounded font-sans text-[10px]">
                    {notice.highlight}
                  </span>
                )}
              </div>
              
              {/* Divider spacer dot */}
              <span className="w-1.5 h-1.5 rounded-full bg-purple-500/30 self-center mx-1" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
