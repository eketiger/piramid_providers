"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthShell } from "@/components/shell/auth-shell";
import { Button, Checkbox, Field } from "@/components/ui";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = React.useState("en@revelaciondata.com.ar");
  const [pw, setPw] = React.useState("••••••••");
  const [remember, setRemember] = React.useState(true);

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
        Ingresar
      </h2>
      <div
        style={{
          fontSize: 14,
          color: "var(--fg3)",
          marginTop: 6,
          marginBottom: 28,
        }}
      >
        Accedé con tu cuenta de proveedor.
      </div>
      <Field label="Email">
        <input
          className="input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </Field>
      <div style={{ height: 14 }} />
      <Field label="Contraseña">
        <input
          className="input"
          type="password"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
        />
      </Field>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 12,
          marginBottom: 20,
        }}
      >
        <Checkbox checked={remember} onChange={setRemember} label="Recordarme" />
        <button
          type="button"
          className="bg-transparent border-0 cursor-pointer"
          style={{ fontSize: 12.5, color: "var(--fg2)" }}
        >
          ¿Olvidaste tu contraseña?
        </button>
      </div>
      <Button
        variant="accent"
        size="lg"
        onClick={() => router.push("/inicio")}
        style={{ width: "100%" }}
      >
        Ingresar
      </Button>
      <div
        style={{
          fontSize: 13,
          color: "var(--fg3)",
          textAlign: "center",
          marginTop: 20,
        }}
      >
        ¿No tenés cuenta?{" "}
        <Link
          href="/register"
          style={{ color: "var(--fg1)", fontWeight: 500, cursor: "pointer" }}
        >
          Registrate
        </Link>
      </div>
    </AuthShell>
  );
}
