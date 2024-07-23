import React, { useEffect, useReducer, useState } from "react";
import SheetSideBar from './component/sheetSideBar'
import DataTable from './component/dataTable'
import "./styles/style.css";
// import makeData from "./makeData";
import { grey } from "./utils/colors";
// import { reducer } from './utils/reducer';
import { useLocationStore, useSheetStore, useSubLocationStore } from "./lib/store";
import LocationNav from "./component/locationNav";
import SubFolderContainer from "./component/subFolderContainer";

function App() {
  // const [state, dispatch] = useReducer(reducer, makeData(10));
  const [filterSheet, setFilterSheet] = useState('')
  const [newUrl, setNewUrl] = useState('');
  const { setSheet } = useSheetStore();
  const { locations, setInitialLocation, locationType } = useLocationStore();
  const { subLocations, setInitialSubLocation } = useSubLocationStore();

  useEffect(() => {
    // const fetchData = async () => {
    //   try {
    //     const response = await fetch('http://localhost:5000/combined');
    //     if (!response.ok) {
    //       throw new Error('Network response was not ok');
    //     }
    //     const result = await response.json();
    //     console.log(result);
    //   } catch (error) {
    //     console.error('Error fetching data:', error);
    //   }
    // };

    const data = [
      { label: "Main", url: "main_folder", locationID: 1, parentID: null, type: 'folder' },
      { label: "Sub Main", url: "sub_main_folder", locationID: 8, parentID: 1, type: 'folder' },
      { label: 'Hubspot Fields', url: 'hubspot_fields', locationID: 2, parentID: 1, type: 'sheet' },
      { label: 'Affiliate Report Summary', url: 'affiliate_report_summary', locationID: 3, parentID: 1, type: 'sheet' },
      { label: 'Data Dictionary', url: 'data_dictionary', locationID: 4, parentID: 1, type: 'sheet' },
      { label: 'Report #1', url: 'report_1', locationID: 5, parentID: 1, type: 'sheet' },
      { label: 'Report #2', url: 'report_2', locationID: 6, parentID: 1, type: 'sheet' },
      { label: 'Data Metrics', url: 'data_metrics', locationID: 7, parentID: 1, type: 'sheet' },
    ];
    setSheet(data)
    setInitialLocation([data[0]])
    setInitialSubLocation(data.splice(1))

    // fetchData();
  }, []);

  useEffect(() => {
    console.log('setLocation changes catched at app.jsx level')
  }, [locations])

  // console.log(locations)

  // useEffect(() => {
  //   dispatch({ type: "enable_reset" });
  // }, [state.data, state.columns]);

  return (
    <div className="app-container">
      <div className="app-sidebar-container">
        <SheetSideBar filterSheet={filterSheet} setFilterSheet={setFilterSheet} setNewUrl={setNewUrl} />
      </div>
      <div className="app-data-table-container">
        <LocationNav />
        {
          locationType === 'folder' ?
            <SubFolderContainer />
            :
            <></> // datatable here
        }
        {/* <DataTable /> */}
      </div>
    </div>
  )
}

export default App
