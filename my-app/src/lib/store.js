import { create } from 'zustand';

export const useColumnStore = create((set) => ({
    column: [], // [{columnName: string, datatype: string}]
    addColumn: (value) => set(state => ({ column: [...state.column, value] }))
}))

// export const useDirectoryStore = create((set) => ({
//     directoryType: 'directory',
//     directories: [],
//     setInitialDirectories: (directories) => set({ directories }),
//     setDirectories: (index) => set((state) => {
//         const directoriesCopy = [...state.directories]
//         directoriesCopy.splice(index)

//         return { directories: directoriesCopy }
//     }),
//     addDirectory: (value) => set((state) => ({ directories: [...state.directories, value] })),
//     setDirectoryType: (directoryType) => set({ directoryType })
// }))

// export const useSubDirectoryStore = create((set) => ({
//     subDirectories: [],
//     setInitialSubDirectories: (subDirectories) => set({ subDirectories }),
//     setSubDirectories: (subDirectories) => ({ subDirectories }),
//     addSubDirectory: (value) => set((state) => ({ subDirectories: [...state.subDirectories, value] }))
// }))

export const useDirectoryTypeStore = create((set) => ({
    type: 'directory',
    setDirectoryType: (type) => set({ type }),
    resetDirectoryType: () => set({ type: 'directory' })
}))

export const useDirectoryNavStore = create((set) => ({
    parentID: 1,
    location: [{ directoryLabel: 'Main', directoryID: 1, directoryType: 'directory' }],
    sheetID: null,
    setLocation: (index) => set((state) => {
        const locationCopy = [...state.location]
        locationCopy.splice(index)

        return { location: locationCopy }
    }),
    addLocation: (value) => set((state) => ({ location: [...state.location, value] })),
    setParentID: (value) => set({ parentID: value }),
    setSheetID: (value) => set({ sheetID: value }),
    resetSheetID: () => set({ sheetID: null })
}))

// category sheet table
// categoryID

// user table

// permission table


// initial -> sheetID

// sheet
// sheetID, label, url, categoryID
// sheetID => columnID & relationshipID


// relationship table:
// relationshipID, columnID, sheetID, colPosition

// response table:
// responseID, value, relationshipID, rowID


// table 1 => sorting, add row/column, editable cell, resizing, moving column
// table 1 need adjusing data type selection