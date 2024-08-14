import React, { useEffect } from "react";
import { directoryType } from "../type/directoryType";
import '../styles/style.css'
import { useNavigate } from "react-router-dom";


export default function DirectoryNav({ onNavigate, navLoc, navPending, navError }) {
    const navigate = useNavigate();

    function handleOnNavClick(e: any) {
        const newNavIndex: number = parseInt(e.currentTarget.id.split('-')[3]);
        if (newNavIndex === navLoc.length - 1 && navLoc.length !== 1) {
            navigate(0);
            return
        }

        onNavigate("directory", `${navLoc[newNavIndex].directoryID}`)
    }

    if (navPending) return <>Loading...</>
    else if (navError) return (
        <div style={{ padding: '20px' }}>
            <h3>An error has occurred. {navError.message}</h3>
            <button onClick={() => onNavigate("directory", '1')}>
                Return to home page
            </button>
        </div>
    )
    else if (!navLoc || navLoc.length === 0) {
        return (
            <div style={{ padding: '20px' }}>
                <h3>Cannot find the folder/file you're requesting...</h3>
                <button onClick={() => onNavigate("directory", '1')}>
                    Return to home page
                </button>
            </div>
        )
    }
    else return (
        <div className="directoryContainer d-flex">
            {navLoc && navLoc.map((directory: directoryType, index: number) => {
                if (index === 0) {
                    return (
                        <div key={`directory-${index}`} className="directoryNavContent" id={`directoryID-${directory.directoryID}-index-${index}`} onClick={handleOnNavClick}>
                            {directory.directoryLabel}
                        </div>
                    )
                } else {
                    return (
                        <div key={`directory-${index}`} className="d-flex align-item-center" >
                            <div style={{ lineHeight: '59.5px' }}>
                                {`>`}
                            </div>
                            <div className="directoryNavContent" id={`directoryID-${directory.directoryID}-index-${index}`} onClick={handleOnNavClick}>
                                {directory.sheetID ? directory.sheetLabel : directory.directoryLabel}
                            </div>
                        </div>
                    )
                }
            })}
        </div>
    )
}