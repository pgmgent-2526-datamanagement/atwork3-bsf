"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, CheckCircle2, Info, X } from "lucide-react";

export type ToastVariant = "success" | "error" | "info";

export type ToastAction = {
  label: string;
  onClick: () => void;
};

export type ToastItem = {
  id: string;
  title?: string;
  message: string;
  variant: ToastVariant;
  durationMs?: number;
  actions?: ToastAction[];
};

type ToastContextValue = {
  pushToast: (t: Omit<ToastItem, "id">) => void;
  success: (message: string, title?: string) => void;
  error: (message: string, title?: string) => void;
  info: (message: string, title?: string) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

function icon(variant: ToastVariant) {
  switch (variant) {
    case "success":
      return <CheckCircle2 size={18} />;
    case "error":
      return <AlertCircle size={18} />;
    default:
      return <Info size={18} />;
  }
}

function accentBg(variant: ToastVariant) {
  switch (variant) {
    case "success":
      return "rgba(34,197,94,0.16)";
    case "error":
      return "rgba(220,38,38,0.16)";
    default:
      return "rgba(59,130,246,0.16)";
  }
}

function accentBorder(variant: ToastVariant) {
  switch (variant) {
    case "success":
      return "rgba(34,197,94,0.35)";
    case "error":
      return "rgba(220,38,38,0.35)";
    default:
      return "rgba(59,130,246,0.35)";
  }
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const remove = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const pushToast = useCallback(
    (t: Omit<ToastItem, "id">) => {
      const id =
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random()}`;

      const toast: ToastItem = {
        id,
        durationMs: t.durationMs ?? 5200,
        ...t,
      };

      setToasts((prev) => {
        // keep last 4 toasts max (optional)
        const next = [...prev, toast];
        return next.length > 4 ? next.slice(next.length - 4) : next;
      });

      window.setTimeout(() => remove(id), toast.durationMs);
    },
    [remove]
  );

  const api = useMemo<ToastContextValue>(
    () => ({
      pushToast,
      success: (message, title) =>
        pushToast({ message, title, variant: "success" }),
      error: (message, title) =>
        pushToast({ message, title, variant: "error" }),
      info: (message, title) => pushToast({ message, title, variant: "info" }),
    }),
    [pushToast]
  );

  return (
    <ToastContext.Provider value={api}>
      {children}

      <div
        style={{
          position: "fixed",
          right: 16,
          top: 16,
          zIndex: 9999,
          display: "grid",
          gap: 10,
          width: "min(420px, calc(100vw - 32px))",
        }}
        aria-live="polite"
        aria-relevant="additions removals"
      >
        <AnimatePresence initial={false}>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.98 }}
              transition={{ type: "spring", damping: 20, stiffness: 260 }}
              style={{
                borderRadius: 16,
                border: `1px solid ${accentBorder(t.variant)}`,
                background: "rgba(20,20,20,0.92)",
                boxShadow: "0 18px 45px rgba(0,0,0,0.35)",
                overflow: "hidden",
              }}
            >
              <div style={{ display: "flex", gap: 12, padding: 12 }}>
                <div
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 12,
                    display: "grid",
                    placeItems: "center",
                    background: accentBg(t.variant),
                    border: `1px solid ${accentBorder(t.variant)}`,
                    color: "white",
                    flex: "0 0 auto",
                  }}
                >
                  {icon(t.variant)}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  {t.title && (
                    <div
                      style={{
                        fontWeight: 800,
                        color: "white",
                        marginBottom: 2,
                      }}
                    >
                      {t.title}
                    </div>
                  )}
                  <div
                    style={{
                      color: "rgba(255,255,255,0.85)",
                      lineHeight: 1.35,
                    }}
                  >
                    {t.message}
                  </div>
                </div>

                <button
                  onClick={() => remove(t.id)}
                  type="button"
                  aria-label="Close toast"
                  style={{
                    border: "none",
                    background: "transparent",
                    color: "rgba(255,255,255,0.8)",
                    cursor: "pointer",
                    padding: 4,
                    flex: "0 0 auto",
                  }}
                >
                  <X size={18} />
                </button>
              </div>

              {t.actions?.length ? (
                <div
                  style={{
                    display: "flex",
                    gap: 8,
                    padding: "0 12px 12px 58px", // ✅ zelfde layout + netjes uitlijnen
                  }}
                >
                  {t.actions.map((a, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        // ✅ action uitvoeren en toast sluiten
                        try {
                          a.onClick();
                        } finally {
                          remove(t.id);
                        }
                      }}
                      style={{
                        padding: "8px 10px",
                        borderRadius: 10,
                        border: "1px solid rgba(255,255,255,0.14)",
                        background: "rgba(255,255,255,0.06)",
                        color: "white",
                        cursor: "pointer",
                        fontWeight: 700,
                      }}
                    >
                      {a.label}
                    </button>
                  ))}
                </div>
              ) : null}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within <ToastProvider>");
  return ctx;
}
