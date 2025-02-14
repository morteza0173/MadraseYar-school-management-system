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
  return (
    <>
      <div className="overflow-y-auto rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    className="px-4 py-2"
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
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="even:bg-gray-100"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell className="px-4 py-2" key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
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
                        <Loader2 className="size-4 animate-spin" />
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
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </>
  );
};
export default TanstackTable;
