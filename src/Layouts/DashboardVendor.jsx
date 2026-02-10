import { useEffect, useState } from "react";
import { Outlet, Link, NavLink } from "react-router-dom";
import { LayoutDashboard, PlusCircle, Ticket, Home, Moon, Sun } from "lucide-react";
import useAuth from "../hooks/useAuth";
import useAxiosPublic from "../hooks/useAxiosPublic";

const DashboardVendor = () => {
  const { user } = useAuth();
  const axiosPublic = useAxiosPublic();
  const [vendorInfo, setVendorInfo] = useState(null);
  const [theme, setTheme] = useState(
    localStorage.getItem("ticket-theme") || "light"
  );

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("ticket-theme", newTheme);
  };

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  useEffect(() => {
    if (user?.email) {
      axiosPublic.get(`/users/profile/${user.email}`)
        .then(res => setVendorInfo(res.data))
        .catch(err => console.error("Error fetching vendor profile:", err));
    }
  }, [user, axiosPublic]);

  return (
    <div className="flex min-h-screen bg-base-100 text-base-content transition-colors duration-300">
      {/* Sidebar */}
      <div className="w-72 bg-slate-900 text-white p-6 flex flex-col sticky top-0 h-screen z-50">
        <Link to="/" className="flex items-center gap-2 group mb-10">
          <div className="bg-brand p-1.5 rounded-xl transition-transform group-hover:rotate-12">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
          </div>
          <span className="text-2xl font-black tracking-tighter uppercase">
            Ticket<span className="text-brand">Bari</span>
          </span>
        </Link>

        {vendorInfo && (
          <div className="mb-8 p-4 bg-slate-800/50 rounded-2xl border border-slate-700 flex flex-col items-center text-center">
            <div className="relative mb-3">
              <img 
                src={vendorInfo.businessDetails?.profilePic || user?.photoURL} 
                alt="Vendor" 
                className="w-20 h-20 rounded-full object-cover border-2 border-brand"
              />
              <span className="absolute bottom-0 right-0 bg-green-500 w-4 h-4 rounded-full border-2 border-slate-800"></span>
            </div>
            <h3 className="font-bold text-lg truncate w-full">{vendorInfo.businessDetails?.name || user?.displayName}</h3>
            <p className="text-xs text-slate-400 truncate w-full mb-3">{user?.email}</p>
          </div>
        )}

        <ul className="space-y-2 flex-1">
          <li>
            <NavLink to="/dashboard" end className={({ isActive }) => `flex items-center gap-3 font-semibold p-3 rounded-xl transition-all ${isActive ? 'bg-brand text-white shadow-lg' : 'hover:bg-slate-800 text-slate-400'}`}>
              <LayoutDashboard size={20} /> Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink to="/dashboard/add-ticket" className={({ isActive }) => `flex items-center gap-3 font-semibold p-3 rounded-xl transition-all ${isActive ? 'bg-brand text-white shadow-lg' : 'hover:bg-slate-800 text-slate-400'}`}>
              <PlusCircle size={20} /> Add Ticket
            </NavLink>
          </li>


          <li>
            <NavLink to="/dashboard/my-tickets" className={({ isActive }) => `flex items-center gap-3 font-semibold p-3 rounded-xl transition-all ${isActive ? 'bg-brand text-white shadow-lg' : 'hover:bg-slate-800 text-slate-400'}`}>
              <Ticket size={20} /> My Tickets
            </NavLink>
          </li>
          <li>
            <NavLink to="/dashboard/manage-bookings" className={({ isActive }) => `flex items-center gap-3 font-semibold p-3 rounded-xl transition-all ${isActive ? 'bg-brand text-white shadow-lg' : 'hover:bg-slate-800 text-slate-400'}`}>
              <Ticket size={20} />Booking Requests
            </NavLink>
          </li>


          <div className="divider bg-slate-700 h-[1px] my-6 opacity-30"></div>
          <li>
            <Link to="/" className="flex items-center gap-3 font-semibold p-3 rounded-xl text-slate-400 hover:bg-slate-800 transition-all">
              <Home size={20} /> Home
            </Link>
          </li>
        </ul>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 min-h-screen">
        <header className="h-20 bg-base-100 border-b border-base-300 flex items-center justify-between px-10 sticky top-0 z-40">
           <span className="font-bold text-slate-500 uppercase tracking-widest text-xs">Vendor Portal</span>
           
           {/* Theme Toggle in Dashboard Header */}
           <div className="flex items-center gap-6">
             <button onClick={toggleTheme} className="btn btn-ghost btn-circle text-xl">
               {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
             </button>
             <div className="flex items-center gap-4 text-sm font-bold">
               Status: <span className="text-green-500">Online</span>
             </div>
           </div>
        </header>

        <main className="p-10">
          <Outlet context={{ vendorInfo }} /> 
        </main>
      </div>
    </div>
  );
};

export default DashboardVendor;