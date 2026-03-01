import { useState } from "react";
import { Bus, Loader2, ShieldCheck, Mail, Briefcase, FileText, Camera, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import useAuth from "../../hooks/useAuth";
import Swal from "sweetalert2";

const Vendor = () => {
  const axiosPublic = useAxiosPublic();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [preview, setPreview] = useState(null);

  const imageHostingKey = import.meta.env.VITE_IMGBB_API_KEY;
  const imageUploadUrl = `https://api.imgbb.com/1/upload?key=${imageHostingKey}`;

  // Handle Image Preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    setIsSubmitting(true);

    try {
      const imageFile = form.profilePic.files[0];
      const formData = new FormData();
      formData.append("image", imageFile);

      // 1. Upload to ImgBB
      const imageRes = await axiosPublic.post(imageUploadUrl, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (!imageRes.data.success) throw new Error("Image upload failed");

      const imageUrl = imageRes.data.data.display_url;

      // 2. Construct Payload
      const vendorData = {
        name: form.vendorName.value,
        email: form.vendorEmail.value,
        companyRole: form.role.value,
        profilePic: imageUrl,
        businessType: form.businessType.value,
        description: form.description.value,
        role: "user", // Stays user until admin approves
        vendorRequest: "pending",
        status: "pending_verification",
        appliedAt: new Date().toISOString()
      };

      // 3. Patch User Data
      const res = await axiosPublic.patch(
        `/users/become-vendor/${user?.email}`,
        vendorData
      );

      if (res.data.modifiedCount > 0 || res.data.upsertedCount > 0) {
        Swal.fire({
          title: "Application Logged!",
          text: "Our compliance team will review your fleet credentials within 24-48 hours.",
          icon: "success",
          confirmButtonColor: "#3b82f6", // Adjust to your brand primary color
          background: document.documentElement.classList.contains('dark') ? '#0f172a' : '#fff',
          color: document.documentElement.classList.contains('dark') ? '#fff' : '#000',
        });
        navigate("/"); 
      }
    } catch (error) {
      console.error(error);
      toast.error("Manifest submission failed. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen py-20 px-4 bg-slate-50 dark:bg-[#06080a] animate-in fade-in duration-700">
      <div className="max-w-4xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 mb-6 rounded-[2rem] bg-brand text-white shadow-xl shadow-brand/20 rotate-3">
            <Bus size={40} strokeWidth={2.5} />
          </div>
          <h1 className="text-6xl font-black text-slate-800 dark:text-white uppercase tracking-tighter italic">
            TicketBari <span className="text-brand">Partners</span>
          </h1>
          <p className="text-slate-500 mt-4 font-bold text-xs uppercase tracking-[0.4em] italic opacity-70">
            Official Fleet Onboarding Protocol
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Section: Representative Info */}
          <div className="bg-white dark:bg-slate-900 p-8 md:p-12 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-sm space-y-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 text-slate-100 dark:text-slate-800/50 -z-10">
                <ShieldCheck size={120} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="form-control">
                <label className="label text-[10px] font-black uppercase text-slate-400 tracking-widest"><Mail size={12} className="inline mr-2 text-brand"/> Representative Identity</label>
                <input type="text" name="vendorName" defaultValue={user?.displayName} className="input bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-black h-14" required />
              </div>
              
              <div className="form-control">
                <label className="label text-[10px] font-black uppercase text-slate-400 tracking-widest">Business Contact</label>
                <input 
                  type="email" 
                  name="vendorEmail" 
                  defaultValue={user?.email} 
                  readOnly 
                  className="input bg-slate-100 dark:bg-slate-800/50 dark:text-slate-500 border-none rounded-2xl font-black h-14 cursor-not-allowed italic" 
                />
              </div>

              <div className="form-control">
                <label className="label text-[10px] font-black uppercase text-slate-400 tracking-widest"><Briefcase size={12} className="inline mr-2 text-brand"/> Authority Role</label>
                <select name="role" className="select bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-black h-14" required>
                  <option value="owner">Managing Director / CEO</option>
                  <option value="manager">Fleet Operations Manager</option>
                  <option value="executive">Marketing Lead</option>
                </select>
              </div>

              <div className="form-control">
                <label className="label text-[10px] font-black uppercase text-slate-400 tracking-widest">Fleet Category</label>
                <select name="businessType" className="select bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-black h-14" required>
                  <option value="bus">Intercity Bus Service</option>
                  <option value="train">Railway Operator</option>
                  <option value="ship">Waterway Logistics</option>
                  <option value="air">Domestic Aviation</option>
                </select>
              </div>
            </div>

            {/* Profile Picture Upload with Preview */}
            <div className="form-control">
              <label className="label text-[10px] font-black uppercase text-slate-400 tracking-widest"><Camera size={12} className="inline mr-2 text-brand"/> Operational Headshot / Business Logo</label>
              <div className="flex flex-col md:flex-row items-center gap-6 p-6 bg-slate-50 dark:bg-slate-800/30 rounded-3xl border border-dashed border-slate-200 dark:border-slate-700">
                <div className="w-24 h-24 rounded-2xl bg-slate-200 dark:bg-slate-800 overflow-hidden flex-shrink-0 border-2 border-white dark:border-slate-700">
                    {preview ? (
                        <img src={preview} className="w-full h-full object-cover" alt="Preview" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400">
                            <Camera size={32} />
                        </div>
                    )}
                </div>
                <div className="flex-1 w-full">
                    <input 
                        type="file" 
                        name="profilePic" 
                        onChange={handleImageChange}
                        accept="image/*" 
                        className="file-input file-input-bordered w-full rounded-2xl bg-white dark:bg-slate-900 border-none font-bold" 
                        required 
                    />
                </div>
              </div>
            </div>

            <div className="form-control">
              <label className="label text-[10px] font-black uppercase text-slate-400 tracking-widest"><FileText size={12} className="inline mr-2 text-brand"/> Professional Summary</label>
              <textarea 
                name="description" 
                placeholder="Briefly describe your company's fleet size and primary routes..."
                className="textarea bg-slate-50 dark:bg-slate-800 border-none h-32 rounded-3xl font-bold p-6 focus:ring-2 ring-brand" 
                required
              ></textarea>
            </div>

            <div className="pt-4">
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="group btn bg-brand hover:bg-slate-800 dark:hover:bg-white dark:hover:text-slate-900 text-white w-full h-20 rounded-[2rem] font-black uppercase tracking-[0.2em] border-none shadow-2xl shadow-brand/30 disabled:bg-slate-300 transition-all duration-500"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-3">
                    <Loader2 className="animate-spin" size={24} /> Initiating Request...
                  </span>
                ) : (
                  <span className="flex items-center gap-3 italic">
                    Submit Partnership Application <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                  </span>
                )}
              </button>
            </div>
          </div>
        </form>

        <p className="text-center mt-10 text-[10px] font-black uppercase tracking-widest text-slate-400 opacity-50">
            By submitting, you agree to TicketBari's Vendor Compliance & Safety Standards.
        </p>
      </div>
    </div>
  );
};

export default Vendor;