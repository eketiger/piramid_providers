"use client";

import * as React from "react";
import { Button, EstadoBadge, Icon, IconButton, Pill, Table } from "@/components/ui";

type Attachment = {
  id: number;
  nombre: string;
  tipo: "pdf" | "image";
  tam: string;
  fecha: string;
  estado: "aprobado" | "pendiente";
  ronda: number;
};

export default function ReportesPage() {
  const [dragging, setDragging] = React.useState(false);
  const files: Attachment[] = [
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

  return (
    <div className="page-body">
      <div className="card">
        <div className="card-head">
          <div>
            <div className="card-title">Cargar evidencias y documentos</div>
            <div className="card-sub">
              Adjuntá diagnósticos, fotos, presupuestos, facturas o recibos
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <select className="select" style={{ width: 200 }}>
              <option>Tipo: Diagnóstico</option>
              <option>Presupuesto</option>
              <option>Factura</option>
              <option>Recibo</option>
              <option>Foto adicional</option>
            </select>
          </div>
        </div>

        <div style={{ padding: 20 }}>
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragging(false);
            }}
            style={{
              border: `2px dashed ${dragging ? "var(--accent)" : "var(--border-strong)"}`,
              borderRadius: 12,
              padding: 32,
              textAlign: "center",
              background: dragging ? "var(--accent-wash)" : "#FBFAF5",
              transition: "background 200ms",
              cursor: "pointer",
            }}
          >
            <div
              style={{
                display: "inline-flex",
                width: 48,
                height: 48,
                borderRadius: 12,
                background: "#fff",
                border: "1px solid var(--border)",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 10,
              }}
            >
              <Icon name="upload-cloud" size={22} style={{ color: "var(--accent)" }} />
            </div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>Arrastrá archivos aquí o</div>
            <div style={{ marginTop: 8 }}>
              <Button variant="accent" size="sm" icon="upload">
                Seleccionar archivos
              </Button>
            </div>
            <div style={{ fontSize: 11.5, color: "var(--fg3)", marginTop: 10 }}>
              PDF, JPG, PNG o MP4 · hasta 25 MB por archivo
            </div>
          </div>
        </div>
      </div>

      <div style={{ height: 16 }} />

      <div className="card">
        <div className="card-head">
          <div className="card-title">Archivos cargados</div>
          <Pill variant="info">Ronda 2 de revisión</Pill>
        </div>
        <Table<Attachment>
          columns={[
            {
              header: "Archivo",
              render: (r) => (
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 6,
                      background: r.tipo === "pdf" ? "var(--danger-wash)" : "var(--info-wash)",
                      color: r.tipo === "pdf" ? "var(--danger)" : "var(--info)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Icon name={r.tipo === "pdf" ? "file-text" : "image"} size={14} />
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>{r.nombre}</div>
                    <div style={{ fontSize: 11, color: "var(--fg3)" }}>{r.tam}</div>
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
                <div style={{ display: "flex", gap: 4 }}>
                  <IconButton icon="eye" title="Ver" />
                  <IconButton icon="download" title="Descargar" />
                  <IconButton icon="trash-2" title="Eliminar" />
                </div>
              ),
              style: { width: 120 },
            },
          ]}
          rows={files}
        />
      </div>

      <div style={{ height: 16 }} />

      <div className="card card-pad">
        <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: "var(--warning-wash)",
              color: "var(--warning)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Icon name="message-square-warning" size={16} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13.5, fontWeight: 600 }}>Observación del tramitador</div>
            <div
              style={{
                fontSize: 12.5,
                color: "var(--fg2)",
                marginTop: 4,
                lineHeight: 1.5,
              }}
            >
              &quot;Adjuntar una foto adicional del compresor desde el lateral y una descripción del
              modelo exacto en el informe. Volver a subir presupuesto con garantía desglosada.&quot;
            </div>
            <div style={{ fontSize: 11, color: "var(--fg3)", marginTop: 6 }}>
              E. Niefeld · 21/04/2026 14:47
            </div>
            <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
              <Button variant="accent" size="sm" icon="reply">
                Responder
              </Button>
              <Button variant="ghost" size="sm" icon="check">
                Marcar como resuelto
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
