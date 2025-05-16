import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://tzwmcmcvhycjtxojjkpj.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR6d21jbWN2aHljanR4b2pqa3BqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDczMDkzMDUsImV4cCI6MjA2Mjg4NTMwNX0.822B7rOc-7xyMzJhTVOxzFiaO91PHYylUYEqV4BJ69E'

export const supabase = createClient(supabaseUrl, supabaseKey)
