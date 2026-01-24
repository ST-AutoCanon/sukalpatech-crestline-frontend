let iframe: HTMLIFrameElement | null = null;

export function getHRMSIframe(childOrigin: string): HTMLIFrameElement {
  if (!iframe) {
    iframe = document.createElement("iframe");
    iframe.src = childOrigin;
    iframe.style.width = "100%";
    iframe.style.height = "100%";
    iframe.style.border = "0";
    iframe.allow = "camera; microphone; fullscreen";
    iframe.title = "HRMS";
  }
  return iframe;
}

export function hideHRMSIframe() {
  if (iframe) iframe.style.display = "none";
}

export function showHRMSIframe() {
  if (iframe) iframe.style.display = "block";
}
