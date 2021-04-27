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
import { CreateOrder } from "./CreateOrder";
import { SelectSecurityComponent } from "./SelectSecurityComponent";
import { TopBar } from './TopBar';
import { SelectedSecurityProvider } from '../Context/SelectedSecurityContext';
import { GridEventProvider } from '../Context/GridEventContext';
import { OrderGridComponent } from './OrderGrid/OrderGirdComponent';
import { PositionComponent } from './Dashboard/PositionComponent'

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
    },
    MuiOutlinedInput: {
      input: {
        padding: "8px 14px"
      }
    }
  }
});

const gridLeftMaxWidth = 300;

const useStyleGrid = makeStyles(() => ({
  root: {
    flexGrow: 1
  },
  gridLeftMax: {
    "@media (min-width: 600px)": {
      maxWidth: `${gridLeftMaxWidth}px`
    }
  },
  gridRightMax: {
    "@media (min-width: 600px)": {
      maxWidth: `calc(100% - ${gridLeftMaxWidth - 100}px)`,
      flexGrow: 1
    }
  }
}));

export function Main() {
  const classes = useStyleGrid();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [view, setView] = useState("orders");

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SelectedSecurityProvider>
        <GridEventProvider>
          <TopBar setDrawerOpen={setDrawerOpen} setView={setView} />
          <div style={{ margin: 20 }}>
            <Grid container spacing={2} alignItems="stretch">
              <Grid item xs={12} sm={4} className={classes.gridLeftMax}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <SelectSecurityComponent />
                  </Grid>
                  <Grid item xs={12}>
                    <CreateOrder />
                  </Grid>
                  <Grid item xs={12}>
                    <Level2DataComponent />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} sm={8} className={classes.gridRightMax}>
                {view === "orders" ? <OrderGridComponent /> : <PositionComponent />}
              </Grid>
              {/* <Grid item xs={12} sm={4} className={classes.root}></Grid> */}
            </Grid>
          </div>
        </GridEventProvider>
      </SelectedSecurityProvider>
    </ThemeProvider>
  );
}
