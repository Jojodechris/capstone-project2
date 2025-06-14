const { createClient } = require('@supabase/supabase-js');

const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJpaGNlZGd5Y2t4eWJ3bWd6eG1rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk4Mjk4MjgsImV4cCI6MjA2NTQwNTgyOH0.hgFAkl_N2b3ez8I0h_0PadeKIweRV5ePHdeOjUssfRs"

const supabaseUrl = 'https://rihcedgyckxybwmgzxmk.supabase.co';

// const supabaseKey= 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ibGJ6Y2h4b3NxeXF3anV0dWVvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjczNjMxOTQsImV4cCI6MjA0MjkzOTE5NH0.Q5s9c45ykJWd4C6Y9GaJHgcq-_tq84UXBZLO2VOe2BI'
// const supabaseUrl= 'https://mblbzchxosqyqwjutueo.supabase.co'
const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
