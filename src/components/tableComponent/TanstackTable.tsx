import {
  ColumnDef,
  flexRender,
  Table as tableTanstack,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { DataTablePagination } from "./data-table-pagination";
import { UseQueryResult } from "@tanstack/react-query";
import { Loader2, TriangleAlert } from "lucide-react";
import { Button } from "../ui/button";
import { AnimatePresence, motion } from "motion/react";

import { useEffect, useState } from "react";

const MotionTableRow = motion.create(TableRow);

interface DataTableProps<TData, TValue> {
  isPending: boolean;
  isError: boolean;
  refetch: UseQueryResult<TData[]>["refetch"];
  columns: ColumnDef<TData, TValue>[];
  table: tableTanstack<TData>;
}

const TanstackTable = <TData, TValue>({
  isPending,
  isError,
  refetch,
  columns,
  table,
}: DataTableProps<TData, TValue>) => {
  const [hasMountedOnce, setHasMountedOnce] = useState(false);
  useEffect(() => {
    if (!isPending) {
      setHasMountedOnce(true);
    }
  }, [isPending]);

  return (
    <>
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
            <AnimatePresence>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <MotionTableRow
                    initial={
                      hasMountedOnce
                        ? { opacity: 0, height: 0, backgroundColor: "#bbf7d0" }
                        : { opacity: 0, height: 0 }
                    }
                    animate={{
                      opacity: 1,
                      height: "auto",
                      backgroundColor:
                        row.index % 2 === 0 ? "#ffffff" : "#f3f4f6",
                    }}
                    exit={{ backgroundColor: "#fca5a5" }}
                    transition={{
                      opacity: { duration: 0.5 },
                      height: { duration: 0.5 },
                      backgroundColor: { duration: 1 },
                    }}
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className="even:bg-gray-100 odd:bg-[#ffffff]"
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
                  </MotionTableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    <div className="flex items-center justify-center h-full w-full">
                      {isPending ? (
                        <div className="flex gap-2 items-center">
                          <Loader2 className="animate-spin w-4 h-4" />
                          <p>در حال دریافت اطلاعات</p>
                        </div>
                      ) : isError ? (
                        <div className="flex gap-2 items-center">
                          <TriangleAlert className="size-4" />
                          <p>مشکلی در دریافت اطلاعات به وجود آمد</p>
                          <Button variant="outline" onClick={() => refetch()}>
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
            </AnimatePresence>
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </>
  );
};
export default TanstackTable;
