import React, { useEffect, useReducer, useState } from "react";
import "./style.css";
import makeData from "./makeData";
import Table from "./Table";
import { grey } from "./colors";
import Navbar from './NavBar';
import { reducer } from './reducer'; 



function App() {
  const [data, setData] = useState([]);
  const [state, dispatch] = useReducer(reducer, makeData(10));
  const [filterSheet, setFilterSheet] = useState('')
  const [newUrl, setNewUrl] = useState('');

useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/combined');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result = await response.json();
        console.log(result);
      } catch (error) {
        console.error('Error fetching data:', error);
      } 
    };

    fetchData();
  }, []);

  useEffect(() => {
    dispatch({ type: "enable_reset" });
  }, [state.data, state.columns]);

  // useEffect(() => {
  //   fetch(`/columns/${newUrl}`)
  //     .then(response => response.json())
  //     .then(data => dispatch({ type: "enable_reset" }));
  // }, [state.data, state.columns]);

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        overflowX: "hidden",
        display: "flex",

      }}
    >
      <Navbar filterSheet={filterSheet} setFilterSheet={setFilterSheet} setNewUrl={setNewUrl}/>
      <div style={{ display: "flex", flexDirection: "column", paddingTop: "40px", paddingLeft: "60px"}}>
        <div
          style={{
            height: 120,
            display: "flex",
            alignItems: "start",
            justifyContent: "center",
            flexDirection: "column"
          }}
        >
          <h1 style={{ color: grey(800) }}>{filterSheet}</h1>
        </div>
        <div style={{ overflow: "auto", display: "flex" }}>
          <div
            style={{
              flex: "1 1 auto",
              padding: "1rem",
              maxWidth: 1000,
              marginLeft: "auto",
              marginRight: "auto"
            }}
          >
            <Table
              columns={state.columns}
              data={state.data}
              dispatch={dispatch}
              skipReset={state.skipReset}
            />
          </div>
        </div>
      </div>
      
      
    </div>
  );
}

export default App;
