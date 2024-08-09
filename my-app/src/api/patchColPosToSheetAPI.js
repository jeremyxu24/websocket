// API for patching new columns positions

export async function patchColPosToSheet(patchColPos) {
    const req = {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(patchColPos)
    }
    const response = await fetch(`http://localhost:4000/api/sheet/patch/newColPosToSheet`, req)
    if (!response.ok) {
        // console.log(response)
        if (response.status === 409) throw new Error('Name has to be unique.')
        throw new Error(response.statusText)
    }
    return response.json()
};
