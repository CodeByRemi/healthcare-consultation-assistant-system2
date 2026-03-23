const fs = require('fs');
const fn = 'src/pages/patient-dashboard/components/AppointmentDetailsModal.tsx';
let txt = fs.readFileSync(fn, 'utf8');

txt = txt.replace('onReschedule: (appointment: Appointment) => void;', 'onReschedule: (appointment: Appointment) => void;\n  onCancel?: (appointment: Appointment) => void;');
txt = txt.replace('onReschedule }: AppointmentDetailsModalProps', 'onReschedule, onCancel }: AppointmentDetailsModalProps');

const parts = txt.split('{/* Actions */}');
txt = parts[0] + `{/* Actions */}
              <div className="flex gap-3 pt-2">
                {appointment.status.toLowerCase() !== "completed" && appointment.status.toLowerCase() !== "cancelled" && (
                  <>
                    <button
                      onClick={() => onReschedule(appointment)}
                      className="flex-1 py-3 px-4 bg-white border-2 border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-95"
                    >
                      Reschedule
                    </button>
                    {onCancel && (
                      <button
                        onClick={() => {
                          onClose();
                          onCancel(appointment);
                        }}
                        className="flex-1 py-3 px-4 bg-white border-2 border-red-200 text-red-600 font-bold rounded-xl hover:bg-red-50 hover:border-red-300 transition-all active:scale-95"
                      >
                        Cancel
                      </button>
                    )}
                  </motion.div>
                )}
                <button
                  onClick={onClose}
                  className="flex-1 py-3 px-4 bg-[#0A6ED1] text-white font-bold rounded-xl hover:bg-[#095bb0] shadow-lg shadow-blue-500/20 transition-all active:scale-95"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
`;
fs.writeFileSync(fn, txt);
console.log('done');
