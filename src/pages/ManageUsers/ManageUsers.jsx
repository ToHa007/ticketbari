import { useQuery } from "@tanstack/react-query";

import { ShieldCheck, Store, UserX, Trash2, CheckCircle, Clock } from "lucide-react";
import Swal from "sweetalert2";
import useAxiosPublic from "../../hooks/useAxiosPublic";

const ManageUsers = () => {
    
    const axiosSecure = useAxiosPublic();

    
    const { data: users = [], refetch, isLoading } = useQuery({
        queryKey: ['all-users'],
        queryFn: async () => {
           
            const res = await axiosSecure.get('/all-users');
            return res.data;
        }
    });

   
    const handleRoleUpdate = async (id, role, name) => {
        try {
           
            const res = await axiosSecure.patch(`/users/admin/${id}`, { role });
            if (res.data.modifiedCount > 0) {
                refetch();
                Swal.fire({
                    title: "Success!",
                    text: `${name} is now updated to ${role}.`,
                    icon: "success",
                    timer: 2000,
                    showConfirmButton: false
                });
            }
        } catch (err) {
            Swal.fire("Error", "Failed to update user role. Are you an Admin?", "error");
        }
    };

    const handleMarkFraud = async (email) => {
        Swal.fire({
            title: "Mark as Fraud?",
            text: "This will restrict the vendor and hide their tickets.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            confirmButtonText: "Yes, Mark Fraud"
        }).then(async (result) => {
            if (result.isConfirmed) {
               
                const res = await axiosSecure.patch(`/users/fraud/${email}`);
                if (res.data.userUpdate.modifiedCount > 0) {
                    refetch();
                    Swal.fire("Confirmed", "User marked as fraud.", "success");
                }
            }
        });
    };

    if (isLoading) return (
        <div className="flex justify-center p-20">
            <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
    );

    return (
        <div className="bg-white dark:bg-slate-900 p-4 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="mb-8">
                <h2 className="text-3xl font-black text-slate-800 dark:text-white uppercase tracking-tighter">
                    User <span className="text-brand">Management</span>
                </h2>
                <p className="text-slate-500 font-medium">Control permissions and verify vendor requests</p>
            </div>

            <div className="overflow-x-auto">
                <table className="table w-full border-separate border-spacing-y-2">
                    <thead className="bg-slate-50 dark:bg-slate-800/50">
                        <tr className="text-slate-600 dark:text-slate-400 border-none">
                            <th className="rounded-l-xl">User Profile</th>
                            <th>Role</th>
                            <th>Request Status</th>
                            <th>Manage Roles</th>
                            <th className="rounded-r-xl">Account</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user._id} className="bg-white dark:bg-slate-800/30 shadow-sm transition-all hover:bg-slate-50 dark:hover:bg-slate-800/60">
                                <td>
                                    <div className="flex items-center gap-3">
                                        <div className="avatar">
                                            <div className="mask mask-squircle w-12 h-12">
                                                <img src={user.profilePic || user.photoURL || "https://i.ibb.co/mR70932/user.png"} alt="User" />
                                            </div>
                                        </div>
                                        <div>
                                            <div className="font-bold text-slate-800 dark:text-white">{user.name || "Unnamed User"}</div>
                                            <div className="text-xs opacity-50">{user.email}</div>
                                        </div>
                                    </div>
                                </td>

                                <td>
                                    <div className={`badge badge-md font-bold uppercase py-3 px-4 ${
                                        user.role === 'admin' ? 'badge-primary' : 
                                        user.role === 'vendor' ? 'badge-secondary' : 'badge-ghost'
                                    }`}>
                                        {user.role || 'user'}
                                    </div>
                                </td>

                                <td>
                                    {user.vendorRequest === 'pending' && user.role !== 'vendor' ? (
                                        <div className="flex flex-col gap-1">
                                            <span className="badge badge-warning badge-sm font-black animate-pulse">
                                                <Clock size={12} className="mr-1"/> PENDING VENDOR
                                            </span>
                                        </div>
                                    ) : user.role === 'vendor' ? (
                                        <span className="text-green-500 font-bold text-xs flex items-center gap-1">
                                            <CheckCircle size={14}/> VERIFIED VENDOR
                                        </span>
                                    ) : (
                                        <span className="text-slate-400 text-xs italic">No active requests</span>
                                    )}
                                </td>

                                <td>
                                    <div className="flex gap-2">
                                        {user.role !== 'admin' ? (
                                            <button 
                                                onClick={() => handleRoleUpdate(user._id, 'admin', user.name)}
                                                className="btn btn-xs bg-blue-600 hover:bg-blue-700 text-white border-none"
                                            >
                                                <ShieldCheck size={14} /> Make Admin
                                            </button>
                                        ) : (
                                            <span className="text-[10px] font-bold text-blue-500">ALREADY ADMIN</span>
                                        )}

                                        {user.role !== 'vendor' ? (
                                            <button 
                                                onClick={() => handleRoleUpdate(user._id, 'vendor', user.name)}
                                                className={`btn btn-xs border-none text-white ${
                                                    user.vendorRequest === 'pending' 
                                                    ? 'bg-orange-500 hover:bg-orange-600 animate-bounce' 
                                                    : 'bg-slate-600 hover:bg-slate-700'
                                                }`}
                                            >
                                                <Store size={14} /> 
                                                {user.vendorRequest === 'pending' ? 'Approve Vendor' : 'Make Vendor'}
                                            </button>
                                        ) : (
                                            <button 
                                                onClick={() => handleMarkFraud(user.email)}
                                                className="btn btn-xs btn-error text-white border-none"
                                                disabled={user.isFraud}
                                            >
                                                <UserX size={14} /> Mark Fraud
                                            </button>
                                        )}
                                    </div>
                                </td>

                                <td>
                                    {user.isFraud ? (
                                        <div className="text-red-500 flex items-center gap-1 font-black text-xs">
                                            <Trash2 size={14}/> BANNED/FRAUD
                                        </div>
                                    ) : (
                                        <div className="text-green-500 flex items-center gap-1 font-black text-xs">
                                            <CheckCircle size={14}/> ACTIVE
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageUsers;