import React, { useState } from "react";
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
import { SelectSecurityComponent } from "./SelectSecurityComponent";
import { TopBar } from './TopBar';

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
      paper: "#303556"
      //paper: paperColor
    }
  },
  overrides: {
    MuiToolbar: {
      regular: {
        '@media (min-width: 600px)': {
          minHeight: "35px"
        }
      }
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
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <TopBar setDrawerOpen={setDrawerOpen} />
      <div style={{ margin: 20 }}>
        <Grid container spacing={2} alignItems="stretch">
          <Grid item xs={12} sm={4}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <SelectSecurityComponent />
              </Grid>
              <Grid item xs={12}>
                <Level2DataComponent />
              </Grid>
              <Grid item xs={12}>
                <CreateOrder />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={8}>
            <PositionComponent />
          </Grid>
          <Grid item xs={12} sm={4} className={classes.root}></Grid>
        </Grid>
      </div>
    </ThemeProvider>
  );
}
