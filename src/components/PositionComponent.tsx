import React, { useState, useEffect } from "react";
import { AgGridColumn, AgGridReact } from "ag-grid-react";
import PositionService, { IPositionServiceData } from "../services/PositionService";
import { ColumnApi, GridApi, GridReadyEvent } from "ag-grid-community";

import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-balham-dark.css";
import positionService from "../services/PositionService";

export function PositionComponent() {
  const [rowData, setRowData] = useState<IPositionServiceData[]>();

  const [gridApi, setGridApi] = useState<GridApi>();
  const [gridColumnApi, setGridColumnApi] = useState<ColumnApi>();

  useEffect(() => {
    setRowData(positionService.data);
    if (gridApi) {
      const addRowTransaction = (data: IPositionServiceData) => {
        gridApi?.applyTransaction({ add: [data] });
      };
      positionService.ItemAdded(addRowTransaction);
    }
  }, [gridApi]);

  const onGridReady = (params: GridReadyEvent) => {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);
  };

  return (
    <div>
      <div
        className="ag-theme-balham-dark"
        style={{ width: "auto", height: 300 }}
      >
        <AgGridReact rowData={rowData} onGridReady={onGridReady}>
          <AgGridColumn field="participant"></AgGridColumn>
          <AgGridColumn
            field="qty"
            sortable={true}
            filter={true}
          ></AgGridColumn>
          <AgGridColumn field="price"></AgGridColumn>
        </AgGridReact>
      </div>
    </div>
  );
}
