import { FaBars, FaBell, FaUserCircle } from "react-icons/fa";
import { Link } from "react-router-dom";

interface HeaderProps {
  toggleSidebar: () => void;
}

export default function PatientDashboardHeader({ toggleSidebar }: HeaderProps) {
  return (
    <header className="h-20 bg-white border-b border-slate-100 px-6 md:px-8 flex items-center justify-between sticky top-0 z-10 transition-all duration-200">
      <div className="flex items-center gap-4">
        <button 
          onClick={toggleSidebar}
          className="p-2 -ml-2 text-slate-500 hover:bg-slate-50 rounded-lg transition-colors md:hidden"
          title="Toggle Sidebar"
        >
          <FaBars className="w-5 h-5" />
        </button>
        {/* Breadcrumb or Title could go here */}
        <span className="text-slate-400 text-sm">Patient Portal</span>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <Link to="/patient/notifications" className="p-2 text-slate-400 hover:text-[#0A6ED1] hover:bg-slate-50 rounded-full transition-colors relative">
          <FaBell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </Link>


        <div className="h-8 w-px bg-slate-200 mx-2 hidden md:block"></div>

        <Link to="/patient/profile" className="flex items-center gap-3 pl-2 pr-1 py-1 rounded-full hover:bg-slate-50 transition-colors">
          <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden">
             {/* Profile Image or Fallback */}
             <FaUserCircle className="w-full h-full text-slate-400" />
          </div>
          <span className="hidden md:block font-medium text-sm text-slate-700">John Doe</span>
        </Link>
      </div>
    </header>
  );
}
