import React from "react";
import { Link } from "react-router-dom";
import { FaFacebook, FaEnvelope, FaPhoneAlt, FaLinkedin, FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6"; 

const Footer = () => {
  return (
    <footer className="relative bg-slate-50 text-base-content pt-20 pb-10 border-t border-slate-200 dark:border-slate-800 dark:bg-[#06080a] overflow-hidden">
      {/* Decorative Background Element for Dark Mode */}
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] dark:opacity-[0.05] pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16">
        
        {/* Col 1: Brand Identity */}
        <div className="space-y-6">
          <Link to="/" className="flex items-center gap-2 group w-fit">
            <div className="bg-brand p-1.5 rounded-xl group-hover:rotate-12 transition-all duration-300 shadow-lg shadow-brand/20">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
            </div>
            <span className="text-3xl font-black tracking-tighter uppercase dark:text-white italic">
              Ticket<span className="text-brand">Bari</span>
            </span>
          </Link>
          <p className="text-sm font-medium leading-relaxed text-slate-500 dark:text-slate-400 max-w-xs">
            Bangladesh's most trusted digital gateway for seamless bus, train, launch, and flight bookings. Travel smarter, travel safer.
          </p>
        </div>

        {/* Col 2: Navigation */}
        <div>
          <h4 className="text-slate-800 dark:text-white mb-6 text-sm font-black uppercase tracking-[0.2em]">Platform</h4>
          <nav className="flex flex-col space-y-3 text-sm font-bold text-slate-500 dark:text-slate-400">
            <Link to="/" className="hover:text-brand transition-colors w-fit">Home</Link>
            <Link to="/all-tickets" className="hover:text-brand transition-colors w-fit">Browse Tickets</Link>
            <Link to="/about-us" className="hover:text-brand transition-colors w-fit">Our Story</Link>
            <Link to="/contact" className="hover:text-brand transition-colors w-fit">Help Center</Link>
          </nav>
        </div>

        {/* Col 3: Support */}
        <div>
          <h4 className="text-slate-800 dark:text-white mb-6 text-sm font-black uppercase tracking-[0.2em]">Get in Touch</h4>
          <div className="space-y-4 text-sm font-bold text-slate-500 dark:text-slate-400">
            <a href="mailto:support@ticketbari.com" className="flex items-center gap-3 hover:text-brand transition-colors group">
              <div className="p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm group-hover:scale-110 transition-transform">
                <FaEnvelope className="text-brand" />
              </div>
              support@ticketbari.com
            </a>
            <a href="tel:+8801234567890" className="flex items-center gap-3 hover:text-brand transition-colors group">
              <div className="p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm group-hover:scale-110 transition-transform">
                <FaPhoneAlt className="text-brand" />
              </div>
              +880 1234 567 890
            </a>
          </div>
        </div>

        {/* Col 4: Compliance & Socials */}
        <div className="space-y-8">
          <div>
            <h4 className="text-slate-800 dark:text-white mb-4 text-sm font-black uppercase tracking-[0.2em]">Follow Us</h4>
            <div className="flex gap-3">
              {[FaXTwitter, FaFacebook, FaInstagram, FaLinkedin].map((Icon, idx) => (
                <a key={idx} href="#" className="p-3 bg-white dark:bg-slate-800 rounded-xl shadow-sm hover:bg-brand hover:text-white transition-all duration-300 border border-slate-100 dark:border-slate-800">
                  <Icon className="text-lg" />
                </a>
              ))}
            </div>
          </div>
          <div>
            <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-3">Secure Payment Partner</p>
            <div className="px-4 py-2 bg-white dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-800 w-fit">
              <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" 
                  alt="Stripe" 
                  className="h-5 grayscale hover:grayscale-0 transition-all duration-500 opacity-60 hover:opacity-100" 
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-[11px] font-black uppercase tracking-widest text-slate-400">
        <p>© {new Date().getFullYear()} TicketBari · Engineered for Excellence</p>
        <div className="flex gap-6">
          <Link to="/terms" className="hover:text-brand transition-colors">Terms</Link>
          <Link to="/privacy" className="hover:text-brand transition-colors">Privacy</Link>
          <Link to="/cookies" className="hover:text-brand transition-colors">Cookies</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;