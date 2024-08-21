import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
// import { queryClient } from "../lib/queryClient";
import { patchColPosToSheet } from "../api/patchColPosToSheetAPI";

export default function usePatchColumnPosition() {
    const [colPosTooltipVisible, setColPosTooltipVisible] = useState<boolean>(false);
    const [colPosTooltipMessage, setColPosTooltipMessage] = useState<string>('');

    const { mutate: patchColPosMutate, isSuccess: patchColPosMutateIsSuccess, isError: patchColPosMutateIsError, isPending: patchColPosMutateIsPending, error: patchColPosMutateError } = useMutation({
        mutationFn: (newColPos: { newColPos: { positionIndex: number, id: string, colSheetID: number }[], sheetID: number }) => patchColPosToSheet(newColPos)
        , onSuccess: () => {
            // Invalidate and refetch
            // queryClient.invalidateQueries({ queryKey: ['sheetData'] })

            // tooltip logic
            setColPosTooltipVisible(true)
            setColPosTooltipMessage('Column updated.')
            setTimeout(() => {
                setColPosTooltipVisible(false)
                setColPosTooltipMessage('')
            }, 1500)
        },
        onError: () => {
            setColPosTooltipVisible(true)
            setColPosTooltipMessage('Error has occured.')
            setTimeout(() => {
                setColPosTooltipVisible(false)
                setColPosTooltipMessage('')
            }, 3000)
        }
    })

    return { patchColPosMutateIsError, patchColPosMutate, colPosTooltipVisible, patchColPosMutateIsSuccess, patchColPosMutateIsPending, patchColPosMutateError, colPosTooltipMessage }
}