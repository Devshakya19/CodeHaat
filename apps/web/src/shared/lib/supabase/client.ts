import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

  if (!url || !key) {
    console.warn("Supabase credentials not configured");
    // Return a dummy client that won't crash during build
    return createBrowserClient("https://placeholder.supabase.co", "placeholder");
  }

  return createBrowserClient(url, key);
}
