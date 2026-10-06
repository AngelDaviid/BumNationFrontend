"use client";

import {
  Cell,
  ColumnDef,
  flexRender,
  getCoreRowModel,
  Row,
  useReactTable,
} from "@tanstack/react-table";
import { Button } from "./button";
import {Loader} from "@/components/ui/loader";
import { cn } from "@/lib/utils/utils";
import { ReactNode } from "react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isLoading?: boolean;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  page?: number;
  totalPages?: number;
  onNextPage?: () => void;
  onPrevPage?: () => void;
  onRowClick?: (row: TData) => void;
  tableClassName?: string;
  toolbar?: ReactNode;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  isLoading,
  searchValue,
  onSearchChange,
  searchPlaceholder = "Buscar...",
  page,
  totalPages,
  onNextPage,
  onPrevPage,
  onRowClick,
  tableClassName,
  toolbar,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const showSearch = onSearchChange !== undefined;
  const showPagination = onNextPage && onPrevPage && page && totalPages;
  const rows = table.getRowModel().rows;

  return (
    <div className="flex flex-col gap-2 p-3">
      {(toolbar || showSearch) && (
        <div className="flex flex-wrap items-center gap-2">
          {showSearch && (
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchValue ?? ""}
            onChange={(event) => onSearchChange?.(event.target.value)}
            className="w-full sm:max-w-xs bg-zinc-100 text-zinc-800 placeholder-zinc-400 rounded-md px-3 py-2 text-sm sm:py-1.5 sm:text-xs outline-none focus:ring-2 focus:ring-[#6BFF3C] transition-shadow"
          />
          )}
          {toolbar && <div className="ml-auto">{toolbar}</div>}
        </div>
      )}

      <div className="relative min-h-40 lg:hidden">
        {rows.length ? (
          <ul className="flex flex-col gap-2">
            {rows.map((row) => (
              <MobileCard key={row.id} row={row} onClick={onRowClick} />
            ))}
          </ul>
        ) : !isLoading ? (
          <p className="py-10 text-center text-sm text-zinc-400">Sin resultados.</p>
        ) : null}

        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/60">
            <Loader size="lg" tone="dark" />
          </div>
        )}
      </div>

      <div className={cn("relative hidden min-h-80 rounded-lg border border-zinc-200 overflow-hidden overflow-x-auto lg:block", tableClassName)}>
        <table className="w-full text-xs">
          <thead className="bg-zinc-50 border-b border-zinc-200">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-3 py-2 text-center text-[11px] font-medium uppercase tracking-wide text-zinc-500 whitespace-nowrap"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody className="divide-y divide-zinc-100">
            {rows.length ? (
              rows.map((row) => (
                <tr
                  key={row.id}
                  className={cn("hover:bg-zinc-50 transition-colors", onRowClick && "cursor-pointer")}
                  onClick={() => onRowClick?.(row.original)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-3 py-1.5 text-zinc-800 whitespace-nowrap">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            ) : !isLoading ? (
              <tr>
                <td colSpan={columns.length} className="h-16 text-center text-zinc-400">
                  Sin resultados.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>

        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/60">
            <Loader size="lg" tone="dark" />
          </div>
        )}
      </div>

      {showPagination && (
        <div className="flex items-center justify-between gap-2 py-2">
          <p className="text-xs text-zinc-500">
            Página {page} de {totalPages}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onPrevPage}
              disabled={page <= 1}
              className="h-9 px-3 text-sm sm:h-7 sm:px-2 sm:text-xs"
            >
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onNextPage}
              disabled={page >= totalPages}
              className="h-9 px-3 text-sm sm:h-7 sm:px-2 sm:text-xs"
            >
              Siguiente
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function getMobileRole<TData>(cell: Cell<TData, unknown>) {
  const role = cell.column.columnDef.meta?.mobile;
  if (role) return role;
  return cell.column.id === "actions" ? "actions" : "field";
}

function renderCell<TData>(cell: Cell<TData, unknown>) {
  return flexRender(cell.column.columnDef.cell, cell.getContext());
}

function MobileCard<TData>({ row, onClick }: { row: Row<TData>; onClick?: (row: TData) => void }) {
  const cells = row.getVisibleCells();
  const byRole = (role: string) => cells.filter((cell) => getMobileRole(cell) === role);

  const media = byRole("media");
  const titles = byRole("title");
  const fields = byRole("field");
  const actions = byRole("actions");

  return (
    <li
      className={cn(
        "rounded-lg border border-zinc-200 bg-white p-3 text-sm text-zinc-800",
        onClick && "cursor-pointer active:bg-zinc-50"
      )}
      onClick={() => onClick?.(row.original)}
    >
      {(media.length > 0 || titles.length > 0) && (
        <div className="mb-2 flex items-center gap-3">
          {media.map((cell) => (
            <div key={cell.id} className="shrink-0">{renderCell(cell)}</div>
          ))}
          <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-1 font-semibold">
            {titles.map((cell) => (
              <span key={cell.id} className="min-w-0 break-words">{renderCell(cell)}</span>
            ))}
          </div>
        </div>
      )}

      {fields.length > 0 && (
        <dl className="flex flex-col gap-1.5 text-xs">
          {fields.map((cell) => {
            const header = cell.column.columnDef.header;
            return (
              <div key={cell.id} className="flex items-center justify-between gap-3">
                <dt className="shrink-0 text-zinc-500">{typeof header === "string" ? header : cell.column.id}</dt>
                <dd className="min-w-0 text-right break-words [&_*]:justify-end">{renderCell(cell)}</dd>
              </div>
            );
          })}
        </dl>
      )}

      {actions.length > 0 && (
        <div className="mt-3 flex justify-end border-t border-zinc-100 pt-2" onClick={(e) => e.stopPropagation()}>
          {actions.map((cell) => (
            <div key={cell.id}>{renderCell(cell)}</div>
          ))}
        </div>
      )}
    </li>
  );
}
