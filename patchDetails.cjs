const fs = require('fs');

function patch() {
    let file = 'src/pages/doctor-dashboard/PatientDetails.tsx';
    let content = fs.readFileSync(file, 'utf8');

    // Nuke the MOCK_MESSAGES_DATA entirely
    content = content.replace(/const MOCK_MESSAGES_DATA[\s\S]*?\]\r?\n  \};\r?\n\r?\n/, '');

    // Replace the chat UI in the tab panel
    // Find where the `activeTab === "ai"` is handled
    
    const uiMatch = content.match(/\{\/\* AI Tab \*\/\}\r?\n\s+\{activeTab === "ai" && \([\s\S]*?\{\/\* End AI Tab \*\/\}/);
    if(uiMatch) {
        
        const newAIUI = `{/* AI Tab */}
            {activeTab === "ai" && (
                <div className="bg-white rounded-2xl border border-slate-200">
                    <div className="p-6 border-b border-slate-200 flex justify-between items-center">
                        <h2 className="text-xl font-bold text-slate-900">AI Consultation Analysis</h2>
                    </div>
                    <div className="p-6 text-slate-700 space-y-4">
                        <p><strong>Status:</strong> Awaiting full AI session integration.</p>
                        <p><strong>General Summary:</strong> The patient has consulted with the AI Assistant regarding their recent continuous symptoms. Routine monitoring is recommended.</p>
                    </div>
                </div>
            )}
            {/* End AI Tab */}`;

        content = content.replace(uiMatch[0], newAIUI);
        
        // Also remove the `setMessages` logic which depends on MOCK_MESSAGES_DATA
        content = content.replace(/const sessionMessages = MOCK_MESSAGES_DATA\[activeSessionId\] \|\| \[\];/, 'const sessionMessages = [];');
        
        fs.writeFileSync(file, content);
        console.log("Patched PatientDetails AI UI");
    } else {
        console.log("Could not find AI Tab block");
    }
}

patch();
