const fs = require('fs');
let file = 'src/pages/doctor-dashboard/PatientDetails.tsx';
let content = fs.readFileSync(file, 'utf8');

// The marker: search specifically for the one rendering the main div
const startIdx = content.indexOf(`{activeTab === 'ai-assistant' && (` , content.lastIndexOf('</button>'));

// Find the last </AnimatePresence> wrapping the tabs
const animatePresenceIdx = content.lastIndexOf("</AnimatePresence>");
const endIdx = content.lastIndexOf(")}", animatePresenceIdx); // the last )} before </AnimatePresence>

if (startIdx !== -1 && endIdx !== -1) {
    const before = content.substring(0, startIdx);
    const after = content.substring(endIdx + 2); // skip )} 
    
    const newUI = `{activeTab === 'ai-assistant' && (
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
                        <p className="text-slate-600"><strong>General Summary:</strong> The patient has consulted with the AI Assistant regarding their recent continuous symptoms. A summarized analytical report indicates routine monitoring is recommended. No emergency condition detected.</p>
                    </div>
                </motion.div>
              )}`;
              
    let newContent = before + newUI + after;
    
    newContent = newContent.replace(/const sessionMessages = MOCK_MESSAGES_DATA\[activeSessionId\] \|\| \[\];/, 'const sessionMessages = [];');
    newContent = newContent.replace(/setChatSessions\(MOCK_SESSIONS_DATA\);/g, 'setChatSessions([]);');

    fs.writeFileSync(file, newContent);
    console.log("Patched beautifully");
} else {
    console.log("Could not find boundaries");
}
