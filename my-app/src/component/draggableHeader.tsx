import React, { CSSProperties } from "react";
import { CSS } from '@dnd-kit/utilities'
import { useSortable } from '@dnd-kit/sortable'
import { Header, flexRender } from "@tanstack/react-table";
import { THeaderProps } from "../type/tableType";

const DraggableTableHeader = ({ header, table, columnResizeMode, setColPopupState }
    : THeaderProps) => {

    function handleColumnOptionPopup(event: any, header: Header<any, unknown>) {
        const rect = event.target.getBoundingClientRect();
        const position = {
            top: rect.bottom + window.scrollY,  // Position just below the header
            left: rect.left + window.scrollX,   // Align with the header's left edge
        };
        setColPopupState(() => ({
            selectedColumnID: header.column.columnDef.colSheetID,
            position: position,
            columnOptionPopperDisplayState: true
        }))
    }

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
                    <button onClick={(event) => handleColumnOptionPopup(event, header)}>?</button>
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