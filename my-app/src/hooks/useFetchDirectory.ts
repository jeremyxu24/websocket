import {
    useQuery,
} from '@tanstack/react-query'
import { fetchDirectories } from '../api/getDirectoryAPI';
// import { useDirectoryNavStore } from '../lib/store';


// export default function useFetchDirectory(params: { parentID: number }) {
export default function useFetchDirectory(directoryID: number, type: string) {
    // const parentID = useDirectoryNavStore((state) => state.parentID)
    const { data, isPending, error } = useQuery({
        // queryKey: ['subDirectories', parentID],
        queryKey: ['subDirectories', directoryID],
        queryFn: () => fetchDirectories(directoryID),
        enabled: type === 'directory' && !!directoryID
    })
    return { data, isPending, error }
}