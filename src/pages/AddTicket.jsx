import { useState } from "react";
import { useForm } from "react-hook-form";
import { Ticket } from "lucide-react";
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
        const toastId = toast.loading("Uploading image and processing...");

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
                    classType: data.classType,
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
                        title: "Request Sent to Admin!",
                        text: "Your ticket is currently pending approval.",
                        icon: "success",
                        confirmButtonColor: "#fbbf24"
                    });
                    reset();
                }
            }
        } catch (error) {
            toast.error("Failed to add ticket.");
        } finally {
            setLoading(false);
            toast.dismiss(toastId);
        }
    };

    return (
        <div className="max-w-5xl mx-auto my-10 bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-200 shadow-xl">
            <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-brand/10 text-brand rounded-2xl"><Ticket size={28} /></div>
                <div>
                    <h2 className="text-2xl font-black uppercase tracking-tight">Create New Journey</h2>
                    <p className="text-slate-500 text-sm">Request will be sent to admin for verification</p>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="form-control">
                    <label className="label font-bold">Transport Type</label>
                    <select {...register("type")} className="select select-bordered rounded-xl" required>
                        <option value="bus">Bus</option>
                        <option value="train">Train</option>
                    </select>
                </div>
                <div className="form-control">
                    <label className="label font-bold">Coach/Train Name</label>
                    <input {...register("coachName")} className="input input-bordered rounded-xl" required />
                </div>
                <div className="form-control">
                    <label className="label font-bold">Coach Image</label>
                    <input type="file" {...register("image")} className="file-input file-input-bordered rounded-xl" required />
                </div>
                <div className="form-control">
                    <label className="label font-bold">Price (৳)</label>
                    <input type="number" {...register("price")} className="input input-bordered rounded-xl" required />
                </div>
                <div className="form-control">
                    <label className="label font-bold">From</label>
                    <input {...register("from")} className="input input-bordered rounded-xl" required />
                </div>
                <div className="form-control">
                    <label className="label font-bold">To</label>
                    <input {...register("to")} className="input input-bordered rounded-xl" required />
                </div>
                <div className="form-control">
                    <label className="label font-bold">Seats</label>
                    <input type="number" {...register("availableSeats")} className="input input-bordered rounded-xl" required />
                </div>
                <div className="form-control">
                    <label className="label font-bold">Date</label>
                    <input type="date" {...register("date")} className="input input-bordered rounded-xl" required />
                </div>
                <div className="form-control">
                    <label className="label font-bold">Time</label>
                    <input type="time" {...register("time")} className="input input-bordered rounded-xl" required />
                </div>
                <div className="md:col-span-3 mt-4">
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="btn bg-brand hover:bg-brand/90 text-white w-full h-14 rounded-2xl font-black uppercase"
                    >
                        {loading ? <span className="loading loading-spinner"></span> : "Submit for Approval"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddTicket;