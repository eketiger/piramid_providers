import { Avatar, Icon } from "@/components/ui";
import type { Activity } from "@/data/fixtures";

export function ActividadTab({ activity }: { activity: Activity[] }) {
  return (
    <div className="card card-pad">
      <div className="relative pl-7">
        <div
          className="absolute left-[11px] top-2 bottom-2 w-[2px]"
          style={{ background: "var(--border)" }}
        />
        {activity.map((a, i) => (
          <div key={i} className="flex gap-3.5 mb-5 relative">
            <div
              className="absolute -left-5 top-0.5 w-6 h-6 rounded-full bg-white flex items-center justify-center"
              style={{ border: "2px solid var(--border)" }}
            >
              <Icon name={a.icon} size={11} style={{ color: "var(--fg2)" }} />
            </div>
            <div className="flex-1">
              <div className="text-[13.5px] font-medium">{a.titulo}</div>
              <div
                className="text-[12.5px] mt-0.5 leading-normal"
                style={{ color: "var(--fg2)" }}
              >
                {a.detalle}
              </div>
              <div
                className="text-[11px] mt-1 flex gap-1.5 items-center"
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
