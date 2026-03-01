import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import CheckoutForm from "./Checkout";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import { MoveRight, ShieldCheck } from "lucide-react";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

// Internal Shimmer Utility
const Shimmer = () => (
    <div className="absolute top-0 left-0 w-full h-full animate-shimmer bg-gradient-to-r from-transparent via-white/10 dark:via-slate-700/20 to-transparent -skew-x-12" />
);

const Payment = () => {
    const { id } = useParams();
    const axiosPublic = useAxiosPublic(); 
    const { data: booking, isLoading } = useQuery({
        queryKey: ['booking-payment', id],
        queryFn: async () => {
            const res = await axiosPublic.get(`/bookings/id/${id}`);
            return res.data;
        }
    });

    if (isLoading) return (
        /* ================= PAYMENT PAGE SKELETON ================= */
        <div className="max-w-3xl mx-auto p-6 md:p-10 bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-sm mt-10">
            <div className="space-y-4 mb-8">
                <div className="h-10 w-48 bg-slate-200 dark:bg-slate-800 rounded-xl relative overflow-hidden"><Shimmer /></div>
                <div className="h-4 w-64 bg-slate-100 dark:bg-slate-800 rounded relative overflow-hidden"><Shimmer /></div>
            </div>
            <div className="h-28 w-full bg-slate-50 dark:bg-slate-800/50 rounded-3xl mb-8 relative overflow-hidden">
                <Shimmer />
            </div>
            <div className="space-y-6">
                <div className="h-14 w-full bg-slate-100 dark:bg-slate-800 rounded-2xl relative overflow-hidden"><Shimmer /></div>
                <div className="h-14 w-full bg-slate-200 dark:bg-slate-700 rounded-2xl relative overflow-hidden"><Shimmer /></div>
            </div>
        </div>
    );

    if (!booking) return (
        <div className="min-h-[50vh] flex flex-col items-center justify-center p-10 text-center">
            <div className="w-20 h-20 bg-red-50 dark:bg-red-500/10 rounded-full flex items-center justify-center text-red-500 mb-4">
                <ShieldCheck size={40} />
            </div>
            <h3 className="text-xl font-black text-slate-800 dark:text-white uppercase">Booking Not Found</h3>
            <p className="text-slate-500 max-w-xs mx-auto mt-2 font-medium">We couldn't retrieve the ticket details. It might have expired or been removed.</p>
        </div>
    );

    return (
        <div className="max-w-3xl mx-auto p-6 md:p-10 bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-sm mt-10">
            <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h2 className="text-4xl font-black uppercase tracking-tighter italic dark:text-white leading-none">
                        Secure <span className="text-brand">Payment</span>
                    </h2>
                    <p className="text-slate-500 font-bold italic mt-2 flex items-center gap-2">
                        {booking?.from} <MoveRight size={14} className="text-brand" /> {booking?.to}
                    </p>
                </div>
                <div className="bg-brand/10 text-brand px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-brand/20">
                    {booking?.coachName || 'Express Coach'}
                </div>
            </header>

            {/* Price Summary Card */}
            <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-[2rem] mb-8 flex flex-col sm:flex-row justify-between items-center border border-slate-100 dark:border-slate-700 gap-4">
                <div className="text-center sm:text-left">
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Total Payable Amount</p>
                    <p className="text-4xl font-black text-brand tracking-tighter">৳{booking?.totalPrice}</p>
                </div>
                <div className="sm:text-right">
                    <div className="inline-flex flex-col items-center sm:items-end px-4 py-2 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter italic">Fare Breakdown</p>
                        <p className="text-sm font-black text-slate-700 dark:text-slate-200">
                            {booking?.bookingQuantity} Seats × ৳{Math.round(booking?.totalPrice / booking?.bookingQuantity)}
                        </p>
                    </div>
                </div>
            </div>

            {/* Payment Gateway Section */}
            <div className="space-y-6">
                <div className="flex items-center gap-2 mb-2">
                    <ShieldCheck size={18} className="text-green-500" />
                    <span className="text-xs font-black uppercase text-slate-500 tracking-widest">Encrypted Checkout</span>
                </div>
                
                <Elements stripe={stripePromise}>
                    <CheckoutForm booking={booking} />
                </Elements>
            </div>
        </div>
    );
};

export default Payment;