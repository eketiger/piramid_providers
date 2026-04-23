import Link from "next/link";
import { Button, EmptyState } from "@/components/ui";

export default function NotFound() {
  return (
    <div className="page-body">
      <div className="card">
        <EmptyState
          icon="help-circle"
          title="No encontramos esta página"
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
