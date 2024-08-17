const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://mvrxaxddvokobmmbztsj.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im12cnhheGRkdm9rb2JtbWJ6dHNqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjI3OTIyMDcsImV4cCI6MjAzODM2ODIwN30.7I58L6yn8ihme9Zop0cjxFy76QxpPxtr1suxUGtushc';

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
