import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { 
  X, 
  ArrowLeft, 
  ArrowRight, 
  User, 
  Phone, 
  ShieldCheck, 
  Check, 
  Copy, 
  ExternalLink, 
  Lock, 
  Eye, 
  EyeOff, 
  Clock, 
  Sparkles, 
  CheckCircle2, 
  Settings, 
  FileText, 
  AlertCircle,
  Loader2,
  Search,
  Star,
  Printer,
  ShoppingBag,
  Globe
} from "lucide-react";
import { useContent } from "../context/ContentContext";
import { supabase, isSupabaseConfigured, supabaseOrders, isSupabaseOrdersConfigured } from "../lib/supabase";
import { safeLocalStorage } from "../utils/safeStorage";

// Custom WhatsApp Icon Component (SVG based, highly accurate)
const WhatsAppIcon = ({ className = "w-5 h-5" }) => (
  <svg 
    className={className} 
    fill="currentColor" 
    viewBox="0 0 24 24" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.062 5.248 5.308 0 11.777 0c3.132.001 6.077 1.219 8.291 3.434 2.214 2.214 3.43 5.159 3.43 8.29-.005 6.467-5.251 11.714-11.72 11.714-2.006-.001-3.97-.514-5.714-1.493L0 24zm6.59-4.846c1.6.95 3.197 1.451 4.782 1.451 5.385 0 9.761-4.381 9.764-9.765.002-2.607-1.01-5.059-2.85-6.902C16.442 2.093 13.993 1.076 11.8 1.076c-5.39 0-9.766 4.381-9.77 9.764-.002 1.839.467 3.65 1.356 5.242l-.994 3.633 3.665-.961zm11.715-4.484c-.312-.156-1.848-.912-2.129-1.014-.282-.102-.487-.156-.69.156-.203.312-.782.986-.957 1.189-.176.203-.352.229-.664.073-.312-.156-1.32-.486-2.514-1.55-.929-.829-1.556-1.854-1.738-2.166-.182-.313-.02-.481.136-.636.14-.14.312-.365.469-.547.156-.182.208-.312.312-.521.104-.208.052-.39-.026-.547-.078-.156-.69-1.664-.945-2.279-.249-.599-.503-.518-.69-.527-.179-.009-.384-.01-.59-.01-.205 0-.54.078-.823.385-.283.307-1.078 1.055-1.078 2.573 0 1.517 1.102 2.984 1.256 3.193.154.208 2.169 3.312 5.255 4.643.734.316 1.307.505 1.753.647.737.234 1.408.201 1.939.122.592-.088 1.848-.756 2.109-1.448.261-.693.261-1.289.183-1.417-.078-.129-.282-.208-.594-.36z"/>
  </svg>
);

export type OrderStatus = 'Pending' | 'Payment Checking' | 'Confirmed' | 'Working' | 'Done';

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  websiteTitle: string;
  price: number;
  paymentMethod: 'bkash' | 'nagad' | 'custom_pkg' | string;
  senderNumber?: string;
  transactionId?: string;
  status: OrderStatus;
  createdAt: string;
  createdAtISO?: string;
  hasReviewed?: boolean;
  desiredWebsiteName?: string;
  // Filled when status is Done
  websiteLink?: string;
  adminLogin?: string;
  adminPassword?: string;
  adminNotes?: string;
}

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedWebsiteTitle?: string;
  checkoutType?: 'readymade' | 'custom';
  initialMode?: 'checkout' | 'tracking';
}

