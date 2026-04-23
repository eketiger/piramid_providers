import { Button, EmptyState, Pill, Table } from "@/components/ui";
import { VISITS, type Order } from "@/data/fixtures";

export function VisitasTab({ order }: { order: Order }) {
  const visits = VISITS.filter(
    (v) => v.ordenId === order.id || v.ordenId.endsWith(order.id.slice(-2)),
  ).slice(0, 5);
  return (
    <div className="card">
      <div className="card-head">
        <div className="card-title">Visitas de esta orden</div>
        <Button variant="accent" size="sm" icon="calendar-plus">
          Nueva visita
        </Button>
      </div>
      {visits.length === 0 ? (
        <EmptyState
          icon="calendar"
          title="Sin visitas agendadas"
          body="Creá una visita para coordinar con el cliente."
        />
      ) : (
        <Table
          columns={[
            {
              header: "Fecha",
              render: (r) => (
                <span className="mono">
                  {r.fecha} {r.hora}
                </span>
              ),
              style: { width: 160 },
            },
            { header: "Motivo", render: (r) => r.motivo, style: { width: 180 } },
            { header: "Duración", render: (r) => `${r.duracion} min`, style: { width: 100 } },
            { header: "Técnico", render: (r) => r.tecnico, style: { width: 160 } },
            {
              header: "Estado",
              render: (r) => (
                <Pill
                  variant={
                    r.estado === "realizada"
                      ? "success"
                      : r.estado === "agendada"
                        ? "info"
                        : r.estado === "en_curso"
                          ? "warning"
                          : "ghost"
                  }
                >
                  {r.estado}
                </Pill>
              ),
            },
            {
              header: "Comentarios",
              render: (r) => (
                <span style={{ color: "var(--fg2)" }}>{r.comentarios || "—"}</span>
              ),
            },
          ]}
          rows={visits}
        />
      )}
    </div>
  );
}
