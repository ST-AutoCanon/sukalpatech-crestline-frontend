import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import HRMSLoginModal from "../components/HRMSLoginModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPowerOff } from "@fortawesome/free-solid-svg-icons";

const HRMSPage: React.FC = () => {
  const navigate = useNavigate();
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [showModal, setShowModal] = useState(true);
  const [showIframe, setShowIframe] = useState(false);

  const iframeId = "pulse-iframe";
    //   const childOrigin = "http://localhost:3001";
    const childOrigin = "https://www.pulsework.in";

///////
  useEffect(() => {
    function onParentMessage(ev: MessageEvent) {
      if (ev.origin !== childOrigin) return;
      const msg = ev.data || {};

      if (msg.type === "login-success") {
        console.info("HRMSPage received login-success:", msg.payload);
        setShowModal(false);
        setShowIframe(true);
      } else if (msg.type === "login-failed") {
        console.warn("HRMSPage login failed:", msg.error);
      }
    }

    window.addEventListener("message", onParentMessage);
    return () => window.removeEventListener("message", onParentMessage);
  }, [childOrigin]);

   useEffect(() => {
     function onParentMessage(ev: MessageEvent) {
       if (ev.origin !== childOrigin) return;
       const msg = ev.data || {};

       if (msg.type === "login-success") {
         console.info("HRMSPage received login-success:", msg.payload);
         setShowModal(false);
         setShowIframe(true);
       } else if (msg.type === "login-failed") {
         console.warn("HRMSPage login failed:", msg.error);
       }
     }

     window.addEventListener("message", onParentMessage);
     return () => window.removeEventListener("message", onParentMessage);
   }, [childOrigin]);


  const hiddenIframeStyle: React.CSSProperties = {
    position: "absolute",
    left: "-9999px",
    width: 0,
    height: 0,
    border: "none",
    visibility: "hidden",
  };

  const fullScreenIframeStyle: React.CSSProperties = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    border: "none",
    margin: 0,
    padding: 0,
    zIndex: 9999,
  };

  const handleCloseAndGoHome = () => {
    setShowModal(false);
    setShowIframe(false);
    navigate("/", { replace: true });
  };

  return (
    <div className="min-h-screen bg-gray-50 text-black">
      {!showIframe && (
        <div className="bg-white shadow py-3 px-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-xl font-semibold">HRMS — Embedded App</h1>
            <p className="text-sm text-gray-600">Embedded from {childOrigin}</p>
          </div>
        </div>
      )}

      <iframe
        id={iframeId}
        ref={iframeRef}
        src={childOrigin}
        title="Pulse HRMS Embedded"
        style={showIframe ? fullScreenIframeStyle : hiddenIframeStyle}
        onLoad={() => {
          console.info("HRMS iframe loaded");
          setIframeLoaded(true);
        }}
      />

      {showIframe && (
        <div
          role="button"
          onClick={handleCloseAndGoHome}
          aria-label="Close embedded HRMS"
          style={{
            position: "fixed",
            top: 16,
            right: 14,
            zIndex: 10000,
            background: "#fff",
            color: "#475569",
            fontSize: 22,
            transition: "all 0.2s ease",
            border: "none",
            padding: "8px",
            borderRadius: "50%",
            cursor: "pointer",
          }}
        >
          <FontAwesomeIcon icon={faPowerOff} className="fa-icon" />
        </div>
      )}

      <HRMSLoginModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSwitchToNormalLogin={() => setShowModal(false)}
        iframeId={iframeId}
        childOrigin={childOrigin}
        iframeLoaded={iframeLoaded}
      />
    </div>
  );
};

export default HRMSPage;
