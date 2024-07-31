import React, { CSSProperties } from "react";
import { CSS } from '@dnd-kit/utilities'
import { useSortable } from '@dnd-kit/sortable'
import { Cell, flexRender } from "@tanstack/react-table";

type Person = {
    firstName: string
    lastName: string
    age: number
    visits: number
    progress: number
    status: 'relationship' | 'complicated' | 'single'
    subRows?: Person[]
}

const DragAlongCell = ({ cell }: { cell: Cell<Person, unknown> }) => {
    const { isDragging, setNodeRef, transform } = useSortable({
        id: cell.column.id,
    })

    const style: CSSProperties = {
        opacity: isDragging ? 0.8 : 1,
        position: 'relative',
        transform: CSS.Translate.toString(transform), // translate instead of transform to avoid squishing
        transition: 'width transform 0.2s ease-in-out',
        width: cell.column.getSize(),
        zIndex: isDragging ? 1 : 0,
    }

    return (
        <td style={style} ref={setNodeRef}>
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </td>
    )
}

export default DragAlongCell;