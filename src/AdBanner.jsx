import { useEffect } from "react";

export default function AdBanner({ slot, style }) {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.log("AdSense error:", e);
    }
  }, []);

  return (
    <ins
      className="adsbygoogle"
      style={style || { display: "block" }}
      data-ad-client="ca-pub-2998457660351209"
      data-ad-slot={slot}
      data-ad-format="auto"
      data-full-width-responsive="true"
    ></ins>
  );
}
