import { Phone, Mail, MapPin } from "lucide-react";
import {
  SiLinkedin,
  SiFacebook,
  SiX,
  SiInstagram,
  SiWhatsapp,
} from "react-icons/si";

export default function Footer() {

  const handleEmailClick = () => {
    const isMobile = /Android|iPhone|iPad/i.test(navigator.userAgent);
    const email = "sales@crestline-tech.com";

    if (isMobile) {
      window.location.href = `mailto:${email}`;
    } else {
      window.open(
        `https://mail.google.com/mail/?view=cm&fs=1&to=${email}`,
        "_blank",
        "noopener,noreferrer"
      );
    }
  };

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

        <div className="border-t border-gray-700 pt-5 grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
          {/* PHONE */}
          <a
            href="tel:+919591104481"
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-[linear-gradient(135deg,#0092B8_0%,#9810FA_100%)]">
              <Phone className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-gray-400 text-xs">Phone</p>
              <p className="text-white text-sm group-hover:underline">
                +91 9591104481
              </p>
            </div>
          </a>

          {/* WHATSAPP */}
          <a
            href="https://wa.me/919591104481"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-green-500">
              <SiWhatsapp className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-gray-400 text-xs">WhatsApp</p>
              <p className="text-white text-sm group-hover:underline">
                +91 9591104481
              </p>
            </div>
          </a>

          {/* EMAIL (custom handler ONLY here) */}
          <div
            onClick={handleEmailClick}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-[linear-gradient(135deg,#0092B8_0%,#9810FA_100%)]">
              <Mail className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-gray-400 text-xs">Email</p>
              <p className="text-white text-sm group-hover:underline">
                sales@crestline-tech.com
              </p>
            </div>
          </div>

          {/* LOCATION */}
          <a
            href="https://www.google.com/maps/search/?api=1&query=Vasanthanarasapura+Industrial+Park+KIADB"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-[linear-gradient(135deg,#0092B8_0%,#9810FA_100%)]">
              <MapPin className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-gray-400 text-xs">Location</p>
              <p className="text-white text-sm group-hover:underline">
                Vasanthanarasapura Industrial Park KIADB
              </p>
            </div>
          </a>
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
