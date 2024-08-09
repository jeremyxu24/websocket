import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { queryClient } from "../lib/queryClient";
import { postNewResponse } from "../api/postResponseAPI";

export default function useAddResponse() {
    const [tooltipResponseVisible, setToolResponsetipVisible] = useState(false);

    const { mutate: newResponseMutate, isSuccess: newResponseMutateIsSuccess, isError: newResponseMutateIsError, isPending: newResponseMutateIsPending, error: newResponseMutateError } = useMutation({
        mutationFn: (newResponse: { value: number | string | Date | unknown, responseID: number | null, rowID: number, colSheetID: number }) => postNewResponse(newResponse)
        , onSuccess: () => {
            // Invalidate and refetch
            queryClient.invalidateQueries({ queryKey: ['sheetData'] })
            // tooltip logic
            setToolResponsetipVisible(true)
            setTimeout(() => {
                setToolResponsetipVisible(false)
            }, 3000)
        }
        // , onError: () => {

        // }
    })

    return { newResponseMutateIsError, newResponseMutate, tooltipResponseVisible, newResponseMutateIsSuccess, newResponseMutateIsPending, newResponseMutateError }
}