"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { TeacherDataTableToolbar } from "./TeacherDataTableToolbar";
import TanstackTable from "../tableComponent/TanstackTable";
import { UseQueryResult } from "@tanstack/react-query";

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
      <TanstackTable
        table={table}
        columns={columns}
        isError={isTeacherDataError}
        isPending={isTeacherDataPending}
        refetch={teacherDataRefetch}
      />
    </div>
  );
}
