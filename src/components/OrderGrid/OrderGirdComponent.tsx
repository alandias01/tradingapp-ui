/*
Parent Order
When select order, populate Child orders

Child Order
Show all orders
When select order, populate executions

Execution
Show all executions
*/

import React from 'react';
import {
  Grid
} from "@material-ui/core";

import { ParentOrderComponent } from './ParentOrderComponent';
import { ChildOrderComponent } from './ChildOrderComponent';
import { ExecutionComponent } from './ExecutionComponent';

export function OrderGridComponent() {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <ParentOrderComponent />
      </Grid>
      <Grid item xs={12}>
        <ChildOrderComponent />
      </Grid>
      <Grid item xs={12}>
        <ExecutionComponent />
      </Grid>
    </Grid>
  );
}