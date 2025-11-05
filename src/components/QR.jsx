// Generate a QR image (PNG data URL) in-browser using the 'qrcode' package.
// Install:  npm i qrcode
import { useEffect, useState } from "react";
import QRCode from "qrcode";

export default function QR({ value, size = 180 }) {
  const [src, setSrc] = useState("");

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const url = await QRCode.toDataURL(value, {
          width: size,
          margin: 1,
          color: { dark: "#000000", light: "#FFFFFF" }
        });
        if (active) setSrc(url);
      } catch (e) {
        console.error("QR generation failed:", e);
      }
    })();
    return () => { active = false; };
  }, [value, size]);

  return src ? (
    <img
      src={src}
      width={size}
      height={size}
      alt="QR code for location"
      draggable="false"
      style={{ display: "block" }}
    />
  ) : (
    <div style={{ width: size, height: size }} />
  );
}
