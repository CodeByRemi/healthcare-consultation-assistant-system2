const fs = require('fs');
const fn = 'src/pages/doctor-dashboard/MyPatients.tsx';
let txt = fs.readFileSync(fn, 'utf8');

if (!txt.includes('import { db, model }')) {
  txt = txt.replace(/import \{ db \} from "\.\.\/\.\.\/lib\/firebase";/, 'import { db, model } from "../../lib/firebase";');
}

if (!txt.includes('limit(')) {
  txt = txt.replace(/import \{ collection, query, where, getDocs, doc, updateDoc, getDoc \} from "firebase\/firestore";/, 'import { collection, query, where, getDocs, doc, updateDoc, getDoc, orderBy, limit } from "firebase/firestore";');
}

const summaryFunc = `
  const generateAndSaveAISummary = async (patientId: string, appointmentId: string) => {
    try {
      // 1. Fetch patient's AI chats
      const convosRef = collection(db, "patients", patientId, "aiConversations");
      const q = query(convosRef, orderBy("lastUpdated", "desc"), limit(1));
      const qSnap = await getDocs(q);
      
      if (qSnap.empty) return; // No chat history
      const latestConvoId = qSnap.docs[0].id;
      
      const msgsRef = collection(db, "patients", patientId, "aiConversations", latestConvoId, "messages");
      const msgsSnap = await getDocs(query(msgsRef, orderBy("timestamp", "asc")));
      
      if (msgsSnap.empty) return;
      
      let chatText = '';
      msgsSnap.docs.forEach(doc => {
        const d = doc.data();
        chatText += \`\${d.role === 'user' ? 'Patient' : 'AI'}: \${d.content}\\n\`;
      });
      
      // 2. Generate summary
      const prompt = \`Summarize the following AI consultation history for a doctor to review. Make it concise and highlight the main symptoms, duration, and any important medical context. Do NOT include the full chat.\\n\\nChat:\\n\${chatText}\`;
      const result = await model.generateContent(prompt);
      const summary = result.response.text();
      
      // 3. Save to appointment
      await updateDoc(doc(db, "appointments", appointmentId), {
        aiChatSummary: summary,
        aiChatSummaryGeneratedAt: new Date().toISOString()
      });
      console.log('AI Chat Summary generated and saved.');
    } catch (e) {
      console.error("Error generating AI chat summary:", e);
    }
  };
`;

if (!txt.includes('generateAndSaveAISummary')) {
  txt = txt.replace('const handleAccept = async (id: string) => {', summaryFunc + '\n  const handleAccept = async (id: string) => {');
}

if (!txt.includes('generateAndSaveAISummary(accepted.patientId, accepted.id);')) {
  txt = txt.replace(/if \(accepted\) \{/, 'if (accepted) {\n              if (accepted.shareAIChat) {\n                  generateAndSaveAISummary(accepted.patientId, accepted.id);\n              }');
}

fs.writeFileSync(fn, txt);
console.log('done');
