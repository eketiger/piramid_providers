import { Button, EstadoBadge, Table, type Column } from "@/components/ui";
import type { Order } from "@/data/fixtures";
import { money } from "@/lib/format";

type Invoice = {
  id: number;
  tipo: string;
  num: string;
  fecha: string;
  monto: number;
  estado: string;
  variant: "success" | "warning";
};

export function FacturasTab({ order }: { order: Order }) {
  const rows: Invoice[] = [
    { id: 1, tipo: "Presupuesto", num: "PRES-4521", fecha: "19/04/2026", monto: order.monto * 0.4, estado: "Aprobado", variant: "success" },
    { id: 2, tipo: "Factura A", num: "A-0001-00012345", fecha: "—", monto: order.monto, estado: "Pendiente de emisión", variant: "warning" },
  ];
  const cols: Column<Invoice>[] = [
    { header: "Tipo", render: (r) => r.tipo, style: { width: 120 } },
    { header: "Número", render: (r) => <span className="mono">{r.num}</span>, style: { width: 160 } },
    { header: "Fecha", render: (r) => <span className="mono">{r.fecha}</span>, style: { width: 120 } },
    {
      header: "Monto",
      render: (r) => (
        <span className="mono font-medium">{money(r.monto)}</span>
      ),
      style: { width: 140, textAlign: "right" },
      cellStyle: { textAlign: "right" },
    },
    {
      header: "Estado",
      render: (r) => <EstadoBadge estado={{ key: r.estado, label: r.estado, variant: r.variant }} />,
      style: { width: 170 },
    },
    {
      header: "",
      render: () => (
        <Button size="sm" variant="ghost" icon="download">
          PDF
        </Button>
      ),
      style: { width: 110 },
    },
  ];
  return (
    <div className="card">
      <div className="card-head">
        <div className="card-title">Documentos comerciales</div>
        <Button variant="accent" size="sm" icon="upload">
          Subir factura
        </Button>
      </div>
      <Table<Invoice> columns={cols} rows={rows} />
    </div>
  );
}
