"use client";

import { Avatar, Button, Icon, Pill } from "@/components/ui";
import { PROVIDER } from "@/data/fixtures";

export default function ScorecardPage() {
  const monthData = [82, 85, 88, 90, 87, 89, 91, 93, 92, 94, 94, 96];
  const months = [
    "May",
    "Jun",
    "Jul",
    "Ago",
    "Sep",
    "Oct",
    "Nov",
    "Dic",
    "Ene",
    "Feb",
    "Mar",
    "Abr",
  ];
  const breakdowns = [
    { label: "Aceptación de órdenes", value: 98, unit: "%", benchmark: "≥ 90%" },
    { label: "Respuesta a licitaciones", value: 87, unit: "%", benchmark: "≥ 80%" },
    { label: "Cumplimiento SLA global", value: 94, unit: "%", benchmark: "≥ 90%" },
    { label: "Tiempo promedio diagnóstico", value: 1.4, unit: "días", benchmark: "≤ 2 días" },
    { label: "Retrabajos", value: 2.1, unit: "%", benchmark: "≤ 5%" },
    { label: "Satisfacción cliente", value: 4.8, unit: "/5", benchmark: "≥ 4.2" },
  ];
  const maxM = Math.max(...monthData);

  return (
    <div className="page-body">
      <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 16, marginBottom: 16 }}>
        <div className="card card-pad" style={{ display: "flex", gap: 24, alignItems: "center" }}>
          <div style={{ position: "relative", width: 140, height: 140, flexShrink: 0 }}>
            <svg width="140" height="140" viewBox="0 0 140 140">
              <circle cx="70" cy="70" r="58" fill="none" stroke="#EFECE1" strokeWidth="12" />
              <circle
                cx="70"
                cy="70"
                r="58"
                fill="none"
                stroke="var(--accent)"
                strokeWidth="12"
                strokeDasharray={`${Math.PI * 2 * 58 * 0.94} ${Math.PI * 2 * 58}`}
                strokeDashoffset={Math.PI * 2 * 58 * 0.25}
                transform="rotate(-90 70 70)"
                strokeLinecap="round"
              />
            </svg>
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                style={{ fontSize: 34, fontWeight: 600, letterSpacing: "-0.02em" }}
                className="mono"
              >
                4.7
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: "var(--fg3)",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                }}
              >
                de 5.0
              </div>
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <div className="eyebrow">Score general</div>
            <div style={{ fontSize: 20, fontWeight: 600, marginTop: 4 }}>Top 10% de la red</div>
            <div
              style={{
                fontSize: 13,
                color: "var(--fg2)",
                marginTop: 6,
                lineHeight: 1.5,
              }}
            >
              Tu performance está consistentemente por encima del promedio. Mantenelo así para
              acceder a licitaciones prioritarias.
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
              <Pill variant="success" dot>
                Cumplimiento SLA 94%
              </Pill>
              <Pill variant="success" dot>
                Satisfacción 4.8
              </Pill>
            </div>
          </div>
        </div>

        <div className="card card-pad">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 12,
            }}
          >
            <div>
              <div className="card-title">Cumplimiento SLA · 12 meses</div>
              <div className="card-sub">Meta interna ≥ 90%</div>
            </div>
            <Pill variant="success">+12 pts vs hace 1 año</Pill>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              gap: 6,
              height: 140,
              padding: "4px 0",
            }}
          >
            {monthData.map((v, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <div
                  style={{
                    width: "100%",
                    height: `${(v / maxM) * 110}px`,
                    background: i === monthData.length - 1 ? "var(--accent)" : "var(--fg1)",
                    opacity: i === monthData.length - 1 ? 1 : 0.2 + (i / monthData.length) * 0.8,
                    borderRadius: 4,
                  }}
                />
                <div style={{ fontSize: 10, color: "var(--fg3)" }}>{months[i]}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-head">
          <div className="card-title">Métricas operativas</div>
          <Button variant="ghost" size="sm" icon="download">
            Exportar
          </Button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 0 }}>
          {breakdowns.map((b, i) => (
            <div
              key={i}
              style={{
                padding: "18px 20px",
                borderRight: (i + 1) % 3 !== 0 ? "1px solid var(--border)" : "none",
                borderBottom: i < 3 ? "1px solid var(--border)" : "none",
              }}
            >
              <div className="eyebrow">{b.label}</div>
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: 6,
                  marginTop: 6,
                }}
              >
                <span
                  style={{ fontSize: 28, fontWeight: 600, letterSpacing: "-0.02em" }}
                  className="mono"
                >
                  {b.value}
                </span>
                <span style={{ fontSize: 13, color: "var(--fg3)" }}>{b.unit}</span>
              </div>
              <div
                style={{
                  fontSize: 11.5,
                  color: "var(--fg3)",
                  marginTop: 6,
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <Icon name="target" size={11} /> Meta {b.benchmark}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div className="card">
          <div className="card-head">
            <div className="card-title">Opiniones recientes</div>
          </div>
          <div>
            {[
              {
                autor: "María López",
                score: 5,
                orden: "ORD-20265012",
                texto: "Llegaron puntuales, diagnosticaron rápido. Muy prolijos.",
                fecha: "18/04/2026",
              },
              {
                autor: "Juan Pérez",
                score: 5,
                orden: "ORD-20265009",
                texto: "Excelente comunicación. Resolvieron en una sola visita.",
                fecha: "15/04/2026",
              },
              {
                autor: "Carolina E.",
                score: 4,
                orden: "ORD-20265004",
                texto: "Buen servicio. Demoraron un poco con el repuesto.",
                fecha: "11/04/2026",
              },
            ].map((r, i) => (
              <div
                key={i}
                style={{
                  padding: "14px 20px",
                  borderTop: i > 0 ? "1px solid var(--border)" : "none",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <Avatar name={r.autor} size={28} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>{r.autor}</div>
                    <div style={{ fontSize: 11, color: "var(--fg3)" }} className="mono">
                      {r.orden} · {r.fecha}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 1 }}>
                    {Array.from({ length: 5 }).map((_, k) => (
                      <Icon
                        key={k}
                        name="star"
                        size={13}
                        style={{ color: k < r.score ? "var(--warning)" : "var(--fg4)" }}
                      />
                    ))}
                  </div>
                </div>
                <div
                  style={{
                    fontSize: 13,
                    color: "var(--fg2)",
                    marginTop: 8,
                    lineHeight: 1.5,
                  }}
                >
                  {r.texto}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="card">
          <div className="card-head">
            <div className="card-title">Certificaciones</div>
          </div>
          <div style={{ padding: "8px 8px 12px" }}>
            {PROVIDER.certificaciones.map((c, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "10px 12px",
                  borderRadius: 8,
                }}
              >
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 6,
                    background: "var(--accent-wash)",
                    color: "var(--accent)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Icon name="badge-check" size={16} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{c}</div>
                  <div style={{ fontSize: 11, color: "var(--fg3)" }}>Verificada</div>
                </div>
                <Button variant="ghost" size="sm">
                  Ver
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
