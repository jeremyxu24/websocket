export async function deleteColumnFromSheet(payload) {
    const req = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sheetID: payload.sheetID })
    }

    const response = await fetch(`http://localhost:4000/api/sheet/delete/column/${payload.colSheetID}`, req)
    if (!response.ok) {
        if (response.status === 409) throw new Error('Name has to be unique.')
        throw new Error(response.statusText)
    }
    return Promise.resolve()
}