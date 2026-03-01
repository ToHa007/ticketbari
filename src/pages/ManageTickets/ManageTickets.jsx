import { useQuery } from "@tanstack/react-query";
import { Check, X, Ticket } from "lucide-react";
import Swal from "sweetalert2";
import useAxiosPublic from "../../hooks/useAxiosPublic";

const ManageTickets = () => {
    const axiosSecure = useAxiosPublic();

    const { data: tickets = [], refetch, isLoading, error } = useQuery({
        queryKey: ['admin-tickets'],
        queryFn: async () => {
            const res = await axiosSecure.get('/tickets');
            return res.data;
        }
    });

    const handleStatus = async (id, status) => {
        try {
            const res = await axiosSecure.patch(`/tickets/status/${id}`, { status });
            if (res.data.modifiedCount > 0) {
                refetch();
                Swal.fire({
                    title: "Success!",
                    text: `Ticket has been ${status}.`,
                    icon: "success",
                    confirmButtonColor: "#10B981"
                });
            }
        } catch (err) {
            console.error(err);
            Swal.fire("Error", "Unauthorized or Server Error. Please login again.", "error");
        }
    };

    // Internal Shimmer Utility for the table
    const Shimmer = () => (
        <div className="absolute top-0 left-0 w-full h-full animate-shimmer bg-gradient-to-r from-transparent via-white/10 dark:via-slate-700/20 to-transparent -skew-x-12" />
    );

    if (error) return <div className="text-red-500 p-10 font-bold">Error loading tickets: {error.message}</div>;

    return (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-black uppercase tracking-tight">Manage Tickets</h2>
                {isLoading ? (
                    <div className="h-6 w-32 bg-slate-100 dark:bg-slate-800 rounded-lg animate-pulse"></div>
                ) : (
                    <span className="badge badge-outline">Total Requests: {tickets.length}</span>
                )}
            </div>
            
            <div className="overflow-x-auto">
                {!isLoading && tickets.length === 0 ? (
                    <div className="text-center py-10 opacity-50 font-bold uppercase">No tickets found in database</div>
                ) : (
                    <table className="table w-full">
                        <thead className="bg-slate-50 dark:bg-slate-800">
                            <tr className="text-slate-500 border-none">
                                <th>Ticket</th>
                                <th>Vendor</th>
                                <th>Price</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                /* ================= TABLE SKELETON ================= */
                                [...Array(6)].map((_, i) => (
                                    <tr key={i} className="border-b border-slate-100 dark:border-slate-800">
                                        <td>
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-slate-200 dark:bg-slate-800 relative overflow-hidden">
                                                    <Shimmer />
                                                </div>
                                                <div className="space-y-2">
                                                    <div className="h-4 w-28 bg-slate-200 dark:bg-slate-800 rounded relative overflow-hidden">
                                                        <Shimmer />
                                                    </div>
                                                    <div className="h-3 w-20 bg-slate-100 dark:bg-slate-800/50 rounded relative overflow-hidden">
                                                        <Shimmer />
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="h-4 w-32 bg-slate-100 dark:bg-slate-800 rounded relative overflow-hidden">
                                                <Shimmer />
                                            </div>
                                        </td>
                                        <td>
                                            <div className="h-4 w-12 bg-slate-100 dark:bg-slate-800 rounded relative overflow-hidden">
                                                <Shimmer />
                                            </div>
                                        </td>
                                        <td>
                                            <div className="h-5 w-16 bg-slate-100 dark:bg-slate-800 rounded-full relative overflow-hidden">
                                                <Shimmer />
                                            </div>
                                        </td>
                                        <td>
                                            <div className="flex gap-2">
                                                <div className="h-6 w-6 bg-slate-200 dark:bg-slate-800 rounded relative overflow-hidden"><Shimmer /></div>
                                                <div className="h-6 w-6 bg-slate-200 dark:bg-slate-800 rounded relative overflow-hidden"><Shimmer /></div>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                /* ================= ACTUAL DATA ================= */
                                tickets.map((ticket) => (
                                    <tr key={ticket._id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                        <td>
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                                                    <Ticket size={20} className="text-brand" />
                                                </div>
                                                <div>
                                                    <div className="font-bold">{ticket.coachName || 'Unnamed Coach'}</div>
                                                    <div className="text-[10px] opacity-50 uppercase font-bold">{ticket.from} ➔ {ticket.to}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="text-xs font-medium">{ticket.vendorEmail}</td>
                                        <td className="font-bold text-brand">৳{ticket.price}</td>
                                        <td>
                                            <span className={`badge badge-sm font-black uppercase ${
                                                ticket.status === 'approved' ? 'badge-success text-white' : 
                                                ticket.status === 'rejected' ? 'badge-error text-white' : 'badge-warning'
                                            }`}>
                                                {ticket.status || 'pending'}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="flex gap-2">
                                                {ticket.status !== 'approved' && (
                                                    <button 
                                                        onClick={() => handleStatus(ticket._id, 'approved')} 
                                                        className="btn btn-xs btn-success text-white"
                                                        title="Approve"
                                                    >
                                                        <Check size={14}/>
                                                    </button>
                                                )}
                                                {ticket.status !== 'rejected' && (
                                                    <button 
                                                        onClick={() => handleStatus(ticket._id, 'rejected')} 
                                                        className="btn btn-xs btn-error text-white"
                                                        title="Reject"
                                                    >
                                                        <X size={14}/>
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default ManageTickets;