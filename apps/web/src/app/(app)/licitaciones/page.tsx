"use client";

import * as React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Button,
  Drawer,
  EstadoBadge,
  Field,
  Icon,
  InfoRow,
  SearchInput,
  SlaMeter,
  Table,
  Tabs,
} from "@/components/ui";
import type { Column } from "@/components/ui";
import { BIDS, ESTADOS_LIC, VERTICALS, type Bid } from "@/data/fixtures";
import { money } from "@/lib/format";

export default function Page() {
  return (
    <React.Suspense fallback={<div className="page-body" />}>
      <LicitacionesPage />
    </React.Suspense>
  );
}

function LicitacionesPage() {
  const router = useRouter();
  const params = useSearchParams();
  const [search, setSearch] = React.useState("");
  const [vertical, setVertical] = React.useState("");
  const [estado, setEstado] = React.useState("");
  const [tab, setTab] = React.useState("todas");

  const openId = params.get("id");
  const openBid = openId ? BIDS.find((b) => b.id === openId) : null;

  const filtered = BIDS.filter((b) => {
    if (tab === "abiertas" && b.estado.key !== "abierta") return false;
    if (tab === "cotizadas" && b.estado.key !== "cotizada") return false;
    if (tab === "adjudicadas" && b.estado.key !== "adjudicada") return false;
    if (vertical && b.vertical !== vertical) return false;
    if (estado && b.estado.key !== estado) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!`${b.id} ${b.titulo} ${b.empresa} ${b.cliente}`.toLowerCase().includes(q))
        return false;
    }
    return true;
  });

  const tabs = [
    { key: "todas", label: "Todas", count: BIDS.length },
    { key: "abiertas", label: "Abiertas", count: BIDS.filter((b) => b.estado.key === "abierta").length },
    { key: "cotizadas", label: "Cotizadas", count: BIDS.filter((b) => b.estado.key === "cotizada").length },
    { key: "adjudicadas", label: "Adjudicadas", count: BIDS.filter((b) => b.estado.key === "adjudicada").length },
  ];

  const openDrawer = (b: Bid) => {
    const sp = new URLSearchParams(params.toString());
    sp.set("id", b.id);
    router.push(`/licitaciones?${sp.toString()}`);
  };
  const closeDrawer = () => {
    const sp = new URLSearchParams(params.toString());
    sp.delete("id");
    router.push(`/licitaciones${sp.toString() ? `?${sp.toString()}` : ""}`);
  };

  const columns: Column<Bid>[] = [
    {
      header: "Código",
      render: (r) => (
        <span className="mono" style={{ fontSize: 12, color: "var(--fg2)" }}>
          {r.id}
        </span>
      ),
      style: { width: 140 },
    },
    {
      header: "Licitación",
      render: (r) => (
        <div>
          <div style={{ fontWeight: 500, fontSize: 13 }}>{r.titulo}</div>
          <div
            style={{
              fontSize: 11.5,
              color: "var(--fg3)",
              marginTop: 2,
              display: "flex",
              gap: 6,
              alignItems: "center",
            }}
          >
            <Icon name={VERTICALS[r.vertical].icon} size={11} />
            {r.categoria} · {r.ciudad}
          </div>
        </div>
      ),
    },
    {
      header: "Empresa",
      render: (r) => <span style={{ color: "var(--fg2)" }}>{r.empresa}</span>,
      style: { width: 160 },
    },
    {
      header: "Estado",
      render: (r) => <EstadoBadge estado={r.estado} />,
      style: { width: 150 },
    },
    {
      header: "SLA",
      render: (r) => <SlaMeter pct={r.sla.pct} horasRestantes={r.sla.horasRestantes} compact />,
      style: { width: 160 },
    },
    {
      header: "Registro",
      render: (r) => (
        <span className="mono" style={{ fontSize: 12, color: "var(--fg2)" }}>
          {r.fechaRegistro}
        </span>
      ),
      style: { width: 100 },
    },
    {
      header: "Límite",
      render: (r) => (
        <span className="mono" style={{ fontSize: 12, color: "var(--fg2)" }}>
          {r.fechaLimite}
        </span>
      ),
      style: { width: 100 },
    },
    {
      header: "",
      render: () => <Icon name="chevron-right" size={14} style={{ color: "var(--fg4)" }} />,
      style: { width: 30 },
    },
  ];

  return (
    <div className="page-body">
      <div style={{ marginBottom: 14 }}>
        <Tabs tabs={tabs} value={tab} onChange={setTab} />
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          flexWrap: "wrap",
          marginBottom: 14,
        }}
      >
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Buscar por ID, título, cliente o empresa…"
          width={340}
        />
        <select
          className="select"
          value={vertical}
          onChange={(e) => setVertical(e.target.value)}
          style={{ width: 180 }}
        >
          <option value="">Todas las verticales</option>
          {Object.entries(VERTICALS).map(([k, v]) => (
            <option key={k} value={k}>
              {v.label}
            </option>
          ))}
        </select>
        <select
          className="select"
          value={estado}
          onChange={(e) => setEstado(e.target.value)}
          style={{ width: 180 }}
        >
          <option value="">Todos los estados</option>
          {ESTADOS_LIC.map((e) => (
            <option key={e.key} value={e.key}>
              {e.label}
            </option>
          ))}
        </select>
        <Button variant="ghost" size="sm" icon="sliders-horizontal">
          Más filtros
        </Button>
        <span style={{ flex: 1 }} />
        <Button variant="ghost" size="sm" icon="download">
          Exportar
        </Button>
      </div>

      <Table<Bid>
        columns={columns}
        rows={filtered.slice(0, 30)}
        onRowClick={openDrawer}
        selectedId={openId ?? undefined}
        empty={{
          icon: "gavel",
          title: "No hay licitaciones",
          body: "Probá ajustar los filtros o limpiar la búsqueda.",
        }}
      />

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 14,
          fontSize: 12,
          color: "var(--fg3)",
        }}
      >
        <div>
          Mostrando {Math.min(30, filtered.length)} de {filtered.length} resultados
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          <Button variant="ghost" size="sm" icon="chevron-left" disabled>
            Anterior
          </Button>
          <Button variant="ghost" size="sm" iconRight="chevron-right">
            Siguiente
          </Button>
        </div>
      </div>

      {openBid && <BidDrawer bid={openBid} onClose={closeDrawer} />}
    </div>
  );
}

