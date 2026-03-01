import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { Check, X, User, Ticket, Clock, CheckCircle, Ban, ArrowRight } from "lucide-react";

import Swal from "sweetalert2";
import { AuthContext } from "../../Components/Context/AuthContext/AuthProvider";
import useAxiosPublic from "../../hooks/useAxiosPublic";

const ManageBookings = () => {
    const { user } = useContext(AuthContext);
    const axiosPublic = useAxiosPublic();

    const { data: vendorBookings = [], refetch, isLoading } = useQuery({
        queryKey: ['vendor-bookings', user?.email],
        queryFn: async () => {
            const res = await axiosPublic.get(`/bookings/vendor/${user?.email}`);
            return res.data;
        }
    });

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            const res = await axiosPublic.patch(`/bookings/status/${id}`, { status: newStatus });
            if (res.data.modifiedCount > 0) {
                Swal.fire({
                    title: `Booking ${newStatus}!`,
                    icon: 'success',
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 2000
                });
                refetch();
            }
        } catch (error) {
            Swal.fire('Error', 'Failed to update status', 'error');
        }
    };

    // Calculate quick stats
    const pendingCount = vendorBookings.filter(b => b.status === 'pending').length;
    const acceptedCount = vendorBookings.filter(b => b.status === 'accepted' || b.status === 'paid').length;

    if (isLoading) return (
        <div className="min-h-[400px] flex flex-col items-center justify-center">
            <span className="loading loading-ring loading-lg text-brand"></span>
            <p className="mt-4 font-black text-brand animate-pulse uppercase tracking-[0.3em] text-[10px]">Syncing Manifest</p>
        </div>
    );

    return (
        <div className="p-6 lg:p-10 bg-slate-50 dark:bg-[#06080a] min-h-screen">
            {/* Header & Stats Container */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
                <header>
                    <h2 className="text-5xl font-black uppercase tracking-tighter italic text-slate-800 dark:text-white">
                        Manifest <span className="text-brand">Control</span>
                    </h2>
                    <p className="text-slate-500 font-bold text-[10px] uppercase tracking-[0.2em] mt-2 italic">
                        Real-time passenger request orchestration
                    </p>
                </header>

                <div className="flex gap-4">
                    <div className="bg-white dark:bg-slate-900 px-6 py-4 rounded-[1.5rem] border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
                        <div className="w-10 h-10 bg-orange-500/10 text-orange-500 rounded-xl flex items-center justify-center">
                            <Clock size={20} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase leading-none">Pending</p>
                            <p className="text-xl font-black dark:text-white">{pendingCount}</p>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-slate-900 px-6 py-4 rounded-[1.5rem] border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
                        <div className="w-10 h-10 bg-emerald-500/10 text-emerald-500 rounded-xl flex items-center justify-center">
                            <CheckCircle size={20} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase leading-none">Confirmed</p>
                            <p className="text-xl font-black dark:text-white">{acceptedCount}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Table Section */}
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="table w-full">
                        <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-400 uppercase text-[9px] tracking-[0.2em] font-black border-b dark:border-slate-800">
                            <tr>
                                <th className="p-8">Passenger Details</th>
                                <th>Trip Manifest</th>
                                <th>Settlement</th>
                                <th>Status</th>
                                <th className="text-center">Dispatch Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {vendorBookings.length > 0 ? (
                                vendorBookings.map((booking) => (
                                    <tr key={booking._id} className="group hover:bg-slate-50/50 dark:hover:bg-brand/5 transition-all">
                                        <td className="p-8">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-brand group-hover:text-white transition-all">
                                                    <User size={20} />
                                                </div>
                                                <div>
                                                    <p className="font-black text-slate-800 dark:text-white uppercase tracking-tighter italic leading-none">{booking.userName}</p>
                                                    <p className="text-[10px] font-bold text-slate-400 mt-1">{booking.userEmail}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-2">
                                                    <Ticket size={12} className="text-brand" />
                                                    <span className="font-black text-xs uppercase tracking-tighter text-slate-700 dark:text-slate-300">{booking.title}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400">
                                                    <span>{booking.from}</span>
                                                    <ArrowRight size={10} className="text-brand" />
                                                    <span>{booking.to}</span>
                                                    <span className="ml-2 px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-brand">Qty: {booking.bookingQuantity}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="flex flex-col">
                                                <span className="font-black text-lg text-slate-800 dark:text-white tracking-tighter">৳{booking.totalPrice}</span>
                                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Base Rate + Fees</span>
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${
                                                booking.status === 'accepted' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                                                booking.status === 'rejected' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                                                booking.status === 'paid' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 
                                                'bg-orange-500/10 text-orange-500 border-orange-500/20'
                                            }`}>
                                                {booking.status}
                                            </span>
                                        </td>
                                        <td className="text-center">
                                            {booking.status === "pending" ? (
                                                <div className="flex justify-center gap-3">
                                                    <button 
                                                        onClick={() => handleStatusUpdate(booking._id, "accepted")}
                                                        className="w-10 h-10 rounded-2xl bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 hover:scale-110 active:scale-95 transition-all flex items-center justify-center"
                                                        title="Approve Passenger"
                                                    >
                                                        <Check size={20} strokeWidth={3} />
                                                    </button>
                                                    <button 
                                                        onClick={() => handleStatusUpdate(booking._id, "rejected")}
                                                        className="w-10 h-10 rounded-2xl bg-red-500 text-white shadow-lg shadow-red-500/30 hover:scale-110 active:scale-95 transition-all flex items-center justify-center"
                                                        title="Reject Request"
                                                    >
                                                        <X size={20} strokeWidth={3} />
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="flex items-center justify-center gap-2 opacity-30 italic">
                                                    <Ban size={14} />
                                                    <span className="text-[9px] font-black uppercase tracking-widest">Finalized</span>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="py-24 text-center">
                                        <div className="flex flex-col items-center justify-center opacity-20">
                                            <Ticket size={64} className="mb-4" />
                                            <p className="text-xs font-black uppercase tracking-[0.4em]">No Active Requests</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ManageBookings;