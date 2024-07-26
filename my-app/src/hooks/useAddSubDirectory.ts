import {
    useMutation,
} from '@tanstack/react-query'
import { queryClient } from '../lib/queryClient.js'
import { postNewDirectory } from '../api/postDirectoryAPI.js'
import { newDirectoryType } from '../type/directoryType.js'

export default function useAddSubDirectory() {
    return useMutation({
        mutationFn: (newDirectory: newDirectoryType) => postNewDirectory(newDirectory)
        // fetch(`http://localhost:4000//api/directory/create/newDirectory`).then((res) =>
        //     res.json(),
        // )
        , onSuccess: () => {
            // Invalidate and refetch
            queryClient.invalidateQueries({ queryKey: ['subDirectories'] })
        }, onError: (err) => {
            console.error('Error adding directory:', err)
        }
    })
}