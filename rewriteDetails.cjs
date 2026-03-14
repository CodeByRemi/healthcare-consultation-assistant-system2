const fs = require('fs');

function rewrite() {
    let file = 'src/pages/doctor-dashboard/PatientDetails.tsx';
    let c = fs.readFileSync(file, 'utf8');

    // Replace dummy messages
    const oldMessages = `const MOCK_MESSAGES_DATA: Record<string, Message[]> = {
  "session-1": [
      { id: "m1", text: "I've been feeling a persistent headache for the past 3 days.", sender: "user", timestamp: new Date(Date.now() - 10000000) },
      { id: "m2", text: "I understand. Can you describe the pain? Is it throbbing or constant?", sender: "ai", timestamp: new Date(Date.now() - 9000000) },
      { id: "m3", text: "It's mostly throbbing, especially in the mornings.", sender: "user", timestamp: new Date(Date.now() - 8000000) },
      { id: "m4", text: "**Noted.** Based on your symptoms, I recommend monitoring your blood pressure. \\n\\n*   Drink plenty of water\\n*   Rest in a dark room\\n\\nIf it persists, please consult a specialist.", sender: "ai", timestamp: new Date(Date.now() - 7000000) },
      { id: "m5", text: "Okay, I will try that. Thank you.", sender: "user", timestamp: new Date(Date.now() - 6000000) }
  ],
  "session-2": [
      { id: "m5", text: "The medication seems to be working.", sender: "user", timestamp: new Date() },
      { id: "m6", text: "That is great news! Have you experienced any side effects?", sender: "ai", timestamp: new Date() }
  ]
};`;

    const newMessages = `const MOCK_MESSAGES_DATA: Record<string, Message[]> = {
  "session-1": [
      { id: "m1", text: "Patient reported persistent mild to moderate pain over the past 3 days. No history of recent physical trauma or related chronic diseases. Has been taking over-the-counter pain medication with minimal relief. Recommended follow-up physical examination.", sender: "ai", timestamp: new Date(Date.now() - 10000000) }  
  ],
  "session-2": [
      { id: "m2", text: "Patient follow-up: Medication has been effective. No side effects reported.", sender: "ai", timestamp: new Date() }
  ]
};`;

    c = c.replace(oldMessages, newMessages);
    
    // Now replacing the chat renderer loop
    const renderRe = /\{messages\.map\(\(msg\).*?\}\)\}/s;
    const newRender = `{messages.map((msg) => (
                                        <motion.div
                                            key={msg.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="w-full flex justify-start mb-6"
                                        >
                                            <div className="bg-blue-50/50 border border-blue-100 p-6 rounded-2xl w-full">
                                                <div className="flex items-center gap-3 mb-4">
                                                    <div className="w-10 h-10 rounded-full bg-[#0A6ED1] flex items-center justify-center text-white shrink-0 shadow-sm">
                                                        <Bot size={20} />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-slate-800">AI Consultation Summary</h4>
                                                        <p className="text-xs text-slate-500">Auto-generated from pre-visit chat</p>
                                                    </div>
                                                </div>
                                                <div className="text-[15px] text-slate-700 leading-relaxed font-medium">
                                                    {msg.text}
                                                </div>
                                                <div className="mt-4 text-xs text-slate-400 font-medium">
                                                    {msg.timestamp instanceof Date
                                                        ? msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                                        : "--:--"}
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}`;
                                      
    c = c.replace(renderRe, newRender);
    fs.writeFileSync(file, c);
    console.log("PatientDetails updated");
}

rewrite();
