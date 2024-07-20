import { React, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import NavBar from './NavBar';
import TanstackTable from './TanstackTable.tsx'; // Import the TanstackTable component
import { createTheme, MantineProvider } from '@mantine/core';

const theme = createTheme({
  /** Put your mantine theme override here */
});

function App() {
  const [tableName, setTableName] = useState('Dummy Table Name');
  return (
    <MantineProvider theme={theme}>
      <div className="App" style={{ display: 'flex' }}>
        <div style={{ width: '350px', height: '100%'}}>
          <NavBar />
          
        </div>
        <div style={{ padding: '80px', flex: 1, marginTop: '100px' }}>
          <div>
            {tableName}
          </div>
          <TanstackTable />
        </div>

      </div>
    </MantineProvider>
  );
}

export default App;

