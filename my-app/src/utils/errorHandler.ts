export default function errorHandler(response: Response) {
    if (response.status === 404) return 'Route not found.'
    if (response.status === 401) return ''
}