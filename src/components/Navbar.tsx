import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import Login from "../features/auth/pages/Login";

const navLinks = [
  { name: "Home", href: "#" },
  { name: "Features", href: "#" },
  { name: "Solutions", href: "#" },
  { name: "Pricing", href: "#" },
  { name: "About Us", href: "#" },
];

export default function ResponsiveNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  // ✅ Prevent background scroll when modal open
  useEffect(() => {
    if (showLogin) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [showLogin]);

  return (
    <>
      <nav className="w-full bg-slate-950/95 backdrop-blur-md text-white shadow-lg fixed top-0 left-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-500 to-orange-500 bg-clip-text text-transparent cursor-pointer">
              Flowracle
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="hover:text-blue-400 transition-colors duration-200 text-sm lg:text-base"
                >
                  {link.name}
                </a>
              ))}
            </div>

            {/* Desktop Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <button
                onClick={() => setShowLogin(true)}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 transition text-sm lg:text-base"
              >
                Login
              </button>
              <button className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 transition text-sm lg:text-base">
                Sign Up
              </button>
            </div>

            {/* Mobile Toggle */}
            <div className="md:hidden">
              <button onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? <X size={26} /> : <Menu size={26} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden bg-slate-900 px-4 pb-6 pt-4 space-y-4 animate-slideDown">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="block py-2 border-b border-slate-800 hover:text-blue-400 text-sm"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </a>
            ))}

            <div className="flex flex-col space-y-3 pt-4">
              <button
                onClick={() => {
                  setShowLogin(true);
                  setIsOpen(false);
                }}
                className="w-full px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 transition text-sm"
              >
                Login
              </button>
              <button className="w-full px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 transition text-sm">
                Sign Up
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Login Modal */}
      {showLogin && (
        <div className="fixed inset-0  flex items-center justify-center z-[60] px-4">
          <div className="bg-white w-full max-w-md sm:max-w-lg p-6 sm:p-8 rounded-2xl shadow-2xl relative animate-fadeIn">
            <button
              onClick={() => setShowLogin(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
            <Login onSuccess={() => setShowLogin(false)} />
          </div>
        </div>
      )}
    </>
  );
}
