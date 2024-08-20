import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { queryClient } from "../lib/queryClient";
import { postNewResponse } from "../api/postResponseAPI";

export default function useAddResponse() {
    const [tooltipResponseVisible, setToolResponsetipVisible] = useState<boolean>(false);
    const [tooltipResponseMessage, setTooltipResponseMessage] = useState<string>('');

    const { mutate: newResponseMutate, isSuccess: newResponseMutateIsSuccess, isError: newResponseMutateIsError, isPending: newResponseMutateIsPending, error: newResponseMutateError } = useMutation({
        mutationFn: (newResponse: { value: number | string | Date | unknown, responseID: number | null, rowID: number, colSheetID: number }) => postNewResponse(newResponse)
        , onSuccess: () => {
            // Invalidate and refetch
            queryClient.invalidateQueries({ queryKey: ['sheetData'] })
            // tooltip logic
            setToolResponsetipVisible(true)
            setTooltipResponseMessage('Cell updated')
            setTimeout(() => {
                setToolResponsetipVisible(false)
                setTooltipResponseMessage('')
            }, 1500)
        },
        onError: () => {
            setToolResponsetipVisible(true)
            setTooltipResponseMessage('Error has occured.')
            setTimeout(() => {
                setToolResponsetipVisible(false)
                setTooltipResponseMessage('')
            }, 3000)
        }
    })

    return { newResponseMutateIsError, newResponseMutate, tooltipResponseVisible, newResponseMutateIsSuccess, newResponseMutateIsPending, newResponseMutateError, tooltipResponseMessage }
}