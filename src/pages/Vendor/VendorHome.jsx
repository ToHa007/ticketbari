import { Info, ShieldCheck, Zap, Star, LayoutGrid, TrendingUp, Users, ArrowUpRight } from "lucide-react";
import useAuth from "../../hooks/useAuth";

const VendorHome = ({ vendorInfo }) => {
  const { user } = useAuth();

  // Mock stats - in a real app, these would come from props or a fetch
  const stats = [
    { label: "Active Tickets", value: "12", icon: LayoutGrid, color: "text-blue-500" },
    { label: "Total Bookings", value: "148", icon: Users, color: "text-emerald-500" },
    { label: "Revenue (MTD)", value: "৳42.5k", icon: TrendingUp, color: "text-brand" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      
      {/* 1. Dynamic Welcome Hero */}
      <div className="relative overflow-hidden bg-white dark:bg-slate-900 rounded-[3rem] p-10 md:p-14 border border-slate-200 dark:border-slate-800 shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand/10 text-brand text-[10px] font-black uppercase tracking-widest mb-4">
              <Star size={12} fill="currentColor" /> Premium Partner
            </div>
            <h2 className="text-5xl font-black text-slate-800 dark:text-white uppercase tracking-tighter italic leading-none mb-6">
              Welcome, <span className="text-brand">{vendorInfo?.businessDetails?.name || user?.displayName}</span>
            </h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-xl text-lg font-bold italic opacity-80">
              Your fleet is operational. Ready to scale your transit empire today?
            </p>
            
            <div className="flex flex-wrap gap-3 mt-8">
              <div className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-2xl text-xs font-black uppercase tracking-tighter border border-emerald-500/20">
                <ShieldCheck size={16} strokeWidth={3} /> Verified Asset Provider
              </div>
              <div className="flex items-center gap-2 px-5 py-2.5 bg-brand/10 text-brand rounded-2xl text-xs font-black uppercase tracking-tighter border border-brand/20">
                <Zap size={16} strokeWidth={3} /> Express Payouts Enabled
              </div>
            </div>
          </div>

          {/* Quick Metrics Overlay */}
          <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-1 gap-4 w-full md:w-64">
            {stats.map((stat, idx) => (
              <div key={idx} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700/50 flex items-center justify-between group hover:border-brand transition-colors">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                  <p className={`text-xl font-black ${stat.color}`}>{stat.value}</p>
                </div>
                <stat.icon size={20} className="text-slate-300 group-hover:text-brand transition-colors" />
              </div>
            ))}
          </div>
        </div>
        
        {/* Abstract Background Elements */}
        <div className="absolute -right-10 -bottom-10 w-80 h-80 bg-brand/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute left-1/2 top-0 w-40 h-40 bg-blue-500/5 rounded-full blur-[80px] pointer-events-none"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 2. Business Profile Deep-Dive */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-[3rem] p-10 border border-slate-200 dark:border-slate-800 shadow-sm relative group">
          <div className="flex justify-between items-start mb-10">
            <h3 className="text-2xl font-black uppercase tracking-tighter italic flex items-center gap-3 text-slate-800 dark:text-white">
              <Info className="text-brand" size={24} /> Company Profile
            </h3>
            <button className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl text-slate-400 hover:text-brand hover:bg-brand/10 transition-all">
                <ArrowUpRight size={20} />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-6">
              <div className="p-6 bg-slate-50 dark:bg-slate-800/40 rounded-[2rem] border border-slate-100 dark:border-slate-700">
                <p className="text-[10px] uppercase text-slate-400 font-black tracking-widest mb-2">Executive Lead</p>
                <p className="text-lg font-black text-slate-700 dark:text-slate-200 uppercase italic leading-none">
                  {vendorInfo?.businessDetails?.companyRole || "Chief Fleet Officer"}
                </p>
              </div>
              <div className="p-6 bg-slate-50 dark:bg-slate-800/40 rounded-[2rem] border border-slate-100 dark:border-slate-700">
                <p className="text-[10px] uppercase text-slate-400 font-black tracking-widest mb-2">Primary Domain</p>
                <p className="text-lg font-black text-brand uppercase italic leading-none tracking-widest">
                  {vendorInfo?.businessDetails?.businessType || "Multi-Modal"} Logistics
                </p>
              </div>
            </div>

            <div className="relative">
              <p className="text-[10px] uppercase text-slate-400 font-black tracking-widest mb-4 flex items-center gap-2">
                <FileText size={12} /> Partner Vision
              </p>
              <div className="relative p-6 bg-brand/[0.03] dark:bg-brand/[0.02] rounded-[2rem] border border-brand/10 h-full min-h-[120px]">
                <p className="text-slate-600 dark:text-slate-400 font-bold italic leading-relaxed text-sm">
                  "{vendorInfo?.businessDetails?.description || "Providing seamless transit solutions for the next generation of travelers."}"
                </p>
                <div className="absolute bottom-4 right-4 text-brand/20">
                    <Zap size={40} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Loyalty & Quality Card */}
        <div className="bg-slate-900 dark:bg-black rounded-[3rem] p-10 text-white flex flex-col justify-between border border-brand/30 shadow-2xl shadow-brand/10 relative overflow-hidden group">
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-8">
              <div className="w-14 h-14 bg-brand rounded-2xl flex items-center justify-center shadow-lg shadow-brand/40 group-hover:rotate-12 transition-transform duration-500">
                <Star size={28} className="text-white" fill="white" />
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-black text-brand uppercase tracking-widest">Trust Score</span>
                <span className="text-2xl font-black tracking-tighter">98.4%</span>
              </div>
            </div>
            
            <h4 className="text-3xl font-black uppercase italic tracking-tighter mb-4">Elite Status</h4>
            <p className="text-slate-400 font-bold text-sm leading-relaxed mb-6">
              You're in the top 5% of providers this month. Tier 2 rewards unlock in 12 more successful trips.
            </p>

            {/* Progress Bar */}
            <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-500">
                    <span>Level 1</span>
                    <span>Level 2</span>
                </div>
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-brand w-[70%] rounded-full shadow-[0_0_15px_rgba(255,25,93,0.5)]"></div>
                </div>
            </div>
          </div>
          
          <button className="relative z-10 mt-10 flex items-center gap-2 text-brand font-black uppercase text-[10px] tracking-[0.2em] hover:text-white transition-colors group/btn">
            Partner Roadmap <ArrowUpRight size={14} className="group-hover/btn:-translate-y-1 group-hover/btn:translate-x-1 transition-transform" />
          </button>

          {/* Background Grid Pattern */}
          <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]"></div>
        </div>
      </div>
    </div>
  );
};

export default VendorHome;