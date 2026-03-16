const fs = require('fs');
const path = 'src/pages/patient-dashboard/PatientSettings.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Add imports
const importsToAdd = `import { useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { toast } from "sonner";\n`;

// Make sure to match import useState
content = content.replace('import { useState } from "react";', importsToAdd + 'import { useState } from "react";');

// 2. Replace component start up to toggleSetting
const startSearch = 'export default function PatientSettings() {\n  const [isSidebarOpen, setIsSidebarOpen] = useState(true);';
if (content.includes(startSearch)) {
    const endSearch = 'const tabs = [';
    
    const newComponentTop = `export default function PatientSettings() {
  const { currentUser } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("account");

  const [settings, setSettings] = useState({
    emailNotifications: true,
    publicProfile: false,
    language: "English (US)"
  });

  useEffect(() => {
    const fetchSettings = async () => {
      if (!currentUser) return;
      try {
        const docRef = doc(db, "patients", currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.settings) {
            setSettings(prev => ({ ...prev, ...data.settings }));
          }
        }
      } catch (error) {
        console.error("Error fetching patient settings:", error);
      }
    };
    fetchSettings();
  }, [currentUser]);

  const toggleSetting = async (key: keyof typeof settings) => {
    const newValue = !settings[key];
    setSettings(prev => ({ ...prev, [key]: newValue }));

    if (!currentUser) return;
    try {
      const docRef = doc(db, "patients", currentUser.uid);
      await updateDoc(docRef, {
        [\`settings.\${key}\`]: newValue
      });
      toast.success("Setting updated");
    } catch (error) {
      console.error("Error updating setting:", error);
      toast.error("Failed to update setting");
      setSettings(prev => ({ ...prev, [key]: !newValue }));
    }
  };

  const updateLanguage = async (newLang: string) => {
    setSettings(prev => ({ ...prev, language: newLang }));
    if (!currentUser) return;
    try {
      const docRef = doc(db, "patients", currentUser.uid);
      await updateDoc(docRef, {
        "settings.language": newLang
      });
      toast.success("Language updated");
    } catch (error) {
      console.error("Error updating language:", error);
      toast.error("Failed to update language");
    }
  };

  `;
  
    content = content.substring(0, content.indexOf(startSearch)) + newComponentTop + content.substring(content.indexOf(endSearch));
}

// 3. Fix language change handler
content = content.replace(
    'onChange={(e) => setSettings((prev) => ({ ...prev, language: e.target.value }))}',
    'onChange={(e) => updateLanguage(e.target.value)}'
);

fs.writeFileSync(path, content, 'utf8');
console.log('PatientSettings updated');
