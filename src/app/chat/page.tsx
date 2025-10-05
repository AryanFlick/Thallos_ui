"use client";

import { useState, useEffect } from "react";
import { createClient, User } from "@supabase/supabase-js";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import WalletPromptModal from "@/components/WalletPromptModal";
import WalletPortfolio from "@/components/WalletPortfolio";
import { queryBackendStream, StreamChunk, ChartConfig } from "@/lib/api";
import ChartRenderer from "@/components/ChartRenderer";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  sql?: string;
  rows?: Record<string, unknown>[];
  intent?: string;
  source?: string;
  chart?: ChartConfig;
}

interface Conversation {
  id: string;
  title: string;
  created_at: Date;
  updated_at: Date;
}

interface SavedChat {
  conversation: Conversation;
  messages: Message[];
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showWalletPrompt, setShowWalletPrompt] = useState(false);
  const [expandedDebug, setExpandedDebug] = useState<Set<string>>(new Set());
  const router = useRouter();

  const toggleDebug = (messageId: string) => {
    setExpandedDebug(prev => {
      const next = new Set(prev);
      if (next.has(messageId)) {
        next.delete(messageId);
      } else {
        next.add(messageId);
      }
      return next;
    });
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  // Check user auth
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        window.location.href = '/login';
      } else {
        setUser(user);
        // Check if user has connected wallets
        checkWalletConnection();
      }
    };
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        window.location.href = '/login';
      } else {
        setUser(session.user);
        checkWalletConnection();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Check if user has any wallets connected
  const checkWalletConnection = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const response = await fetch("/api/wallets", {
        headers: {
          "Authorization": `Bearer ${session.access_token}`,
        },
      });

      const result = await response.json();

      if (response.ok && result.wallets) {
        // Wallet prompt disabled - user can connect via profile page or wallet section
      }
    } catch (error) {
      console.error("Error checking wallet connection:", error);
    }
  };

  const createNewChat = () => {
    setMessages([]);
    setCurrentConversationId(null);
    setSidebarOpen(false);
  };

  const saveConversation = async (userMsg: Message, aiMsg: Message) => {
    if (!user) return;

    try {
      const title = userMsg.text.substring(0, 50) + (userMsg.text.length > 50 ? '...' : '');
      
      // Try to save to Supabase first
      try {
        let conversationId = currentConversationId;

        if (!conversationId) {
          // Create new conversation
          const { data, error } = await supabase
            .from('conversations')
            .insert({
              user_id: user.id,
              title,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            })
            .select()
            .single();

          if (error) throw error;
          
          conversationId = data.id;
          setCurrentConversationId(conversationId);

          // Add to conversations list
          const newConversation: Conversation = {
            id: data.id,
            title: data.title,
            created_at: new Date(data.created_at),
            updated_at: new Date(data.updated_at),
          };
          setConversations(prev => [newConversation, ...prev.filter(c => c.id !== newConversation.id)]);
        } else {
          // Update existing conversation timestamp
          await supabase
            .from('conversations')
            .update({ updated_at: new Date().toISOString() })
            .eq('id', conversationId);

          // Update in local state
          setConversations(prev => prev.map(c => 
            c.id === conversationId 
              ? { ...c, updated_at: new Date() }
              : c
          ));
        }

        // Save only the new messages
        const messagesToSave = [
          {
            conversation_id: conversationId,
            is_user: true,
            content: userMsg.text,
            created_at: userMsg.timestamp.toISOString(),
          },
          {
            conversation_id: conversationId,
            is_user: false,
            content: aiMsg.text,
            created_at: aiMsg.timestamp.toISOString(),
          }
        ];

        const { error: messagesError } = await supabase
          .from('messages')
          .insert(messagesToSave);

        if (messagesError) {
          console.warn('Failed to save messages to Supabase:', messagesError);
        }

        console.log('Messages saved to conversation:', conversationId);

      } catch (supabaseError) {
        console.warn('Failed to save to Supabase, falling back to localStorage:', supabaseError);
        
        // Fallback to localStorage
        let conversationId = currentConversationId;
        
        if (!conversationId) {
          conversationId = Date.now().toString();
          setCurrentConversationId(conversationId);
          
          const newConversation: Conversation = {
            id: conversationId,
            title,
            created_at: new Date(),
            updated_at: new Date(),
          };
          setConversations(prev => [newConversation, ...prev]);
        }

        // Update localStorage
        const userKey = `thallos_chats_${user.id}`;
        const savedChats = JSON.parse(localStorage.getItem(userKey) || '{}');
        
        if (!savedChats[conversationId]) {
          savedChats[conversationId] = {
            conversation: { id: conversationId, title, created_at: new Date(), updated_at: new Date() },
            messages: []
          };
        }
        
        savedChats[conversationId].messages.push(userMsg, aiMsg);
        savedChats[conversationId].conversation.updated_at = new Date();
        localStorage.setItem(userKey, JSON.stringify(savedChats));

        console.log('Messages saved to localStorage');
      }

    } catch (error) {
      console.error('Error saving conversation:', error);
    }
  };

  const loadConversation = async (conversationId: string) => {
    if (!user) return;
    
    try {
      // Try to load from Supabase first
      const { data: messages, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (!error && messages && messages.length > 0) {
        const loadedMessages = messages.map(msg => ({
          id: msg.id,
          text: msg.content,
          isUser: msg.is_user,
          timestamp: new Date(msg.created_at),
        }));
        setMessages(loadedMessages);
        setCurrentConversationId(conversationId);
        setSidebarOpen(false);
        console.log('Loaded conversation from Supabase');
        return;
      }

      // Fallback to localStorage
      const userKey = `thallos_chats_${user.id}`;
      const savedChats = JSON.parse(localStorage.getItem(userKey) || '{}');
      const chat = savedChats[conversationId];
      if (chat) {
        setMessages(chat.messages);
        setCurrentConversationId(conversationId);
        setSidebarOpen(false);
        console.log('Loaded conversation from localStorage:', chat.conversation.title);
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
          console.log('Loaded conversations from Supabase');
          return;
        }
      } catch (supabaseError) {
        console.warn('Failed to load from Supabase, trying localStorage:', supabaseError);
      }

      // Fallback to localStorage
      try {
        const userKey = `thallos_chats_${user.id}`;
        const savedChats = JSON.parse(localStorage.getItem(userKey) || '{}') as Record<string, SavedChat>;
        const conversationList = Object.values(savedChats).map((chat) => chat.conversation);
        setConversations(conversationList);
        console.log('Loaded conversations from localStorage');
      } catch (localError) {
        console.error('Failed to load from localStorage:', localError);
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

    // Create a placeholder AI message that will be updated as stream progresses
    const aiMessageId = (Date.now() + 1).toString();
    const aiMessage: Message = {
      id: aiMessageId,
      text: '',
      isUser: false,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, aiMessage]);

    try {
      let sql: string | undefined;
      let rows: Record<string, unknown>[] | undefined;
      let intent: string | undefined;
      let answerText = '';

      // Stream the response from the backend
      for await (const chunk of queryBackendStream(messageText)) {
        if (chunk.type === 'sql') {
          sql = chunk.sql;
          // Update message with SQL
          setMessages(prev => prev.map(msg => 
            msg.id === aiMessageId 
              ? { ...msg, sql: chunk.sql }
              : msg
          ));
        } else if (chunk.type === 'rows') {
          rows = chunk.rows;
          // Update message with rows
          setMessages(prev => prev.map(msg => 
            msg.id === aiMessageId 
              ? { ...msg, rows: chunk.rows }
              : msg
          ));
        } else if (chunk.type === 'chart' && chunk.chart) {
          // Update message with chart config
          setMessages(prev => prev.map(msg => 
            msg.id === aiMessageId 
              ? { ...msg, chart: chunk.chart }
              : msg
          ));
        } else if (chunk.type === 'answer_chunk' && chunk.content) {
          answerText += chunk.content;
          // Update message text with streaming content
          setMessages(prev => prev.map(msg => 
            msg.id === aiMessageId 
              ? { ...msg, text: answerText }
              : msg
          ));
        } else if (chunk.type === 'done') {
          intent = chunk.intent;
          // Final update
          setMessages(prev => prev.map(msg => 
            msg.id === aiMessageId 
              ? { ...msg, intent: chunk.intent, source: 'database_query' }
              : msg
          ));
        } else if (chunk.type === 'error') {
          throw new Error(chunk.error || 'Failed to get response from backend');
        }
      }

      // Get the final message for saving
      const finalAiMessage = {
        ...aiMessage,
        text: answerText,
        sql,
        rows,
        intent,
        source: 'database_query'
      };

      // Auto-save the conversation
      await saveConversation(userMessage, finalAiMessage);
      
    } catch (error) {
      console.error('Error getting AI response:', error);
      const errorMessage = error instanceof Error ? error.message : 'Sorry, I encountered an error. Please try again.';
      
      // Update the AI message with error
      setMessages(prev => prev.map(msg => 
        msg.id === aiMessageId 
          ? { ...msg, text: errorMessage, source: 'error' }
          : msg
      ));
      
      // Save even on error to preserve the conversation
      const finalAiMessage = {
        ...aiMessage,
        text: errorMessage,
      };
      await saveConversation(userMessage, finalAiMessage);
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
    <div className="min-h-screen h-screen bg-black flex overflow-hidden">
      {/* Wallet Prompt Modal */}
      {showWalletPrompt && user && (
        <WalletPromptModal 
          userId={user.id} 
          onClose={() => setShowWalletPrompt(false)} 
        />
      )}

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 fixed md:relative z-40 w-72 md:w-80 h-full bg-gradient-to-b from-gray-900 to-black border-r border-emerald-500/20 transition-transform duration-300 flex flex-col pt-16`}>
        {/* Sidebar Header with New Chat */}
        <div className="p-4 border-b border-emerald-500/20">
            <button
              onClick={createNewChat}
            className="w-full bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white px-4 py-3 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 font-medium shadow-lg shadow-emerald-500/20"
            >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              New Chat
            </button>
      </div>

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
                    ? 'bg-emerald-500/20 border border-emerald-500/30 text-white'
                    : 'bg-gray-800/50 hover:bg-gray-800 border border-gray-700/30 text-gray-300 hover:text-white'
                    }`}
                  >
                <p className="truncate font-medium">{conversation.title}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(conversation.updated_at).toLocaleDateString()}
                    </p>
              </button>
            ))}
              </div>
          </div>
        
        {/* Wallet Portfolio */}
        <WalletPortfolio user={user} />

        {/* User Info */}
        <div className="p-4 border-t border-emerald-500/20">
              <div className="flex items-center justify-between">
            <Link
              href="/profile"
              className="text-sm text-gray-400 truncate hover:text-emerald-400 transition-colors duration-300"
            >
                  {user?.email}
            </Link>
                <button
                  onClick={handleSignOut}
              className="text-gray-400 hover:text-emerald-400 transition-colors duration-300 text-sm"
                >
                  Sign Out
                </button>
            </div>
          </div>
        </div>

        {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-black pt-16 md:pt-16">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between p-4 border-b border-emerald-500/20 bg-gray-900/50">
            <button
              onClick={() => setSidebarOpen(true)}
            className="text-white hover:text-emerald-400 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>
          <h1 className="text-lg font-semibold text-white">Thallos AI</h1>
          <div className="w-6 h-6" /> {/* Spacer for centering */}
          </div>

          {/* Chat Content */}
        <div className="flex-1 flex flex-col min-h-0">
            {messages.length === 0 ? (
              /* Welcome Screen */
              <div className="flex-1 flex flex-col items-center justify-center p-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="text-center max-w-2xl"
                >
                <div className="w-20 h-20 bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/30">
                  <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                    </svg>
                  </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Welcome to Thallos AI</h1>
                <p className="text-lg md:text-xl text-gray-300 mb-8">Your institutional DeFi intelligence partner</p>
                <p className="text-gray-400 text-sm md:text-base px-4">Ask me about yield strategies, risk management, market analysis, and more.</p>
                </motion.div>
              </div>
            ) : (
              /* Messages */
            <div className="flex-1 overflow-y-auto">
              <div className="max-w-4xl mx-auto px-4 py-6 space-y-4">
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                >
                      <div className={`flex items-start gap-3 max-w-full md:max-w-[80%] ${message.isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                          {!message.isUser && (
                          <div className="w-8 h-8 bg-gradient-to-br from-emerald-600 to-emerald-500 rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg shadow-emerald-500/20">
                            <span className="text-white font-bold text-sm">T</span>
                            </div>
                          )}
                          <div
                          className={`px-4 py-3 rounded-2xl ${
                      message.isUser
                              ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                              : 'bg-gray-800/80 text-gray-100 border border-gray-700/50'
                            }`}
                          >
                          <div className="text-sm md:text-base leading-relaxed">
                              {message.isUser ? (
                                <p className="whitespace-pre-wrap">{message.text}</p>
                              ) : (
                                <>
                                  <div
                                  className="prose prose-invert prose-sm max-w-none"
                                    dangerouslySetInnerHTML={{
                                      __html: message.text
                                      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-emerald-400">$1</strong>')
                                        .replace(/\*(.*?)\*/g, '<em>$1</em>')
                                      .replace(/`(.*?)`/g, '<code class="bg-gray-700 px-1 py-0.5 rounded text-emerald-300">$1</code>')
                                        .replace(/### (.*?)(\n|$)/g, '<h3 class="text-lg font-bold text-white mt-4 mb-2">$1</h3>')
                                        .replace(/## (.*?)(\n|$)/g, '<h2 class="text-xl font-bold text-white mt-4 mb-2">$1</h2>')
                                        .replace(/# (.*?)(\n|$)/g, '<h1 class="text-2xl font-bold text-white mt-4 mb-2">$1</h1>')
                                      .replace(/^\d+\.\s/gm, '<span class="text-emerald-400 font-semibold">$&</span>')
                                      .replace(/^-\s/gm, '<span class="text-emerald-400">•</span> ')
                                        .replace(/\n\n/g, '</p><p class="mt-3">')
                                        .replace(/\n/g, '<br/>')
                                    }}
                                  />
                                  {/* Render Chart if present */}
                                  {message.chart && (
                                    <div className="mt-4">
                                      <ChartRenderer config={message.chart} />
                                    </div>
                                  )}
                                  {/* Debug Button */}
                                  {(message.sql || message.rows || message.intent) && (
                                    <div className="mt-3 pt-3 border-t border-gray-700/50">
                                      <button
                                        onClick={() => toggleDebug(message.id)}
                                        className="text-xs text-gray-400 hover:text-emerald-400 transition-colors flex items-center gap-1"
                                      >
                                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                                          <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                                        </svg>
                                        Debug Info
                                      </button>
                                      {expandedDebug.has(message.id) && (
                                        <div className="mt-2 space-y-2">
                                          {message.intent && (
                                            <div className="text-xs">
                                              <span className="text-gray-400">Intent:</span>
                                              <span className="ml-2 text-emerald-400">{message.intent}</span>
                                            </div>
                                          )}
                                          {message.sql && (
                                            <div className="text-xs">
                                              <span className="text-gray-400">SQL:</span>
                                              <pre className="mt-1 p-2 bg-gray-900 rounded text-emerald-300 overflow-x-auto">
                                                {message.sql}
                                              </pre>
                                            </div>
                                          )}
                                          {message.rows && message.rows.length > 0 && (
                                            <div className="text-xs">
                                              <span className="text-gray-400">Data ({message.rows.length} rows):</span>
                                              <pre className="mt-1 p-2 bg-gray-900 rounded text-emerald-300 overflow-x-auto max-h-40">
                                                {JSON.stringify(message.rows.slice(0, 5), null, 2)}
                                              </pre>
                                            </div>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </>
                              )}
                            </div>
                          </div>
                          {message.isUser && (
                            <div className="w-8 h-8 bg-gradient-to-br from-gray-700 to-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
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
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-emerald-600 to-emerald-500 rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg shadow-emerald-500/20">
                        <span className="text-white font-bold text-sm">T</span>
                      </div>
                      <div className="bg-gray-800/80 border border-gray-700/50 px-4 py-3 rounded-2xl">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                          </div>
                  </div>
                </div>
              </motion.div>
            )}
              </div>
              </div>
            )}

          {/* Input Area */}
          <div className="border-t border-emerald-500/20 bg-gray-900/50 backdrop-blur-sm p-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about DeFi, yield strategies, or market analysis..."
                  className="flex-1 bg-gray-800/80 text-white placeholder-gray-500 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 border border-gray-700/50"
                  disabled={isTyping}
                />
                <button
                  onClick={() => handleSendMessage()}
                  disabled={!inputValue.trim() || isTyping}
                  className="bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg transition-all duration-300 flex items-center gap-2 shadow-lg shadow-emerald-500/20"
                >
                  <span className="hidden md:inline">Send</span>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                  </svg>
                </button>
              </div>
              <div className="mt-2 text-xs text-gray-500 text-center">
                Press Enter to send • Shift+Enter for new line
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}