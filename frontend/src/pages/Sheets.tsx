import React, { useState, useEffect } from 'react';
import { getAllSheetsData, getSheetData } from '../services/apiService';
import type { AllSheetsData, SheetData } from '../types';
import './Sheets.css';

const Sheets: React.FC = () => {
  const [allSheets, setAllSheets] = useState<AllSheetsData | null>(null);
  const [selectedSheet, setSelectedSheet] = useState<string | null>(null);
  const [sheetData, setSheetData] = useState<SheetData | null>(null);
  const [loading, setLoading] = useState(true);
  const [sheetLoading, setSheetLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllSheets = async () => {
      try {
        setLoading(true);
        const response = await getAllSheetsData();
        // Add a check to ensure we have valid data
        if (response && response.data) {
          setAllSheets(response.data);
        } else {
          setError('No sheets data received from API');
        }
        setError(null);
      } catch (err: any) {
        setError('Failed to fetch sheets data');
        console.error('Sheets fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllSheets();
  }, []);

  const handleSheetSelect = async (sheetName: string) => {
    if (selectedSheet === sheetName) {
      setSelectedSheet(null);
      setSheetData(null);
      return;
    }

    try {
      setSheetLoading(true);
      setSelectedSheet(sheetName);
      const response = await getSheetData(sheetName);
      // Add a check to ensure we have valid data
      if (response && response.data) {
        setSheetData(response.data);
      } else {
        setError(`No data received for sheet: ${sheetName}`);
      }
    } catch (err: any) {
      setError(`Failed to fetch data for sheet: ${sheetName}`);
      console.error('Sheet data fetch error:', err);
    } finally {
      setSheetLoading(false);
    }
  };

  const renderTable = (data: SheetData) => {
    if (!data || !data.values || data.values.length === 0) {
      return <div className="no-data">No data available in this sheet</div>;
    }

    return (
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              {data.values[0].map((header, index) => (
                <th key={index}>{header || ''}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.values.slice(1).map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex}>{cell || ''}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="sheets-page">
      <h2>Sheets</h2>
      
      {loading && <div className="loading">Loading sheets...</div>}
      
      {error && <div className="error-message">{error}</div>}
      
      {allSheets && !loading && (
        <div className="sheets-content">
          <div className="sheets-list">
            <h3>Available Sheets</h3>
            {Object.keys(allSheets).length > 0 ? (
              <ul>
                {Object.keys(allSheets).map((sheetName) => (
                  <li 
                    key={sheetName} 
                    className={`sheet-item ${selectedSheet === sheetName ? 'active' : ''}`}
                    onClick={() => handleSheetSelect(sheetName)}
                  >
                    {sheetName}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No sheets available</p>
            )}
          </div>
          
          <div className="sheet-data">
            {sheetLoading && <div className="loading">Loading sheet data...</div>}
            
            {sheetData && !sheetLoading && (
              <div className="sheet-data-content">
                <h3>{selectedSheet} Data</h3>
                {renderTable(sheetData)}
              </div>
            )}
            
            {!sheetData && !sheetLoading && selectedSheet && (
              <div className="no-selection">
                <p>Select a sheet to view its data</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Sheets;