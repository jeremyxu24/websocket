import express from 'express';
import bodyParser from 'body-parser';
import { Sequelize, DataTypes } from 'sequelize';
import cors from 'cors';

const sequelize = new Sequelize('mysql://root:Str0ngP@ssw0rd!@localhost:3306/spreadsheet_db');

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());




// const getFormattedData = (query) => {
//   return sequelize.query(query, { type: sequelize.QueryTypes.SELECT })
//   .then(results => {
//     const result = results.reduce((acc, curr) => {
//       const { rowId, accessor, response } = curr;
//       if (!acc[rowId]) {
//         acc[rowId] = { rowId };
//       }
//         acc[rowId][accessor] = response;
//         return acc;
//       }, {});
      
//       const formattedData = Object.values(result);
//       return formattedData;
//     })
//     .catch(error => {
//       console.error('Error executing query:', error);
//       throw error; // Re-throw the error to handle it in the API endpoint
//     });
//   };
  
  
  
//   let columns;
  
//   const getColumns = (query) => {
//     return sequelize.query(query, { type: sequelize.QueryTypes.SELECT })
//     .then(results => {
//       columns = results;
//       console.log(results);
//       const accessorArray = results.map(item => item.accessor); 
//       return results;
      
      
//     })
//     .catch(error => {
//       console.error('Error executing query:', error);
//     });
    
//   }
  
 
  
  
//   app.get('/combined', (req, res) => {
//     const dataQuery = `
//     SELECT c.accessor, r.response, r.rowId
//     FROM SheetsColumns sc
//     LEFT JOIN Columns c ON c.id = sc.columnId
//     LEFT JOIN Sheets s ON s.id = sc.sheetId
//     LEFT JOIN Responses r ON r.sheetColumnId = sc.id
//     WHERE s.id = 1
//     ORDER BY rowId;
//     `;
    
//     const columnsQuery = `
//     SELECT c.* FROM Columns c 
//     LEFT JOIN SheetsColumns sc ON sc.columnId = c.id
//     LEFT JOIN Sheets s ON s.id = sc.sheetId
//     WHERE s.id = 1;
//     `;
    
//     Promise.all([getFormattedData(dataQuery), getColumns(columnsQuery)])
//     .then(results => {
//       const [data, columns] = results;
//       res.json({ data: data, columns: columns, skipReset: false});
//     })
//     .catch(error => {
//       res.status(500).send('Error fetching data');
//     });
//   });
  
  
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
  