function BidDrawer({ bid, onClose }: { bid: Bid; onClose: () => void }) {
  const [mano, setMano] = React.useState(120000);
  const [rep, setRep] = React.useState(85000);
  const [plazo, setPlazo] = React.useState("3-5 días");
  const [obs, setObs] = React.useState("");
  const total = (mano || 0) + (rep || 0);

  return (
    <Drawer
      title={bid.titulo}
      subtitle={
        <span className="mono">
          {bid.id} · {bid.empresa}
        </span>
      }
      onClose={onClose}
      width={640}
      foot={
        <>
          <Button variant="ghost" onClick={onClose}>
            Rechazar
          </Button>
          <Button variant="ghost" icon="bookmark">
            Guardar borrador
          </Button>
          <Button variant="accent" icon="send" onClick={onClose}>
            Enviar cotización {money(total)}
          </Button>
        </>
      }
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div
            style={{
              padding: 14,
              background: "#FBFAF5",
              borderRadius: 10,
              border: "1px solid var(--border)",
            }}
          >
            <div className="eyebrow">SLA cotización</div>
            <div style={{ marginTop: 10 }}>
              <SlaMeter pct={bid.sla.pct} horasRestantes={bid.sla.horasRestantes} />
            </div>
          </div>
          <div
            style={{
              padding: 14,
              background: "#FBFAF5",
              borderRadius: 10,
              border: "1px solid var(--border)",
            }}
          >
            <div className="eyebrow">Competencia</div>
            <div style={{ fontSize: 22, fontWeight: 600, marginTop: 8 }} className="mono">
              {bid.competidores}
            </div>
            <div style={{ fontSize: 11.5, color: "var(--fg3)" }}>
              proveedores cotizando
            </div>
          </div>
        </div>

        <div>
          <div className="eyebrow" style={{ marginBottom: 8 }}>
            Detalle
          </div>
          <div
            style={{
              fontSize: 13,
              color: "var(--fg2)",
              lineHeight: 1.55,
              marginBottom: 16,
            }}
          >
            {bid.descripcion}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <InfoRow icon="user" label="Cliente" value={bid.cliente} />
            <InfoRow icon="map-pin" label="Ubicación" value={bid.ciudad} />
            <InfoRow icon="tag" label="Categoría" value={bid.categoria} />
            <InfoRow
              icon="calendar"
              label="Fecha registro"
              value={`${bid.fechaRegistro} ${bid.fechaRegistroHora}`}
            />
            <InfoRow icon="clock" label="Fecha límite cotización" value={bid.fechaLimite} />
            <InfoRow icon="timer" label="Plazo esperado ejecución" value={bid.tiempoEstimado} />
          </div>
          <div style={{ marginTop: 14, display: "flex", gap: 8, flexWrap: "wrap" }}>
            {bid.adjuntos.map((a, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "7px 11px",
                  background: "#FBFAF5",
                  border: "1px solid var(--border)",
                  borderRadius: 8,
                  fontSize: 12,
                }}
              >
                <Icon name={a.tipo === "pdf" ? "file-text" : "image"} size={13} />
                <span>{a.nombre}</span>
                <Icon
                  name="download"
                  size={12}
                  style={{ color: "var(--fg3)", cursor: "pointer" }}
                />
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="eyebrow" style={{ marginBottom: 12 }}>
            Tu cotización
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 14,
              marginBottom: 14,
            }}
          >
            <Field label="Mano de obra" required>
              <input
                className="input mono"
                type="number"
                value={mano}
                onChange={(e) => setMano(+e.target.value)}
              />
            </Field>
            <Field label="Repuestos / insumos" required>
              <input
                className="input mono"
                type="number"
                value={rep}
                onChange={(e) => setRep(+e.target.value)}
              />
            </Field>
          </div>
          <div style={{ marginBottom: 14 }}>
            <Field label="Plazo comprometido" required>
              <select
                className="select"
                value={plazo}
                onChange={(e) => setPlazo(e.target.value)}
              >
                <option>1-2 días</option>
                <option>3-5 días</option>
                <option>5-7 días</option>
                <option>7-10 días</option>
              </select>
            </Field>
          </div>
          <Field label="Observaciones" hint="Visible para el tramitador">
            <textarea
              className="textarea"
              value={obs}
              onChange={(e) => setObs(e.target.value)}
              placeholder="Notas, condiciones, garantías…"
              rows={3}
            />
          </Field>
        </div>

        <div
          style={{
            padding: "16px 18px",
            background: "var(--accent-wash)",
            borderRadius: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              fontSize: 13,
              color: "var(--accent-ink)",
              fontWeight: 500,
            }}
          >
            Total a cotizar
          </div>
          <div
            style={{ fontSize: 22, fontWeight: 600, color: "var(--accent-ink)" }}
            className="mono"
          >
            {money(total)}
          </div>
        </div>
      </div>
    </Drawer>
  );
}
