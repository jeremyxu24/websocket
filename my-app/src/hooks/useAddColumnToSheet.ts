import { useState } from 'react'
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
    const [tooltipAddColToSheetVisible, setTooltipAddColToSheetVisible] = useState<boolean>(false);
    const [tooltipAddColToSheetMessage, setTooltipAddColToSheetMessage] = useState<string>('');

    const { mutate: addColToSheetMutate, isPending: addColToSheetIsPending } = useMutation({
        mutationFn: (newColumn: columnToSheetType) => postNewColumnToSheet(newColumn)
        , onSuccess: () => {
            // need to refresh the sheetData on add column to sheet
            // Invalidate and refetch
            queryClient.invalidateQueries({ queryKey: ['sheetData'] })
            setTooltipAddColToSheetVisible(true)
            setTooltipAddColToSheetMessage('Column added.')
            setTimeout(() => {
                setTooltipAddColToSheetVisible(false)
                setTooltipAddColToSheetMessage('')
            }, 1500)
        },
        onError: () => {
            setTooltipAddColToSheetVisible(true)
            setTooltipAddColToSheetMessage('Error has occured.')
            setTimeout(() => {
                setTooltipAddColToSheetVisible(false)
                setTooltipAddColToSheetMessage('')
            }, 3000)
        }
    })

    return { tooltipAddColToSheetVisible, tooltipAddColToSheetMessage, addColToSheetMutate, addColToSheetIsPending }
}