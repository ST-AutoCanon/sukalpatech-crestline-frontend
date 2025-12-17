

// import React, { useState } from "react";
// import { Menu, X } from "lucide-react";

// const Navbar: React.FC = () => {
//   const [menuOpen, setMenuOpen] = useState(false);

//   return (
//     <nav className="fixed top-0 left-0 w-full z-50 bg-white shadow-sm border-b border-gray-200">
//       <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 md:px-8 py-3">
//         {/* ===== Left Section (Logo) ===== */}
//         <div className="flex items-center justify-between w-full md:w-auto">
//           <div className="flex items-center space-x-2">
//             <span className="text-xl font-semibold text-black tracking-tight">
//               CRESTLINE
//             </span>
//           </div>

//           {/* ===== Mobile Menu Button ===== */}
//           <button
//             onClick={() => setMenuOpen(!menuOpen)}
//             className="text-gray-800 md:hidden p-2 hover:text-blue-600 transition-colors"
//             aria-label="Toggle menu"
//           >
//             {menuOpen ? (
//               <X className="w-6 h-6" />
//             ) : (
//               <Menu className="w-6 h-6" />
//             )}
//           </button>
//         </div>

//         {/* ===== Desktop Navigation Links ===== */}
//         <div className="hidden md:flex items-center space-x-8 text-gray-700 font-medium">
//           <a href="/" className="hover:text-blue-600 transition-colors">
//             Home
//           </a>
//           <a href="/about" className="hover:text-blue-600 transition-colors">
//             About Us
//           </a>
//           <a href="/vehicles" className="hover:text-blue-600 transition-colors">
//             Vehicles
//           </a>
//           <a
//             href="/technology"
//             className="hover:text-blue-600 transition-colors"
//           >
//             Technology
//           </a>
//           <a href="/gallery" className="hover:text-blue-600 transition-colors">
//             Gallery
//           </a>
//           <a href="/contact" className="hover:text-blue-600 transition-colors">
//             Contact
//           </a>
//         </div>

//         {/* ===== Right Section ===== */}
//         <div className="hidden md:flex items-center">
//           <button className="px-4 py-2 text-white rounded-md font-medium bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 transition-all shadow-md">
//             Request Quote
//           </button>
//         </div>
//       </div>

//       {/* ===== Mobile Dropdown Menu ===== */}
//       {menuOpen && (
//         <div className="md:hidden bg-white border-t border-gray-200 px-6 py-4 space-y-3 text-gray-700 animate-fadeIn">
//           <a
//             href="/"
//             className="block hover:text-blue-600 transition-colors"
//             onClick={() => setMenuOpen(false)}
//           >
//             Home
//           </a>
//           <a
//             href="/about"
//             className="block hover:text-blue-600 transition-colors"
//             onClick={() => setMenuOpen(false)}
//           >
//             About Us
//           </a>
//           <a
//             href="/vehicles"
//             className="block hover:text-blue-600 transition-colors"
//             onClick={() => setMenuOpen(false)}
//           >
//             Vehicles
//           </a>
//           <a
//             href="/technology"
//             className="block hover:text-blue-600 transition-colors"
//             onClick={() => setMenuOpen(false)}
//           >
//             Technology
//           </a>
//           <a
//             href="/gallery"
//             className="block hover:text-blue-600 transition-colors"
//             onClick={() => setMenuOpen(false)}
//           >
//             Gallery
//           </a>
//           <a
//             href="/contact"
//             className="block hover:text-blue-600 transition-colors"
//             onClick={() => setMenuOpen(false)}
//           >
//             Contact
//           </a>
//           <button
//             onClick={() => setMenuOpen(false)}
//             className="w-full text-center px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-md font-medium shadow-md hover:from-cyan-600 hover:to-purple-600 transition-all"
//           >
//             Request Quote
//           </button>
//         </div>
//       )}
//     </nav>
//   );
// };

// export default Navbar;


// import React, { useState } from "react";
// import { Menu, X } from "lucide-react";

// const Navbar: React.FC = () => {
//   const [menuOpen, setMenuOpen] = useState(false);

//   return (
//     <nav className="fixed top-0 left-0 w-full z-50 bg-white shadow-sm ">
//       <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 md:px-8 py-3">
//         {/* ===== Left Section (Logo) ===== */}
//         <div className="flex items-center justify-between w-full md:w-auto">
//           <div className="flex items-center space-x-2">
//             <img
//               src="/crestlinetech_black.png" // or import logo from "../assets/logo.png";
//               alt="Crestline Logo"
//               className="h-10 w-auto object-contain"
//             />
//           </div>

//           {/* ===== Mobile Menu Button ===== */}
//           <button
//             onClick={() => setMenuOpen(!menuOpen)}
//             className="text-black md:hidden p-2 hover:text-cyan-300 transition-colors"
//             aria-label="Toggle menu"
//           >
//             {menuOpen ? (
//               <X className="w-6 h-6" />
//             ) : (
//               <Menu className="w-6 h-6" />
//             )}
//           </button>
//         </div>

