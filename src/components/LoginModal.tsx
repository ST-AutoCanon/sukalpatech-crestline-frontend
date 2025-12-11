// import React, { useState, useEffect } from "react";

// interface LoginModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onLoginSuccess: (token: string, user: any, consent: boolean) => void;
//   onSwitchToRegister: () => void;
// }

// const LoginModal: React.FC<LoginModalProps> = ({
//   isOpen,
//   onClose,
//   onLoginSuccess,
//   onSwitchToRegister,
// }) => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
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
//     setLoading(true);

//     try {
//       const cookiesAccepted =
//         localStorage.getItem("cookiesAccepted") === "true";

//       const res = await fetch(`${backendUrl}/api/auth/login`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email, password, cookiesAccepted }),
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         setError(data.message || "Login failed");
//       } else {
//         onLoginSuccess(data.token, data.user, cookiesAccepted);
//         setEmail("");
//         setPassword("");
//       }
//     } catch {
//       setError("❌ Server error, please try again later");
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
//         {/* ✖ Close Button */}
//         <button
//           onClick={onClose}
//           className="absolute top-4 right-4 text-white/80 hover:text-white text-3xl font-light transition"
//         >
//           &times;
//         </button>

//         {/* 🌈 Title */}
//         <h2
//           className="text-3xl font-bold text-center mb-6 bg-clip-text text-transparent
//                        bg-gradient-to-r from-[#2B59FF] via-[#3A8DFF] to-[#B06AB3] drop-shadow-sm"
//         >
//           Welcome Back
//         </h2>

//         {error && (
//           <p className="text-red-400 text-center mb-4 text-sm">{error}</p>
//         )}

//         {/* 💬 Form */}
//         <form onSubmit={handleSubmit} className="space-y-5">
//           <div className="flex flex-col gap-2">
//             <label className="text-sm text-white/80 font-medium">Email</label>
//             <input
//               type="email"
//               placeholder="Enter your email"
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
//             {loading ? "Logging in..." : "Login"}
//           </button>
//         </form>

//         {/* 🩵 Signup link */}
//         <p className="text-center text-white/80 mt-6 text-sm">
//           Don’t have an account?{" "}
//           <span
//             className="text-[#7AA0FF] hover:underline cursor-pointer font-medium"
//             // onClick={() => alert("Redirect to Signup")}
//             onClick={() => {
//               onClose();
//               if (typeof onSwitchToRegister === "function")
//                 onSwitchToRegister();
//             }}
//           >
//             Sign up
//           </span>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default LoginModal;


// import React, { useState, useEffect } from "react";
// import loginBg from "/bannercr.png"; // ✅ Make sure this image exists

// interface LoginModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onSwitchToRegister: () => void;
// }

// const LoginModal: React.FC<LoginModalProps> = ({
//   isOpen,
//   onClose,
//   onSwitchToRegister,
// }) => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
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
//     setLoading(true);

//     try {
//       const res = await fetch(`${backendUrl}/api/auth/login`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email, password }),
//       });

//       const data = await res.json();

//       if (!res.ok) setError(data.message || "Invalid credentials");
//       else {
//         console.log("✅ Logged in:", data);
//         onClose();
//       }
//     } catch {
//       setError("❌ Server error, try again later");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 sm:p-6 md:p-8">
//       <div
//         className="relative w-full max-w-md sm:max-w-lg md:max-w-4xl flex flex-col md:flex-row
//                    overflow-hidden rounded-2xl shadow-2xl border border-white/20
//                    bg-white/10 backdrop-blur-xl animate-fade-in"
//       >
//         {/* 🖼️ Left Section - Image */}
//         <div className="relative w-full md:w-1/2 h-52 sm:h-64 md:h-auto shrink-0">
//           <img
//             src={loginBg}
//             alt="Login Background"
//             className="absolute inset-0 w-full h-full object-cover"
//           />
//           <div className="absolute inset-0 bg-black/50" />
//           <div className="relative z-10 flex flex-col justify-center items-start h-full p-6 sm:p-8 md:p-10 text-white">
//             <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 md:mb-4 drop-shadow-md">
//               Welcome Back
//             </h3>
//             <p className="text-white/90 text-sm sm:text-base leading-relaxed max-w-sm">
//               Sign in to continue your journey with Crestline Tech.
//             </p>
//           </div>
//         </div>

