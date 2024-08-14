// API for fetching navigation locations

export async function fetchNavLocation(ID, type) {
    const req = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    }
    let route;
    if (type === 'directory') route = `http://localhost:4000/api/navigation/get/directory/${ID}`
    else if (type === 'sheet') route = `http://localhost:4000/api/navigation/get/sheet/${ID}`
    else throw new Error('Cannot find the folder/file')
    const response = await fetch(route, req)
    if (!response.ok) {
        if (response.status === 409) throw new Error('Name has to be unique.')
        throw new Error(response.statusText)
    }
    return response.json()
};