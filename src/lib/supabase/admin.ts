import { createClient } from "@supabase/supabase-js";

export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://klnotkmdtmfvfvblouug.supabase.co";
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtsbm90a21kdG1mdmZ2YmxvdXVnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NzcyMjc5OSwiZXhwIjoyMTAzMjk4Nzk5fQ.ef_5i_NTsfkiI0BqAINqa0cwYmwSc09sdGfUj51xjsk";

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
