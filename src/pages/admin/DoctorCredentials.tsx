import { Link, useLocation } from "react-router-dom";
import { CheckCircle2, Copy, User, Lock, Send } from "lucide-react";
import { toast } from "sonner";
import { getAdminEmailSettings } from "./emailSettings";
import { sendDoctorCredentials } from "../../lib/emailService";
import { useState } from "react";

type CredentialsState = {
  doctorEmail?: string;
  doctorName?: string;
  username?: string;
  password?: string;
};

export default function DoctorCredentials() {
  const { state } = useLocation();
  const credentials = (state as CredentialsState | null) ?? {};

  const username = credentials.username ?? "[Username Placeholder]";
  const password = credentials.password ?? "[Password Placeholder]";
  const doctorEmail = credentials.doctorEmail ?? "";
  const doctorName = credentials.doctorName ?? "Doctor";
  const [isSending, setIsSending] = useState(false);

  const handleSendToGmail = async () => {
    if (!doctorEmail) {
      toast.error("Doctor email is missing.");
      return;
    }

    setIsSending(true);
    try {
      const success = await sendDoctorCredentials(doctorEmail, doctorName, password);
      if (success) {
        toast.success("Credentials sent to doctor's email successfully!");
      } else {
        toast.error("Failed to send email. Please try again.");
      }
    } catch (error) {
      console.error("Error sending email:", error);
      toast.error("An error occurred while sending email.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 md:p-8 border-b border-gray-100">
          <div className="flex items-center gap-3 text-green-600 mb-3">
            <CheckCircle2 className="w-6 h-6" />
            <h1 className="text-2xl font-bold text-gray-900">Doctor Account Created</h1>
          </div>
          <p className="text-sm text-gray-600">
            Share the generated login credentials with the doctor.
          </p>
        </div>

        <div className="p-6 md:p-8 space-y-5">
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 space-y-4">
            <div>
              <label className="text-xs uppercase tracking-wide text-gray-500">Username</label>
              <div className="mt-1 flex items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2">
                <div className="flex items-center gap-2 text-gray-700">
                  <User size={16} />
                  <span className="font-medium">{username}</span>
                </div>
                <button type="button" className="text-gray-400 hover:text-gray-600" aria-label="Copy username">
                  <Copy size={16} />
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs uppercase tracking-wide text-gray-500">Password</label>
              <div className="mt-1 flex items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2">
                <div className="flex items-center gap-2 text-gray-700">
                  <Lock size={16} />
                  <span className="font-medium">{password}</span>
                </div>
                <button type="button" className="text-gray-400 hover:text-gray-600" aria-label="Copy password">
                  <Copy size={16} />
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs uppercase tracking-wide text-gray-500">Doctor Gmail</label>
              <div className="mt-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-gray-700 font-medium">
                {doctorEmail || "[Doctor Gmail Placeholder]"}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              type="button"
              onClick={handleSendToGmail}
              disabled={isSending}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-600 text-white px-4 py-2 font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              <Send size={16} />
              {isSending ? "Sending Email..." : "Send to Doctor Email"}
            </button>
            <Link
              to="/admin"
              className="inline-flex items-center justify-center rounded-lg bg-blue-600 text-white px-4 py-2 font-medium hover:bg-blue-700 transition-colors"
            >
              Back to Admin Dashboard
            </Link>
            <Link
              to="/admin"
              className="inline-flex items-center justify-center rounded-lg border border-gray-300 text-gray-700 px-4 py-2 font-medium hover:bg-gray-50 transition-colors"
            >
              Done
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}