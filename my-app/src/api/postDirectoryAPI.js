// API for posting new directories

export function postNewDirectory(newDirectory) {
    const req = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newDirectory)
    }
    return fetch(`http://localhost:4000/api/directory/create/newDirectory`, req).then((res) =>
        res.json(),
    )
};
