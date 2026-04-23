"use client";

import * as React from "react";
import { notFound, useRouter } from "next/navigation";
import {
  Avatar,
  Button,
  EmptyState,
  EstadoBadge,
  Icon,
  IconButton,
  InfoRow,
  Pill,
  SlaMeter,
  Table,
  Tabs,
} from "@/components/ui/primitives";
import type { Column } from "@/components/ui/primitives";
import { ORDERS, VISITS, makeActivity, type Order } from "@/lib/mock-data";
import { money } from "@/lib/format";

type Props = { params: Promise<{ id: string }> };

export default function OrderDetailPage({ params }: Props) {
  const { id } = React.use(params);
  const order = ORDERS.find((o) => o.id === id);
  if (!order) notFound();
  return <OrderDetail order={order} />;
}

function OrderDetail({ order }: { order: Order }) {
  const router = useRouter();
  const [tab, setTab] = React.useState("detalle");
  const activity = React.useMemo(() => makeActivity(order.id), [order.id]);

  return (
    <div className="page-body" style={{ maxWidth: 1400 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 14,
        }}
      >
        <Button variant="ghost" icon="arrow-left" onClick={() => router.push("/ordenes")}>
          Volver a órdenes
        </Button>
        <span className="mono" style={{ fontSize: 12, color: "var(--fg3)" }}>
          {order.id}
        </span>
        {order.retrabajo && <Pill variant="danger">Retrabajo</Pill>}
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: 20,
          marginBottom: 20,
          flexWrap: "wrap",
        }}
      >
        <div style={{ flex: 1, minWidth: 300 }}>
          <h2
            style={{
              fontSize: 24,
              fontWeight: 600,
              letterSpacing: "-0.01em",
              margin: 0,
            }}
          >
            {order.titulo}
          </h2>
          <div
            style={{
              display: "flex",
              gap: 12,
              marginTop: 8,
              fontSize: 13,
              color: "var(--fg2)",
              flexWrap: "wrap",
            }}
          >
            <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
              <Icon name="building-2" size={13} />
              {order.empresa}
            </span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
              <Icon name="user" size={13} />
              {order.cliente}
            </span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
              <Icon name="map-pin" size={13} />
              {order.direccion}
            </span>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <Button variant="ghost" icon="message-square">
            Mensaje
          </Button>
          <Button variant="ghost" icon="phone">
            Contacto
          </Button>
          <Button variant="accent" icon="calendar-plus">
            Agendar visita
          </Button>
        </div>
      </div>

      <div className="card card-pad" style={{ marginBottom: 16 }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "auto 2fr 1fr 1fr 1fr",
            gap: 20,
            alignItems: "center",
          }}
        >
          <div>
            <div className="eyebrow">Estado</div>
            <div style={{ marginTop: 6 }}>
              <EstadoBadge estado={order.estado} size="lg" />
            </div>
          </div>
          <div>
            <div className="eyebrow">Progreso por etapa</div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                marginTop: 10,
              }}
            >
              {order.sla.etapas.map((e, i) => (
                <React.Fragment key={i}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      flex: e.done ? 0 : 1,
                    }}
                  >
                    <div
                      style={{
                        width: 22,
                        height: 22,
                        borderRadius: 999,
                        flexShrink: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: e.done
                          ? "var(--success)"
                          : e.pct > 0
                            ? "var(--accent)"
                            : "#EFECE1",
                        color: e.done || e.pct > 0 ? "#fff" : "var(--fg3)",
                        fontSize: 11,
                        fontWeight: 600,
                      }}
                    >
                      {e.done ? <Icon name="check" size={11} strokeWidth={3} /> : i + 1}
                    </div>
                    <span
                      style={{
                        fontSize: 12,
                        color: e.done || e.pct > 0 ? "var(--fg1)" : "var(--fg3)",
                        fontWeight: e.pct > 0 && !e.done ? 600 : 400,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {e.nombre}
                    </span>
                  </div>
                  {i < order.sla.etapas.length - 1 && (
                    <div
                      style={{
                        flex: 1,
                        height: 2,
                        background: e.done ? "var(--success)" : "#EFECE1",
                      }}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
          <div>
            <div className="eyebrow">SLA actual</div>
            <div style={{ marginTop: 8 }}>
              <SlaMeter pct={order.sla.pct} horasRestantes={order.sla.horasRestantes} />
            </div>
          </div>
          <div>
            <div className="eyebrow">Prioridad</div>
            <div style={{ marginTop: 6 }}>
              <Pill
                variant={
                  order.prioridad === "urgente"
                    ? "danger"
                    : order.prioridad === "alta"
                      ? "warning"
                      : "ghost"
                }
                dot
              >
                {order.prioridad}
              </Pill>
            </div>
          </div>
          <div>
            <div className="eyebrow">Monto</div>
            <div style={{ fontSize: 20, fontWeight: 600, marginTop: 4 }} className="mono">
              {money(order.monto)}
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: 16 }}>
        <Tabs
          value={tab}
          onChange={setTab}
          tabs={[
            { key: "detalle", label: "Detalle", icon: "info" },
            { key: "actividad", label: "Actividad", icon: "activity", count: activity.length },
            { key: "novedades", label: "Novedades", icon: "bell", count: 3 },
            { key: "reportes", label: "Reportes", icon: "file-text", count: 4 },
            { key: "facturas", label: "Facturas", icon: "receipt", count: 1 },
            { key: "visitas", label: "Visitas", icon: "calendar", count: 2 },
          ]}
        />
      </div>

      {tab === "detalle" && <DetalleTab order={order} />}
      {tab === "actividad" && <ActividadTab activity={activity} />}
      {tab === "novedades" && <NovedadesTab />}
      {tab === "reportes" && <ReportesTab />}
      {tab === "facturas" && <FacturasTab order={order} />}
      {tab === "visitas" && <VisitasTab order={order} />}
    </div>
  );
}

function DetalleTab({ order }: { order: Order }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
      <div className="card card-pad">
        <div className="eyebrow" style={{ marginBottom: 12 }}>
          Información del servicio
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <InfoRow icon="tag" label="Tipo" value={order.tipo} />
          <InfoRow icon="briefcase" label="Vertical" value={order.verticalLabel} />
          <InfoRow icon="calendar" label="Inicio" value={order.fechaInicio} />
          <InfoRow icon="calendar-check-2" label="Fin planificado" value={order.fechaFin} />
          <InfoRow icon="flag" label="Prioridad" value={order.prioridad} />
          <InfoRow icon="rotate-ccw" label="¿Retrabajo?" value={order.retrabajo ? "Sí" : "No"} />
        </div>
        <div className="divider" />
        <div className="eyebrow" style={{ marginBottom: 12 }}>
          Cliente
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <InfoRow icon="user" label="Nombre" value={order.cliente} />
          <InfoRow icon="phone" label="Teléfono" value={order.clienteTel} />
          <InfoRow icon="map-pin" label="Dirección" value={order.direccion} />
        </div>
      </div>

      <div className="card card-pad">
        <div className="eyebrow" style={{ marginBottom: 12 }}>
          Descripción y alcance
        </div>
        <p style={{ fontSize: 13, color: "var(--fg2)", lineHeight: 1.55 }}>
          Servicio originado por denuncia del asegurado. Se requiere diagnóstico inicial en sitio,
          presupuesto desglosado por mano de obra y repuestos, ejecución dentro del plazo acordado
          y entrega de informe final con fotos antes/después.
        </p>
        <div className="divider" />
        <div className="eyebrow" style={{ marginBottom: 10 }}>
          Condiciones comerciales
        </div>
        <ul
          style={{
            margin: 0,
            paddingLeft: 18,
            fontSize: 13,
            color: "var(--fg2)",
            lineHeight: 1.8,
          }}
        >
          <li>Presupuesto válido por 15 días corridos</li>
          <li>Plazo máximo de diagnóstico: 48h hábiles</li>
          <li>Garantía mano de obra: 90 días</li>
          <li>Pago a 30 días de factura conformada</li>
        </ul>
      </div>
    </div>
  );
}

