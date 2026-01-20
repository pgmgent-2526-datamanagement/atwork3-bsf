"use client";

import Image from "next/image";
import styles from "./QRCodeBlock.module.css";
import { CountdownTimer } from "./CountdownTimer";
import { Download } from "lucide-react";

type Props = {
  title: string;
  description?: string;
  imageSrc: string;
  endTime: string;
};

export default function QRCodeBlock({
  title,
  description,
  imageSrc,
  endTime,
}: Props) {
  const downloadQr = async () => {
    const res = await fetch(imageSrc);
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${title.replace(/\s+/g, "-").toLowerCase()}.png`;
    document.body.appendChild(a);
    a.click();
    a.remove();

    URL.revokeObjectURL(url);
  };

  return (
    <div className={styles.card}>
      <h2>{title}</h2>
      {description && <p>{description}</p>}

      <Image src={imageSrc} alt={title} width={240} height={240} priority />

      {/* ⏱️ puur visueel */}
      <CountdownTimer endTime={endTime} />

      {/* ⬇ Download knop */}
      <button className={styles.downloadBtn} onClick={downloadQr}>
        <Download size={16} />
        Download QR
      </button>
    </div>
  );
}
