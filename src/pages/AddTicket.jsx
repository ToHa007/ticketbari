import { useState } from "react";
import { useForm } from "react-hook-form";
import { Ticket, MapPin, Calendar, Clock, Banknote, Users, Image as ImageIcon, Loader2, Sparkles } from "lucide-react";
import toast from "react-hot-toast";
import useAuth from "../hooks/useAuth";
import useAxiosPublic from "../hooks/useAxiosPublic";
import axios from "axios";
import Swal from "sweetalert2";

const AddTicket = () => {
    const { user } = useAuth();
    const axiosPublic = useAxiosPublic();
    const { register, handleSubmit, reset } = useForm();
    const [loading, setLoading] = useState(false);

    const onSubmit = async (data) => {
        setLoading(true);
        const toastId = toast.loading("Syncing with satellite... 🛰️");

        try {
            const formData = new FormData();
            formData.append("image", data.image[0]);

            const imgRes = await axios.post(
                `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_API_KEY}`,
                formData
            );

            if (imgRes.data.success) {
                const ticketInfo = {
                    type: data.type,
                    coachName: data.coachName,
                    from: data.from,
                    to: data.to,
                    date: data.date,
                    time: data.time,
                    classType: data.classType || "Standard",
                    image: imgRes.data.data.display_url,
                    price: parseFloat(data.price),
                    availableSeats: parseInt(data.availableSeats),
                    vendorEmail: user?.email,
                    vendorName: user?.displayName,
                    status: "pending",
                    advertised: false,
                    createdAt: new Date(),
                };

                const res = await axiosPublic.post("/tickets", ticketInfo);
                if (res.data.insertedId) {
                    Swal.fire({
                        title: "Manifest Published!",
                        text: "Admin review has been triggered. You'll be notified upon approval.",
                        icon: "success",
                        confirmButtonColor: "#fbbf24",
                        background: document.documentElement.classList.contains('dark') ? '#0f172a' : '#fff',
                        color: document.documentElement.classList.contains('dark') ? '#fff' : '#000',
                    });
                    reset();
                }
            }
        } catch (error) {
            toast.error("Manifest error: Connection timed out.");
        } finally {
            setLoading(false);
            toast.dismiss(toastId);
        }
    };

    return (
        <div className="max-w-5xl mx-auto my-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
                <div className="flex items-center gap-5">
                    <div className="p-4 bg-brand text-white rounded-[1.5rem] shadow-xl shadow-brand/20 -rotate-3">
                        <Ticket size={32} />
                    </div>
                    <div>
                        <h2 className="text-4xl font-black uppercase tracking-tighter italic dark:text-white">
                            Launch <span className="text-brand">Journey</span>
                        </h2>
                        <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mt-1 opacity-70">
                            Create a new manifest for verification
                        </p>
                    </div>
                </div>
                <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-500">
                    <Sparkles size={12} className="text-brand" /> Instant Approval Level: 0
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                
                {/* 1. Identity Section */}
                <div className="bg-white dark:bg-slate-900 p-8 md:p-10 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm space-y-8">
                    <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                        <ImageIcon size={18} className="text-brand" />
                        <h3 className="font-black uppercase tracking-tighter italic text-slate-800 dark:text-white">Vehicle Identity</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="form-control">
                            <label className="label text-[10px] font-black uppercase text-slate-400">Transport Class</label>
                            <select {...register("type")} className="select bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-black h-14" required>
                                <option value="bus">Luxury Bus</option>
                                <option value="train">Express Train</option>
                                <option value="ship">Ship / Launch</option>
                            </select>
                        </div>
                        <div className="form-control md:col-span-2">
                            <label className="label text-[10px] font-black uppercase text-slate-400">Coach / Fleet Name</label>
                            <input {...register("coachName")} placeholder="e.g. Green Line AC-710" className="input bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-black h-14" required />
                        </div>
                        <div className="form-control md:col-span-3">
                            <label className="label text-[10px] font-black uppercase text-slate-400">Coach Media</label>
                            <input type="file" {...register("image")} className="file-input file-input-bordered w-full rounded-2xl bg-slate-50 dark:bg-slate-800 border-none font-bold" required />
                        </div>
                    </div>
                </div>

                {/* 2. Logistics & Route Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
                        <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                            <MapPin size={18} className="text-brand" />
                            <h3 className="font-black uppercase tracking-tighter italic text-slate-800 dark:text-white">Route Mapping</h3>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="form-control">
                                <label className="label text-[10px] font-black text-slate-400">Origin</label>
                                <input {...register("from")} className="input bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-black" required />
                            </div>
                            <div className="form-control">
                                <label className="label text-[10px] font-black text-slate-400">Destination</label>
                                <input {...register("to")} className="input bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-black" required />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="form-control">
                                <label className="label text-[10px] font-black text-slate-400"><Calendar size={12} className="mr-1 inline" /> Departure</label>
                                <input type="date" {...register("date")} min={new Date().toISOString().split("T")[0]} className="input bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-black" required />
                            </div>
                            <div className="form-control">
                                <label className="label text-[10px] font-black text-slate-400"><Clock size={12} className="mr-1 inline" /> Arrival Time</label>
                                <input type="time" {...register("time")} className="input bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-black" required />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
                        <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                            <Banknote size={18} className="text-brand" />
                            <h3 className="font-black uppercase tracking-tighter italic text-slate-800 dark:text-white">Fare & Capacity</h3>
                        </div>
                        <div className="form-control">
                            <label className="label text-[10px] font-black text-slate-400">Fare per Seat (৳)</label>
                            <input type="number" {...register("price")} className="input bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-black text-2xl text-brand h-16" required />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="form-control">
                                <label className="label text-[10px] font-black text-slate-400">Available Seats</label>
                                <div className="flex items-center gap-3">
                                    <Users size={16} className="text-slate-300" />
                                    <input type="number" {...register("availableSeats")} className="input flex-1 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-black" required />
                                </div>
                            </div>
                            <div className="form-control">
                                <label className="label text-[10px] font-black text-slate-400">Class</label>
                                <input {...register("classType")} placeholder="e.g. Sleeper/AC" className="input bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-black" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Submission CTA */}
                <button 
                    type="submit" 
                    disabled={loading}
                    className="btn bg-brand hover:bg-slate-800 dark:hover:bg-white dark:hover:text-slate-900 text-white w-full h-20 rounded-[2.5rem] font-black uppercase tracking-[0.2em] border-none shadow-2xl shadow-brand/20 disabled:bg-slate-300 transition-all duration-500"
                >
                    {loading ? (
                        <span className="flex items-center gap-3"><Loader2 className="animate-spin" /> Publishing...</span>
                    ) : (
                        <span className="flex items-center gap-3 italic">Launch New Manifest</span>
                    )}
                </button>
            </form>
        </div>
    );
};

export default AddTicket;