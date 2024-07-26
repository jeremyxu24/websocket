// API for fetching directories

export function fetchDirectories({ queryKey }) {
    const req = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    }
    return fetch(`http://localhost:4000/api/directory/get/${queryKey[1]}`, req).then((res) =>
        res.json(),
    )
};
