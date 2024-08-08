// API for posting new row to sheet

export async function postNewRow(newRow) {
    const req = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newRow)
    }
    const response = await fetch(`http://localhost:4000/api/sheet/create/newRowToSheet`, req)
    if (!response.ok) {
        // console.log(response)
        if (response.status === 409) throw new Error('Name has to be unique.')
        throw new Error(response.statusText)
    }
    return response.json()
};
