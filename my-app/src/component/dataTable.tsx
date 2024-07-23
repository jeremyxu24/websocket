import React from "react";
// import '../styles/index.css';
import {
    Column,
    Table,
    ColumnDef,
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    flexRender,
    RowData,
} from '@tanstack/react-table';
import { faker } from '@faker-js/faker';


export type Person = {
    firstName: string;
    lastName: string;
    age: number;
    visits: number;
    progress: number;
    status: 'relationship' | 'complicated' | 'single';
    subRows?: Person[];
};

export default function DataTable() {

    // const rerender = React.useReducer(() => ({}), {})[1];

    // const columns = React.useMemo<ColumnDef<Person>[]>(
    //     () => [
    //         {
    //             header: 'Name',
    //             footer: (props) => props.column.id,
    //             columns: [
    //                 {
    //                     accessorKey: 'firstName',
    //                     footer: (props) => props.column.id,
    //                 },
    //                 {
    //                     accessorFn: (row) => row.lastName,
    //                     id: 'lastName',
    //                     header: () => <span>Last Name</span>,
    //                     footer: (props) => props.column.id,
    //                 },
    //             ],
    //         },
    //         {
    //             header: 'Info',
    //             footer: (props) => props.column.id,
    //             columns: [
    //                 {
    //                     accessorKey: 'age',
    //                     header: () => 'Age',
    //                     footer: (props) => props.column.id,
    //                 },
    //                 {
    //                     header: 'More Info',
    //                     columns: [
    //                         {
    //                             accessorKey: 'visits',
    //                             header: () => <span>Visits</span>,
    //                             footer: (props) => props.column.id,
    //                         },
    //                         {
    //                             accessorKey: 'status',
    //                             header: 'Status',
    //                             footer: (props) => props.column.id,
    //                         },
    //                         {
    //                             accessorKey: 'progress',
    //                             header: 'Profile Progress',
    //                             footer: (props) => props.column.id,
    //                         },
    //                     ],
    //                 },
    //             ],
    //         },
    //     ],
    //     []
    // );

    // const [data, setData] = React.useState(() => makeData(1000));
    // const refreshData = () => setData(() => makeData(1000));

    // const [autoResetPageIndex, skipAutoResetPageIndex] = useSkipper();

    // const table = useReactTable({
    //     data,
    //     columns,
    //     defaultColumn,
    //     getCoreRowModel: getCoreRowModel(),
    //     getFilteredRowModel: getFilteredRowModel(),
    //     getPaginationRowModel: getPaginationRowModel(),
    //     autoResetPageIndex,
    //     meta: {
    //         updateData: (rowIndex, columnId, value) => {
    //             skipAutoResetPageIndex();
    //             setData((old) =>
    //                 old.map((row, index) => {
    //                     if (index === rowIndex) {
    //                         return {
    //                             ...old[rowIndex]!,
    //                             [columnId]: value,
    //                         };
    //                     }
    //                     return row;
    //                 })
    //             );
    //         },
    //     },
    //     debugTable: true,
    // });

    // return (
    //     <div className="p-2">
    //         <div className="h-2" />
    //         <table>
    //             <thead>
    //                 {table.getHeaderGroups().map((headerGroup) => (
    //                     <tr key={headerGroup.id}>
    //                         {headerGroup.headers.map((header) => (
    //                             <th key={header.id} colSpan={header.colSpan}>
    //                                 {header.isPlaceholder ? null : (
    //                                     <div>
    //                                         {flexRender(
    //                                             header.column.columnDef.header,
    //                                             header.getContext()
    //                                         )}
    //                                         {header.column.getCanFilter() ? (
    //                                             <div>
    //                                                 <Filter column={header.column} table={table} />
    //                                             </div>
    //                                         ) : null}
    //                                     </div>
    //                                 )}
    //                             </th>
    //                         ))}
    //                     </tr>
    //                 ))}
    //             </thead>
    //             <tbody>
    //                 {table.getRowModel().rows.map((row) => (
    //                     <tr key={row.id}>
    //                         {row.getVisibleCells().map((cell) => (
    //                             <td key={cell.id}>
    //                                 {flexRender(cell.column.columnDef.cell, cell.getContext())}
    //                             </td>
    //                         ))}
    //                     </tr>
    //                 ))}
    //             </tbody>
    //         </table>
    //         <div className="h-2" />
    //         <div className="flex items-center gap-2">
    //             <button
    //                 className="border rounded p-1"
    //                 onClick={() => table.setPageIndex(0)}
    //                 disabled={!table.getCanPreviousPage()}
    //             >
    //                 {'<<'}
    //             </button>
    //             <button
    //                 className="border rounded p-1"
    //                 onClick={() => table.previousPage()}
    //                 disabled={!table.getCanPreviousPage()}
    //             >
    //                 {'<'}
    //             </button>
    //             <button
    //                 className="border rounded p-1"
    //                 onClick={() => table.nextPage()}
    //                 disabled={!table.getCanNextPage()}
    //             >
    //                 {'>'}
    //             </button>
    //             <button
    //                 className="border rounded p-1"
    //                 onClick={() => table.setPageIndex(table.getPageCount() - 1)}
    //                 disabled={!table.getCanNextPage()}
    //             >
    //                 {'>>'}
    //             </button>
    //             <span className="flex items-center gap-1">
    //                 <div>Page</div>
    //                 <strong>
    //                     {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
    //                 </strong>
    //             </span>
    //             <span className="flex items-center gap-1">
    //                 | Go to page:
    //                 <input
    //                     type="number"
    //                     defaultValue={table.getState().pagination.pageIndex + 1}
    //                     onChange={(e) => {
    //                         const page = e.target.value ? Number(e.target.value) - 1 : 0;
    //                         table.setPageIndex(page);
    //                     }}
    //                     className="border p-1 rounded w-16"
    //                 />
    //             </span>
    //             <select
    //                 value={table.getState().pagination.pageSize}
    //                 onChange={(e) => {
    //                     table.setPageSize(Number(e.target.value));
    //                 }}
    //             >
    //                 {[10, 20, 30, 40, 50].map((pageSize) => (
    //                     <option key={pageSize} value={pageSize}>
    //                         Show {pageSize}
    //                     </option>
    //                 ))}
    //             </select>
    //         </div>
    //         <div>{table.getRowModel().rows.length} Rows</div>
    //         <div>
    //             <button onClick={() => rerender()}>Force Rerender</button>
    //         </div>
    //         <div>
    //             <button onClick={() => refreshData()}>Refresh Data</button>
    //         </div>
    //     </div>
    // );
    return (<></>)
}