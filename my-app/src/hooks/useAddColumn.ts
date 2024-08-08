import {
    useMutation,
} from '@tanstack/react-query'
import { queryClient } from '../lib/queryClient.js'
import { ColumnType } from '../type/columnType.js'
import { postNewColumn } from '../api/postNewColumnAPI.js'
import { useState } from 'react'

export default function useAddColumn() {
    const [tooltipVisible, setTooltipVisible] = useState(false);

    const { mutate: newColumnMutate, isSuccess: newColumnMutateIsSuccess, isError: newColumnMutateIsError, isPending: newColumnMutateIsPending, error: newColumnMutateError } = useMutation({
        mutationFn: (newColumn: ColumnType) => postNewColumn(newColumn)
        , onSuccess: () => {
            // Invalidate and refetch
            queryClient.invalidateQueries({ queryKey: ['columns'] })
            // tooltip logic
            setTooltipVisible(true)
            setTimeout(() => {
                setTooltipVisible(false)
            }, 3000)
        }
        // , onError: () => {

        // }
    })

    return { newColumnMutateIsError, newColumnMutate, tooltipVisible, newColumnMutateIsSuccess, newColumnMutateIsPending, newColumnMutateError }
}