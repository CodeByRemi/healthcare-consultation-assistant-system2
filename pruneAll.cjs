const fs = require('fs');
let file = 'src/pages/doctor-dashboard/PatientDetails.tsx';
let content = fs.readFileSync(file, 'utf8');

// We are going to completely remove the useEffects that load sessions and messages
// since we no longer use the interactive chat session viewer.

// Drop the states we aren't using.
content = content.replace(/const \[chatSessions, setChatSessions[^;]+;/g, '');
content = content.replace(/const \[loadingSessions, setLoadingSessions[^;]+;/g, '');
content = content.replace(/const \[loadingMessages, setLoadingMessages[^;]+;/g, '');
content = content.replace(/const \[isSessionDropdownOpen, setIsSessionDropdownOpen[^;]+;/g, '');
content = content.replace(/const \[selectedSession, setSelectedSession[^;]+;/g, '');

// Drop the entire mock messages block
const mockRegex = /const MOCK_MESSAGES_DATA: Record<string, Message\[\]> = \{[\s\S]*?(?=export interface)/;
content = content.replace(mockRegex, '');

// Drop unused imports
content = content.replace('import ReactMarkdown from "react-markdown";\n', '');
content = content.replace('import { Bot, Calendar, ChevronDown, Check } from "lucide-react";\n', '');
content = content.replace('Bot,\n  Calendar,\n  ChevronDown,\n  Check\n', '');

// Strip the usages
content = content.replace(/useEffect\(\(\) => \{\n\s+if \(!selectedSession\)\s+\{\n\s+setMessages\(\[\]\);\n\s+return;\n\s+\}\n\n\s+const fetchMessages = async \(\) => \{\n\s+setLoadingMessages\(true\);\n\s+try \{\n\s+const sessionMessages = \[\];\n\s+setMessages\(sessionMessages\);\n\s+\} catch \(error\) \{\n\s+console\.error\('Error fetching messages:', error\);\n\s+toast\.error\('Failed to load messages'\);\n\s+\} finally \{\n\s+setLoadingMessages\(false\);\n\s+\}\n\s+\};\n\n\s+fetchMessages\(\);\n\s+\}, \[selectedSession\]\);/g, '');

content = content.replace(/useEffect\(\(\) => \{\n\s+const handleClickOutside = \(event: MouseEvent\) => \{\n\s+if \(dropdownRef\.current && !dropdownRef\.current\.contains\(event\.target as Node\)\) \{\n\s+setIsSessionDropdownOpen\(false\);\n\s+\}\n\s+\};\n\n\s+document\.addEventListener\('mousedown', handleClickOutside\);\n\s+return \(\) => \{\n\s+document\.removeEventListener\('mousedown', handleClickOutside\);\n\s+\};\n\s+\}, \[\]\);/g, '');

content = content.replace(/useEffect\(\(\) => \{\n\s+const loadSessions = async \(\) => \{\n\s+if \(!id\) return;\n\s+setLoadingSessions\(true\);\n\s+try \{\n\s+setChatSessions\(\[\]\);\n\s+\} catch \(error\) \{\n\s+console\.error\("Error loading chat sessions:", error\);\n\s+toast\.error\("Failed to load chat history"\);\n\s+\} finally \{\n\s+setLoadingSessions\(false\);\n\s+\}\n\s+\};\n\s+loadSessions\(\);\n\s+\}, \[id\]\);/g, '');


fs.writeFileSync(file, content);
console.log('done');
