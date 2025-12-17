
// import {
//   // Facebook,
//   // Twitter,
//   // Linkedin,
//   // Instagram,
//   Phone,
//   Mail,
//   MapPin,
// } from "lucide-react";

// // import { SiLinkedin, SiFacebook, SiTwitter, SiInstagram } from "react-icons/si";
// import { SiLinkedin, SiFacebook, SiX, SiInstagram } from "react-icons/si";

// export default function Footer() {
//   return (
//     <footer className="bg-[#36454F] text-gray-300 px-6 py-12">
//       <div className="max-w-7xl mx-auto space-y-10">
//         {/* --- Top Section --- */}
//         <div className="grid grid-cols-1 md:grid-cols-6 gap-8">
//           {/* Left Column */}
//           <div className="md:col-span-2">
//             <img
//               src="/crestlinetech_logo.png"
//               alt="Crestline Logo"
//               className="h-8 mb-4"
//             />
//             <p className="text-gray-400 text-sm leading-relaxed mb-6">
//               Leading manufacturer of premium coaches and buses. Made in Germany
//               – for the highest standards.
//             </p>

//             {/* <div className="flex gap-3 mt-5">
//               {[Facebook, Twitter, Linkedin, Instagram].map((Icon, i) => (
//                 <a
//                   key={i}
//                   href="#"
//                   className="w-9 h-9 flex items-center justify-center rounded-md bg-gray-800 hover:bg-blue-600 transition"
//                 >
//                   <Icon className="w-4 h-4 text-white" />
//                 </a>
//               ))}
//             </div> */}
//             <div className="flex gap-3 mt-5">
//               {/* {[SiFacebook, SiTwitter, SiLinkedin, SiInstagram].map(
//                 (Icon, i) => ( */}
//               {[SiFacebook, SiX, SiLinkedin, SiInstagram].map((Icon, i) => (
//                 <a
//                   key={i}
//                   href="#"
//                   className="w-9 h-9 flex items-center justify-center rounded-md bg-gray-800 hover:bg-blue-600 transition"
//                 >
//                   <Icon className="w-4 h-4 text-white" />
//                 </a>
//               ))}
//             </div>
//           </div>

//           {/* Company */}
//           <div>
//             <h3 className="text-white text-sm font-semibold mb-4">Company</h3>
//             <ul className="space-y-2 text-sm text-gray-400">
//               <li>
//                 <a href="#" className="hover:text-white transition">
//                   About Us
//                 </a>
//               </li>
//               <li>
//                 <a href="#" className="hover:text-white transition">
//                   Careers
//                 </a>
//               </li>
//               <li>
//                 <a href="#" className="hover:text-white transition">
//                   Press
//                 </a>
//               </li>
//               <li>
//                 <a href="#" className="hover:text-white transition">
//                   Partners
//                 </a>
//               </li>
//             </ul>
//           </div>

//           {/* Products */}
//           <div>
//             <h3 className="text-white text-sm font-semibold mb-4">Products</h3>
//             <ul className="space-y-2 text-sm text-gray-400">
//               <li>
//                 <a href="#" className="hover:text-white transition">
//                   Premium Executive
//                 </a>
//               </li>
//               <li>
//                 <a href="#" className="hover:text-white transition">
//                   City Cruiser
//                 </a>
//               </li>
//               <li>
//                 <a href="#" className="hover:text-white transition">
//                   E-Coach Future
//                 </a>
//               </li>
//               <li>
//                 <a href="#" className="hover:text-white transition">
//                   Custom Solutions
//                 </a>
//               </li>
//             </ul>
//           </div>

//           {/* Service */}
//           <div>
//             <h3 className="text-white text-sm font-semibold mb-4">Service</h3>
//             <ul className="space-y-2 text-sm text-gray-400">
//               <li>
//                 <a href="#" className="hover:text-white transition">
//                   Configurator
//                 </a>
//               </li>
//               <li>
//                 <a href="#" className="hover:text-white transition">
//                   Maintenance
//                 </a>
//               </li>
//               <li>
//                 <a href="#" className="hover:text-white transition">
//                   Spare Parts
//                 </a>
//               </li>
//               <li>
//                 <a href="#" className="hover:text-white transition">
//                   Downloads
//                 </a>
//               </li>
//             </ul>
//           </div>

