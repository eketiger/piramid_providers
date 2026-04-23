"use client";

import * as React from "react";
import {
  Button,
  EmptyState,
  IconButton,
  Pill,
  Switch,
} from "@/components/ui/primitives";
import { VISITS } from "@/lib/mock-data";

export default function AgendaPage() {
  const [view, setView] = React.useState<"dia" | "semana" | "mes">("mes");
  const [month, setMonth] = React.useState(3);
  const [dayIdx, setDayIdx] = React.useState(22);
  const [weekStart, setWeekStart] = React.useState(20);
  const [availableOn, setAvailableOn] = React.useState(true);
  const year = 2026;
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthName = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ][month];

  const visitsByDay: Record<number, typeof VISITS> = {};
  VISITS.forEach((v) => {
    const d = parseInt(v.fecha.split("-")[2]);
    if (!visitsByDay[d]) visitsByDay[d] = [];
    visitsByDay[d].push(v);
  });

  const onPrev = () => {
    if (view === "mes") setMonth((m) => Math.max(0, m - 1));
    else if (view === "semana") setWeekStart((w) => Math.max(1, w - 7));
    else setDayIdx((d) => Math.max(1, d - 1));
  };
  const onNext = () => {
    if (view === "mes") setMonth((m) => Math.min(11, m + 1));
    else if (view === "semana") setWeekStart((w) => Math.min(daysInMonth - 6, w + 7));
    else setDayIdx((d) => Math.min(daysInMonth, d + 1));
  };
  const onToday = () => {
    setMonth(3);
    setDayIdx(22);
    setWeekStart(20);
  };

  const headerLabel = () => {
    if (view === "mes") return `${monthName} ${year}`;
    if (view === "semana")
      return `${weekStart} – ${Math.min(weekStart + 6, daysInMonth)} ${monthName.toLowerCase()}`;
    return `${
      ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"][new Date(year, month, dayIdx).getDay()]
    } ${dayIdx} ${monthName.toLowerCase()}`;
  };

  return (
    <div className="page-body">
      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 16 }}>
        <div className="card">
          <div className="card-head">
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <IconButton icon="chevron-left" onClick={onPrev} />
              <div style={{ fontSize: 16, fontWeight: 600, minWidth: 180 }}>{headerLabel()}</div>
              <IconButton icon="chevron-right" onClick={onNext} />
              <Button size="sm" variant="ghost" onClick={onToday}>
                Hoy
              </Button>
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <div
                style={{
                  display: "inline-flex",
                  background: "var(--neutral-wash)",
                  borderRadius: 8,
                  padding: 3,
                  gap: 2,
                }}
              >
                {(["dia", "semana", "mes"] as const).map((v) => (
                  <button
                    key={v}
                    onClick={() => setView(v)}
                    data-state={view === v ? "active" : "inactive"}
                    className="tabs-trigger"
                    style={{
                      height: 28,
                      padding: "0 12px",
                      fontSize: 12.5,
                      textTransform: "capitalize",
                    }}
                  >
                    {v === "dia" ? "Día" : v}
                  </button>
                ))}
              </div>
              <Button variant="accent" size="sm" icon="plus">
                Nueva visita
              </Button>
            </div>
          </div>

          {view === "mes" && (
            <div style={{ padding: 16 }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(7, 1fr)",
                  gap: 1,
                  background: "var(--border)",
                }}
              >
                {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map((d) => (
                  <div
                    key={d}
                    style={{
                      padding: "8px",
                      background: "#FBFAF5",
                      fontSize: 11,
                      color: "var(--fg3)",
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                      fontWeight: 500,
                    }}
                  >
                    {d}
                  </div>
                ))}
                {Array.from({ length: firstDay }).map((_, i) => (
                  <div key={`e${i}`} style={{ minHeight: 96, background: "#FAFAF7" }} />
                ))}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1;
                  const visits = visitsByDay[day] || [];
                  const isToday = day === 22 && month === 3;
                  return (
                    <button
                      key={day}
                      onClick={() => {
                        setDayIdx(day);
                        setView("dia");
                      }}
                      style={{
                        all: "unset",
                        cursor: "pointer",
                        minHeight: 96,
                        background: "#fff",
                        padding: 6,
                        display: "flex",
                        flexDirection: "column",
                        gap: 3,
                      }}
                    >
                      <div
                        style={{
                          fontSize: 12,
                          fontWeight: isToday ? 600 : 500,
                          color: isToday ? "#fff" : "var(--fg1)",
                          background: isToday ? "var(--accent)" : "transparent",
                          borderRadius: isToday ? 999 : 0,
                          width: isToday ? 22 : "auto",
                          height: isToday ? 22 : "auto",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {day}
                      </div>
                      {visits.slice(0, 3).map((v, k) => (
                        <div
                          key={k}
                          style={{
                            fontSize: 10.5,
                            padding: "2px 5px",
                            borderRadius: 3,
                            background:
                              v.estado === "realizada"
                                ? "var(--success-wash)"
                                : v.estado === "en_curso"
                                  ? "var(--warning-wash)"
                                  : "var(--info-wash)",
                            color:
                              v.estado === "realizada"
                                ? "#1E7A48"
                                : v.estado === "en_curso"
                                  ? "#936507"
                                  : "#1F5999",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {v.hora} {v.cliente.split(" ")[0]}
                        </div>
                      ))}
                      {visits.length > 3 && (
                        <div style={{ fontSize: 10, color: "var(--fg3)" }}>
                          +{visits.length - 3} más
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {view === "semana" && (
            <div style={{ padding: 16 }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "60px repeat(7, 1fr)",
                  gap: 1,
                  background: "var(--border)",
                }}
              >
                <div style={{ background: "#FBFAF5", padding: "8px" }} />
                {Array.from({ length: 7 }).map((_, i) => {
                  const d = weekStart + i;
                  if (d > daysInMonth) return <div key={i} style={{ background: "#FAFAF7" }} />;
                  const dayName = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"][
                    new Date(year, month, d).getDay()
                  ];
                  const isToday = d === 22 && month === 3;
                  return (
                    <div
                      key={i}
                      style={{ background: "#FBFAF5", padding: "8px", textAlign: "center" }}
                    >
                      <div
                        style={{
                          fontSize: 10,
                          color: "var(--fg3)",
                          textTransform: "uppercase",
                          letterSpacing: "0.06em",
                        }}
                      >
                        {dayName}
                      </div>
                      <div
                        style={{
                          fontSize: 15,
                          fontWeight: isToday ? 600 : 500,
                          color: isToday ? "var(--accent)" : "var(--fg1)",
                          marginTop: 2,
                        }}
                      >
                        {d}
                      </div>
                    </div>
                  );
                })}
                {[8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18].map((h) => (
                  <React.Fragment key={h}>
                    <div
                      style={{
                        background: "#FBFAF5",
                        padding: "8px",
                        fontSize: 11,
                        color: "var(--fg3)",
                        textAlign: "right",
                      }}
                    >
                      {h}:00
                    </div>
                    {Array.from({ length: 7 }).map((_, i) => {
                      const d = weekStart + i;
                      const visits = (visitsByDay[d] || []).filter(
                        (v) => parseInt(v.hora) === h,
                      );
                      return (
                        <div
                          key={i}
                          style={{
                            minHeight: 54,
                            background: "#fff",
                            padding: 3,
                            display: "flex",
                            flexDirection: "column",
                            gap: 2,
                          }}
                        >
                          {visits.map((v, k) => (
                            <div
                              key={k}
                              style={{
                                fontSize: 10.5,
                                padding: "4px 6px",
                                borderRadius: 4,
                                background: "var(--info-wash)",
                                color: "#1F5999",
                              }}
                            >
                              <div style={{ fontWeight: 600 }}>{v.hora}</div>
                              <div
                                style={{
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {v.motivo}
                              </div>
                            </div>
                          ))}
                        </div>
                      );
                    })}
                  </React.Fragment>
                ))}
              </div>
            </div>
          )}

          {view === "dia" && (
            <div style={{ padding: 16 }}>
              {(visitsByDay[dayIdx] || []).length === 0 && (
                <EmptyState
                  icon="calendar"
                  title="Sin visitas"
                  body="No hay visitas agendadas para este día"
                  action={
                    <Button variant="accent" size="sm" icon="plus">
                      Agendar
                    </Button>
                  }
                />
              )}
              {(visitsByDay[dayIdx] || []).length > 0 && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 1,
                    background: "var(--border)",
                    borderRadius: 10,
                    overflow: "hidden",
                    border: "1px solid var(--border)",
                  }}
                >
                  {[7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19].map((h) => {
                    const visits = (visitsByDay[dayIdx] || []).filter(
                      (v) => parseInt(v.hora) === h,
                    );
                    return (
                      <div
                        key={h}
                        style={{
                          display: "grid",
                          gridTemplateColumns: "80px 1fr",
                          background: "#fff",
                          minHeight: 60,
                        }}
                      >
                        <div
                          style={{
                            padding: "10px 14px",
                            fontSize: 12,
                            color: "var(--fg3)",
                            borderRight: "1px solid var(--border)",
                            background: "#FBFAF5",
                          }}
                          className="mono"
                        >
                          {h}:00
                        </div>
                        <div
                          style={{
                            padding: 8,
                            display: "flex",
                            flexDirection: "column",
                            gap: 6,
                          }}
                        >
                          {visits.map((v, k) => (
                            <div
                              key={k}
                              style={{
                                padding: "8px 12px",
                                borderRadius: 8,
                                background: "var(--info-wash)",
                                color: "#1F5999",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                              }}
                            >
                              <div>
                                <div style={{ fontSize: 13, fontWeight: 600 }}>
                                  {v.hora} · {v.motivo}
                                </div>
                                <div
                                  style={{
                                    fontSize: 11.5,
                                    marginTop: 2,
                                    color: "var(--fg2)",
                                  }}
                                >
                                  {v.cliente} · {v.direccion}
                                </div>
                              </div>
                              <Pill
                                variant={v.estado === "agendada" ? "info" : "ghost"}
                                size="sm"
                              >
                                {v.estado}
                              </Pill>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="card card-pad">
            <div className="eyebrow" style={{ marginBottom: 10 }}>
              Hoy · 22 abril
            </div>
            {VISITS.filter((v) => v.fecha.endsWith("-22"))
              .slice(0, 4)
              .map((v, i) => (
                <div
                  key={i}
                  style={{
                    padding: "10px 0",
                    borderTop: i > 0 ? "1px solid var(--border)" : "none",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span
                      className="mono"
                      style={{ fontSize: 12, color: "var(--fg1)", fontWeight: 600 }}
                    >
                      {v.hora}
                    </span>
                    <Pill
                      variant={v.estado === "agendada" ? "info" : "ghost"}
                      size="sm"
                    >
                      {v.estado}
                    </Pill>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 500, marginTop: 4 }}>
                    {v.motivo} — {v.cliente}
                  </div>
                  <div style={{ fontSize: 11.5, color: "var(--fg3)" }}>{v.direccion}</div>
                </div>
              ))}
          </div>

          <div className="card card-pad">
            <div className="eyebrow" style={{ marginBottom: 10 }}>
              Disponibilidad
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 8,
              }}
            >
              <span style={{ fontSize: 13 }}>Aceptar nuevas órdenes</span>
              <Switch checked={availableOn} onChange={setAvailableOn} />
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 8,
              }}
            >
              <span style={{ fontSize: 13 }}>Vacaciones / inactividad</span>
              <Button variant="ghost" size="sm" icon="calendar-x">
                Configurar
              </Button>
            </div>
            <div style={{ fontSize: 12, color: "var(--fg3)", marginTop: 8 }}>
              Última actualización: hace 2 días
            </div>
          </div>

          <div className="card card-pad">
            <div className="eyebrow" style={{ marginBottom: 8 }}>
              Próximos 7 días
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {Array.from({ length: 7 }).map((_, i) => {
                const count = (i * 3 + 2) % 6;
                return (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "6px 0",
                    }}
                  >
                    <span style={{ fontSize: 12, color: "var(--fg2)" }}>
                      {["Lun 23", "Mar 24", "Mié 25", "Jue 26", "Vie 27", "Sáb 28", "Dom 29"][i]}
                    </span>
                    <div style={{ display: "flex", gap: 2, flex: 1, marginLeft: 12 }}>
                      {Array.from({ length: count }).map((_, k) => (
                        <div
                          key={k}
                          style={{
                            width: 6,
                            height: 14,
                            background: "var(--accent)",
                            borderRadius: 2,
                            opacity: 0.3 + k * 0.15,
                          }}
                        />
                      ))}
                    </div>
                    <span
                      className="mono"
                      style={{
                        fontSize: 12,
                        color: "var(--fg3)",
                        minWidth: 40,
                        textAlign: "right",
                      }}
                    >
                      {count} visitas
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

