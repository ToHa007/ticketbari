import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import CheckoutForm from "./Checkout";
import useAxiosPublic from "../../hooks/useAxiosPublic";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

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
        <div className="min-h-screen flex items-center justify-center">
            <span className="loading loading-spinner loading-lg text-brand"></span>
        </div>
    );

  
    if (!booking) return <div className="p-20 text-center font-bold text-red-500">Booking not found.</div>;

    return (
        <div className="max-w-3xl mx-auto p-10 bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-sm mt-10">
            <header className="mb-8">
                <h2 className="text-3xl font-black uppercase tracking-tighter italic dark:text-white">
                    Secure <span className="text-brand">Payment</span>
                </h2>
                <p className="text-slate-500 font-medium italic">Finalize your booking for {booking?.coachName}</p>
            </header>

            <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-2xl mb-8 flex justify-between items-center border border-slate-100 dark:border-slate-700">
                <div>
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Total Amount</p>
                    <p className="text-3xl font-black text-brand">৳{booking?.totalPrice}</p>
                </div>
                <div className="text-right text-xs font-bold text-slate-500 uppercase">
                    <p>{booking?.bookingQuantity} Tickets × ৳{booking?.totalPrice / booking?.bookingQuantity}</p>
                </div>
            </div>

            <Elements stripe={stripePromise}>
                <CheckoutForm booking={booking} />
            </Elements>
        </div>
    );
};

export default Payment;