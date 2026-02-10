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
} from "lucide-react";
import { AuthContext } from "../../Components/Context/AuthContext/AuthProvider";

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
          showConfirmButton: true,
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
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-[#06080a]">
        <span className="loading loading-ring loading-lg text-brand"></span>
        <p className="mt-4 font-black text-brand animate-pulse uppercase tracking-widest text-xs">Loading Journey</p>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 bg-slate-50 dark:bg-[#06080a]">
        <div className="bg-white dark:bg-slate-900 p-10 rounded-[3rem] shadow-2xl border border-slate-200 dark:border-slate-800">
          <h2 className="text-6xl mb-6">🛰️</h2>
          <h2 className="text-3xl font-black text-slate-800 dark:text-white mb-2 uppercase">Ticket Not Found</h2>
          <Link to="/all-tickets" className="btn btn-brand rounded-2xl px-8 text-white font-bold border-none shadow-lg shadow-brand/20">Find Another Trip</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#06080a] py-12 px-4 transition-colors duration-500">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 mb-8 ml-4">
          <Link to="/" className="hover:text-brand transition-colors">Home</Link>
          <ArrowRight size={12} />
          <Link to="/all-tickets" className="hover:text-brand transition-colors">All Tickets</Link>
          <ArrowRight size={12} />
          <span className="text-brand">Ticket Details</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* LEFT COLUMN */}
          <div className="lg:col-span-7 space-y-8">
            <div className="relative group">
              <img src={ticket.image} alt={ticket.coachName} className="w-full h-[500px] object-cover rounded-[3.5rem] shadow-2xl transition-transform duration-700" />
              <div className="absolute top-6 left-6 flex gap-3">
                <span className="bg-black/40 backdrop-blur-xl text-white px-5 py-2 rounded-2xl text-xs font-black uppercase tracking-widest border border-white/20">{ticket.type}</span>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900/50 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm">
              <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2"><Info size={16} className="text-brand" /> Trip Amenities</h3>
              <div className="flex flex-wrap gap-3">
                {ticket.facilities?.split(",").map((f, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800/80 px-5 py-3 rounded-2xl">
                    <CheckCircle2 size={16} className="text-brand" />
                    <span className="text-sm font-bold">{f.trim()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-6">
            <div className="bg-white dark:bg-slate-900 p-8 lg:p-10 rounded-[3rem] shadow-2xl border border-slate-200 dark:border-slate-800 relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-brand/5 rounded-full blur-3xl"></div>
              <h1 className="text-4xl font-black text-slate-800 dark:text-white mb-6 leading-tight">{ticket.coachName || ticket.title}</h1>

              <div className="flex items-center justify-between mb-8 p-6 bg-slate-50 dark:bg-slate-800/40 rounded-[2rem] border border-slate-100 dark:border-slate-700/50">
                <div className="text-center">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Origin</p>
                  <p className="text-lg font-black text-brand">{ticket.from}</p>
                </div>
                <div className="flex-1 flex flex-col items-center px-4">
                  <div className="w-full border-t-2 border-dashed border-slate-300 dark:border-slate-600 relative">
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-white dark:bg-slate-800 p-1 rounded-full border border-slate-200 dark:border-slate-600">
                      <TicketIcon size={14} className="text-brand" />
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Destination</p>
                  <p className="text-lg font-black text-brand">{ticket.to}</p>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-3 text-slate-500 font-bold"><Calendar size={18} className="text-brand" /> Date</div>
                  <span className="font-black text-slate-800 dark:text-white">{ticket.date}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-3 text-slate-500 font-bold"><Clock size={18} className="text-brand" /> Departure</div>
                  <span className="font-black text-slate-800 dark:text-white">{ticket.time}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-3 text-slate-500 font-bold"><ShieldCheck size={18} className="text-brand" /> Availability</div>
                  <span className="font-black text-brand">{ticket.quantity || ticket.availableSeats} Seats Left</span>
                </div>
              </div>

              <div className="mb-8 overflow-hidden rounded-3xl border border-brand/20 bg-brand/[0.03] dark:bg-brand/5">
                <div className="bg-brand/10 px-6 py-2 border-b border-brand/10"><p className="text-[10px] font-black uppercase text-brand tracking-widest text-center">Countdown</p></div>
                <div className="p-6 text-center"><p className={`text-3xl font-black font-mono tracking-tighter ${isExpired ? "text-error" : "text-brand"}`}>{timeLeft}</p></div>
              </div>

              <div className="flex items-center justify-between mb-8">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase">Unit Price</p>
                  <p className="text-4xl font-black text-slate-800 dark:text-white">৳{ticket.price}</p>
                </div>
              </div>

              <button
                disabled={isExpired || (ticket.quantity || ticket.availableSeats) === 0}
                onClick={() => document.getElementById("booking_modal")?.showModal()}
                className="group relative w-full h-16 bg-brand hover:bg-brand/90 disabled:bg-slate-300 dark:disabled:bg-slate-800 text-white rounded-[1.5rem] font-black uppercase tracking-widest transition-all overflow-hidden shadow-xl shadow-brand/30"
              >
                <span className="relative z-10 flex items-center justify-center gap-3">
                  {isExpired ? "Booking Closed" : (ticket.quantity || ticket.availableSeats) === 0 ? "Sold Out" : "Book Now"}
                  {!isExpired && (ticket.quantity || ticket.availableSeats) > 0 && <ArrowRight className="group-hover:translate-x-2 transition-transform" />}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full duration-1000 transition-transform"></div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 🔹 BOOKING MODAL */}
      <dialog id="booking_modal" className="modal modal-bottom sm:modal-middle backdrop-blur-sm">
        <div className="modal-box rounded-[2.5rem] dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8">
          <button onClick={() => document.getElementById("booking_modal").close()} className="btn btn-sm btn-circle btn-ghost absolute right-6 top-6">✕</button>
          
          <h3 className="font-black text-2xl mb-2 text-slate-800 dark:text-white">Secure Your Journey</h3>
          <p className="text-sm text-slate-500 mb-8">How many seats do you need for the trip to <span className="text-brand font-bold">{ticket.to}</span>?</p>
          
          <form onSubmit={handleBookingSubmit} className="space-y-8">
            <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button 
                  type="button" 
                  onClick={() => setBookingQty(Math.max(1, bookingQty - 1))}
                  className="w-12 h-12 rounded-xl bg-white dark:bg-slate-700 shadow-sm flex items-center justify-center text-brand hover:bg-brand hover:text-white transition-all"
                >
                  <Minus size={20} />
                </button>
                <span className="text-2xl font-black w-8 text-center">{bookingQty}</span>
                <button 
                  type="button" 
                  onClick={() => setBookingQty(Math.min(ticket.quantity || ticket.availableSeats, bookingQty + 1))}
                  className="w-12 h-12 rounded-xl bg-white dark:bg-slate-700 shadow-sm flex items-center justify-center text-brand hover:bg-brand hover:text-white transition-all"
                >
                  <Plus size={20} />
                </button>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black text-slate-400 uppercase">Total Bill</p>
                <p className="text-2xl font-black text-brand">৳{ticket.price * bookingQty}</p>
              </div>
            </div>

            <div className="flex gap-4">
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="flex-1 h-14 bg-brand text-white rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-brand/20 disabled:bg-slate-400"
              >
                {isSubmitting ? "Processing..." : "Confirm Booking"}
              </button>
            </div>
          </form>
        </div>
      </dialog>
    </div>
  );
};

export default TicketDetails;