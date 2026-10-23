/**
 * تهيئة وإدارة الاتصال بقاعدة بيانات Supabase
 * متوافق مع معايير الأمان (لا يتم تخزين أي مفاتيح سرية في الفرونت إند)
 */

// إعدادات الاتصال بالسحابة (تُقرأ من بيئة التشغيل أو ملف التكوين)
const SUPABASE_CONFIG = {
  url: window.__ENV_SUPABASE_URL || 'https://your-project.supabase.co',
  anonKey: window.__ENV_SUPABASE_ANON_KEY || 'your-anon-key'
};

let supabaseClient = null;

function initSupabase() {
  if (typeof window.supabase !== 'undefined' && window.supabase.createClient) {
    supabaseClient = window.supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    });
    console.log('✔ تم ربط عميل Supabase بنجاح.');
  } else {
    console.warn('⚠️ مكتبة Supabase JS لم يتم تضمينها في الواجهة بعد.');
  }
  return supabaseClient;
}

function getSupabase() {
  if (!supabaseClient) {
    return initSupabase();
  }
  return supabaseClient;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { SUPABASE_CONFIG, initSupabase, getSupabase };
}
