/* Joel Frame Work Supabase public configuration. Use the Project URL and anon/publishable key only. NEVER put a service_role key in browser code. */
window.JOEL_SUPABASE_CONFIG = { url: "PASTE_SUPABASE_PROJECT_URL_HERE", anonKey: "PASTE_SUPABASE_ANON_OR_PUBLISHABLE_KEY_HERE", bucket: "joel-site-media" };
window.joelSupabaseReady = function(){const c=window.JOEL_SUPABASE_CONFIG||{};return !!(window.supabase&&c.url&&c.anonKey&&!c.url.includes("PASTE_")&&!c.anonKey.includes("PASTE_"));};
