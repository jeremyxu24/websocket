import { useMutation } from "@tanstack/react-query";
import { deleteColumnFromSheet } from "../api/deleteColumnFromSheetAPI.js";
import { queryClient } from '../lib/queryClient.js'
import { useState } from "react";

export default function useDeleteColumnFromSheet() {
    const [deleteColumnTooltipVisible, setDeleteColumnTooltipVisible] = useState(false);
    const [tooltipMessage, setTooltipMessage] = useState<string>('')

    const { mutate, isPending } = useMutation({
        mutationFn: (payload: { colSheetID: number, sheetID: number }) => deleteColumnFromSheet(payload),
        onSuccess: () => {
            // Invalidate and refetch
            queryClient.invalidateQueries({ queryKey: ['sheetData'] })
            setDeleteColumnTooltipVisible(true)
            setTooltipMessage('Successfully deleted.')
            setTimeout(() => {
                setDeleteColumnTooltipVisible(false)
                setTooltipMessage('')
            }, 3000)
        },
        onError: () => {
            setDeleteColumnTooltipVisible(true)
            setTooltipMessage('Error has occured.')
            setTimeout(() => {
                setDeleteColumnTooltipVisible(false)
                setTooltipMessage('')
            }, 3000)
        }
    });
    return { mutate, isPending, deleteColumnTooltipVisible, tooltipMessage }
}