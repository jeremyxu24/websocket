import React, { useState } from 'react';
import './sidebar.css'; // Import the CSS file
import DocumentIcon from './img/Document';
import ColorThemeComponent from './ColorTheme';
import { flexRender } from '@tanstack/react-table';

function NavBar() {
  const [filterSheet, setFilterSheet] = useState([]);
  const [data, setData] = useState([
    { label: 'Hubspot Fields', url: 'hubspot_fields' },
    { label: 'Affiliate Report Summary', url: 'affiliate_report_summary' },
    { label: 'Data Dictionary', url: 'data_dictionary' },
    { label: 'Report #1', url: 'report_1' },
    { label: 'Report #2', url: 'report_2' },
    { label: 'Data Metrics', url: 'data_metrics' },
  ]);

  const [newLabel, setNewLabel] = useState('');
  const [selectedSheet, setSelectedSheet] = useState('');

  const handleAddLabel = () => {
    if (newLabel.trim() === '') {
      alert('Label cannot be empty!');
      return;
    }

    setData((prevData) => [
      ...prevData,
      { label: newLabel, url: newLabel },
    ]);

    // Clear input fields after adding
    setNewLabel('');
  };

  const handleSetFilterSheet = (label, url) => {
    setFilterSheet(label);
    setSelectedSheet(label);
  };

  return (
    <div className="sidebar-container">
      <div className="sidebar-content">
        <div className="sidebar-header">
          <div className="brand-name">AMERICOR</div>
        </div>
        <hr className="divider" />

        <nav className="sidebar-navigation">
          {data.map((link) => (
            <div 
              key={link.url}
              style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}
            >
              <DocumentIcon />
              <div
                className={`sidebar-link ${selectedSheet === link.label ? 'active' : ''}`}
                onClick={() => handleSetFilterSheet(link.label, link.url)}
              >
                {link.label}
              </div>
            </div>
          ))}
        </nav>

        <div className="sidebar-add">
          <input
            type="text"
            placeholder="New Sheet"
            value={newLabel}
            className="new-sheet-input"
            onChange={(e) => setNewLabel(e.target.value)}
          />
          <div className="add-sheet-button-container">
            <button className="add-sheet-button" onClick={handleAddLabel}>
              + New Sheet
            </button>
          </div>
        </div>
        
        <div style={{ marginTop: 'auto' }}>
          <ColorThemeComponent />
        </div>
      </div>
    </div>
  );
}

export default NavBar;
