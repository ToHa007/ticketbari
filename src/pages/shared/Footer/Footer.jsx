import { Link } from "react-router-dom"; // Added this import
import { FaFacebook, FaEnvelope, FaPhoneAlt } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6"; 

const Footer = () => {
  return (
    <footer className="bg-base-200 text-base-content pt-16 pb-8 border-t border-brand/10">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        
        {/* Col 1: Logo & Desc */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="bg-brand dark:bg-brand-light p-1 rounded-md">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white dark:text-dark-bg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
            </div>
            <span className="text-2xl font-black tracking-tighter uppercase">
              Ticket<span className="text-brand dark:text-brand-light">Bari</span>
            </span>
          </div>
          <p className="text-sm opacity-70 leading-relaxed">
            Your premium gateway for booking bus, train, launch, and flight tickets with ease and security.
          </p>
        </div>

        {/* Col 2: Quick Links */}
        <div>
          <h4 className="footer-title opacity-100 text-brand dark:text-brand-light mb-4 block">Quick Links</h4>
          <div className="flex flex-col space-y-2">
            <Link to="/" className="hover:text-brand transition-colors">Home</Link>
            <Link to="/all-tickets" className="hover:text-brand transition-colors">All Tickets</Link>
            <Link to="/contact" className="hover:text-brand transition-colors">Contact Us</Link>
            <Link to="/about" className="hover:text-brand transition-colors">About</Link>
          </div>
        </div>

        {/* Col 3: Contact Info */}
        <div>
          <h4 className="footer-title opacity-100 text-brand dark:text-brand-light mb-4 block">Contact Info</h4>
          <div className="space-y-3">
            <div className="flex items-center gap-3"><FaEnvelope className="text-brand" /> support@ticketbari.com</div>
            <div className="flex items-center gap-3"><FaPhoneAlt className="text-brand" /> +880 1234 567 890</div>
            <div className="flex items-center gap-3 cursor-pointer hover:text-brand"><FaFacebook className="text-brand"/> Facebook Page</div>
          </div>
        </div>

        {/* Col 4: Payment Methods */}
        <div>
          <h4 className="footer-title opacity-100 text-brand dark:text-brand-light mb-4 block">Secure Payments</h4>
          <div className="flex flex-wrap gap-4 items-center">
             <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" alt="Stripe" className="h-6 grayscale hover:grayscale-0 transition-all cursor-help" />
             <div className="flex gap-4 mt-2">
                <FaXTwitter className="text-xl hover:text-brand-light cursor-pointer transition-colors" />
                <FaFacebook className="text-xl hover:text-brand-light cursor-pointer transition-colors" />
             </div>
          </div>
        </div>
      </div>

      <div className="border-t border-base-300 dark:border-slate-800 mt-12 pt-8 text-center text-sm opacity-60">
        <p>© 2026 TicketBari. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;