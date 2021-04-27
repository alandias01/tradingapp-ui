import React, { useState, useEffect } from "react";
import { Grid, FormControl, Card, CardHeader, CardContent, TextField, makeStyles, createStyles, Theme, Button, Select, InputLabel, MenuItem, Typography } from "@material-ui/core";
import { PositionComponent } from './PositionComponent';
export const DashboardComponent = () => {

  return (
    <div style={{ height: "100%" }}>
      Dashboard
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">POSITIONS</Typography>
              <Typography variant="h1">3</Typography>

            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">CHILD ORDERS</Typography>
              <Typography variant="h1">20</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">EXECUTIONS</Typography>
              <Typography variant="h1">50</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <div style={{ height: "74%" }}>
        <PositionComponent />
      </div>
    </div >);
}