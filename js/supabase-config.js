import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabaseUrl = 'ibchilighnbwqcirujsl'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImliY2hpbGlnaG5id3FjaXJ1anNsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAwNzg5MzMsImV4cCI6MjA2NTY1NDkzM30.01Zd2xmWF3f3QJcOZjI9vBaXtm3NZBxJ2WQbz4PM17A'
export const supabase = createClient(supabaseUrl, supabaseKey)