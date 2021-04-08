import React, { useState, useEffect } from "react";
import { AgGridColumn, AgGridReact } from "ag-grid-react";
import PositionService, { IPosition } from "../services/PositionService";
import { ColumnApi, GridApi, GridReadyEvent } from "ag-grid-community";

import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-balham-dark.css";

export function PositionComponent() {
  const [rowData, setRowData] = useState<IPosition[]>();

  const [gridApi, setGridApi] = useState<GridApi>();
  const [gridColumnApi, setGridColumnApi] = useState<ColumnApi>();
  const [columns, setColumns] = useState<{ field: string }[]>();

  const getCols = () => Object.keys(PositionService.Positions[0]).map(key => ({ field: key }));
  useEffect(() => {
    setRowData(PositionService.Positions);
    const columnsTemp = getCols();
    setColumns(columnsTemp);
    if (gridApi) {
      const addRowTransaction = (position: IPosition) => {
        gridApi?.applyTransaction({ add: [position] });
      };
      PositionService.onPositionUpdate(addRowTransaction);
    }
  }, [gridApi]);

  const onGridReady = (params: GridReadyEvent) => {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);
  };

  return (
    <div style={{ height: "100%" }}>
      <div
        className="ag-theme-balham-dark"
        style={{ width: "auto", height: "100%", minHeight: 300 }}
      >
        <AgGridReact rowData={rowData} onGridReady={onGridReady} suppressMenuHide={true}
          defaultColDef={{
            editable: true,
            sortable: true,
            flex: 1,
            minWidth: 70,
            filter: true,
            resizable: true,
            headerComponentParams: { menuIcon: 'fa-bars' },
          }}>
          {columns && columns.map(column => (
            <AgGridColumn {...column} key={column.field} />
          ))}
        </AgGridReact>
      </div>
    </div>
  );
}
