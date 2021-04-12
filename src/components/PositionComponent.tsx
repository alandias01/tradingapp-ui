import React, { useState, useEffect } from "react";
import { AgGridColumn, AgGridReact } from "ag-grid-react";
import PositionService, { IPosition, PositionUpdateType, Side, OrdType, Tif } from "../services/PositionService";
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
      const addRowTransaction = (position: IPosition, updateType: PositionUpdateType) => {
        switch (updateType) {
          case PositionUpdateType.UPDATE:
            gridApi?.applyTransaction({ update: [position] });
            break;
          case PositionUpdateType.ADD:
            gridApi?.applyTransaction({ add: [position] });
            break;
          case PositionUpdateType.REMOVE:
            gridApi?.applyTransaction({ remove: [position] });
            break;
          default:
            break;
        }
      };

      PositionService.onPositionUpdate(addRowTransaction);
    }

    //AddOrdersSimulator();

  }, [gridApi]);

  const AddOrdersSimulator = () => setInterval(() => PositionService.NewOrder({
    side: Side.BUY,
    symbol: "AAPL",
    quantity: 100,
    price: 30,
    ordType: OrdType.MARKET,
    tif: Tif.DAY,
  }), 3000);

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
        <AgGridReact
          rowData={rowData}
          onGridReady={onGridReady}
          suppressMenuHide={true}
          getRowNodeId={(pos) => pos.positionId}
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
