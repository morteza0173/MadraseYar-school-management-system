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

import { useEffect, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { UseQueryResult } from "@tanstack/react-query";
import { LessonsDataTableToolbar } from "./LessonsDataTableToolbar";
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

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isLessonsPending: boolean;
  isLessonsError: boolean;
  LessonsRefetch: UseQueryResult<TData[]>["refetch"];
}

export function LessonsListDataTable<TData, TValue>({
  columns,
  data,
  isLessonsPending,
  isLessonsError,
  LessonsRefetch,
}: DataTableProps<TData, TValue>) {
  const isMobile = useIsMobile();
  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);

  useEffect(() => {
    if (isMobile) {
      setColumnVisibility((prevState) => ({
        ...prevState,
        subjectName: false,
        teacher: false,
        endTime: false,
        className: false,
      }));
    } else {
      setColumnVisibility((prevState) => ({
        ...prevState,
        subjectName: true,
        teacher: true,
        endTime: true,
        className: true,
      }));
    }
  }, [isMobile]);

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
      <div className="flex justify-between">
        <LessonsDataTableToolbar table={table} />
      </div>
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
                    {isLessonsPending ? (
                      <div className="flex gap-2 items-center">
                        <Loader2 className="size-4 animate-spin" />
                        <p>در حال دریافت اطلاعات</p>
                      </div>
                    ) : isLessonsError ? (
                      <div className="flex gap-2 items-center">
                        <TriangleAlert className="size-4" />
                        <p>مشکلی در دریافت اطلاعات به وجود آمد</p>
                        <Button
                          variant="outline"
                          onClick={() => LessonsRefetch()}
                        >
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
