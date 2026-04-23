"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  Field,
  Icon,
  Pill,
  Stepper,
} from "@/components/ui";
import { PiramidMark } from "@/components/shell/logo";
import { PROVIDER, VERTICALS } from "@/data/fixtures";

export default function OnboardingPage() {
  const router = useRouter();
  const steps = ["Empresa", "Servicios", "Cobertura", "Documentos", "Revisión"];
  const [current, setCurrent] = React.useState(0);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg-app)",
        padding: "28px 0 60px",
      }}
    >
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 24px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 24,
          }}
        >
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 6,
              background: "#141414",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <PiramidMark size={16} />
          </div>
          <span style={{ fontSize: 13, fontWeight: 600 }}>Piramid · Providers</span>
          <span style={{ flex: 1 }} />
          <Button variant="ghost" size="sm">
            Guardar y salir
          </Button>
        </div>

        <div
          style={{
            background: "#fff",
            border: "1px solid var(--border)",
            borderRadius: 16,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "24px 32px",
              borderBottom: "1px solid var(--border)",
              background: "#FBFAF5",
            }}
          >
            <div className="eyebrow">
              Paso {current + 1} de {steps.length}
            </div>
            <h2
              style={{
                fontSize: 24,
                margin: "4px 0 16px",
                fontWeight: 600,
                letterSpacing: "-0.01em",
              }}
            >
              Bienvenido a Piramid Providers
            </h2>
            <Stepper steps={steps} current={current} />
          </div>

          <div style={{ padding: "28px 32px", minHeight: 380 }}>
            {current === 0 && <OnbEmpresa />}
            {current === 1 && <OnbServicios />}
            {current === 2 && <OnbCobertura />}
            {current === 3 && <OnbDocs />}
            {current === 4 && <OnbRevision />}
          </div>

          <div
            style={{
              padding: "16px 32px",
              borderTop: "1px solid var(--border)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              background: "#FBFAF5",
            }}
          >
            <Button
              variant="ghost"
              icon="chevron-left"
              onClick={() => setCurrent((c) => Math.max(0, c - 1))}
              disabled={current === 0}
            >
              Anterior
            </Button>
            <div style={{ fontSize: 12, color: "var(--fg3)" }}>
              Podés guardar y continuar más tarde.
            </div>
            {current < steps.length - 1 ? (
              <Button
                variant="accent"
                iconRight="chevron-right"
                onClick={() => setCurrent((c) => c + 1)}
              >
                Continuar
              </Button>
            ) : (
              <Button variant="accent" icon="check" onClick={() => router.push("/inicio")}>
                Enviar para revisión
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function OnbEmpresa() {
  return (
    <>
      <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>
        Datos de tu empresa
      </div>
      <div style={{ fontSize: 13, color: "var(--fg3)", marginBottom: 20 }}>
        Esta información aparece en tu perfil público y en todas las cotizaciones.
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
      <div style={{ height: 14 }} />
      <Field
        label="Descripción del servicio"
        hint="Máx 280 caracteres · esto lo ve el tramitador"
      >
        <textarea className="textarea" rows={3} defaultValue={PROVIDER.descripcion} />
      </Field>
    </>
  );
}

function OnbServicios() {
  return (
    <>
      <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>
        Categorías y productos
      </div>
      <div style={{ fontSize: 13, color: "var(--fg3)", marginBottom: 20 }}>
        Elegí en qué tipo de servicios querés recibir licitaciones.
      </div>
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
              border: `1px solid ${k === "hogar" ? "var(--fg1)" : "var(--border)"}`,
              borderRadius: 10,
              cursor: "pointer",
              background: k === "hogar" ? "#FBFAF5" : "#fff",
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
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {VERTICALS.hogar.categories.map((c) => (
          <Pill key={c} variant={PROVIDER.categorias.includes(c) ? "accent" : "ghost"}>
            {PROVIDER.categorias.includes(c) && <Icon name="check" size={11} strokeWidth={3} />}
            {c}
          </Pill>
        ))}
      </div>
    </>
  );
}

function OnbCobertura() {
  return (
    <>
      <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>
        Cobertura geográfica
      </div>
      <div style={{ fontSize: 13, color: "var(--fg3)", marginBottom: 20 }}>
        Definí dónde podés prestar servicio.
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
          height: 180,
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
            background:
              "radial-gradient(circle at 45% 50%, rgba(245,137,58,0.3), transparent 30%)",
          }}
        />
        <Icon name="map" size={24} />
        <span style={{ marginLeft: 8, fontSize: 13 }}>Mapa (placeholder)</span>
      </div>
      <div style={{ height: 16 }} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <Field label="Tiempo promedio de respuesta">
          <input className="input mono" defaultValue={PROVIDER.tiempoRespuesta} />
        </Field>
        <Field label="Costo de visita base">
          <input className="input mono" defaultValue={String(PROVIDER.costoVisita)} />
        </Field>
      </div>
    </>
  );
}

