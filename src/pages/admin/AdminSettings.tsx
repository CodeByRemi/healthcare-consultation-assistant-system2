import { useState } from "react";
import { 
  User, 
  Mail, 
  Shield, 
  Activity, 
  Database, 
  RefreshCw, 
  Server,
  Trash2,
  Save,
  CheckCircle
} from "lucide-react";
import { toast } from "sonner";
import { auth } from "../../lib/firebase";

export default function AdminSettings() {
  const [isCleaning, setIsCleaning] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);

  // Mock Admin Profile Data (replace with actual auth data if available)
  const [adminProfile, setAdminProfile] = useState({
    name: "System Administrator",
    email: auth.currentUser?.email || "admin@healthcare.com",
    role: "Super Admin",
    lastLogin: new Date().toLocaleString()
  });

  const handleClearCache = () => {
    setIsCleaning(true);
    setTimeout(() => {
      setIsCleaning(false);
      toast.success("System cache cleared successfully", {
        description: "Temporary files and cache have been removed."
      });
    }, 2000);
  };

  const handleOptimizeDB = () => {
    setIsOptimizing(true);
    setTimeout(() => {
      setIsOptimizing(false);
      toast.success("Database optimization complete", {
        description: "Indexes rebuilt and query performance improved."
      });
    }, 2500);
  };

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Profile updated", {
      description: "Admin profile details have been saved."
    });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Settings &amp; Maintenance</h2>
          <p className="text-sm text-gray-500 mt-1">Manage admin profile and system health</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Admin Profiler Section */}
        <div className="lg:col-span-2">
          <section className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden h-full">
            <div className="p-6 border-b border-gray-100 flex items-center gap-3 bg-gray-50/50">
              <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                <User size={20} />
              </div>
              <h3 className="font-bold text-gray-900">Admin Profiler</h3>
            </div>
            
            <form onSubmit={handleUpdateProfile} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Display Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      value={adminProfile.name}
                      onChange={(e) => setAdminProfile({...adminProfile, name: e.target.value})}
                      className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-gray-900 placeholder:text-gray-400"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="email"
                      value={adminProfile.email}
                      disabled
                      className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-500 cursor-not-allowed outline-none"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Role &amp; Permissions</label>
                  <div className="relative">
                    <Shield className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      value={adminProfile.role}
                      disabled
                      className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-500 cursor-not-allowed outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Last Login</label>
                  <div className="relative">
                    <Activity className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      value={adminProfile.lastLogin}
                      disabled
                      className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-500 cursor-not-allowed outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-gray-100">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition-all shadow-sm hover:shadow-md active:scale-95"
                >
                  <Save size={18} />
                  Save Changes
                </button>
              </div>
            </form>
          </section>
        </div>

        {/* Performance & Maintenance Section */}
        <div className="lg:col-span-1">
          <section className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden h-full flex flex-col">
            <div className="p-6 border-b border-gray-100 flex items-center gap-3 bg-gray-50/50">
               <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
                <Activity size={20} />
              </div>
              <h3 className="font-bold text-gray-900">System Health</h3>
            </div>
            
            <div className="p-6 space-y-6 flex-1">
              {/* System Status Indicators */}
              <div className="space-y-4 bg-gray-50/50 rounded-xl p-4 border border-gray-100">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 flex items-center gap-2">
                    <Server size={14} /> Server Status
                  </span>
                  <span className="text-green-600 font-medium flex items-center gap-1.5 bg-green-50 px-2.5 py-1 rounded-full border border-green-100">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    Operational
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 flex items-center gap-2">
                    <Database size={14} /> Database
                  </span>
                  <span className="text-green-600 font-medium flex items-center gap-1.5 bg-green-50 px-2.5 py-1 rounded-full border border-green-100">
                    <CheckCircle size={12} />
                    Connected
                  </span>
                </div>
                 <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 flex items-center gap-2">
                    <Activity size={14} /> Latency
                  </span>
                  <span className="text-gray-900 font-medium bg-gray-100 px-2.5 py-1 rounded-full">24ms</span>
                </div>
              </div>

              <div className="h-px bg-gray-100 w-full" />

              {/* Maintenance Actions */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Maintenance Actions</h4>
                
                <button
                  onClick={handleClearCache}
                  disabled={isCleaning}
                  className="w-full flex items-center justify-between p-3 rounded-xl border border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm transition-all group disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-gray-50 rounded-lg border border-gray-100 text-gray-500 group-hover:text-amber-500 group-hover:bg-amber-50 group-hover:border-amber-100 transition-colors">
                      <Trash2 size={18} />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-semibold text-gray-900">Clear Cache</p>
                      <p className="text-xs text-gray-500">Free up system memory</p>
                    </div>
                  </div>
                  {isCleaning ? (
                    <RefreshCw size={16} className="text-blue-500 animate-spin mr-2" />
                  ) : (
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-300 group-hover:bg-blue-400 transition-colors mr-2" />
                  )}
                </button>

                <button
                  onClick={handleOptimizeDB}
                  disabled={isOptimizing}
                  className="w-full flex items-center justify-between p-3 rounded-xl border border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm transition-all group disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-gray-50 rounded-lg border border-gray-100 text-gray-500 group-hover:text-blue-500 group-hover:bg-blue-50 group-hover:border-blue-100 transition-colors">
                      <Database size={18} />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-semibold text-gray-900">Optimize Database</p>
                      <p className="text-xs text-gray-500">Re-index and cleanup</p>
                    </div>
                  </div>
                  {isOptimizing ? (
                    <RefreshCw size={16} className="text-blue-500 animate-spin mr-2" />
                  ) : (
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-300 group-hover:bg-blue-400 transition-colors mr-2" />
                  )}
                </button>
              </div>
            </div>
          </section>
        </div>

      </div>
    </div>
  );
}
