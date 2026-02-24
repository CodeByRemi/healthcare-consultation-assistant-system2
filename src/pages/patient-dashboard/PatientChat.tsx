import { useState, useRef, useEffect } from "react";
import { FaPaperPlane, FaRobot } from "react-icons/fa";
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
      id: messages.length + 1,
      text: input,
      sender: "user",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      const aiResponses = [
        "I understand. Could you tell me more about your symptoms?",
        "That sounds like it could be related to stress. Have you been sleeping well?",
        "I recommend booking an appointment with a specialist for a check-up.",
        "Please make sure to stay hydrated and rest.",
        "Is there anything else you'd like to ask?",
        "Based on what you're saying, a general physician would be a good start."
      ];
      const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];

      const aiMessage: Message = {
        id: messages.length + 2,
        text: randomResponse,
        sender: "ai",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex bg-slate-50">
      <PatientSidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
      
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <PatientDashboardHeader 
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
        />
        
        <div className="flex-1 overflow-hidden flex flex-col p-4 md:p-6 max-w-5xl mx-auto w-full">
            <header className="mb-4">
                <h1 className="text-2xl md:text-3xl font-['Newsreader'] font-medium text-slate-900 flex items-center gap-2">
                  <span className="bg-[#0A6ED1]/10 p-2 rounded-lg text-[#0A6ED1]"><FaRobot /></span>
                  AI Health Assistant
                </h1>
                <p className="text-slate-500 text-sm ml-12">
                  Ask me anything about your health or symptoms.
                </p>
            </header>

            {/* Chat Area */}
            <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
                <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 bg-slate-50/50">
                    <AnimatePresence>
                        {messages.map((msg) => (
                            <motion.div 
                                key={msg.id}
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                transition={{ duration: 0.2 }}
                                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                            >
                                <div className={`max-w-[80%] md:max-w-[70%] rounded-2xl px-5 py-3 shadow-sm ${
                                    msg.sender === "user" 
                                    ? "bg-[#0A6ED1] text-white rounded-br-none" 
                                    : "bg-white border border-slate-100 text-slate-700 rounded-bl-none"
                                }`}>
                                    <p className="leading-relaxed">{msg.text}</p>
                                    <span className={`text-[10px] block mt-1 opacity-70 ${msg.sender === "user" ? "text-blue-100" : "text-slate-400"}`}>
                                        {msg.timestamp}
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                        
                        {isTyping && (
                            <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex justify-start"
                            >
                                <div className="bg-white border border-slate-100 rounded-2xl rounded-bl-none px-5 py-4 shadow-sm flex gap-1">
                                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
                                </div>
                            </motion.div>
                        )}
                        <div ref={messagesEndRef} />
                    </AnimatePresence>
                </div>

                <div className="p-4 bg-white border-t border-slate-100">
                    <form onSubmit={handleSend} className="relative flex items-center gap-2">
                        <input 
                            type="text" 
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type your message..."
                            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-[#0A6ED1]/20 focus:border-[#0A6ED1] transition-all"
                        />
                        <button 
                            type="submit"
                            disabled={!input.trim() || isTyping}
                            className="absolute right-2 p-2 bg-[#0A6ED1] text-white rounded-lg hover:bg-[#095bb0] disabled:opacity-50 disabled:hover:bg-[#0A6ED1] transition-colors"
                        >
                            <FaPaperPlane className="w-4 h-4" />
                        </button>
                    </form>
                    <p className="text-center text-[10px] text-slate-400 mt-2">
                        AI can update errors. Verify important information with a doctor.
                    </p>
                </div>
            </div>
        </div>
        <PatientMobileFooter />
      </main>
    </div>
  );
}
