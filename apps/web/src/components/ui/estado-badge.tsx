import { Pill, type PillVariant } from "./pill";

export type Estado = { key: string; label: string; variant: PillVariant };

export function EstadoBadge({ estado, size }: { estado?: Estado; size?: "sm" | "lg" }) {
  if (!estado) return null;
  return (
    <Pill variant={estado.variant} size={size} dot>
      {estado.label}
    </Pill>
  );
}
