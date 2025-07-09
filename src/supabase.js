// src/supabase.js
import { createClient } from '@supabase/supabase-js'

// Reemplaza estos valores con los de tu proyecto Supabase
const SUPABASE_URL = 'https://olatppyqopuhfquwppgo.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9sYXRwcHlxb3B1aGZxdXdwcGdvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE5ODU5ODIsImV4cCI6MjA2NzU2MTk4Mn0.dM5vivM_9JZhEW7C4VwZXTQrimCa_ov3xRsChLowlCI'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY) 