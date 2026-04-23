import * as React from "react";
import { Icon } from "./icon";
import type { IconName } from "@/lib/icons";

export function EmptyState({
  icon = "inbox",
  title = "Sin resultados",
  body,
  action,
}: {
  icon?: IconName;
  title?: string;
  body?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="empty">
      <div className="empty-icon">
        <Icon name={icon} size={22} />
      </div>
      <div className="empty-title">{title}</div>
      {body && <div className="empty-body">{body}</div>}
      {action}
    </div>
  );
}
