import { useState } from "react";
import { Bus, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import useAuth from "../../hooks/useAuth";
import Swal from "sweetalert2";

const Vendor = () => {
  const axiosPublic = useAxiosPublic();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // 1. Loading state for the submit button
  const [isSubmitting, setIsSubmitting] = useState(false);

  const imageHostingKey = import.meta.env.VITE_IMGBB_API_KEY;
  const imageUploadUrl = `https://api.imgbb.com/1/upload?key=${imageHostingKey}`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    
    setIsSubmitting(true); // Start loading

    try {
      const imageFile = form.profilePic.files[0];
      const formData = new FormData();
      formData.append("image", imageFile);

      const imageRes = await axiosPublic.post(imageUploadUrl, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (!imageRes.data.success) {
        toast.error("Image upload failed");
        setIsSubmitting(false);
        return;
      }

      const imageUrl = imageRes.data.data.display_url;

      const vendorData = {
        name: form.vendorName.value,
        email: form.vendorEmail.value,
        companyRole: form.role.value,
        profilePic: imageUrl,
        businessType: form.businessType.value,
        description: form.description.value,
        role: "user", 
        vendorRequest: "pending",
        status: "pending_verification",
      };

      const res = await axiosPublic.patch(
        `/users/become-vendor/${user?.email}`,
        vendorData
      );

      if (res.data.modifiedCount > 0 || res.data.upsertedCount > 0) {
        // 2. Alert message and redirect to home
        Swal.fire({
          title: "Request Sent!",
          text: "Your application is being reviewed by the admin. Please check back later.",
          icon: "success",
          confirmButtonColor: "#yourBrandColorHex" // Replace with your brand color hex
        });
        navigate("/"); 
      }
    } catch (error) {
      console.error("Vendor Application Error:", error);
      toast.error("Failed to submit application.");
    } finally {
      setIsSubmitting(false); // Stop loading
    }
  };

  return (
    <div className="max-w-4xl mx-auto my-10 p-6 md:p-12 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center p-3 mb-4 rounded-2xl bg-brand/10 text-brand">
          <Bus size={32} />
        </div>
        <h1 className="text-3xl font-black text-slate-800 dark:text-white uppercase tracking-tighter">
          Vendor <span className="text-brand">Partnership</span>
        </h1>
        <p className="text-slate-500 mt-2 font-medium">Apply to become a verified ticket provider</p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="form-control">
          <label className="label"><span className="label-text font-bold">Full Name</span></label>
          <input type="text" name="vendorName" defaultValue={user?.displayName} className="input input-bordered rounded-xl" required />
        </div>
        
        <div className="form-control">
          <label className="label"><span className="label-text font-bold">Business Email</span></label>
          {/* 3. Fixed the background color for dark mode/read-only */}
          <input 
            type="email" 
            name="vendorEmail" 
            defaultValue={user?.email} 
            readOnly 
            className="input input-bordered rounded-xl bg-slate-100 dark:bg-slate-800 dark:text-slate-400 cursor-not-allowed" 
          />
        </div>

        <div className="form-control">
          <label className="label"><span className="label-text font-bold">Role</span></label>
          <select name="role" className="select select-bordered rounded-xl" required>
            <option value="owner">Owner / CEO</option>
            <option value="manager">Fleet Manager</option>
          </select>
        </div>

        <div className="form-control">
          <label className="label"><span className="label-text font-bold">Transport Type</span></label>
          <select name="businessType" className="select select-bordered rounded-xl" required>
            <option value="bus">Bus Service</option>
            <option value="train">Train Operator</option>
          </select>
        </div>

        <div className="form-control md:col-span-2">
          <label className="label"><span className="label-text font-bold">Profile Picture</span></label>
          <input type="file" name="profilePic" accept="image/*" className="file-input file-input-bordered rounded-xl w-full" required />
        </div>

        <div className="form-control md:col-span-2">
          <label className="label"><span className="label-text font-bold">Description</span></label>
          <textarea name="description" className="textarea textarea-bordered h-24 rounded-xl" required></textarea>
        </div>

        <div className="md:col-span-2">
          {/* 4. Button with loading spinner */}
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="btn bg-brand hover:bg-brand/90 text-white w-full h-14 rounded-xl font-bold border-none"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <Loader2 className="animate-spin" size={20} /> Submitting...
              </span>
            ) : (
              "Submit Application"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Vendor;