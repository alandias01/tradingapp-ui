import React, { useState, useEffect } from "react";
import { Grid, Divider, FormControl, Card, CardHeader, CardContent, TextField, makeStyles, createStyles, Theme, Button, Select, InputLabel, MenuItem, Typography } from "@material-ui/core";
import orderService, { IOrderUpdateEvent, IPosition } from '../../services/OrderService';

const getPosValue = (): string => {
  if (!orderService.Positions.length)
    return "$0";
  const sum = orderService.Positions.map(x => x.position).reduce((x, y) => x + y);
  return '$' + sum;
}

export const SummaryComponent = () => {
  const [positionCount, setPositionCount] = useState(orderService.Positions.length);
  const [positionValue, setPositionValue] = useState(getPosValue());

  useEffect(() => {
    orderService.PositionAdd.subscribe(() => {
      setPositionCount(orderService.Positions.length);
    });
    orderService.PositionRemove.subscribe(() => {
      setPositionCount(orderService.Positions.length);
    });
  }, [])

  return (
    <div>
      Dashboard
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <Card square elevation={3}>
            <CardContent>
              <Typography variant="h6">POSITIONS</Typography>
              <Typography variant="h1">{positionCount}</Typography>
            </CardContent>
            <Divider />
            <CardContent>
              <Typography variant="subtitle2">Position value:{positionValue}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card square elevation={3}>
            <CardContent>
              <Typography variant="h6">CHILD ORDERS</Typography>
              <Typography variant="h1">{positionCount}</Typography>
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
              <Typography variant="h6">EXECUTIONS</Typography>
              <Typography variant="h1">{positionCount}</Typography>
            </CardContent>
            <Divider />
            <CardContent>
              <Typography variant="subtitle2">Value: $0</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

    </div>
  )
}