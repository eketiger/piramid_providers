import { Avatar, Icon } from "@/components/ui";
import type { Activity } from "@/data/fixtures";

export function ActividadTab({ activity }: { activity: Activity[] }) {
  return (
    <div className="card card-pad">
      <div className="relative pl-7">
        <div
          className="absolute top-2 bottom-2 left-[11px] w-[2px]"
          style={{ background: "var(--border)" }}
        />
        {activity.map((a, i) => (
          <div key={i} className="relative mb-5 flex gap-3.5">
            <div
              className="absolute top-0.5 -left-5 flex h-6 w-6 items-center justify-center rounded-full bg-white"
              style={{ border: "2px solid var(--border)" }}
            >
              <Icon name={a.icon} size={11} style={{ color: "var(--fg2)" }} />
            </div>
            <div className="flex-1">
              <div className="text-[13.5px] font-medium">{a.titulo}</div>
              <div className="mt-0.5 text-[12.5px] leading-normal" style={{ color: "var(--fg2)" }}>
                {a.detalle}
              </div>
              <div
                className="mt-1 flex items-center gap-1.5 text-[11px]"
                style={{ color: "var(--fg3)" }}
              >
                <Avatar name={a.actor} size={16} />
                <span>{a.actor}</span>
                <span>·</span>
                <span className="mono">{a.tiempo}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
