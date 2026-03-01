import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Megaphone } from "lucide-react";
import Swal from "sweetalert2";

const AdvertiseTickets = () => {
    // 1. Destructure isLoading from useQuery
    const { data: tickets = [], refetch, isLoading } = useQuery({
        queryKey: ['advertise-tickets'],
        queryFn: async () => {
            const res = await axios.get('https://ticketbari-server123.vercel.app/tickets');
            return res.data.filter(t => t.status === 'approved');
        }
    });

    const handleAdvertise = async (id, currentStatus) => {
        try {
            const res = await axios.patch(`https://ticketbari-server123.vercel.app/tickets/advertise/${id}`, { 
                advertise: !currentStatus 
            });
            if (res.data.modifiedCount > 0) {
                refetch();
                Swal.fire("Success", "Advertisement status updated!", "success");
            }
        } catch (err) {
            Swal.fire("Limit Reached", err.response?.data?.message || "Error", "error");
        }
    };

    // Internal Shimmer effect for the table
    const Shimmer = () => (
        <div className="absolute top-0 left-0 w-full h-full animate-shimmer bg-gradient-to-r from-transparent via-white/10 dark:via-slate-700/20 to-transparent -skew-x-12" />
    );

    return (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
            <h2 className="text-2xl font-black mb-6 uppercase tracking-tight">Advertise Tickets</h2>
            <p className="mb-4 text-sm text-slate-500">Max 6 tickets can be advertised on the homepage.</p>
            
            <div className="overflow-x-auto">
                <table className="table w-full">
                    <thead>
                        <tr>
                            <th>Ticket Info</th>
                            <th>Current State</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            /* ================= TABLE SKELETON ROWS ================= */
                            [...Array(5)].map((_, i) => (
                                <tr key={i} className="border-b border-slate-100 dark:border-slate-800">
                                    <td>
                                        <div className="space-y-2">
                                            <div className="relative h-4 w-32 bg-slate-200 dark:bg-slate-800 rounded overflow-hidden">
                                                <Shimmer />
                                            </div>
                                            <div className="relative h-3 w-48 bg-slate-100 dark:bg-slate-800/50 rounded overflow-hidden">
                                                <Shimmer />
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="relative h-4 w-16 bg-slate-100 dark:bg-slate-800 rounded overflow-hidden">
                                            <Shimmer />
                                        </div>
                                    </td>
                                    <td>
                                        <div className="relative h-8 w-24 bg-slate-200 dark:bg-slate-800 rounded-lg overflow-hidden">
                                            <Shimmer />
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            /* ================= ACTUAL DATA ROWS ================= */
                            tickets.map((ticket) => (
                                <tr key={ticket._id}>
                                    <td>
                                        <div className="font-bold">{ticket.coachName}</div>
                                        <div className="text-xs opacity-50">{ticket.from} to {ticket.to}</div>
                                    </td>
                                    <td>
                                        {ticket.advertised ? 
                                            <span className="text-success flex items-center gap-1 font-bold"><Megaphone size={14}/> Live</span> : 
                                            <span className="text-slate-400">Off</span>
                                        }
                                    </td>
                                    <td>
                                        <button 
                                            onClick={() => handleAdvertise(ticket._id, ticket.advertised)}
                                            className={`btn btn-sm ${ticket.advertised ? 'btn-error btn-outline' : 'btn-brand'}`}
                                        >
                                            {ticket.advertised ? "Remove Ad" : "Advertise"}
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdvertiseTickets;