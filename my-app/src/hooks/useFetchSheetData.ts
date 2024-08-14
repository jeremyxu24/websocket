import { useQuery } from "@tanstack/react-query";
import { getSheetData } from "../api/getSheetDataAPI";

export function useFetchSheetData(sheetID: number) {
    const { data, isPending, error } = useQuery({
        queryKey: ['sheetData'],
        queryFn: () => getSheetData(sheetID),
    })
    return { data, isPending, error }
}