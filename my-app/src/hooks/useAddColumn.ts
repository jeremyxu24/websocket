import {
    useMutation,
} from '@tanstack/react-query'
import { queryClient } from '../lib/queryClient.js'
import { ColumnType } from '../type/columnType.js'
import { postNewColumn } from '../api/postNewColumnAPI.js'
import { useState } from 'react'

export default function useAddColumn() {
    const [addColTooltipVisible, setAddColTooltipVisible] = useState(false);
    const [addColTooltipMessage, setAddColTooltipMessage] = useState<string>('')

    const { mutate: newColumnMutate, isSuccess: newColumnMutateIsSuccess, isError: newColumnMutateIsError, isPending: newColumnMutateIsPending, error: newColumnMutateError } = useMutation({
        mutationFn: (newColumn: ColumnType) => postNewColumn(newColumn)
        , onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['columns'] })
            setAddColTooltipVisible(true)
            setAddColTooltipMessage('Successfully Added.')
            setTimeout(() => {
                setAddColTooltipVisible(false)
                setAddColTooltipMessage('')
            }, 3000)
        },
        onError: () => {
            setAddColTooltipVisible(true)
            setAddColTooltipMessage('Error has occured.')
            setTimeout(() => {
                setAddColTooltipVisible(false)
                setAddColTooltipMessage('')
            }, 3000)
        }

    })

    return { newColumnMutateIsError, newColumnMutate, addColTooltipVisible, newColumnMutateIsSuccess, newColumnMutateIsPending, newColumnMutateError, addColTooltipMessage }
}