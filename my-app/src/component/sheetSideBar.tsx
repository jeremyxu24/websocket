import React, { useState } from "react";
import '../styles/style.css'; // Import the CSS file
import DocumentIcon from "../assets/img/Document";
import { useSheetStore } from "../lib/store";

type sheet = {
    "label": string,
    "url": string
}

export default function SheetSideBar({ filterSheet, setFilterSheet, setNewUrl }) {
    const sheets: sheet[] = useSheetStore((state) => state.sheet);
    const selectedSheet: string = useSheetStore((state) => state.selectedSheet);
    const addSheet: (value: sheet) => void = useSheetStore((state) => state.addSheet)
    const setSelectedSheet: (value: string) => void = useSheetStore((state) => state.setSelectedSheet)

    const [newLabel, setNewLabel] = useState('');

    const handleAddLabel = () => {
        if (newLabel.trim() === '') {
            alert('Label cannot be empty!');
            return;
        }

        addSheet({ label: newLabel, url: newLabel })

        // Clear input fields after adding
        setNewLabel('');
        setNewUrl('');
    };

    const handleSetFilterSheet = (label: any, url: any) => {
        setFilterSheet(label);
        setNewUrl(url);
        setSelectedSheet(label)
    };

    return (
        <div className="sidebar-container">
            <div className="sidebar-content">
                <div className="sidebar-header">
                    <div className="brand-name">AMERICOR</div>
                </div>
                <hr className="divider" />

                <nav className="sidebar-navigation">
                    {sheets ? sheets.map((link: sheet) => ( // data
                        <div
                            key={link.url}
                            style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}
                        >
                            <DocumentIcon />
                            <div
                                className={`sidebar-link ${selectedSheet === link.label ? 'active' : ''}`}
                                onClick={() => handleSetFilterSheet(link.label, link.url)}
                            >
                                {link.label}
                            </div>
                        </div>
                    )) : <></>}
                </nav>

                <div className="sidebar-add">
                    <input
                        type="text"
                        placeholder="New Sheet"
                        value={newLabel}
                        onChange={(e) => setNewLabel(e.target.value)}
                        className="new-sheet-input"
                    />
                    <div className="add-sheet-button-container">
                        <button className="add-sheet-button" onClick={handleAddLabel}>
                            + New Sheet
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
