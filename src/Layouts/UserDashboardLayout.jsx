import { Link, Outlet, NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { 
  UserCircle, 
  Ticket, 
  History, 
  Home, 
  LogOut, 
  LayoutDashboard,
  ShieldCheck,
  Users,
  Megaphone
} from "lucide-react";
import useAuth from "../hooks/useAuth";

const UserDashboardLayout = () => {
  const { user, logOut } = useAuth();
  const [role, setRole] = useState(null);
  const navigate = useNavigate();


  useEffect(() => {
    if (user?.email) {
      axios.get(`http://localhost:5000/users/role/${user.email}`)
        .then(res => setRole(res.data.role));
    }
  }, [user]);

  const activeClass = "bg-brand text-white shadow-lg shadow-brand/20";
  const normalClass = "hover:bg-brand/10 hover:text-brand text-slate-600 dark:text-slate-400";

  const handleLogout = () => {
    logOut()
      .then(() => navigate("/login"))
      .catch((err) => console.error("Logout error:", err));
  };

  return (
    <div className="drawer lg:drawer-open">
      <input id="user-drawer" type="checkbox" className="drawer-toggle" />

      {/* Content Area */}
      <div className="drawer-content bg-slate-50 dark:bg-[#06080a] min-h-screen">
        {/* Mobile Navbar */}
        <div className="lg:hidden flex items-center justify-between p-4 bg-white dark:bg-slate-900 border-b dark:border-slate-800">
          <label htmlFor="user-drawer" className="btn btn-ghost drawer-button">
            <LayoutDashboard size={24} className="text-brand" />
          </label>
          <span className="font-black text-brand tracking-tighter uppercase">
            {role === 'admin' ? "Admin Panel" : "User Panel"}
          </span>
        </div>

        <div className="p-5 lg:p-10">
          <Outlet />
        </div>
      </div>

      {/* Sidebar */}
      <div className="drawer-side">
        <label htmlFor="user-drawer" className="drawer-overlay"></label>
        <div className="menu p-6 w-80 min-h-full bg-white dark:bg-slate-900 text-base-content border-r border-slate-200 dark:border-slate-800">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group mb-10 px-2">
            <div className="bg-brand p-1.5 rounded-xl transition-transform group-hover:rotate-12">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </div>
            <span className="text-2xl font-black tracking-tighter uppercase text-slate-900 dark:text-white">
              Ticket<span className="text-brand">Bari</span>
            </span>
          </Link>

          {/* SHARED/USER LINKS */}
          <ul className="space-y-2 font-bold uppercase text-xs tracking-widest">
            <li>
              <NavLink to="/user-dashboard" end className={({ isActive }) => `flex items-center gap-4 p-4 rounded-2xl transition-all ${isActive ? activeClass : normalClass}`}>
                <UserCircle size={20} /> My Profile
              </NavLink>
            </li>
            <li>
              <NavLink to="/user-dashboard/my-booked-tickets" className={({ isActive }) => `flex items-center gap-4 p-4 rounded-2xl transition-all ${isActive ? activeClass : normalClass}`}>
                <Ticket size={20} /> My Booked Tickets
              </NavLink>
            </li>
            <li>
              <NavLink to="/user-dashboard/transiction-history" className={({ isActive }) => `flex items-center gap-4 p-4 rounded-2xl transition-all ${isActive ? activeClass : normalClass}`}>
                <History size={20} /> Transaction History
              </NavLink>
            </li>

            {/* --- ADMIN ONLY SECTION --- */}
            {role === 'admin' && (
              <>
                <div className="divider my-6 text-[10px] text-brand opacity-70">Admin Management</div>
                <li>
                  <NavLink to="/user-dashboard/manage-tickets" className={({ isActive }) => `flex items-center gap-4 p-4 rounded-2xl transition-all ${isActive ? activeClass : normalClass}`}>
                    <ShieldCheck size={20} /> Manage Tickets
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/user-dashboard/manage-users" className={({ isActive }) => `flex items-center gap-4 p-4 rounded-2xl transition-all ${isActive ? activeClass : normalClass}`}>
                    <Users size={20} /> Manage Users
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/user-dashboard/advertise" className={({ isActive }) => `flex items-center gap-4 p-4 rounded-2xl transition-all ${isActive ? activeClass : normalClass}`}>
                    <Megaphone size={20} /> Advertise Tickets
                  </NavLink>
                </li>
              </>
            )}
          </ul>

          <div className="divider my-8 opacity-50"></div>

          {/* FOOTER LINKS */}
          <ul className="space-y-2 font-bold uppercase text-xs tracking-widest">
            <li>
              <Link to="/" className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
                <Home size={20} /> Back to Home
              </Link>
            </li>
            <li>
              <button onClick={handleLogout} className="flex items-center gap-4 p-4 rounded-2xl text-error hover:bg-error/10 transition-all w-full text-left">
                <LogOut size={20} /> Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default UserDashboardLayout;