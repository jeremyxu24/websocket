import {
    useMutation,
} from '@tanstack/react-query'
import { queryClient } from '../lib/queryClient.js'
import { postNewSheet } from '../api/postSheetAPI.js'
import { newSheetType } from '../type/directoryType.js'

export default function useAddSheet() {
    return useMutation({
        mutationFn: (newSheet: newSheetType) => postNewSheet(newSheet)
        , onSuccess: () => {
            // Invalidate and refetch
            queryClient.invalidateQueries({ queryKey: ['subDirectories'] })
        }, onError: (err) => {
            console.error('Error adding directory:', err)
        }
    })
}