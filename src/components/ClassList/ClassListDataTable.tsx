"use client";

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

import { useEffect, useState } from "react";
import { ClassListDataTableViewOptions } from "./ClassListDataTableViewOptions";

import { useIsMobile } from "@/hooks/use-mobile";
import TanstackTable from "../tableComponent/TanstackTable";
import { UseQueryResult } from "@tanstack/react-query";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];

  data: TData[];
  isClassPending: boolean;
  isClassError: boolean;
  ClassRefetch: UseQueryResult<TData[]>["refetch"];
}

export function ClassListDataTable<TData, TValue>({
  columns,
  data,
  isClassPending,
  isClassError,
  ClassRefetch,
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
        grade: false,
        capacity: true,
        studentCount: true,
        supervisor: false,
      }));
    } else {
      setColumnVisibility({
        name: true,
        grade: true,
        capacity: true,
        studentCount: true,
        supervisor: true,
      });
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
      <ClassListDataTableViewOptions table={table} />
      <TanstackTable
        isPending={isClassPending}
        isError={isClassError}
        refetch={ClassRefetch}
        table={table}
        columns={columns}
      />
    </div>
  );
}
