import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, Filter, MapPin, Calendar, Clock, CircleCheck, ShieldCheck } from "lucide-react";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import { TicketGridSkeleton } from "../shared/SkeletonLoader/SkeletonLoader";

const AllTickets = () => {
  const axiosPublic = useAxiosPublic();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchFrom, setSearchFrom] = useState("");
  const [searchTo, setSearchTo] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [sortBy, setSortBy] = useState("default");

  useEffect(() => {
    axiosPublic.get("/tickets")
      .then(res => {
        setTickets(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching tickets:", err);
        setLoading(false);
      });
  }, [axiosPublic]);

  const filteredTickets = tickets
    .filter(t => {
      const typeMatch = filterType === "All" || 
                        (t?.type?.toLowerCase() === filterType.toLowerCase());
      const fromMatch = (t?.from || "").toLowerCase().includes(searchFrom.toLowerCase());
      const toMatch = (t?.to || "").toLowerCase().includes(searchTo.toLowerCase());
      return typeMatch && fromMatch && toMatch;
    })
    .sort((a, b) => {
      if (sortBy === "low") return (a.price || 0) - (b.price || 0);
      if (sortBy === "high") return (b.price || 0) - (a.price || 0);
      return 0;
    });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#06080a] py-10 px-4 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        
        {/* Header & Search Section */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-black text-slate-800 dark:text-white mb-4 uppercase tracking-tighter">
            Available <span className="text-brand">Journeys</span>
          </h1>
          
          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col lg:flex-row gap-4">
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <MapPin className="absolute left-4 top-3.5 text-brand" size={20} />
                <input 
                  type="text" 
                  placeholder="From (e.g. Dhaka)" 
                  className="input input-bordered w-full pl-12 bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 ring-brand/50 text-slate-700 dark:text-white"
                  onChange={(e) => setSearchFrom(e.target.value)}
                />
              </div>
              <div className="relative">
                <MapPin className="absolute left-4 top-3.5 text-brand" size={20} />
                <input 
                  type="text" 
                  placeholder="To (e.g. Cox's Bazar)" 
                  className="input input-bordered w-full pl-12 bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 ring-brand/50 text-slate-700 dark:text-white"
                  onChange={(e) => setSearchTo(e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <select 
                className="select select-bordered bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 ring-brand/50"
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="All">All Types</option>
                <option value="Bus">Bus</option>
                <option value="Train">Train</option>
                <option value="Launch">Launch</option>
              </select>

              <select 
                className="select select-bordered bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 ring-brand/50"
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="default">Sort By Price</option>
                <option value="low">Price: Low to High</option>
                <option value="high">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Ticket Grid */}
        {loading ? (
          <TicketGridSkeleton cards={8} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredTickets.length > 0 ? (
              filteredTickets.map((ticket) => (
                <div key={ticket._id} className="group bg-white dark:bg-slate-900 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2">
                  
                  <div className="relative h-52 overflow-hidden bg-slate-200 dark:bg-slate-800">
                    <img 
                      src={ticket.image ? ticket.image : (ticket.type === 'train' ? 'https://images.unsplash.com/photo-1532105956626-9569c03602f6?q=80&w=400' : 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=400')} 
                      alt={ticket.coachName} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                    />
                    
                    <div className="absolute top-4 left-4 flex gap-2">
                      <div className="bg-black/60 backdrop-blur-md text-white px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest border border-white/20">
                        {ticket.type}
                      </div>
                      {ticket.status === 'verified' && (
                        <div className="bg-green-500 text-white p-1 rounded-full shadow-lg" title="Verified Operator">
                          <ShieldCheck size={16} />
                        </div>
                      )}
                    </div>

                    <div className="absolute bottom-4 right-4 bg-brand text-white px-4 py-1 rounded-xl font-black text-lg shadow-xl shadow-brand/30">
                      ৳{ticket.price}
                    </div>
                  </div>

                  <div className="p-7">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-black text-slate-800 dark:text-white truncate max-w-[180px]">{ticket.coachName}</h3>
                        <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter">{ticket.classType || 'Standard Class'}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-bold text-slate-400 block uppercase">Vendor</span>
                        <span className="text-xs font-black text-brand truncate">{ticket.vendorName || 'Anonymous'}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <span className="text-[10px] font-bold text-slate-400 block uppercase">Available</span>
                        <span className="font-black text-slate-700 dark:text-slate-200">{ticket.availableSeats} Seats</span>
                      </div>
                      <Link 
                        to={`/ticket-details/${ticket._id}`}
                        className={`btn btn-md px-6 rounded-xl border-none font-black uppercase text-xs tracking-widest text-white shadow-lg transition-all ${ticket.availableSeats === 0 ? 'btn-disabled bg-slate-300' : 'bg-brand hover:bg-brand/90 hover:scale-105 shadow-brand/20'}`}
                      >
                        See Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-20">
                <div className="text-6xl mb-4">🗺️</div>
                <h3 className="text-2xl font-black text-slate-400 uppercase">No routes found</h3>
                <p className="text-slate-500">Try changing your filters or locations</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllTickets;