import React, { useState, useEffect } from "react";
import { AgGridColumn, AgGridReact } from "ag-grid-react";
import orderService, { IExecutionOrder, dummyExecutionOrder, IOrderUpdateEvent } from "../../services/OrderService";
import { useGridEventContext } from '../../Context/GridEventContext';
import { ColumnApi, GridApi, GridReadyEvent, Column } from "ag-grid-community";
import { Button, Checkbox, FormControlLabel, Typography } from '@material-ui/core';

import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-balham-dark.css";

export function ExecutionComponent() {
  const [rowData, setRowData] = useState<IExecutionOrder[]>();

  const [gridApi, setGridApi] = useState<GridApi>();
  const [gridColumnApi, setGridColumnApi] = useState<ColumnApi>();
  const [columns, setColumns] = useState<{ field: string }[]>();
  const { gridEvent } = useGridEventContext();
  const [filterOrdStatus, setFilterOrdStatus] = useState([{ filter: "new", checked: false }, { filter: "partially filled", checked: false }, { filter: "filled", checked: false }]);

  const getCols = () => Object.keys(dummyExecutionOrder).map(key => {
    if (key === "lastPx" || key === "avgPx") {
      return ({
        field: key, valueFormatter: (params: any) => currencyFormatter(params)
      })
    }
    else {
      return ({ field: key })
    }
  });

  useEffect(() => {
    setRowData(orderService.ExecutionOrders);
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

  }, [gridColumnApi]);

  useEffect(() => {
    if (gridApi) {
      const executionAdd = (orderEvent: IOrderUpdateEvent) => {
        const order = orderEvent.payload as IExecutionOrder;
        gridApi?.applyTransaction({ add: [order] });
      };

      orderService.ExecutionAdd.subscribe({ next: executionAdd });
    }

  }, [gridApi])

  useEffect(() => {
    if (gridApi && gridEvent.rowSelectedChild) {
      const filterInstance = gridApi.getFilterInstance("childId");
      if (filterInstance) {
        filterInstance.setModel({ type: "equals", filter: gridEvent.rowSelectedChild[0].childId, filterType: "text" });
        gridApi.onFilterChanged();
      }
    }

  }, [gridApi, gridEvent])

  useEffect(() => {
    if (!gridApi)
      return;
    const filterInstance = gridApi.getFilterInstance("ordStatus");
    if (!filterInstance)
      return;

    const trueFilters = filterOrdStatus.filter(x => x.checked);
    if (!trueFilters.length) {
      filterInstance.setModel(null);
    }
    else if (trueFilters.length === 1) {
      filterInstance.setModel({ type: "equals", filter: trueFilters[0].filter, filterType: "text" })

    }
    else if (trueFilters.length === 2) {
      const condition1 = { type: "equals", filter: trueFilters[0].filter, filterType: "text" };
      const condition2 = { type: "equals", filter: trueFilters[1].filter, filterType: "text" };
      const model = {
        filterType: "text",
        operator: "OR",
        condition1,
        condition2,
      }
      filterInstance.setModel(model)
    }

    //ag-grid community (free version) cannot apply more than 2 filters on same column
    else if (trueFilters.length > 2) {
      filterInstance.setModel(null);
      const resetFilter = filterOrdStatus.map(x => ({ ...x, checked: false }));
      setFilterOrdStatus(resetFilter);
    }

    gridApi.onFilterChanged();


  }, [gridApi, filterOrdStatus])

  const handleClick_ClearFilters = () => gridApi?.setFilterModel(null);

  const onGridReady = (params: GridReadyEvent) => {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);
  };

  const filterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;
    const data = filterOrdStatus.map(x => x.filter === name ? ({ ...x, checked }) : x);
    setFilterOrdStatus(data);
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
        style={{ width: "auto", height: "100%", minHeight: 400 }}
      >
        <Typography variant="h6" display="inline" > Executions</Typography>
        <Button style={{ margin: "0px 25px" }} onClick={handleClick_ClearFilters} size="small" variant="text">RESET FILTERS</Button>

        <FormControlLabel control={<Checkbox color="default" name="new" checked={filterOrdStatus[0].checked} onChange={filterChange} />} label="New" />
        <FormControlLabel control={<Checkbox color="default" name="partially filled" checked={filterOrdStatus[1].checked} onChange={filterChange} />} label="Partially Filled" />
        <FormControlLabel control={<Checkbox color="default" name="filled" checked={filterOrdStatus[2].checked} onChange={filterChange} />} label="Filled" />

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
