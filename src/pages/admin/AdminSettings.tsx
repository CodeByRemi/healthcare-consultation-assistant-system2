import { useState } from "react";
import { Mail, Save } from "lucide-react";
import { toast } from "sonner";
import type { AdminEmailSettings } from "./emailSettings";
import {
  getAdminEmailSettings,
  SETTINGS_STORAGE_KEY
} from "./emailSettings";

export default function AdminSettings() {
  const [settings, setSettings] = useState<AdminEmailSettings>(getAdminEmailSettings);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    toast.success("Admin email settings saved.");
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900">Admin Settings</h2>
          <p className="text-sm text-gray-500 mt-1">
            Configure how doctor credentials are sent to Gmail after account creation.
          </p>
        </div>

        <form onSubmit={handleSave} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sender Gmail (Admin)</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="email"
                name="senderGmail"
                value={settings.senderGmail}
                onChange={handleChange}
                placeholder="admin@gmail.com"
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Subject Template</label>
            <input
              type="text"
              name="subjectTemplate"
              value={settings.subjectTemplate}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Body Template</label>
            <textarea
              name="bodyTemplate"
              value={settings.bodyTemplate}
              onChange={handleChange}
              rows={8}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
            />
            <p className="text-xs text-gray-500 mt-2">
              Supported placeholders: {"{{doctorName}}"}, {"{{username}}"}, {"{{password}}"}
            </p>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
            >
              <Save size={16} />
              Save Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
