const page = () => {
  return <div>page</div>;
};
export default page;
// این صفحه صرفا یک ایده هوش مصنوعی برای صفحه ی حضور غیاب هست که اینجا قرار داده شده

// "use client";

// import * as React from "react";
// import {
//   ColumnDef,
//   flexRender,
//   getCoreRowModel,
//   getFilteredRowModel,
//   getPaginationRowModel,
//   getSortedRowModel,
//   useReactTable,
// } from "@tanstack/react-table";

// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { DataTablePagination } from "@/components/listTeacher/data-table-pagination";
// import { DataTableToolbar } from "@/components/listTeacher/data-table-toolbar";

// interface DataTableProps<TData, TValue> {
//   columns: ColumnDef<TData, TValue>[];
//   data: TData[];
// }

// export function DataTable<TData, TValue>({
//   columns,
//   data,
// }: DataTableProps<TData, TValue>) {
//   const [rowSelection, setRowSelection] = React.useState({});
//   const [columnVisibility, setColumnVisibility] = React.useState({});
//   const [columnFilters, setColumnFilters] = React.useState([]);
//   const [sorting, setSorting] = React.useState([]);

//   React.useEffect(() => {
//     const handleResize = () => {
//       if (window.innerWidth < 768) {
//         setColumnVisibility({
//           note: false,
//           category: false,
//           type: false,
//           amount: false,
//           date: false,
//         });
//       } else {
//         setColumnVisibility({
//           note: true,
//           category: true,
//           type: true,
//           amount: true,
//           date: true,
//         });
//       }
//     };

//     window.addEventListener("resize", handleResize);
//     handleResize();
//     return () => {
//       window.removeEventListener("resize", handleResize);
//     };
//   }, []);

//   const table = useReactTable({
//     data,
//     columns,
//     state: {
//       sorting,
//       columnVisibility,
//       rowSelection,
//       columnFilters,
//     },
//     enableRowSelection: true,
//     onRowSelectionChange: setRowSelection,
//     onSortingChange: setSorting,
//     onColumnFiltersChange: setColumnFilters,
//     onColumnVisibilityChange: setColumnVisibility,
//     getCoreRowModel: getCoreRowModel(),
//     getFilteredRowModel: getFilteredRowModel(),
//     getPaginationRowModel: getPaginationRowModel(),
//     getSortedRowModel: getSortedRowModel(),
//   });

//   return (
//     <div className="space-y-2">
//       <DataTableToolbar table={table} />
//       <div className="overflow-y-auto rounded-md border">
//         <Table>
//           <TableHeader>
//             {table.getHeaderGroups().map((headerGroup) => (
//               <TableRow key={headerGroup.id}>
//                 {headerGroup.headers.map((header) => (
//                   <TableHead
//                     className="px-4 py-2"
//                     key={header.id}
//                     colSpan={header.colSpan}
//                   >
//                     {header.isPlaceholder
//                       ? null
//                       : flexRender(
//                           header.column.columnDef.header,
//                           header.getContext()
//                         )}
//                   </TableHead>
//                 ))}
//               </TableRow>
//             ))}
//           </TableHeader>
//           <TableBody>
//             {table.getRowModel().rows?.length ? (
//               table.getRowModel().rows.map((row) => (
//                 <TableRow
//                   key={row.id}
//                   data-state={row.getIsSelected() && "selected"}
//                   className="even:bg-gray-100"
//                 >
//                   {row.getVisibleCells().map((cell) => (
//                     <TableCell className="px-4 py-2" key={cell.id}>
//                       {flexRender(
//                         cell.column.columnDef.cell,
//                         cell.getContext()
//                       )}
//                     </TableCell>
//                   ))}
//                 </TableRow>
//               ))
//             ) : (
//               <TableRow>
//                 <TableCell
//                   colSpan={columns.length}
//                   className="h-24 text-center"
//                 >
//                   نتیجه‌ای یافت نشد
//                 </TableCell>
//               </TableRow>
//             )}
//           </TableBody>
//         </Table>
//       </div>
//       <DataTablePagination table={table} />
//     </div>
//   );
// }

// const AttendanceTable = () => {
//   const [data, setData] = React.useState([
//     { name: "شخص 1", absentDates: ["2025-01-01", "2025-01-03"] },
//     { name: "شخص 2", absentDates: ["2025-01-02", "2025-01-04"] },
//   ]);

//   const [selectedDate, setSelectedDate] = React.useState({
//     year: new Date().getFullYear(),
//     month: new Date().getMonth() + 1,
//   });

//   const daysInMonth = (month, year) => new Date(year, month, 0).getDate();

//   const isAbsent = (absentDates, day) => {
//     const formattedDay = `${selectedDate.year}-${String(
//       selectedDate.month
//     ).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
//     return absentDates.includes(formattedDay);
//   };

//   const toggleAbsent = (personIndex, day) => {
//     const updatedData = [...data];
//     const person = updatedData[personIndex];
//     const formattedDay = `${selectedDate.year}-${String(
//       selectedDate.month
//     ).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

//     if (person.absentDates.includes(formattedDay)) {
//       person.absentDates = person.absentDates.filter(
//         (date) => date !== formattedDay
//       );
//     } else {
//       person.absentDates.push(formattedDay);
//     }

//     setData(updatedData);

//     // ارسال تاریخ غیبت به سرور
//     console.log(`Updated absence for ${person.name}:`, person.absentDates);
//   };

//   const columns = React.useMemo(() => {
//     const dayColumns = Array.from(
//       { length: daysInMonth(selectedDate.month, selectedDate.year) },
//       (_, i) => {
//         const day = i + 1;
//         return {
//           accessorKey: `day-${day}`,
//           header: () => day.toString(),
//           cell: ({ row }) => (
//             <span
//               style={{
//                 cursor: "pointer",
//                 color: isAbsent(row.original.absentDates, day)
//                   ? "red"
//                   : "green",
//               }}
//               onClick={() => toggleAbsent(row.index, day)}
//             >
//               {isAbsent(row.original.absentDates, day) ? "🔴" : "🟢"}
//             </span>
//           ),
//         };
//       }
//     );

//     return [
//       {
//         accessorKey: "name",
//         header: "نام",
//         cell: (info) => info.getValue(),
//       },
//       ...dayColumns,
//     ];
//   }, [data, selectedDate]);

//   return <DataTable columns={columns} data={data} />;
// };

// export default AttendanceTable;
