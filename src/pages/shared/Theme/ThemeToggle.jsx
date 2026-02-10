import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

const ThemeToggle = () => {
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") ? localStorage.getItem("theme") : "light"
  );

  useEffect(() => {
    // This updates the attribute your CSS is looking for
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-xl bg-slate-200 dark:bg-dark-surface text-brand transition-all active:scale-95 flex items-center justify-center border border-transparent"
    >
      {theme === "light" ? (
        <Moon size={20} className="text-slate-700" />
      ) : (
        <Sun size={20} className="text-yellow-400" />
      )}
    </button>
  );
};

export default ThemeToggle;