//           {/* Legal */}
//           <div>
//             <h3 className="text-white text-sm font-semibold mb-4">Legal</h3>
//             <ul className="space-y-2 text-sm text-gray-400">
//               <li>
//                 <a href="#" className="hover:text-white transition">
//                   Imprint
//                 </a>
//               </li>
//               <li>
//                 <a href="#" className="hover:text-white transition">
//                   Privacy
//                 </a>
//               </li>
//               <li>
//                 <a href="#" className="hover:text-white transition">
//                   Terms
//                 </a>
//               </li>
//               <li>
//                 <a href="#" className="hover:text-white transition">
//                   Cookies
//                 </a>
//               </li>
//             </ul>
//           </div>
//         </div>

//         {/* --- Contact Section --- */}
//         <div className="border-t border-gray-800 pt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
//           <div className="flex items-center gap-3">
//             <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600">
//               <Phone className="w-5 h-5 text-white" />
//             </div>
//             <div>
//               <p className="text-gray-400 text-xs">Phone</p>
//               <p className="text-white text-sm">+49 (0) 123 456 789</p>
//             </div>
//           </div>

//           <div className="flex items-center gap-3">
//             <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600">
//               <Mail className="w-5 h-5 text-white" />
//             </div>
//             <div>
//               <p className="text-gray-400 text-xs">Email</p>
//               <p className="text-white text-sm">
//                 crestlinesukalpatech@gmail.com
//               </p>
//             </div>
//           </div>

//           <div className="flex items-center gap-3">
//             <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600">
//               <MapPin className="w-5 h-5 text-white" />
//             </div>
//             <div>
//               <p className="text-gray-400 text-xs">Location</p>
//               <p className="text-white text-sm">Munich, Germany</p>
//             </div>
//           </div>
//         </div>

//         {/* --- Bottom Section --- */}
//         {/* <div className="flex flex-col md:flex-row justify-between items-center border-t border-gray-800 pt-6 text-gray-500 text-xs"> */}
//         <div
//           className="flex flex-col md:flex-row justify-between items-center pt-6 text-xs"
//           style={{
//             borderTop: "1px solid #36454F",
//             color: "#9CA3AF", // Tailwind’s gray-400 equivalent
//           }}
//         >
//           <p>© 2025 Crestlinetech. All rights reserved.</p>
//           <div className="flex gap-6 mt-2 md:mt-0">
//             <a href="#" className="hover:text-white transition">
//               Imprint
//             </a>
//             <a href="#" className="hover:text-white transition">
//               Privacy
//             </a>
//             <a href="#" className="hover:text-white transition">
//               Cookies
//             </a>
//           </div>
//         </div>
//       </div>
//     </footer>
//   );
// }



// import { Phone, Mail, MapPin } from "lucide-react";
// import { SiLinkedin, SiFacebook, SiX, SiInstagram } from "react-icons/si";

// export default function Footer() {
//   return (
//     <footer className="bg-[#36454F] text-gray-300 px-6 py-10">
//       <div className="max-w-7xl mx-auto space-y-10">
//         {/* --- Top Section --- */}
//         <div className="grid grid-cols-1 md:grid-cols-6 gap-8">
//           {/* --- Left Column --- */}
//           <div className="md:col-span-2">
//             <img
//               src="/crestlinetech_logo.png"
//               alt="Crestline Logo"
//               className="h-8 mb-4"
//             />
//             <p className="text-gray-400 text-sm leading-relaxed mb-4">
//               Premium coach manufacturer — German engineering for the world.
//             </p>

