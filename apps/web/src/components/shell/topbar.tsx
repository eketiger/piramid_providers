"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import { Avatar, Button, Icon, IconButton } from "@/components/ui";
import { NOTIFS, PROVIDER } from "@/data/fixtures";

const TITLES: Record<string, { title: string; sub?: string }> = {
  "/inicio": { title: "Inicio", sub: "Buen día, Ezequiel. Hoy es martes 22 de abril." },
  "/licitaciones": { title: "Licitaciones", sub: "Oportunidades activas para tu empresa" },
  "/ordenes": { title: "Órdenes", sub: "Trabajos adjudicados y su progreso" },
  "/agenda": { title: "Agenda y visitas", sub: "Planificá tus visitas y reservas de equipo" },
  "/reportes": { title: "Reportes y documentos", sub: "Evidencias, informes y adjuntos por orden" },
  "/marketplace": { title: "Marketplace", sub: "Encontrá proveedores en la red de Piramid" },
  "/perfil": { title: "Perfil operativo", sub: "Cómo te ve la red de Piramid" },
  "/scorecard": { title: "Performance", sub: "Score, métricas y opiniones" },
  "/notificaciones": { title: "Notificaciones", sub: "Centro de novedades y alertas" },
  "/cuenta": { title: "Mi cuenta", sub: "Preferencias, seguridad y sesión" },
};

function resolveHeader(pathname: string): { title: string; sub?: string } {
  if (TITLES[pathname]) return TITLES[pathname];
  if (pathname.startsWith("/ordenes/")) return { title: "Detalle de orden" };
  if (pathname.startsWith("/marketplace/")) return { title: "Ficha pública" };
  return { title: "Piramid Providers" };
}

export function Topbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = React.useState(false);
  const unread = NOTIFS.filter((n) => !n.leido).length;
  const { title, sub } = resolveHeader(pathname);

  React.useEffect(() => {
    if (!menuOpen) return;
    const onDoc = () => setMenuOpen(false);
    const t = setTimeout(() => document.addEventListener("mousedown", onDoc), 0);
    return () => {
      clearTimeout(t);
      document.removeEventListener("mousedown", onDoc);
    };
  }, [menuOpen]);

  return (
    <div
      style={{
        position: "sticky",
        top: 0,
        zIndex: 40,
        background: "rgba(246,243,234,0.88)",
        backdropFilter: "blur(10px)",
        borderBottom: "1px solid var(--border)",
        padding: "14px 32px",
        display: "flex",
        alignItems: "center",
        gap: 16,
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <h1 className="page-title">{title}</h1>
        </div>
        {sub && <div className="page-sub">{sub}</div>}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, position: "relative" }}>
        <Button
          variant="ghost"
          size="sm"
          icon="log-in"
          onClick={() => router.push("/login")}
          title="Ver pantallas de auth"
        >
          Auth demo
        </Button>
        <div style={{ position: "relative" }}>
          <IconButton
            icon="bell"
            onClick={() => router.push("/notificaciones")}
            title="Notificaciones"
          />
          {unread > 0 && (
            <span
              style={{
                position: "absolute",
                top: -2,
                right: -2,
                minWidth: 14,
                height: 14,
                padding: "0 3px",
                borderRadius: 999,
                background: "var(--accent)",
                color: "#fff",
                fontSize: 9,
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                pointerEvents: "none",
              }}
            >
              {unread}
            </span>
          )}
        </div>
        <IconButton icon="help-circle" title="Ayuda" />
        <div style={{ position: "relative" }} onMouseDown={(e) => e.stopPropagation()}>
          <button
            onClick={() => setMenuOpen((v) => !v)}
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              padding: 2,
              borderRadius: 999,
            }}
          >
            <Avatar name={PROVIDER.responsable} size={30} />
          </button>
          {menuOpen && (
            <div className="menu" style={{ right: 0, top: 42, width: 240, zIndex: 50 }}>
              <div style={{ padding: "10px 12px" }}>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{PROVIDER.responsable}</div>
                <div style={{ fontSize: 11.5, color: "var(--fg3)" }}>{PROVIDER.email}</div>
              </div>
              <div className="menu-sep" />
              <div
                className="menu-item"
                onClick={() => {
                  setMenuOpen(false);
                  router.push("/cuenta");
                }}
              >
                <Icon name="user-cog" size={14} />
                Mi cuenta
              </div>
              <div
                className="menu-item"
                onClick={() => {
                  setMenuOpen(false);
                  router.push("/perfil");
                }}
              >
                <Icon name="building-2" size={14} />
                Perfil operativo
              </div>
              <div className="menu-sep" />
              <div
                className="menu-item danger"
                onClick={() => {
                  setMenuOpen(false);
                  router.push("/login");
                }}
              >
                <Icon name="log-out" size={14} />
                Cerrar sesión
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
