import React, { useState, useRef } from "react";
import '../styles/tableStyle.css'
import '../styles/style.css'
import '../styles/popup.css'
import useDeleteColumnFromSheet from "../hooks/useDeleteColumnFromSheet";
import Tooltip from "./tooltip";
import { TColumnOptPopper } from "../type/tableType";

export default function ColumnOptionPopper(
    { colPopupState, setColPopupState, sheetID }
        : TColumnOptPopper & { sheetID: number }) {

    const popupContentRef = useRef<HTMLDivElement>(null);
    const { mutate, isPending, deleteColumnTooltipVisible, tooltipMessage } = useDeleteColumnFromSheet();

    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            setColPopupState(() => ({
                selectedColumnID: null,
                columnOptionPopperDisplayState: false,
                position: { top: 0, left: 0 }
            }))
        }
    };

    const handlePopupClick = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
    };

    const handleDeleteClick = () => {
        if (!colPopupState.selectedColumnID) return
        mutate({ colSheetID: colPopupState.selectedColumnID, sheetID })
        setColPopupState(() => ({
            selectedColumnID: null,
            columnOptionPopperDisplayState: false,
            position: { top: 0, left: 0 }
        }))
    }

    if (!colPopupState.columnOptionPopperDisplayState && !deleteColumnTooltipVisible) return null;
    else if (deleteColumnTooltipVisible) return (
        <Tooltip
            message={tooltipMessage}
            visible={deleteColumnTooltipVisible}
            className="tooltipCenter" />
    )
    else return (
        <div className="popup-overlay" onClick={handleOverlayClick}>
            <div
                className="popup-content"
                style={{
                    top: colPopupState.position.top,
                    left: colPopupState.position.left,
                }}
                ref={popupContentRef}
                onClick={handlePopupClick}
            >
                <h3>Column options:</h3>
                <br />
                {isPending ? <></> :
                    <button onClick={handleDeleteClick}>Delete</button>
                }
            </div>
        </div>
    )
}