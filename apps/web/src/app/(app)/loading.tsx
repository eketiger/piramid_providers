export default function Loading() {
  return (
    <div className="page-body">
      <div className="card card-pad flex items-center gap-3" style={{ color: "var(--fg3)" }}>
        <span
          aria-hidden
          className="inline-block h-4 w-4 animate-spin rounded-full border-2"
          style={{
            borderColor: "var(--border-strong)",
            borderTopColor: "var(--accent)",
          }}
        />
        <span className="text-sm">Cargando…</span>
      </div>
    </div>
  );
}
