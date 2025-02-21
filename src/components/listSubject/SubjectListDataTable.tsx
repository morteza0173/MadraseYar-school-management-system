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
import { useIsMobile } from "@/hooks/use-mobile";
import TanstackTable from "../tableComponent/TanstackTable";
import { UseQueryResult } from "@tanstack/react-query";
import { SubjectListDataTableViewOptions } from "./SubjectListDataTableViewOptions";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isSubjectPending: boolean;
  isSubjectError: boolean;
  SubjectRefetch: UseQueryResult<TData[]>["refetch"];
}

export function SubjectListDataTable<TData, TValue>({
  columns,
  data,
  isSubjectPending,
  isSubjectError,
  SubjectRefetch,
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
        teacherCount: true,
        lessonCount: true,
      }));
    } else {
      setColumnVisibility({
        name: true,
        teacherCount: true,
        lessonCount: true,
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
      <SubjectListDataTableViewOptions table={table} />
      <TanstackTable
        isPending={isSubjectPending}
        isError={isSubjectError}
        refetch={SubjectRefetch}
        table={table}
        columns={columns}
      />
    </div>
  );
}
