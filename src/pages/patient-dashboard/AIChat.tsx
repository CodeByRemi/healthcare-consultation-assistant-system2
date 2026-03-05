import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Send, 
  Plus, 
  Trash2, 
  X,
  MessageCircle,
  Star,
  ChevronRight,
  Bell,
  ArrowLeft
} from 'lucide-react';
import PatientSidebar from './components/PatientSidebar';
import PatientDashboardHeader from './components/PatientDashboardHeader';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useAuth } from "../../context/AuthContext";

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  timestamp: any; 
}

interface ChatHistory {
  id: string;
  title: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  lastUpdated: any;
  isPinned: boolean;
}

export default function AIChat() {
  const { currentUser } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  const [chatSidebarOpen, setChatSidebarOpen] = useState(true);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load Chat History Sessions
  useEffect(() => {
    if (!currentUser) return;
    
    // Check if we need to initialize a default chat
    const q = query(
        collection(db, "patients", currentUser.uid, "aiConversations"),
        orderBy("lastUpdated", "desc")
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
        const history: ChatHistory[] = snapshot.docs.map(doc => ({
            id: doc.id,
            title: doc.data().title || "New Consultation",
            lastUpdated: doc.data().lastUpdated,
            isPinned: doc.data().isPinned || false
        }));
        
        setChatHistory(history);
        
        // If no active chat and history exists, select first one
        if (!currentChatId && history.length > 0) {
            setCurrentChatId(history[0].id);
        }
    });
    
    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]); 

  // Load Messages for Current Chat
  useEffect(() => {
      if (!currentUser || !currentChatId) {
          setMessages([]);
          return;
      }
      
      const q = query(
          collection(db, "patients", currentUser.uid, "aiConversations", currentChatId, "messages"),
          orderBy("timestamp", "asc")
      );
      
      const unsubscribe = onSnapshot(q, (snapshot) => {
          const msgs: Message[] = snapshot.docs.map(doc => ({
              id: doc.id,
              role: doc.data().role,
              content: doc.data().content,
              timestamp: doc.data().timestamp
          }));
          setMessages(msgs);
      });
      
      return () => unsubscribe();
  }, [currentUser, currentChatId]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Close main sidebar when chat sidebar opens
  useEffect(() => {
    if (chatSidebarOpen) {
      setIsSidebarOpen(false);
    }
  }, [chatSidebarOpen]);

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

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !currentUser) return;

    const messageText = input;
    setInput('');

    // Optimistically add user message
    const tempMessage: Message = {
        id: `temp-${Date.now()}`,
        role: 'user',
        content: messageText,
        timestamp: new Date()
    };
    setMessages(prev => [...prev, tempMessage]);

    setIsLoading(true);

    try {
        let chatId = currentChatId;
        
        // Create new chat if none selected
        if (!chatId) {
            const docRef = await addDoc(collection(db, "patients", currentUser.uid, "aiConversations"), {
                title: messageText.substring(0, 30) + "...",
                lastUpdated: serverTimestamp(),
                isPinned: false,
                createdAt: serverTimestamp()
            });
            chatId = docRef.id;
            setCurrentChatId(chatId);
        } else {
             // Update existing chat title if it's the first message or generic
             await updateDoc(doc(db, "patients", currentUser.uid, "aiConversations", chatId), {
                 lastUpdated: serverTimestamp()
             });
        }

        // Add User Message
        await addDoc(collection(db, "patients", currentUser.uid, "aiConversations", chatId, "messages"), {
            role: 'user',
            content: messageText,
            timestamp: serverTimestamp()
        });

        // Simulate AI Response
        setTimeout(async () => {
             const response = generateAIResponse(messageText);
             
             await addDoc(collection(db, "patients", currentUser.uid, "aiConversations", chatId!, "messages"), {
                 role: 'assistant',
                 content: response, // Use the generated response
                 timestamp: serverTimestamp()
             });
             
             setIsLoading(false);
        }, 1000);

    } catch (error) {
        console.error("Error sending message:", error);
        setIsLoading(false);
    }
  };

  const startNewChat = () => {
    setCurrentChatId(null);
    setMessages([]);
    setInput('');
  };

  const deleteChat = async (id: string) => {
    if (!currentUser) return;
    try {
        await deleteDoc(doc(db, "patients", currentUser.uid, "aiConversations", id));
        if (currentChatId === id) {
            startNewChat();
        }
    } catch (error) {
        console.error("Error deleting chat:", error);
    }
  };

  const togglePinChat = async (id: string) => {
    if (!currentUser) return;
    const chat = chatHistory.find(c => c.id === id);
    if (chat) {
        await updateDoc(doc(db, "patients", currentUser.uid, "aiConversations", id), {
            isPinned: !chat.isPinned
        });
    }
  };

  const pinnedChats = chatHistory.filter(c => c.isPinned);
  const regularChats = chatHistory.filter(c => !c.isPinned);

  const formatTimeAgo = (dateInput: any) => {
    if (!dateInput) return '';
    const date = dateInput.toDate ? dateInput.toDate() : new Date(dateInput);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    return `${Math.floor(days / 7)} weeks ago`;
  };

  const formatTime = (dateInput: any) => {
    if (!dateInput) return '';
    const date = dateInput.toDate ? dateInput.toDate() : new Date(dateInput);
    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };


  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Patient Sidebar */}
      <PatientSidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />

      <main className="flex-1 flex flex-col overflow-hidden relative">
        <div className="hidden md:block">
          <PatientDashboardHeader toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        </div>
        

        {/* Mobile Header */}
        <div className="md:hidden h-16 bg-white border-b border-slate-100 flex items-center justify-between px-4 z-10 shrink-0">
            {/* Left Actions - New & View */}
            <div className="flex items-center gap-3">
                <Link
                    to="/patient/dashboard"
                    className="p-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-center shadow-sm"
                    title="Back to Dashboard"
                >
                    <ArrowLeft size={20} />
                </Link>
                <button
                    onClick={startNewChat}
                    className="p-2.5 bg-[#0A6ED1] text-white rounded-xl shadow-lg shadow-blue-100 hover:bg-[#095bb0] transition-colors flex items-center justify-center group"
                    title="New Chat"
                >
                    <Plus size={20} className="group-active:scale-90 transition-transform" />
                </button>
                <Link
                    to="/patient/ai-chat/history"
                    className="p-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-center shadow-sm"
                    title="View History"
                >
                    <MessageCircle size={20} />
                </Link>
            </div>
            
            {/* Right Side - Branding/Profile */}
            <div className="flex items-center gap-4">
                 <Link to="/patient/notifications" className="relative p-2 text-slate-400 hover:text-[#0A6ED1]">
                    <Bell size={20} />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                 </Link>
                   <div className="w-9 h-9 rounded-full bg-linear-to-tr from-blue-50 to-blue-100 flex items-center justify-center text-[#0A6ED1] shadow-sm border border-blue-100">
                     <UserIcon size={18} />
                 </div>
            </div>
        </div>
        
        <div className="flex-1 flex overflow-hidden relative">
          {/* Chat Sidebar */}
          <AnimatePresence>
            {chatSidebarOpen && (
              <motion.div
                initial={{ x: -320, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -320, opacity: 0 }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="hidden md:flex relative h-full w-80 bg-white border-r border-slate-200 flex-col shadow-none"
              >
                {/* Sidebar Header */}
                <div className="p-4 border-b border-slate-200 flex justify-between items-center">
                  <button
                    onClick={startNewChat}
                    className="flex-1 py-3 px-4 bg-[#0A6ED1] text-white rounded-lg font-medium hover:bg-[#095bb0] transition-colors flex items-center justify-center gap-2 group"
                  >
                    <Plus size={20} className="group-hover:rotate-90 transition-transform" />
                    New Chat
                  </button>
                  <button 
                    onClick={() => setChatSidebarOpen(false)}
                    className="ml-2 md:hidden p-2 text-slate-400 hover:text-slate-600"
                  >
                    <X size={20} />
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
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Chat Area */}
          <div className="flex-1 flex flex-col overflow-hidden relative">
            {/* Desktop Header */}
            <header className="hidden md:flex bg-white border-b border-slate-200 px-6 py-4 items-center justify-between shadow-sm z-10 shrink-0">
              <div>
                <h1 className="text-xl font-bold text-slate-900">Healthcare AI Assistant</h1>
                <p className="text-sm text-slate-500">Ask me anything about your health</p>
              </div>

              <Link
                to="/patient/ai-chat/history"
                className="inline-flex items-center gap-2 px-3 py-2 text-sm rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors"
              >
                View History
              </Link>
            </header>


            {/* Mobile Controls removed - now part of the top header */}

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto bg-slate-50/50 scroll-smooth">
              {messages.length === 0 && !isLoading ? (
                // Centered Welcome State
                <div className="min-h-full flex flex-col items-center justify-center p-4">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className="w-full max-w-2xl text-center space-y-8"
                  >
                    <div>
                      <div className="w-16 h-16 bg-linear-to-tr from-[#0A6ED1] to-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-200">
                         <MessageCircle size={32} className="text-white" />
                      </div>
                      <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">How can I help you today?</h2>
                      <p className="text-slate-500 max-w-md mx-auto">
                         I'm your AI health assistant. Ask me about symptoms, healthy habits, nutrition, or general medical questions.
                      </p>
                    </div>

                    {/* Input Field (Centered) */}
                    <form onSubmit={handleSendMessage} className="relative w-full shadow-xl shadow-blue-100/50 rounded-2xl overflow-hidden bg-white border border-slate-200 hover:border-blue-300 transition-colors">
                        <input
                            ref={inputRef}
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type your health question..."
                            disabled={isLoading}
                            className="w-full px-6 py-4 pr-16 text-lg placeholder:text-slate-400 focus:outline-none"
                            autoFocus
                        />
                        <button
                            type="submit"
                            disabled={isLoading || !input.trim()}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-[#0A6ED1] text-white rounded-xl hover:bg-[#095bb0] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            <Send size={20} />
                        </button>
                    </form>

                    {/* Quick Suggestions */}
                    <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4">
                      {[
                        'How can I improve my sleep quality?',
                        'What are good exercises for beginners?',
                        'Nutrition tips for energy',
                        'Stress management techniques'
                      ].map((suggestion, i) => (
                        <button
                          key={i}
                          onClick={() => {
                            setInput(suggestion);
                            // handleSendMessage(suggestion); // Ideally trigger send immediately or fill input
                            if (inputRef.current) {
                                inputRef.current.value = suggestion;
                                inputRef.current.focus();
                                setInput(suggestion);
                            }
                          }}
                          className="text-left p-4 rounded-xl border border-slate-200 bg-white hover:border-[#0A6ED1]/50 hover:bg-blue-50/50 hover:shadow-sm transition-all text-sm font-medium text-slate-600 group"
                        >
                          <span className="flex items-center justify-between w-full">
                              {suggestion}
                              <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all text-[#0A6ED1]" />
                          </span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                </div>
              ) : (
                // Active Chat Messages
                <div className="p-4 md:p-6 pb-24 max-w-4xl mx-auto w-full space-y-6">
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex max-w-[85%] md:max-w-[75%] gap-3 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                              message.role === 'user' ? 'bg-[#0A6ED1] text-white' : 'bg-white border border-slate-200 text-[#0A6ED1]'
                          }`}>
                              {message.role === 'user' ? <UserIcon size={16} /> : <MessageCircle size={16} />}
                          </div>
                          
                          <div className={`p-4 rounded-2xl shadow-sm text-[15px] leading-relaxed ${
                            message.role === 'user'
                              ? 'bg-[#0A6ED1] text-white rounded-tr-none'
                              : 'bg-white text-slate-800 border border-slate-100 rounded-tl-none'
                          }`}>
                            <p className="whitespace-pre-wrap">{message.content}</p>
                            <span className={`text-[10px] block mt-2 opacity-70 ${
                              message.role === 'user' ? 'text-blue-100 text-right' : 'text-slate-400'
                            }`}>
                              {formatTime(message.timestamp)}
                            </span>
                          </div>
                      </div>
                    </motion.div>
                  ))}

                  {isLoading && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex justify-start w-full"
                    >
                        <div className="flex items-center gap-3">
                             <div className="w-8 h-8 bg-white border border-slate-200 rounded-full flex items-center justify-center text-[#0A6ED1]">
                                <MessageCircle size={16} />
                             </div>
                             <div className="bg-white border border-slate-200 px-4 py-3 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-1.5">
                                <div className="w-1.5 h-1.5 bg-[#0A6ED1] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                <div className="w-1.5 h-1.5 bg-[#0A6ED1] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                <div className="w-1.5 h-1.5 bg-[#0A6ED1] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                             </div>
                        </div>
                    </motion.div>
                  )}
                  <div ref={messagesEndRef} className="h-4" />
                </div>
              )}
            </div>

            {/* Fixed Input Area (Only visible when chat has started) */}
            <AnimatePresence>
                {messages.length > 0 && (
                    <motion.div 
                        initial={{ y: 100 }}
                        animate={{ y: 0 }}
                        exit={{ y: 100 }}
                        className="bg-white border-t border-slate-200 p-4 md:p-6 z-20"
                    >
                    <div className="max-w-4xl mx-auto relative">
                        <form onSubmit={handleSendMessage} className="relative flex items-center gap-2">
                        <input
                            ref={inputRef}
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask a follow-up question..."
                            disabled={isLoading}
                            className="flex-1 pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#0A6ED1]/20 focus:border-[#0A6ED1] outline-none transition-all disabled:opacity-50 text-slate-800"
                            autoFocus
                        />
                        <button
                            type="submit"
                            disabled={isLoading || !input.trim()}
                            className="absolute right-2 p-2 bg-[#0A6ED1] text-white rounded-lg hover:bg-[#095bb0] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            <Send size={18} />
                        </button>
                        </form>
                        <p className="text-center text-xs text-slate-400 mt-2">
                            AI responses may vary. Always consult with a verified medical professional.
                        </p>
                    </div>
                    </motion.div>
                )}
            </AnimatePresence>
          </div>
        </div>
      </main>
      
      {/* Footer removed for cleaner chat experience */}
      {/* <PatientMobileFooter /> */}
    </div>
  );
}

// Helper component for user icon if not imported
function UserIcon({ size }: { size: number }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
        </svg>
    )
}
