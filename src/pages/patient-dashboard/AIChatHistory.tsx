import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Clock3, MessageCircle } from "lucide-react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useAuth } from "../../context/AuthContext";

interface ChatHistoryItem {
  id: string;
  title: string;
  lastUpdated: Date | number | null;
}

const PLACEHOLDER_CHAT_ID = "placeholder-prev-chat";

export default function AIChatHistory() {
  const { currentUser } = useAuth();
  const [history, setHistory] = useState<ChatHistoryItem[]>([]);

  useEffect(() => {
    if (!currentUser) {
      return;
    }

    const q = query(
      collection(db, "patients", currentUser.uid, "aiConversations"),
      orderBy("lastUpdated", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const rows = snapshot.docs.map((conversationDoc) => ({
        id: conversationDoc.id,
        title: conversationDoc.data().title || "New Consultation",
        lastUpdated: conversationDoc.data().lastUpdated
      } as ChatHistoryItem));

      setHistory(rows);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const formatLastUpdated = (dateInput: unknown) => {
    if (!dateInput) return "Recent";

    const date =
      typeof dateInput === "object" && dateInput !== null && "toDate" in dateInput
        ? (dateInput as { toDate: () => Date }).toDate()
        : new Date(dateInput as string | number | Date);

    return date.toLocaleString([], {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Previous Chat History</h1>
            <p className="text-slate-500 mt-1">View your previous AI chatbot conversations.</p>
          </div>
          <Link
            to="/patient/ai-chat"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-medium hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft size={16} />
            Back to AI Chat
          </Link>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-100">
          {history.map((item) => (
            <Link
              key={item.id}
              to={`/patient/ai-chat?chatId=${item.id}`}
              className="block p-5 hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <MessageCircle size={18} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-slate-900 truncate">{item.title}</h3>
                    <p className="text-sm text-slate-600 mt-1 truncate">Tap to open this conversation</p>
                  </div>
                </div>
                <div className="text-xs text-slate-500 inline-flex items-center gap-1 shrink-0">
                  <Clock3 size={14} />
                  <span>{formatLastUpdated(item.lastUpdated)}</span>
                </div>
              </div>
            </Link>
          ))}

          {history.length === 0 && (
            <Link
              to={`/patient/ai-chat?chatId=${PLACEHOLDER_CHAT_ID}`}
              className="block p-5 hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <MessageCircle size={18} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-slate-900 truncate">Previous AI Conversation</h3>
                    <p className="text-sm text-slate-600 mt-1 truncate">Tap to open</p>
                  </div>
                </div>
                <div className="text-xs text-slate-500 inline-flex items-center gap-1 shrink-0">
                  <Clock3 size={14} />
                  <span>Recent</span>
                </div>
              </div>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
