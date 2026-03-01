import { useState, useRef, useEffect, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import { Link } from "react-router-dom";
import { FaPaperPlane, FaRobot, FaUser, FaPlus, FaHistory, FaArrowRight } from "react-icons/fa";
import { model, db } from "../../lib/firebase";
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, getDoc, doc, getDocs, writeBatch, limit } from "firebase/firestore";
import { useAuth } from "../../context/AuthContext";
import PatientSidebar from "./components/PatientSidebar";
import PatientDashboardHeader from "./components/PatientDashboardHeader";
import PatientMobileFooter from "./components/PatientMobileFooter";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: string | Date;
}

interface ChatSession {
  id: string;
  title: string;
  date: string;
  preview: string;
  updatedAt: string | Date;
}

export default function PatientChat() {
  const { currentUser } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Chat History Sidebar State
  const [showHistory, setShowHistory] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);

  const toggleHistory = () => {
    setShowHistory(!showHistory);
  };

  // 1. Load chat sessions list + Migration Logic
  useEffect(() => {
    if (!currentUser) return;

    const q = query(
      collection(db, "patients", currentUser.uid, "chatSessions"), 
      orderBy("updatedAt", "desc")
    );

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const sessions = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            title: data.title || "New Consultation",
            date: data.updatedAt?.toDate().toLocaleDateString() || "Just now",
            preview: data.lastMessage || "No messages yet",
            updatedAt: data.updatedAt
          } as ChatSession;
      });
      
      setChatHistory(sessions);
      
      // MIGRATION CHECK:
      if (sessions.length === 0) {
          const oldChatsRef = collection(db, "patients", currentUser.uid, "chats");
          const oldChatsSnap = await getDocs(query(oldChatsRef, limit(1)));
          
          if (!oldChatsSnap.empty) {
             await migrateOldChats(currentUser.uid);
          }
      }
    });

    return () => unsubscribe();
  }, [currentUser]);

  const migrateOldChats = async (uid: string) => {
      console.log("Migrating old chats...");
      try {
        // Fetch all old messages
        const oldChatsRef = collection(db, "patients", uid, "chats");
        const allOldChatsSnap = await getDocs(query(oldChatsRef, orderBy("timestamp", "asc")));
        
        if (allOldChatsSnap.empty) return;

        const messages = allOldChatsSnap.docs.map(d => d.data());
        const lastMsg = messages[messages.length - 1];
        const preview = lastMsg.text?.slice(0, 40) + "..." || "Legacy chat";
        
        // Create new session
        const sessionRef = await addDoc(collection(db, "patients", uid, "chatSessions"), {
            title: "Previous Consultation",
            lastMessage: preview,
            createdAt: serverTimestamp(),
            updatedAt: lastMsg.timestamp || serverTimestamp()
        });

        let operationCount = 0;
        let currentBatch = writeBatch(db);

        for (const oldDoc of allOldChatsSnap.docs) {
            const newMsgRef = doc(collection(db, "patients", uid, "chatSessions", sessionRef.id, "messages"));
            currentBatch.set(newMsgRef, oldDoc.data());
            
            operationCount++;
            if (operationCount >= 450) {
                await currentBatch.commit();
                currentBatch = writeBatch(db);
                operationCount = 0;
            }
        }
        
        await currentBatch.commit();
        console.log("Migration complete");
        
        // Select the migrated session
        setActiveSessionId(sessionRef.id);
      } catch (e) {
          console.error("Migration failed", e);
      }
  };

  const loadWelcomeMessage = useCallback(async () => {
     if (!currentUser) return;
     try {
         const userDoc = await getDoc(doc(db, "patients", currentUser.uid));
         const userData = userDoc.data();
         const firstName = userData?.fullName?.split(' ')[0] || "there";
         
         setMessages([{
             id: "welcome",
             text: `Hello ${firstName}! I'm Medi, your personal AI health assistant. I'm here to listen and help you with any health questions or symptoms. How are you feeling today?`,
             sender: "ai",
             timestamp: new Date().toISOString()
         }]);
     } catch (error) {
         console.error("Error creating welcome message:", error);
     }
  }, [currentUser]);

  // 2. Load messages for Active Session
  useEffect(() => {
    if (!currentUser) return;
    
    // If no active session, show Welcome logic?
    if (!activeSessionId) {
       loadWelcomeMessage();
       return;
    }

    const q = query(
      collection(db, "patients", currentUser.uid, "chatSessions", activeSessionId, "messages"),
      orderBy("timestamp", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
        const msgs: Message[] = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as Message));
        setMessages(msgs);
    });

    return () => unsubscribe();
  }, [currentUser, activeSessionId, loadWelcomeMessage]);

  
  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);


  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !currentUser) return;

    const userText = input;
    setInput("");
    setIsTyping(true);
    
    let currentSessionId = activeSessionId;

    try {
      // If no session, create one
      if (!currentSessionId) {
          const sessionRef = await addDoc(collection(db, "patients", currentUser.uid, "chatSessions"), {
              title: userText.length > 30 ? userText.slice(0, 30) + "..." : userText,
              lastMessage: userText,
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp()
          });
          currentSessionId = sessionRef.id;
          setActiveSessionId(currentSessionId);
      }

      // Save User Message
      await addDoc(collection(db, "patients", currentUser.uid, "chatSessions", currentSessionId, "messages"), {
        text: userText,
        sender: "user",
        timestamp: serverTimestamp()
      });

      // Generate AI Response
      const result = await model.generateContent(userText);
      const response = await result.response;
      let text = response.text();

      // Format Buttons
      text = text.replace(
        /\[BUTTON: (.*?) \| (.*?)\]/g, 
        (_, label, path) => `[ACTION:${label}](${path})`
      );
      
      // Save AI Response
      await addDoc(collection(db, "patients", currentUser.uid, "chatSessions", currentSessionId, "messages"), {
        text: text,
        sender: "ai",
        timestamp: serverTimestamp()
      });

    } catch (error) {
      console.error("AI Error:", error);
      const errorMessage = "I apologize, but I'm having trouble connecting right now.";
       if (currentSessionId) {
        await addDoc(collection(db, "patients", currentUser.uid, "chatSessions", currentSessionId, "messages"), {
            text: errorMessage,
            sender: "ai",
            timestamp: serverTimestamp()
        });
       }
    } finally {
      setIsTyping(false);
    }
  };

  const startNewChat = () => {
    setActiveSessionId(null);
    setShowHistory(false);
  };

  const selectSession = (sessionId: string) => {
      setActiveSessionId(sessionId);
      setShowHistory(false);
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
                z-30 h-full bg-white border-r border-slate-100 transition-all duration-300 ease-in-out flex flex-col shadow-xl absolute md:relative
                ${showHistory ? 'w-80 translate-x-0' : 'w-0 -translate-x-full overflow-hidden opacity-0 md:w-0 md:opacity-0'}
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
                        <p className="px-2 text-xs font-bold text-slate-400 uppercase tracking-wider">Previous Consultations</p>
                        {chatHistory.length === 0 && (
                            <p className="text-xs text-slate-400 px-2 italic">No previous consultations found.</p>
                        )}
                        {chatHistory.map(chat => (
                            <button 
                                key={chat.id} 
                                onClick={() => selectSession(chat.id)}
                                className={`w-full text-left p-4 rounded-xl border transition-all group relative shadow-sm ${
                                    activeSessionId === chat.id 
                                    ? "bg-blue-50 border-blue-200 ring-1 ring-blue-100" 
                                    : "bg-white border-slate-100 hover:border-[#0A6ED1]/30 hover:bg-slate-50"
                                }`}
                            >
                                <div className="flex justify-between items-start mb-1">
                                    <h3 className={`font-semibold text-sm truncate flex-1 pr-2 transition-colors ${
                                        activeSessionId === chat.id ? "text-[#0A6ED1]" : "text-slate-700 group-hover:text-[#0A6ED1]"
                                    }`}>{chat.title}</h3>
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
                                <div className={`shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center shadow-sm ${
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
                                            <ReactMarkdown
                                                components={{
                                                    a: ({href, children, ...props}) => {
                                                        const isAction = typeof children === 'string' && children.startsWith('ACTION:');
                                                        if (isAction && href) {
                                                            const label = (children as string).replace('ACTION:', '').trim();
                                                            return (
                                                                <Link 
                                                                    to={href}
                                                                    className="inline-flex items-center gap-2 px-4 py-2 mt-2 bg-[#0A6ED1] text-white rounded-lg text-sm font-medium hover:bg-[#095bb0] transition-colors no-underline"
                                                                >
                                                                    {label} <FaArrowRight className="text-xs" />
                                                                </Link>
                                                            );
                                                        }
                                                        return <a href={href} target="_blank" rel="noopener noreferrer" className="text-[#0A6ED1] hover:underline" {...props}>{children}</a>;
                                                    },
                                                    ul: ({...props}) => <ul className="list-disc pl-4 my-2 text-slate-700" {...props} />,
                                                    ol: ({...props}) => <ol className="list-decimal pl-4 my-2 text-slate-700" {...props} />,
                                                    li: ({...props}) => <li className="my-1" {...props} />,
                                                    p: ({...props}) => <p className="mb-2 last:mb-0" {...props} />,
                                                    strong: ({...props}) => <strong className="font-semibold text-slate-900" {...props} />,
                                                }}
                                            >
                                                {msg.text}
                                            </ReactMarkdown>
                                        </div>
                                    </div>
                                    <span className="text-[10px] text-slate-400 mt-1 px-1">
                                        {(() => {
                                            if (!msg.timestamp) return "Sending...";
                                            if (typeof msg.timestamp === 'string') {
                                                return new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                                            }
                                            if (msg.timestamp instanceof Date) {
                                                return msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                                            }
                                            return "";
                                        })()}
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
                                <FaPaperPlane className="w-4 h-4 -translate-x-px translate-y-px" />
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