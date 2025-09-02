// Test script for rate limiting
// Run with: node test_rate_limits.js

const API_URL = 'http://localhost:3000/api/chat';

async function testRateLimit(withAuth = false, authToken = '') {
  console.log(`\n🧪 Testing ${withAuth ? 'AUTHENTICATED' : 'IP-BASED'} rate limiting...`);
  
  const headers = {
    'Content-Type': 'application/json',
    ...(withAuth && authToken && { 'Authorization': `Bearer ${authToken}` })
  };

  const maxTests = withAuth ? 35 : 15; // Test beyond the limit
  let successCount = 0;
  let rateLimitHit = false;

  for (let i = 1; i <= maxTests; i++) {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          message: `Test message ${i}`,
          conversationHistory: []
        })
      });

      const remaining = response.headers.get('X-RateLimit-Remaining');
      const resetTime = response.headers.get('X-RateLimit-Reset');

      if (response.ok) {
        successCount++;
        console.log(`✅ Request ${i}: Success (${remaining} remaining)`);
      } else if (response.status === 429) {
        rateLimitHit = true;
        const data = await response.json();
        console.log(`🛑 Request ${i}: Rate limited - ${data.error}`);
        console.log(`   Remaining: ${remaining}, Reset: ${new Date(parseInt(resetTime || '0')).toLocaleTimeString()}`);
        break;
      } else {
        const data = await response.json();
        console.log(`❌ Request ${i}: Error - ${data.error}`);
      }

      // Small delay to avoid overwhelming
      await new Promise(resolve => setTimeout(resolve, 100));

    } catch (error) {
      console.log(`❌ Request ${i}: Network error - ${error.message}`);
    }
  }

  console.log(`\n📊 Results for ${withAuth ? 'AUTHENTICATED' : 'IP-BASED'} testing:`);
  console.log(`   Successful requests: ${successCount}`);
  console.log(`   Rate limit triggered: ${rateLimitHit ? '✅ Yes' : '❌ No'}`);
  console.log(`   Expected limit: ${withAuth ? '30' : '10'} requests/minute`);
}

async function main() {
  console.log('🚀 Starting Rate Limit Tests...');
  console.log('Make sure your dev server is running (npm run dev)');
  
  // Test IP-based limits first
  await testRateLimit(false);
  
  // Wait a bit between tests
  console.log('\n⏳ Waiting 2 seconds before authenticated test...');
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Test authenticated limits (you'll need to provide a token)
  console.log('\n💡 For authenticated testing, get your Supabase access token from:');
  console.log('   Browser DevTools → Application → Local Storage → supabase.auth.token');
  console.log('   Or run: supabase auth token in your terminal');
  
  // Uncomment and add your token to test authenticated limits:
  // const YOUR_AUTH_TOKEN = 'your-supabase-jwt-token-here';
  // await testRateLimit(true, YOUR_AUTH_TOKEN);
  
  console.log('\n✅ Rate limit testing complete!');
}

main().catch(console.error);