//         {/* 🧾 Right Section - Login Form */}
//         <div className="w-full md:w-1/2 p-6 sm:p-8 md:p-10 flex flex-col justify-center bg-[#1C1C28]/60">
//           <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 text-white">
//             Login
//           </h2>

//           {error && (
//             <p className="text-red-400 text-center mb-3 text-sm sm:text-base">
//               {error}
//             </p>
//           )}

//           <form onSubmit={handleSubmit} className="space-y-5">
//             <div className="flex flex-col gap-2">
//               <label className="text-sm text-white/80 font-medium">Email</label>
//               <input
//                 type="email"
//                 placeholder="example@mail.com"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 required
//                 className="w-full rounded-xl bg-white/20 text-white placeholder-white/60 px-4 py-2.5
//                            focus:outline-none focus:ring-2 focus:ring-[#3A8DFF]/70 transition border border-white/20"
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
//                 className="w-full rounded-xl bg-white/20 text-white placeholder-white/60 px-4 py-2.5
//                            focus:outline-none focus:ring-2 focus:ring-[#3A8DFF]/70 transition border border-white/20"
//               />
//             </div>

//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full mt-2 py-2.5 rounded-xl font-semibold text-white tracking-wide
//                          bg-linear-to-r from-[#0092B8] via-[#3A8DFF] to-[#9810FA]
//                          hover:opacity-90 transition-all duration-300 shadow-md"
//             >
//               {loading ? "Signing in..." : "Login"}
//             </button>
//           </form>

//           <p className="text-center text-white/80 mt-6 text-sm sm:text-base">
//             Don’t have an account?{" "}
//             <span
//               className="text-[#7AA0FF] hover:underline cursor-pointer font-medium"
//               onClick={() => {
//                 onClose();
//                 if (typeof onSwitchToRegister === "function")
//                   onSwitchToRegister();
//               }}
//             >
//               Sign Up
//             </span>
//           </p>
//         </div>

//         {/* ✖ Close Button (Fixed for Mobile & Desktop) */}
//         <button
//           onClick={onClose}
//           className="absolute top-3 right-4 text-white/90 hover:text-white text-3xl font-light
//                      transition z-[100] pointer-events-auto"
//           style={{ touchAction: "manipulation" }}
//         >
//           &times;
//         </button>
//       </div>
//     </div>
//   );
// };

// export default LoginModal;



import React, { useState, useEffect } from "react";
import loginBg from "/bannercr.png";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToHRMSLogin: () => void; // ✅ NEW PROP
}

const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onSwitchToHRMSLogin,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
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
    setLoading(true);

    try {
      const res = await fetch(`${backendUrl}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) setError(data.message || "Invalid credentials");
      else {
        console.log("Logged in:", data);
        onClose();
      }
    } catch {
      setError("Server error, try again later");
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
        {/* LEFT IMAGE SECTION */}
        <div className="relative w-full md:w-1/2 h-52 sm:h-64 md:h-auto shrink-0">
          <img
            src={loginBg}
            alt="Login Background"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative z-10 flex flex-col justify-center items-start h-full p-6 sm:p-8 md:p-10 text-white">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 md:mb-4 drop-shadow-md">
              Welcome Back
            </h3>
            <p className="text-white/90 text-sm sm:text-base leading-relaxed max-w-sm">
              Sign in to continue your journey with Crestline Tech.
            </p>
          </div>
        </div>

        {/* RIGHT FORM SECTION */}
        <div className="w-full md:w-1/2 p-6 sm:p-8 md:p-10 flex flex-col justify-center bg-[#1C1C28]/60">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 text-white">
            Login
          </h2>

          {error && (
            <p className="text-red-400 text-center mb-3 text-sm sm:text-base">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
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
                         bg-linear-to-r from-[#0092B8] via-[#3A8DFF] to-[#9810FA] 
                         hover:opacity-90 transition-all duration-300 shadow-md"
            >
              {loading ? "Signing in..." : "Login"}
            </button>
          </form>

          {/* ✅ HRMS LOGIN BUTTON */}
          <button
            onClick={onSwitchToHRMSLogin}
            className="text-[#7AA0FF] hover:underline text-center mt-6 font-medium"
          >
            Login with HRMS
          </button>
        </div>

        {/* CLOSE BUTTON */}
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

export default LoginModal;
