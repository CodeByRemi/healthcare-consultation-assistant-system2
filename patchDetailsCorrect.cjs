const fs = require('fs');

function patch() {
    let file = 'src/pages/doctor-dashboard/PatientDetails.tsx';
    let content = fs.readFileSync(file, 'utf8');

    // Nuke mock data
    content = content.replace(/const MOCK_MESSAGES_DATA[\s\S]*?\]\r?\n  \};\r?\n/, '');
    content = content.replace(/const MOCK_SESSIONS_DATA[\s\S]*?\];\r?\n/, '');

    const startMarker = "{activeTab === 'ai-assistant' && (";
    const startIndex = content.indexOf(startMarker);
    if (startIndex === -1) {
        console.log("Could not find start marker");
        return;
    }
    
    // find the closing motion.div for the tab by searching for </motion.div> after startIndex
    const endStr = "</motion.div>";
    const endIndex = content.indexOf(endStr, startIndex);
    
    if (endIndex === -1) {
         console.log("Could not find end marker");
         return;
    }
    
    // but wait! there might be multiple motion.divs inside the ai-assistant tab.
    // Let's just look at characters after startIndex
    // Let's just replace from `{activeTab === 'ai-assistant' && (` until `</AnimatePresence>`
    
    const beforeStr = content.substring(0, startIndex);
    const animatePresenceIndex = content.indexOf("</AnimatePresence>", startIndex);
    
    if (animatePresenceIndex === -1) {
        console.log("Could not find </AnimatePresence>");
        return;
    }
    
    const afterStr = content.substring(animatePresenceIndex);
    
    const newUI = `{activeTab === 'ai-assistant' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.99 }}
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
            )}
            `;
            
    content = beforeStr + newUI + afterStr;
    
    // Remove setMessages
        content = content.replace(/setChatSessions\(MOCK_SESSIONS_DATA\);/g, 'setChatSessions([]);');
        content = content.replace(/const sessionMessages = MOCK_MESSAGES_DATA\[activeSessionId\] \|\| \[\];/, 'const sessionMessages = [];');

    
    fs.writeFileSync(file, content);
    console.log("Patched beautifully");
}

patch();