function OnbDocs() {
  const docs = [
    { nombre: "Constancia AFIP", estado: "subido" as const },
    { nombre: "Póliza ART", estado: "subido" as const },
    { nombre: "Habilitación municipal", estado: "subido" as const },
    { nombre: "Certificaciones de marca", estado: "pendiente" as const },
  ];
  return (
    <>
      <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>
        Documentación requerida
      </div>
      <div style={{ fontSize: 13, color: "var(--fg3)", marginBottom: 20 }}>
        Subí tus documentos para poder operar en la red.
      </div>
      {docs.map((d) => (
        <div
          key={d.nombre}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "12px 14px",
            border: "1px solid var(--border)",
            borderRadius: 10,
            marginBottom: 8,
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 6,
              background: "var(--neutral-wash)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--fg2)",
            }}
          >
            <Icon name="file-text" size={14} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13.5, fontWeight: 500 }}>{d.nombre}</div>
            <div style={{ fontSize: 11.5, color: "var(--fg3)" }}>PDF hasta 10 MB</div>
          </div>
          {d.estado === "subido" ? (
            <Pill variant="success" dot>
              Subido
            </Pill>
          ) : (
            <Button size="sm" icon="upload">
              Subir
            </Button>
          )}
        </div>
      ))}
    </>
  );
}

function OnbRevision() {
  return (
    <>
      <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>Revisá y enviá</div>
      <div style={{ fontSize: 13, color: "var(--fg3)", marginBottom: 20 }}>
        Nuestro equipo valida tu onboarding en 24–48h hábiles.
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {[
          ["Empresa", "Técnica Austral S.R.L."],
          ["CUIT", "30-71298764-3"],
          ["Vertical", "Hogar / Electro"],
          ["Categorías", "3 seleccionadas"],
          ["Zonas", "8 zonas"],
          ["Documentos", "3 de 4 cargados"],
        ].map(([k, v], i) => (
          <div
            key={i}
            style={{
              padding: 12,
              background: "#FBFAF5",
              borderRadius: 8,
              border: "1px solid var(--border)",
            }}
          >
            <div className="eyebrow">{k}</div>
            <div style={{ fontSize: 13, fontWeight: 500, marginTop: 4 }}>{v}</div>
          </div>
        ))}
      </div>
      <div
        style={{
          marginTop: 18,
          padding: 14,
          background: "var(--warning-wash)",
          borderRadius: 10,
          display: "flex",
          gap: 12,
          alignItems: "flex-start",
        }}
      >
        <Icon name="alert-triangle" size={16} style={{ color: "var(--warning)", marginTop: 2 }} />
        <div style={{ fontSize: 13, color: "#7A5106", lineHeight: 1.5 }}>
          Falta subir el certificado de marca Samsung. Podés enviar para revisión ahora y
          completarlo después, aunque las licitaciones de esa marca quedarán bloqueadas hasta
          aprobarlo.
        </div>
      </div>
    </>
  );
}
