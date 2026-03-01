import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const FAQ = () => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 2000); // simulate loading
        return () => clearTimeout(timer);
    }, []);

    // Reusable Shimmer component for local skeletons
    const Shimmer = () => (
        <div className="absolute top-0 left-0 w-full h-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 dark:via-slate-700/40 to-transparent -skew-x-12" />
    );

    return (
        <div className="bg-base-100 text-base-content min-h-screen">

            {/* ================= HERO SECTION ================= */}
            <section className="py-20 px-6 lg:px-20 text-center">
                {loading ? (
                    <div className="space-y-6 max-w-2xl mx-auto">
                        <div className="h-12 w-48 bg-slate-200 dark:bg-slate-800 rounded-xl mx-auto relative overflow-hidden">
                            <Shimmer />
                        </div>
                        <div className="h-10 w-3/4 bg-slate-200 dark:bg-slate-800 rounded-xl mx-auto relative overflow-hidden">
                            <Shimmer />
                        </div>
                        <div className="h-4 w-full bg-slate-100 dark:bg-slate-800/50 rounded-lg mx-auto relative overflow-hidden">
                            <Shimmer />
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Logo Styled Like Navbar */}
                        <div className="flex justify-center mb-6">
                            <div className="flex items-center gap-2 group">
                                <div className="bg-brand dark:bg-brand-light p-1.5 rounded-xl transition-transform group-hover:rotate-12">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white dark:text-dark-bg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                                    </svg>
                                </div>
                                <span className="text-3xl md:text-4xl font-black tracking-tighter uppercase text-slate-800 dark:text-white">
                                    Ticket<span className="text-brand dark:text-brand-light">Bari</span>
                                </span>
                            </div>
                        </div>

                        <h1 className="text-4xl lg:text-5xl font-bold mb-6">
                            Frequently Asked <span className="text-primary">Questions</span>
                        </h1>

                        <p className="max-w-2xl mx-auto text-lg text-base-content/70">
                            Find answers to the most common questions about booking bus and train
                            tickets through TicketBari.
                        </p>
                    </>
                )}
            </section>

            {/* ================= FAQ SECTION ================= */}
            <section className="pb-20 px-6 lg:px-20">
                <div className="max-w-4xl mx-auto space-y-6">
                    {loading ? (
                        // Render 6 skeleton accordions
                        [...Array(6)].map((_, i) => (
                            <div key={i} className="h-16 bg-slate-100 dark:bg-slate-900/50 rounded-2xl relative overflow-hidden border border-slate-200 dark:border-slate-800">
                                <Shimmer />
                            </div>
                        ))
                    ) : (
                        <>
                            {/* FAQ Items */}
                            {[
                                { q: "How do I book a ticket on TicketBari?", a: "Browse available bus or train tickets from the “All Tickets” page, select your preferred route, click “See Details,” and then click “Book Now.” After vendor approval, you can complete payment securely using Stripe.", checked: true },
                                { q: "Can I cancel my booking?", a: "Yes, you can cancel your booking before the vendor accepts it. Once accepted and payment is completed, cancellation policies depend on the vendor’s terms." },
                                { q: "How do I know if a vendor is trusted?", a: "All vendors are manually verified and approved by our admin team. Fraud vendors are permanently removed from the platform to ensure your safety." },
                                { q: "What payment methods are supported?", a: "We support secure online payments through Stripe. All transactions are encrypted and protected." },
                                { q: "Why can’t I book a ticket after departure time?", a: "For safety and accuracy, bookings are automatically disabled once the departure time has passed." },
                                { q: "How can I become a vendor?", a: "If you operate bus or train services, you can apply through the “Be a Vendor” option in the navbar. Our admin team will review your application before approval." }
                            ].map((item, index) => (
                                <div key={index} className="collapse collapse-plus bg-base-200 rounded-2xl">
                                    <input type="radio" name="faq-accordion" defaultChecked={item.checked} />
                                    <div className="collapse-title text-lg font-semibold">
                                        {item.q}
                                    </div>
                                    <div className="collapse-content text-base-content/70 leading-relaxed">
                                        {item.a}
                                    </div>
                                </div>
                            ))}
                        </>
                    )}
                </div>
            </section>

            {/* ================= CONTACT CTA ================= */}
            <section className="py-20 px-6 lg:px-20 bg-primary text-primary-content text-center rounded-t-3xl relative overflow-hidden">
                {loading ? (
                    <div className="max-w-2xl mx-auto space-y-4">
                        <div className="h-10 w-1/2 bg-white/20 rounded-xl mx-auto relative overflow-hidden"><Shimmer /></div>
                        <div className="h-4 w-full bg-white/10 rounded-lg mx-auto relative overflow-hidden"><Shimmer /></div>
                        <div className="h-12 w-40 bg-white/20 rounded-xl mx-auto relative overflow-hidden mt-6"><Shimmer /></div>
                    </div>
                ) : (
                    <>
                        <h2 className="text-3xl font-bold mb-6">
                            Still Have Questions?
                        </h2>
                        <p className="mb-8 max-w-2xl mx-auto">
                            Our support team is here to help you 24/7. Feel free to reach out
                            anytime.
                        </p>

                        <Link to="/contact">
                            <button className="btn bg-white text-primary hover:bg-base-200 border-none px-8 font-bold">
                                Contact Support
                            </button>
                        </Link>
                    </>
                )}
            </section>

        </div>
    );
};

export default FAQ;