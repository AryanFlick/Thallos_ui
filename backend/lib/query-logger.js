// lib/query-logger.js - Simple logging of questions and answers

import { getDbPool } from './db.js';

/**
 * Log a question and its answer to the database
 * Gracefully handles errors - never throws
 * 
 * @param {string|null} userId - User ID from JWT (null if not authenticated)
 * @param {string} question - User's question
 * @param {string} answer - Model's answer
 * @param {object} metadata - Optional metadata (sql, intent, etc.)
 */
export async function logQuery(userId, question, answer, metadata = {}) {
  // Skip logging if no user ID
  if (!userId) {
    console.log('📝 Skipping query log (no user ID)');
    return;
  }

  const pool = getDbPool();
  let client;

  try {
    client = await pool.connect();

    // Simple insert into user.messages table
    // We'll create a single conversation per user for now (conversation_id = user_id)
    await client.query(`
      INSERT INTO user.messages (
        user_id,
        conversation_id,
        role,
        content,
        metadata,
        created_at
      ) VALUES 
        ($1, $1, 'user', $2, $3, NOW()),
        ($1, $1, 'assistant', $4, $3, NOW())
    `, [
      userId,
      question,
      JSON.stringify(metadata),
      answer
    ]);

    console.log(`✅ Logged query for user ${userId.substring(0, 8)}...`);

  } catch (error) {
    // Log error but don't fail the request
    console.error('⚠️  Failed to log query:', error.message);
    
    // If the error is about missing table/schema, give helpful hint
    if (error.message.includes('relation "user.messages" does not exist')) {
      console.error('💡 Hint: Run the conversation database setup from conversations/README.md');
    }
  } finally {
    if (client) {
      client.release();
    }
  }
}

/**
 * Ensure user exists in user.user table
 * Called before first query log
 * 
 * @param {string} userId - User ID from JWT
 * @param {object} userMetadata - Optional user metadata from JWT
 */
export async function ensureUserExists(userId, userMetadata = {}) {
  if (!userId) return;

  const pool = getDbPool();
  let client;

  try {
    client = await pool.connect();

    // Insert user if not exists (ON CONFLICT DO NOTHING)
    await client.query(`
      INSERT INTO user.user (user_id, metadata, created_at, updated_at)
      VALUES ($1, $2, NOW(), NOW())
      ON CONFLICT (user_id) DO UPDATE SET updated_at = NOW()
    `, [userId, JSON.stringify(userMetadata)]);

    console.log(`✅ User ${userId.substring(0, 8)}... ready`);

  } catch (error) {
    console.error('⚠️  Failed to ensure user exists:', error.message);
  } finally {
    if (client) {
      client.release();
    }
  }
}

