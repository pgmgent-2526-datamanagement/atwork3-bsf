"use client";

import { Slab } from "react-loading-indicators";

export default function Loading() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
      }}
    >
      <Slab color="#b978bd" size="medium" />
    </div>
  );
}
