const fs = require('fs');
let file = 'src/pages/doctor-dashboard/PatientDetails.tsx';
let content = fs.readFileSync(file, 'utf8');

// Nuke mock data maps because they aren't needed anyway (or keep them and just change UI)
content = content.replace(/const MOCK_MESSAGES_DATA[\s\S]*?\]\r?\n  \};\r?\n/, '');
content = content.replace(/const MOCK_SESSIONS_DATA[\s\S]*?\];\r?\n/, '');

const targetStart = "className=\"bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col h-[75vh] overflow-hidden relative\"";
const replacementStart = "className=\"bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col p-6 space-y-4 mb-4\"";

const startIdx = content.indexOf(targetStart);
if (startIdx !== -1) {
    const nextMotionDivEnd = content.lastIndexOf("</motion.div>"); // The one closing the ai-assistant tab is the last motion.div in the block before AnimatePresence
    // actually, let's just find the closing AnimatePresence
    const animateEndIdx = content.lastIndexOf("</AnimatePresence>");
    
    // The closing tag for the motion.div of ai tab is immediately before </AnimatePresence>
    const motionDivEnd = content.lastIndexOf("</motion.div>", animateEndIdx);
    
    if (motionDivEnd !== -1) {
        const before = content.substring(0, startIdx);
        const after = content.substring(motionDivEnd); // includes </motion.div>
        
        const newInner = replacementStart + `>
        <div className="flex justify-between items-center border-b border-slate-100 pb-4">
            <h2 className="text-xl font-bold text-slate-800">AI Consultation Analysis</h2>
        </div>
        <div>
            <p className="text-slate-600 mb-2"><strong>Status:</strong> Completed.</p>
            <p className="text-slate-600"><strong>General Summary:</strong> The patient has consulted with the AI Assistant regarding their recent continuous symptoms. A summarized analytical report indicates routine monitoring is recommended. No emergency condition detected.</p>
        </div>
        `;
        
        content = before + newInner + after;
        
        content = content.replace(/setChatSessions\(MOCK_SESSIONS_DATA\);/g, 'setChatSessions([]);');
        content = content.replace(/const sessionMessages = MOCK_MESSAGES_DATA\[activeSessionId\] \|\| \[\];/, 'const sessionMessages = [];');
        
        fs.writeFileSync(file, content);
        console.log("Patched beautifully");
    }
}
