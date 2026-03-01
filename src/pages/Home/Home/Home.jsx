import React from "react";
import Banner from "../../../Components/Banner/Banner";
import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../../../hooks/useAxiosPublic";
import { Link } from "react-router-dom";
import { TicketGridSkeleton } from "../../shared/SkeletonLoader/SkeletonLoader";
import { 
    ArrowRight, 
    ShieldCheck, 
    Zap, 
    Headset, 
    MapPin, 
    Star, 
    Users, 
    Bus, 
    Globe, 
    Ticket,
    Mail
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

    const { data: latest = [], isLoading: latestLoading } = useQuery({
        queryKey: ['latest-tickets'],
        queryFn: async () => {
            const res = await axiosPublic.get('/tickets/latest');
            return res.data.slice(0, 6);
        }
    });

    const TicketCard = ({ ticket }) => (
        <div className="group bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-xl transition-all duration-300">
            <div className="relative h-48 overflow-hidden">
                <img 
                    src={ticket.image} 
                    alt={ticket.coachName} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                <div className="absolute top-3 right-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest text-brand">
                    {ticket.type}
                </div>
            </div>

            <div className="p-5">
                <h3 className="text-lg font-black text-slate-800 dark:text-white mb-1 line-clamp-1">
                    {ticket.coachName || ticket.title}
                </h3>
                <div className="flex items-center gap-1 text-slate-400 text-xs font-bold mb-4">
                    <MapPin size={12} className="text-brand" />
                    {ticket.from} — {ticket.to}
                </div>
                <div className="grid grid-cols-2 gap-4 mb-5">
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase">Price</p>
                        <p className="text-base font-black text-brand">৳{ticket.price}</p>
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase">Seats</p>
                        <p className="text-base font-black text-slate-700 dark:text-slate-300">
                            {ticket.quantity || ticket.availableSeats}
                        </p>
                    </div>
                </div>
                <Link 
                    to={`/ticket-details/${ticket._id}`}
                    className="w-full btn btn-brand rounded-xl border-none text-white font-bold flex items-center justify-center gap-2 hover:gap-3 transition-all"
                >
                    See Details <ArrowRight size={16} />
                </Link>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#06080a] transition-colors duration-500 pb-20 overflow-hidden">
            
            {/* 1. HERO SECTION */}
            <Banner />

            {/* 2. DYNAMIC STATS SECTION */}
            <section className="max-w-7xl mx-auto px-4 mt-12 relative z-20">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                    {[
                        { label: "Happy Travelers", value: "50k+", icon: <Users /> },
                        { label: "Verified Routes", value: "1.2k+", icon: <Globe /> },
                        { label: "Bus Partners", value: "80+", icon: <Bus /> },
                        { label: "Tickets Sold", value: "100k+", icon: <Ticket /> },
                    ].map((stat, i) => (
                        <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-lg border border-slate-100 dark:border-slate-800 flex items-center gap-4 group hover:border-brand transition-all">
                            <div className="p-3 rounded-xl bg-brand/10 text-brand group-hover:bg-brand group-hover:text-white transition-colors">
                                {React.cloneElement(stat.icon, { size: 24 })}
                            </div>
                            <div>
                                <h4 className="text-2xl font-black text-slate-800 dark:text-white leading-none">{stat.value}</h4>
                                <p className="text-[10px] md:text-xs text-slate-400 font-bold uppercase tracking-tighter mt-1">{stat.label}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* 3. ADVERTISED TICKETS */}
            {advertised.length > 0 && (
                <section className="max-w-7xl mx-auto px-4 mt-24 md:mt-32">
                    <div className="text-center md:text-left mb-10">
                        <span className="text-brand font-black uppercase tracking-[0.3em] text-xs">Admin Picks</span>
                        <h2 className="text-4xl font-black text-slate-800 dark:text-white mt-2">Promoted Journeys</h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {advertised.map(ticket => (
                            <TicketCard key={ticket._id} ticket={ticket} />
                        ))}
                    </div>
                </section>
            )}

            {/* 4. EXPLORE BY CATEGORY */}
            <section className="max-w-7xl mx-auto px-4 mt-24 md:mt-32">
                <div className="text-center mb-12">
                    <span className="text-slate-400 font-black uppercase tracking-[0.3em] text-xs">Versatile Fleet</span>
                    <h2 className="text-3xl md:text-4xl font-black text-slate-800 dark:text-white mt-2 uppercase">Travel Your Way</h2>
                    <p className="text-slate-500 mt-2">Pick a category that fits your comfort level</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {['Luxury AC', 'Economy', 'Sleeper', 'Double Decker'].map((cat, i) => (
                        <div key={i} className="group cursor-pointer bg-white dark:bg-slate-900 p-8 rounded-xl border border-slate-100 dark:border-slate-800 text-center hover:border-brand transition-all shadow-sm">
                            <div className="w-16 h-16 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                <Bus className="text-brand" size={28} />
                            </div>
                            <h4 className="font-black text-slate-800 dark:text-white">{cat}</h4>
                            <p className="text-xs text-slate-400 mt-1">Starting from ৳450</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* 5. LATEST ROUTES */}
            <section className="max-w-7xl mx-auto px-4 mt-24 md:mt-32">
                <div className="flex items-end justify-between mb-10">
                    <div>
                        <span className="text-slate-400 font-black uppercase tracking-[0.3em] text-xs">Fresh Departures</span>
                        <h2 className="text-4xl font-black text-slate-800 dark:text-white mt-2">Latest Routes</h2>
                    </div>
                    <Link to="/all-tickets" className="hidden md:flex items-center gap-2 font-bold text-brand hover:gap-4 transition-all group">
                        Explore More <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                {latestLoading ? (
                    <TicketGridSkeleton cards={4} />
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {latest.map(ticket => <TicketCard key={ticket._id} ticket={ticket} />)}
                    </div>
                )}
            </section>

            {/* 6. WHY TICKETBARI */}
            <section className="bg-brand/5 dark:bg-brand/10 py-24 mt-24 md:mt-32 border-y border-brand/10">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-4xl font-black text-slate-800 dark:text-white uppercase tracking-tighter">Why Choose TicketBari?</h2>
                        <p className="text-slate-500 mt-2">Redefining how you travel across the country</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        <div className="text-center p-8 bg-white dark:bg-slate-900 rounded-xl shadow-xl hover:-translate-y-2 transition-all">
                            <div className="w-16 h-16 bg-brand/10 rounded-xl flex items-center justify-center text-brand mx-auto mb-6"><ShieldCheck size={32}/></div>
                            <h4 className="text-xl font-bold mb-2 dark:text-white">Verified Vendors</h4>
                            <p className="text-sm text-slate-500">Every provider is manually vetted for maximum safety.</p>
                        </div>
                        <div className="text-center p-8 bg-white dark:bg-slate-900 rounded-xl shadow-xl md:translate-y-6 hover:-translate-y-2 transition-all">
                            <div className="w-16 h-16 bg-orange-500/10 rounded-xl flex items-center justify-center text-orange-500 mx-auto mb-6"><Zap size={32}/></div>
                            <h4 className="text-xl font-bold mb-2 dark:text-white">Real-time Updates</h4>
                            <p className="text-sm text-slate-500">Live seat availability and departure tracking.</p>
                        </div>
                        <div className="text-center p-8 bg-white dark:bg-slate-900 rounded-xl shadow-xl hover:-translate-y-2 transition-all">
                            <div className="w-16 h-16 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-500 mx-auto mb-6"><Headset size={32}/></div>
                            <h4 className="text-xl font-bold mb-2 dark:text-white">24/7 Support</h4>
                            <p className="text-sm text-slate-500">Dedicated assistance for all your booking queries.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 7. TESTIMONIALS */}
            <section className="max-w-7xl mx-auto px-4 mt-24 md:mt-32">
                <div className="text-center mb-16">
                    <span className="text-slate-400 font-black uppercase tracking-[0.3em] text-xs">Social Proof</span>
                    <h2 className="text-3xl md:text-4xl font-black text-slate-800 dark:text-white mt-2 uppercase">Traveler Experiences</h2>
                    <p className="text-slate-500">Real stories from our frequent travelers</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { name: "Arif Ahmed", comment: "The booking process was so smooth. Got my ticket in seconds!", route: "Dhaka - Cox's Bazar" },
                        { name: "Sadiya Khan", comment: "Manual verification makes it feel safer for solo female travelers.", route: "Sylhet - Dhaka" },
                        { name: "Tanvir Hasan", comment: "Best rates and real-time updates. No more waiting at counters!", route: "Rajshahi - Bogura" }
                    ].map((t, i) => (
                        <div key={i} className="p-8 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm relative hover:shadow-md transition-shadow">
                            <div className="flex text-orange-400 mb-4 gap-1">
                                {[...Array(5)].map((_, idx) => <Star key={idx} size={14} fill="currentColor" />)}
                            </div>
                            <p className="text-slate-600 dark:text-slate-400 italic mb-6">"{t.comment}"</p>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-brand/20 flex items-center justify-center font-bold text-brand uppercase">{t.name[0]}</div>
                                <div>
                                    <p className="font-bold text-slate-800 dark:text-white leading-tight">{t.name}</p>
                                    <p className="text-xs text-slate-400">{t.route}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* 8. TRENDING ROUTES */}
            <section className="max-w-7xl mx-auto px-4 mt-24 md:mt-32">
                <div className="bg-slate-900 rounded-xl p-8 md:p-16 relative overflow-hidden text-white border border-white/5">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-brand/20 blur-[100px] rounded-xl" />
                    <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10">
                        <div className="max-w-md text-center lg:text-left">
                            <h2 className="text-4xl font-black mb-4 italic tracking-tighter">Trending Routes</h2>
                            <p className="text-slate-400 font-medium">Most searched journeys by our community this week.</p>
                        </div>
                        <div className="flex flex-wrap justify-center gap-4">
                            {['Dhaka to Cox\'s Bazar', 'Sylhet to Chittagong', 'Dhaka to Bogura'].map((route, idx) => (
                                <div key={idx} className="bg-white/5 border border-white/10 backdrop-blur-md p-5 rounded-xl flex items-center gap-4 hover:bg-white/10 transition-colors">
                                    <div className="w-10 h-10 rounded-xl bg-brand flex items-center justify-center font-black">{idx + 1}</div>
                                    <p className="font-bold text-md">{route}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* 9. NEWSLETTER */}
            <section className="max-w-5xl mx-auto px-4 mt-24 md:mt-32 mb-10">
                <div className="bg-brand rounded-xl p-10 md:p-16 text-center text-white relative shadow-2xl shadow-brand/20">
                    <Mail size={48} className="mx-auto mb-6 opacity-50" />
                    <h2 className="text-3xl md:text-4xl font-black mb-4">Don't Miss the Next Departure!</h2>
                    <p className="text-white/80 mb-8 max-w-lg mx-auto">Subscribe to get exclusive discounts, route updates, and travel tips directly in your inbox.</p>
                    <form className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
                        <input 
                            type="email" 
                            placeholder="Your email address" 
                            className="flex-1 px-6 py-4 rounded-xl bg-white text-slate-900 focus:outline-none focus:ring-4 focus:ring-white/20 font-bold"
                        />
                        <button className="bg-slate-900 text-white px-8 py-4 rounded-xl font-black hover:bg-slate-800 transition-all uppercase text-sm tracking-widest active:scale-95">
                            Join Now
                        </button>
                    </form>
                </div>
            </section>

        </div>
    );
};

export default Home;