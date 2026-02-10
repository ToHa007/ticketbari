import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { Check, X, User, Ticket } from "lucide-react";

import Swal from "sweetalert2";
import { AuthContext } from "../../Components/Context/AuthContext/AuthProvider";
import useAxiosPublic from "../../hooks/useAxiosPublic";

const ManageBookings = () => {
    const { user } = useContext(AuthContext);
    const axiosPublic = useAxiosPublic();

    // 1. Fetch bookings sent to this vendor
    const { data: vendorBookings = [], refetch, isLoading } = useQuery({
        queryKey: ['vendor-bookings', user?.email],
        queryFn: async () => {
            const res = await axiosPublic.get(`/bookings/vendor/${user?.email}`);
            return res.data;
        }
    });

    // 2. Handle Status Update Logic
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
                refetch(); // Refresh the list
            }
        } catch (error) {
            Swal.fire('Error', 'Failed to update status', 'error');
        }
    };

    if (isLoading) return <span className="loading loading-dots loading-lg text-brand"></span>;

    return (
        <div className="p-8">
            <header className="mb-8">
                <h2 className="text-3xl font-black uppercase tracking-tighter italic">Manage Bookings</h2>
                <p className="text-slate-500">Approve or reject passenger requests for your tickets.</p>
            </header>

            <div className="overflow-x-auto bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <table className="table table-zebra w-full text-sm">
                    <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 uppercase text-[10px] tracking-widest font-black">
                        <tr>
                            <th className="p-6">Passenger Info</th>
                            <th>Ticket Details</th>
                            <th>Total Price</th>
                            <th>Status</th>
                            <th className="text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {vendorBookings.map((booking) => (
                            <tr key={booking._id} className="border-b border-slate-100 dark:border-slate-800">
                                <td className="p-6">
                                    <div className="flex items-center gap-3">
                                        <div className="avatar placeholder">
                                            <div className="bg-brand/10 text-brand rounded-xl w-10">
                                                <User size={18} />
                                            </div>
                                        </div>
                                        <div>
                                            <p className="font-black text-slate-800 dark:text-white">{booking.userName}</p>
                                            <p className="text-[10px] font-bold text-slate-400">{booking.userEmail}</p>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <div className="flex items-center gap-2">
                                        <Ticket size={14} className="text-brand" />
                                        <span className="font-bold">{booking.title}</span>
                                        <span className="badge badge-sm font-bold">Qty: {booking.bookingQuantity}</span>
                                    </div>
                                </td>
                                <td className="font-black text-slate-700 dark:text-slate-300">৳{booking.totalPrice}</td>
                                <td>
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                                        booking.status === 'accepted' ? 'bg-blue-50 text-blue-600 border-blue-200' :
                                        booking.status === 'rejected' ? 'bg-error/10 text-error border-error/20' :
                                        booking.status === 'paid' ? 'bg-green-50 text-green-600 border-green-200' : 'bg-slate-100 text-slate-500'
                                    }`}>
                                        {booking.status}
                                    </span>
                                </td>
                                <td className="text-center">
                                    {booking.status === "pending" ? (
                                        <div className="flex justify-center gap-2">
                                            <button 
                                                onClick={() => handleStatusUpdate(booking._id, "accepted")}
                                                className="btn btn-sm btn-circle btn-success text-white shadow-lg shadow-success/20"
                                            >
                                                <Check size={16} />
                                            </button>
                                            <button 
                                                onClick={() => handleStatusUpdate(booking._id, "rejected")}
                                                className="btn btn-sm btn-circle btn-error text-white shadow-lg shadow-error/20"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    ) : (
                                        <span className="text-[10px] font-bold text-slate-400 uppercase italic">Action Completed</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageBookings;