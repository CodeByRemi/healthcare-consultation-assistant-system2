const fs = require('fs');
let code = fs.readFileSync('src/pages/doctor-dashboard/MyPatients.tsx', 'utf-8');

code = code.replace(/import \{ MessageCircle, User, Bot, Send, Calendar \} from "lucide-react";\n?/, '');

code = code.replace(/\s*const \[modalTab, setModalTab\] = useState<'details' \| 'chat'>\('details'\);/, '');
code = code.replace(/\s*const \[endingAppointmentId, setEndingAppointmentId\] = useState<string \| null>\(null\);/, '');
code = code.replace(/\s*const \[chatMessages, setChatMessages\] = useState<ChatMessage\[\]>\(\[\]\);/, '');
code = code.replace(/\s*const \[loadingChat, setLoadingChat\] = useState\(false\);/, '');

code = code.replace(/\s*const toDateValue = \(timestamp: ChatMessage\["timestamp"\] \| undefined\) => \{[\s\S]*?return new Date\(\);\n    \};/, '');
code = code.replace(/\s*const handleEndConsultation = \(appointmentId: string\) => \{[\s\S]*?\}\);\n  \};/, '');

code = code.replace(/\s*const endConsultation = async \(appointmentId: string\) => \{[\s\S]*?finally \{\s*setEndingAppointmentId\(null\);\s*\}\n  \};/, '');

// fetchChatHistory
code = code.replace(/\s*const fetchChatHistory = async \(\) => \{[\s\S]*?\/\*\s*[\s\S]*?\*\/\n  \};/, '');

fs.writeFileSync('src/pages/doctor-dashboard/MyPatients.tsx', code);
console.log('Cleaned TS variables');
