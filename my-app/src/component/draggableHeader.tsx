import React, { CSSProperties } from "react";
import { CSS } from '@dnd-kit/utilities'
import { useSortable } from '@dnd-kit/sortable'
import { Header, flexRender } from "@tanstack/react-table";

type Person = {
    firstName: string
    lastName: string
    age: number
    visits: number
    progress: number
    status: 'relationship' | 'complicated' | 'single'
    subRows?: Person[]
}

const DraggableTableHeader = ({ header, table, columnResizeMode }: { header: Header<Person, unknown>, table: any, columnResizeMode: any }) => {
    const { attributes, isDragging, listeners, setNodeRef, transform } =
        useSortable({
            id: header.column.id,
        })

    const style: CSSProperties = {
        opacity: isDragging ? 0.8 : 1,
        position: 'relative',
        transform: CSS.Translate.toString(transform), // translate instead of transform to avoid squishing
        transition: 'width transform 0.2s ease-in-out',
        whiteSpace: 'nowrap',
        width: header.column.getSize(),
        zIndex: isDragging ? 1 : 0,
    }

    return (
        <th colSpan={header.colSpan} ref={setNodeRef} style={style} key={header.id}>
            {header.isPlaceholder
                ? null
                :
                <div className='d-flex' style={{ justifyContent: 'space-evenly' }}>
                    {/* flexRender(header.column.columnDef.header, header.getContext()) */}
                    <div
                        {...{
                            className: header.column.getCanSort()
                                ? 'cursor-pointer select-none'
                                : '',
                            onClick: header.column.getToggleSortingHandler(),
                        }}
                    >
                        {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                        )}
                        {{
                            asc: ' 🔼',
                            desc: ' 🔽',
                        }[header.column.getIsSorted() as string] ?? null}
                    </div>
                    <button {...attributes} {...listeners}>
                        🟰
                    </button>
                    <div
                        {...{
                            onDoubleClick: () => header.column.resetSize(),
                            onMouseDown: header.getResizeHandler(),
                            onTouchStart: header.getResizeHandler(),
                            className: `resizer ${table.options.columnResizeDirection
                                } ${header.column.getIsResizing() ? 'isResizing' : ''
                                }`,
                            style: {
                                transform:
                                    columnResizeMode === 'onEnd' &&
                                        header.column.getIsResizing()
                                        ? `translateX(${(table.options.columnResizeDirection ===
                                            'rtl'
                                            ? -1
                                            : 1) *
                                        (table.getState().columnSizingInfo
                                            .deltaOffset ?? 0)
                                        }px)`
                                        : '',
                            },
                        }}
                    />
                </div>
            }
        </th>
    )
}

export default DraggableTableHeader;