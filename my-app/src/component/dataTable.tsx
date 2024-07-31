import React, { useState, } from "react";
import '../styles/style.css';
import '../styles/tableStyle.css'
import { ColumnDef, getCoreRowModel, useReactTable, ColumnResizeMode, ColumnResizeDirection, RowData, getFilteredRowModel, getPaginationRowModel, ColumnFiltersState, getSortedRowModel, } from '@tanstack/react-table'
import { DndContext, KeyboardSensor, MouseSensor, TouchSensor, closestCenter, type DragEndEvent, useSensor, useSensors, } from '@dnd-kit/core'
import { restrictToHorizontalAxis } from '@dnd-kit/modifiers'
import { arrayMove, SortableContext, horizontalListSortingStrategy, } from '@dnd-kit/sortable'
import useFetchSheetData from '../hooks/useFetchSheetData';
import ColumnFilter from './columnFilter';
import DraggableTableHeader from './draggableHeader';
import DragAlongCell from './dragAlongCell';

export type Person = {
    firstName: string
    lastName: string
    age: number
    visits: number
    progress: number
    status: 'relationship' | 'complicated' | 'single'
    subRows?: Person[]
}

const newPerson = (): Person => {
    return {
        firstName: "John",
        lastName: "Doe",
        age: 25,
        visits: 255,
        progress: 59,
        status: 'complicated',
    }
}

const defaultData: Person[] = [
    {
        firstName: 'tanner',
        lastName: 'linsley',
        age: 24,
        visits: 100,
        status: 'relationship',
        progress: 50,
    },
    {
        firstName: 'tandy',
        lastName: 'miller',
        age: 40,
        visits: 40,
        status: 'single',
        progress: 80,
    },
    {
        firstName: 'joe',
        lastName: 'dirte',
        age: 45,
        visits: 20,
        status: 'complicated',
        progress: 10,
    },
]

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

export default function DataTable({ columnData }) {
    const { data: sheetData, isPending, error: fetchSheetDataError } = useFetchSheetData();
    // console.log('sheetData', sheetData)

    // Give our default column cell renderer editing superpowers!
    const defaultColumn: Partial<ColumnDef<Person>> = {
        cell: ({ getValue, row: { index }, column: { id }, table }) => {
            const initialValue = getValue()
            // We need to keep and update the state of the cell normally
            const [value, setValue] = React.useState(initialValue)

            // When the input is blurred, we'll call our table meta's updateData function
            const onBlur = () => {
                table.options.meta?.updateData(index, id, value)
            }

            // If the initialValue is changed external, sync it up with our state
            React.useEffect(() => {
                setValue(initialValue)
            }, [initialValue])

            return (
                <input
                    value={value as string}
                    onChange={e => setValue(e.target.value)}
                    onBlur={onBlur}
                />
            )
        },
    }

    const columns = React.useMemo<ColumnDef<Person>[]>(
        () => [
            {
                accessorKey: 'firstName',
                id: 'firstName',
                footer: props => props.column.id,
            },
            {
                accessorFn: row => row.lastName,
                id: 'lastName',
                header: () => <span>Last Name</span>,
                footer: props => props.column.id,
            },
            {
                accessorKey: 'age',
                id: 'age',
                header: () => 'Age',
                footer: props => props.column.id,
            },
            {
                accessorKey: 'visits',
                id: 'visits',
                header: () => <span>Visits</span>,
                footer: props => props.column.id,
            },
            {
                accessorKey: 'status',
                id: 'status',
                header: 'Status',
                footer: props => props.column.id,
            },
            {
                accessorKey: 'progress',
                id: 'progress',
                header: 'Profile Progress',
                footer: props => props.column.id,
            },
        ],
        []
    )
    const [autoResetPageIndex, skipAutoResetPageIndex] = useSkipper()
    const [columnResizeMode] = useState<ColumnResizeMode>('onChange')
    const [columnResizeDirection] = useState<ColumnResizeDirection>('ltr')
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])

    const [data, setData] = React.useState(() => [...defaultData])
    // console.log('data', data)

    const [columnOrder, setColumnOrder] = React.useState<string[]>(() => columns.map(c => c.id!))

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
                setData(old =>
                    old.map((row, index) => {
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
        setData((prev) => ([...prev, newPerson()]))
    }

    if (isPending) return 'Loading...'

    if (fetchSheetDataError) return 'An error has occurred: ' + fetchSheetDataError.message

    return (
        // NOTE: This provider creates div elements, so don't nest inside of <table> elements
        <>
            <DndContext
                collisionDetection={closestCenter}
                modifiers={[restrictToHorizontalAxis]}
                onDragEnd={handleDragEnd}
                sensors={sensors}
            >
                <div style={{ padding: '8px' }}>
                    <table {...{
                        style: {
                            width: table.getCenterTotalSize(),
                        },
                    }}>
                        <thead>
                            {table.getHeaderGroups().map(headerGroup => (
                                <>
                                    <tr key={headerGroup.id}>
                                        <th className='add-column'>Add +</th>
                                        <SortableContext
                                            items={columnOrder}
                                            strategy={horizontalListSortingStrategy}
                                        >
                                            {headerGroup.headers.map(header => (
                                                <DraggableTableHeader key={header.id} header={header} table={table} columnResizeMode={columnResizeMode} />
                                            ))}
                                        </SortableContext>
                                    </tr>
                                    <tr>
                                        <th>#</th>
                                        {headerGroup.headers.map(header => (
                                            header.column.getCanFilter() ? (
                                                <th>
                                                    <ColumnFilter column={header.column}
                                                        table={table} />
                                                </th>) : null
                                        ))}
                                    </tr>
                                </>
                            ))}
                        </thead>
                        <tbody>
                            {table.getRowModel().rows.map((row, index) => (
                                <tr key={row.id}>
                                    <td>{index + 1}</td>
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
                    <div className='add-row' onClick={handleAddRow}>
                        + New
                    </div>
                </div>
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
        </>
    )
}