//             {/* Social Icons */}
//             <div className="flex gap-3 mt-4">
//               {[SiFacebook, SiX, SiLinkedin, SiInstagram].map((Icon, i) => (
//                 <a
//                   key={i}
//                   href="#"
//                   className="w-8 h-8 flex items-center justify-center rounded-md bg-gray-800 hover:bg-[#0092B8] transition"
//                 >
//                   <Icon className="w-4 h-4 text-white" />
//                 </a>
//               ))}
//             </div>
//           </div>

//           {/* --- Quick Links --- */}
//           <div className="hidden md:block">
//             <h3 className="text-white text-sm font-semibold mb-3">Company</h3>
//             <ul className="space-y-1 text-sm text-gray-400">
//               <li>
//                 <a href="#" className="hover:text-white">
//                   About Us
//                 </a>
//               </li>
//               <li>
//                 <a href="#" className="hover:text-white">
//                   Careers
//                 </a>
//               </li>
//               <li>
//                 <a href="#" className="hover:text-white">
//                   Press
//                 </a>
//               </li>
//               <li>
//                 <a href="#" className="hover:text-white">
//                   Partners
//                 </a>
//               </li>
//             </ul>
//           </div>

//           <div className="hidden md:block">
//             <h3 className="text-white text-sm font-semibold mb-3">Products</h3>
//             <ul className="space-y-1 text-sm text-gray-400">
//               <li>
//                 <a href="#" className="hover:text-white">
//                   Executive
//                 </a>
//               </li>
//               <li>
//                 <a href="#" className="hover:text-white">
//                   City Cruiser
//                 </a>
//               </li>
//               <li>
//                 <a href="#" className="hover:text-white">
//                   E-Coach
//                 </a>
//               </li>
//               <li>
//                 <a href="#" className="hover:text-white">
//                   Custom
//                 </a>
//               </li>
//             </ul>
//           </div>

//           {/* --- Service + Legal Hidden on Mobile --- */}
//           <div className="hidden md:block">
//             <h3 className="text-white text-sm font-semibold mb-3">Service</h3>
//             <ul className="space-y-1 text-sm text-gray-400">
//               <li>
//                 <a href="#" className="hover:text-white">
//                   Configurator
//                 </a>
//               </li>
//               <li>
//                 <a href="#" className="hover:text-white">
//                   Maintenance
//                 </a>
//               </li>
//               <li>
//                 <a href="#" className="hover:text-white">
//                   Spare Parts
//                 </a>
//               </li>
//             </ul>
//           </div>

//           <div className="hidden md:block">
//             <h3 className="text-white text-sm font-semibold mb-3">Legal</h3>
//             <ul className="space-y-1 text-sm text-gray-400">
//               <li>
//                 <a href="#" className="hover:text-white">
//                   Imprint
//                 </a>
//               </li>
//               <li>
//                 <a href="#" className="hover:text-white">
//                   Privacy
//                 </a>
//               </li>
//               <li>
//                 <a href="#" className="hover:text-white">
//                   Terms
//                 </a>
//               </li>
//             </ul>
//           </div>
//         </div>

//         {/* --- Contact Section --- */}
//         <div className="border-t border-gray-700 pt-6 grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
//           {[
//             {
//               icon: Phone,
//               title: "Phone",
//               value: "+49 (0) 123 456 789",
//             },
//             {
//               icon: Mail,
//               title: "Email",
//               value: "crestlinesukalpatech@gmail.com",
//             },
//             {
//               icon: MapPin,
//               title: "Location",
//               value: "Munich, Germany",
//             },
//           ].map(({ icon: Icon, title, value }) => (
//             <div key={title} className="flex items-center gap-3">
//               <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-[linear-gradient(135deg,#0092B8_0%,#9810FA_100%)]">
//                 <Icon className="w-5 h-5 text-white" />
//               </div>
//               <div>
//                 <p className="text-gray-400 text-xs">{title}</p>
//                 <p className="text-white text-sm">{value}</p>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* --- Bottom Section --- */}
//         <div className="flex flex-col md:flex-row justify-between items-center pt-6 text-xs text-gray-400 border-t border-gray-700">
//           <p>© 2025 Crestlinetech. All rights reserved.</p>
//           <div className="flex gap-6 mt-2 md:mt-0">
//             <a href="#" className="hover:text-white">
//               Privacy
//             </a>
//             <a href="#" className="hover:text-white">
//               Cookies
//             </a>
//           </div>
//         </div>
//       </div>
//     </footer>
//   );
// }



