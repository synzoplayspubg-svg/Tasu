import React from "react";
import { ShieldCheck, X } from "lucide-react";
import { useContent } from "../context/ContentContext";

interface FooterProps {
  onNavigate: (sectionId: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  const { contactConfig, hero, logoUrl, headerBranding } = useContent();
  const [activeLegalTab, setActiveLegalTab] = React.useState<'terms' | 'policy' | 'cookies' | null>(null);

  const handleItemClick = (id: string) => {
    onNavigate(id);
  };

  return (
    <footer id="main-footer" className="bg-[#050B12] border-t border-slate-900 pt-16 pb-8 text-left relative overflow-hidden">
      {/* Decorative gradients */}
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-purple-500/5 rounded-full blur-[110px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 md:px-8 z-10">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12 pb-12 border-b border-slate-900/80">
          
          {/* Logo & Intro column */}
          <div className="lg:col-span-4 space-y-5">
            <div 
              className="flex items-center gap-2.5 cursor-pointer group" 
              onClick={(e) => {
                handleItemClick("hero");
              }}
            >
              <div 
                className="relative w-9 h-9 rounded-[10px] bg-gradient-to-tr from-purple-500 to-fuchsia-500 p-[1px] shadow-lg shadow-purple-500/10 overflow-hidden"
              >
                <div className="w-full h-full bg-[#05060f] rounded-[10px] flex items-center justify-center relative">
                  <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/10 via-transparent to-white/5 pointer-events-none rounded-[10px]" />
                  
                  {logoUrl ? (
                    <img 
                      src={logoUrl} 
                      alt="Logo" 
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover rounded-[10px] scale-90 group-hover:scale-95 transition-all duration-350 p-0.5" 
                    />
                  ) : (
                    <span 
                      className="font-sans font-bold text-lg bg-gradient-to-r from-purple-400 to-fuchsia-300 bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300 relative z-10"
                      style={{ fontFamily: headerBranding.fontFamily || (headerBranding.customFontUrl ? "CustomUploadedFont" : undefined) }}
                    >
                      {headerBranding.brandName ? headerBranding.brandName.charAt(0) : "A"}
                    </span>
                  )}
                </div>
              </div>
              <div>
                <div className="flex items-baseline gap-1">
                  <span 
                    className="text-xl font-bold font-logo tracking-tight text-white mb-[1px]"
                    style={{ fontFamily: headerBranding.fontFamily || (headerBranding.customFontUrl ? "CustomUploadedFont" : undefined) }}
                  >
                    {headerBranding.brandName || "Avexon"}{" "}
                  </span>
                  {headerBranding.brandBadge && (
                    <span className="text-xs bg-purple-500/10 text-purple-300 px-1.5 py-0.5 rounded-md font-medium border border-purple-500/20">
                      {headerBranding.brandBadge}
                    </span>
                  )}
                </div>
                <p 
                  className="text-purple-400/70 tracking-[0.2em] uppercase -mt-[2px] font-sans font-semibold text-left"
                  style={{ 
                    fontFamily: headerBranding.subtitleFontFamily || undefined, 
                    fontSize: headerBranding.subtitleFontSize || "9px" 
                  }}
                >
                  {headerBranding.brandSubtitle || "Premium Web Agency"}
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm">
              আমরা আপনার ব্যবসায়িক দৃষ্টিভঙ্গিকে আকর্ষণীয় ডিজাইনে রূপান্তর করার পাশাপাশি আপনার ব্যবসার জন্য প্রিমিয়াম ও গতিশীল কাস্টম ও রেডিমেড ওয়েবসাইট সার্ভিস প্রদানে প্রতিশ্রুতিবদ্ধ।
            </p>
          </div>

          {/* Quick Sitemap Navigation column */}
          <div className="lg:col-span-3 lg:pl-10 space-y-4">
            <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-200">
              সাইট ম্যাপ
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              {[
                "হোম",
                "আমাদের সেবা",
                "আমাদের প্রজেক্টস",
                "ওয়েবসাইট শপ",
                "কেন এভেক্সন",
                "আমাদের টিম"
              ].map((label, idx) => (
                <li key={idx} className="text-slate-400/80 hover:text-slate-400 transition-all font-sans">
                  • {label}
                </li>
              ))}
            </ul>
          </div>

          {/* Specialities Services column */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-200">
              স্পেশাল সার্ভিসেস
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              {[
                "টেইলার্ড ইউজার ইন্টারফেস ডিজাইন",
                "MERN স্ট্যাক ওয়েব ডেভেলপমেন্ট",
                "প্রিমিয়াম ই-কমার্স ওয়েবসাইট",
                "ব্র্যান্ড আইডেন্টিটি প্যাকেজ",
                "লাইফটাইম সার্ভার মেইনটেইন্যান্স"
              ].map((val, idx) => (
                <li key={idx} className="text-slate-400/80 hover:text-slate-400 transition-all font-sans">
                  • {val}
                </li>
              ))}
            </ul>
          </div>

          {/* Terms & Badges summary */}
          <div className="lg:col-span-2 space-y-5">
            <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-200">
              নিরাপত্তা নিশ্চয়তা
            </h4>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3.5">
              <div className="flex items-center gap-2 text-purple-400">
                <ShieldCheck className="w-5 h-5 flex-shrink-0" />
                <span className="text-[11px] font-bold tracking-wide">১০০% ভেরিফাইড কোড</span>
              </div>
              <p className="text-[10px] text-slate-500 leading-normal">
                আমাদের ডেলিভারিকৃত প্রতিটি ওয়েবসাইট ম্যালওয়্যার-মুক্ত, হাইপার-সিকিউর এবং লেটেস্ট কোডিং স্ট্যান্ডার্ড মেনে ডেভেলপ করা।
              </p>
            </div>
          </div>

        </div>

        {/* Legal copyrights block */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left text-xs text-slate-500">
          <div>
            <p className="font-sans select-none" style={{ fontFamily: "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" }}>
              © 2026 Avexon BD. সর্বস্বত্ব সংরক্ষিত
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button 
              onClick={() => setActiveLegalTab('terms')}
              className="hover:text-purple-400 transition-colors cursor-pointer"
            >
              শর্তাবলী
            </button>
            <span className="text-slate-800">|</span>
            <button 
              onClick={() => setActiveLegalTab('policy')}
              className="hover:text-purple-400 transition-colors cursor-pointer"
            >
              পলিসি নিয়মাবলি
            </button>
            <span className="text-slate-800">|</span>
            <button 
              onClick={() => setActiveLegalTab('cookies')}
              className="hover:text-purple-400 transition-colors cursor-pointer"
            >
              কুকিস কনফিগার
            </button>
          </div>
        </div>

      </div>

      {/* Beautiful High-contrast Legal Modals */}
      {activeLegalTab && (
        <div id="legal-modal-backdrop" className="fixed inset-0 z-[9990] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="relative w-full max-w-2xl bg-[#090416] border border-purple-500/30 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(147,51,234,0.15)] flex flex-col max-h-[85vh]">
            {/* Header */}
            <div className="p-6 border-b border-purple-500/10 flex items-center justify-between bg-purple-950/20">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
                  <ShieldCheck className="w-4 h-4 text-purple-400" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-slate-100">
                  {activeLegalTab === 'terms' && "ব্যবহারের শর্তাবলী (Terms & Conditions)"}
                  {activeLegalTab === 'policy' && "গোপনীয়তা নীতি ও নিয়মাবলি (Privacy Policy)"}
                  {activeLegalTab === 'cookies' && "কুকিজ কনফিগারেশন (Cookies Settings)"}
                </h3>
              </div>
              <button 
                onClick={() => setActiveLegalTab(null)}
                className="p-1.5 hover:bg-slate-850 rounded-full text-slate-400 hover:text-white transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content body */}
            <div className="p-6 overflow-y-auto space-y-4 custom-scrollbar text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
              {activeLegalTab === 'terms' && (
                <div className="space-y-4 text-left">
                  <p className="text-purple-300 font-semibold text-sm">Avexon.bd ওয়েবসাইট ও ডিজিটাল সেবাসমূহ ব্যবহারের সাধারণ নিয়মাবলী ও শর্তাবলী:</p>
                  
                  <div className="space-y-2">
                    <h5 className="font-bold text-slate-100 flex items-center gap-2">১. সাধারণ নির্দেশিকা</h5>
                    <p className="pl-4">আমাদের অফারকৃত রেডিমেড ওয়েবসাইট এবং কাস্টম প্রজেক্টসমূহ পেতে হলে গ্রাহকদের আমাদের অর্ডার ফরমে সঠিক তথ্য সরবরাহ করতে হবে। ভুল তথ্য বা ভুয়া অর্ডারের ক্ষেত্রে Avexon.bd যেকোনো সময় সেবা বাতিল করতে পারে।</p>
                  </div>

                  <div className="space-y-2">
                    <h5 className="font-bold text-slate-100">২. পেমেন্ট ও বুকিং নিয়ম</h5>
                    <p className="pl-4">আমাদের সমস্ত রেডিমেড ওয়েবসাইট শপের ডিজাইন কিনতে ভেরিফাইড ট্রানজেকশন সম্পন্ন করা আবশ্যক। bKash বা Nagad-এ পেমেন্ট করার পর সঠিক মোবাইল নম্বর এবং ট্রানজেকশন আইডি (TxID) প্রদান করে অর্ডার কনফার্ম করতে হবে।</p>
                  </div>

                  <div className="space-y-2">
                    <h5 className="font-bold text-slate-100">৩. সেবা ডেলিভারি ও সাপোর্ট</h5>
                    <p className="pl-4">অর্ডার পরিশোধিত করার পর সাধারণত ২৪ থেকে ৭২ ঘণ্টার মধ্যে প্রজেক্টের ডেলিভারি নিশ্চিত করা হয়। ফ্রি কাস্টমার সাপোর্ট ও গাইডলাইন সেবা শুধুমাত্র নির্দিষ্ট মেয়াদ পর্যন্ত প্রযোজ্য।</p>
                  </div>

                  <div className="space-y-2">
                    <h5 className="font-bold text-slate-100">৪. রিফান্ড এবং রিটার্ন পলিসি</h5>
                    <p className="pl-4">Avexon.bd সর্বাধুনিক কার্যকারী কোড সরবরাহ করে। ডোমেইন, হোস্টিং বা ডেডিকেটেড লাইসেন্স অ্যাক্টিভেশনের পর কিংবা ডিজাইন ক্লায়েন্টের সার্ভারে ডেলিভারি হওয়ার পর কোনো ক্যাশ রিফান্ড প্রদান করা হয় না।</p>
                  </div>

                  <div className="space-y-2">
                    <h5 className="font-bold text-slate-100">৫. সংশোধন ও পরিবর্তন</h5>
                    <p className="pl-4">Avexon.bd যেকোনো সময় এই ব্যবহারের শর্তাবলী সংশোধন, পরিবর্তন বা পরিমার্জন করার অধিকার সংরক্ষণ করে। যেকোনো পরিবর্তনের পর গ্রাহকের চলমান এবং নতুন প্রজেক্টের ক্ষেত্রে তা স্বয়ংক্রিয়ভাবে কার্যকর হবে।</p>
                  </div>
                </div>
              )}

              {activeLegalTab === 'policy' && (
                <div className="space-y-4 text-left">
                  <p className="text-purple-300 font-semibold text-sm">Avexon.bd এ আপনার ব্যক্তিগত ও প্রাতিষ্ঠানিক তথ্যের গোপনীয়তা রক্ষা করা আমাদের প্রথম অঙ্গীকার:</p>
                  
                  <div className="space-y-2">
                    <h5 className="font-bold text-slate-100">১. তথ্য সংগ্রহ</h5>
                    <p className="pl-4">অর্ডার কনফার্ম করার জন্য কাস্টমার নাম, মোবাইল নম্বর এবং কাঙ্ক্ষিত ওয়েবসাইটের বিবরণ সংগ্রহ করা হয়। এটি শুধুমাত্র আপনার প্রজেক্টটি সঠিকভাবে প্রস্তুত করতে ব্যবহৃত হয়।</p>
                  </div>

                  <div className="space-y-2">
                    <h5 className="font-bold text-slate-100">২. তথ্যের নিরাপত্তা ও ব্যবহার</h5>
                    <p className="pl-4">আপনার হোয়াটসঅ্যাপ নম্বর বা গ্রাহক পরিচিতি তৃতীয় কোনো ব্যবসায়িক বা বিজ্ঞাপন এজেন্সির কাছে কখনই বিক্রয় বা বিনিময় করা হয় না। আমাদের ইন্টারনাল ডেভেলপার টিম অত্যন্ত কঠোর এনক্রিপশনের মাধ্যমে প্রজেক্ট ডেটা সংরক্ষণ করে।</p>
                  </div>

                  <div className="space-y-2">
                    <h5 className="font-bold text-slate-100">৩. হোস্টিং ও ডেটা ট্রান্সফার</h5>
                    <p className="pl-4">আপনার সাইটের কোনো ইউজার ডেটা বা ব্যক্তিগত তথ্য আমাদের এন্ড থেকে ট্র্যাক করা হয় না। ডেলিভারিকৃত কোড সম্পূর্ণ স্বাধীন এবং আপনার নিজস্ব সিপ্যানেল বা ক্লাউড হোস্টিং এ সংরক্ষিত থাকে।</p>
                  </div>

                  <div className="space-y-2">
                    <h5 className="font-bold text-slate-100">৪. পাসওয়ার্ড ও ক্রেডেনশিয়াল পলিসি</h5>
                    <p className="pl-4">অর্ডার ডেলিভারির সুবিধার্থে কোনো এডমিন এক্সেস বা ক্রেডেনশিয়াল নেয়ার প্রয়োজন হলে এবং তা অর্ডার সম্পন্ন হওয়ার পর গ্রাহক সেটি অবিলম্বে রিসেট করার জন্য দায়ী থাকবেন।</p>
                  </div>
                </div>
              )}

              {activeLegalTab === 'cookies' && (
                <div className="space-y-4 text-left">
                  <p className="text-purple-300 font-semibold text-sm">Avexon.bd তে আপনার ব্রাউজিং অভিজ্ঞতা আরো নিখুঁত করতে আমাদের কুকিজ ব্যবহারের নীতিমালা:</p>
                  
                  <div className="space-y-2">
                    <h5 className="font-bold text-slate-100">১. কুকিজ কী?</h5>
                    <p className="pl-4">কুকিজ হলো ছোট ছোট টেক্সট ফাইল যা আপনার ব্রাউজারে সংরক্ষিত থাকে। আমাদের সাইটের গতিশীল ফিচার এবং ইউজার ডিফল্ট সেটিং মনে রাখতে আমরা এর ব্যবহার করে থাকি।</p>
                  </div>

                  <div className="space-y-2">
                    <h5 className="font-bold text-slate-100">২. আমরা কেন কুকিজ ব্যবহার করি</h5>
                    <p className="pl-4">আমাদের অর্ডার ট্র্যাকিং হিস্টোরি, থিম সেটিং এবং নিরাপত্তা রক্ষার্থে সেশন কুকিজ কার্যকর থাকে। এর মাধ্যমে ব্রাউজ করার সময় ডাটা পুনরায় টাইপ করতে হয় না।</p>
                  </div>

                  <div className="space-y-2">
                    <h5 className="font-bold text-slate-100">৩. কুকিজ নিয়ন্ত্রণ ও কনফিগারেশন</h5>
                    <p className="pl-4">আপনি যেকোনো সময় আপনার ব্রাউজার অপশন বা কুকি ক্লিয়ারেন্সের মাধ্যমে আমাদের সংগৃহীত কুকিজ মুছে দিতে পারেন। তবে কিছু ক্ষেত্রে অর্ডার কার্ড বা ট্র্যাকার সেশন নিষ্ক্রিয় হয়ে যেতে পারে।</p>
                  </div>

                  <div className="space-y-2">
                    <h5 className="font-bold text-slate-100">৪. তৃতীয় পক্ষ ট্র্যাকিং</h5>
                    <p className="pl-4">বিজ্ঞাপন ও সাইটের ভিজিটর ট্রাফিকের পরিমাণ পর্যবেক্ষণের উদ্দেশ্যে আমাদের ওয়েবসাইটে গুগল অ্যানালিটিক্স বা ফেসবুক পিক্সেল-এর মতো বিশ্বস্ত থার্ড-পার্টি সার্ভিস কুকিজ ব্যবহৃত হতে পারে।</p>
                  </div>
                </div>
              )}
            </div>

            {/* Footer buttons */}
            <div className="p-4 border-t border-purple-500/10 flex justify-end bg-purple-950/10 shrink-0">
              <button
                type="button"
                onClick={() => setActiveLegalTab(null)}
                className="px-6 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 text-xs text-white font-bold tracking-wide hover:brightness-110 active:scale-95 transition-all cursor-pointer"
              >
                বন্ধ করুন (Close)
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}
