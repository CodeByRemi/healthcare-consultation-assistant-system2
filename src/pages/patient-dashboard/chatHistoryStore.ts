export interface AIMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface AIChatSession {
  id: string;
  title: string;
  messages: AIMessage[];
  lastUpdated: string;
  isPinned: boolean;
}

const CHAT_HISTORY_STORAGE_KEY = "patientAiChatHistory";

export const loadAIChatHistory = (): AIChatSession[] => {
  try {
    const rawData = localStorage.getItem(CHAT_HISTORY_STORAGE_KEY);

    if (!rawData) {
      return [];
    }

    const parsed = JSON.parse(rawData) as AIChatSession[];
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed;
  } catch {
    return [];
  }
};

export const saveAIChatHistory = (history: AIChatSession[]) => {
  localStorage.setItem(CHAT_HISTORY_STORAGE_KEY, JSON.stringify(history));
};
