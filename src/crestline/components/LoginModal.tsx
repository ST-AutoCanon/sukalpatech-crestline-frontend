import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../features/auth/hooks/useAuth";
import loginBg from "/crestline/public/bannercr.png";
import { Eye, EyeOff } from "lucide-react";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToRegister: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onSwitchToRegister,
}) => {
  const { login, error, loading } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
const [showPassword, setShowPassword] = useState(false);

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
    try {
      const result = await login(email, password);
      const role = result.data.user.role;

      onClose(); // close modal first

      if (role === "admin") navigate("/admin");
      else if (role === "employee") navigate("/employee");
    } catch (err) {
      console.error("Login failed", err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center   p-4 sm:p-6 md:p-8">
      <div className="relative w-full max-w-md sm:max-w-lg md:max-w-4xl flex flex-col md:flex-row overflow-hidden rounded-2xl shadow-2xl border border-white/20 bg-white/10 backdrop-blur-xl">
        {/* Left Image */}
        <div className="relative w-full md:w-1/2 h-52 sm:h-64 md:h-auto shrink-0">
          <img
            src={loginBg}
            alt="Login Background"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative z-10 flex flex-col justify-center h-full p-8 text-white">
            <h3 className="text-3xl font-bold mb-3">Welcome Back</h3>
            <p className="text-white/90 text-sm">
              Sign in to continue your journey with Crestline Tech.
            </p>
          </div>
        </div>

        {/* Right Form */}
        <div className="w-full md:w-1/2 p-6 sm:p-8 md:p-10 flex flex-col justify-center bg-[#1C1C28]/60">
          <h2 className="text-3xl font-bold text-center mb-6 text-white">
            Login
          </h2>

          {error && (
            <p className="text-red-400 text-center mb-3 text-sm">{error}</p>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="flex flex-col gap-2">
              <label className="text-sm text-white/80 font-medium">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
                className="w-full rounded-xl bg-white/20 text-white px-4 py-2.5 border border-white/20 focus:ring-2 focus:ring-[#3A8DFF]"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm text-white/80 font-medium">
                Password
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter your password"
                  className="w-full rounded-xl bg-white/20 text-white px-4 py-2.5 pr-12 border border-white/20 focus:ring-2 focus:ring-[#3A8DFF]"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl font-semibold text-white bg-linear-to-r from-[#0092B8] via-[#3A8DFF] to-[#9810FA] disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Login"}
            </button>
          </form>

          <p className="text-center text-white/80 mt-6 text-sm">
            Don’t have an account?{" "}
            <span
              onClick={() => {
                onClose();
                onSwitchToRegister();
              }}
              className="text-[#7AA0FF] hover:underline cursor-pointer"
            >
              Sign Up
            </span>
          </p>
        </div>

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-white text-3xl"
        >
          &times;
        </button>
      </div>
    </div>
  );
};

export default LoginModal;
