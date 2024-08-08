import React, { useState } from "react";
import '../styles/style.css'; // Import the CSS file
import DocumentIcon from "../assets/img/Document";
import { newDirectoryType, newSheetType } from "../type/directoryType";
import useAddSubDirectory from "../hooks/useAddSubDirectory";
import { useDirectoryNavStore, useDirectoryTypeStore } from "../lib/store";
import useAddSheet from "../hooks/useAddSheet";
import { ColumnType } from "../type/columnType";
import { columnColor } from "../utils/colors";
import useAddColumn from "../hooks/useAddColumn";
import Tooltip from "./tooltip";

export default function SheetSideBar({ columnData }) {
    const [newLabel, setNewLabel] = useState('');
    const { location } = useDirectoryNavStore();
    const { type } = useDirectoryTypeStore();

    const newDirectoryMutation = useAddSubDirectory();
    const newSheetMutation = useAddSheet();
    // const newColumnMutation = useAddColumn();
    const { newColumnMutateIsError, newColumnMutate, tooltipVisible, newColumnMutateIsSuccess, newColumnMutateIsPending, newColumnMutateError } = useAddColumn();

    console.log('tooltipVisible', tooltipVisible)

    const handleAddNewSheet = () => {
        if (newLabel.trim() === '') {
            alert('Label cannot be empty!');
            return;
        }

        const newSheet: newSheetType = {
            directoryID: location[location.length - 1].directoryID,
            sheetLabel: newLabel.trim(),
            sheetURL: newLabel.trim().replace(' ', '_')
        };

        newSheetMutation.mutate(newSheet)

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
            parentID: location[location.length - 1].directoryID
        };

        newDirectoryMutation.mutate(newDirectory)

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

    return (
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
                                    <option>Array</option>
                                    <option>Date</option>
                                    <option>Datetime</option>
                                </select>
                                <div className="add-sheet-button-container">
                                    {newColumnMutateIsPending ? (
                                        'Adding column...'
                                    ) : (
                                        <>
                                            {newColumnMutateIsError ? (
                                                <div>Error: {newColumnMutateError?.message}</div>
                                            ) : null}

                                            {/* {newColumnMutation.isSuccess ? <div>Column added!</div> : null} */}
                                            <Tooltip message={'Column added successfully'} visible={tooltipVisible} />
                                            <button className="add-sheet-button" type="submit" >
                                                + New Column
                                            </button>
                                        </>
                                    )}
                                </div>
                            </form>
                        </div>
                        <div className="columnsContainer">
                            <div>Columns:</div>
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
    );
}