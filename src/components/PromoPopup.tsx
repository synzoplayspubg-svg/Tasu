import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, ExternalLink, MessageSquare } from "lucide-react";
import { useContent } from "../context/ContentContext";
import { safeSessionStorage } from "../utils/safeStorage";

export default function PromoPopup() {
  const { promoPopupConfig } = useContent();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // If the admin has disabled showing the promotion popup, don't show it at all
    if (!promoPopupConfig || !promoPopupConfig.show || !promoPopupConfig.imageUrl) {
      return;
    }

    // Check if the user has already dismissed or viewed the promo in this session
    const hasViewedInSession = safeSessionStorage.getItem("avexon_promo_popup_viewed") === "true";
    if (hasViewedInSession) {
      return;
    }

    // Wait exactly 2 seconds after mounting to trigger the popup
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, [promoPopupConfig]);

  const handleClose = () => {
    setIsOpen(false);
    // Persist session-level closure so it doesn't keep popping up on every internal click/state refresh
    safeSessionStorage.setItem("avexon_promo_popup_viewed", "true");
  };

  if (!isOpen || !promoPopupConfig || !promoPopupConfig.imageUrl) return null;

  const handleActionClick = () => {
    handleClose();
    if (promoPopupConfig.linkUrl) {
      window.open(promoPopupConfig.linkUrl, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        {/* Backdrop overlay with luxury glass blur */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="absolute inset-0 bg-black/85 backdrop-blur-md cursor-pointer"
        />

        {/* Modal body - Sleek, smaller form factor, pristine quality preservation, and animated neon border glow */}
        <motion.div
          initial={{ scale: 0.85, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.85, opacity: 0, y: 15 }}
          transition={{ type: "spring", damping: 22, stiffness: 320 }}
          className="relative rounded-2xl p-[2px] overflow-hidden w-full max-w-[330px] sm:max-w-[360px] shadow-[0_0_40px_rgba(147,51,234,0.55)] flex flex-col z-10 transition-all hover:shadow-[0_0_55px_rgba(147,51,234,0.8)] group"
        >
          {/* Seamless Neon Rotating Outline Spinner */}
          <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
            <div className="absolute top-1/2 left-1/2 w-[350%] h-[350%] bg-[conic-gradient(from_0deg,transparent_15%,#c084fc_35%,#f472b6_50%,#3b82f6_65%,transparent_85%)] animate-[neon-border-spin_4.5s_linear_infinite]" />
          </div>

          {/* Floating minimal X close trigger */}
          <button
            onClick={handleClose}
            className="absolute top-2 right-2 z-30 bg-black/60 hover:bg-red-500 hover:text-white text-slate-200 p-1.5 rounded-full transition-all duration-300 border border-white/10 hover:scale-105 active:scale-95 shadow-lg"
            aria-label="Close promotion modal"
          >
            <X className="w-3.5 h-3.5" />
          </button>

          {/* Picture frame completely maintaining original image quality & natural aspect ratio */}
          <div 
            onClick={handleActionClick}
            className="relative cursor-pointer overflow-hidden rounded-[14px] bg-[#020003] z-10 w-full h-auto flex flex-col items-center justify-center transition-all"
          >
            <img
              src={promoPopupConfig.imageUrl}
              alt="Promo Announcement"
              className="w-full h-auto object-contain block group-hover:scale-[1.015] transition-transform duration-500 ease-out"
              referrerPolicy="no-referrer"
            />
            
            {/* Subtle premium hover overlay highlight if link exists to indicate clickability */}
            {promoPopupConfig.linkUrl && (
              <div className="absolute inset-0 bg-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
