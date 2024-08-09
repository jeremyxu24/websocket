import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
// import { queryClient } from "../lib/queryClient";
import { patchColPosToSheet } from "../api/patchColPosToSheetAPI";

export default function usePatchColumnPosition() {
    const [colPosTooltipVisible, setColPosTooltipVisible] = useState(false);

    const { mutate: patchColPosMutate, isSuccess: patchColPosMutateIsSuccess, isError: patchColPosMutateIsError, isPending: patchColPosMutateIsPending, error: patchColPosMutateError } = useMutation({
        mutationFn: (newColPos: { positionIndex: number, id: string, colSheetID: number }[]) => patchColPosToSheet(newColPos)
        , onSuccess: () => {
            // Invalidate and refetch
            // queryClient.invalidateQueries({ queryKey: ['sheetData'] })

            // tooltip logic
            setColPosTooltipVisible(true)
            setTimeout(() => {
                setColPosTooltipVisible(false)
            }, 3000)
        }
        // , onError: () => {

        // }
    })

    return { patchColPosMutateIsError, patchColPosMutate, colPosTooltipVisible, patchColPosMutateIsSuccess, patchColPosMutateIsPending, patchColPosMutateError }
}