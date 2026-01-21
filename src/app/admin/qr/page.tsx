"use client";

import { useEffect, useState } from "react";
import QRCodeBlock from "@/components/qr/QRCodeBlock";
import CountdownRing from "@/components/qr/CountdownRing";

type Session = {
  id: number;
  type: "zaal" | "online";
  end_time: string;
};

export default function AdminQRPage() {
  const [sessions, setSessions] = useState<Session[]>([]);

  useEffect(() => {
    const fetchStatus = async () => {
      const res = await fetch("/api/votes/status");
      const data = await res.json();
      setSessions(data);
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 1000);

    return () => clearInterval(interval);
  }, []);

  if (sessions.length === 0) {
    return <p>Geen actieve stemmingen</p>;
  }

  return (
    <div style={{ display: "flex", gap: "3rem" }}>
      {sessions.map((s) => (
        <div key={s.id} style={{ textAlign: "center" }}>
          <QRCodeBlock
            title={s.type === "zaal" ? "Zaal" : "Online"}
            description="Scan om te stemmen"
            imageSrc={`/qr/${s.type}.png`}
            endTime={s.end_time}
          />
          <CountdownRing endTime={s.end_time} />
        </div>
      ))}
    </div>
  );
}
