const fs = require('fs');
let content = fs.readFileSync('src/pages/doctor-dashboard/PatientDetails.tsx', 'utf8');

const regex = /<p>Based on the conversation history,[\s\S]*?<\/ul>[\s\S]*?<\/p>/;
if (regex.test(content) && content.includes('<div className="text-sm text-slate-600 leading-relaxed space-y-2">')) {
    const toReplace = `<p>Based on the conversation history, this patient discussed primarily the following points:</p>
                                                          <ul className="list-disc pl-5 space-y-1 block mt-2 text-slate-500">
                                                              {messages.filter(m => m.sender === 'user').slice(-3).map(m => (
                                                                  <li key={'sum-'+m.id}>&quot;{m.text.substring(0, 80)}{m.text.length > 80 ? '...' : ''}&quot;</li>
                                                              ))}
                                                          </ul>
                                                          <p className="mt-3 italic text-xs text-slate-400">Note: This is a placeholder summary generated locally. Google GenAI integration can be connected here.</p>`;

    // It might be formatted differently, so let's just replace the div's inner contents using regex
    content = content.replace(regex, `{isGeneratingSummary ? (
                                                            <div className="flex items-center gap-2 text-slate-500">
                                                              <div className="w-4 h-4 rounded-full border-2 border-blue-600 border-t-transparent animate-spin"></div>
                                                              <span>Generating summary...</span>
                                                            </div>
                                                          ) : (
                                                            <ReactMarkdown className="prose prose-sm prose-slate max-w-none">{aiSummary || "No summary available."}</ReactMarkdown>
                                                          )}`);
    fs.writeFileSync('src/pages/doctor-dashboard/PatientDetails.tsx', content);
    console.log("Replaced inner html");
} else {
    console.log("Regex didn't match.");
}
