import SheetSideBar from './component/sheetSideBar'
import DataTable from './component/dataTable'
import "./styles/style.css";
import { useDirectoryNavStore, useDirectoryTypeStore } from "./lib/store";
import LocationNav from "./component/locationNav";
import SubFolderContainer from "./component/subFolderContainer";
import useFetchDirectory from "./hooks/useFetchDirectory";

function App() {
  const directoryType = useDirectoryTypeStore((state) => state.type)
  const parentID = useDirectoryNavStore((state) => state.parentID)

  const { isPending, error, data: subDirectories } = useFetchDirectory();

  if (isPending) return 'Loading...'

  if (error) return 'An error has occurred: ' + error.message

  return (
    <div className="app-container">
      <div className="app-sidebar-container">
        <SheetSideBar />
      </div>
      <div className="app-data-table-container">
        <LocationNav />
        {
          directoryType === 'directory' ?
            <SubFolderContainer subDirectories={subDirectories} />
            :
            <></> // datatable here
        }
        {/* <DataTable /> */}
      </div>
    </div>
  )
}

export default App