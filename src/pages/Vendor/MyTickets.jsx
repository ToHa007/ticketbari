import { useEffect, useState } from "react";
import { Trash2, Edit3, Calendar, Clock, AlertCircle, CheckCircle, XCircle, Plus, Bus, MapPin } from "lucide-react";
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
            title: "Decommission Vehicle?",
            text: "This ticket will be permanently removed from the active fleet.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#EF4444",
            cancelButtonColor: "#64748B",
            confirmButtonText: "Yes, delete it!",
            background: document.documentElement.classList.contains('dark') ? '#0f172a' : '#fff',
            color: document.documentElement.classList.contains('dark') ? '#fff' : '#000',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const res = await axiosPublic.delete(`/tickets/${id}`);
                    if (res.data.deletedCount > 0) {
                        toast.success("Ticket removed from fleet");
                        setMyTickets(myTickets.filter(ticket => ticket._id !== id));
                    }
                } catch (error) {
                    toast.error("Operation failed");
                }
            }
        });
    };

    const getStatusBadge = (status) => {
        const styles = {
            approved: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
            rejected: "text-red-500 bg-red-500/10 border-red-500/20",
            pending: "text-amber-500 bg-amber-500/10 border-amber-500/20"
        };
        const Icons = {
            approved: CheckCircle,
            rejected: XCircle,
            pending: AlertCircle
        };
        const Icon = Icons[status] || Icons.pending;

        return (
            <span className={`flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl border ${styles[status] || styles.pending}`}>
                <Icon size={12} strokeWidth={3} />
                {status === "approved" ? "Active" : status === "rejected" ? "Disabled" : "Verifying"}
            </span>
        );
    };

    if (loading) return (
        <div className="min-h-[400px] flex flex-col items-center justify-center">
            <span className="loading loading-bars loading-lg text-brand"></span>
            <p className="mt-4 text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 animate-pulse">Loading Manifest</p>
        </div>
    );

    return (
        <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
            {/* Dashboard Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-12 gap-6">
                <div>
                    <h2 className="text-5xl font-black uppercase dark:text-white tracking-tighter italic leading-none">
                        My <span className="text-brand">Fleet</span>
                    </h2>
                    <p className="text-slate-500 font-bold text-[10px] uppercase tracking-[0.3em] mt-3 italic">
                        Inventory & Logistics Management
                    </p>
                </div>
                
                <div className="flex items-center gap-4">
                    <div className="hidden sm:flex flex-col items-end">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Total Assets</span>
                        <span className="text-2xl font-black text-slate-800 dark:text-white leading-none">{myTickets.length}</span>
                    </div>
                    <Link to="/dashboard/add-ticket" className="btn bg-brand hover:bg-brand/90 border-none text-white font-black uppercase tracking-tighter italic rounded-2xl px-6 group">
                        <Plus size={18} className="group-hover:rotate-90 transition-transform" /> Add New Ticket
                    </Link>
                </div>
            </div>

            {/* Ticket Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {myTickets.map((ticket) => (
                    <div key={ticket._id} className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 group">
                        <div className="p-8 space-y-6">
                            {/* Card Header */}
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-brand/10 text-brand rounded-2xl flex items-center justify-center">
                                        <Bus size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-black text-slate-800 dark:text-white tracking-tighter uppercase italic">{ticket.coachName}</h3>
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">{ticket.type} • {ticket.classType}</p>
                                    </div>
                                </div>
                                {getStatusBadge(ticket.status || "pending")}
                            </div>

                            {/* Route Visualizer */}
                            <div className="bg-slate-50 dark:bg-slate-800/40 p-5 rounded-[2rem] border border-slate-100 dark:border-slate-700/50 flex items-center gap-4 relative overflow-hidden">
                                <div className="text-center z-10">
                                    <p className="text-[8px] font-black text-slate-400 uppercase mb-1">Origin</p>
                                    <p className="text-xs font-black text-slate-700 dark:text-slate-200">{ticket.from}</p>
                                </div>
                                
                                <div className="flex-1 flex flex-col items-center gap-1 z-10">
                                    <MapPin size={12} className="text-brand animate-bounce" />
                                    <div className="w-full h-[2px] bg-dashed-gradient flex bg-[linear-gradient(90deg,#e2e8f0_50%,transparent_50%)] bg-[length:8px_2px] dark:bg-[linear-gradient(90deg,#334155_50%,transparent_50%)]"></div>
                                </div>

                                <div className="text-center z-10">
                                    <p className="text-[8px] font-black text-slate-400 uppercase mb-1">Destination</p>
                                    <p className="text-xs font-black text-brand">{ticket.to}</p>
                                </div>
                            </div>

                            {/* Details Row */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-brand">
                                        <Calendar size={14} />
                                    </div>
                                    <span className="text-xs font-bold text-slate-600 dark:text-slate-400">{ticket.date}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-brand">
                                        <Clock size={14} />
                                    </div>
                                    <span className="text-xs font-bold text-slate-600 dark:text-slate-400">{ticket.time}</span>
                                </div>
                            </div>

                            <div className="flex justify-between items-end pt-4 border-t border-slate-100 dark:border-slate-800">
                                <div>
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Base Fare</p>
                                    <p className="text-2xl font-black text-slate-800 dark:text-white tracking-tighter">৳{ticket.price}</p>
                                </div>
                                
                                <div className="flex gap-2">
                                    <Link 
                                        to={`/dashboard/update-ticket/${ticket._id}`}
                                        className="w-10 h-10 flex items-center justify-center bg-blue-500/10 text-blue-500 rounded-xl hover:bg-blue-500 hover:text-white transition-all shadow-sm"
                                    >
                                        <Edit3 size={16} />
                                    </Link>
                                    <button 
                                        onClick={() => handleDelete(ticket._id)}
                                        className="w-10 h-10 flex items-center justify-center bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {myTickets.length === 0 && (
                <div className="py-32 flex flex-col items-center justify-center bg-white dark:bg-slate-900 rounded-[4rem] border-2 border-dashed border-slate-200 dark:border-slate-800 animate-pulse">
                    <div className="w-24 h-24 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-300 mb-6">
                        <Bus size={48} />
                    </div>
                    <p className="text-sm font-black text-slate-400 uppercase tracking-[0.3em] mb-6">Your fleet is currently empty</p>
                    <Link to="/dashboard/add-ticket" className="btn btn-outline border-brand text-brand hover:bg-brand hover:border-brand px-10 rounded-2xl font-black uppercase tracking-widest">
                        Dispatch First Ticket
                    </Link>
                </div>
            )}
        </div>
    );
};

export default MyTickets;