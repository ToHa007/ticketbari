import { Navigate, useLocation } from "react-router-dom";

import { useState, useEffect } from "react";
import axios from "axios";
import useAuth from "../hooks/useAuth";

const AdminRoute = ({ children }) => {
    const { user, loading } = useAuth();
    const [role, setRole] = useState(null);
    const [roleLoading, setRoleLoading] = useState(true);
    const location = useLocation();

    useEffect(() => {
        if (user?.email) {
            axios.get(`https://ticketbari-server123.vercel.app/users/role/${user.email}`)
                .then(res => {
                    setRole(res.data.role);
                    setRoleLoading(false);
                });
        } else if (!loading) {
            setRoleLoading(false);
        }
    }, [user, loading]);

    if (loading || roleLoading) {
        return (
            <div className="min-h-screen flex justify-center items-center">
                <progress className="progress w-56"></progress>
            </div>
        );
    }

    if (user && role === 'admin') {
        return children;
    }

    return <Navigate to="/" state={{ from: location }} replace></Navigate>;
};

export default AdminRoute;