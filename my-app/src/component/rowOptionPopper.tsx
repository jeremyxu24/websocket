import React, { useState, useRef } from "react";
import '../styles/tableStyle.css'
import '../styles/style.css'
import '../styles/popup.css'
import useDeleteRowFromSheet from "../hooks/useDeleteRowFromSheet";
import Tooltip from "./tooltip";
import { TRowOptPopper } from "../type/tableType";

export default function RowOptionPopper(
    { rowPopupState, setRowPopupState }
        : TRowOptPopper
) {

    const popupContentRef = useRef<HTMLDivElement>(null);
    const { mutate, isPending, deleteRowTooltipVisible, tooltipMessage } = useDeleteRowFromSheet();

    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            setRowPopupState((prev) => ({
                ...prev,
                selectedRowID: null,
                rowOptionPopperDisplayState: false
            }))
        }
    };

    const handlePopupClick = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
    };

    const handleDeleteClick = () => {
        if (rowPopupState.selectedRowID === null) return
        mutate(rowPopupState.selectedRowID)
        setRowPopupState(() => ({
            selectedRowID: null,
            rowOptionPopperDisplayState: false,
            position: { top: 0, left: 0 }
        }))
    }

    if (!rowPopupState.rowOptionPopperDisplayState && !deleteRowTooltipVisible) return null;
    else if (deleteRowTooltipVisible) return <Tooltip
        message={tooltipMessage}
        visible={deleteRowTooltipVisible}
        className="tooltipCenter" />
    else return (
        <>
            <div className="popup-overlay" onClick={handleOverlayClick}>
                <div
                    className="popup-content"
                    style={{
                        top: rowPopupState.position.top,
                        left: rowPopupState.position.left,
                    }}
                    ref={popupContentRef}
                    onClick={handlePopupClick}
                >
                    <h3>Row options:</h3>
                    <br />
                    {isPending ? <></> :
                        <button onClick={handleDeleteClick}>Delete</button>
                    }
                </div>
            </div>
        </>
    )
}