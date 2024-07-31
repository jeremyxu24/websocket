import {
    useQuery,
} from '@tanstack/react-query'
import { fetchColumns } from '../api/getColumnAPI';

// export default function useFetchDirectory(params: { parentID: number }) {
const useFetchColumn = () => {
    return useQuery({
        queryKey: ['columns'],
        queryFn: fetchColumns
    })
}
export default useFetchColumn;