import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import useAxiosPublic from "../../hooks/useAxiosPublic";

const CheckoutForm = ({ booking }) => {
    const stripe = useStripe();
    const elements = useElements();
    const axiosPublic = useAxiosPublic();
    const navigate = useNavigate();
    const [processing, setProcessing] = useState(false);
    const [clientSecret, setClientSecret] = useState("");

    useEffect(() => {
        // Fetch Client Secret from Backend for the specific totalPrice
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
            // 3. FULFILLMENT: Update status to 'paid' and Reduce Ticket Quantity
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
            <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 shadow-inner">
                <CardElement
                    options={{
                        style: {
                            base: {
                                fontSize: '16px',
                                color: '#424770',
                                '::placeholder': { color: '#aab7c4' },
                            },
                            invalid: { color: '#9e2146' },
                        },
                    }}
                />
            </div>
            
            <button
                type="submit"
                disabled={!stripe || processing || !clientSecret} 
                className={`w-full rounded-2xl text-white font-black uppercase tracking-widest shadow-lg h-14 transition-all duration-300
                    ${!clientSecret || !stripe ? "bg-slate-400 cursor-not-allowed" : "bg-brand hover:bg-brand/90 shadow-brand/20"}
                `}
            >
                {processing ? (
                    <span className="loading loading-spinner"></span>
                ) : !clientSecret ? (
                    <span className="flex items-center justify-center gap-2">
                         Initialising Gateway...
                    </span>
                ) : (
                    `Confirm Payment: ৳${booking?.totalPrice}`
                )}
            </button>
            
            <p className="text-[10px] text-center text-slate-400 font-bold uppercase tracking-tighter">
                🔒 Secured by Stripe Payment Gateway
            </p>
        </form>
    );
};

export default CheckoutForm;