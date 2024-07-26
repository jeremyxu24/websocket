type directoryType = {
    directoryLabel: string,
    directoryURL: string,
    directoryID: number,
    parentID: number | null,
    directoryType: string,
    sheetID: number | null,
    sheetLabel: string | null,
    sheetURL?: string | null
}

type newDirectoryType = {
    directoryLabel: string,
    directoryURL: string,
    parentID: number | null,
    directoryType: string,
}

type newSheetType = {
    directoryID: number,
    sheetLabel: string,
    sheetURL: string,
}

export type { directoryType, newDirectoryType, newSheetType }