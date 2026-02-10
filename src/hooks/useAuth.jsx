import React from "react";
import { useContext } from "react";
import { AuthContext } from "../Components/Context/AuthContext/AuthProvider";

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
};

export default useAuth;