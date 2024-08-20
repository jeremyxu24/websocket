import { useState } from 'react'
import {
    useMutation,
} from '@tanstack/react-query'
import { queryClient } from '../lib/queryClient.js'
import { postNewSheet } from '../api/postSheetAPI.js'
import { newSheetType } from '../type/directoryType.js'

export default function useAddSheet() {
    const [addSheetTooltipVisible, setAddSheetDirTooltipVisible] = useState(false);
    const [addSbeetTooltipMessage, setAddSheetTooltipMessage] = useState<string>('')

    const { mutate: addSheetMutate } = useMutation({
        mutationFn: (newSheet: newSheetType) => postNewSheet(newSheet)
        , onSuccess: () => {
            // Invalidate and refetch
            queryClient.invalidateQueries({ queryKey: ['subDirectories'] })
            setAddSheetDirTooltipVisible(true)
            setAddSheetTooltipMessage('Successfully Added.')
            setTimeout(() => {
                setAddSheetDirTooltipVisible(false)
                setAddSheetTooltipMessage('')
            }, 3000)
        },
        onError: () => {
            setAddSheetDirTooltipVisible(true)
            setAddSheetTooltipMessage('Error has occured.')
            setTimeout(() => {
                setAddSheetDirTooltipVisible(false)
                setAddSheetTooltipMessage('')
            }, 3000)
        }
    })
    return { addSheetTooltipVisible, addSbeetTooltipMessage, addSheetMutate }
}