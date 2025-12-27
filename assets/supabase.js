// assets/js/supabase-config.js

// 1. Supabase'den kopyaladığın URL'i buraya yapıştır:
const SUPABASE_URL = 'https://hbmlopptzxsatcmebzcx.supabase.co';

// 2. Supabase'den kopyaladığın "anon public" key'i buraya yapıştır:
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhibWxvcHB0enhzYXRjbWViemN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY3NzgzMjAsImV4cCI6MjA4MjM1NDMyMH0.hLtEuKvfenwzzjkmpCz1xgzF_9yXitCVsy6CVS0cWpY';

// Supabase İstemcisini Başlat
// (Global _supabase değişkeni oluşturuyoruz ki her yerde kullanalım)
const { createClient } = supabase;
const _supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

console.log("Supabase Bağlantısı Hazır 🚀");