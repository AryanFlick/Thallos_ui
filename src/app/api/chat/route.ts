import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { RATE_LIMITS, getClientIP } from '@/lib/rateLimit';
import { supabase } from '@/lib/supabase';

// Initialize OpenAI client safely
const getOpenAIClient = () => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OpenAI API key not configured');
  }
  return new OpenAI({ apiKey });
};

export async function POST(request: NextRequest) {
  try {
    const { message, conversationHistory = [] } = await request.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Initialize OpenAI client
    const openai = getOpenAIClient();

    // Get user from authorization header or session
    const authHeader = request.headers.get('authorization');
    let userId: string | null = null;
    
    if (authHeader?.startsWith('Bearer ')) {
      try {
        const token = authHeader.substring(7);
        const { data: { user } } = await supabase.auth.getUser(token);
        userId = user?.id || null;
      } catch (error) {
        console.warn('Failed to get user from token:', error);
      }
    }

    // Check monthly query limit for free users
    if (userId) {
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      
      // Get user's subscription status
      const { data: subscription } = await supabase
        .from('user_subscriptions')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      // Check if user is on Pro plan
      const isPro = subscription?.status === 'active' && subscription?.plan === 'pro';
      
      if (!isPro) {
        // Count queries this month
        const { data: queries } = await supabase
          .from('user_api_usage')
          .select('id')
          .eq('user_id', userId)
          .gte('created_at', startOfMonth.toISOString());
        
        const queryCount = queries?.length || 0;
        
        if (queryCount >= 15) {
          return NextResponse.json(
            { 
              error: 'Monthly query limit reached',
              message: 'You have reached your monthly limit of 15 queries. Please upgrade to Pro for unlimited access.',
              upgradeUrl: '/profile?tab=billing',
              queriesUsed: queryCount,
              monthlyLimit: 15
            },
            { status: 429 }
          );
        }
      }
    }

    // Apply rate limiting
    const clientIP = getClientIP(request);
    let rateLimitResult;

    if (userId) {
      // User-based rate limiting (higher limits for authenticated users)
      rateLimitResult = await RATE_LIMITS.AUTHENTICATED_USER.checkLimit({
        maxRequests: 30,
        windowMs: 60 * 1000,
        identifier: userId,
        type: 'user'
      });
    } else {
      // IP-based rate limiting for unauthenticated users
      rateLimitResult = await RATE_LIMITS.IP_BASED.checkLimit({
        maxRequests: 10,
        windowMs: 60 * 1000,
        identifier: clientIP,
        type: 'ip'
      });
    }

    if (!rateLimitResult.success) {
      return NextResponse.json(
        { 
          error: rateLimitResult.message || 'Rate limit exceeded',
          rateLimitInfo: {
            remaining: rateLimitResult.remaining,
            resetTime: rateLimitResult.resetTime
          }
        },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
            'X-RateLimit-Reset': rateLimitResult.resetTime.toString(),
            'Retry-After': Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000).toString()
          }
        }
      );
    }

    // System prompt for Thallos AI Agent
    const systemPrompt = `You are Thallos AI, an institutional-grade DeFi assistant specialized in decentralized finance strategies, blockchain analysis, and institutional cryptocurrency solutions.

Your expertise includes:
- DeFi protocols and yield strategies
- Risk management in decentralized finance
- Institutional cryptocurrency investment approaches
- Blockchain analytics and market analysis
- Regulatory compliance in DeFi
- Portfolio optimization with digital assets

Always provide:
- Professional, institutional-level insights
- Data-driven analysis when possible
- Risk considerations for any strategies discussed
- Compliance and regulatory awareness
- Clear, actionable recommendations

Maintain a professional tone suitable for institutional clients while being helpful and informative.`;

    // Prepare messages for OpenAI
    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory.map((msg: { isUser: boolean; text: string }) => ({
        role: msg.isUser ? 'user' : 'assistant',
        content: msg.text
      })),
      { role: 'user', content: message }
    ];

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: messages as Array<{ role: 'system' | 'user' | 'assistant'; content: string }>,
      max_tokens: 1000,
      temperature: 0.7,
      stream: false,
    });

    const response = completion.choices[0]?.message?.content;

    if (!response) {
      throw new Error('No response from OpenAI');
    }

    // Track successful query AFTER getting response
    if (userId) {
      try {
        await supabase.from('user_api_usage').insert({
          user_id: userId,
          endpoint: '/api/chat',
          method: 'POST',
          status_code: 200,
          created_at: new Date().toISOString()
        });
      } catch (trackingError) {
        console.warn('Failed to track query:', trackingError);
        // Don't fail the request if tracking fails
      }
    }

    return NextResponse.json(
      { response },
      {
        headers: {
          'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
          'X-RateLimit-Reset': rateLimitResult.resetTime.toString()
        }
      }
    );

  } catch (error: unknown) {
    console.error('OpenAI API error:', error);
    
    const errorObj = error as { error?: { code?: string } };
    if (errorObj?.error?.code === 'insufficient_quota') {
      return NextResponse.json(
        { error: 'OpenAI API quota exceeded. Please check your billing.' },
        { status: 429 }
      );
    }
    
    if (errorObj?.error?.code === 'invalid_api_key') {
      return NextResponse.json(
        { error: 'Invalid OpenAI API key. Please check your configuration.' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to get response from AI. Please try again.' },
      { status: 500 }
    );
  }
}

