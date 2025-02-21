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

import { GradeListDataTableViewOptions } from "./GradeListDataTableViewOptions";
import { useEffect, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import TanstackTable from "../tableComponent/TanstackTable";
import { UseQueryResult } from "@tanstack/react-query";

interface DataTableProps<TData, TValue> {
  isPending: boolean;
  isError: boolean;
  refetch: UseQueryResult<TData[]>["refetch"];
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function GradeListDataTable<TData, TValue>({
  isPending,
  isError,
  refetch,
  columns,
  data,
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
        students: true,
        classes: true,
      }));
    } else {
      setColumnVisibility({
        name: true,
        students: true,
        classes: true,
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
      <GradeListDataTableViewOptions table={table} />
      <TanstackTable
        isPending={isPending}
        isError={isError}
        refetch={refetch}
        table={table}
        columns={columns}
      />
    </div>
  );
}
