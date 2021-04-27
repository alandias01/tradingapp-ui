import React, { useState, useEffect } from "react";
import { AgGridColumn, AgGridReact } from "ag-grid-react";
import orderService, { IParentOrder, IChildOrder, dummyParentOrder, IOrderUpdateEvent } from '../../services/OrderService';
import realtTimeMarketData from '../../services/RealTimeMarketData';
import { ISecurityMasterService, SecurityMasterService } from '../../services/SecurityMasterService';
import { useGridEventContext } from '../../Context/GridEventContext';
import { ColumnApi, GridApi, GridReadyEvent, Column } from "ag-grid-community";
import { Button, Typography } from '@material-ui/core';

import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-balham-dark.css";

export function ParentOrderComponent() {
  const [rowData, setRowData] = useState<IParentOrder[]>();

  const [gridApi, setGridApi] = useState<GridApi>();
  const [gridColumnApi, setGridColumnApi] = useState<ColumnApi>();
  const [columns, setColumns] = useState<{ field: string }[]>();
  const { setGridEvent } = useGridEventContext();

  const handleClick_ClearFilters = () => gridApi?.setFilterModel(null);

  const getCols = () => Object.keys(dummyParentOrder).map(key => {
    if (key === "marketPrice" || key === "position") {
      return ({
        field: key, valueFormatter: (params: any) => currencyFormatter(params)
      })
    }
    else {
      return ({ field: key })
    }
  }
  );

  useEffect(() => {
    if (gridApi) {
      const parentAdd = (orderEvent: IOrderUpdateEvent) => {
        const order = orderEvent.payload as IParentOrder;
        gridApi?.applyTransaction({ add: [order] });
      };

      const parentUpdate = (orderEvent: IOrderUpdateEvent) => {
        const order = orderEvent.payload as IParentOrder;
        const rowNode = gridApi?.getRowNode(order.parentId);
        if (!rowNode) return;

        const data: IParentOrder = rowNode.data;
        data.filledQty = order.filledQty;
        gridApi?.applyTransaction({ update: [data] });
      };

      orderService.ParentAdd.subscribe({ next: parentAdd });
      orderService.ParentUpdate.subscribe({ next: parentUpdate });
    }

  }, [gridApi])

  useEffect(() => {
    if (!gridApi)
      return;

    const realtTimeUpdate = (stock: ISecurityMasterService[]) => {
      if (!rowData?.length)
        return;

      gridApi.forEachNode(rowNode => {
        const order: IParentOrder = rowNode.data;
        const securityFound = stock.find(s => s.SYMBOL === order.symbol);
        if (securityFound) {
          order.marketPrice = securityFound.DefaultPrice;
          order.position = order.marketPrice * order.filledQty;
        }
      });

      gridApi.refreshCells();
    };

    realtTimeMarketData.stockPrices.subscribe(realtTimeUpdate)


  }, [gridApi, rowData])

  useEffect(() => {
    setRowData(orderService.ParentOrders);
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
    }
  }, [gridColumnApi, gridApi]);

  const onGridReady = (params: GridReadyEvent) => {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);
  };

  const gridOptions = {
  }
  const onSelectionChanged = () => {
    const selectedRows = gridApi?.getSelectedRows();
    setGridEvent({ rowSelectedParent: selectedRows })
  }

  function currencyFormatter(params: any) {
    var sansDec = params.value.toFixed(0);
    var formatted = sansDec.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return '$' + formatted;
  }

  return (
    <div style={{ height: "100%" }}>
      <div
        className="ag-theme-balham-dark"
        style={{ width: "auto", height: "100%", minHeight: 200 }}
      >
        <Typography variant="h6" display="inline" > Parent Orders</Typography>
        <Button style={{ margin: "0px 25px" }} onClick={handleClick_ClearFilters} size="small" variant="text">RESET FILTERS</Button>
        <AgGridReact
          onSelectionChanged={onSelectionChanged}
          rowSelection="single"
          gridOptions={gridOptions}
          rowData={rowData}
          onGridReady={onGridReady}
          suppressMenuHide={true}
          getRowNodeId={(x) => x.parentId}
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
