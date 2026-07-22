import type { ReactNode } from "react";
import { EmptyState } from "./EmptyState";
import { FileText } from "lucide-react";

export interface DataTableColumn<T> {
  header: string;
  accessor?: keyof T;
  render?: (item: T) => ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: DataTableColumn<T>[];
  emptyTitle?: string;
  emptyDescription?: string;
}

export function DataTable<T>({
  data,
  columns,
  emptyTitle = "Nenhum registro encontrado",
  emptyDescription = "Não existem dados para exibir no momento.",
}: DataTableProps<T>) {
  if (data.length === 0) {
    return (
      <EmptyState
        icon={FileText}
        title={emptyTitle}
        description={emptyDescription}
      />
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.header}
                  className={`px-4 py-3 font-semibold ${column.className ?? ""}`}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 bg-white">
            {data.map((item, index) => (
              <tr key={index} className="transition hover:bg-slate-50">
                {columns.map((column) => (
                  <td
                    key={column.header}
                    className={`px-4 py-4 text-slate-600 ${column.className ?? ""}`}
                  >
                    {column.render
                      ? column.render(item)
                      : column.accessor
                        ? String(item[column.accessor])
                        : null}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}