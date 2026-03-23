const fs = require('fs');

let content = fs.readFileSync('src/pages/doctor-dashboard/PatientDetails.tsx', 'utf8');

if (!content.includes('import { db, model }')) {
  content = content.replace('import { db } from "../../lib/firebase";', 'import { db, model } from "../../lib/firebase";');
}

// Add state variables
if (!content.includes('const [aiSummary, setAiSummary]')) {
  content = content.replace('const [loadingMessages, setLoadingMessages] = useState(false);', 
    'const [loadingMessages, setLoadingMessages] = useState(false);\n  const [aiSummary, setAiSummary] = useState<string | null>(null);\n  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);'
  );
}

// Update the fetchMessages useEffect to include the logic that checks and generates summary.
// We need to look for where setMessages(loadedMessages) is called.
const messagesSetStr = 'setMessages(loadedMessages);';
if (content.includes(messagesSetStr) && !content.includes('generateContent(prompt)')) {
  const replaceStr = `setMessages(loadedMessages);

              // AI Summary Logic
              setAiSummary(null);
              const activeSessionDoc = await getDoc(doc(db, "patients", id, "aiConversations", activeSessionId));
              if (activeSessionDoc.exists()) {
                const sessionData = activeSessionDoc.data();
                if (sessionData.summary) {
                  setAiSummary(sessionData.summary);
                } else if (loadedMessages.length > 0) {
                  // Generate summary
                  setIsGeneratingSummary(true);
                  try {
                    const prompt = "Please provide a brief, professional summary of the patient's symptoms and the AI's advice based on this conversation:\\n" + loadedMessages.map(m => m.sender + ": " + m.text).join("\\n");
                    const result = await model.generateContent(prompt);
                    const generatedText = await result.response.text();
                    
                    setAiSummary(generatedText);
                    
                    // Save to Firestore
                    await updateDoc(doc(db, "patients", id, "aiConversations", activeSessionId), {
                      summary: generatedText
                    });
                  } catch (e) {
                    console.error("Failed to generate AI summary", e);
                  } finally {
                    setIsGeneratingSummary(false);
                  }
                }
              }`;
  content = content.replace(messagesSetStr, replaceStr);
}

// Replace UI Placeholder
const placeholderStart = `<div className="text-sm text-slate-600 leading-relaxed space-y-2">`;
const newPlaceholderStr = `<div className="text-sm text-slate-600 leading-relaxed space-y-2">
                                                          {isGeneratingSummary ? (
                                                            <div className="flex items-center gap-2 text-slate-500">
                                                              <div className="w-4 h-4 rounded-full border-2 border-blue-600 border-t-transparent animate-spin"></div>
                                                              <span>Generating summary...</span>
                                                            </div>
                                                          ) : (
                                                            <ReactMarkdown className="prose prose-sm prose-slate max-w-none">{aiSummary || "No summary available."}</ReactMarkdown>
                                                          )}
                                                      </div>`;

const searchRegex = /<div className="text-sm text-slate-600 leading-relaxed space-y-2">[\s\S]*?<\/div>/;
if (content.match(searchRegex) && !content.includes('isGeneratingSummary ? (')) {
    content = content.replace(searchRegex, newPlaceholderStr);
}


fs.writeFileSync('src/pages/doctor-dashboard/PatientDetails.tsx', content);
console.log('patched PatientDetails.tsx');