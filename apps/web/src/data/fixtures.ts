// Mock data ported from the HTML prototype's data.jsx.
// Pure deterministic fixtures; no state mutation.

import type { IconName } from "@/lib/icons";

export type VerticalKey = "hogar" | "taller" | "medico" | "logistica";

export type Vertical = {
  label: string;
  icon: IconName;
  categories: string[];
  companies: string[];
  jobTitles: string[];
  cities: string[];
};

export const VERTICALS: Record<VerticalKey, Vertical> = {
  hogar: {
    label: "Hogar / Electro",
    icon: "home",
    categories: [
      "Electro línea blanca",
      "Electro pequeño",
      "Plomería",
      "Electricidad",
      "Aire acondicionado",
      "Cerrajería",
      "Pintura",
    ],
    companies: [
      "Seguros Alfa",
      "La Caja",
      "Galeno Asistencia",
      "Zurich Hogar",
      "HDI Residencial",
      "Mapfre Hogar",
      "SURA Asistencia",
    ],
    jobTitles: [
      "Heladera no enfría",
      "Pérdida cañería bajo pileta",
      "Tablero eléctrico disparado",
      "Split no prende",
      "Lavarropas filtra agua",
      "Termotanque sin gas",
      "Cerradura trabada",
      "Filtración en techo",
      "Ventana rota",
      "Puerta descolgada",
    ],
    cities: [
      "CABA — Palermo",
      "CABA — Belgrano",
      "Vicente López",
      "San Isidro",
      "La Plata",
      "Tigre",
      "Quilmes",
      "Pilar",
      "Morón",
      "Avellaneda",
    ],
  },
  taller: {
    label: "Taller automotor",
    icon: "wrench",
    categories: [
      "Chapa y pintura",
      "Mecánica general",
      "Electricidad auto",
      "Cristales",
      "Neumáticos",
      "Grúa",
    ],
    companies: [
      "La Segunda Autos",
      "Federación Patronal",
      "San Cristóbal",
      "Rivadavia Seguros",
      "Orbis Autos",
      "HDI Autos",
    ],
    jobTitles: [
      "Impacto trasero bumper",
      "Tercer stop roto",
      "Parabrisas rajado",
      "Portón abollado",
      "Faro delantero dañado",
      "Espejo retrovisor",
      "Puerta lado conductor",
      "Capot fuelle dañado",
    ],
    cities: [
      "CABA — Villa Crespo",
      "Vicente López",
      "San Martín",
      "San Isidro",
      "Lomas de Zamora",
      "La Matanza",
      "Tigre",
      "Pilar",
    ],
  },
  medico: {
    label: "Proveedor médico",
    icon: "stethoscope",
    categories: [
      "Kinesiología domicilio",
      "Enfermería",
      "Psicología",
      "Nutrición",
      "Traslados",
      "Médico clínico",
    ],
    companies: ["Galeno Salud", "OSDE Asistencia", "Swiss Medical", "Medicus", "Prevención Salud"],
    jobTitles: [
      "Kinesio post-operatorio",
      "Control post-parto",
      "Curación heridas",
      "Toma de presión",
      "Asistencia pre-quirúrgica",
      "Rehabilitación columna",
    ],
    cities: [
      "CABA — Recoleta",
      "CABA — Caballito",
      "La Plata",
      "Tigre",
      "San Isidro",
      "Vicente López",
      "Quilmes",
    ],
  },
  logistica: {
    label: "Logística / Repuestos",
    icon: "truck",
    categories: [
      "Transporte refrigerado",
      "Courier urgente",
      "Repuestos OEM",
      "Repuestos aftermarket",
      "Almacenaje",
    ],
    companies: ["Zurich Flotas", "Allianz Logística", "Mapfre Corp.", "HDI Corp."],
    jobTitles: [
      "Envío repuesto urgente",
      "Retiro equipo dañado",
      "Logística pieza crítica",
      "Devolución garantía",
      "Entrega certificado",
    ],
    cities: ["Centro logístico Tigre", "Puerto Madero", "Pacheco", "Quilmes", "Pilar", "La Plata"],
  },
};

