import { useMutation } from "@tanstack/react-query";
import { postNewRow } from "../api/postNewRowToSheetAPI";
import { useState } from "react";
import { queryClient } from "../lib/queryClient";

export default function useAddRowToSheet() {
    const [tooltipAddRowVisible, setToolAddRowtipVisible] = useState(false);
    const [tooltipAddRowMessage, setTooltipAddRowMessage] = useState<string>('');

    const { mutate: newRowMutate, isSuccess: newRowMutateIsSuccess, isError: newRowMutateIsError, isPending: newRowMutateIsPending, error: newrowMutateError } = useMutation({
        mutationFn: (sheetID: { sheetID: number }) => postNewRow(sheetID)
        , onSuccess: () => {
            // Invalidate and refetch
            queryClient.invalidateQueries({ queryKey: ['sheetData'] })
            // tooltip logic
            setToolAddRowtipVisible(true)
            setTooltipAddRowMessage('New row added.')
            setTimeout(() => {
                setToolAddRowtipVisible(false)
                setTooltipAddRowMessage('')
            }, 1500)
        },
        onError: () => {
            setToolAddRowtipVisible(true)
            setTooltipAddRowMessage('Error has occured.')
            setTimeout(() => {
                setToolAddRowtipVisible(false)
                setTooltipAddRowMessage('')
            }, 3000)
        }
    })

    return { newRowMutateIsError, newRowMutate, tooltipAddRowVisible, newRowMutateIsSuccess, newRowMutateIsPending, newrowMutateError, tooltipAddRowMessage }
}