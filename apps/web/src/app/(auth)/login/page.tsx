"use client";

import * as React from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { AuthShell } from "@/components/shell/auth-shell";
import { Button, Checkbox, Field, Icon } from "@/components/ui";
import { track } from "@/lib/analytics";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = React.useState("en@revelaciondata.com.ar");
  const [pw, setPw] = React.useState("••••••••");
  const [remember, setRemember] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const onEmailLogin = async () => {
    // Hits NestJS /auth/login directly. Successful login navigates into the app.
    // When Google auth is used, NextAuth does the exchange via /auth/google
    // (see src/auth.ts callbacks).
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:4000/api/v1"}/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ email, password: pw }),
        },
      );
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(body?.error?.message ?? "No pudimos iniciar sesión");
        return;
      }
      track("auth.signin", { method: "password" });
      router.push("/inicio");
    } catch {
      setError("No pudimos conectar con el servidor");
    }
  };

  return (
    <AuthShell>
      <h2 className="m-0 text-[28px] font-semibold tracking-tight">Ingresar</h2>
      <div className="mt-1.5 mb-6 text-sm" style={{ color: "var(--fg3)" }}>
        Accedé con tu cuenta de proveedor.
      </div>

      <Button
        variant="ghost"
        size="lg"
        icon="log-in"
        onClick={() => {
          track("auth.signin", { method: "google" });
          void signIn("google", { callbackUrl: "/inicio" });
        }}
        style={{
          width: "100%",
          border: "1px solid var(--border-strong)",
          marginBottom: 16,
        }}
      >
        Ingresar con Google
      </Button>

      <div
        className="my-4 flex items-center gap-3 text-[11px] tracking-[0.08em] uppercase"
        style={{ color: "var(--fg3)" }}
      >
        <span className="h-px flex-1" style={{ background: "var(--border)" }} />
        <span>o con email</span>
        <span className="h-px flex-1" style={{ background: "var(--border)" }} />
      </div>

      <Field label="Email">
        <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} />
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
      <div className="mt-3 mb-5 flex items-center justify-between">
        <Checkbox checked={remember} onChange={setRemember} label="Recordarme" />
        <button
          type="button"
          className="cursor-pointer border-0 bg-transparent"
          style={{ fontSize: 12.5, color: "var(--fg2)" }}
        >
          ¿Olvidaste tu contraseña?
        </button>
      </div>

      {error && (
        <div
          role="alert"
          className="mb-3 flex items-center gap-2 rounded-md p-3 text-[12.5px]"
          style={{ background: "var(--danger-wash)", color: "var(--danger)" }}
        >
          <Icon name="alert-circle" size={13} />
          {error}
        </div>
      )}

      <Button variant="accent" size="lg" onClick={onEmailLogin} style={{ width: "100%" }}>
        Ingresar
      </Button>
      <div className="mt-5 text-center text-[13px]" style={{ color: "var(--fg3)" }}>
        ¿No tenés cuenta?{" "}
        <Link
          href="/register"
          className="cursor-pointer font-medium"
          style={{ color: "var(--fg1)" }}
        >
          Registrate
        </Link>
      </div>
    </AuthShell>
  );
}
