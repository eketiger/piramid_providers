"use client";

import * as React from "react";
import { Button, EstadoBadge, Field, Icon, InfoRow, Pill, Tabs } from "@/components/ui";
import { PROVIDER, VERTICALS } from "@/data/fixtures";

export default function PerfilPage() {
  const [section, setSection] = React.useState("datos");

  return (
    <div className="page-body">
      <div style={{ marginBottom: 16 }}>
        <Tabs
          value={section}
          onChange={setSection}
          variant="underline"
          tabs={[
            { key: "datos", label: "Datos de la empresa", icon: "building-2" },
            { key: "categorias", label: "Categorías y productos", icon: "tags" },
            { key: "cobertura", label: "Cobertura", icon: "map" },
            { key: "disponibilidad", label: "Disponibilidad", icon: "calendar-clock" },
            { key: "docs", label: "Documentación", icon: "file-text" },
            { key: "ficha", label: "Ficha pública", icon: "globe" },
          ]}
        />
      </div>

      {section === "datos" && <DatosSection />}
      {section === "categorias" && <CategoriasSection />}
      {section === "cobertura" && <CoberturaSection />}
      {section === "disponibilidad" && <DisponibilidadSection />}
      {section === "docs" && <DocsSection />}
      {section === "ficha" && <FichaSection />}
    </div>
  );
}

function DatosSection() {
  return (
    <div className="card card-pad">
      <div className="eyebrow" style={{ marginBottom: 16 }}>
        Identidad fiscal y operativa
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <Field label="Nombre comercial" required>
          <input className="input" defaultValue={PROVIDER.nombre} />
        </Field>
        <Field label="CUIT" required>
          <input className="input mono" defaultValue={PROVIDER.cuit} />
        </Field>
        <Field label="Responsable legal" required>
          <input className="input" defaultValue={PROVIDER.responsable} />
        </Field>
        <Field label="Email operativo" required>
          <input className="input" defaultValue={PROVIDER.email} />
        </Field>
        <Field label="Teléfono" required>
          <input className="input mono" defaultValue={PROVIDER.telefono} />
        </Field>
        <Field label="Cantidad de técnicos">
          <input className="input mono" defaultValue="6" />
        </Field>
      </div>
      <div className="divider" />
      <Field label="Descripción del servicio" hint="Máx 280 caracteres · esto lo ve el tramitador">
        <textarea className="textarea" rows={3} defaultValue={PROVIDER.descripcion} />
      </Field>
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 16 }}>
        <Button variant="ghost">Descartar</Button>
        <Button variant="accent" icon="check">
          Guardar cambios
        </Button>
      </div>
    </div>
  );
}

function CategoriasSection() {
  return (
    <div className="card card-pad">
      <div className="eyebrow" style={{ marginBottom: 8 }}>
        Vertical primario
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 10,
          marginBottom: 22,
        }}
      >
        {Object.entries(VERTICALS).map(([k, v]) => (
          <div
            key={k}
            style={{
              padding: 14,
              border: `1px solid ${k === PROVIDER.verticalPrimario ? "var(--fg1)" : "var(--border)"}`,
              borderRadius: 10,
              cursor: "pointer",
              background: k === PROVIDER.verticalPrimario ? "#FBFAF5" : "#fff",
            }}
          >
            <Icon name={v.icon} size={18} />
            <div style={{ fontSize: 13, fontWeight: 500, marginTop: 8 }}>{v.label}</div>
            <div style={{ fontSize: 11, color: "var(--fg3)", marginTop: 2 }}>
              {v.categories.length} categorías
            </div>
          </div>
        ))}
      </div>
      <div className="eyebrow" style={{ marginBottom: 8 }}>
        Categorías habilitadas
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 18 }}>
        {VERTICALS.hogar.categories.map((c) => (
          <Pill key={c} variant={PROVIDER.categorias.includes(c) ? "accent" : "ghost"}>
            {PROVIDER.categorias.includes(c) && <Icon name="check" size={11} strokeWidth={3} />}
            {c}
          </Pill>
        ))}
      </div>
      <div className="eyebrow" style={{ marginBottom: 8 }}>
        Productos / especialidades
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {PROVIDER.productos.map((p) => (
          <Pill key={p} variant="ghost">
            {p}
          </Pill>
        ))}
      </div>
    </div>
  );
}

