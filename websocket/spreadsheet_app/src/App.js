import React from 'react';
import logo from './logo.svg';
import './App.css';
import NavBar from './NavBar.ts';
import TanstackTable from './TanstackTable.tsx'; // Import the TanstackTable component
import { createTheme, MantineProvider } from '@mantine/core';

const theme = createTheme({
  /** Put your mantine theme override here */
});

function App() {
  return (
    <MantineProvider theme={theme}>
      <div className="App">
        <div style={{ width: '200px' }}>
          <NavBar />
        </div>
        <div style={{ padding: '20px' }}>
          <TanstackTable /> {/* Include the TanstackTable component */}
        </div>
      </div>
    </MantineProvider>
  );
}

export default App;
