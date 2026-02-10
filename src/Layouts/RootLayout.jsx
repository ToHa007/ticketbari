import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Footer from "../pages/shared/Footer/Footer";
import Navbar from "../pages/shared/Navbar/Navbar";

const RootLayout = () => {
  const [theme, setTheme] = useState(
    localStorage.getItem("ticket-theme") || "light"
  );

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("ticket-theme", newTheme);
  };

  useEffect(() => {
    // DaisyUI attribute
    document.documentElement.setAttribute("data-theme", theme);
    
    // Tailwind dark mode class
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  return (
    <div className="min-h-screen transition-colors duration-300 bg-base-100 text-base-content">
      <Navbar theme={theme} toggleTheme={toggleTheme} />
      
      <div className="max-w-7xl mx-auto min-h-[calc(100vh-250px)] px-4">
        <Outlet />
      </div>

      <Footer />
    </div>
  );
};

export default RootLayout;