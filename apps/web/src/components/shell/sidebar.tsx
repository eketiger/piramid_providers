"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Avatar, Icon, IconButton, Pill } from "@/components/ui";
import { PiramidMark } from "./logo";
import { NOTIFS, PROVIDER } from "@/data/fixtures";
import { cn } from "@/lib/cn";

import type { IconName } from "@/lib/icons";

type NavItem =
  | { type: "link"; key: string; href: string; label: string; icon: IconName; badge?: number }
  | { type: "section"; label: string };

function buildNav(unread: number): NavItem[] {
  return [
    { type: "link", key: "inicio", href: "/inicio", label: "Inicio", icon: "layout-dashboard" },
    { type: "section", label: "Operación" },
    {
      type: "link",
      key: "licitaciones",
      href: "/licitaciones",
      label: "Licitaciones",
      icon: "gavel",
      badge: 8,
    },
    {
      type: "link",
      key: "ordenes",
      href: "/ordenes",
      label: "Órdenes",
      icon: "clipboard-list",
      badge: 12,
    },
    {
      type: "link",
      key: "agenda",
      href: "/agenda",
      label: "Agenda y visitas",
      icon: "calendar-days",
    },
    {
      type: "link",
      key: "reportes",
      href: "/reportes",
      label: "Reportes y documentos",
      icon: "file-text",
    },
    { type: "section", label: "Red Piramid" },
    { type: "link", key: "marketplace", href: "/marketplace", label: "Marketplace", icon: "store" },
    {
      type: "link",
      key: "perfil-publico",
      href: "/marketplace/mi-ficha",
      label: "Mi ficha pública",
      icon: "globe",
    },
    { type: "section", label: "Proveedor" },
    { type: "link", key: "perfil", href: "/perfil", label: "Perfil operativo", icon: "building-2" },
    {
      type: "link",
      key: "scorecard",
      href: "/scorecard",
      label: "Performance",
      icon: "trending-up",
    },
    {
      type: "link",
      key: "notificaciones",
      href: "/notificaciones",
      label: "Notificaciones",
      icon: "bell",
      badge: unread,
    },
    { type: "section", label: "Cuenta" },
    { type: "link", key: "cuenta", href: "/cuenta", label: "Mi cuenta", icon: "user-cog" },
  ];
}

