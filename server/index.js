const express = require('express');
const cors = require('cors');
const mySQLConnection = require('./modules/mysqlConnection')
const port = 4000;

const app = express();

app.use(cors())

app.use(express.json())

app.get('/api/sheet/get/:sheetID', (req, res, next) => {
    const { sheetID } = req.params;
    const query = `SELECT s.sheetID, s.directoryID, s.sheetLabel, s.sheetURL, cs.colSheetID, cs.columnID, c.columnLabel, c.datatype, cs.positionIndex, r.rowID, r.rowNumber, rp.value, rp.responseID
    FROM spreadsheet.sheet AS s 
    LEFT JOIN spreadsheet.colSheetRel AS cs ON cs.sheetID = s.sheetID 
    LEFT JOIN spreadsheet.column AS c ON c.columnID = cs.columnID 
    LEFT JOIN spreadsheet.row AS r ON r.sheetID = s.sheetID 
    LEFT JOIN spreadsheet.response AS rp ON rp.colSheetID = cs.colSheetID AND rp.rowID = r.rowID 
    WHERE s.sheetID = ?
    ORDER BY cs.positionIndex ASC, rowID ASC`
    const params = [parseInt(sheetID)]
    mySQLConnection.query(query, params, (err, results) => {
        if (err) {
            console.log(err)
            res.status(500).json({ message: 'Bad connection' })
            return
        }
        const rowIDs = results.map((row) => row.rowID)
        const uniqueRowIDs = [... new Set(rowIDs)]
        // extract column data
        // Function to extract key-value pairs from specified columns
        function extractUniqueKeyValuePairs(data, columns) {
            const result = data.map(row => {
                const obj = {};
                columns.forEach(col => obj[col] = row[col]);
                return obj;
            });
            // Remove duplicates
            const uniqueResult = Array.from(new Set(result.map(JSON.stringify))).map(JSON.parse);
            return uniqueResult;
        }
        // Specify the columns to extract
        const columnsToExtract = ['columnID', 'columnLabel', 'datatype', 'colSheetID', 'positionIndex'];
        const columnData = extractUniqueKeyValuePairs(results, columnsToExtract);

        // extract response data
        // reformat for responses by row
        let responseData = [];
        for (let i = 0; i < uniqueRowIDs.length; i++) {
            responseData.push({ rowID: uniqueRowIDs[i], responseData: [] })
        }
        for (let j = 0; j < responseData.length; j++) {
            results.forEach((row) => {
                if (row.rowID === responseData[j].rowID) {
                    responseData[j].responseData.push({ columnID: row.columnID, columnLabel: row.columnLabel, rowNumber: row.rowNumber, value: row.value, responseID: row.responseID })
                }
            })
        }
        const formattedResData = { sheetID: results[0].sheetID, sheetLabel: results[0].sheetLabel, sheetURL: results[0].sheetURL, columnData: columnData, responses: responseData }
        res.status(200).json(formattedResData)
    })
})

app.get('/api/column/get/', (req, res, next) => {
    const query = `
        select *
        from spreadsheet.column`
    const params = [];
    mySQLConnection.query(query, params, (err, results) => {
        if (err) {
            console.log(err)
            res.status(500).json({ message: 'Bad connection' })
        }
        // console.log(results)
        res.status(200).json(results)
    })
})

app.post('/api/column/create/newColumn', (req, res, next) => {
    const { columnLabel, datatype } = req.body;
    const query = `INSERT INTO spreadsheet.column (columnLabel, datatype)
	VALUES (?, ?)`;
    const params = [columnLabel, datatype];
    mySQLConnection.query(query, params, (err, results) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') return res.status(409).json({ message: err.sqlMessage })
            console.log(err)
            res.status(500).json({ message: 'Bad connection' })
        }
        // console.log(results)
        res.status(201).json(results)
    })
})

app.post('/api/directory/create/newDirectory', (req, res, next) => {
    const { directoryLabel, directoryURL, directoryType, parentID } = req.body;
    const query = `INSERT INTO spreadsheet.directory (directoryLabel, directoryURL, directoryType, parentID)
	VALUES (?, ?, ?, ?)`;
    const params = [directoryLabel, directoryURL, directoryType, parentID];
    mySQLConnection.query(query, params, (err, results) => {
        if (err) {
            console.log(err)
            res.status(500).json({ message: 'Bad connection' })
        }
        // console.log(results)
        res.status(200).json(results)
    })
    // res.status(200).json({ message: 'works' })
})

app.post('/api/directory/create/newSheet', (req, res, next) => {
    const { directoryID, sheetLabel, sheetURL } = req.body;
    const query = `INSERT INTO spreadsheet.sheet (sheetLabel, sheetURL, directoryID)
	VALUES (?, ?, ?)`;
    const params = [sheetLabel, sheetURL, directoryID];
    mySQLConnection.query(query, params, (err, results) => {
        if (err) {
            console.log(err)
            res.status(500).json({ message: 'Bad connection' })
        }
        // console.log(results)
        res.status(200).json(results)
    })
})

