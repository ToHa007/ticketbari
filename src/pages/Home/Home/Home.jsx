import React from "react";
import Banner from "../../../Components/Banner/Banner";
import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../../../hooks/useAxiosPublic";
import { Link } from "react-router-dom";
import { 
    ArrowRight, 
    ShieldCheck, 
    Zap, 
    Headset, 
    MapPin, 
    Ticket as TicketIcon, 
    Star 
} from "lucide-react";

const Home = () => {
    const axiosPublic = useAxiosPublic();


    const { data: advertised = [] } = useQuery({
        queryKey: ['advertised-tickets'],
        queryFn: async () => {
            const res = await axiosPublic.get('/tickets/advertised');
            return res.data;
        }
    });

    // 2. Fetch Latest Tickets (Exactly 6)
    const { data: latest = [], isLoading: latestLoading } = useQuery({
        queryKey: ['latest-tickets'],
        queryFn: async () => {
            const res = await axiosPublic.get('/tickets/latest');
            return res.data.slice(0, 6);
        }
    });

  
    const TicketCard = ({ ticket }) => (
        <div className="group bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-2xl transition-all duration-500">
            <div className="relative h-48 overflow-hidden">
                <img src={ticket.image} alt={ticket.coachName} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute top-4 right-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-brand">
                    {ticket.type}
                </div>
            </div>
            <div className="p-6">
                <h3 className="text-xl font-black text-slate-800 dark:text-white mb-1 line-clamp-1">
                    {ticket.coachName || ticket.title}
                </h3>
                <div className="flex items-center gap-1 text-slate-400 text-xs font-bold mb-4">
                    <MapPin size={12} className="text-brand" /> {ticket.from} — {ticket.to}
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase">Price</p>
                        <p className="text-lg font-black text-brand">৳{ticket.price}</p>
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase">Seats</p>
                        <p className="text-lg font-black text-slate-700 dark:text-slate-300">
                            {ticket.quantity || ticket.availableSeats}
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-6 h-12 overflow-hidden">
                    {ticket.facilities?.split(",").slice(0, 2).map((f, i) => (
                        <span key={i} className="text-[10px] bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md font-bold">
                            {f.trim()}
                        </span>
                    ))}
                </div>

                <Link 
                  to={`/ticket-details/${ticket._id}`}
                    className="w-full btn btn-brand rounded-2xl border-none text-white font-bold group-hover:gap-4 transition-all"
                >
                    See Details <ArrowRight size={18} />
                </Link>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#06080a] transition-colors duration-500 pb-20">
            <Banner />

          
            {advertised.length > 0 && (
                <section className="max-w-7xl mx-auto px-4 mt-20">
                    <div className="text-center lg:text-left mb-10">
                        <span className="text-brand font-black uppercase tracking-[0.3em] text-xs">
                            Admin Picks
                        </span>
                        <h2 className="text-4xl font-black text-slate-800 dark:text-white mt-2">
                            Promoted Journeys
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {advertised.map(ticket => (
                            <TicketCard key={ticket._id} ticket={ticket} />
                        ))}
                    </div>
                </section>
            )}

            
            <section className="max-w-7xl mx-auto px-4 mt-20">
                <div className="flex items-end justify-between mb-10">
                    <div>
                        <span className="text-slate-400 font-black uppercase tracking-[0.3em] text-xs">
                            Fresh Departures
                        </span>
                        <h2 className="text-4xl font-black text-slate-800 dark:text-white mt-2">
                            Latest Routes
                        </h2>
                    </div>
                    <Link
                        to="/all-tickets"
                        className="hidden md:flex items-center gap-2 font-bold text-brand hover:gap-4 transition-all"
                    >
                        Explore More <ArrowRight size={20} />
                    </Link>
                </div>

                {latestLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[1,2,3,4,5,6].map(i => (
                            <div key={i} className="h-80 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-[2.5rem]" />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {latest.map(ticket => (
                            <TicketCard key={ticket._id} ticket={ticket} />
                        ))}
                    </div>
                )}
            </section>

            {/* SECTION 3: WHY TICKETBARI (NOW AFTER LATEST ROUTES) */}
            <section className="bg-brand/5 dark:bg-brand/10 py-20 mt-20 border-y border-brand/10">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-black text-slate-800 dark:text-white uppercase tracking-tighter">
                            Why Choose TicketBari?
                        </h2>
                        <p className="text-slate-500 mt-2">
                            Redefining how you travel across the country
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        <div className="text-center p-8 bg-white dark:bg-slate-900 rounded-[3rem] shadow-xl hover:-translate-y-2 transition-transform duration-300">
                            <div className="w-16 h-16 bg-brand/10 rounded-2xl flex items-center justify-center text-brand mx-auto mb-6">
                                <ShieldCheck size={32}/>
                            </div>
                            <h4 className="text-xl font-bold mb-2">Verified Vendors</h4>
                            <p className="text-sm text-slate-500">
                                Every transport provider is manually approved by our admin team for your safety.
                            </p>
                        </div>

                        <div className="text-center p-8 bg-white dark:bg-slate-900 rounded-[3rem] shadow-xl md:translate-y-6 hover:-translate-y-2 transition-transform duration-300">
                            <div className="w-16 h-16 bg-orange-500/10 rounded-2xl flex items-center justify-center text-orange-500 mx-auto mb-6">
                                <Zap size={32}/>
                            </div>
                            <h4 className="text-xl font-bold mb-2">Real-time Updates</h4>
                            <p className="text-sm text-slate-500">
                                Get live updates on seat availability and departure timings instantly.
                            </p>
                        </div>

                        <div className="text-center p-8 bg-white dark:bg-slate-900 rounded-[3rem] shadow-xl hover:-translate-y-2 transition-transform duration-300">
                            <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500 mx-auto mb-6">
                                <Headset size={32}/>
                            </div>
                            <h4 className="text-xl font-bold mb-2">Hassle-Free Payment</h4>
                            <p className="text-sm text-slate-500">
                                Secure Stripe integration ensures your transaction is smooth and protected.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION 4: TRENDING ROUTES */}
            <section className="max-w-7xl mx-auto px-4 mt-32">
                <div className="bg-slate-900 rounded-[4rem] p-12 relative overflow-hidden text-white border border-white/5">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-brand/20 blur-[100px] rounded-full" />
                    <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-blue-500/10 blur-[80px] rounded-full" />

                    <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10">
                        <div className="max-w-md text-center lg:text-left">
                            <h2 className="text-4xl font-black mb-4 italic">Trending Routes</h2>
                            <p className="text-slate-400 font-medium">
                                The most searched and booked journeys by our community this week.
                            </p>
                        </div>

                        <div className="flex flex-wrap justify-center gap-4">
                            {['Dhaka to Coxs Bazar','Sylhet to Chittagong','Dhaka to Bogura'].map((route, idx) => (
                                <div key={idx} className="bg-white/5 border border-white/10 backdrop-blur-md p-6 rounded-3xl flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-brand flex items-center justify-center font-black">
                                        {idx + 1}
                                    </div>
                                    <div>
                                        <p className="font-bold text-lg">{route}</p>
                                        <div className="flex text-orange-400 gap-0.5">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} size={10} fill="currentColor" />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
