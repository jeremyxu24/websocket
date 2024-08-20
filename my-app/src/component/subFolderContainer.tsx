import React, { MouseEventHandler, useState, useRef } from "react";
import '../styles/popup.css'
import '../styles/style.css'
import { directoryType } from '../type/directoryType'
import useSingleAndDoubleClick from "../hooks/useSingleAndDoubleClick";
import useDeleteDirectoryOrSheet from "../hooks/useDeleteDirectoryOrSheet";
import Tooltip from "./tooltip";

export default function SubFolderContainer({ subDirectories, onNavigate, directoryError, directoryPending }) {
    const [selectedFileIndex, setSelectedFileIndex] = useState<null | number>(null);
    const [popperDisplayState, setPopperDisplayState] = useState<boolean>(false);
    const { deleteDirectoryMutate, deleteDirectoryIsPending, deleteDirectoryStatus, deleteDirectoryError, deleteDirTooltipVisible, tooltipMessage } = useDeleteDirectoryOrSheet()

    const handleSubDirectoryOnClick: MouseEventHandler<HTMLDivElement> = (e) => {
        let currentTargetID: string;
        if (!(e.target as HTMLDivElement).id.includes('subDirectoryID')) currentTargetID = (e.target as HTMLDivElement).parentElement?.id.split('-')[3] || ''
        else currentTargetID = (e.target as HTMLDivElement).id.split('-')[3]
        const subDirectoryIndex = parseInt(currentTargetID)
        const subDirectoriesCopy = [...subDirectories]
        const toBeAddedDirectory = subDirectoriesCopy.splice(subDirectoryIndex, 1)
        const newDirectoryType = toBeAddedDirectory[0].sheetID ? "sheet" : "directory";
        const newParentID = toBeAddedDirectory[0].directoryID
        const newSheetID = toBeAddedDirectory[0].sheetID
        onNavigate(newDirectoryType, newSheetID ? newSheetID : newParentID)
    }

    const handleSingleClick: MouseEventHandler<HTMLDivElement> = (e) => {
        let newSelectedID: string;
        if (!(e.target as Element).id.includes('subDirectoryID')) newSelectedID = ((e.target as Element)?.parentNode as Element)?.id.split('-')[3]
        else newSelectedID = (e.target as Element).id.split('-')[3]
        setSelectedFileIndex(parseInt(newSelectedID))
        e.stopPropagation();
    }

    const click = useSingleAndDoubleClick(handleSingleClick, handleSubDirectoryOnClick)

    function subFolderOrSheet(sheetID: number | null) {
        if (!sheetID) return <div className="directoryIcon" />
        else return <div className="sheetIcon" />
    }

    function displayDirectory(directory: directoryType, index: number) {
        return (
            <div key={`subDirectory-${index}`} className={`subDirContentDiv d-flex ${selectedFileIndex === index ? 'subDirContentDivSelected' : ''}`} id={`subDirectoryID-${directory.directoryID}-index-${index}`}
                // onClick={handleSubDirectoryOnClick}
                onClick={click}
            >
                {subFolderOrSheet(directory.sheetID)}
                <div className="subFolderTextContent">
                    {directory.sheetLabel ? directory.sheetLabel : directory.directoryLabel}
                </div>
            </div>
        )
    }

    const handleDelete: MouseEventHandler<HTMLButtonElement> = (e) => {
        e.stopPropagation();
        setPopperDisplayState(true);
    }

    function handleDeselect() {
        setSelectedFileIndex(null)
    }

    const AddColumnPopper = () => {
        const popupContentRef = useRef<HTMLDivElement>(null);

        const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
            if (e.target === e.currentTarget) {
                setPopperDisplayState(false);
            }
        };

        const handlePopupClick = (e: React.MouseEvent<HTMLDivElement>) => {
            e.stopPropagation();
        };

        function handleDeleteDirectoryOrSheet() {
            // check if index is null or out of bound
            if (selectedFileIndex === null) return
            if (selectedFileIndex < 0 || selectedFileIndex > subDirectories.length - 1) return
            const subDirectoriesCopy = [...subDirectories]
            const toBeAddedDirectory = subDirectoriesCopy.splice(selectedFileIndex, 1)
            const deletingType: string = toBeAddedDirectory[0].sheetID ? "sheet" : "directory";
            const deletingID: number = deletingType === 'directory' ? toBeAddedDirectory[0].directoryID : toBeAddedDirectory[0].sheetID
            const payload = { Type: deletingType, ID: deletingID }
            deleteDirectoryMutate(payload)
            setPopperDisplayState(false)
            setSelectedFileIndex(null)
        }

        if (!popperDisplayState) return null;
        else return (
            <div className="popup-overlay" onClick={handleOverlayClick}>
                <div
                    className="popup-content add-column-popper"
                    ref={popupContentRef}
                    onClick={handlePopupClick}
                >
                    <div>Are you sure? Deleting folder will also delete sub folders and sheets. This action cannot be reversed!</div>
                    {
                        deleteDirectoryIsPending && <>Deleting...</>
                    }
                    {
                        !deleteDirectoryIsPending && deleteDirectoryStatus === 'idle' &&
                        <>
                            <button onClick={handleDeleteDirectoryOrSheet}>Confirm</button>
                            <button onClick={() => setPopperDisplayState(false)}>Cancel</button>
                        </>
                    }
                    {
                        deleteDirectoryError && <>An error has occurred. Reload the page and try again.</>
                    }
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
        <>
            <div className="subDirContainer d-flex flex-wrap-wrap" onClick={handleDeselect}>
                <div style={{ flexBasis: '100%', marginBottom: '20px', height: '30px', width: '200px', background: '#f7f8f9', borderRadius: '5px', paddingLeft: '10px' }}>
                    {selectedFileIndex !== null && <div style={{ display: 'flex', gap: '10px', alignItems: 'center', height: '100%' }}>
                        1 item selected.
                        <button onClick={handleDelete}>
                            Delete
                        </button>
                    </div>}
                </div>
                {subDirectories && subDirectories.map((subDirectory: directoryType, index: number) => (displayDirectory(subDirectory, index)))}
            </div>
            <AddColumnPopper />
            <Tooltip
                message={tooltipMessage}
                visible={deleteDirTooltipVisible}
                className="tooltipCenter" />
        </>
    )
}