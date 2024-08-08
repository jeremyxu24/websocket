import { useQuery } from "@tanstack/react-query";
import { getSheetData } from "../api/getSheetDataAPI";
import { useDirectoryNavStore } from "../lib/store";

export default function useFetchSheetData() {
    const { sheetID } = useDirectoryNavStore();
    const { data, isPending, error } = useQuery({
        queryKey: ['sheetData'],
        queryFn: () => getSheetData(sheetID),
    })
    return { data, isPending, error }
}