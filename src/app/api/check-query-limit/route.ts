import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Get Supabase configuration
function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable');
  }

  const key = supabaseServiceKey || supabaseAnonKey;
  
  if (!key) {
    throw new Error('Missing Supabase key');
  }

  return createClient(supabaseUrl, key);
}

export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabaseClient();
    
    // Get the authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Missing authorization header' },
        { status: 401 }
      );
    }

    // Extract the token and verify user
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    // Get user's subscription status
    const { data: subscription } = await supabase
      .from('user_subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .single();

    // Get current month's query count
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    const { data: queries } = await supabase
      .from('user_api_usage')
      .select('id')
      .eq('user_id', user.id)
      .gte('created_at', startOfMonth.toISOString());

    const queryCount = queries?.length || 0;
    const isPro = subscription?.status === 'active' && subscription?.plan === 'pro';
    const monthlyLimit = isPro ? -1 : 15; // -1 means unlimited

    return NextResponse.json({
      success: true,
      queriesUsed: queryCount,
      monthlyLimit,
      plan: isPro ? 'pro' : 'free',
      canQuery: isPro || queryCount < 15,
    });

  } catch (error) {
    console.error('Check query limit error:', error);
    return NextResponse.json(
      { error: 'Failed to check query limit' },
      { status: 500 }
    );
  }
}
