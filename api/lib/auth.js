// lib/auth.js - Simple JWT verification for Supabase auth

import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client (cached)
let supabaseClient = null;

function getSupabaseClient() {
  if (!supabaseClient) {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.log('⚠️  SUPABASE_URL or SUPABASE_SERVICE_KEY not set - auth disabled');
      return null;
    }

    supabaseClient = createClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });
  }
  return supabaseClient;
}

/**
 * Extract and verify JWT token from request using Supabase auth
 * Returns user_id if valid, null if invalid/missing
 * Does NOT throw errors - auth is optional for graceful degradation
 */
export async function verifyAuthToken(req) {
  try {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return null; // Auth not configured
    }

    // Extract token from Authorization header
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader) {
      return null; // No token provided
    }

    // Parse "Bearer <token>"
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      console.log('⚠️  Invalid Authorization header format');
      return null;
    }

    const token = parts[1];

    // Verify JWT token with Supabase
    const { data, error } = await supabase.auth.getUser(token);

    if (error) {
      console.log('⚠️  Auth error:', error.message);
      return null;
    }

    if (!data?.user?.id) {
      console.log('⚠️  No user found in token');
      return null;
    }

    const userId = data.user.id;
    console.log(`✅ Authenticated user: ${userId.substring(0, 8)}...`);
    return userId;

  } catch (error) {
    console.log('⚠️  Auth error:', error.message);
    return null;
  }
}
