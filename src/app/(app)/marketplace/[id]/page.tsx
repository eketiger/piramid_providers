"use client";

import { useRouter } from "next/navigation";
import {
  Button,
  Icon,
  Pill,
} from "@/components/ui/primitives";
import { PROVIDER, VERTICALS } from "@/lib/mock-data";

export default function MarketplaceProfilePage() {
  const router = useRouter();

  return (
    <div className="page-body">
      <Button variant="ghost" icon="arrow-left" onClick={() => router.push("/marketplace")}>
        Volver al marketplace
      </Button>

      <div
        style={{
          marginTop: 16,
          borderRadius: 16,
          padding: 32,
          background: "#141414",
          color: "#EDE7DA",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            right: -120,
            top: -80,
            width: 340,
            height: 340,
            background:
              "radial-gradient(circle, rgba(245,137,58,0.35), transparent 65%)",
          }}
        />
        <div className="eyebrow" style={{ color: "var(--accent)" }}>
          Proveedor verificado
        </div>
        <div
          className="display"
          style={{
            fontFamily: "Archivo Black",
            fontSize: 44,
            marginTop: 10,
            lineHeight: 1,
            textTransform: "uppercase",
          }}
        >
          {PROVIDER.nombre}
        </div>
        <div style={{ fontSize: 14, color: "#B8B8B8", marginTop: 14, maxWidth: 560 }}>
          {PROVIDER.descripcion}
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 18, flexWrap: "wrap" }}>
          <Pill variant="accent">
            <Icon name="shield-check" size={11} />
            SLA {PROVIDER.cumplimientoSLA}%
          </Pill>
          <Pill variant="accent">
            <Icon name="star" size={11} />
            Score {PROVIDER.score.toFixed(1)}
          </Pill>
          <Pill variant="accent">
            <Icon name="clock" size={11} />
            Resp. {PROVIDER.tiempoRespuesta}
          </Pill>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.2fr 1fr",
          gap: 16,
          marginTop: 16,
        }}
      >
        <div className="card card-pad">
          <div className="eyebrow" style={{ marginBottom: 12 }}>
            Vertical y categorías
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 14 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 10,
                background: "var(--accent-wash)",
                color: "var(--accent-ink)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icon name={VERTICALS[PROVIDER.verticalPrimario].icon} size={20} />
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>
                {VERTICALS[PROVIDER.verticalPrimario].label}
              </div>
              <div style={{ fontSize: 12, color: "var(--fg3)" }}>Vertical primario</div>
            </div>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {PROVIDER.categorias.map((c) => (
              <Pill key={c} variant="accent">
                {c}
              </Pill>
            ))}
            {PROVIDER.productos.map((p) => (
              <Pill key={p} variant="ghost">
                {p}
              </Pill>
            ))}
          </div>
          <div className="divider" />
          <div className="eyebrow" style={{ marginBottom: 10 }}>
            Cobertura
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {PROVIDER.cobertura.map((c) => (
              <Pill key={c} variant="ghost">
                <Icon name="map-pin" size={11} />
                {c}
              </Pill>
            ))}
          </div>
        </div>

        <div className="card card-pad">
          <div className="eyebrow" style={{ marginBottom: 10 }}>
            Certificaciones
          </div>
          {PROVIDER.certificaciones.map((c, i) => (
            <div
              key={c}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 0",
                borderTop: i > 0 ? "1px solid var(--border)" : "none",
              }}
            >
              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 6,
                  background: "var(--accent-wash)",
                  color: "var(--accent)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon name="badge-check" size={15} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{c}</div>
                <div style={{ fontSize: 11, color: "var(--fg3)" }}>Verificada</div>
              </div>
            </div>
          ))}
          <div className="divider" />
          <div className="eyebrow" style={{ marginBottom: 8 }}>
            Horario
          </div>
          <div style={{ fontSize: 13, color: "var(--fg2)" }}>{PROVIDER.horarios}</div>
        </div>
      </div>
    </div>
  );
}
