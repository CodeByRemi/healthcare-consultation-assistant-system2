const fs = require('fs');
let file = 'src/pages/doctor-dashboard/PatientDetails.tsx';
let content = fs.readFileSync(file, 'utf8');

const regex = /{activeTab === 'ai-assistant' && \([\s\S]*?<\/motion\.div>\r?\n\s*\)}/s;

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

content = content.replace(regex, newUI);
fs.writeFileSync(file, content);
console.log("Patched Simple");
