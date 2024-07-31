import React from "react";
import { useDirectoryNavStore, useDirectoryTypeStore } from "../lib/store";
import { directoryType } from '../type/directoryType'

export default function SubFolderContainer({ subDirectories }) {
    const { addLocation, setParentID, setSheetID } = useDirectoryNavStore();
    const { setDirectoryType } = useDirectoryTypeStore();

    function handleSubDirectoryOnClick(e: any) {
        const subDirectoryIndex = e.currentTarget.id.split('-')[3]
        const subDirectoriesCopy = [...subDirectories]
        const toBeAddedDirectory = subDirectoriesCopy.splice(subDirectoryIndex, 1)
        const newDirectoryType = toBeAddedDirectory[0].sheetID ? "sheet" : "directory";
        const newParentID = toBeAddedDirectory[0].directoryID
        const newSheetID = toBeAddedDirectory[0].sheetID
        addLocation(...toBeAddedDirectory)
        setDirectoryType(newDirectoryType)
        setParentID(newParentID)
        setSheetID(newSheetID)
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

    return (
        <div className="subDirContainer d-flex flex-wrap-wrap">
            {subDirectories && subDirectories.map((subDirectory: directoryType, index: number) => (displayDirectory(subDirectory, index)))}
        </div>
    )
}