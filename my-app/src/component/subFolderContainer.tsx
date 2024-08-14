import React from "react";
import { directoryType } from '../type/directoryType'

export default function SubFolderContainer({ subDirectories, onNavigate, directoryError, directoryPending }) {

    function handleSubDirectoryOnClick(e: any) {
        const subDirectoryIndex = e.currentTarget.id.split('-')[3]
        const subDirectoriesCopy = [...subDirectories]
        const toBeAddedDirectory = subDirectoriesCopy.splice(subDirectoryIndex, 1)
        const newDirectoryType = toBeAddedDirectory[0].sheetID ? "sheet" : "directory";
        const newParentID = toBeAddedDirectory[0].directoryID
        const newSheetID = toBeAddedDirectory[0].sheetID
        onNavigate(newDirectoryType, newSheetID ? newSheetID : newParentID)
    }

    function subFolderOrSheet(sheetID: number | null) {
        if (!sheetID) return <div className="directoryIcon" />
        else return <div className="sheetIcon" />
    }

    function displayDirectory(directory: directoryType, index: number) {
        return (
            <div key={`subDirectory-${index}`} className="subDirContentDiv d-flex" id={`subDirectoryID-${directory.directoryID}-index-${index}`} onClick={handleSubDirectoryOnClick}>
                {subFolderOrSheet(directory.sheetID)}
                <div className="subFolderTextContent">
                    {directory.sheetLabel ? directory.sheetLabel : directory.directoryLabel}
                </div>
            </div>
        )
    }

    if (directoryPending) return <>Loading directories...</>
    else if (directoryError) return (
        <div style={{ padding: '20px' }}>
            <h3>An error has occurred. {directoryError.message}</h3>
        </div>
    )

    else return (
        <div className="subDirContainer d-flex flex-wrap-wrap">
            {subDirectories && subDirectories.map((subDirectory: directoryType, index: number) => (displayDirectory(subDirectory, index)))}
        </div>
    )
}