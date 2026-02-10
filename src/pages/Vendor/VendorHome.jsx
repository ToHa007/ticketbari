import { Info, ShieldCheck, Zap, Star } from "lucide-react";
import useAuth from "../../hooks/useAuth";


const VendorHome = ({ vendorInfo }) => {
  const { user } = useAuth();

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Welcome Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 md:p-12 shadow-xl border border-slate-200 dark:border-slate-800 relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-4xl font-black text-slate-800 dark:text-white uppercase tracking-tighter mb-4">
            Welcome, <span className="text-brand">{vendorInfo?.businessDetails?.name || user?.displayName}</span>!
          </h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-2xl text-lg font-medium leading-relaxed">
            Your vendor account is active. You can now manage your transport fleet, 
            publish new tickets, and track your business growth from this panel.
          </p>
          
          <div className="flex flex-wrap gap-4 mt-8">
            <div className="flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-full text-sm font-bold">
              <ShieldCheck size={18} /> Verified Vendor
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-brand/10 text-brand rounded-full text-sm font-bold">
              <Zap size={18} /> Instant Booking Enabled
            </div>
          </div>
        </div>
        {/* Decorative background circle */}
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-brand/5 rounded-full blur-3xl"></div>
      </div>

      {/* Profile Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Business Card */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-slate-800 dark:text-white">
            <Info className="text-brand" /> Business Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6">
            <div>
              <p className="text-xs uppercase text-slate-400 font-bold tracking-widest mb-1">Company Role</p>
              <p className="font-semibold text-slate-700 dark:text-slate-200">{vendorInfo?.businessDetails?.companyRole || "Owner"}</p>
            </div>
            <div>
              <p className="text-xs uppercase text-slate-400 font-bold tracking-widest mb-1">Transport Type</p>
              <p className="font-semibold text-slate-700 dark:text-slate-200 uppercase">{vendorInfo?.businessDetails?.businessType || "Not Specified"}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-xs uppercase text-slate-400 font-bold tracking-widest mb-1">Business Description</p>
              <p className="text-slate-600 dark:text-slate-400 italic">
                "{vendorInfo?.businessDetails?.description || "No description provided yet."}"
              </p>
            </div>
          </div>
        </div>

        {/* Static Status Card */}
        <div className="bg-slate-900 rounded-3xl p-8 text-white flex flex-col justify-between border border-brand/20 shadow-lg shadow-brand/10">
          <div>
            <div className="flex justify-between items-start mb-6">
              <div className="p-3 bg-brand rounded-2xl">
                <Star size={24} className="text-white" fill="white" />
              </div>
              <span className="text-xs font-black bg-white/10 px-3 py-1 rounded-full uppercase">Vendor Level 1</span>
            </div>
            <h4 className="text-2xl font-bold mb-2">Service Quality</h4>
            <p className="text-slate-400 text-sm">You are maintaining a 100% response rate this week. Keep it up!</p>
          </div>
          <button className="mt-8 text-brand font-bold text-sm hover:underline text-left">View Partner Guidelines →</button>
        </div>
      </div>
    </div>
  );
};

export default VendorHome;