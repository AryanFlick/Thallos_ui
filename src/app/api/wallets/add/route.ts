import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Ensure environment variables are available
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env.local file.');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: NextRequest) {
  try {
    // Get the authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Missing authorization header' },
        { status: 401 }
      );
    }

    // Extract the token
    const token = authHeader.replace('Bearer ', '');
    
    // Verify the JWT token with Supabase
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    // Parse the request body
    const { address, chainId } = await request.json();

    // Validate input
    if (!address || !chainId) {
      return NextResponse.json(
        { error: 'Address and chainId are required' },
        { status: 400 }
      );
    }

    // Validate address format (basic check)
    if (!address.match(/^0x[a-fA-F0-9]{40}$/)) {
      return NextResponse.json(
        { error: 'Invalid wallet address format' },
        { status: 400 }
      );
    }

    // Insert wallet into database
    const { data, error } = await supabase
      .from('user_wallets')
      .insert([
        {
          user_id: user.id,
          address: address.toLowerCase(), // Store addresses in lowercase for consistency
          chain_id: chainId,
        },
      ])
      .select()
      .single();

    if (error) {
      // Handle duplicate wallet (unique constraint violation)
      if (error.code === '23505') {
        return NextResponse.json(
          { error: 'Wallet already connected to your account' },
          { status: 409 }
        );
      }
      
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to save wallet' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Wallet connected successfully',
      wallet: data,
    });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