import { Phone, Mail, MapPin } from "lucide-react";
import { SiLinkedin, SiFacebook, SiX, SiInstagram } from "react-icons/si";

export default function Footer() {
  return (
    <footer className="bg-[#36454F] text-gray-300 px-4 py-6 md:py-8">
      <div className="max-w-7xl mx-auto space-y-8 md:space-y-10">
        {/* --- Top Section --- */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-6 md:gap-8">
          {/* --- Left Column --- */}
          <div className="md:col-span-2">
            <img
              src="/crestline/public/crestlinetech_logo.png"
              alt="Crestline Logo"
              className="h-7 mb-3"
            />
            <p className="text-gray-400 text-sm leading-relaxed mb-3">
              Committed to quality, innovation, and sustainable mobility.
            </p>

            {/* Social Icons */}
            <div className="flex gap-2 mt-3">
              {[SiFacebook, SiX, SiLinkedin, SiInstagram].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-8 h-8 flex items-center justify-center rounded-md bg-gray-800 hover:bg-[#0092B8] transition"
                >
                  <Icon className="w-4 h-4 text-white" />
                </a>
              ))}
            </div>
          </div>

          {/* --- Quick Links (Desktop Only) --- */}
          <div className="hidden md:block">
            <h3 className="text-white text-sm font-semibold mb-2">Company</h3>
            <ul className="space-y-1 text-sm text-gray-400">
              <li>
                <a href="#" className="hover:text-white">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Press
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Partners
                </a>
              </li>
            </ul>
          </div>

          <div className="hidden md:block">
            <h3 className="text-white text-sm font-semibold mb-2">Products</h3>
            <ul className="space-y-1 text-sm text-gray-400">
              <li>
                <a href="#" className="hover:text-white">
                  Premium Executive
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  City Cruiser
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  E-Coach Future
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Custom Solutions
                </a>
              </li>
            </ul>
          </div>

          <div className="hidden md:block">
            <h3 className="text-white text-sm font-semibold mb-2">Service</h3>
            <ul className="space-y-1 text-sm text-gray-400">
              <li>
                <a href="#" className="hover:text-white">
                  Configurator
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Maintenance
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  spare Parts
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Downloads
                </a>
              </li>
            </ul>
          </div>

          <div className="hidden md:block">
            <h3 className="text-white text-sm font-semibold mb-2">Legal</h3>
            <ul className="space-y-1 text-sm text-gray-400">
              <li>
                <a href="#" className="hover:text-white">
                  Imprint
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Privacy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Terms
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Cookies
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* --- Contact Section --- */}
        <div className="border-t border-gray-700 pt-5 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          {[
            {
              icon: Phone,
              title: "Phone",
              value: "+91 9591104481",
            },
            {
              icon: Mail,
              title: "Email",
              value: "sales@crestline-tech.com",
            },
            {
              icon: MapPin,
              title: "Location",
              value: "Vasanthanarasapura Industrial Park KIADB",
            },
          ].map(({ icon: Icon, title, value }) => (
            <div key={title} className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-[linear-gradient(135deg,#0092B8_0%,#9810FA_100%)]">
                <Icon className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-gray-400 text-xs">{title}</p>
                <p className="text-white text-sm">{value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* --- Bottom Section --- */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-5 text-[11px] text-gray-400 border-t border-gray-700">
          <p>© 2025 Crestlinetech. All rights reserved.</p>
          <div className="flex gap-4 mt-2 md:mt-0">
            <a href="#" className="hover:text-white">
              Privacy
            </a>
            <a href="#" className="hover:text-white">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
