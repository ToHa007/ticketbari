import { useEffect, useState } from "react";
import { Trash2, Edit3, Calendar, Clock, AlertCircle, CheckCircle, XCircle } from "lucide-react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import useAuth from "../../hooks/useAuth";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import { Link } from "react-router-dom";

const MyTickets = () => {
    const { user } = useAuth();
    const axiosPublic = useAxiosPublic();
    const [myTickets, setMyTickets] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchTickets = () => {
        if (user?.email) {
            axiosPublic.get(`/tickets/vendor/${user.email}`)
                .then(res => {
                    setMyTickets(res.data);
                    setLoading(false);
                })
                .catch(err => {
                    console.error(err);
                    setLoading(false);
                });
        }
    };

    useEffect(() => {
        fetchTickets();
    }, [user, axiosPublic]);

    const handleDelete = async (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "This ticket will be permanently removed.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#EF4444",
            cancelButtonColor: "#64748B",
            confirmButtonText: "Yes, delete it!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const res = await axiosPublic.delete(`/tickets/${id}`);
                    if (res.data.deletedCount > 0) {
                        toast.success("Ticket removed successfully");
                        setMyTickets(myTickets.filter(ticket => ticket._id !== id));
                    }
                } catch (error) {
                    toast.error("Failed to delete ticket");
                }
            }
        });
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case "approved":
                return <span className="flex items-center gap-1 text-[10px] font-black uppercase text-green-500 bg-green-500/10 px-2 py-1 rounded-md border border-green-500/20"><CheckCircle size={12}/> Approved</span>;
            case "rejected":
                return <span className="flex items-center gap-1 text-[10px] font-black uppercase text-red-500 bg-red-500/10 px-2 py-1 rounded-md border border-red-500/20"><XCircle size={12}/> Rejected</span>;
            default:
                return <span className="flex items-center gap-1 text-[10px] font-black uppercase text-amber-500 bg-amber-500/10 px-2 py-1 rounded-md border border-amber-500/20"><AlertCircle size={12}/> Request Sent</span>;
        }
    };

    if (loading) return (
        <div className="min-h-[400px] flex items-center justify-center">
            <span className="loading loading-spinner loading-lg text-brand"></span>
        </div>
    );

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                <div>
                    <h2 className="text-4xl font-black uppercase dark:text-white tracking-tighter italic">My <span className="text-brand">Fleet</span></h2>
                    <p className="text-slate-500 font-medium">Manage and monitor your ticket verification status.</p>
                </div>
                <div className="px-6 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total: </span>
                    <span className="text-xl font-black text-brand">{myTickets.length}</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myTickets.map((ticket) => (
                    <div key={ticket._id} className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-xl transition-all group">
                        <div className="p-6 space-y-4">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-xl font-black text-slate-800 dark:text-white leading-tight">{ticket.coachName}</h3>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{ticket.type} • {ticket.classType}</p>
                                </div>
                                {getStatusBadge(ticket.status || "pending")}
                            </div>

                            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 flex items-center justify-between">
                                <div className="text-center">
                                    <p className="text-[9px] font-bold text-slate-400 uppercase">From</p>
                                    <p className="text-xs font-black text-brand">{ticket.from}</p>
                                </div>
                                <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700 mx-3 relative">
                                     <div className="absolute -top-1 right-0 w-2 h-2 rounded-full bg-brand"></div>
                                </div>
                                <div className="text-center">
                                    <p className="text-[9px] font-bold text-slate-400 uppercase">To</p>
                                    <p className="text-xs font-black text-brand">{ticket.to}</p>
                                </div>
                            </div>

                            <div className="flex justify-between items-center px-2">
                               <div className="space-y-1">
                                  <div className="flex items-center gap-2 text-[11px] font-bold text-slate-500"><Calendar size={12} className="text-brand"/> {ticket.date}</div>
                                  <div className="flex items-center gap-2 text-[11px] font-bold text-slate-500"><Clock size={12} className="text-brand"/> {ticket.time}</div>
                               </div>
                               <div className="text-right">
                                  <p className="text-[9px] font-bold text-slate-400 uppercase">Fare</p>
                                  <p className="text-xl font-black text-slate-800 dark:text-white">৳{ticket.price}</p>
                               </div>
                            </div>

                            <div className="divider opacity-50 my-0"></div>

                            <div className="flex gap-3">
                                <Link 
                                    to={`/dashboard/update-ticket/${ticket._id}`}
                                    className="flex-1 btn btn-sm h-12 rounded-xl font-bold uppercase tracking-tighter bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-600 hover:text-white"
                                >
                                    <Edit3 size={16} /> Update
                                </Link>
                                <button 
                                    onClick={() => handleDelete(ticket._id)}
                                    className="flex-1 btn btn-sm h-12 rounded-xl font-bold uppercase tracking-tighter bg-red-50 text-red-600 border-red-100 hover:bg-red-600 hover:text-white"
                                >
                                    <Trash2 size={16} /> Delete
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {myTickets.length === 0 && (
                <div className="py-20 text-center bg-white dark:bg-slate-900 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-800">
                    <p className="text-slate-400 font-bold uppercase tracking-widest">No tickets in your fleet.</p>
                    <Link to="/dashboard/add-ticket" className="btn btn-link text-brand no-underline font-black">Add Your First Ticket</Link>
                </div>
            )}
        </div>
    );
};

export default MyTickets;