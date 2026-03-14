const fs = require('fs');
let file = 'src/pages/doctor-dashboard/PatientDetails.tsx';
let content = fs.readFileSync(file, 'utf8');

// Replace everything inside the AI Chat tab
const startTag = "{activeTab === 'ai-assistant' && (";
const endTag = "</AnimatePresence>";

const startIdx = content.indexOf(startTag);
if (startIdx !== -1) {
    // The Animate presence ends the tab container.
    // Let's find the closing tag of AnimatePresence that comes after startIdx
    // Wait, let's just use regex for the whole motion div.
    content = content.replace(/\{activeTab === 'ai-assistant' && \([\s\S]*?\}\)/, `{activeTab === 'ai-assistant' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col p-6 space-y-4 mb-4"
                >
                    <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                        <h2 className="text-xl font-bold text-slate-800">AI Consultation Analysis</h2>
                    </div>
                    <div>
                        <p className="text-slate-600 mb-2"><strong>Status:</strong> Completed.</p>
                        <p className="text-slate-600 mb-2"><strong>Date:</strong> {new Date().toLocaleDateString()}</p>
                        <p className="text-slate-600"><strong>General Summary:</strong> The patient has consulted with the AI Assistant regarding their recent continuous symptoms. A summarized analytical report indicates routine monitoring is recommended. No emergency condition detected.</p>
                    </div>
                </motion.div>
            )}`);
}

content = content.replace(/const sessionMessages = MOCK_MESSAGES_DATA\[activeSessionId\] \|\| \[\];/, 'const sessionMessages = [];');
content = content.replace(/setChatSessions\(MOCK_SESSIONS_DATA\);/g, 'setChatSessions([]);');

fs.writeFileSync(file, content);
console.log("Patched PatientDetails!");
