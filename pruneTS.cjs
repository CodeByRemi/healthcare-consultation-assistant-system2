const fs = require('fs');
let file = 'src/pages/doctor-dashboard/PatientDetails.tsx';
let content = fs.readFileSync(file, 'utf8');

// remove unused imports
content = content.replace('import ReactMarkdown from "react-markdown";\n', '');
content = content.replace('import { Bot, Calendar, ChevronDown, Check } from "lucide-react";\n', '');
content = content.replace('Bot,\n  Calendar,\n  ChevronDown,\n  Check\n', '');

// remove states
content = content.replace(/const \[chatSessions, setChatSessions[^;]+;/g, '');
content = content.replace(/const \[loadingSessions, setLoadingSessions[^;]+;/g, '');
content = content.replace(/const \[loadingMessages, setLoadingMessages[^;]+;/g, '');
content = content.replace(/const \[isSessionDropdownOpen, setIsSessionDropdownOpen[^;]+;/g, '');

// remove MOCK_MESSAGES_DATA block
const mockRegex = /const MOCK_MESSAGES_DATA: Record<string, Message\[\]> = \{[\s\S]*?(?=export interface)/;
content = content.replace(mockRegex, '');

// Fix sessionMessages explicitly
content = content.replace('const sessionMessages = [];', 'const sessionMessages: any[] = [];');

fs.writeFileSync(file, content);
console.log("Pruned!");
