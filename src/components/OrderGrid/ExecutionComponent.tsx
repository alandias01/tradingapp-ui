import React, { useState, useEffect } from "react";
import { AgGridColumn, AgGridReact } from "ag-grid-react";
import orderService, { IExecutionOrder } from "../../services/OrderService";
import { ColumnApi, GridApi, GridReadyEvent, Column } from "ag-grid-community";

import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-balham-dark.css";

export function ExecutionComponent() {
  const [rowData, setRowData] = useState<IExecutionOrder[]>();

  const [gridApi, setGridApi] = useState<GridApi>();
  const [gridColumnApi, setGridColumnApi] = useState<ColumnApi>();
  const [columns, setColumns] = useState<{ field: string }[]>();

  const getCols = () => Object.keys(orderService.ExecutionOrders[0]).map(key => ({ field: key }));
  useEffect(() => {
    setRowData(orderService.ExecutionOrders);
    const columnsTemp = getCols();
    setColumns(columnsTemp);
    if (gridColumnApi) {
      adjustColumns();
    }
    /*
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
    */
  }, [gridColumnApi]);

  const adjustColumns = () => {
    if (gridColumnApi) {
      const allColumnIds: string[] = [];
      const allColumns = gridColumnApi.getAllColumns();
      if (allColumns) {
        allColumns.forEach((column: Column) => {
          allColumnIds.push(column.getColId());
        });

        gridColumnApi.autoSizeColumns(allColumnIds, false);
      }
      else {
        console.log("allColumns was null")
      }
    }
  }

  const onGridReady = (params: GridReadyEvent) => {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);
  };

  return (
    <div style={{ height: "100%" }}>
      <div
        className="ag-theme-balham-dark"
        style={{ width: "auto", height: "100%", minHeight: 400 }}
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
