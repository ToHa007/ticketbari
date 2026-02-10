import React, { useState, useEffect } from "react";
import Navbar from "../pages/shared/Navbar/Navbar";
import { Outlet } from "react-router";

const AuthLayout = () => {
  const [theme, setTheme] = useState(
    localStorage.getItem("ticket-theme") || "light"
  );

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("ticket-theme", newTheme);
  };

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  return (
    <div className="min-h-screen bg-base-100 transition-colors duration-300">
      <Navbar theme={theme} toggleTheme={toggleTheme} />
      <div className="py-10">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;