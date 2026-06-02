import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

interface LoginPageProps {
  onSuccess?: () => void; // ✅ allow modal to close after login
}

export default function LoginPage({ onSuccess }: LoginPageProps) {
  const { login, error, loading } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [orgCode, setOrgCode] = useState("");
  const [orgCodes, setOrgCodes] = useState<string[]>([]);
  const [showPassword, setShowPassword] = useState(false);

  /* =========================
     Fetch Organization Codes
  ========================= */
  useEffect(() => {
    const fetchOrgCodes = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/organisation/org-codes`,
        );
        const data = await res.json();

        if (data.success) {

          // now data.data is array of { org_code, name }
          setOrgCodes(data.data);
        }
      } catch (err) {
        console.error("Failed to fetch org codes", err);
      }
    };

    fetchOrgCodes();
  }, []);

  /* =========================
     Submit
  ========================= */
  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();

  //   try {
  //     const result = await login(email, password, orgCode);
  //     // const { user } = result.data;

  //     //  const token = result.data.token;
  //     const token = result.data.data.token;

  //      // decode token
  //     const user: any = jwtDecode(token);

  //     // ✅ Close modal if provided
  //     if (onSuccess) onSuccess();

  //     // Redirect based on role
  //     if (user.role === "admin") navigate("/admin");
  //     else if (user.role === "employee") navigate("/employee");
  //     else if (user.role === "super_admin") navigate("/super_admin");
  //   } catch (err) {
  //     console.error("Login failed", err);
  //   }
  // };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // ✅ Skip org validation for this specific user
    const isSuperAdminLogin =
      email === "kiran@gmail.com" && password === "Password123";

    // ✅ Apply validation only for others
    if (!isSuperAdminLogin && !orgCode) {
      alert("Please select organization");
      return;
    }

    try {
      const result = await login(email, password, orgCode || "");

      const token = result.data.token || result.data.data.token;
      const user: any = jwtDecode(token);

      if (onSuccess) onSuccess();

      if (user.role === "admin") navigate("/admin");
      else if (user.role === "employee") navigate("/employee");
      else if (user.role === "manager") navigate("/manager");
   else if (
  user.role === "project_manager" ||
  user.role === "project_manager_a" ||
  user.role === "project_manager_b" ||
  user.role === "project_manager_c" ||
  user.role === "project_manager_d" ||
  user.role === "project_manager_e"
) {
  navigate("/project_manager/dashboard");
}
      else if (user.role === "super_admin") navigate("/super_admin");

    } catch (err) {
      console.error("Login failed", err);
    }
  };

  return (
    <div className="w-full max-w-md">
      <h2 className="text-2xl font-semibold text-gray-800 text-center mb-2">
        Welcome Back
      </h2>
      <p className="text-center text-gray-500 mb-6 text-sm">
        Please login to continue
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Organization */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-600">
            Organization
          </label>
          <select
            value={orgCode}
            onChange={(e) => setOrgCode(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          >
            <option value="" disabled>
              Select Organization
            </option>
            {orgCodes.map((org: any) => (
              <option key={org.org_code} value={org.org_code}>
                {org.name}
              </option>
            ))}
          </select>
        </div>

        {/* Email */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-600">
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="you@example.com"
            className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>

        {/* Password */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-600">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full px-4 py-2.5 pr-11 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-2">
            {error}
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
