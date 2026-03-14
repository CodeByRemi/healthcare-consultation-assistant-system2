const fs = require('fs');

function patch() {
    let file = 'src/pages/doctor-dashboard/PatientDetails.tsx';
    let content = fs.readFileSync(file, 'utf8');

    // Nuke the MOCK_MESSAGES_DATA and MOCK_SESSIONS_DATA entirely
    content = content.replace(/const MOCK_MESSAGES_DATA: Record<string, Message\[\]> = \{[\s\S]*?\]\r?\n  \};\r?\n\r?\n/, '');
    
    // Nuke MOCK_SESSIONS_DATA
    content = content.replace(/const MOCK_SESSIONS_DATA: ChatSession\[\] = \[[\s\S]*?\];\r?\n/, '');

    // Replace the AI tab ui
    const uiMatch = content.match(/\{activeTab === 'ai-assistant' && \([\s\S]*?\}\)/);
    if(uiMatch) {
        
        const newAIUI = `{activeTab === 'ai-assistant' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col p-6 space-y-4"
                >
                    <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                        <h2 className="text-xl font-bold text-slate-800">AI Consultation Analysis</h2>
                    </div>
                    <div>
                        <p className="text-slate-600 mb-2"><strong>Status:</strong> Awaiting full AI session integration.</p>
                        <p className="text-slate-600"><strong>General Summary:</strong> The patient has consulted with the AI Assistant regarding their recent continuous symptoms. Routine monitoring is recommended.</p>
                    </div>
                </motion.div>
            )}`;

        content = content.replace(uiMatch[0], newAIUI);
        
        // Also remove the `setMessages` and mock session loading logic
        content = content.replace(/setChatSessions\(MOCK_SESSIONS_DATA\);/g, 'setChatSessions([]);');
        content = content.replace(/const sessionMessages = MOCK_MESSAGES_DATA\[activeSessionId\] \|\| \[\];/, 'const sessionMessages = [];');
        
        fs.writeFileSync(file, content);
        console.log("Patched PatientDetails AI UI fully.");
    } else {
        console.log("Could not find ai-assistant block.");
    }
}

patch();
