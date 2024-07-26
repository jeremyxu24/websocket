import {
    useQuery,
} from '@tanstack/react-query'
import { fetchDirectories } from '../api/getDirectoryAPI';
import { useDirectoryNavStore } from '../lib/store';


// export default function useFetchDirectory(params: { parentID: number }) {
const useFetchDirectory = () => {
    const parentID = useDirectoryNavStore((state) => state.parentID)
    return useQuery({
        queryKey: ['subDirectories', parentID],
        queryFn: fetchDirectories
        // queryFn: ({ queryKey }) =>
        //     fetch(`http://localhost:4000/${queryKey[1]}`).then((res) =>
        //         res.json(),
        //     ),
    })
}
export default useFetchDirectory;