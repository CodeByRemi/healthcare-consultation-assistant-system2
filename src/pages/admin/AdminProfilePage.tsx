import { Mail, Shield, User } from "lucide-react";

export default function AdminProfilePage() {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900">Admin Profile</h2>
        <p className="text-sm text-gray-500 mt-1">View your admin account details.</p>
      </div>

      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-lg border border-gray-200 px-4 py-3">
          <p className="text-xs uppercase tracking-wide text-gray-500">Full Name</p>
          <div className="mt-1 flex items-center gap-2 text-gray-900 font-medium">
            <User size={16} />
            <span>[Admin Full Name Placeholder]</span>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 px-4 py-3">
          <p className="text-xs uppercase tracking-wide text-gray-500">Email</p>
          <div className="mt-1 flex items-center gap-2 text-gray-900 font-medium">
            <Mail size={16} />
            <span>[Admin Email Placeholder]</span>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 px-4 py-3 md:col-span-2">
          <p className="text-xs uppercase tracking-wide text-gray-500">Role</p>
          <div className="mt-1 inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-medium">
            <Shield size={14} />
            <span>[Admin Role Placeholder]</span>
          </div>
        </div>
      </div>
    </div>
  );
}
