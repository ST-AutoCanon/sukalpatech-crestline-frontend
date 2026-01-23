"use client";

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

  // queue a pending navigation (or other action) that must be sent to the iframe
  const [pendingNavigate, setPendingNavigate] = useState<string | null>(null);

  // ensure body class for mobile hiding remains working
  useEffect(() => {
    const updateBodyClass = () => {
      const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
      if (showIframe && isMobile) {
        document.body.classList.add("hide-shell-on-mobile");
      } else {
        document.body.classList.remove("hide-shell-on-mobile");
      }

      const bodyHidden = document.body.classList.contains(
        "hide-shell-on-mobile",
      );
      if (bodyHidden) setNavHeight(0);
      else {
        // measure nav height if present
        try {
          const nav =
            document.getElementById("site-navbar") ||
            (document.querySelector("nav") as HTMLElement | null);
          setNavHeight(nav?.offsetHeight ?? 0);
        } catch {
          setNavHeight(0);
        }
      }
    };

    updateBodyClass();
    window.addEventListener("resize", updateBodyClass);
    window.addEventListener("orientationchange", updateBodyClass);

    const mo =
      typeof MutationObserver !== "undefined"
        ? new MutationObserver(() => updateBodyClass())
        : null;
    if (mo)
      mo.observe(document.body, {
        attributes: true,
        attributeFilter: ["class"],
      });

    return () => {
      window.removeEventListener("resize", updateBodyClass);
      window.removeEventListener("orientationchange", updateBodyClass);
      if (mo) mo.disconnect();
      document.body.classList.remove("hide-shell-on-mobile");
    };
  }, [showIframe]);

  // helper: safely post message to iframe if contentWindow exists
  const safePostMessage = (msg: any) => {
    try {
      const win = iframeRef.current?.contentWindow;
      if (!win) {
        // console.warn("iframe contentWindow not ready for postMessage");
        return false;
      }
      win.postMessage(msg, childOrigin || "*");
      return true;
    } catch (err) {
      console.warn("postMessage failed", err);
      return false;
    }
  };

  // Listen for messages from child iframe
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
        // if there is pending navigation, send it now
        if (pendingNavigate) {
          const ok = safePostMessage({
            type: "request-navigate",
            path: pendingNavigate,
          });
          if (ok) {
            // clear pending only after successful post
            setPendingNavigate(null);
          }
        }
        return;
      }

      if (msg.type === "login-success") {
        try {
          sessionStorage.removeItem("EMBED_LOGIN");
        } catch {}
        setStatus("success");
        setShowModal(false);
        setShowIframe(true);
        // do not directly post navigate here; instead queue and let child-ready trigger actual navigation
        // this avoids sending request-navigate before the iframe is ready
        // but keep a fallback: if childReady is already true we can navigate immediately
        if (childReady) {
          safePostMessage({ type: "request-navigate", path: "/dashboard" });
        } else {
          setPendingNavigate("/dashboard");
        }
        return;
      }

      if (msg.type === "login-failed") {
        console.warn("HRMSPage login failed:", msg.error);
        // keep modal open and display message inside modal via passing error down or through state
        setStatus("failed");
        setError(msg.error || "Login failed");
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
  }, [allowedOrigins, navigate, childReady, pendingNavigate]);

  // handshake & fallback login: send parent-handshake, then fallback to stored EMBED_LOGIN if child doesn't become ready
  useEffect(() => {
    if (!iframeLoaded) return;

    // request handshake right away
    safePostMessage({ type: "parent-handshake" });

    const fallback = window.setTimeout(() => {
      const storedRaw = sessionStorage.getItem("EMBED_LOGIN");
      let stored = null;
      try {
        stored = storedRaw ? JSON.parse(storedRaw) : null;
      } catch {
        stored = null;
      }

      // if child not ready but we have stored creds, attempt parent-login
      if (!childReady && stored && stored.username && stored.password) {
        const ok = safePostMessage({
          type: "parent-login",
          username: stored.username,
          password: stored.password,
          orgId: stored.orgId || 28,
        });
        if (ok) setStatus("sent");
        else {
          setStatus("error");
          setError("postMessage failed (fallback)");
        }
      }

      // also if there is a pendingNavigate and child still not ready, leave it queued
    }, 250);

    return () => clearTimeout(fallback);
  }, [iframeLoaded, childReady]); // eslint-disable-line

  // whenever childReady or iframeLoaded changes, if there's a pendingNavigate try to send it
  useEffect(() => {
    if (!pendingNavigate) return;
    // only send when contentWindow is present and either childReady or iframeLoaded
    const win = iframeRef.current?.contentWindow;
    if (!win) return;

    if (childReady || iframeLoaded) {
      const ok = safePostMessage({
        type: "request-navigate",
        path: pendingNavigate,
      });
      if (ok) setPendingNavigate(null);
    }
  }, [pendingNavigate, childReady, iframeLoaded]);

  // timeout to detect no-response (optional): if status = 'sent' and no childReady, mark failed
  useEffect(() => {
    if (status !== "sent") return;
    const t = setTimeout(() => {
      if (!childReady) {
        setStatus("failed");
        setError((prev) => prev || "No response from embedded app");
      }
    }, 10000);
    return () => clearTimeout(t);
  }, [status, childReady]);

  const onIframeLoad = () => {
    setIframeLoaded(true);
    // request height; child will respond with content-height
    safePostMessage({ type: "request-height" });
  };

  // When parent login modal tells us login succeeded, queue navigation and show iframe
  const handleLoginSuccessFromModal = (payload?: any) => {
    // keep the modal closed and show iframe; queue navigate. The real navigation will be sent when childReady arrives
    setShowModal(false);
    setShowIframe(true);
    setPendingNavigate("/dashboard");
    // We also attempt immediate send if iframe already ready
    const win = iframeRef.current?.contentWindow;
    if (win && (childReady || iframeLoaded)) {
      const ok = safePostMessage({
        type: "request-navigate",
        path: "/dashboard",
      });
      if (ok) setPendingNavigate(null);
    }
  };

  const fallbackHeight = "100vh";

  return (
    <div className="min-h-screen bg-gray-50 text-black">
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
        onLoginSuccess={handleLoginSuccessFromModal}
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
