import { Button, Icon } from "@/components/ui";

const ITEMS = [
  {
    titulo: "Observación del tramitador",
    body:
      "Por favor adjuntar foto del daño en detalle del compresor antes de confirmar presupuesto.",
    actor: "E. Niefeld",
    tiempo: "Hace 1h",
    critico: true,
  },
  {
    titulo: "Cliente confirmó visita",
    body: "El asegurado confirma disponibilidad para el jueves 10:30.",
    actor: "Sistema",
    tiempo: "Hace 3h",
    critico: false,
  },
  {
    titulo: "Recordatorio SLA",
    body: "Resta 22h para cargar el presupuesto dentro del SLA comprometido.",
    actor: "Sistema",
    tiempo: "Hace 5h",
    critico: false,
  },
];

export function NovedadesTab() {
  return (
    <div className="card">
      {ITEMS.map((n, i) => (
        <div
          key={i}
          className="px-5 py-4 flex gap-3"
          style={{ borderTop: i > 0 ? "1px solid var(--border)" : "none" }}
        >
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{
              background: n.critico ? "var(--warning-wash)" : "var(--neutral-wash)",
              color: n.critico ? "var(--warning)" : "var(--fg2)",
            }}
          >
            <Icon name={n.critico ? "alert-triangle" : "info"} size={14} />
          </div>
          <div className="flex-1">
            <div className="text-[13.5px] font-medium">{n.titulo}</div>
            <div className="text-[12.5px] mt-1" style={{ color: "var(--fg2)" }}>
              {n.body}
            </div>
            <div className="text-[11px] mt-1.5" style={{ color: "var(--fg3)" }}>
              {n.actor} · {n.tiempo}
            </div>
          </div>
          <Button size="sm" variant="ghost">
            Responder
          </Button>
        </div>
      ))}
    </div>
  );
}
