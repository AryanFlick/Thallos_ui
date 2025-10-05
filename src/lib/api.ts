// Frontend API service for calling the backend
const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:3000';

export interface QueryResponse {
  answer: string;
  sql?: string;
  rows?: Record<string, unknown>[];
  source?: string;
  intent?: string;
  retryCount?: number;
  debug?: {
    sql?: string;
    raw_data_sample?: Record<string, unknown>[];
    total_rows?: number;
  };
  error?: string;
}

export interface StreamChunk {
  type: 'sql' | 'rows' | 'answer_start' | 'answer_chunk' | 'done' | 'error';
  sql?: string;
  rows?: Record<string, unknown>[];
  totalRows?: number;
  content?: string;
  retryCount?: number;
  intent?: string;
  error?: string;
}

/**
 * Query the backend API with a question
 */
export async function queryBackend(
  question: string,
  options?: {
    minimal?: boolean;
    stream?: boolean;
    presentationHint?: string;
  }
): Promise<QueryResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        question,
        minimal: options?.minimal,
        stream: options?.stream,
        presentationHint: options?.presentationHint,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `API request failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Backend API Error:', error);
    throw error;
  }
}

/**
 * Query the backend API with streaming support
 */
export async function* queryBackendStream(
  question: string,
  options?: {
    presentationHint?: string;
  }
): AsyncGenerator<StreamChunk, void, unknown> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        question,
        stream: true,
        presentationHint: options?.presentationHint,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `API request failed: ${response.statusText}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('Response body is not readable');
    }

    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          try {
            const chunk: StreamChunk = JSON.parse(data);
            yield chunk;
          } catch (e) {
            console.error('Failed to parse SSE data:', e);
          }
        }
      }
    }
  } catch (error) {
    console.error('Backend Stream API Error:', error);
    throw error;
  }
}

/**
 * Health check for the backend API
 */
export async function checkBackendHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/query?q=test`, {
      method: 'GET',
    });
    return response.ok || response.status === 400; // 400 is ok, means API is responding
  } catch (error) {
    console.error('Backend health check failed:', error);
    return false;
  }
}
