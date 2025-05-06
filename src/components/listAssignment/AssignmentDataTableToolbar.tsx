"use client";

import { Table } from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { useUserAuth } from "@/hooks/useUserAuth";
import { useState } from "react";
import ResponsiveModalForm from "../ResponsiveModalForm";
import { AssignmentDataTableViewOptions } from "./AssignmentDataTableViewOptions";
import DeleteAssignmentsForm from "./DeleteAssignmentForm";
import { useGetClassDetails } from "@/hooks/useGetClassDetails";
import DeleteSelectedButton from "../tableComponent/deleteSelectedButton";
import ResetFilterButton from "../tableComponent/resetFilterButton";
import { DataTableFacetedFilter } from "../tableComponent/data-table-faceted-filter";
import DataFilterToggle from "../tableComponent/DataFilterToggle";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function AssignmentDataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const closeDelete = () => setIsOpenDelete(false);
  const openDelete = () => setIsOpenDelete(true);

  const { userData } = useUserAuth(["admin", "teacher", "student", "parent"]);
  const { data: ClassData } = useGetClassDetails(userData);

  const className = ClassData?.map((Class) => ({
    value: Class?.name,
    label: Class?.name,
  }));

  const selectedIds = table
    .getFilteredSelectedRowModel()
    .rows.map((row) => (row.original as { id: number }).id);

  return (
    <>
      <ResponsiveModalForm
        isOpen={isOpenDelete}
        setIsOpen={setIsOpenDelete}
        close={closeDelete}
        title="حذف امتحان‌های انتخاب شده"
        discription="میتوانید به صورت یکجا امتحان‌های انتخاب شده را حذف کنید"
      >
        <DeleteAssignmentsForm onCancel={closeDelete} ids={selectedIds} />
      </ResponsiveModalForm>
      <div className="flex flex-wrap items-center justify-between">
        <div className="flex w-full md:w-auto flex-wrap items-center gap-2 flex-col md:flex-row">
          <Input
            placeholder="جستجو بر اساس عنوان"
            value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
            onChange={(event) => {
              table.getColumn("title")?.setFilterValue(event.target.value);
            }}
            className="h-8 w-full md:w-[150px] lg:w-[250px]"
          />
          <DataTableFacetedFilter
            table={table}
            column="className"
            title="کلاس"
            options={className || []}
          />
          <DataFilterToggle
            table={table}
            column="dueDate"
            filterValue="upcoming"
            title="فقط تکالیف پیش‌رو"
          />
          <ResetFilterButton table={table} />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto mt-2 md:mt-0">
          <DeleteSelectedButton table={table} openDelete={openDelete} />
          <AssignmentDataTableViewOptions table={table} />
        </div>
      </div>
    </>
  );
}