import type { Estado } from "@/components/ui";
export type { Estado };

export const ESTADOS_LIC: Estado[] = [
  { key: "abierta", label: "Abierta", variant: "info" },
  { key: "cotizada", label: "Cotizada", variant: "accent" },
  { key: "en_revision", label: "En revisión", variant: "warning" },
  { key: "adjudicada", label: "Adjudicada", variant: "success" },
  { key: "perdida", label: "Perdida", variant: "danger" },
  { key: "vencida", label: "Vencida", variant: "neutral" },
];

export const ESTADOS_OR: Estado[] = [
  { key: "asignada", label: "Asignada", variant: "info" },
  { key: "agendada", label: "Agendada", variant: "accent" },
  { key: "en_curso", label: "En curso", variant: "warning" },
  { key: "diag_subido", label: "Diagnóstico cargado", variant: "accent" },
  { key: "pendiente_aprobacion", label: "Pendiente aprobación", variant: "warning" },
  { key: "en_ejecucion", label: "En ejecución", variant: "info" },
  { key: "finalizada", label: "Finalizada", variant: "success" },
  { key: "facturada", label: "Facturada", variant: "success" },
  { key: "rechazada", label: "Rechazada", variant: "danger" },
];

function seeded(i: number): number {
  const x = Math.sin(i * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}

function pick<T>(arr: T[], i: number): T {
  return arr[Math.floor(seeded(i) * arr.length) % arr.length];
}

export type Sla = { pct: number; horasRestantes: number; etapa: string };

export type BidAttachment = { nombre: string; tipo: "pdf" | "image" };

export type Bid = {
  id: string;
  vertical: VerticalKey;
  verticalLabel: string;
  titulo: string;
  categoria: string;
  empresa: string;
  ciudad: string;
  fechaRegistro: string;
  fechaRegistroHora: string;
  fechaLimite: string;
  estado: Estado;
  monto: number;
  sla: Sla;
  cliente: string;
  descripcion: string;
  adjuntos: BidAttachment[];
  tiempoEstimado: string;
  competidores: number;
};

const VKS: VerticalKey[] = ["hogar", "taller", "medico", "logistica"];

export const BIDS: Bid[] = Array.from({ length: 58 }, (_, i) => {
  const vk = VKS[i % 4];
  const v = VERTICALS[vk];
  const est = ESTADOS_LIC[Math.floor(seeded(i + 11) * ESTADOS_LIC.length)];
  const days = [1, 2, 3, 5, 7, 10][Math.floor(seeded(i + 3) * 6)];
  const hoursRemaining = Math.floor(seeded(i + 5) * 72) - 12;
  return {
    id: `LIC-${2026}${String(1000 + i).padStart(4, "0")}`,
    vertical: vk,
    verticalLabel: v.label,
    titulo: pick(v.jobTitles, i),
    categoria: pick(v.categories, i + 1),
    empresa: pick(v.companies, i + 2),
    ciudad: pick(v.cities, i + 3),
    fechaRegistro: `${String((i % 28) + 1).padStart(2, "0")}/04/2026`,
    fechaRegistroHora: `${String(8 + (i % 10)).padStart(2, "0")}:${String((i * 7) % 60).padStart(2, "0")}`,
    fechaLimite: `${String(((i + days) % 28) + 1).padStart(2, "0")}/04/2026`,
    estado: est,
    monto: Math.floor(seeded(i + 7) * 950000) + 50000,
    sla: {
      pct: Math.min(95, Math.floor(seeded(i + 9) * 100)),
      horasRestantes: hoursRemaining,
      etapa: "Cotización",
    },
    cliente: [
      "María L.",
      "Juan P.",
      "Carolina E.",
      "Tomás R.",
      "Ana V.",
      "Diego S.",
      "Paula M.",
      "Laura G.",
    ][i % 8],
    descripcion:
      "Se requiere cotización y propuesta de ejecución en base a diagnóstico. Presupuesto desglosado por mano de obra y repuestos. Plazo estimado de ejecución incluido.",
    adjuntos: [
      { nombre: "foto-1.jpg", tipo: "image" },
      { nombre: "informe-inicial.pdf", tipo: "pdf" },
    ],
    tiempoEstimado: `${Math.floor(seeded(i + 13) * 6) + 1}-${Math.floor(seeded(i + 13) * 6) + 3} días`,
    competidores: Math.floor(seeded(i + 21) * 8) + 2,
  };
});

export type Etapa = { nombre: string; done: boolean; pct: number };

export type Order = {
  id: string;
  vertical: VerticalKey;
  verticalLabel: string;
  titulo: string;
  tipo: string;
  empresa: string;
  cliente: string;
  clienteTel: string;
  direccion: string;
  fechaInicio: string;
  fechaFin: string;
  estado: Estado;
  monto: number;
  sla: Sla & { etapas: Etapa[] };
  prioridad: "baja" | "normal" | "alta" | "urgente";
  retrabajo: boolean;
};

const ORDER_VKS: VerticalKey[] = ["hogar", "hogar", "hogar", "taller", "medico", "logistica"];

export const ORDERS: Order[] = Array.from({ length: 56 }, (_, i) => {
  const vk = ORDER_VKS[i % 6];
  const v = VERTICALS[vk];
  const est = ESTADOS_OR[Math.floor(seeded(i + 31) * ESTADOS_OR.length)];
  const startDay = ((i * 3) % 28) + 1;
  const endDay = Math.min(28, startDay + Math.floor(seeded(i + 41) * 7) + 1);
  const prioridad = (["baja", "normal", "alta", "urgente"] as const)[i % 4];
  return {
    id: `ORD-${2026}${String(5000 + i).padStart(4, "0")}`,
    vertical: vk,
    verticalLabel: v.label,
    titulo: pick(v.jobTitles, i + 99),
    tipo: pick(v.categories, i + 33),
    empresa: pick(v.companies, i + 35),
    cliente: [
      "María López",
      "Juan Pérez",
      "Carolina Esses",
      "Tomás Rivero",
      "Ana Vidal",
      "Diego Suárez",
      "Paula Méndez",
      "Laura García",
      "Jorge Beltrán",
      "Sofía Aranda",
      "Martín Ocampo",
      "Valentina Rizzo",
    ][i % 12],
    clienteTel: `+54 9 11 4${String(100 + i).padStart(3, "0")}-${String(2000 + i * 3).padStart(4, "0")}`,
    direccion:
      pick(v.cities, i + 37) +
      ", calle " +
      ["Corrientes", "Rivadavia", "Santa Fe", "Cabildo", "Libertador", "9 de Julio", "Callao"][
        i % 7
      ] +
      " " +
      (1000 + i * 13),
    fechaInicio: `${String(startDay).padStart(2, "0")}/04/2026`,
    fechaFin: `${String(endDay).padStart(2, "0")}/04/2026`,
    estado: est,
    monto: Math.floor(seeded(i + 43) * 850000) + 80000,
    sla: {
      pct: Math.min(98, Math.floor(seeded(i + 45) * 100)),
      horasRestantes: Math.floor(seeded(i + 47) * 96) - 16,
      etapa: ["Diagnóstico", "Presupuesto", "Ejecución", "Cierre"][i % 4],
      etapas: [
        { nombre: "Diagnóstico", done: true, pct: 100 },
        { nombre: "Presupuesto", done: i % 4 > 0, pct: i % 4 > 0 ? 100 : 40 },
        { nombre: "Ejecución", done: i % 4 > 1, pct: i % 4 > 1 ? 100 : 0 },
        {
          nombre: "Cierre",
          done: est.key === "finalizada" || est.key === "facturada",
          pct: est.key === "finalizada" || est.key === "facturada" ? 100 : 0,
        },
      ],
    },
    prioridad,
    retrabajo: i % 17 === 0,
  };
});

export type Visit = {
  id: string;
  ordenId: string;
  titulo: string;
  cliente: string;
  direccion: string;
  motivo: string;
  fecha: string;
  hora: string;
  duracion: number;
  estado: "agendada" | "en_curso" | "realizada" | "reprogramada" | "cancelada";
  comentarios: string;
  tecnico: string;
};

export const VISITS: Visit[] = Array.from({ length: 34 }, (_, i) => {
  const orden = ORDERS[i % ORDERS.length];
  const day = ((i * 5) % 28) + 1;
  const hour = 8 + (i % 10);
  const estado = (
    ["agendada", "agendada", "en_curso", "realizada", "reprogramada", "cancelada"] as const
  )[i % 6];
  return {
    id: `VIS-${3000 + i}`,
    ordenId: orden.id,
    titulo: orden.titulo,
    cliente: orden.cliente,
    direccion: orden.direccion,
    motivo: ["Diagnóstico", "Retiro", "Reparación", "Control final", "Entrega de presupuesto"][
      i % 5
    ],
    fecha: `2026-04-${String(day).padStart(2, "0")}`,
    hora: `${String(hour).padStart(2, "0")}:${["00", "30"][i % 2]}`,
    duracion: [30, 45, 60, 90, 120][i % 5],
    estado,
    comentarios: i % 3 === 0 ? "Cliente confirmó por WhatsApp. Llevar repuesto." : "",
    tecnico: ["Martín Ocampo", "Valentina Rizzo", "Julián Sosa", "Laura García"][i % 4],
  };
});

export type Notif = {
  id: number;
  tipo: string;
  icon: IconName;
  titulo: string;
  detalle: string;
  tiempo: string;
  leido: boolean;
  critico: boolean;
};

export const NOTIFS: Notif[] = [
  {
    id: 1,
    tipo: "bid",
    icon: "gavel",
    titulo: "Nueva licitación recibida",
    detalle: "LIC-20261042 · Heladera no enfría · Seguros Alfa",
    tiempo: "hace 4 min",
    leido: false,
    critico: false,
  },
  {
    id: 2,
    tipo: "sla",
    icon: "timer",
    titulo: "SLA por vencer",
    detalle: "ORD-20265012 vence en 2h 15min — cargar diagnóstico",
    tiempo: "hace 12 min",
    leido: false,
    critico: true,
  },
  {
    id: 3,
    tipo: "comment",
    icon: "message-square",
    titulo: "Nueva observación del tramitador",
    detalle: 'ORD-20265018 · "Adjuntar foto del daño en detalle"',
    tiempo: "hace 34 min",
    leido: false,
    critico: false,
  },
  {
    id: 4,
    tipo: "order",
    icon: "clipboard-check",
    titulo: "Orden asignada",
    detalle: "ORD-20265055 · Split no prende · La Caja",
    tiempo: "hace 1 h",
    leido: false,
    critico: false,
  },
  {
    id: 5,
    tipo: "doc",
    icon: "file-check-2",
    titulo: "Presupuesto aprobado",
    detalle: "ORD-20265009 · Podés iniciar ejecución",
    tiempo: "hace 2 h",
    leido: true,
    critico: false,
  },
  {
    id: 6,
    tipo: "invoice",
    icon: "receipt",
    titulo: "Factura conformada",
    detalle: "ORD-20265001 · Pago estimado 28/04/2026",
    tiempo: "hace 5 h",
    leido: true,
    critico: false,
  },
  {
    id: 7,
    tipo: "bid",
    icon: "gavel",
    titulo: "Licitación adjudicada",
    detalle: "LIC-20261011 — felicitaciones, se generó la ORD-20265056",
    tiempo: "hace 8 h",
    leido: true,
    critico: false,
  },
  {
    id: 8,
    tipo: "score",
    icon: "trending-up",
    titulo: "Tu score subió a 4.7",
    detalle: "Seguís entre el top 10% de proveedores",
    tiempo: "ayer",
    leido: true,
    critico: false,
  },
  {
    id: 9,
    tipo: "doc",
    icon: "file-warning",
    titulo: "Documentación por vencer",
    detalle: "Certificado AFIP vence en 11 días",
    tiempo: "ayer",
    leido: true,
    critico: false,
  },
  {
    id: 10,
    tipo: "visit",
    icon: "calendar",
    titulo: "Visita confirmada por cliente",
    detalle: "VIS-3012 · Jueves 23/04 · 10:30",
    tiempo: "ayer",
    leido: true,
    critico: false,
  },
];

export type Activity = {
  icon: IconName;
  titulo: string;
  detalle: string;
  actor: string;
  tiempo: string;
};

export function makeActivity(_orderId: string): Activity[] {
  return [
    {
      icon: "file-plus",
      titulo: "Orden creada",
      detalle: "Asignada desde LIC-20261011",
      actor: "Sistema",
      tiempo: "19/04/2026 09:02",
    },
    {
      icon: "user-check",
      titulo: "Proveedor aceptó la orden",
      detalle: "Dentro del SLA de respuesta (28 min)",
      actor: "Vos",
      tiempo: "19/04/2026 09:30",
    },
    {
      icon: "calendar-plus",
      titulo: "Visita agendada",
      detalle: "Jueves 23/04/2026 10:30 — Diagnóstico",
      actor: "Vos",
      tiempo: "19/04/2026 11:14",
    },
    {
      icon: "message-square",
      titulo: "Mensaje del tramitador",
      detalle: '"Por favor confirmar con el asegurado antes de la visita"',
      actor: "E. Niefeld",
      tiempo: "19/04/2026 15:47",
    },
    {
      icon: "camera",
      titulo: "Diagnóstico cargado",
      detalle: "3 fotos · Informe técnico (PDF 1.2 MB)",
      actor: "Vos",
      tiempo: "20/04/2026 10:18",
    },
    {
      icon: "check-circle-2",
      titulo: "Presupuesto enviado",
      detalle: "$ 342.900 · 2 ítems (mano de obra + repuesto)",
      actor: "Vos",
      tiempo: "20/04/2026 14:22",
    },
  ];
}

export type ProviderDoc = {
  nombre: string;
  estado: "aprobado" | "por_vencer" | "pendiente";
  vence: string;
};

export const PROVIDER = {
  nombre: "Técnica Austral S.R.L.",
  cuit: "30-71298764-3",
  responsable: "Ezequiel Niefeld",
  email: "en@revelaciondata.com.ar",
  telefono: "+54 9 11 5123-4587",
  descripcion:
    "Servicio técnico de electrodomésticos línea blanca y climatización. 14 años de experiencia, equipo de 6 técnicos certificados. Cobertura CABA + GBA Norte.",
  verticalPrimario: "hogar" as VerticalKey,
  categorias: ["Electro línea blanca", "Aire acondicionado", "Electro pequeño"],
  productos: ["Heladeras", "Lavarropas", "Secarropas", "Split", "Microondas", "Lavavajillas"],
  certificaciones: ["BGH oficial", "Samsung certificado", "Whirlpool authorized"],
  score: 4.7,
  cumplimientoSLA: 94,
  tiempoRespuesta: "00:27",
  satisfaccion: 4.8,
  volumen: 127,
  retrabajos: 2.1,
  calidad: 4.6,
  cobertura: [
    "CABA",
    "Vicente López",
    "San Isidro",
    "San Martín",
    "Tigre",
    "Pilar",
    "Olivos",
    "Martínez",
  ],
  horarios: "Lun–Vie 08:00–19:00 · Sáb 09:00–13:00",
  logo: null,
  estadoOnboarding: "aprobado",
  tiempoPromedio: "1.8 días",
  costoVisita: 18500,
  docs: [
    { nombre: "Constancia AFIP", estado: "aprobado", vence: "15/03/2027" },
    { nombre: "Póliza ART", estado: "aprobado", vence: "02/09/2026" },
    { nombre: "Habilitación municipal", estado: "por_vencer", vence: "03/05/2026" },
    { nombre: "Certificado BGH", estado: "aprobado", vence: "—" },
  ] as ProviderDoc[],
};
