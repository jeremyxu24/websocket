import SheetSideBar from './component/sheetSideBar'
import DataTable from './component/dataTable'
import "./styles/style.css";
import { useDirectoryTypeStore } from "./lib/store";
import LocationNav from "./component/locationNav";
import SubFolderContainer from "./component/subFolderContainer";
import useFetchDirectory from "./hooks/useFetchDirectory";
import useFetchColumn from './hooks/useFetchColumn';

import TestingComponent from './component/testingComponent';

function App() {
  const directoryType = useDirectoryTypeStore((state) => state.type)
  const { isPending: columnPending, error: columnError, data: columns } = useFetchColumn();

  const { isPending: directoryPending, error: directoryError, data: subDirectories } = useFetchDirectory();

  if (directoryPending || columnPending) return 'Loading...'

  if (directoryError) return 'An error has occurred: ' + directoryError.message
  if (columnError) return 'An error has occurred: ' + columnError.message

  return (
    <div className="app-container">
      <div className="app-sidebar-container">
        <SheetSideBar columnData={columns} />
      </div>
      <div className="app-data-table-container">
        <LocationNav />
        {
          directoryType === 'directory' ?
            <SubFolderContainer subDirectories={subDirectories} />
            :
            <DataTable columnData={columns} /> // datatable here
          // <TestingComponent />
        }
      </div>
    </div>
  )
}

export default App