import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import { Save, ArrowLeft, Image as ImageIcon, MapPin, Calendar, Clock, Banknote, Users, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

const image_hosting_key = import.meta.env.VITE_IMAGE_HOSTING_KEY;
const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;

const UpdateTicket = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const axiosPublic = useAxiosPublic();
    const [loading, setLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);
    const [existingImage, setExistingImage] = useState("");
    const { register, handleSubmit, reset, watch } = useForm();

    // Watch the image field to show a "New File Selected" hint
    const newImage = watch("image");

    useEffect(() => {
        axiosPublic.get(`/tickets/${id}`)
            .then(res => {
                setExistingImage(res.data.image);
                reset(res.data);
                setLoading(false);
            })
            .catch(() => {
                toast.error("Could not load ticket data");
                setLoading(false);
            });
    }, [id, axiosPublic, reset]);

    const onSubmit = async (data) => {
        setIsUpdating(true);
        let finalImageUrl = existingImage;

        try {
            if (data.image?.[0]) {
                const formData = new FormData();
                formData.append('image', data.image[0]);

                const res = await fetch(image_hosting_api, {
                    method: 'POST',
                    body: formData
                });
                const imgData = await res.json();

                if (imgData.success) {
                    finalImageUrl = imgData.data.display_url;
                } else {
                    throw new Error("Image upload failed");
                }
            }

            const updatedTicket = {
                ...data,
                image: finalImageUrl,
                status: 'pending', 
                price: parseFloat(data.price),
                quantity: parseInt(data.quantity)
            };

            const res = await axiosPublic.put(`/tickets/${id}`, updatedTicket);
            if (res.data.modifiedCount > 0) {
                toast.success("Manifest updated and sent for review!");
                navigate("/dashboard/my-tickets");
            }
        } catch (error) {
            toast.error(error.message || "Update failed");
        } finally {
            setIsUpdating(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
            <Loader2 className="animate-spin text-brand" size={48} />
            <p className="font-black text-brand uppercase tracking-[0.4em] text-xs">Fetching Manifest...</p>
        </div>
    );

    return (
        <div className="max-w-5xl mx-auto p-6 lg:p-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Navigation Header */}
            <div className="flex justify-between items-center mb-10">
                <button 
                    onClick={() => navigate(-1)} 
                    className="group flex items-center gap-3 text-slate-400 font-black uppercase text-[10px] tracking-widest hover:text-brand transition-all"
                >
                    <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 group-hover:bg-brand/10 transition-colors">
                        <ArrowLeft size={16} />
                    </div>
                    Back to Fleet
                </button>
                <div className="px-4 py-1.5 bg-brand/10 text-brand rounded-full text-[10px] font-black uppercase tracking-widest border border-brand/20">
                    Editing ID: {id.substring(0, 8)}
                </div>
            </div>

            <header className="mb-12">
                <h2 className="text-5xl font-black uppercase tracking-tighter italic dark:text-white">
                    Edit <span className="text-brand">Journey</span>
                </h2>
                <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mt-2 italic opacity-70">
                    Modifying this data will trigger a re-verification process.
                </p>
            </header>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                
                {/* 1. Vehicle & Media Section */}
                <section className="bg-white dark:bg-slate-900 p-8 lg:p-10 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-sm space-y-8">
                    <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                        <ImageIcon size={18} className="text-brand" />
                        <h3 className="font-black uppercase tracking-tighter italic text-slate-800 dark:text-white">Vehicle Identity</h3>
                    </div>

                    <div className="flex flex-col md:flex-row items-center gap-10">
                        <div className="relative group">
                            <div className="w-56 h-36 rounded-[2rem] overflow-hidden border-4 border-white dark:border-slate-800 shadow-2xl relative">
                                <img src={existingImage} alt="Current" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                {newImage?.[0] && (
                                    <div className="absolute inset-0 bg-brand/80 backdrop-blur-sm flex items-center justify-center text-white font-black text-[10px] uppercase tracking-widest text-center px-4">
                                        New Image Selected
                                    </div>
                                )}
                            </div>
                        </div>
                        
                        <div className="flex-1 w-full space-y-4">
                            <div className="form-control">
                                <label className="label text-[10px] font-black uppercase text-slate-400 tracking-widest">Update Photo</label>
                                <input 
                                    type="file" 
                                    {...register("image")} 
                                    className="file-input file-input-bordered w-full rounded-2xl bg-slate-50 dark:bg-slate-800 border-none font-bold" 
                                />
                                <p className="text-[9px] text-slate-400 mt-2 font-bold italic uppercase tracking-tighter">Current media will be retained if left empty.</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="form-control">
                            <label className="label text-[10px] font-black uppercase text-slate-400">Coach Name</label>
                            <input {...register("coachName")} className="input bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-black text-slate-700 dark:text-white" required />
                        </div>
                        <div className="form-control">
                            <label className="label text-[10px] font-black uppercase text-slate-400">Transport Type</label>
                            <select {...register("type")} className="select bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-black text-slate-700 dark:text-white uppercase tracking-tighter">
                                <option value="bus">Bus</option>
                                <option value="train">Train</option>
                                <option value="ship">Ship/Launch</option>
                            </select>
                        </div>
                        <div className="form-control">
                            <label className="label text-[10px] font-black uppercase text-slate-400">Class</label>
                            <input {...register("classType")} className="input bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-black text-slate-700 dark:text-white" placeholder="e.g. Business/AC" />
                        </div>
                    </div>
                </section>

                {/* 2. Route & Logistics Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <section className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
                        <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                            <MapPin size={18} className="text-brand" />
                            <h3 className="font-black uppercase tracking-tighter italic text-slate-800 dark:text-white">Route Details</h3>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="form-control">
                                <label className="label text-[10px] font-black text-slate-400">From</label>
                                <input {...register("from")} className="input bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-black" required />
                            </div>
                            <div className="form-control">
                                <label className="label text-[10px] font-black text-slate-400">To</label>
                                <input {...register("to")} className="input bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-black" required />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="form-control">
                                <label className="label text-[10px] font-black text-slate-400"><Calendar size={12} className="inline mr-1"/> Date</label>
                                <input type="date" {...register("date")} className="input bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-black" required />
                            </div>
                            <div className="form-control">
                                <label className="label text-[10px] font-black text-slate-400"><Clock size={12} className="inline mr-1"/> Time</label>
                                <input type="time" {...register("time")} className="input bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-black" required />
                            </div>
                        </div>
                    </section>

                    <section className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
                        <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                            <Banknote size={18} className="text-brand" />
                            <h3 className="font-black uppercase tracking-tighter italic text-slate-800 dark:text-white">Pricing & Capacity</h3>
                        </div>
                        <div className="form-control">
                            <label className="label text-[10px] font-black text-slate-400">Ticket Fare (৳)</label>
                            <input type="number" {...register("price")} className="input bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-black text-2xl text-brand" required />
                        </div>
                        <div className="form-control">
                            <label className="label text-[10px] font-black text-slate-400">Available Seats</label>
                            <div className="flex items-center gap-4">
                                <Users size={20} className="text-slate-300" />
                                <input type="number" {...register("quantity")} className="input flex-1 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-black" required />
                            </div>
                        </div>
                    </section>
                </div>

                {/* Submit Action */}
                <div className="flex flex-col md:flex-row gap-4">
                    <button 
                        type="submit" 
                        disabled={isUpdating}
                        className="flex-1 btn bg-brand hover:bg-brand/90 text-white h-20 rounded-[2rem] font-black uppercase tracking-[0.2em] shadow-2xl shadow-brand/20 border-none disabled:bg-slate-300"
                    >
                        {isUpdating ? (
                            <span className="flex items-center gap-3"><Loader2 className="animate-spin" /> Processing...</span>
                        ) : (
                            <span className="flex items-center gap-3 uppercase italic"><Save size={20} /> Finalize Manifest Update</span>
                        )}
                    </button>
                    <button 
                        type="button" 
                        onClick={() => navigate(-1)}
                        className="btn bg-slate-100 dark:bg-slate-800 text-slate-500 h-20 px-10 rounded-[2rem] border-none font-black uppercase tracking-widest hover:bg-red-50 hover:text-red-500 transition-all"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default UpdateTicket;