function ActividadTab({
  activity,
}: {
  activity: { icon: string; titulo: string; detalle: string; actor: string; tiempo: string }[];
}) {
  return (
    <div className="card card-pad">
      <div style={{ position: "relative", paddingLeft: 28 }}>
        <div
          style={{
            position: "absolute",
            left: 11,
            top: 8,
            bottom: 8,
            width: 2,
            background: "var(--border)",
          }}
        />
        {activity.map((a, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              gap: 14,
              marginBottom: 20,
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                left: -22,
                top: 2,
                width: 24,
                height: 24,
                borderRadius: 999,
                background: "#fff",
                border: "2px solid var(--border)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icon name={a.icon} size={11} style={{ color: "var(--fg2)" }} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13.5, fontWeight: 500 }}>{a.titulo}</div>
              <div
                style={{
                  fontSize: 12.5,
                  color: "var(--fg2)",
                  marginTop: 3,
                  lineHeight: 1.5,
                }}
              >
                {a.detalle}
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: "var(--fg3)",
                  marginTop: 4,
                  display: "flex",
                  gap: 6,
                  alignItems: "center",
                }}
              >
                <Avatar name={a.actor} size={16} />
                <span>{a.actor}</span>
                <span>·</span>
                <span className="mono">{a.tiempo}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function NovedadesTab() {
  const items = [
    {
      titulo: "Observación del tramitador",
      body:
        "Por favor adjuntar foto del daño en detalle del compresor antes de confirmar presupuesto.",
      actor: "E. Niefeld",
      tiempo: "Hace 1h",
      critico: true,
    },
    {
      titulo: "Cliente confirmó visita",
      body: "El asegurado confirma disponibilidad para el jueves 10:30.",
      actor: "Sistema",
      tiempo: "Hace 3h",
      critico: false,
    },
    {
      titulo: "Recordatorio SLA",
      body: "Resta 22h para cargar el presupuesto dentro del SLA comprometido.",
      actor: "Sistema",
      tiempo: "Hace 5h",
      critico: false,
    },
  ];
  return (
    <div className="card">
      {items.map((n, i) => (
        <div
          key={i}
          style={{
            padding: "16px 20px",
            borderTop: i > 0 ? "1px solid var(--border)" : "none",
            display: "flex",
            gap: 12,
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: n.critico ? "var(--warning-wash)" : "var(--neutral-wash)",
              color: n.critico ? "var(--warning)" : "var(--fg2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon name={n.critico ? "alert-triangle" : "info"} size={14} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13.5, fontWeight: 500 }}>{n.titulo}</div>
            <div style={{ fontSize: 12.5, color: "var(--fg2)", marginTop: 4 }}>{n.body}</div>
            <div style={{ fontSize: 11, color: "var(--fg3)", marginTop: 6 }}>
              {n.actor} · {n.tiempo}
            </div>
          </div>
          <Button size="sm" variant="ghost">
            Responder
          </Button>
        </div>
      ))}
    </div>
  );
}

function ReportesTab() {
  const files = [
    { id: 1, nombre: "diagnostico-inicial.pdf", tipo: "pdf" as const, tam: "1.2 MB", fecha: "20/04/2026", estado: "aprobado", ronda: 1 },
    { id: 2, nombre: "foto-daño-01.jpg", tipo: "image" as const, tam: "3.8 MB", fecha: "20/04/2026", estado: "aprobado", ronda: 1 },
    { id: 3, nombre: "foto-daño-02.jpg", tipo: "image" as const, tam: "2.1 MB", fecha: "20/04/2026", estado: "aprobado", ronda: 1 },
    { id: 4, nombre: "presupuesto-v2.pdf", tipo: "pdf" as const, tam: "480 KB", fecha: "21/04/2026", estado: "pendiente", ronda: 2 },
  ];
  return (
    <div className="card">
      <div className="card-head">
        <div className="card-title">Archivos cargados</div>
        <div style={{ display: "flex", gap: 8 }}>
          <Pill variant="info">Ronda 2 de revisión</Pill>
          <Button size="sm" variant="accent" icon="upload">
            Subir archivo
          </Button>
        </div>
      </div>
      <Table
        columns={[
          {
            header: "Archivo",
            render: (r) => (
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 6,
                    background: r.tipo === "pdf" ? "var(--danger-wash)" : "var(--info-wash)",
                    color: r.tipo === "pdf" ? "var(--danger)" : "var(--info)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Icon name={r.tipo === "pdf" ? "file-text" : "image"} size={14} />
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{r.nombre}</div>
                  <div style={{ fontSize: 11, color: "var(--fg3)" }}>{r.tam}</div>
                </div>
              </div>
            ),
          },
          { header: "Tipo", render: (r) => (r.tipo === "pdf" ? "Documento" : "Imagen"), style: { width: 110 } },
          { header: "Ronda", render: (r) => `Ronda ${r.ronda}`, style: { width: 90 } },
          {
            header: "Subido",
            render: (r) => (
              <span className="mono" style={{ color: "var(--fg2)" }}>
                {r.fecha}
              </span>
            ),
            style: { width: 110 },
          },
          {
            header: "Estado",
            render: (r) => (
              <EstadoBadge
                estado={{
                  key: r.estado,
                  label: r.estado,
                  variant: r.estado === "aprobado" ? "success" : "warning",
                }}
              />
            ),
            style: { width: 150 },
          },
          {
            header: "",
            render: () => (
              <div style={{ display: "flex", gap: 4 }}>
                <IconButton icon="eye" title="Ver" />
                <IconButton icon="download" title="Descargar" />
                <IconButton icon="trash-2" title="Eliminar" />
              </div>
            ),
            style: { width: 120 },
          },
        ]}
        rows={files}
      />
    </div>
  );
}

type Invoice = { id: number; tipo: string; num: string; fecha: string; monto: number; estado: string; variant: "success" | "warning" };

function FacturasTab({ order }: { order: Order }) {
  const rows: Invoice[] = [
    { id: 1, tipo: "Presupuesto", num: "PRES-4521", fecha: "19/04/2026", monto: order.monto * 0.4, estado: "Aprobado", variant: "success" },
    { id: 2, tipo: "Factura A", num: "A-0001-00012345", fecha: "—", monto: order.monto, estado: "Pendiente de emisión", variant: "warning" },
  ];
  const cols: Column<Invoice>[] = [
    { header: "Tipo", render: (r) => r.tipo, style: { width: 120 } },
    { header: "Número", render: (r) => <span className="mono">{r.num}</span>, style: { width: 160 } },
    { header: "Fecha", render: (r) => <span className="mono">{r.fecha}</span>, style: { width: 120 } },
    {
      header: "Monto",
      render: (r) => (
        <span className="mono" style={{ fontWeight: 500 }}>
          {money(r.monto)}
        </span>
      ),
      style: { width: 140, textAlign: "right" },
      cellStyle: { textAlign: "right" },
    },
    {
      header: "Estado",
      render: (r) => <EstadoBadge estado={{ key: r.estado, label: r.estado, variant: r.variant }} />,
      style: { width: 170 },
    },
    {
      header: "",
      render: () => (
        <Button size="sm" variant="ghost" icon="download">
          PDF
        </Button>
      ),
      style: { width: 110 },
    },
  ];
  return (
    <div className="card">
      <div className="card-head">
        <div className="card-title">Documentos comerciales</div>
        <Button variant="accent" size="sm" icon="upload">
          Subir factura
        </Button>
      </div>
      <Table<Invoice> columns={cols} rows={rows} />
    </div>
  );
}

function VisitasTab({ order }: { order: Order }) {
  const visits = VISITS.filter(
    (v) => v.ordenId === order.id || v.ordenId.endsWith(order.id.slice(-2)),
  ).slice(0, 5);
  return (
    <div className="card">
      <div className="card-head">
        <div className="card-title">Visitas de esta orden</div>
        <Button variant="accent" size="sm" icon="calendar-plus">
          Nueva visita
        </Button>
      </div>
      {visits.length === 0 ? (
        <EmptyState
          icon="calendar"
          title="Sin visitas agendadas"
          body="Creá una visita para coordinar con el cliente."
        />
      ) : (
        <Table
          columns={[
            {
              header: "Fecha",
              render: (r) => (
                <span className="mono">
                  {r.fecha} {r.hora}
                </span>
              ),
              style: { width: 160 },
            },
            { header: "Motivo", render: (r) => r.motivo, style: { width: 180 } },
            { header: "Duración", render: (r) => `${r.duracion} min`, style: { width: 100 } },
            { header: "Técnico", render: (r) => r.tecnico, style: { width: 160 } },
            {
              header: "Estado",
              render: (r) => (
                <Pill
                  variant={
                    r.estado === "realizada"
                      ? "success"
                      : r.estado === "agendada"
                        ? "info"
                        : r.estado === "en_curso"
                          ? "warning"
                          : "ghost"
                  }
                >
                  {r.estado}
                </Pill>
              ),
            },
            {
              header: "Comentarios",
              render: (r) => <span style={{ color: "var(--fg2)" }}>{r.comentarios || "—"}</span>,
            },
          ]}
          rows={visits}
        />
      )}
    </div>
  );
}
