import { create } from 'zustand';

export const useSheetStore = create((set) => ({
    sheet: [], // [{label: string, url: string}, ... ],
    selectedSheet: '',
    setSheet: (value) => set({ sheet: value }),
    addSheet: (value) => set((state) => ({ sheet: [...state.sheet, value] })),
    setSelectedSheet: (value) => set({ selectedSheet: value })
}))

export const useColumnStore = create((set) => ({
    column: [], // [{columnName: string, datatype: string}]
    addColumn: (value) => set(state => ({ column: [...state.column, value] }))
}))

export const useLocationStore = create((set) => ({
    locationType: 'folder',
    locations: [],
    setInitialLocation: (locations) => set({ locations }),
    setLocation: (index) => set((state) => {
        const locationsCopy = [...state.locations]
        locationsCopy.splice(index)

        return { locations: locationsCopy }
    }),
    addLocation: (value) => set((state) => ({ location: [...state.location, value] }))
}))

export const useSubLocationStore = create((set) => ({
    subLocations: [],
    setInitialSubLocation: (subLocations) => set({ subLocations }),
    setSubLocation: (subLocations) => ({ subLocations })
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