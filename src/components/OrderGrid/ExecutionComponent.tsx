import React, { useState, useEffect } from "react";
import { AgGridColumn, AgGridReact } from "ag-grid-react";
import orderService, { IExecutionOrder } from "../../services/OrderService";
import { useGridEventContext } from '../../Context/GridEventContext';
import { ColumnApi, GridApi, GridReadyEvent, Column } from "ag-grid-community";
import { Button, Typography } from '@material-ui/core';

import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-balham-dark.css";

export function ExecutionComponent() {
  const [rowData, setRowData] = useState<IExecutionOrder[]>();

  const [gridApi, setGridApi] = useState<GridApi>();
  const [gridColumnApi, setGridColumnApi] = useState<ColumnApi>();
  const [columns, setColumns] = useState<{ field: string }[]>();
  const { gridEvent } = useGridEventContext();

  const handleClick_ClearFilters = () => gridApi?.setFilterModel(null);

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

  useEffect(() => {
    if (gridApi && gridEvent.rowSelectedChild) {
      const filterInstance = gridApi.getFilterInstance("childId");
      if (filterInstance) {
        filterInstance.setModel({ type: "equals", filter: gridEvent.rowSelectedChild[0].childId, filterType: "text" });
        gridApi.onFilterChanged();
      }
    }

  }, [gridEvent])

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
        <Typography variant="h6" display="inline" > Executions</Typography>
        <Button style={{ margin: "0px 25px" }} onClick={handleClick_ClearFilters} size="small" variant="text">RESET FILTERS</Button>
        <AgGridReact
          rowSelection='single'
          rowData={rowData}
          onGridReady={onGridReady}
          suppressMenuHide={true}
          getRowNodeId={(x) => x.execId}
          defaultColDef={{
            editable: true,
            sortable: true,
            flex: 1,
            minWidth: 100,
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
