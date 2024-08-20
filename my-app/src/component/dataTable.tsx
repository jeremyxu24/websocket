import React, { useEffect, useState, useRef } from "react";
import '../styles/style.css';
import '../styles/tableStyle.css'
import { ColumnDef, getCoreRowModel, useReactTable, ColumnResizeMode, ColumnResizeDirection, RowData, getFilteredRowModel, getPaginationRowModel, ColumnFiltersState, getSortedRowModel, } from '@tanstack/react-table'
import { DndContext, KeyboardSensor, MouseSensor, TouchSensor, closestCenter, type DragEndEvent, useSensor, useSensors, } from '@dnd-kit/core'
import { restrictToHorizontalAxis } from '@dnd-kit/modifiers'
import { arrayMove, SortableContext, horizontalListSortingStrategy, } from '@dnd-kit/sortable'
import { useFetchSheetData } from '../hooks/useFetchSheetData';
import ColumnFilter from './columnFilter';
import DraggableTableHeader from './draggableHeader';
import DragAlongCell from './dragAlongCell';
import AddColumnPopper from "./addColumnPopper";
import useAddRowToSheet from "../hooks/useAddRowToSheet";
import Tooltip from "./tooltip";
import useAddResponse from "../hooks/useAddResponse";
import usePatchColumnPosition from "../hooks/usePatchColumnPosition";
import RowOptionPopper from "./rowOptionPopper"
import ColumnOptionPopper from "./columnOptionPopper";
import { TColumn, TColumnDef, TColOptPopupState, TRowOptPopupState } from "../type/tableType";

declare module '@tanstack/react-table' {
    interface TableMeta<TData extends RowData> {
        updateData: (rowIndex: number, columnId: string, value: unknown) => void
    }
}

function useSkipper() {
    const shouldSkipRef = React.useRef(true)
    const shouldSkip = shouldSkipRef.current

    // Wrap a function with this to skip a pagination reset temporarily
    const skip = React.useCallback(() => {
        shouldSkipRef.current = false
    }, [])

    React.useEffect(() => {
        shouldSkipRef.current = true
    })

    return [shouldSkip, skip] as const
}

