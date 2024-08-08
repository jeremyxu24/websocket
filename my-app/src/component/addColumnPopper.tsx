import React, { useState, useRef } from "react";
import '../styles/tableStyle.css'
import '../styles/style.css'
import '../styles/popup.css'
import { ColumnType } from "../type/columnType";
import useAddColumToSheet from "../hooks/useAddColumnToSheet";
import { useDirectoryNavStore } from "../lib/store";

type columnDefType = {
    accessorKey: string,
    id: string,
    header: string,
    datatype: string,
    columnID: number
}

export default function AddColumnPopper({ columns, existColumns, popperDisplayState, setPopperDisplayState, maxExistColumns }:
    { columns: ColumnType[], existColumns: any, popperDisplayState: boolean, setPopperDisplayState: (value: boolean) => void, maxExistColumns: number }) {

    const [selectedColumnID, setSelectedColumnID] = useState<number>(0)
    const popupContentRef = useRef<HTMLDivElement>(null);
    const [selectedIndex, setSelectedIndex] = useState<number>(1)
    const addColumnToSheetMutation = useAddColumToSheet();
    const { sheetID } = useDirectoryNavStore();

    const existColumnsID = existColumns.map((column: columnDefType) => column.columnID)

    const filteredSelectableColumns = columns.filter((column) => {
        return !existColumnsID.includes(column.columnID)
    })

    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            setPopperDisplayState(false);
        }
    };

    const handlePopupClick = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
    };

    function handleAddColumn(e: React.FormEvent<HTMLFormElement>) {
        if (!selectedColumnID || !selectedIndex) {
            return
        }
        e.preventDefault();
        const payload = { sheetID, selectedColumnID, selectedIndex }
        addColumnToSheetMutation.mutate(payload)
        e.currentTarget.reset()
    }

    function createArray(number: number) {
        if (number <= 0) {
            return [];
        }
        return Array.from({ length: number }, (_, index) => index + 1);
    }

    if (!popperDisplayState) return null;

    return (
        <div className="popup-overlay" onClick={handleOverlayClick}>
            <div
                className="popup-content add-column-popper"
                ref={popupContentRef}
                onClick={handlePopupClick}
            >
                <form onSubmit={handleAddColumn}>
                    <h3>Add new column</h3>
                    <br />
                    Select column:
                    <select id="columnID" value={selectedColumnID} onChange={(e) => setSelectedColumnID(parseInt(e.target.value))} required>
                        <option key={`columnNameOption-${0}`} value={''}></option>
                        {filteredSelectableColumns.map((column, index) => (
                            <option key={`columnNameOption-${index + 1}`} value={column.columnID}>{column.columnLabel}</option>
                        ))}
                    </select>
                    <div>
                        Data type: <span style={{ textTransform: 'uppercase', fontWeight: 'bold', color: '#0c2d4e' }}>{selectedColumnID && filteredSelectableColumns ? filteredSelectableColumns.filter(column => column.columnID === selectedColumnID)[0] ? filteredSelectableColumns.filter(column => column.columnID === selectedColumnID)[0].datatype : '' : ''}</span>
                    </div>
                    <br />
                    <label>Column insert position:</label>
                    <select id="positionIndex" value={selectedIndex} onChange={(e) => setSelectedIndex(parseInt(e.target.value))} required>
                        <option key={`columnIndexOption-${1}`} value={1}>1</option>
                        {(createArray(maxExistColumns)).map((number: number) => (
                            <option key={`columnIndexOption-${number + 1}`} value={number + 1}>{number + 1}</option>
                        ))}
                    </select>
                    {addColumnToSheetMutation.isPending ? (
                        'Adding column to sheet...'
                    ) : (
                        <>
                            {addColumnToSheetMutation.isError ? (
                                <div>An error occurred: {addColumnToSheetMutation.error.message}</div>
                            ) : null}
                            {addColumnToSheetMutation.isSuccess ? <div>Column added!</div> : null}
                            <button type="submit">
                                Add
                            </button>
                        </>
                    )}
                </form>
            </div>
        </div>
    )
}