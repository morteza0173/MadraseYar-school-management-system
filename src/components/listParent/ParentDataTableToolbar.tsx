"use client";

import { Table } from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { ParentDataTableViewOptions } from "./ParentDataTableViewOptions";
import { useUserAuth } from "@/hooks/useUserAuth";
import { useGetClassDetails } from "@/hooks/useGetClassDetails";
import DeleteSelectedButton from "../tableComponent/deleteSelectedButton";
import ResetFilterButton from "../tableComponent/resetFilterButton";
import { DataTableFacetedFilter } from "../tableComponent/data-table-faceted-filter";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function ParentDataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const { userData } = useUserAuth(["admin", "teacher", "student", "parent"]);
  const { data: ClassData } = useGetClassDetails(userData);
  const className = ClassData?.map((Class) => ({
    value: Class?.name,
    label: Class?.name,
  }));

  return (
    <div className="flex flex-wrap items-center justify-between">
      <div className="flex w-full md:w-auto flex-wrap items-center gap-2 flex-col md:flex-row">
        <Input
          placeholder="بر اساس نام دانش آموز"
          value={
            (table.getColumn("students")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) => {
            table.getColumn("students")?.setFilterValue(event.target.value);
          }}
          className="h-8 w-full md:w-[150px] lg:w-[250px]"
        />
        <DataTableFacetedFilter
          table={table}
          column="classes"
          title="کلاس‌ها"
          options={className || []}
        />
        {isFiltered && <ResetFilterButton table={table} />}
      </div>

      <div className="flex items-center gap-2 w-full md:w-auto mt-2 md:mt-0">
        <DeleteSelectedButton table={table} />
        <ParentDataTableViewOptions table={table} />
      </div>
    </div>
  );
}
