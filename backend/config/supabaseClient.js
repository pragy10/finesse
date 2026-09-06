const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.warn("[!] Warning: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY missing in environment variables");
}

const supabase = createClient(supabaseUrl || "", supabaseServiceKey || "", {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  }
});

const BUCKET_NAME = process.env.SUPABASE_BUCKET || "documents";

module.exports = { supabase, BUCKET_NAME };
