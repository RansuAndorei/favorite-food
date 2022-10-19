// lib/supabase.js
import { createClient } from "@supabase/supabase-js";

export const supabase =
  global.supabase ||
  createClient(
    "https://cmxohivoakygaalicrhd.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNteG9oaXZvYWt5Z2FhbGljcmhkIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjYwNTMwODEsImV4cCI6MTk4MTYyOTA4MX0.t4Xt49l3-MOYM3vA_y4HUEDSkXLSZyerIXzXgMcPe5E"
  );

if (process.env.NODE_ENV !== "production") {
  global.supabase = supabase;
}
