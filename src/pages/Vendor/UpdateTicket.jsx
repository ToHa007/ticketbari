import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import { Save, ArrowLeft, Upload, Users, MapPin, Calendar, Clock } from "lucide-react";
import { useEffect, useState } from "react";

// Get ImgBB API Key from .env
const image_hosting_key = import.meta.env.VITE_IMAGE_HOSTING_KEY;
const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;

const UpdateTicket = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const axiosPublic = useAxiosPublic();
    const [loading, setLoading] = useState(true);
    const [existingImage, setExistingImage] = useState("");
    const { register, handleSubmit, reset } = useForm();

    useEffect(() => {
        axiosPublic.get(`/tickets/${id}`)
            .then(res => {
                setExistingImage(res.data.image); // Store old image
                reset(res.data);
                setLoading(false);
            })
            .catch(() => {
                toast.error("Could not load ticket data");
                setLoading(false);
            });
    }, [id, axiosPublic, reset]);

    const onSubmit = async (data) => {
        let finalImageUrl = existingImage;

        // 1. Upload new image if selected
        if (data.image[0]) {
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
                return toast.error("Image upload failed");
            }
        }

        // 2. Prepare final update object
        const updatedTicket = {
            ...data,
            image: finalImageUrl,
            status: 'pending', // Re-verify after update
            price: parseFloat(data.price),
            quantity: parseInt(data.quantity)
        };

        // 3. Send to Backend
        try {
            const res = await axiosPublic.put(`/tickets/${id}`, updatedTicket);
            if (res.data.modifiedCount > 0) {
                toast.success("Ticket fully updated & pending review!");
                navigate("/dashboard/my-tickets");
            }
        } catch (error) {
            toast.error("Update failed");
        }
    };

    if (loading) return <div className="h-96 flex items-center justify-center font-black text-brand animate-bounce">SYNCING DATA...</div>;

    return (
        <div className="max-w-5xl mx-auto p-4 lg:p-10 animate-in fade-in duration-500">
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 font-bold mb-6 hover:text-brand transition-all">
                <ArrowLeft size={18} /> Back to My Fleet
            </button>

            <header className="mb-10">
                <h2 className="text-4xl font-black uppercase tracking-tighter italic dark:text-white">
                    Edit <span className="text-brand">Journey</span>
                </h2>
                <p className="text-slate-500 font-medium">Updates to core details require admin re-approval.</p>
            </header>

            <form onSubmit={handleSubmit(onSubmit)} className="bg-white dark:bg-slate-900 p-8 lg:p-12 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-sm space-y-8">
                
                {/* Visual Preview Section */}
                <div className="flex flex-col md:flex-row items-center gap-8 p-6 bg-slate-50 dark:bg-slate-800/50 rounded-[2rem] border border-dashed border-slate-200 dark:border-slate-700">
                    <div className="w-40 h-28 rounded-2xl overflow-hidden border-2 border-white shadow-md">
                        <img src={existingImage} alt="Current" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 space-y-2">
                        <label className="text-xs font-black uppercase text-slate-400">Update Coach Image</label>
                        <input type="file" {...register("image")} className="file-input file-input-bordered file-input-ghost w-full rounded-xl" />
                        <p className="text-[10px] text-slate-400">Leave empty to keep current image</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="form-control">
                        <label className="label font-bold text-[10px] uppercase text-slate-400">Coach Name</label>
                        <input {...register("coachName")} className="input input-bordered rounded-2xl bg-slate-50 dark:bg-slate-800 border-none font-bold" required />
                    </div>

                    <div className="form-control">
                        <label className="label font-bold text-[10px] uppercase text-slate-400">Transport Type</label>
                        <select {...register("type")} className="select select-bordered rounded-2xl bg-slate-50 dark:bg-slate-800 border-none font-bold">
                            <option value="bus">Bus</option>
                            <option value="train">Train</option>
                            <option value="ship">Ship/Launch</option>
                        </select>
                    </div>

                    <div className="form-control">
                        <label className="label font-bold text-[10px] uppercase text-slate-400">Class Type</label>
                        <input {...register("classType")} className="input input-bordered rounded-2xl bg-slate-50 dark:bg-slate-800 border-none font-bold" />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="form-control">
                        <label className="label font-bold text-[10px] uppercase text-slate-400">From</label>
                        <input {...register("from")} className="input input-bordered rounded-2xl bg-slate-50 dark:bg-slate-800 border-none font-bold" required />
                    </div>
                    <div className="form-control">
                        <label className="label font-bold text-[10px] uppercase text-slate-400">To</label>
                        <input {...register("to")} className="input input-bordered rounded-2xl bg-slate-50 dark:bg-slate-800 border-none font-bold" required />
                    </div>
                    <div className="form-control">
                        <label className="label font-bold text-[10px] uppercase text-slate-400">Departure Date</label>
                        <input type="date" {...register("date")} className="input input-bordered rounded-2xl bg-slate-50 dark:bg-slate-800 border-none font-bold" required />
                    </div>
                    <div className="form-control">
                        <label className="label font-bold text-[10px] uppercase text-slate-400">Departure Time</label>
                        <input type="time" {...register("time")} className="input input-bordered rounded-2xl bg-slate-50 dark:bg-slate-800 border-none font-bold" required />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="form-control">
                        <label className="label font-bold text-[10px] uppercase text-slate-400">Fare (৳)</label>
                        <input type="number" {...register("price")} className="input input-bordered rounded-2xl bg-slate-50 dark:bg-slate-800 border-none font-bold" required />
                    </div>
                    <div className="form-control">
                        <label className="label font-bold text-[10px] uppercase text-slate-400">Available Seats</label>
                        <input type="number" {...register("quantity")} className="input input-bordered rounded-2xl bg-slate-50 dark:bg-slate-800 border-none font-bold" required />
                    </div>
                </div>

                <button type="submit" className="btn btn-brand w-full h-16 rounded-2xl text-white font-black uppercase tracking-widest shadow-lg shadow-brand/20 border-none">
                    <Save size={20} /> Finalize Update
                </button>
            </form>
        </div>
    );
};

export default UpdateTicket;