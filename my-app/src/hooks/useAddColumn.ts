import {
    useMutation,
} from '@tanstack/react-query'
import { queryClient } from '../lib/queryClient.js'
import { ColumnType } from '../type/columnType.js'
import { postNewColumn } from '../api/postNewColumnAPI.js'

export default function useAddColumn() {
    return useMutation({
        mutationFn: (newColumn: ColumnType) => postNewColumn(newColumn)
        , onSuccess: () => {
            // Invalidate and refetch
            queryClient.invalidateQueries({ queryKey: ['columns'] })
        }
        // , onError: (err) => {
        //     console.error('Error adding directory:', err)
        // }
    })
}