import React, { useState, useEffect } from "react";
import { AgGridColumn, AgGridReact } from "ag-grid-react";
import orderService, { dummyPositionOrder, IOrderUpdateEvent, IPosition } from '../../services/OrderService';
import realtTimeMarketData from '../../services/RealTimeMarketData';
import { ISecurityMasterService } from '../../services/SecurityMasterService';
import { ColumnApi, GridApi, GridReadyEvent, Column } from "ag-grid-community";
import { Button, Typography } from '@material-ui/core';

import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-balham-dark.css";

export function PositionComponent() {
  const [rowData, setRowData] = useState<IPosition[]>();

  const [gridApi, setGridApi] = useState<GridApi>();
  const [gridColumnApi, setGridColumnApi] = useState<ColumnApi>();
  const [columns, setColumns] = useState<{ field: string }[]>();

  const getCols = () => Object.keys(dummyPositionOrder).map(key => {
    if (key === "price" || key === "position") {
      return ({
        field: key, valueFormatter: (params: any) => currencyFormatter(params)
      })
    }
    else {
      return ({ field: key })
    }
  });

  useEffect(() => {
    setRowData(orderService.Positions);
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

  useEffect(() => {
    let subscription1: any;
    let subscription2: any;
    let subscription3: any;
    if (gridApi) {
      subscription1 = orderService.PositionAdd.subscribe(() => gridApi?.setRowData(orderService.Positions));
      subscription2 = orderService.PositionUpdate.subscribe(() => gridApi.refreshCells());
      subscription3 = orderService.PositionRemove.subscribe(() => gridApi?.setRowData(orderService.Positions));
    }
    return () => {
      subscription1?.unsubscribe();
      subscription2?.unsubscribe();
      subscription3?.unsubscribe();
    }

  }, [gridApi])

  useEffect(() => {
    if (!gridApi)
      return;

    const realtTimeUpdate = (stock: ISecurityMasterService[]) => {
      if (!rowData?.length)
        return;

      gridApi.forEachNode(rowNode => {
        const order: IPosition = rowNode.data;
        const securityFound = stock.find(s => s.SYMBOL === order.symbol);
        if (securityFound) {
          order.price = securityFound.DefaultPrice;
          order.position = order.price * order.quantity;
        }
      });

      gridApi.refreshCells();
    };

    realtTimeMarketData.stockPrices.subscribe(realtTimeUpdate);
  }, [gridApi, rowData])


  const onGridReady = (params: GridReadyEvent) => {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);
  };

  function currencyFormatter(params: any) {
    var sansDec = params.value.toFixed(0);
    var formatted = sansDec.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return '$' + formatted;
  }

  return (
    <div style={{ height: "100%" }}>
      <div
        className="ag-theme-balham-dark"
        style={{ width: "auto", height: "100%", minHeight: 300 }}
      >
        <Typography variant="h6" display="inline" >Positions</Typography>
        <AgGridReact
          immutableData={true}
          rowSelection="single"
          rowData={rowData}
          onGridReady={onGridReady}
          suppressMenuHide={true}
          getRowNodeId={(pos) => pos.positionId}
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
