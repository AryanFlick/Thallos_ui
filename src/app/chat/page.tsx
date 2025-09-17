"use client";

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';
import RateLimitStatus from '@/components/RateLimitStatus';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const placeholderQuestions = [
  "Ask about DeFi yield strategies...",
  "Inquire about blockchain analytics...",
  "Explore institutional crypto solutions...",
  "Learn about risk management in DeFi...",
  "Get insights on market trends...",
];

interface Conversation {
  id: string;
  title: string;
  created_at: Date;
  updated_at: Date;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentPlaceholder, setCurrentPlaceholder] = useState(0);
  const [user, setUser] = useState<User | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Check authentication status
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        window.location.href = '/login';
      } else {
        setUser(user);
      }
    };
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        window.location.href = '/login';
      } else {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Auto scroll to bottom
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Rotate placeholder questions
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPlaceholder((prev) => (prev + 1) % placeholderQuestions.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Force black background on body for chat page
  useEffect(() => {
    document.body.style.background = '#000000';
    document.documentElement.style.background = '#000000';
    
    return () => {
      // Reset on cleanup (when leaving page)
      document.body.style.background = '';
      document.documentElement.style.background = '';
    };
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const createNewChat = () => {
    setMessages([]);
    setCurrentConversationId(null);
    setInputValue('');
  };

  const saveConversation = async () => {
    if (!user || messages.length === 0) return;

    try {
      // Generate title from first user message
      const firstUserMessage = messages.find(msg => msg.isUser);
      const title = firstUserMessage ? 
        firstUserMessage.text.slice(0, 50) + (firstUserMessage.text.length > 50 ? '...' : '') :
        'New Chat';
      
      // Try to save to Supabase first
      try {
        const { data: conversation, error: convError } = await supabase
          .from('conversations')
          .insert({
            user_id: user.id,
            title: title
          })
          .select()
          .single();

        if (convError) throw convError;

        // Save messages to Supabase
        const messagesData = messages.map(msg => ({
          conversation_id: conversation.id,
          content: msg.text,
          is_user: msg.isUser
        }));

        const { error: msgError } = await supabase
          .from('messages')
          .insert(messagesData);

        if (msgError) throw msgError;

        // Update local state
        const newConversation: Conversation = {
          id: conversation.id,
          title: conversation.title,
          created_at: new Date(conversation.created_at),
          updated_at: new Date(conversation.updated_at),
        };

        setConversations(prev => [newConversation, ...prev]);
        setCurrentConversationId(newConversation.id);

        console.log('Chat saved to Supabase successfully:', newConversation.title);

      } catch (supabaseError) {
        console.warn('Failed to save to Supabase, falling back to localStorage:', supabaseError);
        
        // Fallback to localStorage
        const newConversation: Conversation = {
          id: Date.now().toString(),
          title,
          created_at: new Date(),
          updated_at: new Date(),
        };

        setConversations(prev => [newConversation, ...prev]);
        setCurrentConversationId(newConversation.id);

        // Store in localStorage with user-specific key
        const userKey = `thallos_chats_${user.id}`;
        const savedChats = JSON.parse(localStorage.getItem(userKey) || '{}');
        savedChats[newConversation.id] = {
          conversation: newConversation,
          messages: messages
        };
        localStorage.setItem(userKey, JSON.stringify(savedChats));

        console.log('Chat saved to localStorage:', newConversation.title);
      }

    } catch (error) {
      console.error('Error saving conversation:', error);
    }
  };

  const loadConversation = (conversationId: string) => {
    if (!user) return;
    
    try {
      const userKey = `thallos_chats_${user.id}`;
      const savedChats = JSON.parse(localStorage.getItem(userKey) || '{}');
      const chat = savedChats[conversationId];
      if (chat) {
        setMessages(chat.messages);
        setCurrentConversationId(conversationId);
        setSidebarOpen(false);
        console.log('Loaded conversation:', chat.conversation.title);
      }
    } catch (error) {
      console.error('Error loading conversation:', error);
    }
  };

  // Load saved conversations on mount
  useEffect(() => {
    const loadConversations = async () => {
      if (!user) return;

      try {
        // Try to load from Supabase first
        const { data: supabaseConversations, error } = await supabase
          .from('conversations')
          .select('*')
          .eq('user_id', user.id)
          .order('updated_at', { ascending: false });

        if (error) throw error;

        if (supabaseConversations && supabaseConversations.length > 0) {
          const conversationList = supabaseConversations.map(conv => ({
            id: conv.id,
            title: conv.title,
            created_at: new Date(conv.created_at),
            updated_at: new Date(conv.updated_at),
          }));
          setConversations(conversationList);
          console.log('Loaded conversations from Supabase:', conversationList.length);
          return;
        }
      } catch (supabaseError) {
        console.warn('Failed to load from Supabase, trying localStorage:', supabaseError);
      }

      // Fallback to localStorage
      try {
        const userKey = `thallos_chats_${user.id}`;
        const savedChats = JSON.parse(localStorage.getItem(userKey) || '{}');
        const conversationList = Object.values(savedChats as Record<string, { conversation: Conversation }>).map(chat => chat.conversation);
        setConversations(conversationList.sort((a: Conversation, b: Conversation) => 
          new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
        ));
        console.log('Loaded conversations from localStorage:', conversationList.length);
      } catch (error) {
        console.error('Error loading conversations:', error);
      }
    };

    loadConversations();
  }, [user]);

  const handleSendMessage = async (text?: string) => {
    const messageText = text || inputValue.trim();
    if (!messageText || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      // Get auth token for rate limiting
      const { data: { session } } = await supabase.auth.getSession();
      
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(session?.access_token && {
            'Authorization': `Bearer ${session.access_token}`
          })
        },
        body: JSON.stringify({
          message: messageText,
          conversationHistory: messages.map(msg => ({
            isUser: msg.isUser,
            text: msg.text,
          })),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        
        // Handle rate limiting specifically
        if (response.status === 429) {
          const remaining = response.headers.get('X-RateLimit-Remaining');
          const resetTime = response.headers.get('X-RateLimit-Reset');
          const retryAfter = response.headers.get('Retry-After');
          
          throw new Error(
            errorData.error || 
            `Rate limit exceeded. ${remaining ? `${remaining} requests remaining.` : ''} ${retryAfter ? `Try again in ${retryAfter} seconds.` : ''}`
          );
        }
        
        throw new Error(errorData.error || 'Failed to get AI response');
      }

      const data = await response.json();
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.response,
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMessage]);
      
    } catch (error) {
      console.error('Error getting AI response:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, I encountered an error. Please try again.',
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen h-screen bg-black flex flex-col overflow-hidden chat-page-body">
      {/* Full page background overlay */}
      <div className="fixed inset-0 bg-black -z-50"></div>
      {/* Fixed Navbar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-b border-yellow-800/30">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-300 bg-clip-text text-transparent">
              Thallos
            </Link>
            <div className="h-6 w-px bg-yellow-800/50"></div>
            <h1 className="text-xl font-semibold text-white">Agent</h1>
          </div>
          
          <div className="flex items-center gap-4">
            {/* New Chat Button */}
            <button
              onClick={createNewChat}
              className="bg-yellow-600/20 hover:bg-yellow-600/30 border border-yellow-600/40 text-yellow-300 hover:text-white px-4 py-2 rounded-lg text-sm transition-all duration-300 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              New Chat
            </button>
            
            <div className="text-sm text-gray-400">
              {user?.email}
            </div>
            <button
              onClick={handleSignOut}
              className="text-gray-400 hover:text-yellow-400 transition-colors duration-300 text-sm"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area with top padding */}
      <div className="flex flex-1 pt-20 bg-black min-h-0">
        {/* Sidebar */}
        <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 fixed md:relative z-40 w-80 h-full bg-gradient-to-b from-gray-900/95 to-gray-800/95 border-r border-yellow-800/30 transition-transform duration-300`}>
          <div className="flex flex-col h-full">
            {/* Chat History */}
            <div className="flex-1 overflow-y-auto p-4">
              <h3 className="text-sm font-semibold text-gray-400 mb-3">Recent Chats</h3>
              <div className="space-y-2">
                {conversations.map((conversation) => (
              <button
                    key={conversation.id}
                    onClick={() => loadConversation(conversation.id)}
                    className={`w-full text-left p-3 rounded-lg text-sm transition-all duration-300 ${
                      currentConversationId === conversation.id
                        ? 'bg-yellow-600/30 border border-yellow-600/50 text-white'
                        : 'bg-gray-800/40 hover:bg-gray-700/60 border border-gray-700/30 text-gray-300 hover:text-white'
                    }`}
                  >
                    <p className="truncate">{conversation.title}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(conversation.updated_at).toLocaleDateString()}
                    </p>
              </button>
            ))}
              </div>
          </div>
          
            {/* Rate Limit Status */}
            <RateLimitStatus user={user} />

            {/* User Info */}
            <div className="p-4 border-t border-yellow-800/30">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-400 truncate">
                  {user?.email}
                </div>
                <button
                  onClick={handleSignOut}
                  className="text-gray-400 hover:text-yellow-400 transition-colors duration-300 text-sm"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col bg-black min-h-0">
          {/* Mobile Menu Button */}
          <div className="md:hidden p-4 border-b border-yellow-800/30 bg-black">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-white hover:text-yellow-400 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>
          </div>

          {/* Chat Content */}
          <div className="flex-1 flex flex-col min-h-0 bg-black">
            {messages.length === 0 ? (
              /* Welcome Screen */
              <div className="flex-1 flex flex-col items-center justify-center p-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="text-center max-w-2xl"
                >
                  <div className="w-16 h-16 bg-gradient-to-r from-yellow-600 to-yellow-400 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                    </svg>
                  </div>
                  <h1 className="text-4xl font-bold text-white mb-4">Thallos AI</h1>
                  <p className="text-xl text-gray-300 mb-8">Your institutional DeFi intelligence partner</p>
                  <p className="text-gray-400">Ask me about yield strategies, risk management, market analysis, and more.</p>
                </motion.div>
              </div>
            ) : (
              /* Messages */
              <div className="flex-1 overflow-y-auto bg-black relative" style={{ minHeight: 0 }}>
                {/* Background overlay to ensure black coverage */}
                <div className="absolute inset-0 bg-black -z-10"></div>
                <div className="max-w-4xl mx-auto px-4 py-6 space-y-6 relative z-10" style={{ minHeight: 'calc(100vh - 200px)' }}>
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                >
                        <div className={`flex items-start gap-3 max-w-[80%] ${message.isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                          {!message.isUser && (
                            <div className="w-8 h-8 bg-gradient-to-r from-yellow-600 to-yellow-400 rounded-full flex items-center justify-center flex-shrink-0">
                              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                              </svg>
                            </div>
                          )}
                          <div
                            className={`p-4 rounded-2xl ${
                      message.isUser
                                ? 'bg-yellow-600 text-white ml-auto'
                                : 'bg-gray-800/60 text-gray-100 border border-gray-700/50'
                            }`}
                          >
                            <div className="text-sm sm:text-base leading-relaxed prose prose-invert prose-sm max-w-none">
                              {message.isUser ? (
                                <p className="whitespace-pre-wrap">{message.text}</p>
                              ) : (
                                <div
                                  dangerouslySetInnerHTML={{
                                    __html: message.text
                                      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                      .replace(/\*(.*?)\*/g, '<em>$1</em>')
                                      .replace(/`(.*?)`/g, '<code class="bg-gray-700 px-1 py-0.5 rounded text-yellow-300">$1</code>')
                                      .replace(/### (.*?)(\n|$)/g, '<h3 class="text-lg font-bold text-white mt-4 mb-2">$1</h3>')
                                      .replace(/## (.*?)(\n|$)/g, '<h2 class="text-xl font-bold text-white mt-4 mb-2">$1</h2>')
                                      .replace(/# (.*?)(\n|$)/g, '<h1 class="text-2xl font-bold text-white mt-4 mb-2">$1</h1>')
                                      .replace(/^\d+\.\s/gm, '<span class="text-yellow-400 font-semibold">$&</span>')
                                      .replace(/^-\s/gm, '<span class="text-yellow-400">•</span> ')
                                      .replace(/\n\n/g, '</p><p class="mt-3">')
                                      .replace(/\n/g, '<br/>')
                                      .replace(/^(.+)$/, '<p>$1</p>')
                                  }}
                                />
                              )}
                            </div>
                          </div>
                          {message.isUser && (
                            <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0">
                              <svg className="w-4 h-4 text-gray-300" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                              </svg>
                            </div>
                          )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Typing Indicator */}
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex justify-start"
              >
                      <div className="flex items-start gap-3 max-w-[80%]">
                        <div className="w-8 h-8 bg-gradient-to-r from-yellow-600 to-yellow-400 rounded-full flex items-center justify-center flex-shrink-0">
                          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                          </svg>
                        </div>
                        <div className="bg-gray-800/60 border border-gray-700/50 p-4 rounded-2xl">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                          </div>
                  </div>
                </div>
              </motion.div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
              </div>
            )}

            {/* Input Area - Fixed at bottom */}
            <div className="border-t border-yellow-800/30 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 relative">
              <div className="max-w-4xl mx-auto p-4 bg-transparent">
                <div className="flex items-end gap-3">
                  <div className="flex-1 relative">
                <textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                      placeholder={placeholderQuestions[currentPlaceholder]}
                      className="w-full px-4 py-3 pr-12 bg-gray-800/60 border border-gray-600/50 rounded-2xl text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500/50 transition-all duration-300 min-h-[48px] max-h-32"
                      rows={1}
                      style={{ height: 'auto' }}
                      onInput={(e) => {
                        const target = e.target as HTMLTextAreaElement;
                        target.style.height = 'auto';
                        target.style.height = target.scrollHeight + 'px';
                      }}
                />
                
                {/* Send Button */}
                <button
                  onClick={() => handleSendMessage()}
                  disabled={!inputValue.trim() || isTyping}
                      className="absolute bottom-2 right-2 bg-gradient-to-r from-yellow-600 to-yellow-500 text-white p-2 rounded-xl hover:from-yellow-500 hover:to-yellow-400 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                  </svg>
                </button>
                  </div>

                  {/* Save Chat Button */}
                  {messages.length > 0 && !currentConversationId && (
                    <button
                      onClick={saveConversation}
                      className="bg-gray-700/60 hover:bg-gray-600/60 border border-gray-600/50 text-gray-300 hover:text-white px-4 py-3 rounded-2xl transition-all duration-300 flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
                      </svg>
                      Save
                    </button>
                  )}
              </div>
              
              <p className="text-xs text-gray-500 mt-2 text-center">
                Press Enter to send • Shift+Enter for new line
              </p>
            </div>
          </div>
        </div>
      </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}