import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export default function PageTransition({ children }) {
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Scroll to top and initiate transition
    window.scrollTo({ top: 0, behavior: "smooth" });
    const startTimer = setTimeout(() => {
      setLoading(true);
    }, 0);

    const endTimer = setTimeout(() => {
      setLoading(false);
    }, 180);

    return () => {
      clearTimeout(startTimer);
      clearTimeout(endTimer);
    };
  }, [location.pathname]);

  return (
    <>
      {/* Top route transition progress bar */}
      <div
        className={`page-top-loader ${loading ? "active" : ""}`}
        aria-hidden="true"
      />

      {/* Animated page container */}
      <div
        key={location.pathname}
        className={`page-transition-content ${loading ? "fade-out" : "fade-in"}`}
      >
        {children}
      </div>
    </>
  );
}
