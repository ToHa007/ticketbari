import { useContext } from "react";

import { Mail, ShieldCheck, MapPin, UserCircle } from "lucide-react";
import { AuthContext } from "../../Components/Context/AuthContext/AuthProvider";

const UserProfile = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="max-w-4xl">
      <header className="mb-10">
        <h2 className="text-4xl font-black text-slate-800 dark:text-white uppercase tracking-tighter">My Profile</h2>
        <p className="text-slate-500 font-medium">Manage your personal information and security.</p>
      </header>

      <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-200 dark:border-slate-800 p-8 lg:p-12 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
           <UserCircle size={200} />
        </div>
        
        <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
          <div className="avatar">
            <div className="w-32 h-32 rounded-[2.5rem] ring ring-brand ring-offset-base-100 ring-offset-2">
              <img src={user?.photoURL || "https://via.placeholder.com/150"} alt="Avatar" />
            </div>
          </div>

          <div className="space-y-4 text-center md:text-left">
            <div>
              <h3 className="text-3xl font-black text-slate-800 dark:text-white">{user?.displayName}</h3>
              <p className="flex items-center justify-center md:justify-start gap-2 text-slate-500 font-bold uppercase text-xs tracking-widest mt-1">
                <Mail size={14} className="text-brand"/> {user?.email}
              </p>
            </div>
            
            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
              <span className="badge badge-lg bg-brand/10 text-brand border-brand/20 font-bold py-4 px-6 rounded-xl">Verified Member</span>
              <span className="badge badge-lg bg-slate-100 dark:bg-slate-800 font-bold py-4 px-6 rounded-xl">User Account</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;