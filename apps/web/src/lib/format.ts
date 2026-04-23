export function money(n: number | string): string {
  if (typeof n !== "number") return String(n);
  return "$ " + n.toLocaleString("es-AR", { minimumFractionDigits: 0 });
}

export function slaState(pct: number, horasRestantes: number): "ok" | "warn" | "risk" {
  if (horasRestantes < 0) return "risk";
  if (pct >= 80) return "risk";
  if (pct >= 50) return "warn";
  return "ok";
}

export function slaLabel(horasRestantes: number): string {
  if (horasRestantes < 0) return `-${Math.abs(horasRestantes)}h (breach)`;
  if (horasRestantes < 24) return `${horasRestantes}h restantes`;
  return `${Math.floor(horasRestantes / 24)}d ${horasRestantes % 24}h`;
}
