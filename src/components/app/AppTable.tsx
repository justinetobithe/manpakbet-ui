"use client";

import * as React from "react";
import {
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
    type ColumnDef,
    type RowData,
    type SortingState,
} from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ChevronsUpDown, Loader2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { PaginationMeta } from "@/types/Api";
import AppEmpty from "./AppEmpty";

declare module "@tanstack/react-table" {
    interface ColumnMeta<TData extends RowData, TValue> {
        className?: string;
        headerClassName?: string;
        align?: "left" | "right" | "center";
        hideOnMobile?: boolean;
        _types?: [TData, TValue];
    }
}

export type AppTableSort = { id: string; desc: boolean } | null;

type AppTableProps<T> = {
    columns: ColumnDef<T, unknown>[];
    data: T[] | undefined;
    isLoading?: boolean;
    isFetching?: boolean;
    meta?: PaginationMeta;
    onPageChange?: (page: number) => void;
    pageSize?: number;
    onPageSizeChange?: (size: number) => void;
    sort?: AppTableSort;
    onSortChange?: (sort: AppTableSort) => void;
    toolbar?: React.ReactNode;
    emptyTitle?: string;
    emptyDescription?: React.ReactNode;
    emptyIcon?: React.ReactNode;
    onRowClick?: (row: T) => void;
    getRowId?: (row: T, index: number) => string;
    renderMobileCard?: (row: T) => React.ReactNode;
    className?: string;
    pageSizes?: number[];
};

const alignClass = (align?: "left" | "right" | "center") => (align === "right" ? "text-right" : align === "center" ? "text-center" : "text-left");

