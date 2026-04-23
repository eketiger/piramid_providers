import { Button, EstadoBadge, Icon, IconButton, Pill, Table } from "@/components/ui";

type File = {
  id: number;
  nombre: string;
  tipo: "pdf" | "image";
  tam: string;
  fecha: string;
  estado: "aprobado" | "pendiente";
  ronda: number;
};

const FILES: File[] = [
  {
    id: 1,
    nombre: "diagnostico-inicial.pdf",
    tipo: "pdf",
    tam: "1.2 MB",
    fecha: "20/04/2026",
    estado: "aprobado",
    ronda: 1,
  },
  {
    id: 2,
    nombre: "foto-daño-01.jpg",
    tipo: "image",
    tam: "3.8 MB",
    fecha: "20/04/2026",
    estado: "aprobado",
    ronda: 1,
  },
  {
    id: 3,
    nombre: "foto-daño-02.jpg",
    tipo: "image",
    tam: "2.1 MB",
    fecha: "20/04/2026",
    estado: "aprobado",
    ronda: 1,
  },
  {
    id: 4,
    nombre: "presupuesto-v2.pdf",
    tipo: "pdf",
    tam: "480 KB",
    fecha: "21/04/2026",
    estado: "pendiente",
    ronda: 2,
  },
];

export function ReportesTab() {
  return (
    <div className="card">
      <div className="card-head">
        <div className="card-title">Archivos cargados</div>
        <div className="flex gap-2">
          <Pill variant="info">Ronda 2 de revisión</Pill>
          <Button size="sm" variant="accent" icon="upload">
            Subir archivo
          </Button>
        </div>
      </div>
      <Table<File>
        columns={[
          {
            header: "Archivo",
            render: (r) => (
              <div className="flex items-center gap-2.5">
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-md"
                  style={{
                    background: r.tipo === "pdf" ? "var(--danger-wash)" : "var(--info-wash)",
                    color: r.tipo === "pdf" ? "var(--danger)" : "var(--info)",
                  }}
                >
                  <Icon name={r.tipo === "pdf" ? "file-text" : "image"} size={14} />
                </div>
                <div>
                  <div className="text-[13px] font-medium">{r.nombre}</div>
                  <div className="text-[11px]" style={{ color: "var(--fg3)" }}>
                    {r.tam}
                  </div>
                </div>
              </div>
            ),
          },
          {
            header: "Tipo",
            render: (r) => (r.tipo === "pdf" ? "Documento" : "Imagen"),
            style: { width: 110 },
          },
          { header: "Ronda", render: (r) => `Ronda ${r.ronda}`, style: { width: 90 } },
          {
            header: "Subido",
            render: (r) => (
              <span className="mono" style={{ color: "var(--fg2)" }}>
                {r.fecha}
              </span>
            ),
            style: { width: 110 },
          },
          {
            header: "Estado",
            render: (r) => (
              <EstadoBadge
                estado={{
                  key: r.estado,
                  label: r.estado,
                  variant: r.estado === "aprobado" ? "success" : "warning",
                }}
              />
            ),
            style: { width: 150 },
          },
          {
            header: "",
            render: () => (
              <div className="flex gap-1">
                <IconButton icon="eye" title="Ver" />
                <IconButton icon="download" title="Descargar" />
                <IconButton icon="trash-2" title="Eliminar" />
              </div>
            ),
            style: { width: 120 },
          },
        ]}
        rows={FILES}
      />
    </div>
  );
}
