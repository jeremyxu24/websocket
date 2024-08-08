// API for fetching sheet data (col/sheet relationship, rowid, response)

export async function getSheetData(sheetID) {
    if (!sheetID) {
        throw new Error('No sheetID found')
    }
    const req = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    }
    const response = await fetch(`http://localhost:4000/api/sheet/get/${sheetID}`, req)
    if (!response.ok) {
        // console.log(response)
        throw new Error(response.statusText)
    }
    return response.json()
};
