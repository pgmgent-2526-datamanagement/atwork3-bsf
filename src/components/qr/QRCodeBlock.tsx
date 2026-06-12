"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import styles from "./QRCodeBlock.module.css";
import { CountdownTimer } from "./CountdownTimer";
import { Download } from "lucide-react";

type Props = {
  title: string;
  description?: string;
  value: string;
  endTime: string;
};

export default function QRCodeBlock({
  title,
  description,
  value,
  endTime,
}: Props) {
  const [qrDataUrl, setQrDataUrl] = useState<string>("");

  useEffect(() => {
    if (!value) return;
    QRCode.toDataURL(value, {
      width: 480,
      margin: 2,
      errorCorrectionLevel: "M",
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error("Error generating QR code:", err));
  }, [value]);

  const downloadQr = () => {
    if (!qrDataUrl) return;
    const a = document.createElement("a");
    a.href = qrDataUrl;
    a.download = `${title.replace(/\s+/g, "-").toLowerCase()}-qr.png`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  return (
    <div className={styles.card}>
      <h2>{title}</h2>
      {description && <p>{description}</p>}

      {qrDataUrl ? (
        <img
          src={qrDataUrl}
          alt={title}
          width={240}
          height={240}
          style={{ borderRadius: "8px", display: "block", margin: "0 auto" }}
        />
      ) : (
        <div
          style={{
            width: 240,
            height: 240,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "1px dashed #555",
            borderRadius: "8px",
            margin: "0 auto",
            color: "#888",
          }}
        >
          Generating QR...
        </div>
      )}

      {/* ⏱️ puur visueel */}
      <CountdownTimer endTime={endTime} />

      {/* ⬇ Download knop */}
      <button
        className={styles.downloadBtn}
        onClick={downloadQr}
        disabled={!qrDataUrl}
      >
        <Download size={16} />
        Download QR
      </button>
    </div>
  );
}
