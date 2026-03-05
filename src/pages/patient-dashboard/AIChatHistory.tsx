import { Link } from "react-router-dom";
import { ArrowLeft, Clock3, MessageCircle } from "lucide-react";

const historyPlaceholders = [
  {
    id: "[Chat ID]",
    title: "[Chat Title Placeholder]",
    preview: "[Chat preview placeholder text for previous conversation]",
    lastUpdated: "[Last Updated Placeholder]"
  },
  {
    id: "[Chat ID]",
    title: "[Chat Title Placeholder]",
    preview: "[Chat preview placeholder text for previous conversation]",
    lastUpdated: "[Last Updated Placeholder]"
  },
  {
    id: "[Chat ID]",
    title: "[Chat Title Placeholder]",
    preview: "[Chat preview placeholder text for previous conversation]",
    lastUpdated: "[Last Updated Placeholder]"
  }
];

export default function AIChatHistory() {
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
          {historyPlaceholders.map((item, index) => (
            <div key={`${item.id}-${index}`} className="p-5 hover:bg-slate-50 transition-colors">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <MessageCircle size={18} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-slate-900 truncate">{item.title}</h3>
                    <p className="text-sm text-slate-600 mt-1 truncate">{item.preview}</p>
                  </div>
                </div>
                <div className="text-xs text-slate-500 inline-flex items-center gap-1 shrink-0">
                  <Clock3 size={14} />
                  <span>{item.lastUpdated}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
