"use client";

import * as React from "react";
import { Button, EmptyState, Icon, IconButton, Pill } from "@/components/ui";
import { NOTIFS } from "@/data/fixtures";
import { cn } from "@/lib/cn";
import type { IconName } from "@/lib/icons";

type Filter = {
  k: string;
  label: string;
  icon: IconName;
  count?: number;
};

export default function NotificacionesPage() {
  const [filter, setFilter] = React.useState("todo");
  const filters: Filter[] = [
    { k: "todo", label: "Todo", icon: "inbox", count: NOTIFS.length },
    {
      k: "unread",
      label: "Sin leer",
      icon: "circle",
      count: NOTIFS.filter((n) => !n.leido).length,
    },
    { k: "bid", label: "Licitaciones", icon: "gavel" },
    { k: "order", label: "Órdenes", icon: "clipboard-list" },
    { k: "sla", label: "SLA", icon: "timer" },
    { k: "comment", label: "Comentarios", icon: "message-square" },
    { k: "doc", label: "Documentos", icon: "file-text" },
    { k: "invoice", label: "Facturas", icon: "receipt" },
    { k: "visit", label: "Visitas", icon: "calendar" },
  ];

  const filtered = NOTIFS.filter(
    (n) => filter === "todo" || (filter === "unread" && !n.leido) || filter === n.tipo,
  );

  return (
    <div className="page-body">
      <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
        <div style={{ width: 220, flexShrink: 0 }}>
          <div className="card" style={{ padding: 8 }}>
            {filters.map((f) => (
              <button
                key={f.k}
                onClick={() => setFilter(f.k)}
                className={cn("sidebar-filter")}
                style={{
                  all: "unset",
                  width: "100%",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "8px 10px",
                  borderRadius: 6,
                  background: filter === f.k ? "var(--bg-hover)" : "transparent",
                  color: filter === f.k ? "var(--fg1)" : "var(--fg2)",
                  fontSize: 13,
                  fontWeight: filter === f.k ? 500 : 400,
                }}
              >
                <Icon name={f.icon} size={14} />
                <span style={{ flex: 1 }}>{f.label}</span>
                {f.count !== undefined && (
                  <span style={{ fontSize: 11, color: "var(--fg3)" }}>{f.count}</span>
                )}
              </button>
            ))}
          </div>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="card">
            <div className="card-head">
              <div className="card-title">Centro de notificaciones</div>
              <div style={{ display: "flex", gap: 8 }}>
                <Button variant="ghost" size="sm" icon="check-check">
                  Marcar todo como leído
                </Button>
                <Button variant="ghost" size="sm" icon="settings-2">
                  Preferencias
                </Button>
              </div>
            </div>
            <div>
              {filtered.length === 0 ? (
                <EmptyState
                  icon="bell-off"
                  title="Todo al día"
                  body="No hay notificaciones en esta categoría."
                />
              ) : (
                filtered.map((n, i) => (
                  <div
                    key={n.id}
                    style={{
                      display: "flex",
                      gap: 14,
                      padding: "14px 20px",
                      borderTop: i > 0 ? "1px solid var(--border)" : "none",
                      background: !n.leido ? "#FFFBF3" : "transparent",
                    }}
                  >
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 8,
                        background: n.critico ? "var(--danger-wash)" : "var(--neutral-wash)",
                        color: n.critico ? "var(--danger)" : "var(--fg2)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <Icon name={n.icon} size={16} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 13.5, fontWeight: 500 }}>{n.titulo}</span>
                        {n.critico && <Pill variant="danger">Urgente</Pill>}
                        {!n.leido && (
                          <span
                            style={{
                              width: 7,
                              height: 7,
                              borderRadius: 999,
                              background: "var(--accent)",
                            }}
                          />
                        )}
                      </div>
                      <div
                        style={{
                          fontSize: 12.5,
                          color: "var(--fg2)",
                          marginTop: 3,
                        }}
                      >
                        {n.detalle}
                      </div>
                      <div
                        style={{
                          fontSize: 11.5,
                          color: "var(--fg3)",
                          marginTop: 4,
                        }}
                      >
                        {n.tiempo}
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 4, alignSelf: "center" }}>
                      <IconButton icon="arrow-up-right" title="Abrir" />
                      <IconButton icon="check" title="Marcar leído" />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
