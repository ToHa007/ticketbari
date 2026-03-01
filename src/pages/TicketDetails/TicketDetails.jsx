import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import Swal from "sweetalert2";
import {
  Calendar,
  Clock,
  MapPin,
  ShieldCheck,
  Info,
  ArrowRight,
  Ticket as TicketIcon,
  CheckCircle2,
  Minus,
  Plus,
  ChevronLeft,
  Users,
} from "lucide-react";
import { AuthContext } from "../../Components/Context/AuthContext/AuthProvider";

// Internal Shimmer Utility
const Shimmer = () => (
    <div className="absolute top-0 left-0 w-full h-full animate-shimmer bg-gradient-to-r from-transparent via-white/10 dark:via-slate-700/20 to-transparent -skew-x-12" />
);

const TicketDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const axiosPublic = useAxiosPublic();
  const { user } = useContext(AuthContext);

  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [timeLeft, setTimeLeft] = useState("");
  const [isExpired, setIsExpired] = useState(false);

  // Booking Form State
  const [bookingQty, setBookingQty] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setLoading(true);
    setNotFound(false);
    axiosPublic
      .get(`/tickets/${id}`)
      .then((res) => {
        if (!res.data) setNotFound(true);
        else setTicket(res.data);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id, axiosPublic]);

  useEffect(() => {
    if (!ticket) return;

    const timer = setInterval(() => {
      const departure = new Date(`${ticket.date}T${ticket.time}`);
      const now = new Date();
      const diff = departure - now;

      if (diff <= 0) {
        setIsExpired(true);
        setTimeLeft("Departure Passed");
        clearInterval(timer);
      } else {
        const d = Math.floor(diff / (1000 * 60 * 60 * 24));
        const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const m = Math.floor((diff / (1000 * 60)) % 60);
        const s = Math.floor((diff / 1000) % 60);
        setTimeLeft(`${d}d : ${h}h : ${m}m : ${s}s`);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [ticket]);

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
        Swal.fire("Login Required", "Please login to book a ticket", "warning");
        return navigate("/login");
    }

    const available = ticket.quantity || ticket.availableSeats;
    if (bookingQty > available) {
      return Swal.fire("Error", "Quantity exceeds available seats!", "error");
    }

    setIsSubmitting(true);
    const unitPrice = parseFloat(ticket.price);
    const quantity = parseInt(bookingQty);
    const calculatedTotal = unitPrice * quantity;

    const bookingInfo = {
      ticketId: ticket._id, 
      title: ticket.coachName || ticket.title,
      image: ticket.image,
      from: ticket.from,
      to: ticket.to,
      unitPrice: unitPrice, 
      bookingQuantity: quantity, 
      totalPrice: calculatedTotal, 
      departureDate: ticket.date,
      departureTime: ticket.time,
      userEmail: user?.email,
      userName: user?.displayName,
      vendorEmail: ticket.vendorEmail,
      status: "pending", 
      bookedAt: new Date(),
    };

    try {
      const res = await axiosPublic.post("/bookings", bookingInfo);
      if (res.data.insertedId) {
        document.getElementById("booking_modal").close();
        Swal.fire({
          icon: "success",
          title: "Booking Requested!",
          text: `Total: ৳${calculatedTotal}. Waiting for vendor approval.`,
          confirmButtonColor: "#3B82F6",
        });
        navigate("/user-dashboard/my-booked-tickets"); 
      }
    } catch (error) {
      Swal.fire("Failed", "Booking could not be processed.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-12 px-6">
          <div className="h-6 w-48 bg-slate-200 dark:bg-slate-800 rounded-lg mb-8 relative overflow-hidden"><Shimmer /></div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              <div className="lg:col-span-7 h-[500px] bg-slate-200 dark:bg-slate-800 rounded-[3.5rem] relative overflow-hidden"><Shimmer /></div>
              <div className="lg:col-span-5 h-[600px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[3rem] relative overflow-hidden"><Shimmer /></div>
          </div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 bg-slate-50 dark:bg-[#06080a]">
        <div className="bg-white dark:bg-slate-900 p-12 rounded-[3rem] shadow-2xl border border-slate-200 dark:border-slate-800 max-w-md">
          <div className="w-24 h-24 bg-red-50 dark:bg-red-500/10 rounded-full flex items-center justify-center text-red-500 mx-auto mb-6">
            <Info size={48} />
          </div>
          <h2 className="text-3xl font-black text-slate-800 dark:text-white mb-2 uppercase italic tracking-tighter">Trip Lost</h2>
          <p className="text-slate-500 mb-8 font-medium italic">The journey you're looking for has either concluded or never existed.</p>
          <Link to="/all-tickets" className="btn btn-brand w-full rounded-2xl px-8 text-white font-black uppercase tracking-widest border-none shadow-lg shadow-brand/20">Find New Trip</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#06080a] py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-10 ml-4">
          <Link to="/" className="hover:text-brand flex items-center gap-1 transition-colors"><ChevronLeft size={10} /> Home</Link>
          <span className="opacity-30">/</span>
          <Link to="/all-tickets" className="hover:text-brand transition-colors">Tickets</Link>
          <span className="opacity-30">/</span>
          <span className="text-brand italic">Details</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* LEFT COLUMN: Gallery & Amenities */}
          <div className="lg:col-span-7 space-y-8">
            <div className="relative group overflow-hidden rounded-[3.5rem]">
              <img 
                src={ticket.image} 
                alt={ticket.coachName} 
                className="w-full h-[550px] object-cover group-hover:scale-105 transition-transform duration-1000" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              <div className="absolute top-8 left-8 flex gap-3">
                <span className="bg-brand/90 backdrop-blur-xl text-white px-6 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl">
                  {ticket.type || 'Executive'}
                </span>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-10 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm">
              <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-8 flex items-center gap-2">
                <Info size={16} className="text-brand" /> Onboard Facilities
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {ticket.facilities?.split(",").map((f, idx) => (
                  <div key={idx} className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-700/50 transition-colors hover:border-brand/20">
                    <CheckCircle2 size={16} className="text-brand shrink-0" />
                    <span className="text-xs font-black uppercase text-slate-600 dark:text-slate-300 tracking-tighter">{f.trim()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Ticket Configurator */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-6">
            <div className="bg-white dark:bg-slate-900 p-8 lg:p-10 rounded-[3.5rem] shadow-2xl border border-slate-200 dark:border-slate-800 relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-brand/5 rounded-full blur-3xl"></div>
              
              <h1 className="text-4xl font-black text-slate-800 dark:text-white mb-6 leading-[1.1] tracking-tighter italic uppercase">
                {ticket.coachName || ticket.title}
              </h1>

              {/* Route Display */}
              <div className="flex items-center justify-between mb-8 p-6 bg-slate-50 dark:bg-slate-800/40 rounded-[2.5rem] border border-slate-100 dark:border-slate-700/50">
                <div className="text-center">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter mb-1">Departure</p>
                  <p className="text-xl font-black text-brand tracking-tighter uppercase">{ticket.from}</p>
                </div>
                <div className="flex-1 flex flex-col items-center px-4">
                    <div className="w-full h-px bg-dashed border-t border-dashed border-slate-300 dark:border-slate-600 relative">
                      <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-white dark:bg-slate-800 p-1.5 rounded-full border border-slate-200 dark:border-slate-600">
                        <TicketIcon size={12} className="text-brand" />
                      </div>
                    </div>
                </div>
                <div className="text-center">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter mb-1">Arrival</p>
                  <p className="text-xl font-black text-brand tracking-tighter uppercase">{ticket.to}</p>
                </div>
              </div>

              {/* Core Details */}
              <div className="space-y-5 mb-10">
                <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-800/30 p-4 rounded-2xl">
                  <div className="flex items-center gap-3 text-slate-500 font-bold text-xs uppercase tracking-widest"><Calendar size={16} className="text-brand" /> Date</div>
                  <span className="font-black text-slate-800 dark:text-white uppercase tracking-tighter">{ticket.date}</span>
                </div>
                <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-800/30 p-4 rounded-2xl">
                  <div className="flex items-center gap-3 text-slate-500 font-bold text-xs uppercase tracking-widest"><Clock size={16} className="text-brand" /> Time</div>
                  <span className="font-black text-slate-800 dark:text-white uppercase tracking-tighter">{ticket.time}</span>
                </div>
                <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-800/30 p-4 rounded-2xl">
                  <div className="flex items-center gap-3 text-slate-500 font-bold text-xs uppercase tracking-widest"><Users size={16} className="text-brand" /> Left</div>
                  <span className="font-black text-brand uppercase tracking-tighter">{ticket.quantity || ticket.availableSeats} Seats</span>
                </div>
              </div>

              {/* Countdown Timer */}
              <div className="mb-10 bg-brand/5 dark:bg-brand/10 p-8 rounded-[2.5rem] border border-brand/10 text-center">
                <p className="text-[10px] font-black uppercase text-brand tracking-[0.3em] mb-4">Boarding Begins In</p>
                <p className={`text-4xl font-black font-mono tracking-tighter ${isExpired ? "text-error" : "text-brand"}`}>
                  {timeLeft}
                </p>
              </div>

              {/* Price & Action */}
              <div className="flex flex-col gap-6">
                <div className="flex justify-between items-end">
                   <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Seat Price</p>
                      <p className="text-5xl font-black text-slate-800 dark:text-white tracking-tighter italic">৳{ticket.price}</p>
                   </div>
                </div>

                <button
                  disabled={isExpired || (ticket.quantity || ticket.availableSeats) === 0}
                  onClick={() => document.getElementById("booking_modal")?.showModal()}
                  className="group relative w-full h-18 py-5 bg-brand hover:bg-brand/90 disabled:bg-slate-300 dark:disabled:bg-slate-800 text-white rounded-[2rem] font-black uppercase tracking-[0.2em] transition-all overflow-hidden shadow-2xl shadow-brand/30 active:scale-95"
                >
                  <span className="relative z-10 flex items-center justify-center gap-3">
                    {isExpired ? "Booking Closed" : (ticket.quantity || ticket.availableSeats) === 0 ? "Sold Out" : "Secure My Seat"}
                    {!isExpired && (ticket.quantity || ticket.availableSeats) > 0 && <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full duration-700 transition-transform"></div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 🔹 ENHANCED BOOKING MODAL */}
      <dialog id="booking_modal" className="modal modal-bottom sm:modal-middle backdrop-blur-md">
        <div className="modal-box rounded-[3rem] dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-10 max-w-lg">
          <button onClick={() => document.getElementById("booking_modal").close()} className="btn btn-sm btn-circle btn-ghost absolute right-8 top-8">✕</button>
          
          <h3 className="font-black text-3xl mb-2 text-slate-800 dark:text-white tracking-tighter uppercase italic">Confirm Tickets</h3>
          <p className="text-xs text-slate-500 mb-10 font-bold uppercase tracking-widest">Journey to <span className="text-brand">{ticket.to}</span></p>
          
          <form onSubmit={handleBookingSubmit} className="space-y-10">
            <div className="bg-slate-50 dark:bg-slate-800/50 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                <button 
                  type="button" 
                  onClick={() => setBookingQty(Math.max(1, bookingQty - 1))}
                  className="w-14 h-14 rounded-2xl bg-white dark:bg-slate-700 shadow-md flex items-center justify-center text-brand hover:bg-brand hover:text-white transition-all active:scale-90"
                >
                  <Minus size={24} />
                </button>
                <span className="text-3xl font-black w-10 text-center tracking-tighter">{bookingQty}</span>
                <button 
                  type="button" 
                  onClick={() => setBookingQty(Math.min(ticket.quantity || ticket.availableSeats, bookingQty + 1))}
                  className="w-14 h-14 rounded-2xl bg-white dark:bg-slate-700 shadow-md flex items-center justify-center text-brand hover:bg-brand hover:text-white transition-all active:scale-90"
                >
                  <Plus size={24} />
                </button>
              </div>
              <div className="text-center sm:text-right">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Bill</p>
                <p className="text-4xl font-black text-brand tracking-tighter">৳{ticket.price * bookingQty}</p>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full h-16 bg-brand text-white rounded-[1.5rem] font-black uppercase tracking-widest shadow-xl shadow-brand/20 disabled:bg-slate-400 active:scale-95 transition-all"
            >
              {isSubmitting ? "Processing..." : "Submit Booking Request"}
            </button>
          </form>
        </div>
      </dialog>
    </div>
  );
};

export default TicketDetails;