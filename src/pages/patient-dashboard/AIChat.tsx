import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  Plus, 
  Trash2, 
  Settings, 
  Menu,
  X,
  MessageCircle,
  Star,
  ChevronRight
} from 'lucide-react';
import PatientSidebar from './components/PatientSidebar';
import PatientDashboardHeader from './components/PatientDashboardHeader';
import PatientMobileFooter from './components/PatientMobileFooter';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface ChatHistory {
  id: string;
  title: string;
  messages: Message[];
  lastUpdated: string;
  isPinned: boolean;
}

export default function AIChat() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const now = new Date();
  const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);
  const fiveDaysAgo = new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000);
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const [chatSidebarOpen, setChatSidebarOpen] = useState(true);
  const [currentChatId, setCurrentChatId] = useState<string>('new');
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([
    {
      id: 'chat-1',
      title: 'Healthcare Tips Discussion',
      messages: [
        { id: '1', role: 'user', content: 'What are the best practices for maintaining good health?', timestamp: twoDaysAgo.toISOString() },
        { id: '2', role: 'assistant', content: 'Here are the key practices for maintaining good health:\n\n1. **Regular Exercise**: Aim for at least 150 minutes of moderate activity per week\n2. **Balanced Diet**: Include fruits, vegetables, lean proteins, and whole grains\n3. **Adequate Sleep**: Get 7-9 hours of quality sleep daily\n4. **Stress Management**: Practice meditation, yoga, or other relaxation techniques', timestamp: twoDaysAgo.toISOString() }
      ],
      lastUpdated: twoDaysAgo.toISOString(),
      isPinned: true
    },
    {
      id: 'chat-2',
      title: 'Medication Questions',
      messages: [
        { id: '3', role: 'user', content: 'How can I manage medication side effects?', timestamp: fiveDaysAgo.toISOString() },
        { id: '4', role: 'assistant', content: 'Common strategies to manage medication side effects:\n\n- Discuss with your doctor about timing and dosage adjustments\n- Stay hydrated and maintain a balanced diet\n- Take medications with food if recommended\n- Report persistent side effects immediately', timestamp: fiveDaysAgo.toISOString() }
      ],
      lastUpdated: fiveDaysAgo.toISOString(),
      isPinned: false
    },
    {
      id: 'chat-3',
      title: 'Fitness and Diet Plan',
      messages: [
        { id: '5', role: 'user', content: 'What diet plan would you recommend for weight loss?', timestamp: sevenDaysAgo.toISOString() },
        { id: '6', role: 'assistant', content: 'A sustainable weight loss diet should include:\n\n- Reduce calorie intake by 500-750 calories per day\n- Increase protein intake to maintain muscle\n- Eliminate refined sugars and processed foods\n- Include regular exercise for best results', timestamp: sevenDaysAgo.toISOString() }
      ],
      lastUpdated: sevenDaysAgo.toISOString(),
      isPinned: false
    }
  ]);
  const [newChatMessages, setNewChatMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const messageCountRef = useRef(0);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [newChatMessages, isLoading]);

  const currentChat = currentChatId === 'new' ? null : chatHistory.find(c => c.id === currentChatId);
  const displayedMessages = currentChat ? currentChat.messages : newChatMessages;

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    messageCountRef.current += 1;
    const userMessage: Message = {
      id: `user-${messageCountRef.current}`,
      role: 'user',
      content: input,
      timestamp: new Date().toISOString()
    };

    setNewChatMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      messageCountRef.current += 1;
      const assistantMessage: Message = {
        id: `assistant-${messageCountRef.current}`,
        role: 'assistant',
        content: generateAIResponse(input),
        timestamp: new Date().toISOString()
      };
      setNewChatMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1000);
  };

  const generateAIResponse = (userInput: string): string => {
    const responses: { [key: string]: string } = {
      'health': 'Good health comes from a combination of proper diet, exercise, sleep, and stress management. Would you like more specific advice?',
      'diet': 'A balanced diet should include vegetables, fruits, lean proteins, whole grains, and healthy fats. Consider consulting with a nutritionist for personalized recommendations.',
      'exercise': 'Regular physical activity is crucial. Aim for 150 minutes of moderate exercise per week. Mix cardio, strength training, and flexibility exercises.',
      'sleep': 'Quality sleep is essential for health. Maintain a consistent sleep schedule, avoid screens before bed, and create a dark, cool sleeping environment.',
    };

    const lowerInput = userInput.toLowerCase();
    for (const [key, response] of Object.entries(responses)) {
      if (lowerInput.includes(key)) {
        return response;
      }
    }

    return 'Thank you for your question. I\'d be happy to help with health-related information. Could you provide more details about what you\'d like to know?';
  };

  const startNewChat = () => {
    setCurrentChatId('new');
    setNewChatMessages([]);
  };

  const deleteChat = (id: string) => {
    setChatHistory(chatHistory.filter(c => c.id !== id));
    if (currentChatId === id) {
      startNewChat();
    }
  };

  const togglePinChat = (id: string) => {
    setChatHistory(chatHistory.map(c =>
      c.id === id ? { ...c, isPinned: !c.isPinned } : c
    ));
  };

  const pinnedChats = chatHistory.filter(c => c.isPinned);
  const regularChats = chatHistory.filter(c => !c.isPinned);

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    return `${Math.floor(days / 7)} weeks ago`;
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Patient Sidebar */}
      <PatientSidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />

      <main className="flex-1 flex flex-col overflow-hidden">
        <PatientDashboardHeader toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        
        <div className="flex-1 flex overflow-hidden">
          {/* Chat Sidebar */}
          <AnimatePresence>
            {chatSidebarOpen && (
              <motion.div
                initial={{ x: -320 }}
                animate={{ x: 0 }}
                exit={{ x: -320 }}
                transition={{ type: 'spring', damping: 20 }}
                className="w-80 bg-white border-r border-slate-200 flex flex-col overflow-hidden shadow-lg md:shadow-none"
              >
                {/* Sidebar Header */}
                <div className="p-4 border-b border-slate-200">
                  <button
                    onClick={startNewChat}
                    className="w-full py-3 px-4 bg-[#0A6ED1] text-white rounded-lg font-medium hover:bg-[#095bb0] transition-colors flex items-center justify-center gap-2 group"
                  >
                    <Plus size={20} className="group-hover:rotate-90 transition-transform" />
                    New Chat
                  </button>
                </div>

                {/* Chat History */}
                <div className="flex-1 overflow-y-auto">
                  {/* Pinned Chats */}
                  {pinnedChats.length > 0 && (
                    <div className="p-3 space-y-2">
                      <h3 className="text-xs font-semibold text-slate-400 uppercase px-2 py-1">Pinned</h3>
                      {pinnedChats.map(chat => (
                        <motion.button
                          key={chat.id}
                          whileHover={{ x: 4 }}
                          onClick={() => setCurrentChatId(chat.id)}
                          className={`w-full text-left p-3 rounded-lg transition-all group ${
                            currentChatId === chat.id
                              ? 'bg-blue-50 border border-blue-200'
                              : 'hover:bg-slate-50 border border-transparent'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-slate-900 truncate">{chat.title}</p>
                              <p className="text-xs text-slate-500 mt-1">{formatTimeAgo(chat.lastUpdated)}</p>
                            </div>
                            <Star
                              size={16}
                              className="text-yellow-400 fill-yellow-400 shrink-0 mt-1"
                            />
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  )}

                  {/* Regular Chats */}
                  {regularChats.length > 0 && (
                    <div className="p-3 space-y-2">
                      {pinnedChats.length > 0 && (
                        <h3 className="text-xs font-semibold text-slate-400 uppercase px-2 py-1 mt-2">Recent</h3>
                      )}
                      {regularChats.map(chat => (
                        <motion.div
                          key={chat.id}
                          whileHover={{ x: 4 }}
                          className={`p-3 rounded-lg transition-all group cursor-pointer border ${
                            currentChatId === chat.id
                              ? 'bg-blue-50 border-blue-200'
                              : 'hover:bg-slate-50 border-transparent'
                          }`}
                          onClick={() => setCurrentChatId(chat.id)}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-slate-900 truncate">{chat.title}</p>
                              <p className="text-xs text-slate-500 mt-1">{formatTimeAgo(chat.lastUpdated)}</p>
                            </div>
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  togglePinChat(chat.id);
                                }}
                                className="p-1.5 hover:bg-slate-200 rounded text-slate-500 hover:text-slate-700"
                              >
                                <Star size={14} />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteChat(chat.id);
                                }}
                                className="p-1.5 hover:bg-red-100 rounded text-slate-500 hover:text-red-600"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}

                  {chatHistory.length === 0 && (
                    <div className="p-6 text-center">
                      <MessageCircle size={32} className="mx-auto text-slate-300 mb-2" />
                      <p className="text-sm text-slate-500">No chat history yet</p>
                    </div>
                  )}
                </div>

                {/* Sidebar Footer */}
                <div className="p-4 border-t border-slate-200 space-y-2">
                  <button className="w-full flex items-center gap-3 p-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
                    <Settings size={18} />
                    <span className="text-sm">Settings</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Chat Area */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Header */}
            <motion.header
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm"
            >
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setChatSidebarOpen(!chatSidebarOpen)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors md:hidden"
                >
                  {chatSidebarOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
                <div>
                  <h1 className="text-xl font-bold text-slate-900">Healthcare AI Assistant</h1>
                  <p className="text-sm text-slate-500">Ask me anything about your health</p>
                </div>
              </div>
            </motion.header>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50">
              {displayedMessages.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="h-full flex flex-col items-center justify-center text-center"
                >
                  <div className="mb-6">
                    <MessageCircle size={64} className="mx-auto text-blue-300 mb-4" />
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Start a conversation</h2>
                    <p className="text-slate-600 max-w-md">
                      Ask me questions about health, fitness, nutrition, or any health-related topics. I'm here to help!
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-8 w-full max-w-2xl">
                    {[
                      'What are healthy eating habits?',
                      'How can I improve my fitness?',
                      'What should I do to manage stress?',
                      'Tips for better sleep quality?'
                    ].map((suggestion, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          setInput(suggestion);
                          inputRef.current?.focus();
                        }}
                        className="p-3 bg-blue-50 hover:bg-blue-100 text-[#0A6ED1] rounded-lg text-sm font-medium transition-colors border border-blue-200"
                      >
                        <ChevronRight size={14} className="inline mr-2" />
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </motion.div>
              ) : (
                <div className="space-y-4">
                  <AnimatePresence>
                    {displayedMessages.map((message, index) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-2xl p-4 rounded-lg ${
                            message.role === 'user'
                              ? 'bg-[#0A6ED1] text-white rounded-br-none'
                              : 'bg-white text-slate-900 rounded-bl-none shadow-sm border border-slate-100'
                          }`}
                        >
                          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                          <p
                            className={`text-xs mt-2 ${
                              message.role === 'user' ? 'text-blue-100' : 'text-slate-500'
                            }`}
                          >
                            {formatTime(message.timestamp)}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {isLoading && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex justify-start"
                    >
                      <div className="bg-white text-slate-900 p-4 rounded-lg rounded-bl-none shadow-sm border border-slate-100">
                        <div className="flex gap-2">
                          <div className="w-2 h-2 bg-slate-600 rounded-full animate-bounce" />
                          <div className="w-2 h-2 bg-slate-600 rounded-full animate-bounce delay-100" />
                          <div className="w-2 h-2 bg-slate-600 rounded-full animate-bounce delay-200" />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="bg-white border-t border-slate-200 p-6">
              <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto">
                <div className="flex gap-4">
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask me about health, fitness, nutrition..."
                    disabled={isLoading}
                    className="flex-1 px-4 py-3 bg-slate-100 border border-slate-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-[#0A6ED1]/20 focus:border-[#0A6ED1] outline-none transition-all disabled:opacity-50"
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    disabled={isLoading || !input.trim()}
                    className="px-6 py-3 bg-[#0A6ED1] text-white rounded-lg font-medium hover:bg-[#095bb0] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <Send size={18} />
                  </motion.button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>

      <PatientMobileFooter />
    </div>
  );
}
