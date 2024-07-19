import React from 'react';
import logo from './logo.svg';
import './App.css';
import NavBar from './NavBar';
import TanstackTable from './TanstackTable.tsx'; // Import the TanstackTable component
import { createTheme, MantineProvider } from '@mantine/core';
import Demo from './Demo';

const theme = createTheme({
  /** Put your mantine theme override here */
});

function App() {
  return (
    <MantineProvider theme={theme}>
      <div className="App">
        <div style={{ width: '200px' }}>
          <NavBar />
          <Demo />
        </div>
        <div style={{ padding: '20px' }}>
          <TanstackTable /> {/* Include the TanstackTable component */}
        </div>
      </div>
    </MantineProvider>
  );
}

export default App;

