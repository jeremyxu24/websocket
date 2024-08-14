import {
    useQuery,
} from '@tanstack/react-query'
import { fetchNavLocation } from '../api/getNavLocationAPI';


// export default function useFetchDirectory(params: { parentID: number }) {
export default function useFetchNavLocation(directoryID: number, type: string) {
    const { data, isPending, isError, error } = useQuery({
        queryKey: ['subDirectories', 'sheetData', directoryID, type],
        queryFn: () => fetchNavLocation(directoryID, type),
        enabled: !!type && !!directoryID
    })
    return { data, isPending, isError, error }
}