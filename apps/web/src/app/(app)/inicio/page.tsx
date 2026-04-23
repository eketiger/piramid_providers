"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Button,
  EstadoBadge,
  Icon,
  IconButton,
  Pill,
  SlaMeter,
  Stat,
} from "@/components/ui";
import { BIDS, NOTIFS, ORDERS, VERTICALS, VISITS } from "@/data/fixtures";

export default function InicioPage() {
  const router = useRouter();
  const pendingBids = BIDS.filter((b) => b.estado.key === "abierta").slice(0, 5);
  const activeOrders = ORDERS.filter(
    (o) => !["finalizada", "facturada", "rechazada"].includes(o.estado.key),
  ).slice(0, 6);
  const todayVisits = VISITS.slice(0, 4);

  return (
    <div className="page-body">
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr 1fr",
          gap: 12,
          marginBottom: 20,
        }}
      >
        <Stat
          label="Licitaciones abiertas"
          value="8"
          delta={{ dir: "up", label: "+3 esta semana" }}
          icon="gavel"
          accent="var(--accent)"
        />
        <Stat
          label="Órdenes en curso"
          value="12"
          delta={{ dir: "flat", label: "4 con visita hoy" }}
          icon="clipboard-list"
        />
        <Stat
          label="SLA cumplimiento"
          value="94%"
          delta={{ dir: "up", label: "+2 pts" }}
          hint="últimos 30 días"
          icon="shield-check"
          accent="var(--success)"
        />
        <Stat
          label="Score"
          value="4.7"
          delta={{ dir: "up", label: "Top 10%" }}
          hint="de 5.0"
          icon="star"
          accent="var(--warning)"
        />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 16 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="card">
            <div className="card-head">
              <div>
                <div className="card-title">Licitaciones esperando respuesta</div>
                <div className="card-sub">Cotizá dentro del SLA para no perder la oportunidad</div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                iconRight="arrow-right"
                onClick={() => router.push("/licitaciones")}
              >
                Ver todas
              </Button>
            </div>
            <div>
              {pendingBids.map((b, i) => (
                <Link
                  key={b.id}
                  href={`/licitaciones?id=${b.id}`}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "auto 1fr auto auto",
                    alignItems: "center",
                    gap: 14,
                    padding: "12px 20px",
                    borderTop: i > 0 ? "1px solid var(--border)" : "none",
                    cursor: "pointer",
                    color: "inherit",
                  }}
                >
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 8,
                      background: "var(--accent-wash)",
                      color: "var(--accent-ink)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Icon name={VERTICALS[b.vertical].icon} size={16} />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: 13.5,
                        fontWeight: 500,
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                      }}
                    >
                      <span className="mono" style={{ color: "var(--fg3)", fontSize: 11.5 }}>
                        {b.id}
                      </span>
                      <span
                        style={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {b.titulo}
                      </span>
                    </div>
                    <div style={{ fontSize: 11.5, color: "var(--fg3)", marginTop: 2 }}>
                      {b.empresa} · {b.ciudad}
                    </div>
                  </div>
                  <div style={{ minWidth: 130 }}>
                    <SlaMeter pct={b.sla.pct} horasRestantes={b.sla.horasRestantes} compact />
                  </div>
                  <Button size="sm" variant="accent" icon="send">
                    Cotizar
                  </Button>
                </Link>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="card-head">
              <div>
                <div className="card-title">Órdenes en curso</div>
                <div className="card-sub">Progreso por etapa</div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                iconRight="arrow-right"
                onClick={() => router.push("/ordenes")}
              >
                Ver todas
              </Button>
            </div>
            <div style={{ padding: "6px 8px 12px" }}>
              <table className="tbl" style={{ fontSize: 12.5 }}>
                <thead>
                  <tr>
                    <th>ID · tipo</th>
                    <th>Empresa</th>
                    <th>Estado</th>
                    <th>Etapa</th>
                    <th style={{ width: 150 }}>SLA</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {activeOrders.map((o) => (
                    <tr
                      key={o.id}
                      onClick={() => router.push(`/ordenes/${o.id}`)}
                    >
                      <td>
                        <div style={{ fontWeight: 500 }}>{o.titulo}</div>
                        <div style={{ fontSize: 11, color: "var(--fg3)" }} className="mono">
                          {o.id}
                        </div>
                      </td>
                      <td style={{ color: "var(--fg2)" }}>{o.empresa}</td>
                      <td>
                        <EstadoBadge estado={o.estado} />
                      </td>
                      <td style={{ color: "var(--fg2)" }}>{o.sla.etapa}</td>
                      <td>
                        <SlaMeter pct={o.sla.pct} horasRestantes={o.sla.horasRestantes} compact />
                      </td>
                      <td>
                        <Icon name="chevron-right" size={13} style={{ color: "var(--fg4)" }} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="card">
            <div className="card-head">
              <div>
                <div className="card-title">Visitas de hoy</div>
                <div className="card-sub">Mar 22 abr · {todayVisits.length} agendadas</div>
              </div>
              <IconButton icon="calendar" onClick={() => router.push("/agenda")} />
            </div>
            <div style={{ padding: "4px 0 4px" }}>
              {todayVisits.map((v, i) => (
                <div
                  key={v.id}
                  style={{
                    display: "flex",
                    gap: 12,
                    padding: "10px 20px",
                    borderTop: i > 0 ? "1px solid var(--border)" : "none",
                  }}
                >
                  <div style={{ width: 44, textAlign: "center" }} className="mono">
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{v.hora}</div>
                    <div style={{ fontSize: 10, color: "var(--fg3)" }}>{v.duracion}&apos;</div>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>
                      {v.motivo} · {v.cliente}
                    </div>
                    <div
                      style={{
                        fontSize: 11.5,
                        color: "var(--fg3)",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {v.direccion}
                    </div>
                    <div style={{ marginTop: 4, display: "flex", gap: 6 }}>
                      <Pill
                        variant={
                          v.estado === "agendada"
                            ? "info"
                            : v.estado === "en_curso"
                              ? "warning"
                              : "ghost"
                        }
                      >
                        {v.estado}
                      </Pill>
                      <span style={{ fontSize: 11, color: "var(--fg3)" }} className="mono">
                        {v.ordenId}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="card-head">
              <div className="card-title">Novedades</div>
              <IconButton icon="bell" onClick={() => router.push("/notificaciones")} />
            </div>
            <div>
              {NOTIFS.slice(0, 5).map((n, i) => (
                <div
                  key={n.id}
                  style={{
                    display: "flex",
                    gap: 12,
                    padding: "12px 20px",
                    borderTop: i > 0 ? "1px solid var(--border)" : "none",
                  }}
                >
                  <div
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: 8,
                      background: n.critico ? "var(--danger-wash)" : "var(--neutral-wash)",
                      color: n.critico ? "var(--danger)" : "var(--fg2)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Icon name={n.icon} size={14} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 500,
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                      }}
                    >
                      {n.titulo}
                      {!n.leido && (
                        <span
                          style={{
                            width: 6,
                            height: 6,
                            borderRadius: 999,
                            background: "var(--accent)",
                          }}
                        />
                      )}
                    </div>
                    <div style={{ fontSize: 12, color: "var(--fg3)", marginTop: 2 }}>
                      {n.detalle}
                    </div>
                    <div style={{ fontSize: 11, color: "var(--fg4)", marginTop: 4 }}>
                      {n.tiempo}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
