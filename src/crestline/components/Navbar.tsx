import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { useLocation } from "react-router-dom";

interface NavbarProps {
  onLoginClick?: () => void;
  onRegisterClick?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onLoginClick, onRegisterClick }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [hiddenByEmbed, setHiddenByEmbed] = useState<boolean>(() =>
    typeof document !== "undefined"
      ? document.body.classList.contains("hide-shell-on-mobile")
      : false,
  );
  const location = useLocation();

  useEffect(() => {
    // Keep hiddenByEmbed in sync if body class changes or viewport resizes.
    const check = () =>
      setHiddenByEmbed(
        typeof document !== "undefined" &&
          document.body.classList.contains("hide-shell-on-mobile"),
      );

    check();

    window.addEventListener("resize", check);

    // Observe body class changes (so HRMSPage toggling class updates Navbar immediately)
    const mo =
      typeof MutationObserver !== "undefined"
        ? new MutationObserver(() => check())
        : null;
    if (mo && typeof document !== "undefined") {
      mo.observe(document.body, {
        attributes: true,
        attributeFilter: ["class"],
      });
    }

    return () => {
      window.removeEventListener("resize", check);
      if (mo) mo.disconnect();
    };
  }, [location.pathname]);

  // If embed requests hiding shell on mobile, do not render Navbar
  if (hiddenByEmbed) return null;

  return (
    <nav
      id="site-navbar"
      className="fixed top-0 left-0 w-full z-50 bg-white shadow-sm"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 md:px-8 py-3">
        <div className="flex items-center justify-between w-full md:w-auto">
          <div className="flex items-center space-x-2">
            <img
              src="/crestline/public/crestlinetech_black.png"
              alt="Crestline Logo"
              className="h-10 w-auto object-contain"
            />
          </div>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-black md:hidden p-2 hover:text-cyan-300 transition-colors"
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        <div className="hidden md:flex items-center space-x-8 text-black font-medium">
          <a href="/" className="hover:text-gray-600 transition-colors">
            Home
          </a>
          <a
            href="/crestline/aboutus"
            className="hover:text-gray-600 transition-colors"
          >
            About Us
          </a>
          <a
            href="/crestline/vehicles"
            className="hover:text-gray-600 transition-colors"
          >
            Vehicles
          </a>
          <a
            href="/crestline/technology"
            className="hover:text-gray-600 transition-colors"
          >
            Technology
          </a>
          <a
            href="/crestline/media"
            className="hover:text-gray-600 transition-colors"
          >
            Media
          </a>
          <a
            href="/crestline/contact"
            className="hover:text-gray-600 transition-colors"
          >
            Contact
          </a>
        </div>

        <div className="hidden md:flex items-center">
          <button
            onClick={onLoginClick}
            className="px-4 py-2 text-white rounded-md transition-all shadow-md hover:opacity-90"
            style={{
              background: "linear-gradient(135deg, #0092B8 0%, #9810FA 100%)",
            }}
          >
            User Login
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-[#3D268C] border-t border-[#2A1B66] px-6 py-4 space-y-3 text-white animate-fadeIn">
          <a
            href="/"
            className="block hover:text-cyan-300 transition-colors"
            onClick={() => setMenuOpen(false)}
          >
            Home
          </a>
          <a
            href="/crestline/aboutus"
            className="block hover:text-cyan-300 transition-colors"
            onClick={() => setMenuOpen(false)}
          >
            About Us
          </a>
          <a
            href="/crestline/vehicles"
            className="block hover:text-cyan-300 transition-colors"
            onClick={() => setMenuOpen(false)}
          >
            Vehicles
          </a>
          <a
            href="/crestline/technology"
            className="block hover:text-cyan-300 transition-colors"
            onClick={() => setMenuOpen(false)}
          >
            Technology
          </a>
          <a
            href="/crestline/contact"
            className="block hover:text-cyan-300 transition-colors"
            onClick={() => setMenuOpen(false)}
          >
            Contact
          </a>

          <button
            onClick={() => {
              setMenuOpen(false);
              if (onLoginClick) onLoginClick();
            }}
            className="w-full text-center px-4 py-2 text-white rounded-md font-medium shadow-md hover:from-cyan-600 hover:to-purple-600 transition-all"
            style={{
              background: "linear-gradient(135deg, #0092B8 0%, #9810FA 100%)",
            }}
          >
            User Login
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
