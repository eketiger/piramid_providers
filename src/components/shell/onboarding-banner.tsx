"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button, Icon, IconButton } from "@/components/ui/primitives";

export function OnboardingBanner() {
  const [hidden, setHidden] = React.useState(false);
  const router = useRouter();
  if (hidden) return null;

  const bars = [
    { label: "Datos", done: true, note: false },
    { label: "Servicios", done: true, note: false },
    { label: "Cobertura", done: true, note: false },
    { label: "Documentos", done: true, note: true },
    { label: "Aprobación", done: false, note: false },
  ];

  return (
    <div
      style={{
        margin: "14px 32px 0",
        padding: "14px 18px",
        background: "linear-gradient(96deg, #141414 0%, #1E1E1E 100%)",
        color: "#EDE7DA",
        borderRadius: 12,
        display: "flex",
        alignItems: "center",
        gap: 16,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          right: -20,
          top: -30,
          width: 160,
          height: 160,
          background:
            "radial-gradient(circle, rgba(245,137,58,0.28), transparent 65%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          width: 38,
          height: 38,
          borderRadius: 10,
          background: "rgba(245,137,58,0.14)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--accent)",
          flexShrink: 0,
        }}
      >
        <Icon name="clock" size={16} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 10, flexWrap: "wrap" }}>
          <div style={{ fontSize: 13, fontWeight: 600 }}>Onboarding en revisión</div>
          <div style={{ fontSize: 12, color: "#B8B8B8" }}>
            4 de 5 completados · falta aprobación de marca Samsung
          </div>
        </div>
        <div style={{ display: "flex", gap: 4, marginTop: 8 }}>
          {bars.map((b, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                height: 4,
                borderRadius: 999,
                background: b.done
                  ? b.note
                    ? "var(--warning)"
                    : "var(--success)"
                  : "rgba(237,231,218,0.15)",
              }}
            />
          ))}
        </div>
      </div>
      <Button
        variant="accent"
        size="sm"
        iconRight="arrow-right"
        onClick={() => router.push("/cuenta")}
      >
        Ver estado
      </Button>
      <IconButton icon="x" onClick={() => setHidden(true)} title="Ocultar" />
    </div>
  );
}
