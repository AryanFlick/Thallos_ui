// Verification script for Supabase setup
// Run with: node verify_supabase_setup.js

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Read .env.local file manually
const envPath = path.join(__dirname, '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length > 0) {
      process.env[key.trim()] = valueParts.join('=').trim();
    }
  });
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables');
  console.log('Make sure you have NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyTables() {
  console.log('🔍 Verifying Supabase table setup...\n');

  const tablesToCheck = ['conversations', 'messages', 'user_api_usage'];
  
  for (const table of tablesToCheck) {
    try {
      console.log(`Checking ${table} table...`);
      
      // Try to query the table (should work even if empty)
      const { data, error, count } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });
      
      if (error) {
        console.log(`❌ ${table}: ${error.message}`);
        if (error.message.includes('relation') && error.message.includes('does not exist')) {
          console.log(`   → Table "${table}" doesn't exist. Make sure you ran the SQL schema.`);
        } else if (error.message.includes('permission denied')) {
          console.log(`   → RLS policy issue. Check your Supabase policies.`);
        }
      } else {
        console.log(`✅ ${table}: Table exists and accessible (${count || 0} rows)`);
      }
    } catch (err) {
      console.log(`❌ ${table}: Unexpected error - ${err.message}`);
    }
  }

  console.log('\n📊 Testing basic operations...');
  
  // Test if we can check auth status
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error && !error.message.includes('session_not_found')) {
      console.log(`❌ Auth check failed: ${error.message}`);
    } else {
      console.log(`✅ Auth system: ${user ? `Logged in as ${user.email}` : 'Not logged in (normal for this test)'}`);
    }
  } catch (err) {
    console.log(`❌ Auth test failed: ${err.message}`);
  }

  console.log('\n🎯 Verification complete!');
  console.log('\nNext steps:');
  console.log('1. Start your app: npm run dev');
  console.log('2. Login to test authenticated features');
  console.log('3. Send some chat messages to test rate limiting');
  console.log('4. Check the usage dashboard in the chat sidebar');
}

verifyTables().catch(console.error);
