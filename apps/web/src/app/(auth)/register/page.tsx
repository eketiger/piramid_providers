"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthShell } from "@/components/shell/auth-shell";
import { Button, Checkbox, Field } from "@/components/ui";

export default function RegisterPage() {
  const router = useRouter();
  const [terms, setTerms] = React.useState(true);

  return (
    <AuthShell>
      <h2
        style={{
          fontSize: 28,
          margin: 0,
          fontWeight: 600,
          letterSpacing: "-0.01em",
        }}
      >
        Crear cuenta de proveedor
      </h2>
      <div
        style={{
          fontSize: 14,
          color: "var(--fg3)",
          marginTop: 6,
          marginBottom: 24,
        }}
      >
        Después completás el onboarding con los datos de tu empresa.
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <Field label="Nombre">
          <input className="input" defaultValue="Ezequiel" />
        </Field>
        <Field label="Apellido">
          <input className="input" defaultValue="Niefeld" />
        </Field>
      </div>
      <div style={{ height: 12 }} />
      <Field label="Email de trabajo">
        <input className="input" defaultValue="en@revelaciondata.com.ar" />
      </Field>
      <div style={{ height: 12 }} />
      <Field label="Teléfono">
        <input className="input mono" defaultValue="+54 9 11 5123-4587" />
      </Field>
      <div style={{ height: 12 }} />
      <Field label="Contraseña" hint="Mín. 8 caracteres, una mayúscula y un número">
        <input className="input" type="password" defaultValue="••••••••" />
      </Field>
      <div style={{ marginTop: 14, marginBottom: 18 }}>
        <Checkbox
          checked={terms}
          onChange={setTerms}
          label={
            <span style={{ fontSize: 12, color: "var(--fg2)" }}>
              Acepto los{" "}
              <a href="/legal/terms" style={{ color: "var(--fg1)" }}>
                términos
              </a>{" "}
              y la{" "}
              <a href="/legal/privacy" style={{ color: "var(--fg1)" }}>
                política de privacidad
              </a>
            </span>
          }
        />
      </div>
      <Button
        variant="accent"
        size="lg"
        onClick={() => router.push("/onboarding")}
        style={{ width: "100%" }}
      >
        Crear cuenta
      </Button>
      <div
        style={{
          fontSize: 13,
          color: "var(--fg3)",
          textAlign: "center",
          marginTop: 20,
        }}
      >
        ¿Ya tenés cuenta?{" "}
        <Link href="/login" style={{ color: "var(--fg1)", fontWeight: 500, cursor: "pointer" }}>
          Ingresá
        </Link>
      </div>
    </AuthShell>
  );
}
