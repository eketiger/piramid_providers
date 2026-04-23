"use client";

import * as React from "react";
import { notFound, useRouter } from "next/navigation";
import { Button, EstadoBadge, Icon, Pill, SlaMeter, Tabs } from "@/components/ui";
import { ORDERS, makeActivity, type Order } from "@/data/fixtures";
import { money } from "@/lib/format";
import { DetalleTab } from "./_tabs/detalle-tab";
import { ActividadTab } from "./_tabs/actividad-tab";
import { NovedadesTab } from "./_tabs/novedades-tab";
import { ReportesTab } from "./_tabs/reportes-tab";
import { FacturasTab } from "./_tabs/facturas-tab";
import { VisitasTab } from "./_tabs/visitas-tab";

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
      <div className="mb-3.5 flex items-center gap-3">
        <Button variant="ghost" icon="arrow-left" onClick={() => router.push("/ordenes")}>
          Volver a órdenes
        </Button>
        <span className="mono text-xs" style={{ color: "var(--fg3)" }}>
          {order.id}
        </span>
        {order.retrabajo && <Pill variant="danger">Retrabajo</Pill>}
      </div>

      <div className="mb-5 flex flex-wrap items-start gap-5">
        <div className="min-w-[300px] flex-1">
          <h2 className="m-0 text-2xl font-semibold tracking-tight">{order.titulo}</h2>
          <div className="mt-2 flex flex-wrap gap-3 text-[13px]" style={{ color: "var(--fg2)" }}>
            <span className="inline-flex items-center gap-1.5">
              <Icon name="building-2" size={13} />
              {order.empresa}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Icon name="user" size={13} />
              {order.cliente}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Icon name="map-pin" size={13} />
              {order.direccion}
            </span>
          </div>
        </div>
        <div className="flex gap-2">
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

      <div className="card card-pad mb-4">
        <div
          className="grid items-center gap-5"
          style={{ gridTemplateColumns: "auto 2fr 1fr 1fr 1fr" }}
        >
          <div>
            <div className="eyebrow">Estado</div>
            <div className="mt-1.5">
              <EstadoBadge estado={order.estado} size="lg" />
            </div>
          </div>
          <div>
            <div className="eyebrow">Progreso por etapa</div>
            <div className="mt-2.5 flex items-center gap-1">
              {order.sla.etapas.map((e, i) => (
                <React.Fragment key={i}>
                  <div className="flex items-center gap-1.5" style={{ flex: e.done ? 0 : 1 }}>
                    <div
                      className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full text-[11px] font-semibold"
                      style={{
                        background: e.done
                          ? "var(--success)"
                          : e.pct > 0
                            ? "var(--accent)"
                            : "#EFECE1",
                        color: e.done || e.pct > 0 ? "#fff" : "var(--fg3)",
                      }}
                    >
                      {e.done ? <Icon name="check" size={11} strokeWidth={3} /> : i + 1}
                    </div>
                    <span
                      className="text-xs whitespace-nowrap"
                      style={{
                        color: e.done || e.pct > 0 ? "var(--fg1)" : "var(--fg3)",
                        fontWeight: e.pct > 0 && !e.done ? 600 : 400,
                      }}
                    >
                      {e.nombre}
                    </span>
                  </div>
                  {i < order.sla.etapas.length - 1 && (
                    <div
                      className="h-[2px] flex-1"
                      style={{ background: e.done ? "var(--success)" : "#EFECE1" }}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
          <div>
            <div className="eyebrow">SLA actual</div>
            <div className="mt-2">
              <SlaMeter pct={order.sla.pct} horasRestantes={order.sla.horasRestantes} />
            </div>
          </div>
          <div>
            <div className="eyebrow">Prioridad</div>
            <div className="mt-1.5">
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
            <div className="mono mt-1 text-xl font-semibold">{money(order.monto)}</div>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <Tabs
          value={tab}
          onChange={setTab}
          ariaLabel="Secciones de la orden"
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
