import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import useAxiosPublic from "../../hooks/useAxiosPublic";

// Internal Shimmer for loading states
const Shimmer = () => (
    <div className="absolute top-0 left-0 w-full h-full animate-shimmer bg-gradient-to-r from-transparent via-white/10 dark:via-slate-700/20 to-transparent -skew-x-12" />
);

const CheckoutForm = ({ booking }) => {
    const stripe = useStripe();
    const elements = useElements();
    const axiosPublic = useAxiosPublic();
    const navigate = useNavigate();
    const [processing, setProcessing] = useState(false);
    const [clientSecret, setClientSecret] = useState("");

    useEffect(() => {
        if (booking?.totalPrice > 0) {
            axiosPublic.post('/create-payment-intent', { price: booking.totalPrice })
                .then(res => {
                    if (res.data?.clientSecret) {
                        setClientSecret(res.data.clientSecret);
                    }
                })
                .catch(err => {
                    console.error("Stripe Secret Error:", err);
                    toast.error("Could not initialize payment gateway.");
                });
        }
    }, [axiosPublic, booking?.totalPrice]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        // 1. REQUIREMENT CHECK: Expiry Check
        const departure = new Date(`${booking?.departureDate}T${booking?.departureTime}`);
        if (departure < new Date()) {
            return toast.error("Booking expired! You cannot pay for a past journey.");
        }

        if (!stripe || !elements || !clientSecret) return;

        const card = elements.getElement(CardElement);
        if (card === null) return;

        setProcessing(true);

        // 2. Stripe Payment Logic
        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card,
        });

        if (error) {
            toast.error(error.message);
            setProcessing(false);
            return;
        }

        const { paymentIntent, error: confirmError } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: card,
                billing_details: {
                    email: booking?.userEmail || 'anonymous',
                    name: booking?.userName || 'anonymous',
                },
            },
        });

        if (confirmError) {
            toast.error(confirmError.message);
        } else if (paymentIntent.status === "succeeded") {
            // 3. FULFILLMENT: Update status to 'paid'
            try {
                const res = await axiosPublic.patch(`/bookings/status/${booking?._id}`, { status: 'paid' });
                
                if (res.data.modifiedCount > 0) {
                    toast.success("Payment Successful! Your seat is secured.");
                    navigate('/user-dashboard/my-booked-tickets');
                }
            } catch (err) {
                toast.error("Payment succeeded but database update failed. Contact support.");
            }
        }
        setProcessing(false);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative p-4 border border-slate-200 dark:border-slate-700 rounded-2xl bg-white dark:bg-slate-900 shadow-inner">
                {!clientSecret ? (
                    /* --- PAYMENT INPUT SKELETON --- */
                    <div className="h-10 w-full flex items-center px-2">
                        <div className="h-4 w-full bg-slate-100 dark:bg-slate-800 rounded relative overflow-hidden">
                            <Shimmer />
                        </div>
                    </div>
                ) : (
                    <CardElement
                        options={{
                            style: {
                                base: {
                                    fontSize: '16px',
                                    color: '#424770',
                                    '::placeholder': { color: '#aab7c4' },
                                    fontFamily: 'Inter, sans-serif',
                                },
                                invalid: { color: '#ef4444' },
                            },
                        }}
                    />
                )}
            </div>
            
            <button
                type="submit"
                disabled={!stripe || processing || !clientSecret} 
                className={`w-full rounded-2xl text-white font-black uppercase tracking-widest shadow-lg h-14 transition-all duration-300 relative overflow-hidden
                    ${!clientSecret || !stripe ? "bg-slate-400 cursor-not-allowed" : "bg-brand hover:bg-brand/90 shadow-brand/20 active:scale-[0.98]"}
                `}
            >
                {processing ? (
                    <div className="flex items-center justify-center gap-3">
                        <span className="loading loading-spinner loading-sm"></span>
                        <span>Verifying...</span>
                    </div>
                ) : !clientSecret ? (
                    <div className="flex items-center justify-center gap-2 italic opacity-80">
                         Initialising Gateway...
                         <Shimmer />
                    </div>
                ) : (
                    <span className="flex items-center justify-center gap-2">
                        Confirm Payment · ৳{booking?.totalPrice}
                    </span>
                )}
            </button>
            
            <div className="flex items-center justify-center gap-4 opacity-50 grayscale">
                <img src="https://i.ibb.co/308XmPX/visa.png" alt="Visa" className="h-4" />
                <img src="https://i.ibb.co/5G7n8Yj/mastercard.png" alt="Mastercard" className="h-4" />
                <img src="https://i.ibb.co/vX9YhXp/stripe.png" alt="Stripe" className="h-6" />
            </div>

            <p className="text-[10px] text-center text-slate-400 font-bold uppercase tracking-tighter">
                🔒 Your data is encrypted with 256-bit SSL
            </p>
        </form>
    );
};

export default CheckoutForm;