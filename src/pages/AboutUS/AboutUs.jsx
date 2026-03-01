import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaHandshake, FaGavel, FaHeadset } from "react-icons/fa";
import { MdOutlineRocketLaunch, MdMail, MdPhone, MdLocationOn } from "react-icons/md";

const AboutUs = () => {

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 2000); // simulate loading
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#06080a] transition-colors duration-500 text-slate-800 dark:text-slate-200">

            {/* HERO SECTION */}
            <section className="py-24 px-6 lg:px-20 text-center relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-96 bg-brand/5 blur-[120px] rounded-xl -z-10" />

                {loading ? (
                    <div className="animate-pulse space-y-6 max-w-3xl mx-auto">
                        <div className="h-12 bg-slate-300 dark:bg-slate-700 rounded w-2/3 mx-auto"></div>
                        <div className="h-6 bg-slate-300 dark:bg-slate-700 rounded w-full"></div>
                        <div className="h-6 bg-slate-300 dark:bg-slate-700 rounded w-5/6 mx-auto"></div>
                    </div>
                ) : (
                    <>
                        <div className="flex justify-center mb-8">
                            <div className="flex items-center gap-3 group">
                                <h1 className="text-4xl lg:text-6xl font-black tracking-tighter text-slate-900 dark:text-white">
                                    About
                                </h1>
                                <span className="text-3xl lg:text-5xl font-black tracking-tighter uppercase">
                                    Ticket<span className="text-brand">Bari</span>
                                </span>
                            </div>
                        </div>

                        <p className="max-w-3xl mx-auto text-lg md:text-xl text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                            TicketBari is Bangladesh's premier digital transit marketplace. We bridge the gap between travelers and transport operators through a verified, high-speed booking ecosystem designed for the modern commuter.
                        </p>
                    </>
                )}
            </section>

            {/* MISSION & VISION */}
            <section className="py-20 px-4 max-w-7xl mx-auto">
                <div className="grid lg:grid-cols-2 gap-8">
                    {[1,2].map((item) => (
                        <div key={item} className="bg-white dark:bg-slate-900 p-10 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
                            {loading ? (
                                <div className="animate-pulse space-y-4">
                                    <div className="h-8 w-8 bg-slate-300 dark:bg-slate-700 rounded"></div>
                                    <div className="h-6 bg-slate-300 dark:bg-slate-700 rounded w-1/2"></div>
                                    <div className="h-4 bg-slate-300 dark:bg-slate-700 rounded w-full"></div>
                                    <div className="h-4 bg-slate-300 dark:bg-slate-700 rounded w-5/6"></div>
                                </div>
                            ) : item === 1 ? (
                                <>
                                    <div className="w-12 h-12 bg-brand/10 rounded-xl flex items-center justify-center text-brand mb-6">
                                        <FaHandshake size={24} />
                                    </div>
                                    <h2 className="text-3xl font-black mb-4 dark:text-white">Our Mission</h2>
                                    <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                                        To digitize the rural and urban transport sectors of Bangladesh by providing a transparent,
                                        queue-free booking experience. We empower travelers with real-time data while providing vendors with a robust platform to manage their fleet efficiently.
                                    </p>
                                </>
                            ) : (
                                <>
                                    <div className="w-12 h-12 bg-brand/10 rounded-xl flex items-center justify-center text-brand mb-6">
                                        <MdOutlineRocketLaunch size={24} />
                                    </div>
                                    <h2 className="text-3xl font-black mb-4 dark:text-white">Our Vision</h2>
                                    <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                                        We envision an interconnected nation where every journey—be it by bus, train, or launch—is accessible within three clicks. Our goal is to set the gold standard for travel security and reliability in South Asia by 2030.
                                    </p>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            </section>

            {/* TERMS */}
            <section className="py-20 bg-slate-100 dark:bg-slate-900/50 border-y border-slate-200 dark:border-slate-800">
                <div className="max-w-7xl mx-auto px-4">
                    {loading ? (
                        <div className="animate-pulse space-y-6">
                            <div className="h-8 bg-slate-300 dark:bg-slate-700 rounded w-1/3"></div>
                            <div className="grid md:grid-cols-3 gap-6">
                                {[1,2,3].map(i => (
                                    <div key={i} className="space-y-3">
                                        <div className="h-4 bg-slate-300 dark:bg-slate-700 rounded w-1/2"></div>
                                        <div className="h-4 bg-slate-300 dark:bg-slate-700 rounded w-full"></div>
                                        <div className="h-4 bg-slate-300 dark:bg-slate-700 rounded w-5/6"></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="flex items-center gap-3 mb-12">
                                <FaGavel className="text-brand text-3xl" />
                                <h2 className="text-4xl font-black dark:text-white tracking-tight">Terms of Service</h2>
                            </div>

                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 text-sm">
                                <div className="space-y-3">
                                    <h4 className="font-black uppercase text-brand tracking-widest">1. Booking Policy</h4>
                                    <p className="text-slate-500 dark:text-slate-400">
                                        Tickets are non-transferable. Users must provide valid identification that matches the name on the digital ticket during boarding.
                                    </p>
                                </div>

                                <div className="space-y-3">
                                    <h4 className="font-black uppercase text-brand tracking-widest">2. Cancellation & Refunds</h4>
                                    <p className="text-slate-500 dark:text-slate-400">
                                        Cancellations made 24 hours prior to departure are eligible for an 80% refund. No refunds are provided for 'No-Show' cases.
                                    </p>
                                </div>

                                <div className="space-y-3">
                                    <h4 className="font-black uppercase text-brand tracking-widest">3. Vendor Responsibility</h4>
                                    <p className="text-slate-500 dark:text-slate-400">
                                        TicketBari acts as an aggregator. Technical delays or coach conditions are the sole responsibility of the transport provider.
                                    </p>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </section>

            {/* CONTACT SECTION FULLY RESTORED */}
            <section className="py-24 px-4 max-w-7xl mx-auto">
                <div className="grid lg:grid-cols-2 gap-16 items-center">

                    {loading ? (
                        <div className="animate-pulse space-y-6">
                            <div className="h-10 bg-slate-300 dark:bg-slate-700 rounded w-1/2"></div>
                            <div className="h-6 bg-slate-300 dark:bg-slate-700 rounded w-full"></div>
                            <div className="h-6 bg-slate-300 dark:bg-slate-700 rounded w-5/6"></div>
                            <div className="h-6 bg-slate-300 dark:bg-slate-700 rounded w-4/6"></div>
                        </div>
                    ) : (
                        <>
                            <div>
                                <span className="text-brand font-black uppercase tracking-[0.3em] text-xs">Get in Touch</span>
                                <h2 className="text-5xl font-black text-slate-900 dark:text-white mt-4 mb-8">Need Assistance?</h2>

                                <div className="space-y-6">
                                    <div className="flex items-start gap-5">
                                        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl shadow-sm text-brand"><MdMail size={24} /></div>
                                        <div>
                                            <h4 className="font-bold text-lg dark:text-white">Email Us</h4>
                                            <p className="text-slate-500">support@ticketbari.com</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-5">
                                        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl shadow-sm text-brand"><MdPhone size={24} /></div>
                                        <div>
                                            <h4 className="font-bold text-lg dark:text-white">Call 24/7</h4>
                                            <p className="text-slate-500">+880 1234 567 890</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-5">
                                        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl shadow-sm text-brand"><MdLocationOn size={24} /></div>
                                        <div>
                                            <h4 className="font-bold text-lg dark:text-white">Headquarters</h4>
                                            <p className="text-slate-500">Suite 402, Travel Plaza, Gulshan-2, Dhaka</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-brand rounded-xl p-12 text-white relative overflow-hidden shadow-2xl shadow-brand/30">
                                <FaHeadset className="absolute -bottom-10 -right-10 text-white/10 size-64" />
                                <h3 className="text-3xl font-black mb-6">Partner with us?</h3>
                                <p className="text-white/80 mb-8 leading-relaxed">
                                    Are you a transport owner looking to expand your reach? Join over 300+ verified vendors who trust TicketBari for their daily bookings.
                                </p>
                                <button className="bg-white text-brand px-8 py-4 rounded-xl font-black hover:bg-slate-100 transition-all uppercase text-sm tracking-widest">
                                    Vendor Registration
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </section>

        </div>
    );
};

export default AboutUs;