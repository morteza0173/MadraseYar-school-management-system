"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { UseQueryResult } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Loader2, TriangleAlert } from "lucide-react";
import { Button } from "../ui/button";
import { DataTablePagination } from "../tableComponent/data-table-pagination";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { Table as ReactTableInstance } from "@tanstack/react-table";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  query: {
    data?: TData[];
    isError: boolean;
    isPending: boolean;
    refetch: UseQueryResult<TData[]>["refetch"];
  };
  mobileVisibility?: VisibilityState;
  desktopVisibility?: VisibilityState;
  children?: (table: ReactTableInstance<TData>) => React.ReactNode;
}
const MotionTableRow = motion.create(TableRow);

export function ReusableDataTable<TData, TValue>({
  columns,
  query,
  mobileVisibility,
  desktopVisibility,
  children,
}: DataTableProps<TData, TValue>) {
  const { data: queryData, isPending, isError, refetch } = query;
  const [data, setData] = useState<TData[]>([]);

  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);

  useEffect(() => {
    setData(queryData || []);
  }, [queryData]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setColumnVisibility(mobileVisibility || {});
      } else {
        setColumnVisibility(desktopVisibility || {});
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [mobileVisibility, desktopVisibility]);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  return (
    <div className="space-y-2">
      {children?.(table)}
      <div className="overflow-y-auto rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    className="px-1 md:px-2 lg:px-4 py-2 text-xs md:text-sm"
                    key={header.id}
                    colSpan={header.colSpan}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            <AnimatePresence>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <MotionTableRow
                    layout
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    transition={{
                      opacity: { duration: 0.5 },
                      height: { duration: 0.5 },
                      backgroundColor: { duration: 1 },
                    }}
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className="even:bg-gray-100 odd:bg-[#ffffff]"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        className="px-1 md:px-2 lg:px-4 py-2 text-xs md:text-sm"
                        key={cell.id}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </MotionTableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    <div className="flex items-center justify-center h-full w-full">
                      {isPending ? (
                        <div className="flex gap-2 items-center">
                          <Loader2 className="size-4 animate-spin" />
                          <p>در حال دریافت اطلاعات</p>
                        </div>
                      ) : isError ? (
                        <div className="flex gap-2 items-center">
                          <TriangleAlert className="size-4" />
                          <p>مشکلی در دریافت اطلاعات به وجود آمد</p>
                          <Button variant="outline" onClick={() => refetch()}>
                            تلاش مجدد
                          </Button>
                        </div>
                      ) : (
                        "نتیجه‌ای یافت نشد"
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </AnimatePresence>
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}
