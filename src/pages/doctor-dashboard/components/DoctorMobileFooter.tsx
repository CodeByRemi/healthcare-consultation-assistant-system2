// Placeholder for mobile footer if it doesn't exist
import { Link, useLocation } from "react-router-dom";
import { Home, Calendar, Users, Settings } from "lucide-react";

export default function DoctorMobileFooter() {
    const location = useLocation();
    const isActive = (path: string) => location.pathname === path;

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-4 py-2 flex justify-around items-center z-50">
            <Link to="/doctor/dashboard" className={`flex flex-col items-center p-2 rounded-lg ${isActive('/doctor/dashboard') ? 'text-primary' : 'text-slate-400'}`}>
                <Home size={20} />
                <span className="text-[10px] mt-1">Home</span>
            </Link>
             <Link to="/doctor/schedule" className={`flex flex-col items-center p-2 rounded-lg ${isActive('/doctor/schedule') ? 'text-primary' : 'text-slate-400'}`}>
                <Calendar size={20} />
                <span className="text-[10px] mt-1">Schedule</span>
            </Link>
             <Link to="/doctor/patients" className={`flex flex-col items-center p-2 rounded-lg ${isActive('/doctor/patients') ? 'text-primary' : 'text-slate-400'}`}>
                <Users size={20} />
                <span className="text-[10px] mt-1">Patients</span>
            </Link>
            <Link to="/doctor/settings" className={`flex flex-col items-center p-2 rounded-lg ${isActive('/doctor/settings') ? 'text-primary' : 'text-slate-400'}`}>
                 <Settings size={20} />
                <span className="text-[10px] mt-1">Settings</span>
            </Link>
        </div>
    );
}
