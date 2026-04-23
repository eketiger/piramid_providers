"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="es-AR">
      <body
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 24,
          background: "#F6F3EA",
          fontFamily:
            "Inter, ui-sans-serif, system-ui, sans-serif",
        }}
      >
        <div style={{ maxWidth: 420 }}>
          <h1 style={{ fontSize: 20, fontWeight: 600, margin: 0 }}>
            Algo salió mal
          </h1>
          <p style={{ fontSize: 13, color: "#8A857A", marginTop: 8 }}>
            Estamos al tanto. Podés reintentar o volver al inicio.
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              marginTop: 16,
              padding: "10px 16px",
              borderRadius: 8,
              background: "#F5893A",
              color: "#fff",
              border: "none",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Reintentar
          </button>
        </div>
      </body>
    </html>
  );
}
