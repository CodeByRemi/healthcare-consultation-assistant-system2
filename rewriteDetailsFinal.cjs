const fs = require('fs');
const fn = 'src/pages/doctor-dashboard/PatientDetails.tsx';
let txt = fs.readFileSync(fn, 'utf8');

txt = txt.replace('ratingSubmitted?: boolean;', 'ratingSubmitted?: boolean;\n  aiChatSummary?: string;\n  aiChatSummaryGeneratedAt?: string;');
txt = txt.replace('ratingSubmitted: Boolean(data.ratingSubmitted) };', 'ratingSubmitted: Boolean(data.ratingSubmitted), aiChatSummary: typeof data.aiChatSummary === "string" ? data.aiChatSummary : undefined, aiChatSummaryGeneratedAt: typeof data.aiChatSummaryGeneratedAt === "string" ? data.aiChatSummaryGeneratedAt : undefined };');

const aiTabStart = txt.indexOf("{activeTab === 'ai-assistant'");
const endMatch = "</AnimatePresence>\n          </div>";
const aiTabEnd = txt.indexOf(endMatch, aiTabStart) + endMatch.length;

if(aiTabStart > -1 && aiTabEnd > aiTabStart) {
  const replacement = `{activeTab === 'ai-assistant' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col min-h-[400px] relative p-8"
              >
                  <div className="flex flex-col items-center mb-8">
                    <div className="w-16 h-16 bg-[#0A6ED1]/10 rounded-full flex items-center justify-center mb-4">
                        <Bot size={32} className="text-[#0A6ED1]" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800">AI Intake Summary</h2>
                    <p className="text-slate-500 max-w-md text-center mt-2">
                        This is an AI-generated summary of the patient's initial symptoms.
                    </p>
                  </div>
                  
                  <div className="flex-1 bg-slate-50 rounded-xl p-6 md:p-8 overflow-y-auto whitespace-pre-wrap text-slate-700 leading-relaxed max-w-4xl w-full mx-auto shadow-inner border border-slate-200/60">
                      {activeAppointment?.aiChatSummary ? (
                          <div className="prose max-w-none prose-slate">
                            {typeof window !== 'undefined' ? <ReactMarkdown>{activeAppointment.aiChatSummary}</ReactMarkdown> : activeAppointment.aiChatSummary}
                          </div>
                      ) : (
                          <div className="flex flex-col items-center justify-center h-full text-slate-400 py-12">
                              <FileText size={48} className="text-slate-300 mb-4" />
                              <h3 className="text-lg font-bold text-slate-600 mb-2">No Summary Available</h3>
                              <p className="text-center max-w-sm">No AI intake history was shared by the patient or it is still being processed.</p>
                          </div>
                      )}
                  </div>
                  
                  {activeAppointment?.aiChatSummaryGeneratedAt && (
                      <div className="mt-6 text-center text-xs text-slate-400 font-medium">
                          Generated on {new Date(activeAppointment.aiChatSummaryGeneratedAt).toLocaleString()}
                      </div>
                  )}
              </motion.div>
            )}
            </AnimatePresence>
          </div>`;
  
  txt = txt.substring(0, aiTabStart) + replacement + txt.substring(aiTabEnd);
}

if(!txt.includes("import ReactMarkdown")) {
  txt = txt.replace(/import \{ motion, AnimatePresence \} from 'framer-motion';/, "import { motion, AnimatePresence } from 'framer-motion';\nimport ReactMarkdown from 'react-markdown';");
}
fs.writeFileSync(fn, txt);
console.log('done details rewrite');