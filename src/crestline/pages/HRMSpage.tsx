("use client");

import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import HRMSLoginModal from "../components/HRMSLoginModal";

const HRMSPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const skipModal = !!(location.state && (location.state as any).skipModal);

  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [showModal, setShowModal] = useState<boolean>(() => !skipModal);
  const [showIframe, setShowIframe] = useState(false);

  const [iframeHeight, setIframeHeight] = useState<number | null>(null);
  const [childReady, setChildReady] = useState(false);
  const [status, setStatus] = useState<
    "idle" | "sent" | "success" | "failed" | "error"
  >("idle");
  const [error, setError] = useState<string | null>(null);

  const [navHeight, setNavHeight] = useState<number>(0);

  const iframeId = "pulse-iframe";
  const childOrigin = import.meta.env.VITE_CHILD_ORIGIN || "";

  const allowedOriginsRaw =
    import.meta.env.VITE_ALLOWED_IFRAME_ORIGINS || childOrigin;
  const allowedOrigins = allowedOriginsRaw
    .split(",")
    .map((s: string) => s.trim())
    .filter(Boolean);

  useEffect(() => {
    function onMessage(ev: MessageEvent) {
      const isFromIframeWindow =
        iframeRef.current && ev?.source === iframeRef.current.contentWindow;

      const originAllowed =
        allowedOrigins.length === 0 ||
        (ev?.origin && allowedOrigins.includes(ev.origin));

      if (!originAllowed && !isFromIframeWindow) return;

      const msg = ev.data || {};

      if (msg.type === "child-ready") {
        setChildReady(true);
        return;
      }

      if (msg.type === "login-success") {
        try {
          sessionStorage.removeItem("EMBED_LOGIN");
        } catch {}
        setStatus("success");
        setShowParentUI(false);
        setShowIframe(true);
        return;
      }

      if (msg.type === "login-failed") {
        console.warn("HRMSPage login failed:", msg.error);
      }

      if (msg.type === "child-logged-out") {
        try {
          sessionStorage.removeItem("EMBED_LOGIN");
        } catch (e) {}

        try {
          navigate("/", { replace: true });
        } catch (navErr) {
          try {
            window.location.replace("/");
          } catch {}
        }

        setShowIframe(false);
        setShowModal(false);
        return;
      }

      if (msg.type === "content-height" && typeof msg.height === "number") {
        setIframeHeight(Math.max(0, Math.floor(msg.height)));
      }
    }

    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [allowedOrigins, navigate]);

  const [showParentUI, setShowParentUI] = useState(true);

  useEffect(() => {
    if (!iframeLoaded) return;

    try {
      iframeRef.current?.contentWindow?.postMessage(
        { type: "parent-handshake" },
        childOrigin || "*",
      );
    } catch (err) {
      console.warn("Failed to post parent-handshake", err);
    }

    const fallback = window.setTimeout(() => {
      const storedRaw = sessionStorage.getItem("EMBED_LOGIN");
      let stored = null;
      try {
        stored = storedRaw ? JSON.parse(storedRaw) : null;
      } catch (e) {
        stored = null;
      }

      if (!childReady && stored && stored.username && stored.password) {
        try {
          iframeRef.current?.contentWindow?.postMessage(
            {
              type: "parent-login",
              username: stored.username,
              password: stored.password,
              orgId: stored.orgId || 28,
            },
            childOrigin || "*",
          );
          setStatus("sent");
        } catch (err) {
          setStatus("error");
          setError("postMessage failed (fallback)");
        }
      }
    }, 250);

    return () => clearTimeout(fallback);
  }, [iframeLoaded, childReady, childOrigin]);

  const onIframeLoad = () => {
    setIframeLoaded(true);
    try {
      iframeRef.current?.contentWindow?.postMessage(
        { type: "request-height" },
        childOrigin || "*",
      );
    } catch (e) {
      console.warn("Failed to postMessage to iframe on load", e);
    }
  };

  useEffect(() => {
    const measureNav = () => {
      try {
        const nav =
          document.getElementById("site-navbar") ||
          (document.querySelector("nav") as HTMLElement | null);
        const height = nav?.offsetHeight ?? 0;
        setNavHeight(height);
      } catch (err) {
        console.warn("Failed to measure navbar height", err);
        setNavHeight(0);
      }
    };

    measureNav();
    window.addEventListener("resize", measureNav);
    window.addEventListener("orientationchange", measureNav);

    const t = window.setTimeout(measureNav, 250);
    return () => {
      window.removeEventListener("resize", measureNav);
      window.removeEventListener("orientationchange", measureNav);
      window.clearTimeout(t);
    };
  }, []);

  const fallbackHeight = "100vh";

  return (
    <div className="min-h-screen bg-gray-50 text-black">
      {!showIframe && <div className="bg-white shadow py-3 px-6"></div>}

      <div className="w-full">
        <iframe
          id={iframeId}
          ref={iframeRef}
          src={childOrigin}
          title="Pulse HRMS Embedded"
          allow="camera; microphone; geolocation; fullscreen"
          className="w-full border-0"
          onLoad={onIframeLoad}
          style={{
            marginTop: navHeight ? `${navHeight}px` : undefined,
            height: iframeHeight ? `${iframeHeight}px` : fallbackHeight,
          }}
        />
      </div>

      <HRMSLoginModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          navigate("/", { replace: true });
        }}
        onLoginSuccess={(payload) => {
          console.info("Parent: login-success payload:", payload);
          setShowModal(false);
          setShowIframe(true);

          try {
            iframeRef.current?.contentWindow?.postMessage(
              { type: "request-navigate", path: "/dashboard" },
              childOrigin || "*",
            );
          } catch (e) {
            console.warn("request-navigate postMessage failed", e);
          }
        }}
        onSwitchToNormalLogin={() => {
          setShowModal(false);
          navigate("/?openLogin=1", { replace: true });
        }}
        iframeId={iframeId}
        childOrigin={childOrigin}
        iframeLoaded={iframeLoaded}
      />
    </div>
  );
};

export default HRMSPage;
