import React, { useState } from "react";
import { AgGridColumn, AgGridReact } from "ag-grid-react";
import { Level2Data } from "../services/ServiceApi";

import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-balham-dark.css";

export const PositionComponent = () => {
  const data = Level2Data("AAPL");

  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);

  const [rowData, setRowData] = useState([
    { make: "Toyota", model: "Celica", price: 35000 },
    { make: "Ford", model: "Mondeo", price: 32000 },
    { make: "Porsche", model: "Boxter", price: 72000 }
  ]);

  return (
    <div className="ag-theme-balham-dark" style={{ width: "100%", height: 600 }}>
      <AgGridReact rowData={data}>
        <AgGridColumn field="participant"></AgGridColumn>
        <AgGridColumn field="qty" sortable={true} filter={true}></AgGridColumn>
        <AgGridColumn field="price"></AgGridColumn>
      </AgGridReact>
    </div>
  );
};
