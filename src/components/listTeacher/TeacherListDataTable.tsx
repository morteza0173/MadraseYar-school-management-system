"use client";

import * as React from "react";
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

import { TeacherDataTableToolbar } from "./TeacherDataTableToolbar";
import { UseQueryResult } from "@tanstack/react-query";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Loader2, TriangleAlert } from "lucide-react";
import { Button } from "../ui/button";
import { DataTablePagination } from "../tableComponent/data-table-pagination";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isTeacherDataError: boolean;
  isTeacherDataPending: boolean;
  teacherDataRefetch: UseQueryResult<TData[]>["refetch"];
}

export function TeacherListDataTable<TData, TValue>({
  columns,
  data,
  isTeacherDataError,
  teacherDataRefetch,
  isTeacherDataPending,
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);

  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        // در حالت موبایل ستون‌های خاصی مخفی شوند
        setColumnVisibility({
          phone: false,
          classes: true,
          subject: false,
          eventOnGoing: false,
        });
      } else {
        // در حالت دسکتاپ ستون‌ها نمایش داده شوند
        setColumnVisibility({
          phone: true,
          subject: true,
          classes: true,
          eventOnGoing: true,
        });
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

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
    <div className="space-y-2 ">
      <TeacherDataTableToolbar table={table} />
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
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="even:bg-gray-100"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      className="px-1 md:px-2 lg:px-4 py-2  text-xs md:text-sm"
                      key={cell.id}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  <div className="flex items-center justify-center h-full w-full">
                    {isTeacherDataPending ? (
                      <div className="flex gap-2 items-center">
                        <Loader2 className="size-4 animate-spin" />
                        <p>در حال دریافت اطلاعات</p>
                      </div>
                    ) : isTeacherDataError ? (
                      <div className="flex gap-2 items-center">
                        <TriangleAlert className="size-4" />
                        <p>مشکلی در دریافت اطلاعات به وجود آمد</p>
                        <Button variant="outline" onClick={() => teacherDataRefetch()}>
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
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}
