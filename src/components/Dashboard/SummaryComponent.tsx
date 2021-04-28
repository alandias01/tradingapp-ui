import React, { useState, useEffect } from "react";
import { Grid, Divider, FormControl, Card, CardHeader, CardContent, TextField, makeStyles, createStyles, Theme, Button, Select, InputLabel, MenuItem, Typography } from "@material-ui/core";
import orderService, { IOrderUpdateEvent, IPosition } from '../../services/OrderService';
import { PositionChartComponent } from './PositionChartComponent'
import { OrderChartComponent } from './OrderChartComponent';

const getPosValue = (): string => {
  if (!orderService.Positions.length)
    return "$0";
  const sum = orderService.Positions.map(x => x.position).reduce((x, y) => x + y);
  return '$' + sum;
}

export const SummaryComponent = () => {
  const [positionCount, setPositionCount] = useState(orderService.Positions.length);
  const [parentOrderCount, setParentOrderCount] = useState(orderService.ParentOrders.length);
  const [childOrderCount, setChildOrderCount] = useState(orderService.ChildOrders.length);
  const [executionOrderCount, setExecutionOrderCount] = useState(orderService.ExecutionOrders.length);

  useEffect(() => {
    orderService.PositionAdd.subscribe(() => {
      setPositionCount(orderService.Positions.length);
    });
    orderService.PositionRemove.subscribe(() => {
      setPositionCount(orderService.Positions.length);
    });
    orderService.ParentAdd.subscribe(() => {
      setParentOrderCount(orderService.ParentOrders.length);
    });
    orderService.ChildAdd.subscribe(() => {
      setChildOrderCount(orderService.ChildOrders.length);
    });
    orderService.ExecutionAdd.subscribe(() => {
      setExecutionOrderCount(orderService.ExecutionOrders.length);
    });
  }, [])

  return (
    <div>
      Dashboard
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <Card square elevation={3}>
            <CardContent>
              <PositionChartComponent positions={orderService.Positions} positionCount={positionCount} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card square elevation={3}>
            <CardContent>
              <Typography color="textSecondary" align="right" variant="h6">Parent orders: {parentOrderCount} </Typography>
              <Divider />
              <Typography color="textSecondary" align="right" variant="h6">Child orders: {childOrderCount}</Typography>
              <Divider />
              <Typography color="textSecondary" align="right" variant="h6">Execution orders: {executionOrderCount}</Typography>
            </CardContent>
            <Divider />
            <CardContent>
              <Typography variant="subtitle2">Value: $0</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card square elevation={3}>
            <CardContent>
              <OrderChartComponent
                parentOrderCount={parentOrderCount}
                childOrderCount={childOrderCount}
                executionOrderCount={executionOrderCount}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

    </div>
  )
}