import { InfoRow } from "@/components/ui";
import type { Order } from "@/data/fixtures";

export function DetalleTab({ order }: { order: Order }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="card card-pad">
        <div className="eyebrow mb-3">Información del servicio</div>
        <div className="grid grid-cols-2 gap-3.5">
          <InfoRow icon="tag" label="Tipo" value={order.tipo} />
          <InfoRow icon="briefcase" label="Vertical" value={order.verticalLabel} />
          <InfoRow icon="calendar" label="Inicio" value={order.fechaInicio} />
          <InfoRow icon="calendar-check-2" label="Fin planificado" value={order.fechaFin} />
          <InfoRow icon="flag" label="Prioridad" value={order.prioridad} />
          <InfoRow icon="rotate-ccw" label="¿Retrabajo?" value={order.retrabajo ? "Sí" : "No"} />
        </div>
        <div className="divider" />
        <div className="eyebrow mb-3">Cliente</div>
        <div className="grid grid-cols-2 gap-3.5">
          <InfoRow icon="user" label="Nombre" value={order.cliente} />
          <InfoRow icon="phone" label="Teléfono" value={order.clienteTel} />
          <InfoRow icon="map-pin" label="Dirección" value={order.direccion} />
        </div>
      </div>

      <div className="card card-pad">
        <div className="eyebrow mb-3">Descripción y alcance</div>
        <p className="text-[13px] leading-relaxed" style={{ color: "var(--fg2)" }}>
          Servicio originado por denuncia del asegurado. Se requiere diagnóstico inicial en
          sitio, presupuesto desglosado por mano de obra y repuestos, ejecución dentro del plazo
          acordado y entrega de informe final con fotos antes/después.
        </p>
        <div className="divider" />
        <div className="eyebrow mb-2.5">Condiciones comerciales</div>
        <ul
          className="m-0 text-[13px] leading-[1.8]"
          style={{ paddingLeft: 18, color: "var(--fg2)" }}
        >
          <li>Presupuesto válido por 15 días corridos</li>
          <li>Plazo máximo de diagnóstico: 48h hábiles</li>
          <li>Garantía mano de obra: 90 días</li>
          <li>Pago a 30 días de factura conformada</li>
        </ul>
      </div>
    </div>
  );
}
