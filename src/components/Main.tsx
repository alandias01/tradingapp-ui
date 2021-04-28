import React, { useState } from "react";
import {
  createMuiTheme,
  ThemeProvider,
  Grid,
  CssBaseline,
  makeStyles
} from "@material-ui/core";

import Color from "color";
import { SelectedSecurityChart } from "./SelectedSecurityChart";
import { CreateOrder } from "./CreateOrder";
import { SelectSecurityComponent } from "./SelectSecurityComponent";
import { TopBar } from './TopBar';
import { SelectedSecurityProvider } from '../Context/SelectedSecurityContext';
import { GridEventProvider } from '../Context/GridEventContext';
import { OrderGridComponent } from './OrderGrid/OrderGirdComponent';
import { DashboardComponent } from './Dashboard/DashboardComponent'

const paperColor = Color("#394873").alpha(0.3).string();

export enum ViewType {
  ORDERS = "ORDERS",
  DASHBOARD = "DASHBOARD"
}

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
  const [view, setView] = useState<ViewType>(ViewType.ORDERS);


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
                    <CreateOrder view={view} />
                  </Grid>
                  <Grid item xs={12}>
                    <SelectedSecurityChart />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} sm={8} className={classes.gridRightMax}>
                {view === ViewType.ORDERS ? <OrderGridComponent /> : <DashboardComponent />}
              </Grid>
              {/* <Grid item xs={12} sm={4} className={classes.root}></Grid> */}
            </Grid>
          </div>
        </GridEventProvider>
      </SelectedSecurityProvider>
    </ThemeProvider>
  );
}
