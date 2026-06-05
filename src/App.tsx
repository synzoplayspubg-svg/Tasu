import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Services from "./components/Services";
import Portfolio from "./components/Portfolio";
import Websites from "./components/Websites";
import CustomisePackages from "./components/CustomisePackages";
import WhyChooseUs from "./components/WhyChooseUs";
import Testimonials from "./components/Testimonials";
import Team from "./components/Team";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import FloatingNav from "./components/FloatingNav";
import CheckoutModal from "./components/CheckoutModal";
import AdminPanel from "./components/AdminPanel";
import PromoPopup from "./components/PromoPopup";
import { useContent } from "./context/ContentContext";
import { safeLocalStorage, safeSessionStorage } from "./utils/safeStorage";
import { isSupabaseConfigured, supabase, isSupabaseOrdersConfigured, supabaseOrders, initializeSupabase } from "./lib/supabase";

export default function App() {
  const { isLoading, logoUrl, headerBranding } = useContent();

  // Auto-sync Supabase configuration from the server on startup or dynamic backport
  useEffect(() => {
    const autoSyncSupabase = async () => {
      try {
        const res = await fetch("/api/supabase-config");
        const data = await res.json();
        if (data.success && data.config) {
          const c = data.config;
          const serverUrl = (c.VITE_SUPABASE_URL || "").trim();
          const serverKey = (c.VITE_SUPABASE_ANON_KEY || "").trim();
          
          const localSupaUrl = (safeLocalStorage.getItem("VITE_SUPABASE_URL") || "").trim();
          const localSupaKey = (safeLocalStorage.getItem("VITE_SUPABASE_ANON_KEY") || "").trim();
          
          // Case 1: Server matches client exactly
          if (serverUrl === localSupaUrl && serverKey === localSupaKey) {
            initializeSupabase();
            return;
          }

          // Case 2: Server is empty, but Client has keys (We self-repair and backport!)
          if (!serverUrl && !serverKey && (localSupaUrl && localSupaKey)) {
            console.log("Auto-backporting local Supabase credentials from client to server to self-heal connection...");
            try {
              await fetch("/api/supabase-config", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url: localSupaUrl, anonKey: localSupaKey })
              });
              initializeSupabase();
            } catch (e) {
              console.warn("Auto-backporting failed:", e);
            }
            return;
          }

          // Case 3: Server has keys, but Client is empty (We download and initialize!)
          if (serverUrl && serverKey) {
            console.log("Downloading active Supabase credentials from server to browser local storage...");
            safeLocalStorage.setItem("VITE_SUPABASE_URL", serverUrl);
            safeLocalStorage.setItem("VITE_SUPABASE_ANON_KEY", serverKey);
            
            // Remove residual old config
            safeLocalStorage.removeItem("VITE_SUPABASE_URL_ORDERS");
            safeLocalStorage.removeItem("VITE_SUPABASE_ANON_KEY_ORDERS");
            
            initializeSupabase();
            
            console.log("Re-initializing Supabase and reloading once to fully apply connected state...");
            window.location.reload();
          }
        }
      } catch (err) {
        console.warn("Failed to auto-sync Supabase active configuration from server:", err);
      }
    };
    autoSyncSupabase();
  }, []);
  const [activeSection, setActiveSection] = useState("hero");
  const [selectedWebsiteName, setSelectedWebsiteName] = useState("");
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutPreselect, setCheckoutPreselect] = useState("");
  const [checkoutType, setCheckoutType] = useState<'readymade' | 'custom'>('readymade');
  const [checkoutInitialMode, setCheckoutInitialMode] = useState<'checkout' | 'tracking'>('checkout');
  const [isStandalone, setIsStandalone] = useState(() => {
    if (typeof window !== "undefined") {
      return (
        window.matchMedia("(display-mode: standalone)").matches ||
        (window.navigator as any).standalone ||
        window.location.search.includes("mode=standalone")
      );
    }
    return false;
  });

  const handleOpenCheckout = (websiteTitle: string = "", type: 'readymade' | 'custom' = 'readymade') => {
    setCheckoutPreselect(websiteTitle);
    setCheckoutType(type);
    setCheckoutInitialMode('checkout');
    setIsCheckoutOpen(true);
  };

  const handleOpenTracking = () => {
    setCheckoutPreselect("");
    setCheckoutInitialMode('tracking');
    setIsCheckoutOpen(true);
  };

  // Update active section highlight based on scrolled view position
  useEffect(() => {
    if (isStandalone) return;
    const sections = ["hero", "services", "portfolio", "websites", "customise", "why-choose-us", "reviews", "team", "contact"];
    
    const handleScroll = () => {
      const scrollPos = window.scrollY + 200; // Trigger threshold offset
      
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(prev => prev !== section ? section : prev);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isStandalone]);

  // Global Real-time Order synchronization, chime sound & push notifications for Admin (even outside Admin Panel page)
  useEffect(() => {
    // Check if this browser is verified to belong to the administrator
    const isPersistedAdmin = safeLocalStorage.getItem("avexon_admin_authenticated_persist") === "true" ||
      safeSessionStorage.getItem("avexon_admin_authenticated") === "true" ||
      window.location.search.includes("mode=standalone");

    if (!isPersistedAdmin) return;

    let localLastCount = -1;
    // Pre-initialize count from existing stored orders
    try {
      const stored = safeLocalStorage.getItem("avexon_admin_orders");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          localLastCount = parsed.length;
        }
      }
    } catch (_) {}

    const triggerDoubleChime = () => {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        try {
          const ctx = new AudioCtx();
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          
          osc.type = "sine";
          // Two-tone elegant digital chime
          osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
          osc.frequency.setValueAtTime(880.00, ctx.currentTime + 0.12); // A5
          gain.gain.setValueAtTime(0.08, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
          
          osc.start();
          osc.stop(ctx.currentTime + 0.5);
        } catch (e) {
          console.log("Global chime play skipped or muted:", e);
        }
      }
    };

    const triggerPushNotification = (newlyCreated: any) => {
      if ("Notification" in window && Notification.permission === "granted") {
        try {
          new Notification("নতুন অর্ডার রিসিভড! 🔔", {
            body: `ক্লায়েন্ট ${newlyCreated.customerName || "অজ্ঞাতনামা"} একটি অর্ডার পাঠিয়েছেন। প্রজেক্ট: ${newlyCreated.websiteTitle || "কাস্টম সার্ভিস"}`,
            icon: "/icon-512.png",
            badge: "/icon-512.png",
          });
        } catch (e) {
          console.log("Global push notification build failed:", e);
        }
      }
    };

    const handleNewIncomingOrders = (ordersList: any[]) => {
      const merged = ordersList;

      // Only chime if AdminPanel is NOT currently active and open, avoiding double chime alarms in standalone views
      const shouldChime = !(window as any).avexonAdminPanelActive && localLastCount !== -1 && merged.length > localLastCount;

      if (shouldChime) {
        const newlyCreated = merged[0]; // Newest order is unshifted at front
        triggerDoubleChime();
        triggerPushNotification(newlyCreated);
      }
      
      localLastCount = merged.length;
      
      // Sync list state dynamically to localStorage to trigger changes across all other navbar badges/indicators
      safeLocalStorage.setItem("avexon_admin_orders", JSON.stringify(merged));
      window.dispatchEvent(new Event("storage"));
    };

    const checkOrdersLoop = async () => {
      try {
        const response = await fetch("/api/orders");
        const json = await response.json();
        if (json.success && Array.isArray(json.data)) {
          handleNewIncomingOrders(json.data);
        }
      } catch (err) {
        console.warn("Global background sync loop failed:", err);
      }
    };

    // 1. Fetch instantly and then check every 8 seconds as safety polling fallback
    checkOrdersLoop();
    const intervalId = setInterval(checkOrdersLoop, 8000);

    // 2. Real-time instant websocket notification if cloud database is active
    let subscription_channel: any = null;
    if (isSupabaseOrdersConfigured && supabaseOrders) {
      try {
        subscription_channel = supabaseOrders
          .channel("avexon_orders_realtime_global_app")
          .on(
            "postgres_changes",
            { event: "INSERT", schema: "public", table: "avexon_orders" },
            () => {
              // Retrieve full updated listing when order is inserted
              checkOrdersLoop();
            }
          )
          .on(
            "broadcast",
            { event: "order_created" },
            (response: any) => {
              console.log("Global channel broadcast order_created:", response.payload);
              checkOrdersLoop();
            }
          )
          .subscribe();
      } catch (e) {
        console.warn("Global supabase websocket channel creation failed:", e);
      }
    }

    return () => {
      clearInterval(intervalId);
      if (subscription_channel) {
        subscription_channel.unsubscribe();
      }
    };
  }, []);

  // Soft scroll to selected component block
  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Directly prefill the website model selector and pop up order modal
  const handleOrderClick = (websiteTitle: string, type: 'readymade' | 'custom' = 'readymade') => {
    setSelectedWebsiteName(websiteTitle);
    handleOpenCheckout(websiteTitle, type);
  };

  // 0. Premium cosmic loading screen while content boots up from SQLite server backend
  if (isLoading) {
    return (
      <div className="bg-[#0A0512] min-h-screen font-sans text-slate-100 flex flex-col items-center justify-center relative overflow-hidden">
        {/* Premium background ambient gradients */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.1)_0%,transparent_60%)] animate-pulse pointer-events-none" />
        <div className="absolute -top-[40%] -left-[20%] w-[80%] h-[80%] rounded-full bg-purple-900/10 blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-[40%] -right-[20%] w-[80%] h-[80%] rounded-full bg-pink-900/10 blur-[120px] pointer-events-none" />

        <div className="relative flex flex-col items-center justify-center z-10 animate-fade-in">
          {/* Pulsing neon orb ring around logo */}
          <div className="relative w-36 h-36 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border border-purple-500/30 animate-ping duration-1000 opacity-25" />
            <div className="absolute inset-2 rounded-full border-2 border-dashed border-purple-500/40 animate-[spin_20s_linear_infinite]" />
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-purple-500/10 to-pink-500/10 blur-xl animate-pulse" />
            
            {/* Glowing website brand custom database-driven logo */}
            {logoUrl ? (
              <img 
                src={logoUrl} 
                alt="Avexon Logo" 
                className="w-24 h-24 rounded-full object-cover border border-purple-500/40 shadow-[0_0_25px_rgba(147,51,234,0.3)] select-none pointer-events-none"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-900 via-slate-900 to-pink-950 flex items-center justify-center border border-purple-500/30 shadow-[0_0_25px_rgba(147,51,234,0.3)]">
                <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent font-mono">AV</span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // If launched as a standalone PWA application on home screen, render full screen directly
  if (isStandalone) {
    return (
      <div className="bg-gradient-to-b from-[#0A0512] via-[#040108] to-[#010003] text-slate-100 min-h-screen font-sans selection:bg-purple-500/20 selection:text-purple-400">
        <AdminPanel
          isOpen={true}
          isStandalonePWA={true}
          onClose={() => setIsStandalone(false)}
        />
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="bg-gradient-to-b from-[#0A0512] via-[#040108] to-[#010003] text-slate-100 min-h-screen font-sans selection:bg-purple-500/20 selection:text-purple-400 overflow-x-hidden"
    >
      
      {/* 1. Transparent Floating Navigation Bar */}
      <Navbar 
        activeSection={activeSection} 
        onNavigate={scrollToSection} 
        onOpenTracking={handleOpenTracking}
      />

      {/* 2. Target Landing components sequentially */}
      <main>
        {/* Hero Section */}
        <Hero onNavigate={scrollToSection} />

        {/* Services Showcase */}
        <Services onContactRequest={() => scrollToSection("contact")} />

        {/* Real Projects Portfolio */}
        <Portfolio onOrderRequest={handleOrderClick} />

        {/* Ready-made & Custom Websites Catalog */}
        <Websites onOrderRequest={handleOrderClick} />

        {/* Dynamic Custom Packages Section */}
        <CustomisePackages onOrderRequest={(title) => handleOrderClick(title, 'custom')} />

        {/* Why Choose Avexon Section */}
        <WhyChooseUs />

        {/* Experience Reviews */}
        <Testimonials />

        {/* Professional Mentorship Team */}
        <Team />

        {/* Counseling & Inquiries Contact panel */}
        <Contact initialSelectedWebsite={selectedWebsiteName} />
      </main>

      {/* Floating interactive navigation system */}
      <FloatingNav 
        activeSection={activeSection} 
        onNavigate={scrollToSection} 
      />

      {/* 3. Fully comprehensive Sitemap Footer */}
      <Footer 
        onNavigate={scrollToSection} 
        onAdminClick={() => setIsStandalone(true)}
      />

      {/* Promotion banner popup modal after 2 seconds */}
      <PromoPopup />

      {/* 4. Complete Step-by-Step Checkout & Tracking System */}
      <AnimatePresence>
        {isCheckoutOpen && (
          <CheckoutModal 
            isOpen={isCheckoutOpen}
            onClose={() => setIsCheckoutOpen(false)}
            preselectedWebsiteTitle={checkoutPreselect}
            checkoutType={checkoutType}
            initialMode={checkoutInitialMode}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