export default function CheckoutModal({ isOpen, onClose, preselectedWebsiteTitle, checkoutType: initialCheckoutType, initialMode }: CheckoutModalProps) {
  const { websites, testimonials, updateTestimonials, offerConfig, hero, contactConfig } = useContent();

  const [isOfferExpired, setIsOfferExpired] = useState(false);

  useEffect(() => {
    if (!offerConfig || !offerConfig.show) {
      setIsOfferExpired(true);
      return;
    }
    if (offerConfig.timerType === "midnight") {
      setIsOfferExpired(false);
      return;
    }
    if (offerConfig.timerType === "custom_target" && offerConfig.customTargetDate) {
      const checkExpiry = () => {
        try {
          const targetTime = new Date(offerConfig.customTargetDate!).getTime();
          setIsOfferExpired(Date.now() >= targetTime);
        } catch (e) {
          setIsOfferExpired(true);
        }
      };
      
      checkExpiry();
      const interval = setInterval(checkExpiry, 1000);
      return () => clearInterval(interval);
    }
    setIsOfferExpired(false);
  }, [offerConfig]);

  const isOfferActiveVal = !isOfferExpired && !!offerConfig?.show;

  const showDiscount = !!(isOfferActiveVal && offerConfig?.discountActive && offerConfig?.discountPercentage);
  const [step, setStep] = useState<number>(1);
  const [name, setName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [desiredWebsiteName, setDesiredWebsiteName] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<'bkash' | 'nagad'>('bkash');
  const [senderNumber, setSenderNumber] = useState<string>("");
  const [transactionId, setTransactionId] = useState<string>("");

  const paymentNumber = (paymentMethod === 'bkash' ? contactConfig?.bkashNumber : contactConfig?.nagadNumber) || hero?.whatsappNumber || "01613911528";
  
  // Interactive bKash/Nagad mock gateway states
  const [gatewayStage, setGatewayStage] = useState<'number' | 'otp' | 'confirm'>('number');
  const [gatewayOtp, setGatewayOtp] = useState<string>("");
  const [invoiceId, setInvoiceId] = useState<string>(() => Math.floor(100000 + Math.random() * 900000).toString());
  
  const [selectedWebsite, setSelectedWebsite] = useState<string>(() => {
    if (preselectedWebsiteTitle) {
      if (preselectedWebsiteTitle.includes("||Price:")) {
        return preselectedWebsiteTitle.split("||Price:")[0];
      }
      return preselectedWebsiteTitle;
    }
    return websites[0]?.title || "";
  });

  const [price, setPrice] = useState<number>(() => {
    let basePrice = 8000;
    if (preselectedWebsiteTitle) {
      if (preselectedWebsiteTitle.includes("||Price:")) {
        const customPrice = parseInt(preselectedWebsiteTitle.split("||Price:")[1], 10);
        if (!isNaN(customPrice)) basePrice = customPrice;
      } else {
        const webObj = websites.find(w => w.title === preselectedWebsiteTitle);
        if (webObj) basePrice = webObj.price;
      }
    } else {
      if (websites && websites.length > 0) {
        basePrice = websites[0].price;
      }
    }

    const isOfferActiveInit = (() => {
      if (!offerConfig || !offerConfig.show) return false;
      if (offerConfig.timerType === "midnight") return true;
      if (offerConfig.timerType === "custom_target" && offerConfig.customTargetDate) {
        try {
          const targetTime = new Date(offerConfig.customTargetDate).getTime();
          return targetTime > Date.now();
        } catch (e) {
          return false;
        }
      }
      return true;
    })();

    if (isOfferActiveInit && offerConfig?.discountActive && offerConfig?.discountPercentage) {
      return Math.round(basePrice * (1 - offerConfig.discountPercentage / 100));
    }
    return basePrice;
  });

  const [checkoutType, setCheckoutType] = useState<'readymade' | 'custom'>(() => {
    if (preselectedWebsiteTitle) {
      if (
        preselectedWebsiteTitle.includes("কাস্টম") || 
        preselectedWebsiteTitle.includes("প্যাকেজ") || 
        preselectedWebsiteTitle.includes("Package") || 
        preselectedWebsiteTitle.includes("||Price:")
      ) {
        return 'custom';
      }
    }
    return initialCheckoutType || 'readymade';
  });

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // States for verification / error
  const [errorText, setErrorText] = useState<string>("");
  const [copiedText, setCopiedText] = useState<string>("");

  // Storage states
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [showSubmittedCelebration, setShowSubmittedCelebration] = useState<boolean>(false);

  // Tab-specific modes and status inquiry
  const [modalMode, setModalMode] = useState<'checkout' | 'tracking'>(initialMode || 'checkout');

  const [searchOrderId, setSearchOrderId] = useState<string>("");

  const [searchError, setSearchError] = useState<string>("");
  const [filterQuery, setFilterQuery] = useState<string>("");

  const [searchedOrder, setSearchedOrder] = useState<Order | null>(null);

  const [searchedOrdersList, setSearchedOrdersList] = useState<Order[]>([]);

  // Review System state managers
  const [reviewRating, setReviewRating] = useState<number>(5);
  const [reviewText, setReviewText] = useState<string>("");
  const [reviewName, setReviewName] = useState<string>("");
  const [reviewRole, setReviewRole] = useState<string>("");
  const [isReviewSubmitting, setIsReviewSubmitting] = useState<boolean>(false);
  const [reviewSuccess, setReviewSuccess] = useState<boolean>(false);

  // Invoice Display modal overlays
  const [showInvoiceOpen, setShowInvoiceOpen] = useState<boolean>(false);
  const [invoiceOrder, setInvoiceOrder] = useState<Order | null>(null);

  // Admin Simulator Control panel states
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState<boolean>(false);
  const [simStatus, setSimStatus] = useState<OrderStatus>('Pending');
  const [simWebsiteLink, setSimWebsiteLink] = useState<string>("");
  const [simAdminLogin, setSimAdminLogin] = useState<string>("");
  const [simAdminPassword, setSimAdminPassword] = useState<string>("");
  const [simAdminNotes, setSimAdminNotes] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // Reset gateway stage when payment method or modal opens
  useEffect(() => {
    if (isOpen) {
      setGatewayStage('number');
      setGatewayOtp("");
      setErrorText("");
      setInvoiceId(Math.floor(100000 + Math.random() * 900000).toString());
    }
  }, [paymentMethod, isOpen]);

  // Adjust prices based on selected Readymade Website Model
  useEffect(() => {
    if (checkoutType === 'readymade') {
      const webObj = websites.find(w => w.title === selectedWebsite);
      if (webObj) {
        let finalPrice = webObj.price;
        if (showDiscount) {
          finalPrice = Math.round(webObj.price * (1 - offerConfig.discountPercentage / 100));
        }
        setPrice(finalPrice);
      }
    }
  }, [selectedWebsite, websites, checkoutType, showDiscount, offerConfig]);

  // Safely default ready-made selections if we are on ready-made mode but selected is a custom package
  useEffect(() => {
    if (checkoutType === 'readymade' && isOpen) {
      const isCustom = selectedWebsite?.includes("কাস্টম") || selectedWebsite?.includes("প্যাকেজ") || selectedWebsite?.includes("Package") || selectedWebsite?.includes("||Price:");
      if (isCustom || !selectedWebsite) {
        const defaultTitle = websites[0]?.title || "";
        setSelectedWebsite(defaultTitle);
        let defaultPrice = websites[0]?.price || 8000;
        if (showDiscount) {
          defaultPrice = Math.round(defaultPrice * (1 - offerConfig.discountPercentage / 100));
        }
        setPrice(defaultPrice);
      }
    }
  }, [checkoutType, websites, selectedWebsite, isOpen, showDiscount, offerConfig]);

  // Read orders list if available
  useEffect(() => {
    const normalizeSupabaseOrder = (record: any) => {
      if (!record) return null;
      if (record.value && typeof record.value === "object") {
        return { ...record.value, id: record.value.id || record.id };
      }
      if (record.value && typeof record.value === "string") {
        try {
          const parsed = JSON.parse(record.value);
          if (parsed && typeof parsed === "object") {
            return { ...parsed, id: parsed.id || record.id };
          }
        } catch (_) {}
      }
      if (record.customerName || record.customerPhone || record.price || record.status) {
        const clean = { ...record };
        if (clean.value === null || clean.value === undefined) {
          delete clean.value;
        }
        return clean;
      }
      return record;
    };

    if (isOpen) {
      const fetchServerOrders = async () => {
        try {
          const response = await fetch("/api/orders");
          const resJson = await response.json();
          if (resJson.success && resJson.data) {
            const rawOrders: any[] = resJson.data;
            const serverOrders: Order[] = rawOrders.map(normalizeSupabaseOrder).filter(Boolean);
            const stored = safeLocalStorage.getItem("avexon_user_orders");
            let merged = serverOrders;
            if (stored) {
              try {
                const parsed = JSON.parse(stored);
                if (Array.isArray(parsed)) {
                  const normalizedStored = parsed.map(normalizeSupabaseOrder).filter(Boolean);
                  const serverIds = new Set(serverOrders.map((o: any) => o.id));
                  const localOnly = normalizedStored.filter((o: any) => o && o.id && !serverIds.has(o.id));
                  merged = [...serverOrders, ...localOnly];
                }
              } catch (_) {}
            }
            setAllOrders(merged);
            safeLocalStorage.setItem("avexon_user_orders", JSON.stringify(merged));
            
            // Show all projects first in tracking mode
            if (modalMode === 'tracking') {
              setSearchedOrdersList(merged);
            }
          } else {
            const stored = safeLocalStorage.getItem("avexon_user_orders");
            if (stored) {
              const parsed = JSON.parse(stored) as Order[];
              const normalized = parsed.map(normalizeSupabaseOrder).filter(Boolean);
              setAllOrders(normalized);
              if (modalMode === 'tracking') {
                setSearchedOrdersList(normalized);
              }
            }
          }
        } catch (err) {
          console.warn("Failed to fetch server orders, using fallback: ", err);
          const stored = safeLocalStorage.getItem("avexon_user_orders");
          if (stored) {
            const parsed = JSON.parse(stored) as Order[];
            const normalized = parsed.map(normalizeSupabaseOrder).filter(Boolean);
            setAllOrders(normalized);
            if (modalMode === 'tracking') {
              setSearchedOrdersList(normalized);
            }
          }
        }
      };
      fetchServerOrders();
    }
  }, [isOpen, modalMode]);

  // Real-time Order synchronization via Supabase for immediate customer status updates on customer tracking screens
  useEffect(() => {
    let ordersSubscription: any = null;
    
    const normalizeSupabaseOrder = (record: any) => {
      if (!record) return null;
      if (record.value && typeof record.value === "object") {
        return { ...record.value, id: record.value.id || record.id };
      }
      if (record.value && typeof record.value === "string") {
        try {
          const parsed = JSON.parse(record.value);
          if (parsed && typeof parsed === "object") {
            return { ...parsed, id: parsed.id || record.id };
          }
        } catch (_) {}
      }
      if (record.customerName || record.customerPhone || record.price || record.status) {
        const clean = { ...record };
        if (clean.value === null || clean.value === undefined) {
          delete clean.value;
        }
        return clean;
      }
      return record;
    };

    if (isSupabaseOrdersConfigured && supabaseOrders && isOpen) {
      ordersSubscription = supabaseOrders
        .channel("avexon_orders_realtime_modal")
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "avexon_orders" },
          (payload: any) => {
            if (payload.eventType === "DELETE") {
              const deletedId = payload.old?.id;
              if (deletedId) {
                setAllOrders(prev => {
                  const updated = prev.filter(o => o.id !== deletedId);
                  safeLocalStorage.setItem("avexon_user_orders", JSON.stringify(updated));
                  return updated;
                });
                if (searchedOrdersList.length > 0) {
                  setSearchedOrdersList(prev => prev.filter(o => o.id !== deletedId));
                }
                if (activeOrder && activeOrder.id === deletedId) {
                  setActiveOrder(null);
                }
                if (searchedOrder && searchedOrder.id === deletedId) {
                  setSearchedOrder(null);
                }
              }
            } else if (payload.eventType === "INSERT") {
              const newRecord = payload.new;
              if (newRecord) {
                const newOrder = normalizeSupabaseOrder(newRecord);
                if (newOrder && newOrder.id) {
                  setAllOrders(prev => {
                    const exists = prev.some(o => o.id === newOrder.id);
                    if (exists) return prev;
                    const updated = [newOrder, ...prev];
                    safeLocalStorage.setItem("avexon_user_orders", JSON.stringify(updated));
                    return updated;
                  });
                }
              }
            } else if (payload.eventType === "UPDATE") {
              const updatedRecord = payload.new;
              if (updatedRecord) {
                const updatedOrder = normalizeSupabaseOrder(updatedRecord);
                if (updatedOrder && updatedOrder.id) {
                  setAllOrders(prev => {
                    const index = prev.findIndex(o => o.id === updatedOrder.id);
                    let updated;
                    if (index !== -1) {
                      updated = [...prev];
                      updated[index] = updatedOrder;
                    } else {
                      updated = [updatedOrder, ...prev];
                    }
                    safeLocalStorage.setItem("avexon_user_orders", JSON.stringify(updated));
                    return updated;
                  });

                  // Update Active / Searched targets on receiving instant broadcast!
                  setActiveOrder(prev => {
                    if (prev && prev.id === updatedOrder.id) {
                      return updatedOrder;
                    }
                    return prev;
                  });
                  setSearchedOrder(prev => {
                    if (prev && prev.id === updatedOrder.id) {
                      return updatedOrder;
                    }
                    return prev;
                  });
                  setSearchedOrdersList(prev => {
                    const index = prev.findIndex(o => o.id === updatedOrder.id);
                    if (index !== -1) {
                      const copy = [...prev];
                      copy[index] = updatedOrder;
                      return copy;
                    }
                    return prev;
                  });
                }
              }
            }
          }
        )
        .subscribe();
    }

    return () => {
      if (ordersSubscription) {
        ordersSubscription.unsubscribe();
      }
    };
  }, [isOpen, activeOrder, searchedOrder, searchedOrdersList, isSupabaseOrdersConfigured]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("modal-open");
    } else {
      document.body.classList.remove("modal-open");
    }
    return () => {
      document.body.classList.remove("modal-open");
    };
  }, [isOpen]);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedText(label);
      setTimeout(() => setCopiedText(""), 2000);
    });
  };

  const handleCustomPackageSubmit = () => {
    setIsSubmitting(true);
    setErrorText("");

    setTimeout(() => {
      setIsSubmitting(false);

      // Capture dynamic timestamp inside timezone
      const now = new Date();
      const formattedDate = now.toLocaleDateString("bn-BD", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
      });

      const trackingId = `AVX-PKG-${Math.floor(100000 + Math.random() * 900000)}`;

      const newOrder: Order = {
        id: trackingId,
        customerName: name.trim(),
        customerPhone: phone.trim(),
        websiteTitle: selectedWebsite,
        price: price,
        paymentMethod: 'custom_pkg',
        senderNumber: phone.trim(),
        transactionId: "No Tracking (Custom Package)",
        status: 'Pending',
        createdAt: formattedDate,
        createdAtISO: new Date().toISOString()
      };

      // Save order in context list
      const updatedOrders = [newOrder, ...allOrders];
      setAllOrders(updatedOrders);
      setActiveOrder(newOrder);

      try {
        safeLocalStorage.setItem("avexon_user_orders", JSON.stringify(updatedOrders));
        window.dispatchEvent(new Event("storage"));
        // Sync order to backend server database
        fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newOrder)
        }).catch(err => console.warn("Failed server order sync: ", err));

        // Also client-side upsert directly to Supabase flat table for instant cross-browser broadcast
        if (isSupabaseOrdersConfigured && supabaseOrders) {
          (async () => {
            try {
              await supabaseOrders.from("avexon_orders").upsert({ id: newOrder.id, value: newOrder });
              // Broadcast order_created event across custom channel for immediate reload-free synchronization
              try {
                await supabaseOrders.channel("avexon_realtime_broadcast").send({
                  type: "broadcast",
                  event: "order_created",
                  payload: newOrder
                });
                console.log("Broadcasted order_created across custom channel:", newOrder.id);
              } catch (be) {
                console.warn("Could not broadcast order_created:", be);
              }
            } catch (err) {
              console.warn("Direct Supabase flat order upload failed:", err);
            }
          })();
        }
      } catch (e) {
        console.warn("Storage limits or permissions failed: ", e);
      }

      // Trigger success celebration animation, then show live tracker
      setShowSubmittedCelebration(true);
      setStep(4);
      setTimeout(() => {
        setShowSubmittedCelebration(false);
      }, 4500);
    }, 1200);
  };

  // Nav Handlers
  const handleNextStep1 = () => {
    setErrorText("");
    if (!name.trim()) {
      setErrorText("অনুগ্রহ করে আপনার নাম প্রদান করুন।");
      return;
    }
    const cleanPhone = phone.trim();
    if (!cleanPhone || cleanPhone.length < 11) {
      setErrorText("অনুগ্রহ করে একটি সঠিক ১১ ডিজিটের হোয়াটসঅ্যাপ নম্বর প্রদান করুন।");
      return;
    }
    
    if (checkoutType === 'readymade' && !desiredWebsiteName.trim()) {
      setErrorText("অনুগ্রহ করে আপনার কাঙ্ক্ষিত ওয়েবসাইটের নাম (Website Name) প্রদান করুন।");
      return;
    }
    
    if (checkoutType === 'custom') {
      handleCustomPackageSubmit();
    } else {
      // Select payment method & verification (Step 2)
      setStep(2);
    }
  };

  const handleSubmitOrder = () => {
    setErrorText("");
    const cleanSender = senderNumber.trim();
    if (!cleanSender || cleanSender.length < 3) {
      setErrorText(`অনুগ্রহ করে আপনার ${paymentMethod === 'bkash' ? 'বিকাশ' : 'নগদ'} নাম্বারের শেষ ৩-৪টি ডিজিট (অথবা সম্পূর্ণ নম্বরটি) লিখুন।`);
      return;
    }
    if (!transactionId.trim() || transactionId.trim().length < 4) {
      setErrorText("অনুগ্রহ করে আপনার পেমেন্টের সঠিক ট্রানজেকশন আইডি (TxID) অথবা শেষ কয়েকটি অনন্য সংখ্যা প্রদান করুন।");
      return;
    }

    // Capture dynamic timestamp inside timezone
    const now = new Date();
    const formattedDate = now.toLocaleDateString("bn-BD", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    });

    const trackingId = `AVX-${Math.floor(100000 + Math.random() * 900000)}`;

    const newOrder: Order = {
      id: trackingId,
      customerName: name.trim(),
      customerPhone: phone.trim(),
      websiteTitle: selectedWebsite,
      price: price,
      paymentMethod: paymentMethod,
      senderNumber: senderNumber.trim(),
      transactionId: transactionId.trim(),
      status: 'Pending',
      createdAt: formattedDate,
      desiredWebsiteName: desiredWebsiteName.trim(),
      createdAtISO: new Date().toISOString()
    };

    // Save order in context list
    const updatedOrders = [newOrder, ...allOrders];
    setAllOrders(updatedOrders);
    setActiveOrder(newOrder);

    try {
      safeLocalStorage.setItem("avexon_user_orders", JSON.stringify(updatedOrders));
      window.dispatchEvent(new Event("storage"));
      // Sync order to backend server database
      fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newOrder)
      }).catch(err => console.warn("Failed server order sync: ", err));

      // Also client-side upsert directly to Supabase flat table for instant cross-browser broadcast
      if (isSupabaseOrdersConfigured && supabaseOrders) {
        (async () => {
          try {
            await supabaseOrders.from("avexon_orders").upsert({ id: newOrder.id, value: newOrder });
            // Broadcast order_created event across custom channel for immediate reload-free synchronization
            try {
              await supabaseOrders.channel("avexon_realtime_broadcast").send({
                type: "broadcast",
                event: "order_created",
                payload: newOrder
              });
              console.log("Broadcasted order_created across custom channel:", newOrder.id);
            } catch (be) {
              console.warn("Could not broadcast order_created:", be);
            }
          } catch (err) {
            console.warn("Direct Supabase flat order upload failed:", err);
          }
        })();
      }
    } catch (e) {
      console.warn("Storage limits or permissions failed: ", e);
    }

    // Trigger success celebration animation, then show live tracker
    setShowSubmittedCelebration(true);
    setStep(4);
    setTimeout(() => {
      setShowSubmittedCelebration(false);
    }, 4500);
  };

  // Switch focus if user wants to submit a clean order
  const handleResetForNewOrder = () => {
    setActiveOrder(null);
    setSearchedOrder(null);
    setSearchedOrdersList([]);
    setName("");
    setPhone("");
    setDesiredWebsiteName("");
    setSenderNumber("");
    setTransactionId("");
    setStep(1);
    setModalMode('checkout');
  };

  const handleSearchOrder = () => {
    setSearchError("");
    setSearchedOrder(null);
    setSearchedOrdersList([]);
    
    const query = searchOrderId.trim();
    if (!query) {
      setSearchError("আপনার ট্র্যাকিং আইডি অথবা মোবাইল নম্বর লিখুন।");
      return;
    }
    
    const queryUpper = query.toUpperCase();
    
    // Load fresh list
    let currentOrders: Order[] = [];
    try {
      const stored = safeLocalStorage.getItem("avexon_user_orders");
      if (stored) {
        currentOrders = JSON.parse(stored) as Order[];
      } else {
        currentOrders = allOrders;
      }
    } catch (e) {
      currentOrders = allOrders;
    }

    const cleanQueryPhone = query.replace(/\D/g, "");
    
    let matchedOrders: Order[] = [];
    if (cleanQueryPhone.length >= 8) {
      matchedOrders = currentOrders.filter(o => {
        const cleanCustomerPhone = o.customerPhone?.replace(/\D/g, "") || "";
        return cleanCustomerPhone.endsWith(cleanQueryPhone) || cleanQueryPhone.endsWith(cleanCustomerPhone);
      });
    }

    if (matchedOrders.length === 0) {
      matchedOrders = currentOrders.filter(o => o.customerPhone === query);
    }

    if (matchedOrders.length > 0) {
      setSearchedOrdersList(matchedOrders);
    } else {
      const singleMatch = currentOrders.find(o => (o.id.toUpperCase() === queryUpper || o.id.toUpperCase() === `AVX-${queryUpper}`));
      if (singleMatch) {
        setSearchedOrder(singleMatch);
      } else {
        setSearchError("আপনার প্রদত্ত আইডি বা মোবাইল নম্বর দিয়ে কোনো সক্রিয় রেকর্ড পাওয়া যায়নি। তথ্যটি পুনরায় চেক করুন।");
      }
    }
  };

  const handleReviewSubmit = (targetOrder: Order) => {
    if (!reviewText.trim() || reviewText.trim().length < 5) {
      alert("অনুগ্রহ করে আপনার মূল্যায়নটি বিস্তারিত লিখুন (কমপক্ষে ৫ অক্ষর)!");
      return;
    }
    
    setIsReviewSubmitting(true);
    setTimeout(() => {
      // Build a beautiful Testimonial node
      const newReview: any = {
        id: `t-${Date.now()}`,
        name: reviewName.trim() || targetOrder.customerName,
        role: reviewRole.trim() || "সম্মানিত এভেক্সন গ্রাহক",
        avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150",
        text: reviewText.trim(),
        rating: reviewRating,
        type: "readymade"
      };

      // Append review to ContentContext testimonials list
      updateTestimonials([newReview, ...testimonials]);

      // Update order state hasReviewed in localStorage or state
      if (activeOrder && activeOrder.id === targetOrder.id) {
        setActiveOrder({ ...activeOrder, hasReviewed: true });
      }
      if (searchedOrder && searchedOrder.id === targetOrder.id) {
        setSearchedOrder({ ...searchedOrder, hasReviewed: true });
      }

      try {
        const stored = safeLocalStorage.getItem('avexon_orders');
        if (stored) {
          const parsed = JSON.parse(stored);
          const updated = parsed.map(o => o.id === targetOrder.id ? { ...o, hasReviewed: true } : o);
          safeLocalStorage.setItem('avexon_orders', JSON.stringify(updated));
        }
      } catch (e) {}

      setIsReviewSubmitting(false);
      setReviewSuccess(true);
      setReviewText("");
    }, 1200);
  };

  const renderGorgeousCelebration = (order: Order) => {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="w-full max-w-md mx-auto rounded-2xl p-8 bg-[#090314] border border-white/5 shadow-2xl text-center flex flex-col items-center justify-center min-h-[360px] select-none"
      >
        {/* Simple, sleek minimalist green ring with Check icon */}
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="relative mb-6"
        >
          <div className="w-16 h-16 rounded-full border border-emerald-500/20 bg-emerald-500/5 flex items-center justify-center">
            <Check className="w-8 h-8 text-emerald-400 stroke-[2]" />
          </div>
        </motion.div>

        {/* Minimalist Heading & Subheading */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.4 }}
          className="space-y-2.5"
        >
          <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-tight">
            অর্ডারটি সফলভাবে সাবমিট হয়েছে
          </h3>
          <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
            আপনার সাইটের ডেভেলপমেন্ট রিকোয়েস্টটি সিস্টেমে নথিভুক্ত করা হয়েছে। কিছুক্ষণের মধ্যে লাইভ ট্র্যাকার সক্রিয় হচ্ছে।
          </p>
        </motion.div>

        {/* Minimalist tracking loader */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="mt-8 w-full max-w-xs space-y-2"
        >
          <div className="w-full bg-slate-800/35 rounded-full h-[3px] overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-indigo-500"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 4.2, ease: "easeInOut" }}
            />
          </div>
          <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">
            Loading Live Tracking
          </p>
        </motion.div>
      </motion.div>
    );
  };

  const renderCustomPackageConfirmation = (order: Order) => {
    return (
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md mx-auto rounded-3xl p-6 sm:p-8 bg-[#090314] border border-purple-500/10 shadow-2xl text-center flex flex-col items-center justify-center min-h-[400px] relative overflow-hidden"
      >
        {/* Back to Order History list if available */}
        {searchedOrdersList.length > 0 && (
          <button
            type="button"
            onClick={() => setSearchedOrder(null)}
            className="absolute top-4 left-4 px-2.5 py-1 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/15 text-[9px] font-black text-purple-300 hover:text-white transition duration-150 cursor-pointer flex items-center gap-1 z-20"
          >
            <ArrowLeft className="w-3 h-3" />
            <span>তালিকায় ফিরুন</span>
          </button>
        )}

        {/* Glow backdrop decorator */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 blur-2xl rounded-full" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-500/5 blur-2xl rounded-full" />

        {/* Beautiful organic checkmark draw animation */}
        <motion.div 
          initial={{ scale: 0, rotate: -90 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative mb-6"
        >
          <motion.div 
            animate={{ scale: [1, 1.25, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 bg-emerald-500/15 border border-emerald-500/20 rounded-full scale-110 blur-sm"
          />
          <div className="relative w-20 h-20 rounded-full border border-emerald-500/25 bg-emerald-950/15 flex items-center justify-center p-[2px] shadow-[0_0_30px_rgba(16,185,129,0.2)]">
            <div className="w-full h-full rounded-full bg-[#05010a] flex items-center justify-center">
              <svg
                width="34"
                height="34"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-emerald-400"
              >
                <motion.path
                  d="M20 6L9 17l-5-5"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: 0.3, duration: 0.6, ease: "easeInOut" }}
                />
              </svg>
            </div>
          </div>
        </motion.div>

        {/* Elegant heading & info with beautiful spacing & staggered layout */}
        <div className="space-y-3.5 relative z-10 flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="mb-4"
          >
            <span className="inline-block text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-[#0ebb52] bg-emerald-500/10 border border-emerald-500/20 px-4 py-1.5 rounded-full font-mono shadow-[0_2px_10px_rgba(16,185,129,0.1)]">
              SUCCESSFULLY SUBMITTED
            </span>
          </motion.div>

          <motion.h3 
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="text-xl sm:text-2xl font-black text-white tracking-tight leading-snug"
          >
            অর্ডারটি সফলভাবে সাবমিট হয়েছে
          </motion.h3>

          <motion.p 
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="text-xs sm:text-sm text-slate-200 leading-relaxed font-semibold px-2"
          >
            দয়া করে অপেক্ষা করুন, আমাদের প্রতিনিধি খুব দ্রুত আপনার সাথে WhatsApp‌-এ যোগাযোগ করবেন।
          </motion.p>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="text-[11px] text-slate-400 leading-relaxed font-medium"
          >
            অথবা আপনি নিজে সরাসরি নিচের WhatsApp বাটনে ক্লিক করে আমাদের সাথে কথা বলতে পারেন।
          </motion.p>
        </div>

        {/* WhatsApp Button */}
        <div className="mt-8 w-full space-y-3.5 relative z-10">
          <motion.a
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            href={`https://wa.me/88${hero?.whatsappNumber || "01613911528"}?text=${encodeURIComponent(
              `হাই এভেক্সন ডিজিটাল, আমি কাস্টম প্যাকেজ অর্ডার ফর্মটি সাবমিট করেছি।\n\nঅর্ডার আইডি: ${order.id}\nনাম: ${order.customerName}\nহোয়াটসঅ্যাপ নম্বর: ${order.customerPhone}\nনির্বাচিত প্রজেক্ট/প্যাকেজ: ${order.websiteTitle}\n\nআমার প্রজেক্ট নিয়ে আলোচনা করতে চাই।`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 py-3.5 px-5 rounded-2xl bg-[#0ebb52] hover:bg-[#0da94a] text-white font-black text-xs sm:text-sm cursor-pointer shadow-lg shadow-emerald-950/30 transition-all duration-200"
          >
            <WhatsAppIcon className="w-4.5 h-4.5 shrink-0 fill-current text-white" />
            <span>সরাসরি WhatsApp-এ কনট্যাক্ট করুন</span>
          </motion.a>

          <button
            type="button"
            onClick={handleResetForNewOrder}
            className="w-full py-3 px-6 rounded-xl bg-[#0e041d]/70 border border-purple-500/15 hover:border-purple-500/35 text-xs font-bold text-slate-400 hover:text-white cursor-pointer transition-all duration-150"
          >
            নতুন আরেকটি অর্ডার দিন
          </button>
        </div>
      </motion.div>
    );
  };

  const renderBeautifulOrderProgress = (order: Order) => {
    if (order.paymentMethod === 'custom_pkg') {
      return renderCustomPackageConfirmation(order);
    }
    const currentIndex = getStepIndex(order.status);
    const isDone = order.status === 'Done';
    
    const visualTimeline = [
      {
        statusKey: 'Pending' as OrderStatus,
        title: "অর্ডার সাবমিট ও যাচাইকরণ (Order Verification)",
        desc: "আমরা আপনার অর্ডার রিকোয়েস্টটি সার্ভারে পেয়েছি। bKash/Nagad পেমেন্ট ট্রানজেকশনটি সিস্টেম ভেরিফিকেশনের জন্য প্রসেস করা হচ্ছে।",
        accentColor: "from-amber-500 to-yellow-400",
        shadowColor: "rgba(245,158,11,0.15)",
        stepNum: "ধাপ ০১"
      },
      {
        statusKey: 'Payment Checking' as OrderStatus,
        title: "পেমেন্ট ভেরিফিকেশন (Payment Verification)",
        desc: "আমাদের ফাইন্যান্স টিম আপনার bKash/Nagad ট্রানজেকশন আইডিটি কোড মিলিয়ে দেখছেন। সাধারণত ৫-১৫ মিনিট সময় লাগতে পারে।",
        accentColor: "from-blue-500 to-indigo-400",
        shadowColor: "rgba(59,130,246,0.15)",
        stepNum: "ধাপ ০২"
      },
      {
        statusKey: 'Confirmed' as OrderStatus,
        title: "অর্ডার নিশ্চিতকরণ (Order Confirmed)",
        desc: "পেমেন্ট সফলভাবে ভেরিফাইড হয়েছে! আপনার অর্ডারের যাবতীয় বিবরণ নিশ্চিত করে ডেভেলপমেন্ট পোর্টালে পাঠানো হয়েছে।",
        accentColor: "from-cyan-500 to-teal-400",
        shadowColor: "rgba(6,182,212,0.15)",
        stepNum: "ধাপ ০৩"
      },
      {
        statusKey: 'Working' as OrderStatus,
        title: "সাইট ডেভেলপমেন্ট প্রক্রিয়া (Development Progress)",
        desc: "আমাদের এক্সপার্ট টিম আপনার সাইটের UI ডিজাইন সম্পন্ন করে কোডিং করছেন। সার্ভার কনফিগারেশন এবং ডাটাবেজ সেটআপের কাজ চলছে।",
        accentColor: "from-fuchsia-500 to-purple-400",
        shadowColor: "rgba(217,70,239,0.15)",
        stepNum: "ধাপ ০৪"
      },
      {
        statusKey: 'Done' as OrderStatus,
        title: "লাইভ ও সম্পূর্ণ (Site Hosted & Delivered)",
        desc: "অভিনন্দন! আপনার সাইটটি এভেক্সন হোস্ট সার্ভারে সফলভাবে লাইভ করা হয়েছে। নিচের সিকিউর ক্রেডেনশিয়াল ব্যবহার করে অ্যাডমিন কন্ট্রোল করুন।",
        accentColor: "from-emerald-500 to-teal-400",
        shadowColor: "rgba(16,185,129,0.15)",
        stepNum: "ধাপ ০৫"
      }
    ];

    return (
      <div className="space-y-5 font-sans tracking-tight py-2">
        {/* Back to Order History dashboard if available */}
        {searchedOrdersList.length > 0 && (
          <button
            type="button"
            onClick={() => setSearchedOrder(null)}
            className="mb-2 px-3 py-1.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/15 text-[10px] font-black text-purple-300 hover:text-white transition duration-150 cursor-pointer flex items-center gap-1 self-start"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>অর্ডার তালিকায় ফিরে যান</span>
          </button>
        )}
        {/* Connection status header */}
        <div className="text-center space-y-1 relative z-10">
          <div className="flex items-center justify-center gap-1.5">
            <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 font-mono">
              Connection Secured
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            অর্ডার অগ্রগতি ট্র্যাকিং
          </h3>

          {/* Minimalist Passport Info Banner */}
          <div className="mt-2 py-2.5 px-3.5 rounded-xl bg-purple-950/15 border border-purple-500/10 text-left flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5">
                <span className="text-slate-400">প্রজেক্ট:</span>
                <span className="font-extrabold text-white">{order.websiteTitle}</span>
              </div>
              {order.desiredWebsiteName && (
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-400">ওয়েবসাইটের নাম:</span>
                  <span className="font-black text-emerald-400">{order.desiredWebsiteName}</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-1.5 font-mono text-[11px] shrink-0">
              <span className="text-slate-400">ট্র্যাক আইডি:</span>
              <span className="text-fuchsia-400 font-bold select-all">{order.id}</span>
              <button
                type="button"
                onClick={() => copyToClipboard(order.id, "con_tc")}
                className="p-1 text-purple-300 hover:text-white transition cursor-pointer"
                title="কপি করুন"
              >
                <Copy className="w-3 h-3" />
              </button>
              {copiedText === "con_tc" && (
                <span className="text-[9px] text-emerald-400 font-bold ml-1">Copied!</span>
              )}
            </div>
          </div>
        </div>

        {/* Simple Minimalist Steps Timeline */}
        <div className="relative text-left my-4 space-y-3 pt-2">
          {/* Minimal line connecting steps */}
          <div className="absolute left-[13px] top-4 bottom-4 w-[1px] bg-purple-950/65" />

          {visualTimeline.map((stepNode, idx) => {
            const matchesCurrent = idx === currentIndex;
            const isPassed = idx < currentIndex;
            const isLocked = idx > currentIndex;

            return (
              <div key={idx} className="relative pl-8 flex flex-col justify-start">
                {/* Dot */}
                <div className="absolute left-[13px] top-1.5 z-10 -translate-x-1/2">
                  {isPassed ? (
                    <div className="w-4 h-4 rounded-full bg-emerald-500/20 border border-emerald-500 flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 text-emerald-400 stroke-[3]" />
                    </div>
                  ) : matchesCurrent ? (
                    <div className="w-4 h-4 rounded-full bg-fuchsia-500/20 border border-fuchsia-400 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-fuchsia-400 animate-pulse" />
                    </div>
                  ) : (
                    <div className="w-3.5 h-3.5 rounded-full bg-[#080212] border border-slate-700 flex items-center justify-center">
                      <div className="w-1 h-1 rounded-full bg-slate-700" />
                    </div>
                  )}
                </div>

                {/* Step content */}
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <h4 className={`text-xs sm:text-sm font-semibold transition-colors ${
                      matchesCurrent ? "text-white font-black" : isPassed ? "text-slate-300" : "text-slate-500"
                    }`}>
                      {stepNode.title}
                    </h4>
                    {matchesCurrent && (
                      <span className="px-1.5 py-0.5 text-[8px] bg-fuchsia-500/15 text-fuchsia-400 border border-fuchsia-500/20 rounded font-bold uppercase tracking-wider">
                        Active
                      </span>
                    )}
                  </div>
                  {matchesCurrent && (
                    <p className="text-[11px] sm:text-xs text-slate-400 leading-relaxed max-w-xl font-medium">
                      {stepNode.desc}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* DONE STATE DEPLOYED ACCESS DETAILS SLIDER */}
        <AnimatePresence>
          {isDone && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="rounded-xl p-4 bg-emerald-500/5 border border-emerald-500/15 text-left text-xs space-y-3"
            >
              <div className="flex items-center gap-1.5 text-emerald-400 font-bold border-b border-emerald-500/10 pb-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>সাইট সম্পূর্ণ লাইভ ও ডেলিভারড!</span>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center gap-2">
                  <span className="text-slate-400">ওয়েবসাইট লিঙ্ক:</span>
                  <a
                    href={order.websiteLink || `https://${order.id.toLowerCase()}.avexon.com`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono font-bold text-emerald-400 hover:underline flex items-center gap-1"
                  >
                    <span>{order.websiteLink || `https://${order.id.toLowerCase()}.avexon.com`}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div className="flex justify-between items-center gap-2">
                  <span className="text-slate-400">অ্যাডমিন ইউজার:</span>
                  <div className="flex items-center gap-1">
                    <span className="font-mono font-bold text-white pr-1">{order.adminLogin || "admin@avexon.com"}</span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(order.adminLogin || "admin@avexon.com", "usr")}
                      className="text-slate-400 hover:text-white"
                      title="কপি"
                    >
                      {copiedText === "usr" ? "Copied!" : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                </div>

                <div className="flex justify-between items-center gap-2">
                  <span className="text-slate-400">পাসওয়ার্ড:</span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono font-bold text-white pr-1">
                      {showPassword ? (order.adminPassword || "AvxSecure@2026") : "••••••••"}
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-slate-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(order.adminPassword || "AvxSecure@2026", "pwd")}
                      className="text-slate-400 hover:text-white"
                    >
                      {copiedText === "pwd" ? "Copied!" : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Global Action controls bottom section */}
        <div className="grid grid-cols-2 gap-4 pt-3.5 border-t border-purple-500/10">
          <a
            href={`https://wa.me/88${hero?.whatsappNumber || "01613911528"}?text=${encodeURIComponent(
              order.paymentMethod === 'custom_pkg' 
                ? `হাই এভেক্সন ডিজিটাল, আমি কাস্টম প্যাকেজ অর্ডার ফর্মটি সাবমিট করেছি।\n\nঅর্ডার আইডি: ${order.id}\nনাম: ${order.customerName}\nহোয়াটসঅ্যাপ নম্বর: ${order.customerPhone}\nনির্বাচিত কাস্টম প্যাকেজ: ${order.websiteTitle}\n\nআমার প্রজেক্ট নিয়ে আলোচনা করতে চাই।`
                : `হাই এভেক্সন ডিজিটাল, আমি প্যাকেজ অর্ডারের পেমেন্ট সাবমিট করেছি।\n\nঅর্ডার আইডি: ${order.id}\nনাম: ${order.customerName}\nহোয়াটসঅ্যাপ নম্বর: ${order.customerPhone}\nনির্বাচিত প্রজেক্ট: ${order.websiteTitle}\nপেমেন্ট মেথড: ${order.paymentMethod}\nপ্রেরক নম্বর: ${order.senderNumber}\nTxID: ${order.transactionId}\n\nদয়া করে অর্ডারটি দ্রুত এপ্রুভ করুন।`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#0ebb52] hover:bg-[#0da94a] text-white font-black text-xs sm:text-sm cursor-pointer hover:shadow-lg transition-all duration-150"
          >
            <WhatsAppIcon className="w-4.5 h-4.5 shrink-0 fill-current text-white" />
            <span>WhatsApp Support Connection</span>
          </a>

          <button
            type="button"
            onClick={handleResetForNewOrder}
            className="py-3 px-4 rounded-xl bg-[#0e041d]/70 border border-purple-500/20 hover:border-purple-500/40 text-xs sm:text-sm font-black text-[#cbc8d2] hover:text-white cursor-pointer transition-all duration-150"
          >
            নতুন অর্ডার দিন
          </button>
        </div>

        {/* Developer configuration system simulator panel */}
        <div className="flex justify-center opacity-10 hover:opacity-100 transition-opacity duration-300">
          <button
            type="button"
            onClick={() => {
              setSimStatus(order.status);
              setSimWebsiteLink(order.websiteLink || "");
              setSimAdminLogin(order.adminLogin || "");
              setSimAdminPassword(order.adminPassword || "");
              setSimAdminNotes(order.adminNotes || "");
              setIsAdminPanelOpen(true);
            }}
            className="text-[8.5px] uppercase tracking-wider font-mono font-bold text-purple-400 flex items-center gap-1.5 cursor-pointer bg-purple-950/20 px-2.5 py-1 rounded-md"
          >
            <Settings className="w-2.5 h-2.5 text-purple-400" />
            <span>Developer Panel</span>
          </button>
        </div>
      </div>
    );
  };

  const STATUS_STEPS = [
    { statusKey: 'Pending', label: '🟡 Pending', desc: 'পেন্ডিং (ভেরিফাই হচ্ছে)' },
    { statusKey: 'Payment Checking', label: '🔵 Payment Checking', desc: 'পেমেন্ট চেক করা হচ্ছে' },
    { statusKey: 'Confirmed', label: '🟢 Confirmed', desc: 'অর্ডার কনফার্মড হয়েছে' },
    { statusKey: 'Working', label: '🛠 Working', desc: 'ডিজাইন ও উন্নয়ন চলছে' },
    { statusKey: 'Done', label: '✅ Done', desc: 'সম্পন্ন এবং সাইট লাইভ!' }
  ];

  const getStepIndex = (st: OrderStatus): number => {
    switch(st) {
      case 'Pending': return 0;
      case 'Payment Checking': return 1;
      case 'Confirmed': return 2;
      case 'Working': return 3;
      case 'Done': return 4;
      default: return 0;
    }
  };

  const getSubtitleText = () => {
    if (checkoutType === 'custom') {
      if (step === 1) return "ধাপ ১ / ২ : অর্ডার বিবরণী";
      return "ধাপ ২ / ২ : অর্ডার সফল ও কনফার্মেশন";
    }
    if (step === 1) return "ধাপ ১ / ৩ : পেমেন্ট ও ভেরিফিকেশন";
    if (step === 2) return "ধাপ ২ / ৩ : পেমেন্ট ও ভেরিফিকেশন";
    if (step === 3) return "ধাপ ৩ / ৩ : পেমেন্ট ও ভেরিফিকেশন";
    return "অর্ডার সফল ও বিবরণী";
  };

  // Detect when the live progress card is active (Progress View state)
  const isProgressView = !!(
    (modalMode === 'checkout' && step === 4 && activeOrder) ||
    (modalMode === 'tracking' && searchedOrder)
  );

  const useNeonLayout = (modalMode === 'tracking') || isProgressView;

  const wrapWithNeonInner = (children: React.ReactNode) => {
    if (useNeonLayout) {
      return (
        <div className="tracker-neon-inner bg-[#090313] p-5 sm:p-7 w-full h-full relative">
          {children}
        </div>
      );
    }
    return <>{children}</>;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22 }}
      className="fixed inset-0 z-50 overflow-y-auto"
    >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm w-full h-full"
          />

          {/* Modal Content Wrapper */}
          <div className="flex min-h-screen items-center justify-center p-2 sm:p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 15 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className={
                useNeonLayout
                  ? `relative w-full ${
                      modalMode === 'tracking' && !searchedOrder ? "max-w-md rounded-3xl" : "max-w-lg rounded-3xl"
                    } tracker-neon-card overflow-hidden`
                  : `relative w-full bg-[#0b051a] border border-purple-500/20 shadow-2xl shadow-purple-950/50 overflow-hidden max-w-2xl rounded-3xl p-6 sm:p-8`
              }
            >
          {wrapWithNeonInner(
            <>
              {/* Floating Absolute Close Button (Only on Progress view as it has no header close icon) */}
          {isProgressView && (
            <button
              type="button"
              onClick={onClose}
              className="absolute top-3.5 right-3.5 z-50 p-1.5 rounded-full border border-purple-500/15 bg-[#0a0518]/90 hover:border-purple-500/35 text-slate-400 hover:text-white transition duration-150 cursor-pointer flex items-center justify-center shadow-md"
            >
              <X className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
          )}

          {/* Glow backdrops */}
          <div className="absolute -top-40 -left-40 w-80 h-80 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-fuchsia-600/10 rounded-full blur-[100px] pointer-events-none" />

          {/* Modal Header */}
          {!isProgressView && (
            <div className="flex items-center justify-between pb-5 mb-5 border-b border-purple-500/10">
            <div className="flex items-center gap-4">
              {/* Elegant document icon box */}
              <div className="p-3.5 bg-purple-500/5 border border-purple-500/20 rounded-2xl flex items-center justify-center shrink-0">
                <FileText className="w-5.5 h-5.5 text-purple-400 stroke-[1.5]" />
              </div>
              
              {/* Title & Subtitle */}
              <div className="space-y-0.5 sm:space-y-1">
                <h3 className="text-sm sm:text-base font-bold text-white tracking-wide leading-tight">
                  {modalMode === 'tracking' 
                    ? "অর্ডার ট্র্যাকিং প্যানেল" 
                    : (checkoutType === 'custom' ? "কাস্টম ওয়েবসাইট অর্ডার ফর্ম" : "রেডিমেড ওয়েবসাইট অর্ডার ফর্ম")
                  }
                </h3>
                <p className="text-[10px] sm:text-xs text-purple-400/80 font-medium">
                  {modalMode === 'tracking' ? "আপনার অর্ডারের লাইভ অগ্রগতি জানুন" : getSubtitleText()}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Toggle Mode without ugly tabs */}
              {checkoutType !== 'custom' && modalMode === 'checkout' && (
                <button
                  type="button"
                  onClick={() => {
                    setErrorText("");
                    setSearchError("");
                    setModalMode('tracking');
                    setSearchedOrder(null);
                    setSearchedOrdersList(allOrders); // Populate immediately to show list first
                    setStep(1);
                  }}
                  className="text-[9px] font-black uppercase text-purple-300 hover:text-white bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 px-3 py-2 rounded-xl transition duration-200 cursor-pointer text-center font-mono"
                >
                  Track Order
                </button>
              )}
              
              {/* Close Button on the right, custom circle styled */}
              <button
                type="button"
                onClick={onClose}
                className="p-2 ml-1 rounded-full border border-purple-500/20 hover:border-purple-500/40 text-slate-400 hover:text-white transition duration-200 cursor-pointer flex items-center justify-center"
              >
                <X className="w-4 h-4 stroke-[2]" />
              </button>
            </div>
          </div>
          )}

          {/* Steps Progress Bar (Only show if modalMode === 'checkout' and step < 4) */}
          {modalMode === 'checkout' && step < 4 && (
            checkoutType === 'custom' ? (
              <div className="flex items-center gap-2 sm:gap-4 mb-6 select-none overflow-x-auto py-1 scrollbar-none border-b border-purple-500/5 pb-4">
                {/* Step 1 */}
                <div className="flex items-center gap-2 shrink-0">
                  {step > 1 ? (
                    <div className="flex items-center justify-center w-5.5 h-5.5 rounded-full bg-[#8b5cf6] text-white">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  ) : (
                    <div className="flex items-center justify-center w-5.5 h-5.5 rounded-full text-[10px] font-bold bg-[#8b5cf6] text-white">
                      ১
                    </div>
                  )}
                  <span className={`text-[11px] sm:text-xs font-semibold ${step === 1 ? 'text-white' : 'text-[#8b5cf6]'}`}>
                    অর্ডার ইনফরমেশন
                  </span>
                </div>
                
                {/* Divider Line */}
                <div className="h-[1px] w-4 sm:w-8 bg-purple-500/10 shrink-0" />

                {/* Step 2 */}
                <div className="flex items-center gap-2 shrink-0">
                  <div className={`flex items-center justify-center w-5.5 h-5.5 rounded-full text-[10px] font-bold ${step === 2 ? 'bg-[#8b5cf6] text-white' : 'bg-purple-950/20 border border-purple-900/30 text-slate-400'}`}>
                    ২
                  </div>
                  <span className={`text-[11px] sm:text-xs font-semibold ${step === 2 ? 'text-white' : 'text-slate-400'}`}>
                    অর্ডার কনফার্মেশন
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 sm:gap-4 mb-6 select-none overflow-x-auto py-1 scrollbar-none border-b border-purple-500/5 pb-4">
                {/* Step 1 */}
                <div className="flex items-center gap-2 shrink-0">
                  {step > 1 ? (
                    <div className="flex items-center justify-center w-5.5 h-5.5 rounded-full bg-[#8b5cf6] text-white">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  ) : (
                    <div className={`flex items-center justify-center w-5.5 h-5.5 rounded-full text-[10px] font-bold ${step === 1 ? 'bg-[#8b5cf6] text-white' : 'bg-purple-950/20 border border-purple-900/30 text-slate-400'}`}>
                      ১
                    </div>
                  )}
                  <span className={`text-[11px] sm:text-xs font-semibold ${step === 1 ? 'text-white' : step > 1 ? 'text-[#8b5cf6]' : 'text-slate-400'}`}>
                    অর্ডার ইনফরমেশন
                  </span>
                </div>
                
                {/* Divider Line */}
                <div className="h-[1px] w-4 sm:w-8 bg-purple-500/10 shrink-0" />

                {/* Step 2 */}
                <div className="flex items-center gap-2 shrink-0">
                  {step > 2 ? (
                    <div className="flex items-center justify-center w-5.5 h-5.5 rounded-full bg-[#8b5cf6] text-white">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  ) : (
                    <div className={`flex items-center justify-center w-5.5 h-5.5 rounded-full text-[10px] font-bold ${step === 2 ? 'bg-[#8b5cf6] text-white' : 'bg-purple-950/20 border border-purple-900/30 text-slate-400'}`}>
                      ২
                    </div>
                  )}
                  <span className={`text-[11px] sm:text-xs font-semibold ${step === 2 ? 'text-white' : step > 2 ? 'text-[#8b5cf6]' : 'text-slate-400'}`}>
                    পেমেন্ট মেথড
                  </span>
                </div>

                {/* Divider Line */}
                <div className="h-[1px] w-4 sm:w-8 bg-purple-500/10 shrink-0" />

                {/* Step 3 */}
                <div className="flex items-center gap-2 shrink-0">
                  <div className={`flex items-center justify-center w-5.5 h-5.5 rounded-full text-[10px] font-bold ${step === 3 ? 'bg-[#8b5cf6] text-white' : 'bg-purple-950/20 border border-purple-900/30 text-slate-400'}`}>
                    ৩
                  </div>
                  <span className={`text-[11px] sm:text-xs font-semibold ${step === 3 ? 'text-white' : 'text-slate-400'}`}>
                    পেমেন্ট ভেরিফিকেশন
                  </span>
                </div>
              </div>
            )
          )}

          {/* Interactive Screens with AnimatePresence */}
          <AnimatePresence mode="wait">
            {/* TRACKING MODE SCREEN */}
            {modalMode === 'tracking' && (
              <motion.div
                key="tracking-screen"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6"
              >
                {searchedOrdersList.length > 0 && !searchedOrder ? (
                  /* GORGEOUS USER ORDER HISTORY DASHBOARD */
                  <div className="space-y-5 font-sans">
                    <div className="flex items-center justify-between border-b border-purple-500/10 pb-3">
                      <div className="space-y-0.5">
                        <h4 className="text-sm font-black text-white flex items-center gap-2">
                          <ShoppingBag className="w-4 h-4 text-purple-400 animate-pulse" />
                          <span>আপনার অর্ডার ড্যাশবোর্ড</span>
                        </h4>
                        <p className="text-[10px] text-slate-400">
                          {filterQuery.trim() ? "ফিল্টারিং সক্রিয়" : "সক্রিয় সকল অর্ডার তালিকা"}
                        </p>
                      </div>
                      
                      {/* Search Again top right button */}
                      <button
                        type="button"
                        onClick={() => {
                          setSearchedOrdersList(allOrders);
                          setSearchOrderId("");
                          setSearchError("");
                          setFilterQuery("");
                        }}
                        className="text-[9px] font-bold text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-750 px-2.5 py-1.5 rounded-xl cursor-pointer transition-all duration-155"
                      >
                        রিসেট করুন
                      </button>
                    </div>

                    {/* Instant Live Filter Input */}
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-3.5 w-3.5 text-purple-400/60" />
                      </div>
                      <input
                        type="text"
                        value={filterQuery}
                        onChange={(e) => setFilterQuery(e.target.value)}
                        placeholder="অর্ডার আইডি, মোবাইল অথবা নাম লিখুন..."
                        className="w-full bg-[#05010a] border border-purple-500/10 focus:border-purple-500/40 rounded-xl pl-9 pr-10 py-2 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-purple-500/20 transition-all font-mono"
                      />
                      {filterQuery && (
                        <button
                          type="button"
                          onClick={() => setFilterQuery("")}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-[10px] text-purple-400 hover:text-white cursor-pointer"
                        >
                          মুছুন
                        </button>
                      )}
                    </div>

                    {/* Order summary boxes widgets */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-[#0d041d]/75 border border-purple-500/10 rounded-xl">
                        <span className="block text-[8.5px] uppercase tracking-wider text-slate-400 font-bold mb-0.5">মোট প্রজেক্টের সংখ্যা</span>
                        <strong className="text-lg font-black text-white">
                          {searchedOrdersList.filter(order => {
                            if (!filterQuery.trim()) return true;
                            const q = filterQuery.toLowerCase();
                            return (
                              order.id.toLowerCase().includes(q) ||
                              order.customerPhone.toLowerCase().includes(q) ||
                              (order.customerName && order.customerName.toLowerCase().includes(q)) ||
                              (order.websiteTitle && order.websiteTitle.toLowerCase().includes(q))
                            );
                          }).length} টি
                        </strong>
                      </div>
                      <div className="p-3 bg-[#0d041d]/75 border border-purple-500/10 rounded-xl">
                        <span className="block text-[8.5px] uppercase tracking-wider text-slate-400 font-bold mb-0.5">সর্বশেষ সক্রিয় অবস্থা</span>
                        <strong className="text-xs font-black text-purple-300 truncate block">
                          {searchedOrdersList[0]?.status === 'Done' ? '✅ সাইট সম্পূর্ণ লাইভ' : `🛠 ${searchedOrdersList[0]?.status}`}
                        </strong>
                      </div>
                    </div>

                    {/* Quick message banner */}
                    <div className="p-3 bg-fuchsia-500/5 border border-fuchsia-500/10 rounded-xl text-[10px] sm:text-xs text-slate-300 leading-relaxed font-semibold">
                      যেকোনো প্রজেক্টের লাইভ অগ্রগতি ট্র্যাক করতে এবং ক্রেডেনশিয়াল খুজে পেতে প্রজেক্টের ডান পাশে <strong className="text-purple-300">লাইভ ট্র্যাকিং</strong> বাটনে ক্লিক করুন।
                    </div>

                    {/* The Cards Grid/List */}
                    <div className="space-y-3.5 max-h-[350px] overflow-y-auto custom-scrollbar pr-1">
                      {searchedOrdersList
                        .filter(order => {
                          if (!filterQuery.trim()) return true;
                          const q = filterQuery.toLowerCase();
                          return (
                            order.id.toLowerCase().includes(q) ||
                            order.customerPhone.toLowerCase().includes(q) ||
                            (order.customerName && order.customerName.toLowerCase().includes(q)) ||
                            (order.websiteTitle && order.websiteTitle.toLowerCase().includes(q))
                          );
                        })
                        .map((order) => {
                        return (
                          <div 
                            key={order.id} 
                            className="p-4 bg-[#05010a] border border-purple-950/60 hover:border-purple-500/25 rounded-2xl transition duration-200 group flex flex-col justify-between gap-3"
                          >
                            <div className="flex justify-between items-start gap-2">
                              <div className="space-y-1">
                                <h5 className="text-xs sm:text-sm font-black text-white group-hover:text-purple-300 transition-colors">
                                  {order.websiteTitle}
                                </h5>
                                <div className="flex flex-wrap items-center gap-1.5 text-[10px] text-slate-400 font-medium">
                                  <span>আইডি: <span className="font-mono text-purple-400 font-bold select-all">{order.id}</span></span>
                                  <span className="text-slate-700">•</span>
                                  <span>{order.createdAt}</span>
                                </div>
                              </div>

                              <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded border ${
                                order.status === 'Done' 
                                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                                  : order.status === 'Working' 
                                    ? 'bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/20'
                                    : order.status === 'Confirmed'
                                      ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
                                      : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                              }`}>
                                {order.status}
                              </span>
                            </div>

                            <div className="flex items-center justify-between pt-2.5 border-t border-purple-500/5 text-xs select-none">
                              <div className="flex items-center gap-2">
                                <span className="text-slate-500">মূল্য:</span>
                                <strong className="text-slate-200 font-sans">৳{(Number(order.price) || 0).toLocaleString("bn-BD")}</strong>
                              </div>

                              <div className="flex items-center gap-2.5">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setInvoiceOrder(order);
                                    setShowInvoiceOpen(true);
                                  }}
                                  className="text-[10px] hover:text-white text-slate-400 font-bold cursor-pointer hover:bg-slate-800 px-2 py-1 rounded transition duration-150"
                                >
                                  রসিদ দেখুন
                                </button>
                                
                                {order.paymentMethod === 'custom_pkg' ? (
                                  <button
                                    type="button"
                                    onClick={() => setSearchedOrder(order)}
                                    className="bg-emerald-500/10 hover:bg-emerald-600 border border-emerald-500/35 text-emerald-400 hover:text-white px-3.5 py-1.5 rounded-xl text-[10px] font-extrabold flex items-center gap-1 cursor-pointer transition duration-200"
                                  >
                                    <span>অর্ডার বিবরণী</span>
                                    <ExternalLink className="w-3 h-3" />
                                  </button>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => setSearchedOrder(order)}
                                    className="bg-purple-500/10 hover:bg-purple-600 border border-purple-500/35 text-purple-300 hover:text-white px-3.5 py-1.5 rounded-xl text-[10px] font-extrabold flex items-center gap-1 cursor-pointer transition duration-200"
                                  >
                                    <span>লাইভ ট্র্যাকিং</span>
                                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : !searchedOrder ? (
                  <div className="space-y-5 text-center py-2">
                    <div className="space-y-1.5">
                        <h4 className="text-sm sm:text-base font-black text-slate-200">আপনার অর্ডারের লাইভ অগ্রগতি ট্র্যাকিং</h4>
                        <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
                          অর্ডার করার পর আপনাকে দেওয়া আইডি (যেমন- AVX-582917) অথবা অর্ডার করার সময় ব্যবহৃত মোবাইল নম্বরটি লিখুন।
                        </p>
                      </div>
                      
                      <div className="relative pt-2">
                        <input
                          type="text"
                          value={searchOrderId}
                          onChange={(e) => setSearchOrderId(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSearchOrder();
                          }}
                          placeholder="যেমন- AVX-582917 অথবা ০১XXXXXXXXX"
                          className="w-full bg-[#05010a] border border-purple-950/60 rounded-xl px-4 py-3.5 text-xs sm:text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 transition-all font-mono text-center tracking-wide"
                        />
                      </div>
                      
                      {searchError && (
                        <div className="p-3 bg-rose-500/5 border border-rose-500/10 rounded-xl text-slate-300 text-xs text-center flex items-center justify-center gap-1.5 font-medium">
                          <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                          <span>{searchError}</span>
                        </div>
                      )}
                      
                      <div className="pt-2">
                        <button
                          type="button"
                          onClick={handleSearchOrder}
                          className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-xs font-black text-white hover:shadow-lg hover:shadow-purple-500/10 cursor-pointer transition duration-305 flex items-center justify-center gap-2"
                        >
                          <span>অর্ডার অগ্রগতি ট্র্যাক করুন</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                ) : (
                  renderBeautifulOrderProgress(searchedOrder)
                )}
              </motion.div>
            )}

            {/* STEP 1: Order Information */}
            {modalMode === 'checkout' && step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-5 font-sans"
              >
                <div className="space-y-5">
                  {/* Preferred Website Model */}
                  {checkoutType === 'readymade' && (
                    <div className="space-y-2">
                      <label className="block text-xs sm:text-sm font-semibold text-slate-300">
                        পছন্দকৃত ওয়েবসাইট মডেল
                      </label>
                      <div className="relative">
                        <select
                          id="checkout-select-website"
                          disabled={isSubmitting}
                          value={selectedWebsite}
                          onChange={(e) => {
                            setSelectedWebsite(e.target.value);
                            const web = websites.find(w => w.title === e.target.value);
                            if (web) {
                              let finalPrice = web.price;
                              if (showDiscount) {
                                finalPrice = Math.round(web.price * (1 - offerConfig.discountPercentage / 100));
                              }
                              setPrice(finalPrice);
                            }
                          }}
                          className="w-full bg-[#05010a] border border-purple-500/20 rounded-2xl pl-4 pr-10 py-4 text-xs sm:text-sm text-white focus:outline-none focus:border-purple-500/40 transition-all font-semibold appearance-none cursor-pointer"
                        >
                          {websites.map((web) => {
                            const showDiscountPrice = showDiscount;
                            const currentPrice = showDiscountPrice 
                              ? Math.round(web.price * (1 - offerConfig.discountPercentage / 100)) 
                              : web.price;
                            return (
                              <option key={web.id || web.title} value={web.title} className="bg-[#0b0520] text-white">
                                {web.title} — ৳{currentPrice.toLocaleString("bn-BD")}{showDiscountPrice ? ` (${offerConfig.discountPercentage}% স্পেশাল অফার ছাড়!)` : ""}
                              </option>
                            );
                          })}
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-purple-400">
                          <svg className="w-4 h-4 fill-current opacity-75" viewBox="0 0 20 20">
                            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Desired Website Name (Only for readymade website purchases) */}
                  {checkoutType === 'readymade' && (
                    <div className="space-y-2">
                      <label className="block text-xs sm:text-sm font-semibold text-slate-300">
                        আপনার ওয়েবসাইটের নাম কি হবে? * (Desired Website Name)
                      </label>
                      <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                          <Globe className="w-4 h-4 text-slate-400 opacity-80" />
                        </div>
                        <input
                          id="checkout-input-websitename"
                          type="text"
                          required
                          value={desiredWebsiteName ?? ""}
                          onChange={(e) => setDesiredWebsiteName(e.target.value)}
                          placeholder="যেমন- আমার অনলাইন শপ (My Online Shop)"
                          className="w-full bg-[#05010a] border border-purple-500/20 rounded-2xl pl-11 pr-4 py-4 text-xs sm:text-sm text-white focus:outline-none focus:border-purple-500/40 transition-all font-semibold placeholder-slate-705"
                        />
                      </div>
                    </div>
                  )}

                  {/* Customer Name */}
                  <div className="space-y-2">
                    <label className="block text-xs sm:text-sm font-semibold text-slate-300">
                      আপনার নাম *
                    </label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                        <User className="w-4 h-4 text-slate-400 opacity-80" />
                      </div>
                      <input
                        id="checkout-input-name"
                        type="text"
                        required
                        value={name ?? ""}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="যেমন- শামীম আহমেদ"
                        className="w-full bg-[#05010a] border border-purple-500/20 rounded-2xl pl-11 pr-4 py-4 text-xs sm:text-sm text-white focus:outline-none focus:border-purple-500/40 transition-all font-semibold placeholder-slate-705"
                      />
                    </div>
                  </div>

                  {/* Customer Phone (Mobile) */}
                  <div className="space-y-2">
                    <label className="block text-xs sm:text-sm font-semibold text-slate-300">
                      মোবাইল নম্বর *
                    </label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                        <Phone className="w-4 h-4 text-slate-400 opacity-80" />
                      </div>
                      <input
                        id="checkout-input-phone"
                        type="tel"
                        required
                        disabled={isSubmitting}
                        value={phone ?? ""}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="যেমন- ০১XXXXXXXXX"
                        className="w-full bg-[#05010a] border border-purple-500/20 rounded-2xl pl-11 pr-4 py-4 text-xs sm:text-sm text-white focus:outline-none focus:border-purple-500/40 transition-all font-semibold placeholder-slate-705"
                      />
                    </div>
                  </div>
                </div>

                {errorText && (
                  <div className="p-3 bg-rose-500/5 border border-rose-500/10 rounded-xl text-slate-300 text-xs text-center flex items-center justify-center gap-2 font-medium">
                    <AlertCircle className="w-4 h-4 text-rose-450" />
                    <span>{errorText}</span>
                  </div>
                )}

                <div className="pt-4 flex justify-end">
                  <button
                    id="checkout-btn-step1-next"
                    onClick={handleNextStep1}
                    disabled={isSubmitting}
                    className="relative flex items-center justify-center gap-2.5 py-4 px-8 rounded-2xl bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-xs sm:text-sm font-bold text-white cursor-pointer transition-all duration-200 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-white" />
                        <span>কনফার্ম করা হচ্ছে...</span>
                      </>
                    ) : (
                      <>
                        <span>{checkoutType === 'custom' ? "অর্ডার সাবমিট করুন (Submit Order)" : "পরবর্তী ধাপে যান (Next Step)"}</span>
                        <ArrowRight className="w-4 h-4 text-white" />
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 2: Payment Method */}
            {modalMode === 'checkout' && step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.25 }}
                className="space-y-6 font-sans text-center"
              >
                {/* Minimalist Title Section */}
                <div className="space-y-2 max-w-lg mx-auto">
                  <span className="text-[10px] font-black uppercase tracking-wider text-purple-300 bg-purple-500/10 px-3.5 py-1.5 rounded-full border border-purple-500/20">
                    SECURE GATEWAY - STEP 02
                  </span>
                  <h4 className="text-base sm:text-lg font-bold text-slate-100 uppercase tracking-tight">
                    পেমেন্ট পদ্ধতি নির্বাচন করুন
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed font-semibold">
                    বিকাশ অথবা নগদ যেকোনো একটি পেমেন্ট চ্যানেল নির্বাচন করে পরবর্তী ধাপে যান।
                  </p>
                </div>

                {/* Minimalist Payment Method Selectors */}
                <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                  {/* bKash Selector Card */}
                  <button
                    type="button"
                    onClick={() => {
                      setPaymentMethod('bkash');
                      setErrorText("");
                    }}
                    className={`relative p-5 rounded-2xl border text-center transition-all duration-300 overflow-hidden group select-none cursor-pointer ${
                      paymentMethod === 'bkash'
                        ? 'bg-[#E2136E]/5 border-[#E2136E]/40 text-white shadow-lg'
                        : 'bg-[#090312]/60 border-purple-500/15 text-slate-400 hover:border-purple-500/30 hover:text-slate-350'
                    }`}
                  >
                    {/* Brand subtle highlight */}
                    <div className="absolute top-0 right-0 w-16 h-16 bg-[#E2136E]/10 rounded-full blur-xl pointer-events-none transition-transform group-hover:scale-125" />
                    
                    {/* bKash styled logo banner */}
                    <div className="flex flex-col items-center justify-between gap-3 relative z-10">
                      <div className={`w-14 h-11 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-105 ${
                        paymentMethod === 'bkash' ? 'bg-[#E2136E] text-white shadow-md' : 'bg-pink-950/20'
                      }`}>
                        <img 
                          src="https://www.image2url.com/r2/default/images/1780207222345-38fab8ae-d6c9-42fb-b633-2a54c7ea152c.png" 
                          alt="bKash Logo" 
                          referrerPolicy="no-referrer"
                          className="w-12 h-9 object-contain"
                        />
                      </div>
                      <div className="space-y-0.5">
                        <span className="block text-xs sm:text-sm font-bold tracking-tight">বিকাশ (bKash)</span>
                        <span className="block text-[9px] text-slate-500 font-semibold uppercase tracking-wider">Send Money</span>
                      </div>
                    </div>
                  </button>

                  {/* Nagad Selector Card */}
                  <button
                    type="button"
                    onClick={() => {
                      setPaymentMethod('nagad');
                      setErrorText("");
                    }}
                    className={`relative p-5 rounded-2xl border text-center transition-all duration-300 overflow-hidden group select-none cursor-pointer ${
                      paymentMethod === 'nagad'
                        ? 'bg-[#F47216]/5 border-[#F47216]/40 text-white shadow-lg'
                        : 'bg-[#090312]/60 border-purple-500/15 text-slate-400 hover:border-purple-500/30 hover:text-slate-350'
                    }`}
                  >
                    {/* Brand subtle highlight */}
                    <div className="absolute top-0 right-0 w-16 h-16 bg-[#F47216]/10 rounded-full blur-xl pointer-events-none transition-transform group-hover:scale-125" />
                    
                    {/* Nagad styled logo banner */}
                    <div className="flex flex-col items-center justify-between gap-3 relative z-10">
                      <div className={`w-14 h-11 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-105 ${
                        paymentMethod === 'nagad' ? 'bg-[#F47216] text-white shadow-md' : 'bg-orange-950/20'
                      }`}>
                        <img 
                          src="https://www.image2url.com/r2/default/images/1780207013041-beac9631-b905-4eeb-9886-831663cb6640.png" 
                          alt="Nagad Logo" 
                          referrerPolicy="no-referrer"
                          className="w-12 h-9 object-contain"
                        />
                      </div>
                      <div className="space-y-0.5">
                        <span className="block text-xs sm:text-sm font-bold tracking-tight">নগদ (Nagad)</span>
                        <span className="block text-[9px] text-slate-500 font-semibold uppercase tracking-wider">Send Money</span>
                      </div>
                    </div>
                  </button>
                </div>

                {errorText && (
                  <div className="p-3 bg-rose-500/5 border border-rose-500/10 rounded-xl text-slate-300 text-xs text-center flex items-center justify-center gap-2 font-medium max-w-md mx-auto">
                    <AlertCircle className="w-4 h-4 text-rose-400" />
                    <span>{errorText}</span>
                  </div>
                )}

                {/* Step 2 Progress Controls */}
                <div className="pt-4 flex justify-between items-center max-w-md mx-auto">
                  <button
                    type="button"
                    onClick={() => {
                      setStep(1);
                      setErrorText("");
                    }}
                    className="flex items-center gap-2 py-3 px-5 rounded-xl border-2 border-purple-500/20 hover:border-purple-500/40 text-slate-400 hover:text-white text-xs sm:text-sm font-bold cursor-pointer transition-all"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>পিছনে ফিরে যান</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setStep(3);
                      setErrorText("");
                    }}
                    className="flex items-center gap-2 py-3 px-6 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-xs sm:text-sm font-black text-white cursor-pointer transition-all shadow-lg shadow-purple-500/10"
                  >
                    <span>পরবর্তী ধাপে যান</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 3: Payment Verification */}
            {modalMode === 'checkout' && step === 3 && (() => {
              const isbKash = paymentMethod === "bkash";
              const brandColor = isbKash ? "#E2136E" : "#F47216";
              const brandName = isbKash ? "বিকাশ (bKash)" : "নগদ (Nagad)";
              
              return (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-5 font-sans text-left max-w-md mx-auto"
                >
                  {/* Single Premium Compact Card matching Step 2 select ratio */}
                  <div className="relative overflow-hidden p-5 sm:p-6 rounded-3xl bg-[#090312]/95 border border-purple-500/10 flex flex-col gap-4 shadow-xl select-none group">
                    {/* Brand Radial Glow */}
                    <div 
                      className="absolute -top-12 -right-12 w-28 h-28 blur-2xl opacity-15 rounded-full pointer-events-none transition-all duration-500 group-hover:scale-110"
                      style={{ backgroundColor: brandColor }}
                    />
                    
                    {/* Little Header Pilling */}
                    <div className="flex items-center justify-between pb-3 border-b border-purple-500/5">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                        <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">
                          সেন্ড মানি পেমেন্ট
                        </span>
                      </div>
                      <span 
                        className={`text-[9.5px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${isbKash ? 'bg-[#E2136E]/10 text-[#E2136E] border-[#E2136E]/20' : 'bg-[#F47216]/10 text-[#F47216] border-[#F47216]/20'}`}
                      >
                        {brandName}
                      </span>
                    </div>

                    {/* Payable amount display */}
                    <div className="text-center py-2.5 bg-[#05010a]/50 rounded-xl border border-purple-500/5 relative overflow-hidden group">
                      <span className="block text-[9px] text-slate-450 font-bold mb-0.5">
                        পেমেন্ট করতে হবে
                      </span>
                      <strong className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center justify-center gap-1">
                        <span className="text-purple-400">৳</span>
                        {price.toLocaleString("bn-BD")}
                      </strong>
                      {showDiscount && (
                        <div className="mt-1 text-[9.5px] font-bold text-emerald-400 font-sans flex items-center justify-center gap-1 animate-pulse">
                          <span>✓ {offerConfig.discountPercentage}% স্পেশাল মেগা ছাড় যুক্ত হয়েছে</span>
                        </div>
                      )}
                    </div>

                    {/* Copiable target phone number */}
                    <div className="space-y-1">
                      <span className="block text-[9px] font-extrabold text-slate-500 uppercase tracking-widest">
                        আমাদের পেমেন্ট নম্বর (কপি করুন)
                      </span>
                      <div className="p-2 sm:p-2.5 bg-[#05010a]/95 border border-purple-500/10 rounded-xl flex items-center justify-between gap-2 shadow-inner">
                        <strong className="text-sm sm:text-base font-black tracking-widest font-mono text-purple-300">
                          {paymentNumber}
                        </strong>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(paymentNumber, "copyNum")}
                          className={`flex items-center gap-1 py-1 px-2.5 rounded-lg text-[9px] font-extrabold uppercase transition-all duration-155 border select-none ${
                            copiedText === "copyNum"
                              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                              : "bg-purple-500/5 hover:bg-purple-500/12 border-purple-500/10 text-purple-300 hover:text-white"
                          }`}
                        >
                          {copiedText === "copyNum" ? (
                            <>
                              <Check className="w-2.5 h-2.5 text-emerald-400 shrink-0" />
                              <span>Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-2.5 h-2.5 shrink-0" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Highly Compact Tidy Instruction text */}
                    <p className="text-[10px] text-slate-400 font-semibold leading-relaxed">
                      নাম্বারে <strong className="text-white">Send Money</strong> সম্পন্ন করার পর নিচের ফরম ভেরিফাই করুন:
                    </p>

                    {/* Stacked Compact Fields */}
                    <div className="space-y-3 pt-1 border-t border-purple-500/5">
                      {/* Sender Number Input */}
                      <div className="space-y-1">
                        <label className="block text-[10px] font-bold text-slate-350">
                          {paymentMethod === "bkash" ? "বিকাশ" : "নগদ"} নম্বর *
                        </label>
                        <input
                          type="text"
                          value={senderNumber}
                          onChange={(e) => setSenderNumber(e.target.value)}
                          placeholder="প্রেরক নম্বর (যেমন- 017XXXXXXXX)"
                          className="w-full bg-[#05010a] border border-purple-500/25 rounded-2xl px-4 py-3.5 text-xs sm:text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-purple-500/50 transition-all font-semibold font-mono"
                        />
                      </div>

                      {/* Transaction ID Input */}
                      <div className="space-y-1">
                        <label className="block text-[10px] font-bold text-slate-350">
                          Transaction ID (TxID) *
                        </label>
                        <input
                          type="text"
                          value={transactionId}
                          onChange={(e) => setTransactionId(e.target.value)}
                          placeholder="যেমন- 8JN9XUX8D5"
                          className="w-full bg-[#05010a] border border-purple-500/25 rounded-2xl px-4 py-3.5 text-xs sm:text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-purple-500/50 transition-all font-semibold uppercase font-mono"
                        />
                      </div>
                    </div>

                    {errorText && (
                      <div className="p-3 bg-rose-500/5 border border-rose-500/10 rounded-xl text-slate-300 text-xs text-center flex items-center justify-center gap-1.5 font-medium">
                        <AlertCircle className="w-3.5 h-3.5 text-rose-450 shrink-0" />
                        <span>{errorText}</span>
                      </div>
                    )}

                    {/* Step 3 Controls */}
                    <div className="pt-2 flex justify-between items-center gap-4">
                      <button
                        type="button"
                        onClick={() => {
                          setStep(2);
                          setErrorText("");
                        }}
                        className="flex items-center gap-2 py-3.5 px-5 rounded-2xl border border-purple-500/20 hover:border-purple-500/45 text-slate-400 hover:text-white text-xs sm:text-sm font-bold cursor-pointer transition-all"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        <span>পিছনে যান</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleSubmitOrder}
                        className="flex-1 flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-xs sm:text-sm font-black text-white cursor-pointer transition-all hover:shadow-lg hover:shadow-purple-500/10"
                      >
                        <span>পেমেন্ট নিশ্চিত করুন</span>
                        <Check className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })()}

            {/* STEP 4: Order Submission Success Panel */}
            {modalMode === 'checkout' && step === 4 && activeOrder && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.3 }}
                className="max-w-2xl mx-auto w-full"
              >
                {checkoutType === 'custom' ? (
                  renderCustomPackageConfirmation(activeOrder)
                ) : (
                  <AnimatePresence mode="wait">
                    {showSubmittedCelebration ? (
                      <motion.div
                        key="celebrant"
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        transition={{ duration: 0.3 }}
                      >
                        {renderGorgeousCelebration(activeOrder)}
                      </motion.div>
                    ) : (
                      <motion.div
                        key="tracker"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ duration: 0.3 }}
                      >
                        {renderBeautifulOrderProgress(activeOrder)}
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </motion.div>
            )}
          </AnimatePresence>
            </>
          )}
        </motion.div>
      </div>

      {/* 7. Beautiful Printable Dotted Carbon Receipt / Memo */}
      <AnimatePresence>
        {showInvoiceOpen && invoiceOrder && (
          <div className="fixed inset-0 z-[160] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 15 }}
              className="bg-white text-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl relative border border-slate-200 select-all font-sans overflow-hidden"
            >
              {/* Receipt Dotted Scissor Notch top */}
              <div className="absolute top-0 inset-x-0 h-1 bg-yellow-500/5 hover:-red-500" />
              <div className="absolute top-2 right-2 print:hidden">
                <button
                  type="button"
                  onClick={() => setShowInvoiceOpen(false)}
                  className="p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-900 transition cursor-pointer"
                  aria-label="Close invoice"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Printable Area Wrapper */}
              <div id="physical-invoice-print-area" className="space-y-5 py-2">
                <div className="text-center space-y-1">
                  <h3 className="text-lg font-black tracking-widest text-[#0e041d] font-sans antialiased">
                    AVEXON DIGITAL LIMITED
                  </h3>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black">
                    Official Payment Memo & Sales Slip
                  </p>
                  <p className="text-[9px] text-slate-400">
                    Dhaka, Bangladesh | Support Helpline: +88{hero?.whatsappNumber || "01613911528"}
                  </p>
                </div>

                <div className="border-t border-dashed border-slate-300 my-2" />

                {/* Memo Meta details */}
                <div className="grid grid-cols-2 gap-y-1 text-xs select-all">
                  <span className="text-slate-550 font-bold text-[11px] leading-relaxed">MEMO NUMBER:</span>
                  <span className="text-right font-mono font-black text-[#0c0418] text-[11px] leading-relaxed">{invoiceOrder.id}</span>

                  <span className="text-slate-550 font-bold text-[11px] leading-relaxed">SALE DATE:</span>
                  <span className="text-right text-slate-700 font-medium text-[11px] leading-relaxed">{invoiceOrder.createdAt}</span>

                  <span className="text-slate-550 font-bold text-[11px] leading-relaxed">VERIFICATION STATUS:</span>
                  <span className={`text-right text-[10px] font-black uppercase tracking-wide leading-relaxed ${invoiceOrder.status === 'Pending' || invoiceOrder.status === 'Payment Checking' ? 'text-amber-600' : 'text-emerald-600'}`}>
                    ★ {invoiceOrder.status}
                  </span>

                  <span className="text-slate-550 font-bold text-[11px] leading-relaxed">PAYMENT GATEWAY:</span>
                  <span className="text-right font-bold text-slate-700 text-[11px] leading-relaxed capitalize">{invoiceOrder.paymentMethod}</span>
                </div>

                <div className="border-t border-dashed border-slate-300 my-2" />

                {/* Customer Details info block */}
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 space-y-1 text-xs">
                  <span className="text-[8px] font-black uppercase text-slate-400 block tracking-wider">BILLED CUSTOMER // গ্রাহক তথ্য</span>
                  <p className="font-extrabold text-[#0c041d]">{invoiceOrder.customerName}</p>
                  <p className="font-mono text-slate-600">WhatsApp: {invoiceOrder.customerPhone}</p>
                  {invoiceOrder.desiredWebsiteName && (
                    <p className="text-emerald-600 font-extrabold text-[10.5px]">ওয়েবসাইট নাম: {invoiceOrder.desiredWebsiteName}</p>
                  )}
                </div>

                {/* Invoice Table */}
                <div className="space-y-2 select-all">
                  <div className="flex justify-between text-[10px] uppercase font-black text-slate-400 pb-1 border-b border-slate-200">
                    <span>ITEM DESCRIPTION // বিবরণ</span>
                    <span>TOTAL PRICE // মূল্য</span>
                  </div>
                  
                  <div className="flex justify-between items-start text-xs pt-1">
                    <div className="space-y-0.5">
                      <p className="font-black text-slate-800 leading-tight">
                        {invoiceOrder.websiteTitle}
                      </p>
                      <p className="text-[9px] text-slate-500">
                        রেডিমেড অপ্টিমাইজড ডোমেইন হোস্টিং ইন্টিগ্রেশন (Qty: 1)
                      </p>
                    </div>
                    <span className="font-mono font-bold text-slate-800 shrink-0 text-sm">
                      ৳{(Number(invoiceOrder?.price) || 0).toLocaleString("bn-BD")}
                    </span>
                  </div>
                </div>

                <div className="border-t border-dashed border-slate-300 my-2" />

                {/* Total Balance Amount */}
                <div className="flex justify-between items-center bg-slate-900 text-white rounded-xl p-3.5 select-all">
                  <div>
                    <span className="text-[8px] text-pink-400 uppercase tracking-widest font-black block leading-none">TOTAL AMOUNT INBDT</span>
                    <strong className="text-xs shrink-0 font-sans">সর্বমোট পেমেন্ট ফি</strong>
                  </div>
                  <span className="text-lg font-mono font-black text-emerald-400 tracking-tight">
                    ৳{(Number(invoiceOrder?.price) || 0).toLocaleString("bn-BD")}
                  </span>
                </div>

                {/* Simulated barcode graphic for authentic paper memo feel */}
                <div className="pt-2 flex flex-col items-center justify-center space-y-1">
                  <div className="flex items-center justify-center gap-[1.5px] h-8 overflow-hidden select-none">
                    <div className="w-1 h-full bg-black shrink-0" />
                    <div className="w-[1.5px] h-full bg-black shrink-0" />
                    <div className="w-0.5 h-full bg-black shrink-0" />
                    <div className="w-2 h-full bg-black shrink-0" />
                    <div className="w-0.5 h-full bg-black shrink-0" />
                    <div className="w-1.5 h-full bg-black shrink-0" />
                    <div className="w-1 h-full bg-black shrink-0" />
                    <div className="w-2 h-full bg-black shrink-0" />
                    <div className="w-0.5 h-full bg-black shrink-0" />
                    <div className="w-1.5 h-full bg-black shrink-0" />
                    <div className="w-1 h-full bg-black shrink-0" />
                  </div>
                  <span className="text-[9px] font-mono tracking-widest text-slate-550 uppercase">
                    * {invoiceOrder.id} *
                  </span>
                </div>

                <p className="text-[9px] text-slate-400 text-center leading-normal">
                  এটি একটি লাইভ সিস্টেম জেনারেটেড ডিজিটাল রসিদ। কোনো স্বাক্ষরের প্রয়োজন নেই। পেমেন্ট সংক্রান্ত বিস্তারিত হোয়াটসঅ্যাপ সাপোর্টে যোগাযোগ করুন।
                </p>
              </div>

              {/* Actions Footer print */}
              <div className="flex items-center gap-2 pt-1 border-t border-slate-100 print:hidden mt-3 select-none">
                <button
                  type="button"
                  onClick={() => setShowInvoiceOpen(false)}
                  className="flex-1 py-2.5 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-500 font-black hover:text-slate-800 text-xs transition cursor-pointer"
                >
                  উইন্ডো বন্ধ করুন
                </button>
                <button
                  type="button"
                  onClick={() => {
                    window.print();
                  }}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-[#E2136E]/10 hover:bg-[#E2136E]/20 text-[#E2136E] border border-pink-200 font-black text-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>প্রিন্ট মেমো</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
