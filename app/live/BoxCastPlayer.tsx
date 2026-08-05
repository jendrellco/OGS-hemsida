"use client";

import { useEffect, useState } from "react";

const channelId = "alliansloppet-ddbph1rbi0dfiwkcoojp";
const widgetId = `boxcast-widget-${channelId}`;
const scriptUrl = "https://js.boxcast.com/v3.min.js";

type BoxCastWidget = {
  loadChannel: (channel: string, options: Record<string, unknown>) => void;
};

declare global {
  interface Window {
    boxcast?: {
      noConflict: () => (selector: string) => BoxCastWidget;
    };
  }
}

const options = {
  showTitle: 0,
  showDescription: 0,
  showHighlights: 0,
  showRelated: false,
  defaultVideo: "next",
  playInline: false,
  dvr: true,
  market: "smb",
  showCountdown: true,
  showDonations: false,
  showDocuments: false,
  showIndex: false,
  showChat: false,
  hidePreBroadcastTextOverlay: false,
};

export default function BoxCastPlayer() {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const loadPlayer = () => {
      if (cancelled || !window.boxcast) return;

      try {
        window.boxcast.noConflict()(`#${widgetId}`).loadChannel(channelId, options);
      } catch {
        setFailed(true);
      }
    };

    const existingScript = document.querySelector<HTMLScriptElement>(`script[src="${scriptUrl}"]`);

    if (window.boxcast) {
      loadPlayer();
    } else if (existingScript) {
      existingScript.addEventListener("load", loadPlayer, { once: true });
      existingScript.addEventListener("error", () => setFailed(true), { once: true });
    } else {
      const script = document.createElement("script");
      script.src = scriptUrl;
      script.async = true;
      script.charset = "utf-8";
      script.addEventListener("load", loadPlayer, { once: true });
      script.addEventListener("error", () => setFailed(true), { once: true });
      document.head.appendChild(script);
    }

    return () => {
      cancelled = true;
      existingScript?.removeEventListener("load", loadPlayer);
    };
  }, []);

  return (
    <div className="boxcast-player" aria-label="Alliansloppet live broadcast">
      <div id={widgetId} />
      {failed && (
        <p className="boxcast-error">
          The player could not be loaded. Please refresh the page and try again.
        </p>
      )}
    </div>
  );
}
