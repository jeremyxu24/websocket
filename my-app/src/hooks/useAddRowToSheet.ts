import { useMutation } from "@tanstack/react-query";
import { postNewRow } from "../api/postNewRowToSheetAPI";
import { useState } from "react";
import { queryClient } from "../lib/queryClient";
import { useDirectoryNavStore } from "../lib/store";

export default function useAddRowToSheet() {
    const [tooltipRowVisible, setToolRowtipVisible] = useState(false);
    const { sheetID } = useDirectoryNavStore();

    const { mutate: newRowMutate, isSuccess: newRowMutateIsSuccess, isError: newRowMutateIsError, isPending: newRowMutateIsPending, error: newrowMutateError } = useMutation({
        mutationFn: (newRow: { rowNumber: number }) => postNewRow({ ...newRow, sheetID })
        , onSuccess: () => {
            // Invalidate and refetch
            queryClient.invalidateQueries({ queryKey: ['sheetData'] })
            // tooltip logic
            setToolRowtipVisible(true)
            setTimeout(() => {
                setToolRowtipVisible(false)
            }, 3000)
        }
        // , onError: () => {

        // }
    })

    return { newRowMutateIsError, newRowMutate, tooltipRowVisible, newRowMutateIsSuccess, newRowMutateIsPending, newrowMutateError }
}