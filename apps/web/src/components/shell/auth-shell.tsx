import { PiramidMark } from "./logo";

export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        background: "var(--bg-app)",
      }}
    >
      <div style={{ padding: "48px 56px", display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 64 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: "#141414",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <PiramidMark size={18} />
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700 }}>Piramid</div>
            <div
              style={{
                fontSize: 10,
                color: "var(--fg3)",
                textTransform: "uppercase",
                letterSpacing: "0.14em",
              }}
            >
              Providers
            </div>
          </div>
        </div>
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            maxWidth: 380,
          }}
        >
          {children}
        </div>
        <div style={{ fontSize: 11, color: "var(--fg3)" }}>
          © 2026 Piramid by Ravel ·{" "}
          <a href="/legal/terms" style={{ color: "var(--fg2)" }}>Términos</a> ·{" "}
          <a href="/legal/privacy" style={{ color: "var(--fg2)" }}>Privacidad</a>
        </div>
      </div>
      <div
        style={{
          background: "#141414",
          color: "#EDE7DA",
          padding: 56,
          position: "relative",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
        }}
      >
        <div
          style={{
            position: "absolute",
            right: -80,
            top: -80,
            width: 400,
            height: 400,
            background:
              "radial-gradient(circle, rgba(245,137,58,0.35), transparent 65%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: -40,
            bottom: -60,
            width: 260,
            height: 260,
            background:
              "radial-gradient(circle, rgba(245,137,58,0.15), transparent 60%)",
          }}
        />
        <div style={{ position: "relative" }}>
          <div className="eyebrow" style={{ color: "var(--accent)" }}>
            Providers Platform
          </div>
          <h1
            className="display"
            style={{
              fontFamily: "Archivo Black",
              fontSize: 56,
              margin: "16px 0",
              lineHeight: 0.95,
              textTransform: "uppercase",
              letterSpacing: "-0.01em",
            }}
          >
            La operación
            <br />
            del proveedor,
            <br />
            en una sola
            <br />
            plataforma.
          </h1>
          <div
            style={{
              fontSize: 14,
              color: "#B8B8B8",
              maxWidth: 420,
              lineHeight: 1.6,
            }}
          >
            Cotizá, ejecutá y cobrá sin fricciones. Seguí tus SLAs, tu score y tu reputación en la
            red de asistencias más grande del país.
          </div>
        </div>
      </div>
    </div>
  );
}
