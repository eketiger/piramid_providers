import Link from "next/link";
import { Button, EmptyState } from "@/components/ui";

export default function NotFound() {
  return (
    <div
      className="min-h-screen flex items-center justify-center p-6"
      style={{ background: "var(--bg-app)" }}
    >
      <div className="card max-w-md w-full">
        <EmptyState
          icon="help-circle"
          title="Página no encontrada"
          body="El recurso que buscás no existe o ya no está disponible."
          action={
            <div className="mt-4">
              <Link href="/inicio">
                <Button variant="accent" icon="arrow-left">
                  Volver al inicio
                </Button>
              </Link>
            </div>
          }
        />
      </div>
    </div>
  );
}
