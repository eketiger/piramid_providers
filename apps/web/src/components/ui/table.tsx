import * as React from "react";
import { EmptyState } from "./empty-state";
import type { IconName } from "@/lib/icons";

export type Column<T> = {
  header: React.ReactNode;
  key?: keyof T;
  render?: (row: T, i: number) => React.ReactNode;
  style?: React.CSSProperties;
  cellStyle?: React.CSSProperties;
};

export function Table<T extends { id?: string | number }>({
  columns,
  rows,
  onRowClick,
  selectedId,
  empty,
}: {
  columns: Column<T>[];
  rows: T[];
  onRowClick?: (row: T) => void;
  selectedId?: string | number;
  empty?: { icon?: IconName; title?: string; body?: string };
}) {
  if (!rows.length) {
    return (
      <div className="tbl-wrap">
        <EmptyState {...(empty || {})} />
      </div>
    );
  }
  return (
    <div className="tbl-wrap">
      <table className="tbl">
        <thead>
          <tr>
            {columns.map((c, i) => (
              <th key={i} style={c.style} scope="col">
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr
              key={r.id ?? i}
              className={selectedId === r.id ? "selected" : ""}
              onClick={onRowClick ? () => onRowClick(r) : undefined}
              onKeyDown={
                onRowClick
                  ? (e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        onRowClick(r);
                      }
                    }
                  : undefined
              }
              tabIndex={onRowClick ? 0 : undefined}
              role={onRowClick ? "button" : undefined}
            >
              {columns.map((c, j) => (
                <td key={j} style={c.cellStyle}>
                  {c.render ? c.render(r, i) : c.key ? (r[c.key] as React.ReactNode) : null}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
