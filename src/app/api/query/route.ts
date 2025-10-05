import { NextRequest, NextResponse } from 'next/server';
import handler from './handler.js';

export const runtime = 'nodejs';
export const maxDuration = 60;

// Adapter to convert Next.js request/response to Vercel serverless format
export async function POST(request: NextRequest) {
  try {
    // Create a mock res object that captures the response
    let statusCode = 200;
    let headers: Record<string, string> = {};
    let responseData: any = null;
    let isStreaming = false;

    const mockRes = {
      statusCode,
      setHeader: (name: string, value: string) => {
        headers[name.toLowerCase()] = value;
      },
      writeHead: (code: number, hdrs?: Record<string, string>) => {
        statusCode = code;
        if (hdrs) {
          Object.entries(hdrs).forEach(([k, v]) => {
            headers[k.toLowerCase()] = v;
          });
        }
        isStreaming = true;
      },
      write: (data: string) => {
        if (!responseData) responseData = '';
        responseData += data;
      },
      end: (data?: any) => {
        if (data) {
          if (typeof data === 'string') {
            if (!responseData) responseData = '';
            responseData += data;
          } else {
            responseData = data;
          }
        }
      },
      status: (code: number) => {
        statusCode = code;
        return mockRes;
      },
      json: (data: any) => {
        responseData = data;
        headers['content-type'] = 'application/json';
      },
    };

    // Create a mock req object from Next.js request
    const url = new URL(request.url);
    const mockReq: any = {
      method: request.method,
      url: url.pathname + url.search,
      headers: Object.fromEntries(request.headers.entries()),
    };

    // Add body for POST requests
    if (request.method === 'POST') {
      try {
        const body = await request.json();
        mockReq.body = body;
      } catch (e) {
        mockReq.body = {};
      }
    }

    // Call the handler
    await handler(mockReq, mockRes);

    // Return the response
    if (isStreaming) {
      // For streaming responses
      return new Response(responseData, {
        status: statusCode,
        headers: headers,
      });
    } else {
      // For JSON responses
      if (typeof responseData === 'object' && responseData !== null) {
        return NextResponse.json(responseData, {
          status: statusCode,
          headers: headers,
        });
      } else {
        return new Response(responseData, {
          status: statusCode,
          headers: headers,
        });
      }
    }
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

// Support GET for health checks
export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  
  // If there's a question parameter, route to the handler
  if (url.searchParams.get('q') || url.searchParams.get('question')) {
    return POST(request);
  }

  return NextResponse.json({ 
    status: 'ok',
    message: 'Thallos Backend API',
    version: '1.0.0'
  });
}
