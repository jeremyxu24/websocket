const express = require('express');
const bodyParser = require('body-parser');
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('mysql://root:Str0ngP@ssw0rd!@localhost:3306/spreadsheet_db');

// Define your Sequelize models
const Responses = require('./models/Responses')(sequelize, Sequelize);
const SheetsColumns = require('./models/SheetsColumns')(sequelize, Sequelize);
const Columns = require('./models/Columns')(sequelize, Sequelize);
const Sheets = require('./models/Sheets')(sequelize, Sequelize);

const app = express();
const port = 5000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// select response, s.name, rowId, c.columnName 
// from SheetsColumns sc 
// inner join Sheets s ON s.id = sc.sheetId 
// inner join Columns c ON c.id = sc.columnId 
// inner join Responses r ON r.sheetColumnId = sc.id;

// Define associations between models if not already defined in the models
// Responses.belongsTo(SheetsColumns, { foreignKey: 'sheetColumnId'})
SheetsColumns.belongsTo(Sheets, { foreignKey: 'sheetId' });
SheetsColumns.belongsTo(Columns, { foreignKey: 'columnId' });
//  // Assuming 'sheetColumnId' is the foreign key in Response
// Responses.findAll({
//   include: [
//     {
//       model: SheetsColumns,
//       attributes: [], // Do not select any columns from SheetsColumns itself
//       include: [
//         {
//           model: Sheets,
//           attributes: ['name'], // Select name from Sheets
//           required: true // Ensure Sheets association is required for the join if you expect every response to have a sheet
//         },
//         {
//           model: Columns,
//           attributes: ['columnName'],
//           required: false // Select columnName from Columns
//         }
//       ]
//     }
//   ],
//   attributes: ['response', 'rowId'] // Select Sheets.name as sheetName
// }).then(responses => {
//   const formattedResponses = responses.map(response => ({
//     response: response.response,
//     rowId: response.rowId,
//     columnName: response,
//     sheetName: response.sheetName // Access Sheets.name through alias sheetName
//   }));

//   console.log(formattedResponses);
// }).catch(error => {
//   console.error('Query Error:', error);
// });





const getFormattedData = (query) => {
  return sequelize.query(query, { type: sequelize.QueryTypes.SELECT })
    .then(results => {
      const result = results.reduce((acc, curr) => {
        const { rowId, accessor, response } = curr;
        if (!acc[rowId]) {
          acc[rowId] = { rowId };
        }
        acc[rowId][accessor] = response;
        return acc;
      }, {});

      const formattedData = Object.values(result);
      return formattedData;
    })
    .catch(error => {
      console.error('Error executing query:', error);
      throw error; // Re-throw the error to handle it in the API endpoint
    });
};

  

let columns;

const getColumns = (query) => {
  return sequelize.query(query, { type: sequelize.QueryTypes.SELECT })
  .then(results => {
    columns = results;
    console.log(results);
    const accessorArray = results.map(item => item.accessor); 
    return results;
    
    
  })
  .catch(error => {
    console.error('Error executing query:', error);
  });
  
}

 
app.get('/data', (req, res) => {
  const query = `
  SELECT c.accessor, r.response, r.rowId
  FROM SheetsColumns sc
  LEFT JOIN Columns c ON c.id = sc.columnId
  LEFT JOIN Sheets s ON s.id = sc.sheetId
  LEFT JOIN Responses r ON r.sheetColumnId = sc.id
  WHERE s.id = 1
  ORDER BY rowId;
  `;

  getFormattedData(query)
    .then(data => {
      res.json(data);
    })
    .catch(error => {
      res.status(500).send('Error fetching data');
    });
});

app.get('/col', (req, res) => {
  const query = `
  SELECT c.* FROM Columns c 
  LEFT JOIN SheetsColumns sc ON sc.columnId = c.id
  LEFT JOIN Sheets s ON s.id = sc.sheetId
  WHERE s.id = 1;
`;
  getColumns(query)
    .then(data => {
      res.json(data);
    })
    .catch(error => {
      res.status(500).send('Error fetching data');
    });
})
// const data = {sheet: "hubspot_fields", columns: columns, data: rows, skipReset: false};


// app.get('/users/:sheet', (req, res) => {
//   const { sheet } = req.params;

//   res.json(data);
// });

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
  
  
  
