"use client";

import * as React from "react";
import { Button, Checkbox, Field, Icon, Pill, Switch } from "@/components/ui";
import { PROVIDER } from "@/data/fixtures";

export default function CuentaPage() {
  const [twofa, setTwofa] = React.useState(true);
  const [emailNotif, setEmailNotif] = React.useState(true);
  const [pushNotif, setPushNotif] = React.useState(true);
  const [whatsapp, setWhatsapp] = React.useState(false);

  return (
    <div className="page-body">
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div className="card card-pad">
          <div className="eyebrow" style={{ marginBottom: 12 }}>
            Datos personales
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <Field label="Nombre completo" required>
              <input className="input" defaultValue={PROVIDER.responsable} />
            </Field>
            <Field label="Email" required>
              <input className="input" defaultValue={PROVIDER.email} />
            </Field>
            <Field label="Teléfono">
              <input className="input mono" defaultValue={PROVIDER.telefono} />
            </Field>
          </div>
          <div style={{ marginTop: 16, display: "flex", justifyContent: "flex-end" }}>
            <Button variant="accent" icon="check">
              Guardar
            </Button>
          </div>
        </div>

        <div className="card card-pad">
          <div className="eyebrow" style={{ marginBottom: 12 }}>
            Seguridad
          </div>
          <Field label="Contraseña">
            <input className="input" type="password" defaultValue="••••••••" />
          </Field>
          <div className="divider" />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
            }}
          >
            <div>
              <div style={{ fontSize: 13, fontWeight: 500 }}>Autenticación en dos pasos</div>
              <div style={{ fontSize: 12, color: "var(--fg3)" }}>
                Proteg&eacute; tu cuenta con una app de TOTP (Authy, 1Password).
              </div>
            </div>
            <Switch checked={twofa} onChange={setTwofa} />
          </div>
          <div className="divider" />
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <Checkbox
              checked={true}
              onChange={() => {}}
              label="Cerrar sesión en otros dispositivos al cambiar contraseña"
            />
          </div>
        </div>

        <div className="card">
          <div className="card-head">
            <div className="card-title">Preferencias de notificación</div>
          </div>
          <div style={{ padding: 8 }}>
            {[
              {
                label: "Email",
                hint: "Resumen diario y alertas urgentes",
                value: emailNotif,
                onChange: setEmailNotif,
                icon: "mail" as const,
              },
              {
                label: "Push",
                hint: "En el navegador y el mobile",
                value: pushNotif,
                onChange: setPushNotif,
                icon: "bell" as const,
              },
              {
                label: "WhatsApp",
                hint: "Solo para alertas críticas de SLA",
                value: whatsapp,
                onChange: setWhatsapp,
                icon: "message-circle" as const,
              },
            ].map((p) => (
              <div
                key={p.label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "10px 12px",
                  borderRadius: 8,
                }}
              >
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    background: "var(--neutral-wash)",
                    color: "var(--fg2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Icon name={p.icon} size={14} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{p.label}</div>
                  <div style={{ fontSize: 11.5, color: "var(--fg3)" }}>{p.hint}</div>
                </div>
                <Switch checked={p.value} onChange={p.onChange} />
              </div>
            ))}
          </div>
        </div>

        <div className="card card-pad">
          <div className="eyebrow" style={{ marginBottom: 10 }}>
            Estado de onboarding
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <Pill variant="success" dot>
              Aprobado
            </Pill>
            <span style={{ fontSize: 12.5, color: "var(--fg3)" }}>
              Alta completada el 10/03/2026
            </span>
          </div>
          <div style={{ fontSize: 13, color: "var(--fg2)", lineHeight: 1.5 }}>
            Podés actualizar tus datos, documentos y cobertura en el{" "}
            <a style={{ color: "var(--fg1)", fontWeight: 500 }} href="/perfil">
              perfil operativo
            </a>
            .
          </div>
        </div>
      </div>
    </div>
  );
}
