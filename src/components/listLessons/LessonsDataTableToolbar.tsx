"use client";

import { Table } from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { useUserAuth } from "@/hooks/useUserAuth";
import { LessonsListDataTableViewOptions } from "./LessonsListDataTableViewOptions";
import ResponsiveModalForm from "../ResponsiveModalForm";
import { useState } from "react";
import DeleteLessonsForm from "./DeleteLessonsForm";
import { useGetClassDetails } from "@/hooks/useGetClassDetails";
import { useGetSubjects } from "@/hooks/useGetSubjects";
import DeleteSelectedButton from "../tableComponent/deleteSelectedButton";
import ResetFilterButton from "../tableComponent/resetFilterButton";
import { DataTableFacetedFilter } from "../tableComponent/data-table-faceted-filter";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function LessonsDataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const closeDelete = () => setIsOpenDelete(false);
  const openDelete = () => setIsOpenDelete(true);

  const { userData } = useUserAuth(["admin", "teacher", "student", "parent"]);
  const { data: subjectData } = useGetSubjects(userData);
  const { data: ClassData } = useGetClassDetails(userData);

  const subjectName = subjectData?.map((subject) => ({
    value: subject?.name,
    label: subject?.name,
  }));
  const className = ClassData?.map((Class) => ({
    value: Class?.name,
    label: Class?.name,
  }));

  const selectedIds = table
    .getFilteredSelectedRowModel()
    .rows.map((row) => (row.original as { lessonId: number }).lessonId);

  return (
    <>
      <ResponsiveModalForm
        isOpen={isOpenDelete}
        setIsOpen={setIsOpenDelete}
        close={closeDelete}
        title="حذف درس های انتخاب شده"
        discription="میتوانید با حذف کردن درس های انتخاب شده آنها را از برنامه هفتگی حذف کنید"
      >
        <DeleteLessonsForm onCancel={closeDelete} ids={selectedIds} />
      </ResponsiveModalForm>
      <div className="flex flex-wrap items-center justify-between w-full gap-2">
        <div className="flex w-full md:w-auto flex-wrap items-center gap-2 flex-col md:flex-row">
          <Input
            placeholder="جستجو ..."
            value={table.getState().globalFilter ?? ""}
            onChange={(event) => table.setGlobalFilter(event.target.value)}
            className="h-8 w-full md:w-[150px] lg:w-[250px]"
          />
          <DataTableFacetedFilter
            table={table}
            column="subjectName"
            title="حوزه تدریس"
            options={subjectName || []}
          />
          <DataTableFacetedFilter
            table={table}
            column="className"
            title="کلاس‌ها"
            options={className || []}
          />
          <ResetFilterButton table={table} />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto md:mt-0">
          <DeleteSelectedButton table={table} openDelete={openDelete} />
          <LessonsListDataTableViewOptions table={table} />
        </div>
      </div>
    </>
  );
}