//         {/* ===== Desktop Navigation Links ===== */}
//         <div className="hidden md:flex items-center space-x-8 text-black font-medium">
//           <a href="/" className="hover:text-gray-600 transition-colors">
//             Home
//           </a>
//           <a href="/about" className="hover:text-gray-600 transition-colors">
//             About Us
//           </a>
//           <a href="/vehicles" className="hover:text-gray-600 transition-colors">
//             Vehicles
//           </a>
//           <a
//             href="/technology"
//             className="hover:text-gray-600 transition-colors"
//           >
//             Technology
//           </a>
//           <a href="/gallery" className="hover:text-gray-600 transition-colors">
//             Gallery
//           </a>
//           <a href="/contact" className="hover:text-gray-600 transition-colors">
//             Contact
//           </a>
//         </div>

//         {/* ===== Right Section ===== */}
//         <div className="hidden md:flex items-center">
//           {/* <button className="px-4 py-2 text-white rounded-md gradient-bg transition-all shadow-md"> */}
//           <button
//             className="px-4 py-2 text-white rounded-md transition-all shadow-md hover:opacity-90"
//             style={{
//               background: "linear-gradient(135deg, #0092B8 0%, #9810FA 100%)",
//             }}
//           >
//             User Login
//           </button>
//         </div>
//       </div>

//       {/* ===== Mobile Dropdown Menu ===== */}
//       {menuOpen && (
//         <div className="md:hidden bg-[#3D268C] border-t border-[#2A1B66] px-6 py-4 space-y-3 text-white animate-fadeIn">
//           <a
//             href="/"
//             className="block hover:text-cyan-300 transition-colors"
//             onClick={() => setMenuOpen(false)}
//           >
//             Home
//           </a>
//           <a
//             href="/about"
//             className="block hover:text-cyan-300 transition-colors"
//             onClick={() => setMenuOpen(false)}
//           >
//             About Us
//           </a>
//           <a
//             href="/vehicles"
//             className="block hover:text-cyan-300 transition-colors"
//             onClick={() => setMenuOpen(false)}
//           >
//             Vehicles
//           </a>
//           <a
//             href="/technology"
//             className="block hover:text-cyan-300 transition-colors"
//             onClick={() => setMenuOpen(false)}
//           >
//             Technology
//           </a>
//           <a
//             href="/gallery"
//             className="block hover:text-cyan-300 transition-colors"
//             onClick={() => setMenuOpen(false)}
//           >
//             Gallery
//           </a>
//           <a
//             href="/contact"
//             className="block hover:text-cyan-300 transition-colors"
//             onClick={() => setMenuOpen(false)}
//           >
//             Contact
//           </a>
//           <button
//             onClick={() => setMenuOpen(false)}
//             className="w-full text-center px-4 py-2 text-white rounded-md font-medium shadow-md hover:from-cyan-600 hover:to-purple-600 transition-all"
//             style={{
//               background: "linear-gradient(135deg, #0092B8 0%, #9810FA 100%)",
//             }}
//           >
//             User Login
//           </button>
//         </div>
//       )}
//     </nav>
//   );
// };

// export default Navbar;


import React, { useState } from "react";
import { Menu, X } from "lucide-react";

// ✅ Add props for login/register
interface NavbarProps {
  onLoginClick?: () => void;
  onRegisterClick?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onLoginClick, onRegisterClick }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white shadow-sm ">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 md:px-8 py-3">
        {/* ===== Left Section (Logo) ===== */}
        <div className="flex items-center justify-between w-full md:w-auto">
          <div className="flex items-center space-x-2">
            <img
              src="/crestline/public/crestlinetech_black.png"
              alt="Crestline Logo"
              className="h-10 w-auto object-contain"
            />
          </div>

          {/* ===== Mobile Menu Button ===== */}
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

        {/* ===== Desktop Navigation Links ===== */}
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
          {/* <a href="/gallery" className="hover:text-gray-600 transition-colors">
            Gallery
          </a> */}
          <a
            href="/crestline/contact"
            className="hover:text-gray-600 transition-colors"
          >
            Contact
          </a>
        </div>

        {/* ===== Right Section ===== */}
        <div className="hidden md:flex items-center">
          {/* ✅ Updated: Trigger login modal */}
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

      {/* ===== Mobile Dropdown Menu ===== */}
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
          {/* <a
            href="/gallery"
            className="block hover:text-cyan-300 transition-colors"
            onClick={() => setMenuOpen(false)}
          >
            Gallery
          </a> */}
          <a
            href="/crestline/contact"
            className="block hover:text-cyan-300 transition-colors"
            onClick={() => setMenuOpen(false)}
          >
            Contact
          </a>

          {/* ✅ Updated mobile login button */}
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
