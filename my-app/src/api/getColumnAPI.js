// API for fetching columns

export function fetchColumns() {
    const req = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    }
    return fetch(`http://localhost:4000/api/column/get`, req).then((res) =>
        res.json(),
    )
};
