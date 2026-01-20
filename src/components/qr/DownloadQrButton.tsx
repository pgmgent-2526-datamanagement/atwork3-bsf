"use client";

import { useState } from "react";
import QRCode from "qrcode";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface DownloadQrButtonProps {
  value: string; // de tekst/url die in de QR zit
  filename?: string; // bv. "qr-zaal.png"
}

export function DownloadQrButton({ value, filename }: DownloadQrButtonProps) {
  const [isBusy, setIsBusy] = useState(false);

  const onDownload = async () => {
    try {
      setIsBusy(true);

      // Hoge resolutie PNG
      const dataUrl = await QRCode.toDataURL(value, {
        width: 1024,
        margin: 2,
        errorCorrectionLevel: "M",
        type: "image/png",
      });

      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = filename ?? "qr-code.png";
      document.body.appendChild(a);
      a.click();
      a.remove();
    } finally {
      setIsBusy(false);
    }
  };

  return (
    <Button type="button" onClick={onDownload} disabled={isBusy}>
      <Download className="w-4 h-4 mr-2" />
      {isBusy ? "Downloaden..." : "Download QR"}
    </Button>
  );
}
