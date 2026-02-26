import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { FaPaperPlane, FaRobot, FaUser, FaPlus, FaHistory } from "react-icons/fa";
import { model } from "../../lib/firebase";
import PatientSidebar from "./components/PatientSidebar";
import PatientDashboardHeader from "./components/PatientDashboardHeader";
import PatientMobileFooter from "./components/PatientMobileFooter";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  id: number;
  text: string;
  sender: "user" | "ai";
  timestamp: string;
}

interface ChatSession {
  id: string;
  title: string;
  date: string;
  preview: string;
}

export default function PatientChat() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I'm your AI health assistant. How can I help you today?",
      sender: "ai",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Chat History Sidebar State
  const [showHistory, setShowHistory] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatSession[]>([]);

  // Handle sidebar toggling
  useEffect(() => {
    if (showHistory) {
      setIsSidebarOpen(false);
    }
  }, [showHistory]);

  const toggleHistory = () => {
    if (!showHistory) {
        setIsSidebarOpen(false); // Close main sidebar when opening history
    }
    setShowHistory(!showHistory);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      text: input,
      sender: "user",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      const result = await model.generateContent(input);
      const response = result.response;
      const text = response.text();
      
      const aiMessage: Message = {
        id: Date.now() + 1,
        text: text,
        sender: "ai",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error("AI Error:", error);
      const errorMessage: Message = {
        id: Date.now() + 1,
        text: "I apologize, but I'm having trouble connecting right now. Please try again later.",
        sender: "ai",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const startNewChat = () => {
    if (messages.length > 1) {
       // Save current chat to history before resetting
       const titleText = messages[1]?.text || "New Consultation";
       const newSession: ChatSession = {
           id: Date.now().toString(),
           title: titleText.length > 30 ? titleText.slice(0, 30) + "..." : titleText,
           date: "Just now",
           preview: messages[messages.length - 1].text.length > 40 ? messages[messages.length - 1].text.slice(0, 40) + "..." : messages[messages.length - 1].text
       };
       setChatHistory(prev => [newSession, ...prev]);
    }
    
    setMessages([
      {
        id: Date.now(),
        text: "Hello! I'm your AI health assistant. How can I help you today?",
        sender: "ai",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    setShowHistory(false); // On mobile, close history
  };

  return (
    <div className="min-h-screen flex bg-[#f8fafc] font-sans">
      <PatientSidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
      
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <PatientDashboardHeader 
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
        />
        
        <div className="flex-1 flex overflow-hidden relative">
            {/* History Sidebar */}
            <div className={`
                z-30 h-full bg-white border-r border-slate-100 transition-all duration-300 ease-in-out flex flex-col shadow-xl
                ${showHistory ? 'w-80 translate-x-0' : 'w-0 -translate-x-full overflow-hidden opacity-0'}
            `}>
                <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <h2 className="font-semibold text-slate-800 flex items-center gap-2">
                        <FaHistory className="text-[#0A6ED1]" />
                        History
                    </h2>
                    <button 
                        onClick={() => setShowHistory(false)} 
                        className="p-2 hover:bg-slate-200 rounded-full text-slate-500 transition-colors"
                    >
                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    <button 
                        onClick={startNewChat}
                        className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-[#0A6ED1] text-white shadow-lg shadow-blue-200 hover:bg-[#095bb0] hover:shadow-blue-300 transition-all group font-medium"
                    >
                        <FaPlus className="text-sm group-hover:rotate-90 transition-transform duration-300" />
                        <span>New Consultation</span>
                    </button>

                    <div className="space-y-3">
                        <p className="px-2 text-xs font-bold text-slate-400 uppercase tracking-wider">Recent Consultations</p>
                        {chatHistory.map(chat => (
                            <button key={chat.id} className="w-full text-left p-4 rounded-xl border border-slate-100 hover:border-[#0A6ED1]/30 hover:bg-slate-50 transition-all group relative bg-white shadow-sm">
                                <div className="flex justify-between items-start mb-1">
                                    <h3 className="font-semibold text-slate-700 text-sm truncate flex-1 pr-2 group-hover:text-[#0A6ED1] transition-colors">{chat.title}</h3>
                                    <span className="text-[10px] text-slate-400 whitespace-nowrap bg-slate-100 px-2 py-0.5 rounded-full">{chat.date}</span>
                                </div>
                                <p className="text-xs text-slate-500 truncate mt-1 leading-relaxed opacity-80">{chat.preview}</p>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col bg-[#f8fafc] relative w-full transition-all duration-300">
                
                {/* Desktop History Toggle */}
                {!showHistory && (
                    <button 
                        onClick={toggleHistory}
                        className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-sm p-2.5 rounded-xl shadow-sm border border-slate-200 text-slate-600 hover:text-[#0A6ED1] hover:shadow-md transition-all flex items-center gap-2 group"
                    >
                        <FaHistory className="group-hover:scale-110 transition-transform" />
                        <span className="text-xs font-semibold">View History</span>
                    </button>
                )}

                {/* Messages Container */}
                <div className="flex-1 overflow-y-auto px-4 py-6 md:px-20 md:py-10 space-y-6 scroll-smooth">
                    <AnimatePresence initial={false}>
                        {messages.map((msg) => (
                            <motion.div 
                                key={msg.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, ease: "easeOut" }}
                                className={`flex gap-4 ${msg.sender === "user" ? "flex-row-reverse" : "flex-row"}`}
                            >
                                {/* Avatar */}
                                <div className={`flex-shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center shadow-sm ${
                                    msg.sender === "user" ? "bg-[#0A6ED1]" : "bg-emerald-500"
                                }`}>
                                    {msg.sender === "user" ? <FaUser className="text-white text-sm" /> : <FaRobot className="text-white text-lg" />}
                                </div>

                                {/* Bubble */}
                                <div className={`flex flex-col max-w-[80%] md:max-w-[70%] ${msg.sender === "user" ? "items-end" : "items-start"}`}>
                                    <div className={`px-5 py-3.5 rounded-2xl shadow-sm text-[15px] leading-relaxed relative group ${
                                        msg.sender === "user" 
                                        ? "bg-white text-slate-800 border border-slate-100 rounded-tr-none" 
                                        : "bg-white text-slate-800 border border-slate-100 rounded-tl-none"
                                    }`}>
                                        <div className="prose prose-sm max-w-none dark:prose-invert">
                                            <ReactMarkdown>{msg.text}</ReactMarkdown>
                                        </div>
                                    </div>
                                    <span className="text-[10px] text-slate-400 mt-1 px-1">
                                        {msg.timestamp}
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    
                    {/* Typing Indicator */}
                    {isTyping && (
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex gap-4"
                        >
                            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-emerald-500 flex items-center justify-center shadow-sm">
                                <FaRobot className="text-white text-lg" />
                            </div>
                            <div className="bg-white border border-slate-100 rounded-2xl rounded-tl-none px-5 py-4 shadow-sm flex items-center gap-1.5 h-12">
                                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"></span>
                            </div>
                        </motion.div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 md:p-6 bg-white border-t border-slate-100 shadow-[0_-5px_20px_-10px_rgba(0,0,0,0.05)] z-10">
                    <form onSubmit={handleSend} className="max-w-4xl mx-auto relative flex items-center gap-3">
                        <div className="relative flex-1">
                            <input 
                                type="text" 
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Describe your symptoms or ask a health question..."
                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 pr-14 focus:outline-none focus:ring-2 focus:ring-[#0A6ED1]/20 focus:border-[#0A6ED1] transition-all shadow-inner text-slate-700 placeholder:text-slate-400"
                            />
                            <button 
                                type="submit"
                                disabled={!input.trim() || isTyping}
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-[#0A6ED1] text-white rounded-xl hover:bg-[#095bb0] disabled:opacity-50 disabled:hover:bg-[#0A6ED1] transition-all shadow-md shadow-blue-200 hover:shadow-lg disabled:shadow-none"
                            >
                                <FaPaperPlane className="w-4 h-4 translate-x-[-1px] translate-y-[1px]" />
                            </button>
                        </div>
                    </form>
                    <p className="text-center text-[11px] text-slate-400 mt-3 font-medium">
                        AI can update errors. Always verify important medical information with a doctor.
                    </p>
                </div>
            </div>
        </div>
        <PatientMobileFooter />
      </main>
    </div>
  );
}
