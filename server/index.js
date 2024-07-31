const express = require('express');
const cors = require('cors');
const mySQLConnection = require('./modules/mysqlConnection')
const port = 4000;

const app = express();

app.use(cors())

app.use(express.json())

app.get('/api/sheet/get/:sheetID', (req, res, next) => {
    const { sheetID } = req.params;
    const query = `SELECT s.sheetID, s.directoryID, s.sheetLabel, s.sheetURL, cs.colSheetID, cs.columnID, c.columnLabel, c.datatype, r.rowID, r.rowNumber, rp.value, rp.responseID  
    FROM spreadsheet.sheet AS s 
    LEFT JOIN spreadsheet.colSheetRel AS cs ON cs.sheetID = s.sheetID 
    LEFT JOIN spreadsheet.column AS c ON c.columnID = cs.columnID 
    LEFT JOIN spreadsheet.row AS r ON r.sheetID = s.sheetID 
    LEFT JOIN spreadsheet.response AS rp ON rp.colSheetID = cs.colSheetID AND rp.rowID = r.rowID 
    WHERE s.sheetID = ?`
    const params = [parseInt(sheetID)]
    mySQLConnection.query(query, params, (err, results) => {
        if (err) {
            console.log(err)
            res.status(500).json({ message: 'Bad connection' })
            return
        }
        // console.log(results)
        res.status(200).json(results)
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
    console.log('new sheet')
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
    console.log('parentID', parentID)
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

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
