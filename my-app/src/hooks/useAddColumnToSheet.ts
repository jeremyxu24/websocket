import {
    useMutation,
} from '@tanstack/react-query'
import { queryClient } from '../lib/queryClient.js'
import { postNewColumnToSheet } from '../api/postNewColumnToSheetAPI.js'
type columnToSheetType = {
    sheetID: number,
    selectedColumnID: number,
    selectedIndex: number
}

export default function useAddColumToSheet() {
    return useMutation({
        mutationFn: (newColumn: columnToSheetType) => postNewColumnToSheet(newColumn)
        , onSuccess: () => {
            // need to refresh the sheetData on add column to sheet
            // Invalidate and refetch
            queryClient.invalidateQueries({ queryKey: ['sheetData'] })
        }
    })
}