export async function deleteColumnFromSheet(colSheetID) {
    const req = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    }

    const response = await fetch(`http://localhost:4000/api/sheet/delete/column/${colSheetID}`, req)
    if (!response.ok) {
        if (response.status === 409) throw new Error('Name has to be unique.')
        throw new Error(response.statusText)
    }
    return Promise.resolve()
}