const { createClient } = require('@supabase/supabase-js');

// const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im12cnhheGRkdm9rb2JtbWJ6dHNqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjI3OTIyMDcsImV4cCI6MjAzODM2ODIwN30.7I58L6yn8ihme9Zop0cjxFy76QxpPxtr1suxUGtushc"

// const supabaseUrl = 'https://mvrxaxddvokobmmbztsj.supabase.co';

const supabaseKey= 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ibGJ6Y2h4b3NxeXF3anV0dWVvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjczNjMxOTQsImV4cCI6MjA0MjkzOTE5NH0.Q5s9c45ykJWd4C6Y9GaJHgcq-_tq84UXBZLO2VOe2BI'
const supabaseUrl= 'https://mblbzchxosqyqwjutueo.supabase.co'
const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
