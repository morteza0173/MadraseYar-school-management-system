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
import { UseQueryResult } from "@tanstack/react-query";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  teacherList: teacherListProps[] | null;
  gradeList: gradeListProps[] | null;
  data: TData[];
  isClassPending: boolean;
  isClassError: boolean;
  ClassRefetch: UseQueryResult<TData[]>["refetch"];
  isTeacherPending: boolean;
  isTeacherError: boolean;
  teacherRefetch: UseQueryResult<teacherListProps[]>["refetch"];
  isGradePending: boolean;
  isGradeError: boolean;
  gradeRefetch: UseQueryResult<gradeListProps[]>["refetch"];
}

export function ClassListDataTable<TData, TValue>({
  columns,
  teacherList,
  gradeList,
  data,
  isClassPending,
  isClassError,
  ClassRefetch,
  isTeacherPending,
  isTeacherError,
  teacherRefetch,
  isGradePending,
  isGradeError,
  gradeRefetch,
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
        isTeacherPending={isTeacherPending}
        isTeacherError={isTeacherError}
        teacherRefetch={teacherRefetch}
        isGradePending={isGradePending}
        isGradeError={isGradeError}
        gradeRefetch={gradeRefetch}
        table={table}
        teacherList={teacherList}
        gradeList={gradeList}
      />
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
