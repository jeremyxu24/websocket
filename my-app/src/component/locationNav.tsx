import React, { useEffect } from "react";
import { directoryType } from "../type/directoryType";
import { useDirectoryNavStore, useDirectoryTypeStore } from "../lib/store";
import '../styles/style.css'

export default function directoryNav() {
    const { setLocation, location, setParentID } = useDirectoryNavStore()
    const { setDirectoryType } = useDirectoryTypeStore()

    function handleOnNavClick(e: any) {
        const newNavIndex: number = parseInt(e.currentTarget.id.split('-')[3]);
        const newNavRemoveIndex: number = newNavIndex + 1;
        setLocation(newNavRemoveIndex)
        setDirectoryType(location[newNavIndex].directoryType)
        setParentID(location[newNavIndex].directoryID)
    }

    return (
        <div className="directoryContainer d-flex">
            {location && location.map((directory: directoryType, index: number) => {
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