import SheetSideBar from './component/sheetSideBar'
import DataTable from './component/dataTable'
import "./styles/style.css";
import DirectoryNav from './component/locationNav';
import SubFolderContainer from "./component/subFolderContainer";
import useFetchColumn from './hooks/useFetchColumn';
import useFetchDirectory from './hooks/useFetchDirectory';
import { useLocation, useNavigate } from 'react-router-dom';
import useFetchNavLocation from './hooks/useFetchNavLocation';

import TestingComponent from './component/testingComponent';
import { useEffect } from 'react';

function App() {
  let location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const path = params.get('path');
  const type = params.get('type');

  useEffect(() => {
    if (!path || !type) {
      params.set('path', '1')
      params.set('type', 'directory')
      navigate({ search: params.toString() });
    }
  }, [params])

  function handleNavigation(type, newPath) {
    const params = new URLSearchParams();
    params.set('path', newPath);
    params.set('type', type);
    navigate({ search: params.toString() });
  }

  const { isPending: columnPending, error: columnError, data: columns } = useFetchColumn();
  const { isPending: directoryPending, error: directoryError, data: subDirectories } = useFetchDirectory(path, type);
  const { isPending: navPending, error: navError, data: navLoc } = useFetchNavLocation(path, type);

  return (
    <div className="app-container">
      <div className="app-sidebar-container">
        {columns &&
          <SheetSideBar columnData={columns} type={type} navLoc={navLoc} navPending={navPending} navError={navError} columnPending={columnPending} columnError={columnError} />
        }
      </div>
      <div className="app-data-table-container">
        <DirectoryNav onNavigate={handleNavigation} navLoc={navLoc} navPending={navPending} navError={navError} />

        {type === 'directory' && subDirectories &&
          <SubFolderContainer subDirectories={subDirectories} onNavigate={handleNavigation} directoryPending={directoryPending} directoryError={directoryError} />
        }


        {type === 'sheet' &&
          <DataTable columnData={columns} sheetID={path} />
          // <TestingComponent />
        }
      </div>
    </div>
  )
}

export default App