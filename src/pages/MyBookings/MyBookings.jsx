import { useQuery } from "@tanstack/react-query";
import { useContext, useState, useEffect } from "react";
import { 
    MapPin, 
    Calendar, 
    Clock, 
    CreditCard, 
    Timer, 
    AlertCircle, 
    CheckCircle2, 
    TicketCheck
} from "lucide-react";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import { AuthContext } from "../../Components/Context/AuthContext/AuthProvider";
import { Link } from "react-router-dom";

// Individual Card Component
const BookingCard = ({ booking }) => {
    const [timeLeft, setTimeLeft] = useState("");
    const [isExpired, setIsExpired] = useState(false);

    useEffect(() => {
     
        if (booking.status === "rejected" || booking.status === "paid") {
            setTimeLeft("");
            return;
        }

        const timer = setInterval(() => {
            const departure = new Date(`${booking.departureDate}T${booking.departureTime}`);
            const now = new Date();
            const diff = departure - now;

            if (diff <= 0) {
                setIsExpired(true);
                setTimeLeft("Expired");
                clearInterval(timer);
            } else {
                const d = Math.floor(diff / (1000 * 60 * 60 * 24));
                const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
                const m = Math.floor((diff / (1000 * 60)) % 60);
                const s = Math.floor((diff / 1000) % 60);
                setTimeLeft(`${d}d ${h}h ${m}m ${s}s`);
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [booking.status, booking.departureDate, booking.departureTime]);

    const getStatusColor = (status) => {
        switch (status) {
            case "accepted": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
            case "paid": return "bg-green-500/10 text-green-500 border-green-500/20";
            case "rejected": return "bg-error/10 text-error border-error/20";
            default: return "bg-amber-500/10 text-amber-500 border-amber-500/20";
        }
    };

    return (
        <div className="group bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-all hover:shadow-2xl hover:-translate-y-2">
            {/* Image Section */}
            <div className="relative h-48 overflow-hidden">
                <img src={booking.image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className={`absolute top-4 right-4 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border backdrop-blur-md ${getStatusColor(booking.status)}`}>
                    {booking.status}
                </div>
            </div>

            {/* Content Section */}
            <div className="p-6 space-y-4">
                <h3 className="text-xl font-black text-slate-800 dark:text-white truncate">{booking.title}</h3>
                
                <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700">
                    <div className="text-center">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">From</p>
                        <p className="text-sm font-black text-brand">{booking.from}</p>
                    </div>
                    <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700 mx-2 relative">
                         <div className="absolute -top-1 right-0 w-2 h-2 rounded-full bg-brand"></div>
                    </div>
                    <div className="text-center">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">To</p>
                        <p className="text-sm font-black text-brand">{booking.to}</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <div className="flex items-center gap-2"><Calendar size={14} className="text-brand"/> {booking.departureDate}</div>
                    <div className="flex items-center gap-2"><Clock size={14} className="text-brand"/> {booking.departureTime}</div>
                </div>

                <div className="divider opacity-50 my-1"></div>

                <div className="flex justify-between items-end">
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Qty: {booking.bookingQuantity}</p>
                        <p className="text-2xl font-black text-slate-800 dark:text-white tracking-tighter">৳{booking.totalPrice}</p>
                    </div>
                    
                    {/* Requirement: Hide countdown if rejected or paid */}
                    {booking.status !== "rejected" && booking.status !== "paid" && (
                        <div className="text-right">
                            <p className="text-[10px] font-black text-slate-400 uppercase flex items-center justify-end gap-1"><Timer size={10}/> Starts In</p>
                            <p className={`text-xs font-mono font-black ${isExpired ? 'text-error' : 'text-brand'}`}>{timeLeft}</p>
                        </div>
                    )}

                    {/* Requirement: Visual confirmation for "Paid" state */}
                    {booking.status === "paid" && (
                        <div className="text-right text-green-500 animate-in zoom-in">
                            <CheckCircle2 size={24} className="ml-auto mb-1" />
                            <p className="text-[10px] font-black uppercase tracking-tighter">Booking Confirmed</p>
                        </div>
                    )}
                </div>

                {/* FIX 3: Requirement 6d - Link to Stripe payment route */}
                {booking.status === "accepted" && !isExpired && (
                    <Link 
                        to={`/user-dashboard/payment/${booking._id}`}
                        className="btn btn-brand w-full rounded-2xl text-white font-black uppercase tracking-widest shadow-lg shadow-brand/20 group border-none"
                    >
                        <CreditCard size={18} className="group-hover:rotate-12 transition-transform"/> Pay Now
                    </Link>
                )}

                {/* Requirement: Lock payment if expired */}
                {booking.status === "accepted" && isExpired && (
                    <div className="flex items-center gap-2 p-3 bg-error/10 border border-error/20 rounded-2xl text-error text-[10px] font-bold uppercase">
                        <AlertCircle size={14}/> Payment Locked: Departure Passed
                    </div>
                )}

                {/* Optional: Add a 'View Ticket' for Paid bookings */}
                {booking.status === "paid" && (
                    <button className="btn btn-outline border-slate-200 dark:border-slate-700 w-full rounded-2xl font-black uppercase tracking-widest hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300">
                        <TicketCheck size={18} />  Ticket Booked
                    </button>
                )}
            </div>
        </div>
    );
};

const MyBookings = () => {
    const { user } = useContext(AuthContext);
    const axiosPublic = useAxiosPublic();

    const { data: bookings = [], isLoading } = useQuery({
        queryKey: ['my-bookings', user?.email],
        queryFn: async () => {
            const res = await axiosPublic.get(`/bookings/user/${user?.email}`);
            return res.data;
        }
    });

    if (isLoading) return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center">
            <span className="loading loading-ring loading-lg text-brand"></span>
            <p className="mt-4 font-black text-brand animate-pulse text-xs tracking-[0.2em] uppercase">Syncing Bookings</p>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto">
            <header className="mb-10 space-y-2">
                <h2 className="text-4xl font-black text-slate-800 dark:text-white uppercase tracking-tighter italic">My Booked Tickets</h2>
                <p className="text-slate-500 font-medium">Manage your upcoming journeys and check vendor approvals.</p>
            </header>

            {bookings.length === 0 ? (
                <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-800">
                    <p className="text-slate-400 font-bold uppercase tracking-widest">No journeys found yet</p>
                    <Link to="/all-tickets" className="btn btn-link text-brand no-underline font-black uppercase">Browse Available Tickets</Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {bookings.map(booking => (
                        <BookingCard key={booking._id} booking={booking} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyBookings;