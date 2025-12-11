// import React, { useState, useEffect } from "react";

// interface RegisterModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onSwitchToLogin: () => void;
// }

// const RegisterModal: React.FC<RegisterModalProps> = ({
//   isOpen,
//   onClose,
//   onSwitchToLogin,
// }) => {
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");
//   const [loading, setLoading] = useState(false);

//   const backendUrl =
//     import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

//   useEffect(() => {
//     const handleKeyDown = (e: KeyboardEvent) => {
//       if (e.key === "Escape") onClose();
//     };
//     if (isOpen) document.addEventListener("keydown", handleKeyDown);
//     return () => document.removeEventListener("keydown", handleKeyDown);
//   }, [isOpen, onClose]);

//   if (!isOpen) return null;

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError("");
//     setSuccess("");
//     setLoading(true);

//     try {
//       const res = await fetch(`${backendUrl}/api/auth/register`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ name, email, password }),
//       });

//       const data = await res.json();

//       if (!res.ok) setError(data.message || "Registration failed");
//       else {
//         setSuccess("🎉 Registration successful! You can now login.");
//         setName("");
//         setEmail("");
//         setPassword("");
//       }
//     } catch {
//       setError("❌ Server error, try again later");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
//       <div
//         className="relative w-full max-w-md p-8 rounded-3xl shadow-2xl border border-white/20
//                       bg-gradient-to-br from-white/25 via-white/15 to-white/10 backdrop-blur-xl
//                       animate-fade-in"
//       >
//         {/* Close button */}
//         <button
//           onClick={onClose}
//           className="absolute top-4 right-4 text-white/80 hover:text-white text-3xl font-light transition"
//         >
//           &times;
//         </button>

//         {/* Title */}
//         <h2
//           className="text-3xl font-bold text-center mb-6 bg-clip-text text-transparent
//                        bg-gradient-to-r from-[#2B59FF] via-[#3A8DFF] to-[#B06AB3] drop-shadow-sm"
//         >
//           Create Account
//         </h2>

//         {/* Feedback messages */}
//         {error && (
//           <p className="text-red-400 text-center mb-3 text-sm">{error}</p>
//         )}
//         {success && (
//           <p className="text-green-400 text-center mb-3 text-sm">{success}</p>
//         )}

//         {/* Form */}
//         <form onSubmit={handleSubmit} className="space-y-5">
//           <div className="flex flex-col gap-2">
//             <label className="text-sm text-white/80 font-medium">
//               Full Name
//             </label>
//             <input
//               type="text"
//               placeholder="John Doe"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               required
//               className="w-full rounded-xl bg-white/20 text-white placeholder-white/60 px-4 py-2.5
//                          focus:outline-none focus:ring-2 focus:ring-[#3A8DFF]/70 transition border border-white/20"
//             />
//           </div>

//           <div className="flex flex-col gap-2">
//             <label className="text-sm text-white/80 font-medium">Email</label>
//             <input
//               type="email"
//               placeholder="example@mail.com"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//               className="w-full rounded-xl bg-white/20 text-white placeholder-white/60 px-4 py-2.5
//                          focus:outline-none focus:ring-2 focus:ring-[#3A8DFF]/70 transition border border-white/20"
//             />
//           </div>

//           <div className="flex flex-col gap-2">
//             <label className="text-sm text-white/80 font-medium">
//               Password
//             </label>
//             <input
//               type="password"
//               placeholder="••••••••"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//               className="w-full rounded-xl bg-white/20 text-white placeholder-white/60 px-4 py-2.5
//                          focus:outline-none focus:ring-2 focus:ring-[#3A8DFF]/70 transition border border-white/20"
//             />
//           </div>

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full mt-2 py-2.5 rounded-xl font-semibold text-white tracking-wide
//                        bg-gradient-to-r from-[#2B59FF] via-[#3A8DFF] to-[#B06AB3]
//                        hover:opacity-90 transition-all duration-300 shadow-md"
//           >
//             {loading ? "Registering..." : "Register"}
//           </button>
//         </form>

//         <p className="text-center text-white/80 mt-6 text-sm">
//           Already have an account?{" "}
//           <span
//             className="text-[#7AA0FF] hover:underline cursor-pointer font-medium"
//             // onClick={() => alert("Redirect to Login")}
//             onClick={() => {
//               onClose();
//               if (typeof onSwitchToLogin === "function") onSwitchToLogin();
//             }}
//           >
//             Login
//           </span>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default RegisterModal;








// import React, { useState, useEffect } from "react";
// import registerBg from "../../public/bannercr.png"; // ✅ Make sure image exists here (src/assets/register-bg.jpg)

// interface RegisterModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onSwitchToLogin: () => void;
// }

// const RegisterModal: React.FC<RegisterModalProps> = ({
//   isOpen,
//   onClose,
//   onSwitchToLogin,
// }) => {
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");
//   const [loading, setLoading] = useState(false);

//   const backendUrl =
//     import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

//   useEffect(() => {
//     const handleKeyDown = (e: KeyboardEvent) => {
//       if (e.key === "Escape") onClose();
//     };
//     if (isOpen) document.addEventListener("keydown", handleKeyDown);
//     return () => document.removeEventListener("keydown", handleKeyDown);
//   }, [isOpen, onClose]);

//   if (!isOpen) return null;

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError("");
//     setSuccess("");
//     setLoading(true);

//     try {
//       const res = await fetch(`${backendUrl}/api/auth/register`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ name, email, password }),
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         setError(data.message || "Registration failed");
//       } else {
//         setSuccess("🎉 Registration successful! You can now login.");
//         setName("");
//         setEmail("");
//         setPassword("");
//       }
//     } catch {
//       setError("❌ Server error, try again later");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
//       <div className="relative w-full max-w-5xl flex flex-col md:flex-row overflow-hidden rounded-3xl shadow-2xl border border-white/20 bg-white/5 animate-fade-in">
//         {/* ✖ Close Button */}
//         <button
//           onClick={onClose}
//           className="absolute top-4 right-4 text-white/80 hover:text-white text-3xl font-light transition z-10"
//         >
//           &times;
//         </button>

//         {/* ===== Left Section (Image & Text Overlay) ===== */}
//         <div className="relative w-full md:w-1/2 h-60 md:h-auto flex-shrink-0">
//           <img
//             src={registerBg}
//             alt="Register Background"
//             className="absolute inset-0 w-full h-full object-cover"
//           />
//           <div className="absolute inset-0 bg-black/50" />
//           <div className="relative z-10 flex flex-col justify-center items-start h-full p-8 md:p-10 text-white">
//             <h3 className="text-3xl md:text-4xl font-bold mb-4 drop-shadow-md">
//               Join Crestline Tech
//             </h3>
//             <p className="text-white/90 text-base leading-relaxed max-w-sm">
//               Create your account and be part of our innovative journey in
//               technology, design, and innovation.
//             </p>
//           </div>
//         </div>

//         {/* ===== Right Section (Registration Form) ===== */}
//         <div className="w-full md:w-1/2 p-8 md:p-10 flex flex-col justify-center bg-[#1C1C28]/50">
//           <h2 className="text-3xl font-bold text-center mb-6 text-white">
//             Create Account
//           </h2>

//           {/* Feedback Messages */}
//           {error && (
//             <p className="text-red-400 text-center mb-3 text-sm">{error}</p>
//           )}
//           {success && (
//             <p className="text-green-400 text-center mb-3 text-sm">{success}</p>
//           )}

//           {/* Form */}
//           <form onSubmit={handleSubmit} className="space-y-5">
//             <div className="flex flex-col gap-2">
//               <label className="text-sm text-white/80 font-medium">
//                 Full Name
//               </label>
//               <input
//                 type="text"
//                 placeholder="John Doe"
//                 value={name}
//                 onChange={(e) => setName(e.target.value)}
//                 required
//                 className="w-full rounded-xl bg-white/20 text-white placeholder-white/60 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#3A8DFF]/70 transition border border-white/20"
//               />
//             </div>

//             <div className="flex flex-col gap-2">
//               <label className="text-sm text-white/80 font-medium">Email</label>
//               <input
//                 type="email"
//                 placeholder="example@mail.com"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 required
//                 className="w-full rounded-xl bg-white/20 text-white placeholder-white/60 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#3A8DFF]/70 transition border border-white/20"
//               />
//             </div>

//             <div className="flex flex-col gap-2">
//               <label className="text-sm text-white/80 font-medium">
//                 Password
//               </label>
//               <input
//                 type="password"
//                 placeholder="••••••••"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 required
//                 className="w-full rounded-xl bg-white/20 text-white placeholder-white/60 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#3A8DFF]/70 transition border border-white/20"
//               />
//             </div>

//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full mt-2 py-2.5 rounded-xl font-semibold text-white tracking-wide bg-gradient-to-r from-[#0092B8] via-[#3A8DFF] to-[#9810FA] hover:opacity-90 transition-all duration-300 shadow-md"
//             >
//               {loading ? "Registering..." : "Register"}
//             </button>
//           </form>

//           {/* Switch to Login */}
//           <p className="text-center text-white/80 mt-6 text-sm">
//             Already have an account?{" "}
//             <span
//               className="text-[#7AA0FF] hover:underline cursor-pointer font-medium"
//               onClick={() => {
//                 onClose();
//                 if (typeof onSwitchToLogin === "function") onSwitchToLogin();
//               }}
//             >
//               Login
//             </span>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default RegisterModal;






import React, { useState, useEffect } from "react";
import registerBg from "/bannercr.png"; // ✅ Ensure this image exists

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
}

const RegisterModal: React.FC<RegisterModalProps> = ({
  isOpen,
  onClose,
  onSwitchToLogin,
}) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const backendUrl =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await fetch(`${backendUrl}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Registration failed");
      } else {
        setSuccess("🎉 Registration successful! You can now login.");
        setName("");
        setEmail("");
        setPassword("");
      }
    } catch {
      setError("❌ Server error, try again later");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 sm:p-6 md:p-8">
      <div
        className="relative w-full max-w-md sm:max-w-lg md:max-w-4xl flex flex-col md:flex-row 
                   overflow-hidden rounded-2xl shadow-2xl border border-white/20 
                   bg-white/10 backdrop-blur-xl animate-fade-in"
      >
        {/* 🖼️ Left Section - Image */}
        <div className="relative w-full md:w-1/2 h-52 sm:h-64 md:h-auto flex-shrink-0">
          <img
            src={registerBg}
            alt="Register Background"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative z-10 flex flex-col justify-center items-start h-full p-6 sm:p-8 md:p-10 text-white">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 md:mb-4 drop-shadow-md">
              Join Crestline Tech
            </h3>
            <p className="text-white/90 text-sm sm:text-base leading-relaxed max-w-sm">
              Create your account and be part of our innovative journey in
              technology, design, and excellence.
            </p>
          </div>
        </div>

        {/* 🧾 Right Section - Register Form */}
        <div className="w-full md:w-1/2 p-6 sm:p-8 md:p-10 flex flex-col justify-center bg-[#1C1C28]/60">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 text-white">
            Create Account
          </h2>

          {error && (
            <p className="text-red-400 text-center mb-3 text-sm sm:text-base">
              {error}
            </p>
          )}
          {success && (
            <p className="text-green-400 text-center mb-3 text-sm sm:text-base">
              {success}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="flex flex-col gap-2">
              <label className="text-sm text-white/80 font-medium">
                Full Name
              </label>
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full rounded-xl bg-white/20 text-white placeholder-white/60 px-4 py-2.5 
                           focus:outline-none focus:ring-2 focus:ring-[#3A8DFF]/70 transition border border-white/20"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm text-white/80 font-medium">Email</label>
              <input
                type="email"
                placeholder="example@mail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-xl bg-white/20 text-white placeholder-white/60 px-4 py-2.5 
                           focus:outline-none focus:ring-2 focus:ring-[#3A8DFF]/70 transition border border-white/20"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm text-white/80 font-medium">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-xl bg-white/20 text-white placeholder-white/60 px-4 py-2.5 
                           focus:outline-none focus:ring-2 focus:ring-[#3A8DFF]/70 transition border border-white/20"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-2.5 rounded-xl font-semibold text-white tracking-wide 
                         bg-gradient-to-r from-[#0092B8] via-[#3A8DFF] to-[#9810FA] 
                         hover:opacity-90 transition-all duration-300 shadow-md"
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </form>

          <p className="text-center text-white/80 mt-6 text-sm sm:text-base">
            Already have an account?{" "}
            <span
              className="text-[#7AA0FF] hover:underline cursor-pointer font-medium"
              onClick={() => {
                onClose();
                if (typeof onSwitchToLogin === "function") onSwitchToLogin();
              }}
            >
              Login
            </span>
          </p>
        </div>

        {/* ✖ Close Button (Fixed for Mobile & Desktop) */}
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-white/90 hover:text-white text-3xl font-light 
                     transition z-[100] pointer-events-auto"
          style={{ touchAction: "manipulation" }}
        >
          &times;
        </button>
      </div>
    </div>
  );
};

export default RegisterModal;
