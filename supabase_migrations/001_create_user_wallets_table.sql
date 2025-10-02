-- Migration: Create user_wallets table
-- Run this in your Supabase SQL Editor

-- Create user_wallets table
CREATE TABLE user_wallets (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    address TEXT NOT NULL,
    chain_id INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure unique wallet per user (prevent duplicates)
    UNIQUE(user_id, address)
);

-- Create index for faster queries by user_id
CREATE INDEX idx_user_wallets_user_id ON user_wallets(user_id);

-- Create index for faster queries by address
CREATE INDEX idx_user_wallets_address ON user_wallets(address);

-- Enable RLS (Row Level Security)
ALTER TABLE user_wallets ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own wallets
CREATE POLICY "Users can view own wallets" ON user_wallets
    FOR SELECT USING (auth.uid() = user_id);

-- Policy: Users can only insert their own wallets
CREATE POLICY "Users can insert own wallets" ON user_wallets
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy: Users can only delete their own wallets
CREATE POLICY "Users can delete own wallets" ON user_wallets
    FOR DELETE USING (auth.uid() = user_id);