app.get('/api/directory/get/:parentID', (req, res, next) => {
    const { parentID } = req.params;
    const query = `
        select d.directoryID, d.directoryLabel, d.directoryURL, d.directoryType, d.parentID, s.sheetID, s.sheetLabel, s.sheetURL
        from spreadsheet.directory as d
        left join spreadsheet.sheet as s on d.directoryID = s.directoryID
        where d.parentID = ? OR
        s.directoryID = ?`
    const params = [parentID, parentID];
    mySQLConnection.query(query, params, (err, results) => {
        if (err) {
            console.log(err)
            res.status(500).json({ message: 'Bad connection' })
        }
        // console.log(results)
        res.status(200).json(results)
    })
    // mySQLConnection.end()
})

app.post('/api/sheet/create/newColumnToSheet', (req, res, next) => {
    const { sheetID, selectedColumnID, selectedIndex } = req.body;
    // check if column exist in this sheet to prevent duplicate
    const checkingQuery = `SELECT colSheetID FROM spreadsheet.colSheetRel 
    WHERE sheetID = ?
    AND columnID = ?`;
    const checkingParams = [sheetID, selectedColumnID];
    mySQLConnection.query(checkingQuery, checkingParams, (err, results) => {
        if (err) {
            console.log(err)
            return res.status(500).json({ message: 'Bad connection' })
        }
        if (results.length > 0) {
            return res.status(409).json({ message: 'Duplicate column found in record' })
        }
        // shift all existing columns after given positionIndex by 1 to make space for new column 
        const query = `
        UPDATE spreadsheet.colSheetRel
            SET positionIndex = positionIndex + 1
            WHERE sheetID = ?
            AND positionIndex >= ?;
        INSERT INTO spreadsheet.colSheetRel (sheetID, columnID, positionIndex)
            VALUES (?, ?, ?);`;
        const params = [sheetID, selectedIndex, sheetID, selectedColumnID, selectedIndex];
        mySQLConnection.query(query, params, (err, results) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') return res.status(409).json({ message: err.sqlMessage })
                console.log(err)
                res.status(500).json({ message: 'Bad connection' })
            }
            res.status(201).json(results)
        })
    })
})

app.post('/api/sheet/create/newRowToSheet', (req, res, next) => {
    const { sheetID, rowNumber } = req.body;
    // check if column exist in this sheet to prevent duplicate
    const checkingQuery = `SELECT rowID FROM spreadsheet.row 
    WHERE sheetID = ?
    AND rowNumber = ?`;
    const checkingParams = [sheetID, rowNumber];
    mySQLConnection.query(checkingQuery, checkingParams, (err, results) => {
        if (err) {
            console.log(err)
            return res.status(500).json({ message: 'Bad connection' })
        }
        if (results.length > 0) {
            return res.status(409).json({ message: 'Duplicate column found in record' })
        }
        // shift all existing columns after given positionIndex by 1 to make space for new column 
        const query = `
        INSERT INTO spreadsheet.row (sheetID, rowNumber)
            VALUES (?, ?);`;
        const params = [sheetID, rowNumber];
        mySQLConnection.query(query, params, (err, results) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') return res.status(409).json({ message: err.sqlMessage })
                console.log(err)
                res.status(500).json({ message: 'Bad connection' })
            }
            res.status(201).json(results)
        })
    })
})

app.post('/api/sheet/create/newResponseToSheet', (req, res, next) => {
    const { value, responseID, rowID, colSheetID } = req.body;
    let query;
    let params;
    let successMessage;
    let statusCode;
    if (!responseID) {
        const checkingQuery = `SELECT responseID FROM spreadsheet.response
        WHERE rowID = ?
        AND colSheetID = ?`
        const checkingParams = [rowID, colSheetID]
        mySQLConnection.query(checkingQuery, checkingParams, (err, results) => {
            if (err) {
                console.log(err)
                return res.status(500).json({ message: 'Bad connection' })
            }
            if (results.length > 0) {
                query = `UPDATE spreadsheet.response
                SET value = ?
                WHERE responseID = ?`
                params = [value, responseID]
                successMessage = 'Successfully update response'
                statusCode = 204
            } else {
                query = `INSERT INTO spreadsheet.response (rowID, value, colSheetID)
                VALUES (?, ?, ?)`
                params = [rowID, value, colSheetID]
                successMessage = 'Successfully insert new response'
                statusCode = 201
            }
            mySQLConnection.query(query, params, (err, results) => {
                if (err) {
                    console.log(err)
                    return res.status(500).json({ message: 'Bad connection' })
                }
                res.status(statusCode).json({ message: successMessage })
            })
        })
    } else {
        query = `UPDATE spreadsheet.response
        SET value = ?
        WHERE responseID = ?`
        params = [value, responseID]
        successMessage = 'Successfully update response'
        statusCode = 204
    }
    mySQLConnection.query(query, params, (err, results) => {
        if (err) {
            console.log(err)
            return res.status(500).json({ message: 'Bad connection' })
        }
        res.status(statusCode).json({ message: successMessage })
    })
})

app.patch('/api/sheet/patch/newColPosToSheet', (req, res, next) => {
    const newColPos = req.body;
    let query = '';
    const params = [];
    newColPos.forEach((position) => {
        query += 'UPDATE spreadsheet.colSheetRel SET positionIndex = ? WHERE colSheetID = ?; '
        params.push(position.positionIndex, position.colSheetID)
    })
    console.log('params', params)
    mySQLConnection.query(query, params, (err, results) => {
        if (err) {
            console.log(err)
            return res.status(500).json({ message: 'Bad connection' })
        }
        res.status(200).json({ message: 'Recieved' })
    })
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});