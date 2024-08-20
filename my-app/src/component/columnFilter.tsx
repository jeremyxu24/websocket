import React from "react"
import { Column, Table } from "@tanstack/react-table"

export default function ColumnFilter({
    column,
    table,
}: {
    column: any
    table: Table<any>
}) {
    const columnFilterValue = column.getFilterValue()

    // return column.columnDef.datatype === 'Number' ? (
    //     <div className="flex space-x-2">
    //         <input
    //             type="number"
    //             value={(columnFilterValue as [number, number])?.[0] ?? ''}
    //             onChange={e =>
    //                 column.setFilterValue((old: [number, number]) => [
    //                     e.target.value,
    //                     old?.[1],
    //                 ])
    //             }
    //             placeholder={`Min`}
    //             className="filterInput"
    //         />
    //         <input
    //             type="number"
    //             value={(columnFilterValue as [number, number])?.[1] ?? ''}
    //             onChange={e =>
    //                 column.setFilterValue((old: [number, number]) => [
    //                     old?.[0],
    //                     e.target.value,
    //                 ])
    //             }
    //             placeholder={`Max`}
    //             className="filterInput"
    //         />
    //     </div>
    // ) : (
    //     <input
    //         type="text"
    //         value={(columnFilterValue ?? '') as string}
    //         onChange={e => column.setFilterValue(e.target.value)}
    //         placeholder={`Search...`}
    //         className="filterInput"
    //     />
    // )
    return (
        <input
            type="text"
            value={(columnFilterValue ?? '') as string}
            onChange={e => column.setFilterValue(e.target.value)}
            placeholder={`Search...`}
            className="filterInput"
        />
    )
}