import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL || 'https://vsxrgmvjdkqbvkfjarni.supabase.co';
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZzeHJnbXZqZGtxYnZrZmphcm5pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIyNzA4NTgsImV4cCI6MjEwNzg0Njg1OH0.xribNlF_jsNWGUOEFHLY57iIN4k3OLml4DgjRrq1M-k';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

const supabaseServiceKey =
  import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZzeHJnbXZqZGtxYnZrZmphcm5pIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MjI3MDg1OCwiZXhwIjoyMTA3ODQ2ODU4fQ.nN86lM6kl3FT9EQuKKRw88uk3gsujNaL4IaF_0PRgmg';

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});
