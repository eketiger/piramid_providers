"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button, Icon, Modal, Switch } from "@/components/ui";
import { track } from "@/lib/analytics";
import { readConsent } from "@/components/privacy/cookie-banner";

const STORAGE_KEY = "piramid.consent.v1";

export default function PrivacyPage() {
  const router = useRouter();
  const [analytics, setAnalytics] = React.useState(false);
  const [confirmDelete, setConfirmDelete] = React.useState(false);

  React.useEffect(() => {
    const c = readConsent();
    if (c) setAnalytics(c.analytics);
  }, []);

  const saveConsent = (next: boolean) => {
    const consent = {
      essential: true as const,
      analytics: next,
      acceptedAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
    window.dispatchEvent(new CustomEvent("piramid:consent", { detail: consent }));
    setAnalytics(next);
  };

  const exportData = async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:4000/api/v1"}/me/export`,
      { credentials: "include" },
    );
    if (!res.ok) return;
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `piramid-export-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    track("privacy.exported");
  };

  const deleteAccount = async () => {
    await fetch(`${process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:4000/api/v1"}/me`, {
      method: "DELETE",
      credentials: "include",
    });
    track("privacy.deleted");
    router.push("/login");
  };

  return (
    <div className="page-body">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="card card-pad">
          <div className="eyebrow mb-3">Cookies y analytics</div>
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-[13px] font-medium">Cookies esenciales</div>
              <div className="text-xs" style={{ color: "var(--fg3)" }}>
                Sesión, preferencias, CSRF. No se pueden desactivar.
              </div>
            </div>
            <Switch checked onChange={() => {}} label="Esenciales (bloqueado)" />
          </div>
          <div className="divider" />
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-[13px] font-medium">Analytics (Mixpanel)</div>
              <div className="text-xs" style={{ color: "var(--fg3)" }}>
                Nos ayudan a entender qué funciona sin guardar datos personales.
              </div>
            </div>
            <Switch checked={analytics} onChange={saveConsent} />
          </div>
        </div>

        <div className="card card-pad">
          <div className="eyebrow mb-3">Tus datos</div>
          <p className="text-[13px]" style={{ color: "var(--fg2)" }}>
            Podés descargar todos los datos que Piramid guarda sobre vos, o solicitar la eliminación
            de tu cuenta.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button variant="ghost" icon="download" onClick={exportData}>
              Descargar mis datos
            </Button>
            <Button variant="danger" icon="trash-2" onClick={() => setConfirmDelete(true)}>
              Eliminar cuenta
            </Button>
          </div>
          <div className="mt-4 text-[11.5px]" style={{ color: "var(--fg3)" }}>
            <Icon name="info" size={11} /> La eliminación es definitiva. Retenemos los IDs de
            licitaciones y órdenes para auditoría regulatoria, anonimizados.
          </div>
        </div>
      </div>

      {confirmDelete && (
        <Modal
          title="Eliminar cuenta"
          subtitle="Esta acción no se puede deshacer"
          onClose={() => setConfirmDelete(false)}
          foot={
            <>
              <Button variant="ghost" onClick={() => setConfirmDelete(false)}>
                Cancelar
              </Button>
              <Button variant="danger" onClick={deleteAccount}>
                Sí, eliminar mi cuenta
              </Button>
            </>
          }
        >
          <p className="text-[13px]" style={{ color: "var(--fg2)" }}>
            Vamos a anonimizar tu nombre, email y teléfono, cerrar tu sesión y bloquear el acceso.
            Los registros operativos (licitaciones, facturas) se conservan por obligaciones
            contables / regulatorias pero sin tu información personal.
          </p>
        </Modal>
      )}
    </div>
  );
}
