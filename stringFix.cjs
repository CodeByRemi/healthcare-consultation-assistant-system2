const fs = require('fs');
let file = 'src/pages/doctor-dashboard/PatientDetails.tsx';
let content = fs.readFileSync(file, 'utf8');

// The tricky part is selecting the whole `ai-assistant` tab without messing up curly braces.
// Let's find exactly the line numbers of where it starts and ends.
const lines = content.split('\n');
let startLine = -1;
let endLine = -1;
let depth = 0;
let inTab = false;

for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes("{activeTab === 'ai-assistant' && (")) {
        startLine = i;
        inTab = true;
    }
    if (inTab) {
        // we count brackets
        let o = (lines[i].match(/\{/g) || []).length;
        let c = (lines[i].match(/\}/g) || []).length;
        depth += o;
        depth -= c;
        if (depth === 0 && lines[i].includes(")}")) {
            // this ends it maybe? Oh, actually let's just look for the last </motion.div> before </AnimatePresence>
        }
    }
    if (inTab && lines[i].includes("</AnimatePresence>")) {
        // The line BEFORE AnimatePresence is the end, which is `)}`
        endLine = i - 1; // actually we can just stop before AnimatePresence
        break;
    }
}

console.log("start:", startLine, "end:", endLine);

if (startLine !== -1 && endLine !== -1) {
    const newUI = `            {activeTab === 'ai-assistant' && (
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
    
    // replace between startLine and endLine
    // but wait, is `</AnimatePresence>` at `endLine + 1`? Let's check what's at endLine
    console.log("Ends at:", lines[endLine]);
    
    // We can swap the array out
    let newLines = [...lines.slice(0, startLine), newUI, ...lines.slice(endLine + 1)];
    
    let finalStr = newLines.join('\n');
    finalStr = finalStr.replace(/const sessionMessages = MOCK_MESSAGES_DATA\[activeSessionId\] \|\| \[\];/, 'const sessionMessages = [];');
    finalStr = finalStr.replace(/setChatSessions\(MOCK_SESSIONS_DATA\);/g, 'setChatSessions([]);');

    fs.writeFileSync(file, finalStr);
    console.log("Replaced block");
}

