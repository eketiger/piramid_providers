"use client";

import * as React from "react";
import Link from "next/link";
import { Button, Icon, Pill, SearchInput } from "@/components/ui";
import { VERTICALS } from "@/data/fixtures";

type Provider = {
  id: string;
  nombre: string;
  vertical: keyof typeof VERTICALS;
  ciudad: string;
  score: number;
  sla: number;
  respuesta: string;
  volumen: number;
  cert: string[];
  tag?: "destacado" | "nuevo";
};

const PROVIDERS: Provider[] = [
  {
    id: "prv-1",
    nombre: "Técnica Austral S.R.L.",
    vertical: "hogar",
    ciudad: "CABA + GBA Norte",
    score: 4.7,
    sla: 94,
    respuesta: "00:27",
    volumen: 127,
    cert: ["Samsung", "BGH"],
    tag: "destacado",
  },
  {
    id: "prv-2",
    nombre: "Frío Patagonia",
    vertical: "hogar",
    ciudad: "CABA + GBA Sur",
    score: 4.6,
    sla: 92,
    respuesta: "00:34",
    volumen: 94,
    cert: ["Whirlpool"],
    tag: "nuevo",
  },
  {
    id: "prv-3",
    nombre: "Taller Centro",
    vertical: "taller",
    ciudad: "CABA",
    score: 4.5,
    sla: 90,
    respuesta: "01:12",
    volumen: 58,
    cert: ["VW oficial"],
  },
  {
    id: "prv-4",
    nombre: "Asistencia Médica ARG",
    vertical: "medico",
    ciudad: "CABA + GBA",
    score: 4.8,
    sla: 96,
    respuesta: "00:18",
    volumen: 202,
    cert: ["OSDE", "Swiss"],
  },
  {
    id: "prv-5",
    nombre: "LogExpress",
    vertical: "logistica",
    ciudad: "AMBA",
    score: 4.4,
    sla: 88,
    respuesta: "00:45",
    volumen: 310,
    cert: [],
  },
  {
    id: "prv-6",
    nombre: "Clima Norte",
    vertical: "hogar",
    ciudad: "GBA Norte",
    score: 4.5,
    sla: 91,
    respuesta: "00:41",
    volumen: 71,
    cert: ["Samsung"],
  },
];

export default function MarketplacePage() {
  const [search, setSearch] = React.useState("");
  const [vertical, setVertical] = React.useState("");

  const filtered = PROVIDERS.filter((p) => {
    if (vertical && p.vertical !== vertical) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!`${p.nombre} ${p.ciudad}`.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  return (
    <div className="page-body">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          flexWrap: "wrap",
          marginBottom: 16,
        }}
      >
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Buscar proveedor o zona…"
          width={340}
        />
        <select
          className="select"
          value={vertical}
          onChange={(e) => setVertical(e.target.value)}
          style={{ width: 200 }}
        >
          <option value="">Todas las verticales</option>
          {Object.entries(VERTICALS).map(([k, v]) => (
            <option key={k} value={k}>
              {v.label}
            </option>
          ))}
        </select>
        <span style={{ flex: 1 }} />
        <Button variant="ghost" size="sm" icon="sliders-horizontal">
          Filtros
        </Button>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gap: 16,
        }}
      >
        {filtered.map((p) => (
          <Link
            key={p.id}
            href={`/marketplace/${p.id}`}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <div
              className="card card-pad"
              style={{ display: "flex", flexDirection: "column", gap: 12, cursor: "pointer" }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
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
                  <Icon name={VERTICALS[p.vertical].icon} size={20} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{p.nombre}</div>
                  <div style={{ fontSize: 12, color: "var(--fg3)" }}>
                    {VERTICALS[p.vertical].label} · {p.ciudad}
                  </div>
                </div>
                {p.tag === "destacado" && <Pill variant="accent">Destacado</Pill>}
                {p.tag === "nuevo" && <Pill variant="info">Nuevo</Pill>}
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr 1fr",
                  gap: 8,
                  padding: "10px 0 4px",
                  borderTop: "1px solid var(--border)",
                }}
              >
                <MetricMini label="Score" value={p.score.toFixed(1)} hint="/5" />
                <MetricMini label="SLA" value={`${p.sla}%`} />
                <MetricMini label="Resp." value={p.respuesta} />
                <MetricMini label="Órdenes" value={String(p.volumen)} />
              </div>

              {p.cert.length > 0 && (
                <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                  {p.cert.map((c) => (
                    <Pill key={c} variant="ghost">
                      <Icon name="badge-check" size={11} />
                      {c}
                    </Pill>
                  ))}
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function MetricMini({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div>
      <div
        style={{
          fontSize: 10,
          color: "var(--fg3)",
          textTransform: "uppercase",
          letterSpacing: "0.06em",
        }}
      >
        {label}
      </div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 2, marginTop: 2 }}>
        <span className="mono" style={{ fontSize: 15, fontWeight: 600 }}>
          {value}
        </span>
        {hint && <span style={{ fontSize: 10, color: "var(--fg3)" }}>{hint}</span>}
      </div>
    </div>
  );
}