export default function AppTable<T>({
    columns,
    data,
    isLoading,
    isFetching,
    meta,
    onPageChange,
    pageSize = 15,
    onPageSizeChange,
    sort,
    onSortChange,
    toolbar,
    emptyTitle = "No records found",
    emptyDescription,
    emptyIcon,
    onRowClick,
    getRowId,
    renderMobileCard,
    className,
    pageSizes = [10, 15, 25, 50],
}: AppTableProps<T>) {
    "use no memo";
    const serverMode = Boolean(meta);
    const [localSorting, setLocalSorting] = React.useState<SortingState>([]);
    const [localPagination, setLocalPagination] = React.useState({ pageIndex: 0, pageSize });

    const sorting: SortingState = serverMode ? (sort ? [sort] : []) : localSorting;
    const rows = React.useMemo(() => data ?? [], [data]);

    const table = useReactTable({
        data: rows,
        columns,
        getRowId,
        state: serverMode ? { sorting } : { sorting, pagination: localPagination },
        manualPagination: serverMode,
        manualSorting: serverMode,
        enableSortingRemoval: true,
        pageCount: serverMode ? meta?.last_page : undefined,
        onSortingChange: (updater) => {
            const next = typeof updater === "function" ? updater(sorting) : updater;
            if (serverMode) onSortChange?.(next[0] ?? null);
            else setLocalSorting(next);
        },
        onPaginationChange: serverMode ? undefined : setLocalPagination,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: serverMode ? undefined : getSortedRowModel(),
        getPaginationRowModel: serverMode ? undefined : getPaginationRowModel(),
    });

    const currentPage = serverMode ? (meta?.current_page ?? 1) : localPagination.pageIndex + 1;
    const lastPage = serverMode ? Math.max(meta?.last_page ?? 1, 1) : Math.max(table.getPageCount(), 1);
    const total = serverMode ? (meta?.total ?? 0) : rows.length;
    const effectivePageSize = serverMode ? (meta?.per_page ?? pageSize) : localPagination.pageSize;
    const from = total === 0 ? 0 : (currentPage - 1) * effectivePageSize + 1;
    const to = Math.min(currentPage * effectivePageSize, total);

    const goTo = (page: number) => {
        const target = Math.min(Math.max(page, 1), lastPage);
        if (serverMode) onPageChange?.(target);
        else table.setPageIndex(target - 1);
    };

    const changeSize = (size: number) => {
        if (serverMode) onPageSizeChange?.(size);
        else setLocalPagination({ pageIndex: 0, pageSize: size });
    };

    const visibleRows = table.getRowModel().rows;
    const showSkeleton = isLoading && rows.length === 0;

    return (
        <div className={cn("surface overflow-hidden rounded-2xl", className)}>
            {toolbar ? <div className="flex flex-col gap-3 border-b border-border p-3 sm:flex-row sm:flex-wrap sm:items-center sm:p-4">{toolbar}</div> : null}

            <div className="relative">
                {isFetching && !showSkeleton ? (
                    <div className="absolute top-0 right-0 left-0 z-10 h-0.5 overflow-hidden">
                        <div className="h-full w-1/3 animate-[marquee_1.1s_linear_infinite] bg-gold" />
                    </div>
                ) : null}

                {renderMobileCard ? (
                    <div className="divide-y divide-border md:hidden">
                        {showSkeleton
                            ? Array.from({ length: 5 }).map((_, index) => (
                                  <div key={index} className="p-4">
                                      <Skeleton className="h-16 w-full" />
                                  </div>
                              ))
                            : visibleRows.map((row) => (
                                  <div
                                      key={row.id}
                                      className={cn("p-4", onRowClick && "cursor-pointer active:bg-fg/3")}
                                      onClick={onRowClick ? () => onRowClick(row.original) : undefined}
                                  >
                                      {renderMobileCard(row.original)}
                                  </div>
                              ))}
                    </div>
                ) : null}

                <div className={cn(renderMobileCard && "hidden md:block")}>
                    <Table>
                        <TableHeader>
                            {table.getHeaderGroups().map((group) => (
                                <TableRow key={group.id} className="hover:bg-transparent">
                                    {group.headers.map((header) => {
                                        const columnMeta = header.column.columnDef.meta;
                                        const canSort = header.column.getCanSort();
                                        const sorted = header.column.getIsSorted();
                                        return (
                                            <TableHead
                                                key={header.id}
                                                className={cn(alignClass(columnMeta?.align), columnMeta?.headerClassName, columnMeta?.hideOnMobile && "hidden lg:table-cell")}
                                                style={{ width: header.getSize() !== 150 ? header.getSize() : undefined }}
                                            >
                                                {header.isPlaceholder ? null : canSort ? (
                                                    <button
                                                        type="button"
                                                        onClick={header.column.getToggleSortingHandler()}
                                                        className={cn("inline-flex items-center gap-1 uppercase transition hover:text-foreground", sorted && "text-gold-300")}
                                                    >
                                                        {flexRender(header.column.columnDef.header, header.getContext())}
                                                        {sorted === "asc" ? <ArrowUp className="size-3" /> : sorted === "desc" ? <ArrowDown className="size-3" /> : <ChevronsUpDown className="size-3 opacity-50" />}
                                                    </button>
                                                ) : (
                                                    flexRender(header.column.columnDef.header, header.getContext())
                                                )}
                                            </TableHead>
                                        );
                                    })}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {showSkeleton
                                ? Array.from({ length: Math.min(effectivePageSize, 8) }).map((_, index) => (
                                      <TableRow key={index} className="hover:bg-transparent">
                                          {columns.map((_, cellIndex) => (
                                              <TableCell key={cellIndex}>
                                                  <Skeleton className="h-5 w-full max-w-[160px]" />
                                              </TableCell>
                                          ))}
                                      </TableRow>
                                  ))
                                : visibleRows.map((row) => (
                                      <TableRow
                                          key={row.id}
                                          className={cn(onRowClick && "cursor-pointer")}
                                          onClick={onRowClick ? () => onRowClick(row.original) : undefined}
                                      >
                                          {row.getVisibleCells().map((cell) => {
                                              const columnMeta = cell.column.columnDef.meta;
                                              return (
                                                  <TableCell
                                                      key={cell.id}
                                                      className={cn(alignClass(columnMeta?.align), columnMeta?.className, columnMeta?.hideOnMobile && "hidden lg:table-cell")}
                                                  >
                                                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                  </TableCell>
                                              );
                                          })}
                                      </TableRow>
                                  ))}
                        </TableBody>
                    </Table>
                </div>

                {!showSkeleton && visibleRows.length === 0 ? <AppEmpty compact title={emptyTitle} description={emptyDescription} icon={emptyIcon} /> : null}
            </div>

            <div className="flex flex-col gap-3 border-t border-border px-3 py-3 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-4">
                <div className="flex items-center gap-3">
                    <span>
                        Showing <span className="font-semibold text-foreground">{formatNumber(from)}</span>–<span className="font-semibold text-foreground">{formatNumber(to)}</span> of{" "}
                        <span className="font-semibold text-foreground">{formatNumber(total)}</span>
                    </span>
                    {isFetching ? <Loader2 className="size-3.5 animate-spin text-gold-300" /> : null}
                </div>
                <div className="flex items-center justify-between gap-3 sm:justify-end">
                    {serverMode && !onPageSizeChange ? null : (
                        <Select value={String(effectivePageSize)} onValueChange={(value) => changeSize(Number(value))}>
                            <SelectTrigger className="h-8 w-[92px] rounded-lg text-xs">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {pageSizes.map((size) => (
                                    <SelectItem key={size} value={String(size)}>
                                        {size} / page
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                    <div className="flex items-center gap-1">
                        <PagerButton onClick={() => goTo(1)} disabled={currentPage <= 1} label="First page">
                            <ChevronsLeft className="size-4" />
                        </PagerButton>
                        <PagerButton onClick={() => goTo(currentPage - 1)} disabled={currentPage <= 1} label="Previous page">
                            <ChevronLeft className="size-4" />
                        </PagerButton>
                        <span className="min-w-16 text-center font-semibold text-foreground tabular-nums">
                            {currentPage} / {lastPage}
                        </span>
                        <PagerButton onClick={() => goTo(currentPage + 1)} disabled={currentPage >= lastPage} label="Next page">
                            <ChevronRight className="size-4" />
                        </PagerButton>
                        <PagerButton onClick={() => goTo(lastPage)} disabled={currentPage >= lastPage} label="Last page">
                            <ChevronsRight className="size-4" />
                        </PagerButton>
                    </div>
                </div>
            </div>
        </div>
    );
}

function PagerButton({ children, onClick, disabled, label }: { children: React.ReactNode; onClick: () => void; disabled?: boolean; label: string }) {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            aria-label={label}
            className="grid size-8 place-items-center rounded-lg border border-border bg-fg/3 text-foreground transition hover:bg-fg/8 disabled:pointer-events-none disabled:opacity-35"
        >
            {children}
        </button>
    );
}
