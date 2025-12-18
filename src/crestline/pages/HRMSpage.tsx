"use client";

import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import HRMSLoginModal from "../components/HRMSLoginModal";

const HRMSPage: React.FC = () => {
  const navigate = useNavigate();
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [showModal, setShowModal] = useState(true);
  const [showIframe, setShowIframe] = useState(false);

  const [iframeHeight, setIframeHeight] = useState<number | null>(null);

  const [navHeight, setNavHeight] = useState<number>(0);

  const iframeId = "pulse-iframe";
  const childOrigin = "http://localhost:3001";

  useEffect(() => {
    function onParentMessage(ev: MessageEvent) {
      if (ev.origin !== childOrigin) return;
      const msg = ev.data || {};

      if (msg.type === "login-success") {
        setShowModal(false);
        setShowIframe(true);
      } else if (msg.type === "login-failed") {
        console.warn("HRMSPage login failed:", msg.error);
      } else if (
        msg.type === "content-height" &&
        typeof msg.height === "number"
      ) {
        setIframeHeight(Math.max(0, Math.floor(msg.height)));
      }
    }

    window.addEventListener("message", onParentMessage);
    return () => window.removeEventListener("message", onParentMessage);
  }, [childOrigin]);

  useEffect(() => {
    function onChildMessage(ev: MessageEvent) {
      if (ev.origin !== childOrigin) return;

      const msg = ev.data || {};

      if (msg.type === "child-logged-out") {
        setShowIframe(false);
        setShowModal(false);

        navigate("/", { replace: true });
      }
    }

    window.addEventListener("message", onChildMessage);
    return () => window.removeEventListener("message", onChildMessage);
  }, [childOrigin, navigate]);

  const onIframeLoad = () => {
    setIframeLoaded(true);
    try {
      iframeRef.current?.contentWindow?.postMessage(
        { type: "request-height" },
        childOrigin
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
              childOrigin
            );
          } catch (e) {}
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
