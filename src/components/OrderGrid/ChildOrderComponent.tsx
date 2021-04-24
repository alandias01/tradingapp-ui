import React, { useState, useEffect } from "react";
import { AgGridColumn, AgGridReact } from "ag-grid-react";
import orderService, { IChildOrder, dummyChildOrder, IOrderUpdateEvent, IExecutionOrder } from "../../services/OrderService";
import { useGridEventContext } from '../../Context/GridEventContext';
import { ColumnApi, GridApi, GridReadyEvent, Column } from "ag-grid-community";
import { Button, Typography } from '@material-ui/core';

import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-balham-dark.css";

export function ChildOrderComponent() {
  const [rowData, setRowData] = useState<IChildOrder[]>();

  const [gridApi, setGridApi] = useState<GridApi>();
  const [gridColumnApi, setGridColumnApi] = useState<ColumnApi>();
  const [columns, setColumns] = useState<{ field: string }[]>();
  const { gridEvent, setGridEvent } = useGridEventContext();

  const handleClick_ClearFilters = () => gridApi?.setFilterModel(null);

  const getCols = () => Object.keys(dummyChildOrder).map(key => ({ field: key }));

  const onGridReady = (params: GridReadyEvent) => {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);
  };

  useEffect(() => {
    setRowData(orderService.ChildOrders);
    const columnsTemp = getCols();
    setColumns(columnsTemp);
    if (gridColumnApi) {
      const adjustColumns = () => {
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
      adjustColumns();
      gridColumnApi.setColumnsVisible(["parentCumQty", "parentLeavesQty"], false);
    }
  }, [gridColumnApi]);

  useEffect(() => {
    if (gridApi) {
      const childAdd = (orderEvent: IOrderUpdateEvent) => {
        const order = orderEvent.payload as IChildOrder;
        gridApi?.applyTransaction({ add: [order] });
      };

      const childUpdate = (orderEvent: IOrderUpdateEvent) => {
        const order = orderEvent.payload as IChildOrder;
        const rowNode = gridApi?.getRowNode(order.childId);
        if (!rowNode) return;

        const data: IChildOrder = rowNode.data;
        data.ordStatus = order.ordStatus;
        data.filledQty = order.filledQty;
        data.unfilledQty = order.unfilledQty;
        data.avgPrice = order.avgPrice;
        //data.parentCumQty = order.parentCumQty;
        //data.parentLeavesQty = order.parentLeavesQty;

        gridApi?.applyTransaction({ update: [data] });
      };

      orderService.ChildAdd.subscribe({ next: childAdd });
      orderService.ChildUpdate.subscribe({ next: childUpdate });
    }

  }, [gridApi])

  useEffect(() => {
    if (gridApi && gridEvent.rowSelectedParent) {
      const filterInstanceParent = gridApi.getFilterInstance("parentId");
      if (filterInstanceParent) {
        filterInstanceParent.setModel({ type: "equals", filter: gridEvent.rowSelectedParent[0].parentId, filterType: "text" });
        gridApi.onFilterChanged();
      }
    }

  }, [gridApi, gridEvent])

  const onSelectionChanged = () => {
    const selectedRows = gridApi?.getSelectedRows();
    setGridEvent({ rowSelectedChild: selectedRows })
  }

  return (
    <div style={{ height: "100%" }}>
      <div
        className="ag-theme-balham-dark"
        style={{ width: "auto", height: "100%", minHeight: 200 }}
      >
        <Typography variant="h6" display="inline" > Child Orders</Typography>
        <Button style={{ margin: "0px 25px" }} onClick={handleClick_ClearFilters} size="small" variant="text">RESET FILTERS</Button>

        <AgGridReact
          onSelectionChanged={onSelectionChanged}
          rowSelection='single'
          rowData={rowData}
          onGridReady={onGridReady}
          suppressMenuHide={true}
          getRowNodeId={(x) => x.childId}
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
