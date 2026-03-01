import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import useAuth from "../../hooks/useAuth";
import { Receipt, Search, CreditCard, ArrowRight } from "lucide-react";

// Internal Shimmer Utility for the table rows
const TableSkeleton = () => (
    <div className="animate-pulse space-y-4 p-4">
        {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-4 h-12 bg-slate-100 dark:bg-slate-800 rounded-xl" />
        ))}
    </div>
);

const TransactionHistory = () => {
  const { user } = useAuth();
  const axiosPublic = useAxiosPublic();

  const { data: payments = [], isLoading } = useQuery({
    queryKey: ["payments", user?.email],
    queryFn: async () => {
      const res = await axiosPublic.get(`/payments/${user?.email}`);
      return res.data;
    },
    enabled: !!user?.email
  });

  return (
    <div className="p-6 lg:p-10 bg-slate-50 dark:bg-[#06080a] min-h-screen transition-colors duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h2 className="text-4xl font-black tracking-tighter text-slate-800 dark:text-white uppercase italic">
            Transaction <span className="text-brand">History</span>
          </h2>
          <p className="mt-1 text-sm font-bold text-slate-400 uppercase tracking-widest">
            A secure record of your mobility investments
          </p>
        </div>
        
        <div className="flex items-center gap-3 bg-white dark:bg-slate-900 px-6 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="p-2 bg-brand/10 rounded-lg">
                <CreditCard className="text-brand" size={20} />
            </div>
            <div>
                <p className="text-[10px] font-black text-slate-400 uppercase leading-none">Total Spent</p>
                <p className="text-lg font-black text-slate-800 dark:text-white tracking-tighter">
                    ৳{payments.reduce((acc, curr) => acc + (curr.totalPrice || 0), 0)}
                </p>
            </div>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-hidden rounded-[2.5rem] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl shadow-slate-200/50 dark:shadow-none">
        <div className="overflow-x-auto">
          <table className="table w-full border-collapse">
            {/* Table Head */}
            <thead>
              <tr className="text-[10px] uppercase font-black tracking-[0.2em] text-slate-400 border-b dark:border-slate-800">
                <th className="py-6 px-8 text-center">#</th>
                <th>Journey Details</th>
                <th>Investment</th>
                <th>Transaction Reference</th>
                <th>Date</th>
                <th className="text-center">Status</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody>
              {isLoading ? (
                <tr><td colSpan="6"><TableSkeleton /></td></tr>
              ) : payments.length > 0 ? (
                payments.map((payment, index) => (
                  <tr
                    key={payment._id}
                    className="group border-b last:border-b-0 dark:border-slate-800 hover:bg-slate-50/80 dark:hover:bg-brand/5 transition-all duration-300"
                  >
                    <td className="py-6 px-8 text-center">
                      <span className="text-xs font-black text-slate-400 group-hover:text-brand transition-colors">
                        {(index + 1).toString().padStart(2, '0')}
                      </span>
                    </td>

                    <td>
                      <div className="flex flex-col">
                        <span className="font-black text-slate-800 dark:text-white uppercase tracking-tighter italic flex items-center gap-2">
                          {payment.coachName}
                        </span>
                        <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400">
                          {payment.from} <ArrowRight size={10} className="text-brand" /> {payment.to}
                        </div>
                      </div>
                    </td>

                    <td>
                      <div className="flex flex-col">
                        <span className="font-black text-brand text-lg tracking-tighter">
                          ৳{payment.totalPrice}
                        </span>
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Paid via Stripe</span>
                      </div>
                    </td>

                    <td>
                      <div className="flex items-center gap-2 font-mono text-[10px] text-slate-500 bg-slate-100 dark:bg-slate-800 w-fit px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
                        {payment.transactionId?.substring(0, 18) || "STRIPE_TEST_OP"}...
                      </div>
                    </td>

                    <td>
                      <span className="text-xs font-black text-slate-600 dark:text-slate-400 uppercase">
                        {payment.paidAt
                          ? new Date(payment.paidAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
                          : "Processing"}
                      </span>
                    </td>

                    <td className="text-center">
                      <div className="flex flex-col items-center gap-2">
                         <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-emerald-500 bg-emerald-500/10 border border-emerald-500/20">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Success
                        </span>
                        <button className="text-[9px] font-black uppercase tracking-tighter text-slate-400 hover:text-brand flex items-center gap-1 transition-colors">
                            <Receipt size={10} /> Get Receipt
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-24">
                    <div className="flex flex-col items-center justify-center opacity-30">
                        <Search size={48} className="mb-4" />
                        <p className="text-xs font-black uppercase tracking-[0.3em]">No Transactions Found</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TransactionHistory;