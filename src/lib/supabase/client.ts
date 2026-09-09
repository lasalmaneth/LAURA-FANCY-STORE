import { createBrowserClient } from '@supabase/ssr';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://klnotkmdtmfvfvblouug.supabase.co";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtsbm90a21kdG1mdmZ2YmxvdXVnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc3MjI3OTksImV4cCI6MjEwMzI5ODc5OX0.HhSUl_ilxLCSu_y48CyX7_nFSC8Q0N2EjCZLTgtm5DU";

export function createClient() {
  return createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}
