import { useMutation } from "@tanstack/react-query";
import { deleteDirectoryOrSheetAPI } from "../api/deleteDirectoryOrSheetAPI";
import { queryClient } from '../lib/queryClient.js'
import { useState } from "react";

export default function useDeleteDirectoryOrSheet() {
    const [deleteDirTooltipVisible, setDeleteDirTooltipVisible] = useState<boolean>(false);
    const [tooltipMessage, setTooltipMessage] = useState<string>('')
    const { mutate: deleteDirectoryMutate, isPending: deleteDirectoryIsPending, status: deleteDirectoryStatus, error: deleteDirectoryError } = useMutation({
        mutationFn: (payload: { Type: string, ID: number }) => deleteDirectoryOrSheetAPI(payload),
        onSuccess: () => {
            // Invalidate and refetch
            queryClient.invalidateQueries({ queryKey: ['subDirectories'] })
            setDeleteDirTooltipVisible(true)
            setTooltipMessage('Successfully deleted.')
            setTimeout(() => {
                setDeleteDirTooltipVisible(false)
                setTooltipMessage('')
            }, 3000)
        },
        onError: () => {
            setDeleteDirTooltipVisible(true)
            setTooltipMessage('Error has occured.')
            setTimeout(() => {
                setDeleteDirTooltipVisible(false)
                setTooltipMessage('')
            }, 3000)
        }
    });
    return { deleteDirectoryMutate, deleteDirectoryIsPending, deleteDirectoryStatus, deleteDirectoryError, deleteDirTooltipVisible, tooltipMessage }
}