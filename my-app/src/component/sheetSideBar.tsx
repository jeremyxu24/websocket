import React, { useState } from "react";
import '../styles/style.css'; // Import the CSS file
import DocumentIcon from "../assets/img/Document";
import { newDirectoryType, newSheetType } from "../type/directoryType";
import useAddSubDirectory from "../hooks/useAddSubDirectory";
import { useDirectoryNavStore, useDirectoryTypeStore } from "../lib/store";
import useAddSheet from "../hooks/useAddSheet";

export default function SheetSideBar() {
    const [newLabel, setNewLabel] = useState('');
    const { location } = useDirectoryNavStore();
    const { type } = useDirectoryTypeStore();

    const newDirectoryMutation = useAddSubDirectory();
    const newSheetMutation = useAddSheet();

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

        // Clear input fields after adding
        // refetchDirectoryHandle()
        setNewLabel('');
    };

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
                    : <></>}
            </div>
        </div>
    );
}