// Quick test script to verify Supabase connection
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://axlxihwvdtencrftjuwf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF4bHhpaHd3ZHRlbmNyZnRqdXdmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU1MzU4NTYsImV4cCI6MjA4MTExMTg1Nn0.Z4HUZNxrG4fWLfzFjIHCiDjA7uaN5kOEKrqDzMAm-Ek';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  console.log('Testing Supabase connection...\n');
  
  // Test 1: Check event_dates table
  const { data: dates, error: datesError } = await supabase
    .from('event_dates')
    .select('*')
    .limit(5);
  
  if (datesError) {
    console.error('❌ Error fetching event_dates:', datesError);
  } else {
    console.log('✅ Event dates found:', dates.length);
    console.log('First few dates:', dates);
  }
  
  console.log('\n---\n');
  
  // Test 2: Check tickets table
  const { data: tickets, error: ticketsError } = await supabase
    .from('tickets')
    .select('*')
    .limit(5);
  
  if (ticketsError) {
    console.error('❌ Error fetching tickets:', ticketsError);
  } else {
    console.log('✅ Tickets table accessible');
    console.log('Existing tickets:', tickets.length);
  }
}

testConnection();