export function Sidebar() {
  const [collapsed, setCollapsed] = React.useState(false);
  const [orgOpen, setOrgOpen] = React.useState(false);
  const [userOpen, setUserOpen] = React.useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const unread = NOTIFS.filter((n) => !n.leido).length;
  const items = buildNav(unread);
  const w = collapsed ? 64 : 252;

  // Close menus on outside click
  React.useEffect(() => {
    if (!orgOpen && !userOpen) return;
    const onDoc = () => {
      setOrgOpen(false);
      setUserOpen(false);
    };
    const t = setTimeout(() => document.addEventListener("mousedown", onDoc), 0);
    return () => {
      clearTimeout(t);
      document.removeEventListener("mousedown", onDoc);
    };
  }, [orgOpen, userOpen]);

  return (
    <aside
      style={{
        width: w,
        background: "var(--bg-sidebar)",
        borderRight: "1px solid var(--border)",
        display: "flex",
        flexDirection: "column",
        position: "sticky",
        top: 0,
        height: "100vh",
        transition: "width 200ms var(--ease-out)",
        flexShrink: 0,
      }}
    >
      {/* Org header */}
      <div
        style={{
          padding: collapsed ? "14px 8px" : "14px 12px 10px",
          position: "relative",
        }}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div
          onClick={() => !collapsed && setOrgOpen((v) => !v)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "6px 8px",
            borderRadius: 8,
            cursor: collapsed ? "default" : "pointer",
            background: orgOpen ? "var(--bg-hover)" : "transparent",
            minHeight: 44,
          }}
        >
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: 8,
              background: "#141414",
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <PiramidMark size={16} />
          </div>
          {!collapsed && (
            <>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    letterSpacing: "-0.01em",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  Técnica Austral
                </div>
                <div
                  style={{
                    fontSize: 10.5,
                    color: "var(--fg3)",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                  }}
                >
                  Proveedor · Piramid
                </div>
              </div>
              <Icon name="chevrons-up-down" size={14} style={{ color: "var(--fg3)" }} />
            </>
          )}
        </div>

        {orgOpen && !collapsed && (
          <div className="menu" style={{ top: 64, left: 12, width: "calc(100% - 24px)" }}>
            <div className="menu-head">Tu cuenta</div>
            <div className="menu-item">
              <Avatar name={PROVIDER.nombre} size={24} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: 12.5,
                    fontWeight: 600,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {PROVIDER.nombre}
                </div>
                <div style={{ fontSize: 10.5, color: "var(--fg3)" }} className="mono">
                  CUIT {PROVIDER.cuit}
                </div>
              </div>
              <Icon name="check" size={13} strokeWidth={3} style={{ color: "var(--accent)" }} />
            </div>
            <div className="menu-sep" />
            <div className="menu-head">Cambiar de organización</div>
            <div className="menu-item muted" style={{ fontSize: 12 }}>
              Tu usuario solo opera una empresa.
            </div>
            <div className="menu-sep" />
            <div
              className="menu-item"
              onClick={() => {
                setOrgOpen(false);
                router.push("/perfil");
              }}
            >
              <Icon name="building-2" size={14} /> Perfil operativo
            </div>
            <div
              className="menu-item"
              onClick={() => {
                setOrgOpen(false);
                router.push("/cuenta");
              }}
            >
              <Icon name="settings" size={14} /> Configuración
            </div>
            <div className="menu-sep" />
            <div
              className="menu-item danger"
              onClick={() => {
                setOrgOpen(false);
                router.push("/login");
              }}
            >
              <Icon name="log-out" size={14} /> Cerrar sesión
            </div>
          </div>
        )}

        {collapsed && (
          <div style={{ display: "flex", justifyContent: "center", marginTop: 8 }}>
            <IconButton
              icon="panel-left-open"
              onClick={() => setCollapsed(false)}
              title="Expandir"
            />
          </div>
        )}
      </div>

      {!collapsed && (
        <div style={{ padding: "0 12px 8px" }}>
          <div
            onClick={() => setCollapsed(true)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "7px 10px",
              background: "rgba(255,255,255,0.55)",
              border: "1px solid var(--border)",
              borderRadius: 8,
              fontSize: 12,
              color: "var(--fg3)",
              cursor: "pointer",
            }}
          >
            <Icon name="search" size={13} />
            <span style={{ flex: 1 }}>Buscar…</span>
            <kbd>⌘K</kbd>
          </div>
        </div>
      )}

      <nav style={{ flex: 1, overflowY: "auto", padding: "4px 8px 16px" }}>
        {items.map((g, i) => {
          if (g.type === "section") {
            if (collapsed)
              return (
                <div
                  key={i}
                  style={{
                    height: 1,
                    background: "var(--border)",
                    margin: "10px 12px",
                  }}
                />
              );
            return (
              <div key={i} className="eyebrow" style={{ padding: "14px 10px 6px" }}>
                {g.label}
              </div>
            );
          }
          const active = pathname === g.href || pathname.startsWith(g.href + "/");
          return (
            <Link
              key={g.key}
              href={g.href}
              title={collapsed ? g.label : undefined}
              className={cn("sidebar-item", active && "active")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: collapsed ? 0 : 10,
                padding: collapsed ? "9px 10px" : "8px 10px",
                margin: "1px 0",
                borderRadius: 7,
                cursor: "pointer",
                fontSize: 13,
                fontWeight: 500,
                color: active ? "#EDE7DA" : "var(--fg1)",
                background: active ? "#141414" : "transparent",
                justifyContent: collapsed ? "center" : "flex-start",
                textDecoration: "none",
              }}
            >
              <Icon
                name={g.icon}
                size={15}
                strokeWidth={active ? 2.25 : 1.75}
                style={{ color: active ? "var(--accent)" : "var(--fg2)" }}
              />
              {!collapsed && (
                <span
                  style={{
                    flex: 1,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {g.label}
                </span>
              )}
              {!collapsed && g.badge ? (
                <span
                  style={{
                    background: active ? "var(--accent)" : "var(--fg1)",
                    color: "#fff",
                    fontSize: 10.5,
                    fontWeight: 600,
                    padding: "1px 7px",
                    borderRadius: 999,
                    minWidth: 22,
                    textAlign: "center",
                  }}
                >
                  {g.badge}
                </span>
              ) : null}
            </Link>
          );
        })}
      </nav>

      <div
        style={{
          borderTop: "1px solid var(--border)",
          padding: collapsed ? "10px 8px" : "10px 12px",
          position: "relative",
        }}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div
          onClick={() => !collapsed && setUserOpen((v) => !v)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "6px 8px",
            borderRadius: 8,
            cursor: "pointer",
            background: userOpen ? "var(--bg-hover)" : "transparent",
            justifyContent: collapsed ? "center" : "flex-start",
          }}
        >
          <Avatar name={PROVIDER.responsable} size={28} />
          {!collapsed && (
            <>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: 12.5,
                    fontWeight: 500,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {PROVIDER.responsable}
                </div>
                <div
                  style={{
                    fontSize: 10.5,
                    color: "var(--fg3)",
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: 999,
                      background: "var(--success)",
                    }}
                  />
                  Disponible
                </div>
              </div>
              <Icon name="more-vertical" size={13} style={{ color: "var(--fg3)" }} />
            </>
          )}
        </div>

        {userOpen && !collapsed && (
          <div
            className="menu"
            style={{
              bottom: 62,
              left: 12,
              width: "calc(100% - 24px)",
              top: "auto",
            }}
          >
            <div className="menu-head">{PROVIDER.responsable}</div>
            <div className="menu-item muted" style={{ fontSize: 11.5 }}>
              {PROVIDER.email}
            </div>
            <div className="menu-sep" />
            <div
              className="menu-item"
              onClick={() => {
                setUserOpen(false);
                router.push("/cuenta");
              }}
            >
              <Icon name="user-cog" size={14} /> Mi cuenta
            </div>
            <div
              className="menu-item"
              onClick={() => {
                setUserOpen(false);
                router.push("/notificaciones");
              }}
            >
              <Icon name="bell" size={14} /> Notificaciones{" "}
              {unread > 0 && (
                <Pill variant="accent" style={{ marginLeft: "auto" }}>
                  {unread}
                </Pill>
              )}
            </div>
            <div className="menu-sep" />
            <div className="menu-item">
              <Icon name="life-buoy" size={14} /> Ayuda y soporte
            </div>
            <div className="menu-sep" />
            <div
              className="menu-item danger"
              onClick={() => {
                setUserOpen(false);
                router.push("/login");
              }}
            >
              <Icon name="log-out" size={14} /> Cerrar sesión
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
