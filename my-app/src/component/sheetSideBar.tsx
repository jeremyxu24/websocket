import React, { useState } from "react";
import '../styles/style.css'; // Import the CSS file
import { newDirectoryType, newSheetType } from "../type/directoryType";
import useAddSubDirectory from "../hooks/useAddSubDirectory";
import useAddSheet from "../hooks/useAddSheet";
import { ColumnType } from "../type/columnType";
import { columnColor } from "../utils/colors";
import useAddColumn from "../hooks/useAddColumn";
import Tooltip from "./tooltip";

export default function SheetSideBar({ columnData, type, navLoc, navPending, navError, columnPending, columnError }) {
    const [newLabel, setNewLabel] = useState('');

    const { addSubDirTooltipVisible, addSubDirTooltipMessage, addNewDirMutate } = useAddSubDirectory();
    const { addSheetTooltipVisible, addSbeetTooltipMessage, addSheetMutate } = useAddSheet();
    const { newColumnMutateIsError, newColumnMutate, addColTooltipVisible, newColumnMutateIsPending, newColumnMutateError, addColTooltipMessage } = useAddColumn();

    const handleAddNewSheet = () => {
        if (newLabel.trim() === '') {
            alert('Label cannot be empty!');
            return;
        }

        const newSheet: newSheetType = {
            directoryID: navLoc[navLoc.length - 1].directoryID,
            sheetLabel: newLabel.trim(),
            sheetURL: newLabel.trim().replace(' ', '_')
        };

        addSheetMutate(newSheet)

        setNewLabel('');
    };

    const handleAddNewDirectory = () => {
        if (newLabel.trim() === '') {
            alert('Label cannot be empty!');
            return;
        }

        const newDirectory: newDirectoryType = {
            directoryLabel: newLabel.trim(),
            directoryType: 'directory',
            directoryURL: newLabel.trim().replace(' ', '_'),
            parentID: navLoc[navLoc.length - 1].directoryID
        };

        addNewDirMutate(newDirectory)

        setNewLabel('');
    };

    const handleAddNewColumn = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (e.currentTarget.columnName.value.trim() === '') {
            alert('Label cannot be empty')
            return;
        }

        const newColumn: ColumnType = {
            columnLabel: e.currentTarget.columnName.value.trim(),
            datatype: e.currentTarget.columnSelect.value
        }
        newColumnMutate(newColumn)
        e.currentTarget.reset()
    }

    if (navPending || columnPending) return <>Loading...</>
    else if (navError || columnError) return <>An error has occurred. {navError ? navError.message : columnError.message}</>
    else if (!navLoc || navLoc.length === 0) {
        return (
            <div className="sidebar-container">
                <div className="sidebar-content">
                    <div className="sidebar-header">
                        <div className="brand-name">AMERICOR</div>
                    </div>
                    <hr className="divider" />
                    <div style={{ padding: '20px' }}>
                        <h3>Error...</h3>
                    </div>
                </div>
            </div>
        )
    }

    else return (
        <>
            <div className="sidebar-container">
                <div className="sidebar-content">
                    <div className="sidebar-header">
                        <div className="brand-name">AMERICOR</div>
                    </div>
                    <hr className="divider" />

                    {type === "directory" ?
                        <div className="sidebar-add">
                            <input
                                type="text"
                                placeholder="New..."
                                value={newLabel}
                                onChange={(e) => setNewLabel(e.target.value)}
                                className="new-sheet-input"
                                style={{ width: '100%' }}
                            />
                            <div className="add-sheet-button-container">
                                <button className="add-sheet-button" onClick={handleAddNewDirectory} >
                                    + New Directory
                                </button>
                                <button className="add-sheet-button" onClick={handleAddNewSheet} >
                                    + New Sheet
                                </button>
                            </div>
                        </div>
                        :
                        <>
                            <div style={{ width: '100%', borderBottom: '1px solid white', paddingBottom: '10px', marginBottom: '10px' }}>
                                <form onSubmit={handleAddNewColumn}>
                                    <label>Column name:</label>
                                    <input
                                        type="text"
                                        placeholder="New column..."
                                        name="columnName"
                                        className="new-sheet-input"
                                        style={{ width: '100%' }}
                                    />
                                    <label>Data type:</label>
                                    <select name="columnSelect" style={{ width: '100%', height: '35px', padding: '5px', borderRadius: '5px' }}>
                                        <option>String</option>
                                        <option>Number</option>
                                        <option>Boolean</option>
                                        <option>Date</option>
                                        <option>Datetime</option>
                                        {/* <option>Array</option> */}
                                    </select>
                                    <div className="add-sheet-button-container">
                                        {newColumnMutateIsPending ? (
                                            'Adding column...'
                                        ) : (
                                            <>
                                                {newColumnMutateIsError ? addColTooltipVisible && (
                                                    <div>Error: {newColumnMutateError?.message}</div>
                                                ) : null}
                                                {addColTooltipVisible && <div>{addColTooltipMessage}</div>}
                                                <button className="add-sheet-button" type="submit" >
                                                    + New Column
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </form>
                            </div>
                            <div>Columns:</div>
                            <div className="columnsContainer">
                                {columnData && columnData.map((column: ColumnType, index: number) => (
                                    <div className="columnCard" key={`columnCard-${index}`} style={{ backgroundColor: `${columnColor[column.datatype]}` }}>
                                        <div style={{ fontWeight: 'bold' }}>{column.columnLabel}</div>
                                        <div style={{ textTransform: 'uppercase', color: '#454545' }}>{column.datatype}</div>
                                    </div>
                                ))}
                            </div>
                        </>
                    }
                </div>
            </div>
            <Tooltip
                message={addSubDirTooltipMessage}
                visible={addSubDirTooltipVisible}
                className="tooltipCenter"
            />
            <Tooltip
                message={addSbeetTooltipMessage}
                visible={addSheetTooltipVisible}
                className="tooltipCenter"
            />
        </>
    );
}