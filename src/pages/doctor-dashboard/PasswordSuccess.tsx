import { CheckCircle2 } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";

export default function PasswordSuccess() {
  const [searchParams] = useSearchParams();
  const mode = searchParams.get("mode") === "create" ? "create" : "update";

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-lg bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center">
        <div className="w-14 h-14 mx-auto rounded-full bg-green-100 flex items-center justify-center mb-4">
          <CheckCircle2 className="text-green-600" size={28} />
        </div>
        <h1 className="text-2xl font-bold text-slate-900">
          Password {mode === "create" ? "Created" : "Updated"} Successfully
        </h1>
        <p className="text-slate-500 mt-2">
          Your account password has been {mode === "create" ? "created" : "updated"} successfully.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/doctor/settings"
            className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-[#0A6ED1] text-white font-medium hover:bg-[#095bb0] transition-colors"
          >
            Back to Settings
          </Link>
          <Link
            to="/doctor/dashboard"
            className="inline-flex items-center justify-center px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-medium hover:bg-slate-50 transition-colors"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
