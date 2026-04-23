"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  EstadoBadge,
  Icon,
  Pill,
  SearchInput,
  SlaMeter,
  Table,
  Tabs,
} from "@/components/ui/primitives";
import type { Column } from "@/components/ui/primitives";
import { ESTADOS_OR, ORDERS, VERTICALS, type Order } from "@/lib/mock-data";
import { money } from "@/lib/format";

export default function OrdenesPage() {
  const router = useRouter();
  const [search, setSearch] = React.useState("");
  const [vertical, setVertical] = React.useState("");
  const [estado, setEstado] = React.useState("");
  const [tab, setTab] = React.useState("activas");

  const filtered = ORDERS.filter((o) => {
    if (tab === "activas" && ["finalizada", "facturada", "rechazada"].includes(o.estado.key))
      return false;
    if (tab === "finalizadas" && !["finalizada", "facturada"].includes(o.estado.key)) return false;
    if (tab === "rechazadas" && o.estado.key !== "rechazada") return false;
    if (vertical && o.vertical !== vertical) return false;
    if (estado && o.estado.key !== estado) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!`${o.id} ${o.titulo} ${o.empresa} ${o.cliente}`.toLowerCase().includes(q))
        return false;
    }
    return true;
  });

  const tabs = [
    {
      key: "activas",
      label: "Activas",
      count: ORDERS.filter(
        (o) => !["finalizada", "facturada", "rechazada"].includes(o.estado.key),
      ).length,
    },
    { key: "todas", label: "Todas", count: ORDERS.length },
    {
      key: "finalizadas",
      label: "Finalizadas",
      count: ORDERS.filter((o) => ["finalizada", "facturada"].includes(o.estado.key)).length,
    },
    {
      key: "rechazadas",
      label: "Rechazadas",
      count: ORDERS.filter((o) => o.estado.key === "rechazada").length,
    },
  ];

  const columns: Column<Order>[] = [
    {
      header: "ID",
      render: (r) => (
        <span className="mono" style={{ fontSize: 12, color: "var(--fg2)" }}>
          {r.id}
        </span>
      ),
      style: { width: 140 },
    },
    {
      header: "Orden",
      render: (r) => (
        <div>
          <div
            style={{
              fontWeight: 500,
              fontSize: 13,
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            {r.titulo}
            {r.retrabajo && (
              <Pill variant="danger" size="sm">
                Retrabajo
              </Pill>
            )}
            {r.prioridad === "urgente" && <Pill variant="danger">Urgente</Pill>}
          </div>
          <div style={{ fontSize: 11.5, color: "var(--fg3)", marginTop: 2 }}>
            {r.cliente} · {r.tipo}
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
      style: { width: 180 },
    },
    {
      header: "Etapa",
      render: (r) => <span style={{ fontSize: 12, color: "var(--fg2)" }}>{r.sla.etapa}</span>,
      style: { width: 110 },
    },
    {
      header: "SLA",
      render: (r) => <SlaMeter pct={r.sla.pct} horasRestantes={r.sla.horasRestantes} compact />,
      style: { width: 160 },
    },
    {
      header: "Monto",
      render: (r) => (
        <span className="mono" style={{ fontWeight: 500 }}>
          {money(r.monto)}
        </span>
      ),
      style: { width: 120, textAlign: "right" },
      cellStyle: { textAlign: "right" },
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
          {ESTADOS_OR.map((e) => (
            <option key={e.key} value={e.key}>
              {e.label}
            </option>
          ))}
        </select>
        <Button variant="ghost" size="sm" icon="sliders-horizontal">
          Más filtros
        </Button>
        <span style={{ flex: 1 }} />
        <Button variant="ghost" size="sm" icon="calendar">
          Vista calendario
        </Button>
        <Button variant="ghost" size="sm" icon="download">
          Exportar
        </Button>
      </div>

      <Table<Order>
        columns={columns}
        rows={filtered.slice(0, 40)}
        onRowClick={(o) => router.push(`/ordenes/${o.id}`)}
        empty={{
          icon: "clipboard-list",
          title: "Sin órdenes",
          body: "Probá cambiar de pestaña o limpiar filtros.",
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
          Mostrando {Math.min(40, filtered.length)} de {filtered.length} resultados
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
    </div>
  );
}
