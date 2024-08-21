import { useMutation } from "@tanstack/react-query";
import { deleteRowFromSheet } from "../api/deleteRowFromSheetAPI.js";
import { queryClient } from '../lib/queryClient.js'
import { useState } from "react";

export default function useDeleteRowFromSheet() {
    const [deleteRowTooltipVisible, setDeleteRowTooltipVisible] = useState(false);
    const [tooltipMessage, setTooltipMessage] = useState<string>('')
    const { mutate, isPending } = useMutation({
        mutationFn: (payload: { rowID: number, sheetID: number }) => deleteRowFromSheet(payload),
        onSuccess: () => {
            // Invalidate and refetch
            queryClient.invalidateQueries({ queryKey: ['sheetData'] })
            setTooltipMessage('Successfully deleted.')
            setDeleteRowTooltipVisible(true)
            setTimeout(() => {
                setDeleteRowTooltipVisible(false)
                setTooltipMessage('')
            }, 3000)
        },
        onError: () => {
            setDeleteRowTooltipVisible(true)
            setTooltipMessage('Error has occured.')
            setTimeout(() => {
                setDeleteRowTooltipVisible(false)
                setTooltipMessage('')
            }, 3000)
        }
    });
    return { mutate, isPending, deleteRowTooltipVisible, tooltipMessage }
}