export function Avatar({
  name,
  size = 28,
  color,
}: {
  name: string;
  size?: number;
  color?: string;
}) {
  const initials = (name || "??")
    .split(/\s+/)
    .slice(0, 2)
    .map((s) => s[0] || "")
    .join("")
    .toUpperCase();
  const seed = (name || "").charCodeAt(0) || 0;
  const bgs = ["#FDEBD9", "#E4F4EB", "#E1EEFB", "#F0E4FB", "#FBE4EB", "#EFEDE4"];
  const fgs = ["#A04E18", "#1E7A48", "#1F5999", "#6928A6", "#9A2A3E", "#4A4A4E"];
  const idx = seed % bgs.length;
  return (
    <span
      aria-hidden
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: size,
        height: size,
        borderRadius: 999,
        flexShrink: 0,
        background: color || bgs[idx],
        color: fgs[idx],
        fontSize: size * 0.38,
        fontWeight: 600,
        letterSpacing: "-0.01em",
      }}
    >
      {initials}
    </span>
  );
}
