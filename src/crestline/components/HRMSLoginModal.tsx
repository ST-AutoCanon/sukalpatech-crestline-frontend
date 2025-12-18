"use client";

import React, { useEffect, useState } from "react";
import loginBg from "/crestline/public/bannercr.png";

interface HRMSLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToNormalLogin: () => void;
  onLoginSuccess?: (payload?: any) => void;
  iframeId?: string;
  childOrigin?: string;
  iframeLoaded?: boolean;
}

const HRMSLoginModal: React.FC<HRMSLoginModalProps> = ({
  isOpen,
  onClose,
  onSwitchToNormalLogin,
  onLoginSuccess,
  iframeId = "pulse-iframe",
  childOrigin = "https://www.pulsework.in",
  iframeLoaded = false,
}) => {
  const [empId, setEmpId] = useState("");
  const [password, setPassword] = useState("");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    function onMessage(ev: MessageEvent) {
      if (ev.origin !== childOrigin) return;
      const msg = ev.data || {};

      if (msg.type === "login-success") {
        setStatusMessage("Login succeeded — redirecting...");
        setIsLoggingIn(false);

        if (typeof onLoginSuccess === "function") {
          onLoginSuccess(msg.payload);
        } else {
          onClose();
        }
      } else if (msg.type === "login-failed") {
        setStatusMessage(
          `Login failed${msg.error ? ` : ${String(msg.error)} ` : ""}`
        );
        setIsLoggingIn(false);
      }
    }

    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [childOrigin, onClose, onLoginSuccess]);

  if (!isOpen) return null;

  const handleSubmitHRMSLogin = (e?: React.FormEvent) => {
    e?.preventDefault();

    if (!iframeLoaded) {
      setStatusMessage("HRMS is still loading. Please wait…");
      return;
    }

    if (!empId || !password) {
      setStatusMessage("Employee ID and password are required.");
      return;
    }

    const iframe = document.getElementById(
      iframeId
    ) as HTMLIFrameElement | null;

    if (!iframe || !iframe.contentWindow) {
      setStatusMessage(
        `Embedded app not available (expected iframe id="${iframeId}").`
      );
      return;
    }

    setIsLoggingIn(true);
    setStatusMessage("Sent credentials — authenticating...");

    try {
      iframe.contentWindow.postMessage(
        {
          type: "parent-login",
          username: empId,
          password,
        },
        childOrigin
      );
    } catch (err) {
      console.warn("postMessage failed", err);
      setStatusMessage("Failed to send credentials to embedded app.");
      setIsLoggingIn(false);
    }
  };

  const buttonDisabled = !iframeLoaded || isLoggingIn;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="relative w-full max-w-4xl flex flex-col md:flex-row rounded-2xl overflow-hidden shadow-lg bg-white/10 backdrop-blur-xl border border-white/20">
        <div className="relative w-full md:w-1/2 h-48 md:h-auto">
          <img
            src={loginBg}
            className="absolute inset-0 w-full h-full object-cover"
            alt="login background"
          />
          <div className="absolute inset-0 bg-black/60" />
          <div className="relative z-10 flex flex-col justify-center h-full p-8 text-white">
            <h2 className="text-3xl font-bold mb-4">HRMS Login</h2>
            <p className="text-white/80">
              Access your employee dashboard securely.
            </p>
          </div>
        </div>

        <div className="w-full md:w-1/2 p-8 bg-[#1C1C28]/60">
          <h2 className="text-3xl font-semibold text-center text-white mb-8">
            HRMS Login
          </h2>

          <form
            onSubmit={handleSubmitHRMSLogin}
            className="flex flex-col gap-5"
          >
            <div>
              <label className="text-white/80">Employee ID</label>
              <input
                value={empId}
                onChange={(e) => setEmpId(e.target.value)}
                placeholder="Enter your Employee ID"
                className="w-full mt-1 rounded-xl bg-white/20 text-white placeholder-white/60 px-4 py-2.5 outline-none"
                autoComplete="username"
              />
            </div>

            <div>
              <label className="text-white/80">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full mt-1 rounded-xl bg-white/20 text-white placeholder-white/60 px-4 py-2.5 outline-none"
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              disabled={buttonDisabled}
              aria-busy={isLoggingIn}
              className={`w-full py-3 mt-4 rounded-xl flex items-center justify-center gap-3 ${
                !buttonDisabled
                  ? "bg-gradient-to-r from-[#0088cc] to-[#6600ff] text-white"
                  : "bg-gray-600 text-white/80 cursor-not-allowed"
              }`}
            >
              {isLoggingIn ? (
                <>
                  <svg
                    className="w-5 h-5 animate-spin"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    role="img"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    />
                  </svg>
                  <span>Logging in…</span>
                </>
              ) : iframeLoaded ? (
                "Login"
              ) : (
                "Loading HRMS…"
              )}
            </button>
          </form>

          {statusMessage && (
            <div className="mt-4 text-center text-sm text-white/90">
              {statusMessage}
            </div>
          )}

          <p className="text-center text-white/80 mt-6 text-sm sm:text-base">
            Want company login?{" "}
            <span
              className="text-[#7AA0FF] cursor-pointer hover:underline"
              onClick={onSwitchToNormalLogin}
            >
              Click here
            </span>
          </p>
        </div>

        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-white text-3xl"
          aria-label="Close"
        >
          &times;
        </button>
      </div>
    </div>
  );
};

export default HRMSLoginModal;
