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
import { teacherListProps } from "@/actions/dashboardAction";
import { gradeListProps } from "@/actions/gradeActions";
import { useIsMobile } from "@/hooks/use-mobile";
import TanstackTable from "../tableComponent/TanstackTable";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  teacherList: teacherListProps[] | null;
  gradeList: gradeListProps[] | null;
  data: TData[];
}

export function ClassListDataTable<TData, TValue>({
  columns,
  teacherList,
  gradeList,
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
        grade: false,
        capacity: false,
        studentCount: false,
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
      <ClassListDataTableViewOptions
        table={table}
        teacherList={teacherList}
        gradeList={gradeList}
      />
      <TanstackTable table={table} columns={columns} />
    </div>
  );
}
