import React from "react";
import {
  createMuiTheme,
  ThemeProvider,
  Grid,
  CssBaseline,
  makeStyles
} from "@material-ui/core";

import Color from "color";
import { Level2DataComponent } from "./Level2DataComponent";
import { PositionComponent } from "./PositionComponent";
import { CreateOrder } from "./CreateOrder";

const paperColor = Color("#394873").alpha(0.3).string();

const theme = createMuiTheme({
  palette: {
    type: "dark",
    primary: {
      main: "#394873"
    },
    secondary: {
      main: "#303556"
    },
    background: {
      default: "#222741",
      // paper: "#394873"
      paper: paperColor
    }
  }
});

const useStyleGrid = makeStyles(() => ({
  root: {
    flexGrow: 1
  }
}));

export function Main() {
  const classes = useStyleGrid();
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div style={{ margin: 20 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <Level2DataComponent />
          </Grid>
          <Grid item xs={12} sm={8}>
            <PositionComponent />
          </Grid>
          <Grid item xs={12} sm={4} className={classes.root}>
            <CreateOrder />
          </Grid>
        </Grid>
      </div>
    </ThemeProvider>
  );
}
