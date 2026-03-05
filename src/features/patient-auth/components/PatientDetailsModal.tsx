import { motion } from "framer-motion";
import { X, User, Mail, Phone, MapPin, Stethoscope, Calendar } from "lucide-react";

interface PatientDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientData?: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    bloodType?: string;
    joinDate: string;
  };
}

export default function PatientDetailsModal({
  isOpen,
  onClose,
  patientData
}: PatientDetailsModalProps) {
  if (!isOpen) return null;

  const details = patientData ?? {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    bloodType: "",
    joinDate: ""
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden"
      >
        {/* Header with gradient */}
        <div className="bg-linear-to-r from-blue-600 to-blue-700 px-8 py-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Welcome Back, {details.firstName || "Patient"}!</h2>
            <p className="text-blue-100 text-sm mt-1">Your health profile</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-white/20 hover:bg-white/30 text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-8 space-y-6">
          {/* Profile Summary */}
          <div className="flex items-center gap-4 pb-6 border-b border-gray-200">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
              <User className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                {details.firstName} {details.lastName}
              </h3>
              <p className="text-gray-500 text-sm">Patient Profile</p>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-6">
            {/* Email */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="p-4 bg-gray-50 rounded-xl border border-gray-200"
            >
              <div className="flex items-center gap-3 mb-2">
                <Mail className="w-5 h-5 text-blue-600" />
                <span className="text-xs font-semibold text-gray-500 uppercase">Email</span>
              </div>
              <p className="text-gray-900 font-medium">{details.email}</p>
            </motion.div>

            {/* Phone */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="p-4 bg-gray-50 rounded-xl border border-gray-200"
            >
              <div className="flex items-center gap-3 mb-2">
                <Phone className="w-5 h-5 text-blue-600" />
                <span className="text-xs font-semibold text-gray-500 uppercase">Phone</span>
              </div>
              <p className="text-gray-900 font-medium">{details.phone}</p>
            </motion.div>

            {/* Address */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="p-4 bg-gray-50 rounded-xl border border-gray-200 col-span-2"
            >
              <div className="flex items-center gap-3 mb-2">
                <MapPin className="w-5 h-5 text-blue-600" />
                <span className="text-xs font-semibold text-gray-500 uppercase">Address</span>
              </div>
              <p className="text-gray-900 font-medium">{details.address}</p>
            </motion.div>

            {/* Blood Type */}
            {details.bloodType && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="p-4 bg-gray-50 rounded-xl border border-gray-200"
              >
                <div className="flex items-center gap-3 mb-2">
                  <Stethoscope className="w-5 h-5 text-blue-600" />
                  <span className="text-xs font-semibold text-gray-500 uppercase">Blood Type</span>
                </div>
                <p className="text-gray-900 font-medium">{details.bloodType}</p>
              </motion.div>
            )}

            {/* Join Date */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="p-4 bg-gray-50 rounded-xl border border-gray-200"
            >
              <div className="flex items-center gap-3 mb-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                <span className="text-xs font-semibold text-gray-500 uppercase">Member Since</span>
              </div>
              <p className="text-gray-900 font-medium">{details.joinDate}</p>
            </motion.div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-6 border-t border-gray-200">
            <button
              onClick={onClose}
              className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
            >
              View Dashboard
            </button>
            <button
              onClick={onClose}
              className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
            >
              Edit Profile
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
