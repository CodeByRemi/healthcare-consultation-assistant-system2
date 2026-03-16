const fs = require('fs');

function rewriteMyPatients() {
    let file = 'src/pages/doctor-dashboard/MyPatients.tsx';
    let c = fs.readFileSync(file, 'utf8');

    // Replace dummy full chat logic
    const oldChatData = `        const placeholderChat = [
            {
                role: 'system',
                content: 'Session',
                timestamp: new Date(Date.now() - 86400000)
            },
            {
                role: 'user',
                content: "Patient Message",
                timestamp: new Date(Date.now() - 86400000 + 1000 * 60 * 2)
            },
            { 
                role: 'assistant',
                content: "AI Response",
                timestamp: new Date(Date.now() - 86400000 + 1000 * 60 * 3)
            },
            {
                role: 'user',
                content: "Follow-up Message",
                timestamp: new Date(Date.now() - 86400000 + 1000 * 60 * 5)
            },
            {
                role: 'assistant',
                content: "Follow-up Response",
                timestamp: new Date(Date.now() - 86400000 + 1000 * 60 * 6)
            }
        ];`;

    const newChatData = `        const placeholderChat = [
            {
                role: 'system',
                content: 'Session',
                timestamp: new Date(Date.now() - 86400000)
            },
            { 
                role: 'assistant',
                content: "Patient reported persistent mild to moderate pain over the past 3 days. No history of recent physical trauma or related chronic diseases. Has been taking over-the-counter pain medication with minimal relief. Recommended follow-up physical examination.",
                timestamp: new Date(Date.now() - 86400000 + 1000 * 60 * 3)
            }
        ];`;

    c = c.replace(oldChatData, newChatData);

    // Now replacing the chat renderer loop
    // search for {chatMessages.filter(m => m.role !== 'system').map((msg, idx) => ( ... ))}
    const renderRe = /\{chatMessages\.filter.*?\.map\(.*?div className=\{`flex gap-4.*?\n                                      \}\)\}/s;
    const newRender = `{chatMessages.filter(m => m.role !== 'system').map((msg, idx) => (
                                          <div key={idx} className="bg-blue-50/50 border border-blue-100 p-6 rounded-2xl">
                                              <div className="flex items-center gap-3 mb-4">
                                                  <div className="w-10 h-10 rounded-full bg-[#0A6ED1] flex items-center justify-center text-white shrink-0 shadow-sm">
                                                      <Bot size={20} />
                                                  </div>
                                                  <div>
                                                      <h4 className="font-bold text-slate-800">AI Consultation Summary</h4>
                                                      <p className="text-xs text-slate-500">Auto-generated from pre-visit chat</p>
                                                  </div>
                                              </div>
                                              <div className="text-[14px] text-slate-700 leading-relaxed space-y-3">
                                                  <p>{msg.content}</p>
                                              </div>
                                          </div>
                                      ))}`;
                                      
    c = c.replace(renderRe, newRender);
    fs.writeFileSync(file, c);
    console.log("MyPatients updated");
}

rewriteMyPatients();
