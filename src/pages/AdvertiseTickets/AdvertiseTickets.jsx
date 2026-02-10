import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Megaphone, MegaphoneOff } from "lucide-react";
import Swal from "sweetalert2";

const AdvertiseTickets = () => {
    const { data: tickets = [], refetch } = useQuery({
        queryKey: ['advertise-tickets'],
        queryFn: async () => {
            const res = await axios.get('http://localhost:5000/tickets');
          
            return res.data.filter(t => t.status === 'approved');
        }
    });

    const handleAdvertise = async (id, currentStatus) => {
        try {
            const res = await axios.patch(`http://localhost:5000/tickets/advertise/${id}`, { 
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
                        {tickets.map((ticket) => (
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
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdvertiseTickets;