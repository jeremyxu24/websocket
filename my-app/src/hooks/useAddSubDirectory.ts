import { useState } from 'react'
import {
    useMutation,
} from '@tanstack/react-query'
import { queryClient } from '../lib/queryClient.js'
import { newDirectoryType } from '../type/directoryType.js'
import { postNewDirectory } from '../api/postDirectoryAPI.js'

export default function useAddSubDirectory() {
    const [addSubDirTooltipVisible, setAddSubDirTooltipVisible] = useState(false);
    const [addSubDirTooltipMessage, setAddSubDirTooltipMessage] = useState<string>('')

    const { mutate: addNewDirMutate } = useMutation({
        mutationFn: (newDirectory: newDirectoryType) => postNewDirectory(newDirectory),
        onSuccess: () => {
            // Invalidate and refetch
            queryClient.invalidateQueries({ queryKey: ['subDirectories'] })
            setAddSubDirTooltipVisible(true)
            setAddSubDirTooltipMessage('Successfully Added.')
            setTimeout(() => {
                setAddSubDirTooltipVisible(false)
                setAddSubDirTooltipMessage('')
            }, 3000)
        },
        onError: () => {
            setAddSubDirTooltipVisible(true)
            setAddSubDirTooltipMessage('Error has occured.')
            setTimeout(() => {
                setAddSubDirTooltipVisible(false)
                setAddSubDirTooltipMessage('')
            }, 3000)
        }
    })

    return { addSubDirTooltipVisible, addSubDirTooltipMessage, addNewDirMutate }
}