import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import useAuth from "../../hooks/useAuth";


const TransactionHistory = () => {
  const { user } = useAuth();
  const axiosPublic = useAxiosPublic();

  const { data: payments = [] } = useQuery({
    queryKey: ["payments", user?.email],
    queryFn: async () => {
      const res = await axiosPublic.get(`/payments/${user?.email}`);
      return res.data;
    },
  });

  return (
    <div className="p-6 lg:p-10 bg-base-100 rounded-2xl shadow-sm min-h-screen">
      {/* Header */}
      <div className="mb-10">
        <h2 className="text-3xl font-black tracking-tight text-slate-800 dark:text-white">
          Transaction History
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          All your successful ticket purchases
        </p>
      </div>

      {/* Table Card */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <table className="table w-full">
          {/* Head */}
          <thead>
            <tr className="text-xs uppercase tracking-widest text-slate-400 border-b dark:border-slate-800">
              <th className="py-5">#</th>
              <th>Route</th>
              <th>Amount</th>
              <th>Transaction</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>

          {/* Body */}
          <tbody>
            {payments.length > 0 ? (
              payments.map((payment, index) => (
                <tr
                  key={payment._id}
                  className="border-b last:border-b-0 dark:border-slate-800 hover:bg-slate-50/40 dark:hover:bg-slate-800/40 transition"
                >
                  <td className="font-semibold text-slate-500">
                    {index + 1}
                  </td>

                  <td>
                    <div className="font-semibold text-slate-800 dark:text-white">
                      {payment.coachName}
                    </div>
                    <div className="text-xs text-slate-400">
                      {payment.from} → {payment.to}
                    </div>
                  </td>

                  <td className="font-bold text-brand">
                    ${payment.totalPrice}
                  </td>

                  <td className="font-mono text-xs text-slate-400">
                    {payment.transactionId || "STRIPE_TEST_OP"}
                  </td>

                  <td className="text-sm text-slate-500">
                    {payment.paidAt
                      ? new Date(payment.paidAt).toLocaleDateString()
                      : "N/A"}
                  </td>

                  <td>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold text-emerald-600 bg-emerald-500/10">
                      ● Success
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  className="text-center py-16 text-slate-400"
                >
                  No transactions found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionHistory;
