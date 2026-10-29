/* Joel Frame Work Supabase public configuration. Use the Project URL and anon/publishable key only. NEVER put a service_role key in browser code. */
window.JOEL_SUPABASE_CONFIG = { url: "url: "https://swfrqkitzieseftuloxa.supabase.co"", anonKey: "sb_publishable_58yeMtJAf0cCAfntdyk5UQ_64VV4_Da", bucket: "joel-site-media" };
window.joelSupabaseReady = function(){const c=window.JOEL_SUPABASE_CONFIG||{};return !!(window.supabase&&c.url&&c.anonKey&&!c.url.includes("PASTE_")&&!c.anonKey.includes("PASTE_"));};
