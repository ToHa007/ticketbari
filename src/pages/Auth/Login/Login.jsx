import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bus, Zap, Loader2 } from "lucide-react";
import { FaGoogle } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";
import useAuth from "../../../hooks/useAuth";

const Login = () => {
  const { signInUser, googleSignIn } = useAuth();
  const navigate = useNavigate();
  const [isQuickLoading, setIsQuickLoading] = useState(false);

  // 1. Handle Standard Login
  const handleLogin = (e) => {
    e.preventDefault();
    // Capture the loading toast ID
    const toastId = toast.loading("Verifying credentials...");
    
    const email = e.target.email.value;
    const password = e.target.password.value;

    signInUser(email, password)
      .then(() => {
        // Replace the loading toast with success using the ID
        toast.success(`Welcome back 👋`, { id: toastId });
        navigate("/");
      })
      .catch((error) => {
        // Replace the loading toast with error using the ID
        toast.error(error.message, { id: toastId });
      });
  };

  // 2. Handle Google Login
  const handleGoogleLogin = () => {
    const toastId = toast.loading("Connecting to Google...");

    googleSignIn()
      .then((result) => {
        toast.success(`Welcome, ${result.user.displayName || "User"} 👋`, { id: toastId });
        navigate("/");
      })
      .catch((err) => {
        toast.error(err.message, { id: toastId });
      });
  };

  // 3. Handle Direct (Quick) Login for Demo
  const handleQuickLogin = async () => {
    setIsQuickLoading(true);
    const toastId = toast.loading("Accessing encrypted channel...");
    
    try {
      const demoEmail = "vendor@ticketbari.com"; 
      const demoPassword = "Password123!"; 
      
      await signInUser(demoEmail, demoPassword);
      
      toast.success("Demo access granted! Welcome, Vendor.", { id: toastId });
      navigate("/");
    } catch (error) {
      toast.error("Quick access failed. Please use manual login.", { id: toastId });
    } finally {
      setIsQuickLoading(false);
    }
  };

  return (
    <>
      {/* Set a global duration just in case */}
      <Toaster position="top-right" toastOptions={{ duration: 4000 }} />

      <div className="bg-white dark:bg-slate-900 p-6 md:p-10 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-2xl max-w-md mx-auto my-10 animate-in fade-in zoom-in duration-500">
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="flex items-center gap-2 mb-2 p-3 bg-brand/10 rounded-2xl rotate-3">
            <Bus className="h-8 w-8 text-brand" />
          </div>
          <span className="text-2xl font-black uppercase tracking-tighter italic text-slate-800 dark:text-white">
            Ticket<span className="text-brand">Bari</span>
          </span>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mt-1 opacity-70">
            Official System Access
          </p>
        </div>

        {/* Manual Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="form-control">
            <input 
              name="email" 
              type="email" 
              required 
              placeholder="Email" 
              className="input input-bordered w-full rounded-2xl bg-slate-50 dark:bg-slate-800 border-none font-bold placeholder:text-slate-400" 
            />
          </div>
          <div className="form-control">
            <input 
              name="password" 
              type="password" 
              required 
              placeholder="Password" 
              className="input input-bordered w-full rounded-2xl bg-slate-50 dark:bg-slate-800 border-none font-bold placeholder:text-slate-400" 
            />
          </div>

          <button className="btn bg-brand hover:bg-brand/90 border-none text-white w-full h-14 rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-brand/20">
            Sign In
          </button>
        </form>

        <div className="divider my-8 text-[10px] font-black uppercase text-slate-400 opacity-50 tracking-widest">
          External Identity
        </div>

        <div className="grid grid-cols-1 gap-4">
          {/* Google Login */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="btn btn-outline border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 w-full flex gap-3 justify-center rounded-2xl h-14 font-bold text-slate-600 dark:text-slate-300 transition-all"
          >
            <FaGoogle className="text-red-500" /> Google Login
          </button>

          {/* ⚡ DIRECT LOGIN BUTTON ⚡ */}
          <button
            type="button"
            onClick={handleQuickLogin}
            disabled={isQuickLoading}
            className="group relative flex items-center justify-center gap-3 w-full h-16 bg-slate-900 dark:bg-brand/10 border-2 border-slate-800 dark:border-brand/20 rounded-2xl overflow-hidden transition-all hover:border-brand"
          >
            <div className="absolute inset-0 bg-brand translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            
            {isQuickLoading ? (
              <Loader2 className="animate-spin text-brand relative z-10" />
            ) : (
              <>
                <Zap size={18} className="text-brand group-hover:text-white fill-brand group-hover:fill-white relative z-10 transition-colors" />
                <span className="font-black uppercase tracking-[0.15em] text-[11px] italic text-white relative z-10 transition-colors">
                  One-Click Demo Access
                </span>
              </>
            )}
          </button>
        </div>

        <p className="text-center mt-8 text-sm font-medium text-slate-500">
          Don’t have an account?{" "}
          <Link to="/register" className="text-brand font-black hover:underline underline-offset-4">
            Register
          </Link>
        </p>
      </div>
    </>
  );
};

export default Login;