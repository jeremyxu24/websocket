import React, { useState } from "react";
import '../styles/tableStyle.css'
import '../styles/style.css'
import { ColumnType } from "../type/columnType";


export default function AddColumnPopper({ columns }: { columns: ColumnType[] }) {
    const [selectedColumn, setSelectedColumn] = useState<string>('')
    return (
        <div className="add-column-popper">
            <select value={selectedColumn} onChange={(e) => setSelectedColumn(e.target.value)}>
                {columns.map(column => (
                    <option value={column.columnID}>column.columnLabel</option>
                ))}
            </select>
            <div>
                Data type: {selectedColumn && columns ? columns.filter(column => column.columnID === parseInt(selectedColumn))[0].columnID : ''}
            </div>
        </div>
    )
}