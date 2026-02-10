import React from "react";
import { Navigate } from "react-router";
import useAuth from "../hooks/useAuth";
const PrivateRoute = ({ children }) =>{
    const { user , loading } = useAuth();
if (loading) {
return <div>
    <span   className="loading loading-infinity loading-xl"></span>
</div>

}
if(!user){
    return <Navigate  to="/login"></Navigate>
}



    return children ;
}
export default PrivateRoute ;