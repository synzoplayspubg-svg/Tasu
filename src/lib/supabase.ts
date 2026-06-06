import { createClient, SupabaseClient } from "@supabase/supabase-js";
import supabaseConfig from "../supabase_config.json";
import { safeLocalStorage } from "../utils/safeStorage";

const getSavedCredential = (key: string): string => {
  const saved = safeLocalStorage.getItem(key);
  if (saved && saved.trim()) return saved.trim();
  return "";
};

export let supabaseUrl = "";
export let supabaseAnonKey = "";
export let isSupabaseConfigured = false;
export let supabase: SupabaseClient | null = null;
export let isSupabaseOrdersConfigured = false;
export let supabaseOrders: SupabaseClient | null = null;

export function initializeSupabase() {
  supabaseUrl = (
    getSavedCredential("VITE_SUPABASE_URL") ||
    ((supabaseConfig as any).VITE_SUPABASE_URL || "") ||
    (((import.meta as any).env?.VITE_SUPABASE_URL) || "")
  ).trim();

  supabaseAnonKey = (
    getSavedCredential("VITE_SUPABASE_ANON_KEY") ||
    ((supabaseConfig as any).VITE_SUPABASE_ANON_KEY || "") ||
    (((import.meta as any).env?.VITE_SUPABASE_ANON_KEY) || "")
  ).trim();

  isSupabaseConfigured = Boolean(
    supabaseUrl && 
    supabaseAnonKey && 
    supabaseUrl !== "YOUR_SUPABASE_URL_HERE" &&
    supabaseUrl.length > 0
  );

  supabase = isSupabaseConfigured
    ? createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: false,
        },
      })
    : null;

  isSupabaseOrdersConfigured = isSupabaseConfigured;
  supabaseOrders = supabase;

  console.log("Supabase client initialized: ", {
    url: supabaseUrl ? `${supabaseUrl.substring(0, 15)}...` : "none",
    isConfigured: isSupabaseConfigured
  });
}

export function getActiveSupabase() {
  return supabase;
}

export function getIsSupabaseConfigured() {
  return isSupabaseConfigured;
}

// Perform initial initialization on load
initializeSupabase();



