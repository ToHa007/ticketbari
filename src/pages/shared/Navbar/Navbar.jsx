import { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { HiMenuAlt1 } from "react-icons/hi";
import { Store, LayoutDashboard } from "lucide-react"; 
import useAuth from "../../../hooks/useAuth"; 
import axios from "axios";

const Navbar = ({ theme, toggleTheme }) => {
  const { user, logOut } = useAuth();
  const [role, setRole] = useState(null);

 
  useEffect(() => {
    if (user?.email) {
      axios.get(`http://localhost:5000/users/role/${user.email}`)
        .then(res => setRole(res.data.role))
        .catch(err => console.error("Role fetch error:", err));
    } else {
      setRole(null);
    }
  }, [user]);

  const handleLogout = () => {
    logOut()
      .then(() => {})
      .catch((err) => console.error(err));
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-base-100/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
      <div className="navbar max-w-7xl mx-auto px-2 md:px-4">
        
        {/* Navbar Start */}
        <div className="navbar-start">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
              <HiMenuAlt1 className="text-2xl" />
            </div>

            {/* Mobile Menu */}
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow-lg bg-base-100 rounded-box w-52 border border-brand/20"
            >
              <li>
                <NavLink to="/" className={({ isActive }) => isActive ? "text-brand font-bold" : "hover:text-brand"}>Home</NavLink>
              </li>
              <li>
                <NavLink to="/all-tickets" className={({ isActive }) => isActive ? "text-brand font-bold" : "hover:text-brand"}>All Tickets</NavLink>
              </li>

              {user && (
                <>
                  <li>
                    <NavLink to="/user-dashboard" className={({ isActive }) => isActive ? "text-brand font-bold" : "hover:text-brand"}>User Dashboard</NavLink>
                  </li>
                  {role === 'vendor' && (
                    <li>
                      <NavLink to="/dashboard" className={({ isActive }) => isActive ? "text-brand font-bold" : "hover:text-brand"}>Vendor Dashboard</NavLink>
                    </li>
                  )}
                  {role !== 'vendor' && (
                    <li>
                      <Link to="/beAVendor" className="text-brand font-bold italic">Be a Vendor</Link>
                    </li>
                  )}
                </>
              )}
            </ul>
          </div>

          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-brand dark:bg-brand-light p-1.5 rounded-xl transition-transform group-hover:rotate-12">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white dark:text-dark-bg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </div>
            <span className="text-xl md:text-2xl font-black tracking-tighter uppercase text-slate-800 dark:text-white">
              Ticket<span className="text-brand dark:text-brand-light">Bari</span>
            </span>
          </Link>
        </div>

        {/* Navbar Center */}
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1 gap-6 font-semibold uppercase text-sm tracking-wide">
            <li>
              <NavLink to="/" className={({ isActive }) => isActive ? "text-brand font-bold" : "hover:text-brand"}>Home</NavLink>
            </li>
            <li>
              <NavLink to="/all-tickets" className={({ isActive }) => isActive ? "text-brand font-bold" : "hover:text-brand"}>All Tickets</NavLink>
            </li>
          </ul>
        </div>

        {/* Navbar End */}
        <div className="navbar-end gap-2 md:gap-4">
          {user && (
            <>
              {/* User Dashboard button */}
              <Link
                to="/user-dashboard"
                className="hidden md:flex items-center gap-2 px-4 py-2 bg-brand/10 text-brand dark:text-brand-light text-sm font-bold rounded-full transition-all hover:bg-brand hover:text-white"
              >
                <LayoutDashboard size={18} />
                <span>User Dashboard</span>
              </Link>

              {/* Vendor Dashboard button if vendor */}
              {role === 'vendor' && (
                <Link
                  to="/dashboard"
                  className="hidden md:flex items-center gap-2 px-4 py-2 bg-brand/10 text-brand dark:text-brand-light text-sm font-bold rounded-full transition-all hover:bg-brand hover:text-white"
                >
                  <LayoutDashboard size={18} />
                  <span>Vendor Dashboard</span>
                </Link>
              )}

              {/* Be a Vendor button if not a vendor */}
              {role !== 'vendor' && (
                <Link
                  to="/beAVendor"
                  className="hidden md:flex items-center gap-2 px-4 py-2 border border-brand/30 hover:border-brand text-brand dark:text-brand-light text-sm font-bold rounded-full transition-all hover:bg-brand/5 active:scale-95"
                >
                  <Store size={18} />
                  <span>Be a Vendor</span>
                </Link>
              )}
            </>
          )}

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="btn btn-ghost btn-circle text-xl"
          >
            {theme === "light" ? "🌙" : "☀️"}
          </button>

          {/* Profile or Login */}
          {user ? (
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar border-2 border-brand dark:border-brand-light ring-offset-2 ring-offset-base-100 transition-all"
              >
                <div className="w-10 rounded-full">
                  <img src={user?.photoURL || "https://i.ibb.co/mR70932/user.png"} alt="profile" />
                </div>
              </div>
              <ul
                tabIndex={0}
                className="mt-3 z-[1] p-2 shadow-xl menu menu-sm dropdown-content bg-base-100 rounded-box w-52 border border-slate-200 dark:border-slate-800"
              >
                <li className="px-4 py-3 font-bold border-b border-slate-100 dark:border-slate-800 mb-2">
                  <span className="text-brand dark:text-brand-light block truncate">
                    {user?.displayName}
                  </span>
                </li>
                <li><Link to="/user-dashboard" className="py-2">My Profile</Link></li>
                <li>
                  <button onClick={handleLogout} className="text-error font-medium py-2 hover:bg-error/10">
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          ) : (
            <Link
              to="/login"
              className="btn bg-brand hover:bg-brand/90 dark:bg-brand-light dark:hover:bg-brand-light/90 text-white dark:text-dark-bg border-none px-6 rounded-full shadow-lg shadow-brand/20 transition-all hover:-translate-y-0.5"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
