// API for fetching directories

export function postNewSheet(newSheet) {
    const req = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newSheet)
    }
    return fetch(`http://localhost:4000/api/directory/create/newSheet`, req).then((res) =>
        res.json(),
    )
};