function CoberturaSection() {
  return (
    <div className="card card-pad">
      <div className="eyebrow" style={{ marginBottom: 8 }}>
        Zonas
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
        {PROVIDER.cobertura.map((c) => (
          <Pill key={c} variant="accent">
            <Icon name="map-pin" size={11} />
            {c}
            <Icon name="x" size={11} />
          </Pill>
        ))}
        <Button size="sm" variant="ghost" icon="plus">
          Agregar
        </Button>
      </div>
      <div
        style={{
          height: 220,
          background: "#FBFAF5",
          border: "1px solid var(--border)",
          borderRadius: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--fg3)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(circle at 45% 50%, rgba(245,137,58,0.3), transparent 30%)",
          }}
        />
        <Icon name="map" size={24} />
        <span style={{ marginLeft: 8, fontSize: 13 }}>Mapa (placeholder)</span>
      </div>
      <div
        style={{
          height: 14,
        }}
      />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <Field label="Tiempo promedio de respuesta">
          <input className="input mono" defaultValue={PROVIDER.tiempoRespuesta} />
        </Field>
        <Field label="Costo de visita base">
          <input className="input mono" defaultValue={String(PROVIDER.costoVisita)} />
        </Field>
      </div>
    </div>
  );
}

function DisponibilidadSection() {
  return (
    <div className="card card-pad">
      <div className="eyebrow" style={{ marginBottom: 10 }}>
        Horarios de atención
      </div>
      <Field label="Horario operativo">
        <input className="input" defaultValue={PROVIDER.horarios} />
      </Field>
      <div className="divider" />
      <div className="eyebrow" style={{ marginBottom: 10 }}>
        Inactividad programada
      </div>
      <div style={{ fontSize: 13, color: "var(--fg3)" }}>
        No hay períodos de inactividad cargados.
      </div>
      <div style={{ marginTop: 12 }}>
        <Button size="sm" icon="plus">
          Agregar período
        </Button>
      </div>
    </div>
  );
}

function DocsSection() {
  return (
    <div className="card">
      <div className="card-head">
        <div className="card-title">Documentación requerida</div>
        <Button size="sm" variant="accent" icon="upload">
          Subir documento
        </Button>
      </div>
      <div>
        {PROVIDER.docs.map((d, i) => (
          <div
            key={d.nombre}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "14px 20px",
              borderTop: i > 0 ? "1px solid var(--border)" : "none",
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                background: "var(--neutral-wash)",
                color: "var(--fg2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icon name="file-text" size={14} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13.5, fontWeight: 500 }}>{d.nombre}</div>
              <div
                style={{
                  fontSize: 11.5,
                  color: "var(--fg3)",
                  display: "flex",
                  gap: 6,
                  marginTop: 2,
                }}
              >
                <span>Vence: {d.vence}</span>
              </div>
            </div>
            <EstadoBadge
              estado={{
                key: d.estado,
                label:
                  d.estado === "por_vencer"
                    ? "Por vencer"
                    : d.estado === "aprobado"
                      ? "Aprobado"
                      : "Pendiente",
                variant:
                  d.estado === "aprobado"
                    ? "success"
                    : d.estado === "por_vencer"
                      ? "warning"
                      : "danger",
              }}
            />
            <Button variant="ghost" size="sm" icon="download">
              Ver
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

function FichaSection() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
      <div className="card card-pad">
        <div className="eyebrow" style={{ marginBottom: 12 }}>
          Tu ficha pública
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <InfoRow icon="building-2" label="Razón social" value={PROVIDER.nombre} />
          <InfoRow
            icon="briefcase"
            label="Vertical"
            value={VERTICALS[PROVIDER.verticalPrimario].label}
          />
          <InfoRow icon="clock" label="Respuesta promedio" value={PROVIDER.tiempoRespuesta} />
          <InfoRow icon="star" label="Score" value={PROVIDER.score.toFixed(1)} />
          <InfoRow icon="rotate-ccw" label="Retrabajos" value={`${PROVIDER.retrabajos}%`} />
          <InfoRow
            icon="shield-check"
            label="Cumplimiento SLA"
            value={`${PROVIDER.cumplimientoSLA}%`}
          />
        </div>
      </div>
      <div className="card card-pad">
        <div className="eyebrow" style={{ marginBottom: 12 }}>
          Preview
        </div>
        <div
          style={{
            borderRadius: 12,
            padding: 20,
            background: "#141414",
            color: "#EDE7DA",
            position: "relative",
            overflow: "hidden",
            minHeight: 180,
          }}
        >
          <div
            style={{
              position: "absolute",
              right: -80,
              top: -80,
              width: 240,
              height: 240,
              background: "radial-gradient(circle, rgba(245,137,58,0.32), transparent 65%)",
            }}
          />
          <div className="eyebrow" style={{ color: "var(--accent)" }}>
            Proveedor verificado
          </div>
          <div
            className="display"
            style={{
              fontFamily: "Archivo Black",
              fontSize: 32,
              marginTop: 8,
              lineHeight: 1,
            }}
          >
            TÉCNICA AUSTRAL
          </div>
          <div style={{ fontSize: 13, color: "#B8B8B8", marginTop: 10, lineHeight: 1.5 }}>
            {PROVIDER.descripcion}
          </div>
        </div>
      </div>
    </div>
  );
}