export default function DataTable({ columnData, sheetID }) {
    const { data: sheetData, isPending, error: fetchSheetDataError } = useFetchSheetData(sheetID);
    const { newRowMutate, tooltipAddRowVisible, newRowMutateIsPending, tooltipAddRowMessage } = useAddRowToSheet(sheetID);
    const { newResponseMutate, tooltipResponseVisible, tooltipResponseMessage } = useAddResponse();
    const { patchColPosMutate, colPosTooltipVisible, colPosTooltipMessage } = usePatchColumnPosition();

    const [rowColResID, setRowColResID] = useState<{ [key: string]: number | null } | {}>({})
    const [autoResetPageIndex, skipAutoResetPageIndex] = useSkipper()
    const [columnResizeMode] = useState<ColumnResizeMode>('onChange')
    const [columnResizeDirection] = useState<ColumnResizeDirection>('ltr')
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [columns, setColumns] = useState<ColumnDef<TColumnDef>[]>([])
    const [data, setData] = React.useState<any>([])
    const [columnOrder, setColumnOrder] = useState<string[]>([])
    const [columnPosition, setColumnPosition] = useState<{ positionIndex: number, id: string, colSheetID: number }[] | []>([])
    const [newColumnPopperDisplayState, setNewColumnPopperDisplayState] = useState<boolean>(false)
    const [rowPopupState, setRowPopupState] = useState<TRowOptPopupState>({
        selectedRowID: null,
        rowOptionPopperDisplayState: false,
        position: { top: 0, left: 0 }
    })
    const [colPopupState, setColPopupState] = useState<TColOptPopupState>({
        selectedColumnID: null,
        columnOptionPopperDisplayState: false,
        position: { top: 0, left: 0 },
    });

    // Give our default column cell renderer editing superpowers!
    const defaultColumn: Partial<ColumnDef<TColumnDef>> = {
        cell: ({ getValue, row: { index, original }, column: { id, columnDef }, table }) => {
            const initialValue = getValue()
            // We need to keep and update the state of the cell normally
            const [value, setValue] = React.useState(initialValue)
            const { datatype } = columnDef

            // When the input is blurred, we'll call our table meta's updateData function
            const onBlur = () => {
                table.options.meta?.updateData(index, id, value)
                const { rowID } = original;
                const { colSheetID } = columnDef

                const selectedColSheetRowID = `colSheet-${colSheetID}-row-${rowID}`
                if (initialValue !== value) {
                    newResponseMutate({ value, responseID: rowColResID[selectedColSheetRowID], rowID, colSheetID })
                }
            }

            // If the initialValue is changed external, sync it up with our state
            React.useEffect(() => {
                setValue(initialValue)
            }, [initialValue])

            if (datatype === "Number") {
                return (
                    <input
                        type="number"
                        value={value as string}
                        onChange={e => setValue(e.target.value)}
                        onBlur={onBlur}
                    />
                )
            }
            else if (datatype === "String") {
                return (
                    <input
                        value={value as string}
                        onChange={e => setValue(e.target.value)}
                        onBlur={onBlur}
                    />
                )
            }
            else if (datatype === 'Datetime') {
                return (
                    <input
                        aria-label="Date and time"
                        type="datetime-local"
                        onChange={e => {
                            setValue(e.target.value)
                        }}
                        value={value as string}
                        onBlur={onBlur}
                    />
                );
            }
            else if (datatype === 'Date') {
                return (
                    <input
                        aria-label="Date"
                        type="date"
                        onChange={e => {
                            setValue(e.target.value)
                        }}
                        value={value as string}
                        onBlur={onBlur}
                    />
                )
            }
            else if (datatype === 'Boolean') {
                return (
                    <select
                        style={{ width: "100%", border: 'none' }}
                        value={value as string}
                        onChange={(e) => setValue(e.currentTarget.value)}
                        onBlur={onBlur}
                    >
                        <option value=""></option>
                        <option value="True">True</option>
                        <option value="False">False</option>
                    </select>
                )
            }
        },
    }

    useEffect(() => {
        if (columnOrder.length < 1) {
            return
        }

        // Function to track new order and filter unchanged positions
        function trackChangedPositions(newNameArray: string[], previousPositions: { id: string, positionIndex: number, colSheetID: number }[]) {
            // Create a map of name to old position for quick lookup
            const oldPositionMap = new Map(previousPositions.map(item => [item.id, item.positionIndex]));

            // Generate a new array with updated positions based on the new order
            const updatedPositions = newNameArray.map((id, index) => {
                const indexOfMatchedCol = previousPositions.map((col) => col.id).indexOf(id)
                return {
                    id,
                    positionIndex: index + 1,
                    colSheetID: previousPositions[indexOfMatchedCol].colSheetID
                }
            });

            // Filter out positions where the position hasn't changed
            const changedPositions = updatedPositions.filter(({ id, positionIndex }) => {
                const oldPosition = oldPositionMap.get(id);
                return oldPosition !== undefined && oldPosition !== positionIndex;
            });

            return { changedPositions, updatedPositions };
        }
        const { changedPositions, updatedPositions } = trackChangedPositions(columnOrder, columnPosition)
        if (changedPositions.length < 1) return
        patchColPosMutate(changedPositions)
        setColumnPosition(updatedPositions)
    }, [columnOrder])

    useEffect(() => {
        // set up column/columnOrder/columnPosition states
        if (!sheetData) setColumns([])
        else if (sheetData.columnData.length === 0 || !sheetData.columnData[0].columnID || !sheetData.columnData[0].columnLabel) setColumns([])
        else {
            const formatedColumns = sheetData?.columnData.reduce((acc: TColumnDef[], column: TColumn) => {
                return ([...acc, { accessorKey: `${column.columnLabel.trim().replace(' ', '_')}`, id: `${column.columnLabel.trim().replace(' ', '_')}`, header: column.columnLabel, datatype: column.datatype, columnID: column.columnID, colSheetID: column.colSheetID, positionIndex: column.positionIndex }])
            }, [])
            setColumns(formatedColumns)
            setColumnOrder(formatedColumns.map((c: TColumnDef) => c.id!))
            setColumnPosition(formatedColumns.map((c: TColumnDef) =>
                ({ positionIndex: c.positionIndex, id: c.id!, colSheetID: c.colSheetID })
            ))
        }
        // set data and rowColResID states
        if (!sheetData) {
            setData([])
            setRowColResID({})
        }
        else if (sheetData.responses.length === 0 || !sheetData.responses[0].rowID) {
            setData([])
            setRowColResID({})
        }
        else {
            // setData
            let transformedObject: unknown[] = [];
            sheetData.responses.forEach((row: { responseData: { columnLabel: string | null, rowNumber: number | null, value: string | null, responseID: number | null }[], rowID: number | null }) => {
                const newRow = Object.fromEntries(row.responseData.map((row) => {
                    const newKey = `${row.columnLabel?.replace(' ', '_')}`
                    return [newKey, row.value ? row.value : '']
                }))
                transformedObject.push({ ...newRow, rowID: row.rowID })
            })
            setData(transformedObject)

            // setRowColResID
            const transformedObjectResID = {};
            for (let i = 0; i < sheetData.columnData.length; i++) {
                for (let j = 0; j < sheetData.responses.length; j++) {
                    // key, value of colsheetid
                    const colSheetID = sheetData.columnData[i].colSheetID;
                    // rowID value
                    const rowIDValue = sheetData.responses[j].rowID;
                    const newValue = [`colSheet-${colSheetID}-row-${rowIDValue}`, sheetData.responses[j].responseData[i].responseID]
                    transformedObjectResID[newValue[0]] = newValue[1]
                }
            }
            setRowColResID(transformedObjectResID)
        }
    }, [sheetData])

    const table = useReactTable({
        data,
        columns,
        columnResizeMode,
        columnResizeDirection,
        defaultColumn,
        getCoreRowModel: getCoreRowModel(),
        filterFns: {},
        state: {
            columnOrder,
            columnFilters,
        },
        onColumnOrderChange: setColumnOrder,
        onColumnFiltersChange: setColumnFilters,
        // editible settings
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        autoResetPageIndex,
        // Provide our updateData function to our table meta
        meta: {
            updateData: (rowIndex, columnId, value) => {
                // Skip page index reset until after next rerender
                skipAutoResetPageIndex()
                setData((old: any) =>
                    old.map((row: any, index: number) => {
                        if (index === rowIndex) {
                            return {
                                ...old[rowIndex]!,
                                [columnId]: value,
                            }
                        }
                        return row
                    })
                )
            },
        },
        // debugTable: true,
        // debugHeaders: true,
        // debugColumns: true,
    })

    // reorder columns after drag & drop
    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event
        if (active && over && active.id !== over.id) {
            setColumnOrder(columnOrder => {
                const oldIndex = columnOrder.indexOf(active.id as string)
                const newIndex = columnOrder.indexOf(over.id as string)
                return arrayMove(columnOrder, oldIndex, newIndex) //this is just a splice util
            })
        }
    }

    const sensors = useSensors(
        useSensor(MouseSensor, {}),
        useSensor(TouchSensor, {}),
        useSensor(KeyboardSensor, {})
    )

    function handleAddRow() {
        const newRow = { rowNumber: data.length + 1 }
        newRowMutate(newRow)
    }

    if (isPending) return 'Loading sheet...'
    else if (fetchSheetDataError) return 'An error has occurred: ' + fetchSheetDataError.message
    else return (
        <>
            <div style={{ padding: '8px' }}>
                <DndContext
                    collisionDetection={closestCenter}
                    modifiers={[restrictToHorizontalAxis]}
                    onDragEnd={handleDragEnd}
                    sensors={sensors}
                >
                    <table {...{
                        style: {
                            width: table.getCenterTotalSize(),
                        },
                    }}>
                        <thead>
                            {table.getHeaderGroups().map(headerGroup => (
                                <tr key={headerGroup.id}>
                                    <th className='add-column' onClick={() => setNewColumnPopperDisplayState(true)}>+ column</th>
                                    <SortableContext
                                        items={columnOrder}
                                        strategy={horizontalListSortingStrategy}
                                    >
                                        {headerGroup.headers.map(header => (
                                            <DraggableTableHeader
                                                key={header.id} header={header} table={table} columnResizeMode={columnResizeMode}
                                                setColPopupState={setColPopupState}
                                            />
                                        ))}
                                    </SortableContext>
                                </tr>
                            ))}
                            {table.getHeaderGroups().map(headerGroup => (
                                <tr key={`filter - ${headerGroup.id}`}>
                                    <th>#</th>
                                    {headerGroup.headers.map((header, index) => {
                                        return (
                                            <th key={`filter - ${index}`}>
                                                <ColumnFilter column={header.column}
                                                    table={table} />
                                            </th>
                                        )
                                    })}
                                </tr>
                            ))}
                        </thead>
                        <tbody>
                            {table.getRowModel().rows.map((row, index) => (
                                <tr key={row.id}>
                                    <td className='rowSelectStyle' onClick={(event) => {
                                        const rect = event.currentTarget.getBoundingClientRect();
                                        const position = {
                                            top: rect.bottom + window.scrollY,  // Position just below the header
                                            left: rect.left + window.scrollX,   // Align with the header's left edge
                                        };
                                        setRowPopupState(() => ({
                                            selectedRowID: row.original.rowID,
                                            position: position,
                                            rowOptionPopperDisplayState: true
                                        }))
                                    }}>{index + 1}</td>
                                    {row.getVisibleCells().map(cell => (
                                        <SortableContext
                                            key={cell.id}
                                            items={columnOrder}
                                            strategy={horizontalListSortingStrategy}
                                        >
                                            <DragAlongCell key={cell.id} cell={cell} />
                                        </SortableContext>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {
                        newRowMutateIsPending ?
                            <div>Adding new row...</div> :
                            <div className='add-row' onClick={handleAddRow}>
                                + New
                            </div>
                    }
                </DndContext>
                <div className="d-flex padding-2 gap-2">
                    <button
                        className="border rounded p-1"
                        onClick={() => table.setPageIndex(0)}
                        disabled={!table.getCanPreviousPage()}
                    >
                        {'<<'}
                    </button>
                    <button
                        className="border rounded p-1"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        {'<'}
                    </button>
                    <button
                        className="border rounded p-1"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        {'>'}
                    </button>
                    <button
                        className="border rounded p-1"
                        onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                        disabled={!table.getCanNextPage()}
                    >
                        {'>>'}
                    </button>
                    <span className="flex items-center gap-1">
                        <div>Page</div>
                        <strong>
                            {table.getState().pagination.pageIndex + 1} of{' '}
                            {table.getPageCount()}
                        </strong>
                    </span>
                    <span className="flex items-center gap-1">
                        | Go to page:
                        <input
                            type="number"
                            defaultValue={table.getState().pagination.pageIndex + 1}
                            onChange={e => {
                                const page = e.target.value ? Number(e.target.value) - 1 : 0
                                table.setPageIndex(page)
                            }}
                            className="filterInput pageInput"
                        />
                    </span>
                    <select
                        value={table.getState().pagination.pageSize}
                        onChange={e => {
                            table.setPageSize(Number(e.target.value))
                        }}
                    >
                        {[10, 20, 30, 40, 50].map(pageSize => (
                            <option key={pageSize} value={pageSize}>
                                Show {pageSize}
                            </option>
                        ))}
                    </select>
                </div>
                <div>{table.getRowModel().rows.length} Rows</div>
                <AddColumnPopper
                    columns={columnData} existColumns={columns}
                    newColumnPopperDisplayState={newColumnPopperDisplayState}
                    setNewColumnPopperDisplayState={setNewColumnPopperDisplayState}
                    maxExistColumns={columns.length}
                    sheetID={sheetID}
                />
                <RowOptionPopper
                    rowPopupState={rowPopupState} setRowPopupState={setRowPopupState}
                />
                <ColumnOptionPopper
                    colPopupState={colPopupState} setColPopupState={setColPopupState}
                />
            </div>
            <Tooltip message={colPosTooltipMessage} visible={colPosTooltipVisible} className="tooltipCenter" />
            <Tooltip message={tooltipResponseMessage} visible={tooltipResponseVisible} className="tooltipCenter" />
            <Tooltip message={tooltipAddRowMessage} visible={tooltipAddRowVisible} className="tooltipCenter" />
        </>
    )
}