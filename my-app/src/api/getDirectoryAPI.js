// API for fetching directories

// export function fetchDirectories({ queryKey }) {
export async function fetchDirectories(directoryID) {
    const req = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    }
    // return fetch(`http://localhost:4000/api/directory/get/${queryKey[1]}`, req).then((res) =>
    const response = await fetch(`http://localhost:4000/api/directory/get/${directoryID}`, req)
    if (!response.ok) {
        // console.log(response)
        if (response.status === 409) throw new Error('Name has to be unique.')
        throw new Error(response.statusText)
    }
    return response.json()
};