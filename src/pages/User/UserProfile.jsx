import { useContext } from "react";
import { Mail, ShieldCheck, MapPin, UserCircle, Ticket, CreditCard, Settings, Camera } from "lucide-react";
import { AuthContext } from "../../Components/Context/AuthContext/AuthProvider";

const UserProfile = () => {
  const { user } = useContext(AuthContext);

  // Mock stats - in a real app, you'd fetch these or pass as props
  const userStats = [
    { label: "Total Bookings", value: "12", icon: Ticket, color: "text-blue-500" },
    { label: "Points Earned", value: "2,450", icon: ShieldCheck, color: "text-emerald-500" },
    { label: "Active Trips", value: "02", icon: MapPin, color: "text-brand" },
  ];

  return (
    <div className="max-w-5xl animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="mb-10 flex justify-between items-end">
        <div>
          <h2 className="text-5xl font-black text-slate-800 dark:text-white uppercase tracking-tighter italic">
            My <span className="text-brand">Profile</span>
          </h2>
          <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.3em] mt-2">
            Identity & Security Management
          </p>
        </div>
        <button className="hidden md:flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-50 transition-colors shadow-sm">
            <Settings size={14} /> Edit Settings
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Identity Card */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-[3.5rem] border border-slate-200 dark:border-slate-800 p-8 lg:p-12 shadow-2xl shadow-slate-200/50 dark:shadow-none relative overflow-hidden group">
          {/* Background Decoration */}
          <div className="absolute top-0 right-0 p-8 opacity-[0.03] dark:opacity-[0.05] pointer-events-none group-hover:scale-110 transition-transform duration-1000">
            <UserCircle size={300} />
          </div>
          
          <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
            <div className="relative">
              <div className="w-40 h-40 rounded-[3rem] ring-4 ring-brand/20 ring-offset-4 ring-offset-white dark:ring-offset-slate-900 overflow-hidden shadow-2xl">
                <img 
                    src={user?.photoURL || "https://i.ibb.co/3S3S8RS/avatar-placeholder.png"} 
                    alt="Avatar" 
                    className="w-full h-full object-cover"
                />
              </div>
              <button className="absolute -bottom-2 -right-2 p-3 bg-brand text-white rounded-2xl shadow-lg hover:scale-110 transition-transform">
                <Camera size={18} />
              </button>
            </div>

            <div className="space-y-6 text-center md:text-left">
              <div>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-2">
                    <span className="px-3 py-1 bg-brand/10 text-brand text-[10px] font-black uppercase tracking-widest rounded-lg border border-brand/20">
                        Premium Member
                    </span>
                    <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase tracking-widest rounded-lg border border-emerald-500/20 flex items-center gap-1">
                        <ShieldCheck size={10} /> Active
                    </span>
                </div>
                <h3 className="text-4xl font-black text-slate-800 dark:text-white tracking-tighter italic">
                    {user?.displayName || "Adventurer"}
                </h3>
                <p className="flex items-center justify-center md:justify-start gap-2 text-slate-400 font-bold text-sm mt-1 lowercase">
                  <Mail size={14} className="text-brand"/> {user?.email}
                </p>
              </div>
              
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap gap-4 justify-center md:justify-start">
                 <div className="flex flex-col">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Account ID</span>
                    <span className="font-mono text-xs text-slate-600 dark:text-slate-400">USR-{user?.uid?.substring(0, 8).toUpperCase() || "8329-XQ"}</span>
                 </div>
              </div>
            </div>
          </div>
        </div>

        {/* Security & Quick Actions */}
        <div className="bg-brand rounded-[3.5rem] p-10 text-white shadow-2xl shadow-brand/30 relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
            
            <div className="relative z-10">
                <h4 className="text-xl font-black uppercase tracking-tighter mb-2 italic">Quick Payment</h4>
                <p className="text-white/70 text-xs font-bold leading-relaxed mb-6 italic">Save time on your next booking by linking your card.</p>
                
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 flex items-center gap-4 hover:bg-white/20 transition-colors cursor-pointer group">
                    <div className="bg-white text-brand p-2 rounded-xl group-hover:rotate-12 transition-transform">
                        <CreditCard size={20} />
                    </div>
                    <span className="text-sm font-black uppercase tracking-widest">Add New Card</span>
                </div>
            </div>

            <div className="mt-8 pt-8 border-t border-white/10">
                <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">Security Health</p>
                <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-white/20 rounded-full overflow-hidden">
                        <div className="w-[85%] h-full bg-white rounded-full"></div>
                    </div>
                    <span className="text-xs font-bold italic">85%</span>
                </div>
            </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        {userStats.map((stat, idx) => (
          <div key={idx} className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-6 group hover:border-brand/30 transition-all">
            <div className={`p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl ${stat.color} group-hover:scale-110 transition-transform shadow-sm`}>
                <stat.icon size={24} />
            </div>
            <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                <p className="text-2xl font-black text-slate-800 dark:text-white tracking-tighter">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserProfile;